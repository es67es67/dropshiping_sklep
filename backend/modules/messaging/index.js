const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Message = require('../../models/messageModel');
const User = require('../../models/userModel');
const eventSystem = require('../../core/eventSystem');

// Konfiguracja multer dla uploadu plików
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../../uploads/messages');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|mp3|mp4/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Nieobsługiwany typ pliku'));
    }
  }
});

class MessagingModule {
  constructor() {
    this.router = router;
    this.setupRoutes();
    this.setupEvents();
  }

  setupRoutes() {
    // Pobieranie wszystkich konwersacji (dla adminów)
    router.get('/conversations', async (req, res) => {
      try {
        const { page = 1, limit = 50 } = req.query;
        const skip = (page - 1) * limit;
        
        const conversations = await Message.aggregate([
          {
            $sort: { createdAt: -1 }
          },
          {
            $group: {
              _id: {
                $cond: [
                  { $lt: ['$sender', '$receiver'] },
                  { sender: '$sender', receiver: '$receiver' },
                  { sender: '$receiver', receiver: '$sender' }
                ]
              },
              lastMessage: { $first: '$$ROOT' },
              messageCount: { $sum: 1 }
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: '_id.sender',
              foreignField: '_id',
              as: 'sender'
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: '_id.receiver',
              foreignField: '_id',
              as: 'receiver'
            }
          },
          {
            $unwind: '$sender'
          },
          {
            $unwind: '$receiver'
          },
          {
            $project: {
              _id: 1,
              sender: {
                _id: 1,
                username: 1,
                firstName: 1,
                lastName: 1,
                avatar: 1
              },
              receiver: {
                _id: 1,
                username: 1,
                firstName: 1,
                lastName: 1,
                avatar: 1
              },
              lastMessage: 1,
              messageCount: 1
            }
          },
          {
            $skip: skip
          },
          {
            $limit: parseInt(limit)
          }
        ]);
        
        const total = await Message.aggregate([
          {
            $group: {
              _id: {
                $cond: [
                  { $lt: ['$sender', '$receiver'] },
                  { sender: '$sender', receiver: '$receiver' },
                  { sender: '$receiver', receiver: '$sender' }
                ]
              }
            }
          },
          {
            $count: 'total'
          }
        ]);
        
        res.json({
          conversations,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: total[0]?.total || 0,
            pages: Math.ceil((total[0]?.total || 0) / limit)
          }
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Pobieranie konwersacji użytkownika
    router.get('/conversations/:userId', async (req, res) => {
      try {
        const { userId } = req.params;
        
        // Znajdź wszystkie konwersacje użytkownika
        const conversations = await Message.aggregate([
          {
            $match: {
              $or: [
                { sender: userId },
                { receiver: userId }
              ]
            }
          },
          {
            $sort: { createdAt: -1 }
          },
          {
            $group: {
              _id: {
                $cond: [
                  { $eq: ['$sender', userId] },
                  '$receiver',
                  '$sender'
                ]
              },
              lastMessage: { $first: '$$ROOT' },
              unreadCount: {
                $sum: {
                  $cond: [
                    { 
                      $and: [
                        { $eq: ['$receiver', userId] },
                        { $eq: ['$isRead', false] }
                      ]
                    },
                    1,
                    0
                  ]
                }
              }
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: '_id',
              foreignField: '_id',
              as: 'user'
            }
          },
          {
            $unwind: '$user'
          },
          {
            $project: {
              _id: 1,
              user: {
                _id: 1,
                username: 1,
                firstName: 1,
                lastName: 1,
                avatar: 1,
                isOnline: 1
              },
              lastMessage: 1,
              unreadCount: 1
            }
          }
        ]);
        
        res.json(conversations);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Pobieranie wiadomości z konwersacji
    router.get('/messages/:userId/:otherUserId', async (req, res) => {
      try {
        const { userId, otherUserId } = req.params;
        const { page = 1, limit = 50 } = req.query;
        
        const skip = (page - 1) * limit;
        
        const messages = await Message.find({
          $or: [
            { sender: userId, receiver: otherUserId },
            { sender: otherUserId, receiver: userId }
          ]
        })
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip)
        .populate('sender', 'username firstName lastName avatar')
        .populate('receiver', 'username firstName lastName avatar');
        
        // Oznacz wiadomości jako przeczytane
        await Message.updateMany(
          {
            sender: otherUserId,
            receiver: userId,
            isRead: false
          },
          { isRead: true }
        );
        
        res.json(messages.reverse()); // Odwróć aby najstarsze były pierwsze
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Wysyłanie wiadomości
    router.post('/messages', async (req, res) => {
      try {
        const { senderId, receiverId, content, messageType = 'text' } = req.body;
        
        // Sprawdź czy użytkownicy istnieją
        const [sender, receiver] = await Promise.all([
          User.findById(senderId),
          User.findById(receiverId)
        ]);
        
        if (!sender || !receiver) {
          return res.status(404).json({ error: 'Użytkownik nie znaleziony' });
        }
        
        const message = new Message({
          sender: senderId,
          receiver: receiverId,
          content,
          messageType,
          isRead: false
        });
        
        await message.save();
        
        // Populate dla odpowiedzi
        await message.populate('sender', 'username firstName lastName avatar');
        await message.populate('receiver', 'username firstName lastName avatar');
        
        // Emit event
        eventSystem.emitMessageSent(senderId, receiverId, message._id);
        
        res.status(201).json(message);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Wysyłanie wiadomości z plikiem
    router.post('/messages/with-file', upload.single('file'), async (req, res) => {
      try {
        const { senderId, receiverId, content, messageType = 'file' } = req.body;
        
        if (!req.file) {
          return res.status(400).json({ error: 'Brak pliku' });
        }
        
        const [sender, receiver] = await Promise.all([
          User.findById(senderId),
          User.findById(receiverId)
        ]);
        
        if (!sender || !receiver) {
          return res.status(404).json({ error: 'Użytkownik nie znaleziony' });
        }
        
        const message = new Message({
          sender: senderId,
          receiver: receiverId,
          content: content || `Plik: ${req.file.originalname}`,
          messageType,
          attachments: [{
            filename: req.file.originalname,
            path: req.file.path,
            mimetype: req.file.mimetype,
            size: req.file.size
          }],
          isRead: false
        });
        
        await message.save();
        
        // Populate dla odpowiedzi
        await message.populate('sender', 'username firstName lastName avatar');
        await message.populate('receiver', 'username firstName lastName avatar');
        
        // Emit event
        eventSystem.emitMessageSent(senderId, receiverId, message._id);
        
        res.status(201).json(message);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Oznaczanie wiadomości jako przeczytane
    router.put('/messages/:messageId/read', async (req, res) => {
      try {
        const { messageId } = req.params;
        
        const message = await Message.findByIdAndUpdate(
          messageId,
          { isRead: true },
          { new: true }
        );
        
        if (!message) {
          return res.status(404).json({ error: 'Wiadomość nie znaleziona' });
        }
        
        res.json(message);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Pobieranie pliku
    router.get('/files/:filename', (req, res) => {
      try {
        const { filename } = req.params;
        const filePath = path.join(__dirname, '../../../uploads/messages', filename);
        
        if (!fs.existsSync(filePath)) {
          return res.status(404).json({ error: 'Plik nie znaleziony' });
        }
        
        res.download(filePath);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Usuwanie wiadomości
    router.delete('/messages/:messageId', async (req, res) => {
      try {
        const { messageId } = req.params;
        const { userId } = req.body; // ID użytkownika żądającego usunięcia
        
        const message = await Message.findById(messageId);
        
        if (!message) {
          return res.status(404).json({ error: 'Wiadomość nie znaleziona' });
        }
        
        // Sprawdź czy użytkownik może usunąć wiadomość
        if (message.sender.toString() !== userId) {
          return res.status(403).json({ error: 'Brak uprawnień do usunięcia wiadomości' });
        }
        
        // Usuń pliki załączników
        if (message.attachments && message.attachments.length > 0) {
          message.attachments.forEach(attachment => {
            if (fs.existsSync(attachment.path)) {
              fs.unlinkSync(attachment.path);
            }
          });
        }
        
        await Message.findByIdAndDelete(messageId);
        
        res.json({ message: 'Wiadomość usunięta pomyślnie' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Statystyki wiadomości
    router.get('/stats/:userId', async (req, res) => {
      try {
        const { userId } = req.params;
        
        const [totalMessages, unreadMessages, totalConversations] = await Promise.all([
          Message.countDocuments({
            $or: [
              { sender: userId },
              { receiver: userId }
            ]
          }),
          Message.countDocuments({
            receiver: userId,
            isRead: false
          }),
          Message.distinct('sender', { receiver: userId }).then(senders => 
            Message.distinct('receiver', { sender: userId }).then(receivers => 
              new Set([...senders, ...receivers]).size
            )
          )
        ]);
        
        res.json({
          totalMessages,
          unreadMessages,
          totalConversations
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  }

  setupEvents() {
    // Nasłuchiwanie na wysłane wiadomości
    eventSystem.onMessageSent(async (data) => {
      console.log(`💬 Wiadomość wysłana: ${data.senderId} -> ${data.receiverId}`);
      // Tutaj można dodać powiadomienia push, email, itp.
    });
  }

  async initialize() {
    console.log('💬 Inicjalizacja modułu komunikacji...');
    // Utwórz katalog na pliki jeśli nie istnieje
    const uploadDir = path.join(__dirname, '../../../uploads/messages');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    return true;
  }

  getRoutes() {
    return this.router;
  }
}

module.exports = new MessagingModule(); 