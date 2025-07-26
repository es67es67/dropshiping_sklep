const Message = require('../models/messageModel');
const User = require('../models/userModel');
const Conversation = require('../models/conversationModel');

// Wysyłanie wiadomości
exports.sendMessage = async (req, res) => {
  try {
    const { recipient, content, conversationType = 'user_to_user' } = req.body;
    const sender = req.userId;

    // Sprawdź czy odbiorca istnieje
    const recipientUser = await User.findById(recipient);
    if (!recipientUser) {
      return res.status(404).json({
        success: false,
        error: 'Odbiorca nie został znaleziony'
      });
    }

    // Znajdź lub utwórz konwersację
    let conversation = await Conversation.findOrCreateDirect(sender, recipient);

    // Utwórz wiadomość
    const message = new Message({
      sender,
      recipient,
      content,
      conversationType,
      conversationId: conversation._id
    });

    await message.save();

    // Zaktualizuj konwersację
    await conversation.updateLastMessage(message);

    // Pobierz pełne dane wiadomości
    const fullMessage = await Message.findById(message._id)
      .populate('sender', 'firstName lastName username avatar')
      .populate('recipient', 'firstName lastName username avatar');

    res.status(201).json({
      success: true,
      message: fullMessage,
      conversation: conversation
    });
  } catch (err) {
    console.error('Błąd wysyłania wiadomości:', err);
    res.status(500).json({
      success: false,
      error: 'Błąd wysyłania wiadomości'
    });
  }
};

// Pobieranie wiadomości
exports.getMessages = async (req, res) => {
  try {
    const { conversationId, page = 1, limit = 50 } = req.query;
    const userId = req.userId;
    const skip = (page - 1) * limit;

    let query = {
      $or: [
        { sender: userId },
        { recipient: userId }
      ]
    };

    if (conversationId) {
      query.conversationId = conversationId;
    }

    const messages = await Message.find(query)
      .populate('sender', 'firstName lastName username avatar')
      .populate('recipient', 'firstName lastName username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Message.countDocuments(query);

    res.json({
      success: true,
      messages: messages.reverse(),
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error('Błąd pobierania wiadomości:', err);
    res.status(500).json({
      success: false,
      error: 'Błąd pobierania wiadomości'
    });
  }
};

// Pobieranie konwersacji użytkownika
exports.getConversations = async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const conversations = await Conversation.find({
      'participants.user': userId,
      status: 'active'
    })
    .populate('participants.user', 'firstName lastName username avatar')
    .sort({ lastActivity: -1 })
    .skip(skip)
    .limit(parseInt(limit));

    // Pobierz ostatnią wiadomość dla każdej konwersacji
    const conversationsWithLastMessage = await Promise.all(
      conversations.map(async (conversation) => {
        const lastMessage = await Message.findOne({
          conversationId: conversation._id
        })
        .populate('sender', 'firstName lastName username avatar')
        .sort({ createdAt: -1 })
        .limit(1);

        // Znajdź drugiego uczestnika (nie siebie)
        const otherParticipant = conversation.participants.find(
          p => p.user._id.toString() !== userId
        );

        return {
          ...conversation.toObject(),
          lastMessage: lastMessage,
          otherParticipant: otherParticipant?.user
        };
      })
    );

    const total = await Conversation.countDocuments({
      'participants.user': userId,
      status: 'active'
    });

    res.json({
      success: true,
      conversations: conversationsWithLastMessage,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error('Błąd pobierania konwersacji:', err);
    res.status(500).json({
      success: false,
      error: 'Błąd pobierania konwersacji'
    });
  }
};

// Oznaczanie wiadomości jako przeczytane
exports.markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.userId;

    const message = await Message.findById(messageId);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Wiadomość nie została znaleziona'
      });
    }

    if (message.recipient.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Nie masz uprawnień do oznaczania tej wiadomości jako przeczytanej'
      });
    }

    await message.markAsRead();

    res.json({
      success: true,
      message: 'Wiadomość została oznaczona jako przeczytana'
    });
  } catch (err) {
    console.error('Błąd oznaczania wiadomości jako przeczytanej:', err);
    res.status(500).json({
      success: false,
      error: 'Błąd oznaczania wiadomości jako przeczytanej'
    });
  }
};

// Oznaczanie wszystkich wiadomości w konwersacji jako przeczytane
exports.markConversationAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.userId;

    const conversation = await Conversation.findById(conversationId);
    
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Konwersacja nie została znaleziona'
      });
    }

    const isParticipant = conversation.participants.some(
      p => p.user.toString() === userId
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        error: 'Nie masz uprawnień do tej konwersacji'
      });
    }

    await Message.updateMany(
      {
        conversationId,
        recipient: userId,
        status: { $ne: 'read' }
      },
      {
        status: 'read',
        readAt: new Date()
      }
    );

    // Zresetuj licznik nieprzeczytanych wiadomości w konwersacji
    await conversation.resetUnreadCount();

    res.json({
      success: true,
      message: 'Wszystkie wiadomości zostały oznaczone jako przeczytane'
    });
  } catch (err) {
    console.error('Błąd oznaczania konwersacji jako przeczytanej:', err);
    res.status(500).json({
      success: false,
      error: 'Błąd oznaczania konwersacji jako przeczytanej'
    });
  }
};

// Usuwanie wiadomości
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.userId;

    const message = await Message.findById(messageId);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Wiadomość nie została znaleziona'
      });
    }

    if (message.sender.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Nie masz uprawnień do usunięcia tej wiadomości'
      });
    }

    await message.delete(userId);

    res.json({
      success: true,
      message: 'Wiadomość została usunięta'
    });
  } catch (err) {
    console.error('Błąd usuwania wiadomości:', err);
    res.status(500).json({
      success: false,
      error: 'Błąd usuwania wiadomości'
    });
  }
};

// Edycja wiadomości
exports.editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;
    const userId = req.userId;

    const message = await Message.findById(messageId);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Wiadomość nie została znaleziona'
      });
    }

    if (message.sender.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Nie masz uprawnień do edycji tej wiadomości'
      });
    }

    await message.edit(content);

    const updatedMessage = await Message.findById(messageId)
      .populate('sender', 'firstName lastName username avatar')
      .populate('recipient', 'firstName lastName username avatar');

    res.json({
      success: true,
      message: updatedMessage
    });
  } catch (err) {
    console.error('Błąd edycji wiadomości:', err);
    res.status(500).json({
      success: false,
      error: 'Błąd edycji wiadomości'
    });
  }
};

// Pobieranie nieprzeczytanych wiadomości
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.userId;

    const unreadCount = await Message.countDocuments({
      recipient: userId,
      status: { $ne: 'read' }
    });

    res.json({
      success: true,
      unreadCount
    });
  } catch (err) {
    console.error('Błąd pobierania liczby nieprzeczytanych wiadomości:', err);
    res.status(500).json({
      success: false,
      error: 'Błąd pobierania liczby nieprzeczytanych wiadomości'
    });
  }
};
