const Notification = require('../models/notificationModel');
const User = require('../models/userModel');

// Pobieranie powiadomień użytkownika
exports.getNotifications = async (req, res) => {
  try {
    const { type, status, limit = 50, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    let query = { user: req.userId };
    
    if (type && type !== 'all') {
      query.type = type;
    }
    
    if (status) {
      query.status = status;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .populate('data.productId', 'name images')
      .populate('data.marketplaceProductId', 'name images')
      .populate('data.shopId', 'name logo')
      .populate('data.sellerId', 'username firstName lastName')
      .populate('data.buyerId', 'username firstName lastName');

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ 
      user: req.userId, 
      status: 'unread' 
    });

    res.json({
      notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      unreadCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Oznaczanie powiadomienia jako przeczytane
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: req.userId },
      { status: 'read' },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: 'Powiadomienie nie zostało znalezione' });
    }

    res.json({ message: 'Powiadomienie oznaczone jako przeczytane' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Oznaczanie wszystkich powiadomień jako przeczytane
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.userId, status: 'unread' },
      { status: 'read' }
    );

    res.json({ message: 'Wszystkie powiadomienia oznaczone jako przeczytane' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Usuwanie powiadomienia
exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      user: req.userId
    });

    if (!notification) {
      return res.status(404).json({ error: 'Powiadomienie nie zostało znalezione' });
    }

    res.json({ message: 'Powiadomienie usunięte' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Archiwizowanie powiadomienia
exports.archiveNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: req.userId },
      { status: 'archived' },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: 'Powiadomienie nie zostało znalezione' });
    }

    res.json({ message: 'Powiadomienie zarchiwizowane' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Funkcje pomocnicze do tworzenia powiadomień

// Powiadomienie o nowej ofercie w aukcji
exports.createAuctionBidNotification = async (auctionId, productId, bidderId, bidAmount, sellerId) => {
  try {
    const bidder = await User.findById(bidderId);
    const seller = await User.findById(sellerId);
    
    const notification = new Notification({
      user: sellerId,
      type: 'auction_bid',
      title: 'Nowa oferta w aukcji',
      message: `${bidder.username || bidder.firstName} złożył ofertę ${bidAmount} zł w Twojej aukcji`,
      priority: 'medium',
      data: {
        auctionId,
        productId,
        bidId: bidderId,
        bidAmount,
        buyerId: bidderId,
        buyerName: bidder.username || bidder.firstName,
        url: `/auction/${auctionId}`
      }
    });

    await notification.save();
    return notification;
  } catch (err) {
    console.error('Błąd tworzenia powiadomienia o ofercie:', err);
  }
};

// Powiadomienie o prześcignięciu w aukcji
exports.createAuctionOutbidNotification = async (auctionId, productId, outbidUserId, newBidAmount, previousBidAmount) => {
  try {
    const notification = new Notification({
      user: outbidUserId,
      type: 'auction_outbid',
      title: 'Zostałeś prześcigniony w aukcji',
      message: `Twoja oferta ${previousBidAmount} zł została prześcigniona. Nowa najwyższa oferta: ${newBidAmount} zł`,
      priority: 'high',
      data: {
        auctionId,
        productId,
        bidAmount: newBidAmount,
        oldPrice: previousBidAmount,
        newPrice: newBidAmount,
        url: `/auction/${auctionId}`
      }
    });

    await notification.save();
    return notification;
  } catch (err) {
    console.error('Błąd tworzenia powiadomienia o prześcignięciu:', err);
  }
};

// Powiadomienie o kończeniu aukcji
exports.createAuctionEndingNotification = async (auctionId, productId, userId, timeLeft) => {
  try {
    const notification = new Notification({
      user: userId,
      type: 'auction_ending',
      title: 'Aukcja kończy się wkrótce',
      message: `Aukcja kończy się za ${timeLeft}. Sprawdź czy chcesz złożyć ofertę!`,
      priority: 'high',
      data: {
        auctionId,
        productId,
        timeLeft,
        url: `/auction/${auctionId}`
      }
    });

    await notification.save();
    return notification;
  } catch (err) {
    console.error('Błąd tworzenia powiadomienia o kończeniu aukcji:', err);
  }
};

// Powiadomienie o wygranej aukcji
exports.createAuctionWonNotification = async (auctionId, productId, winnerId, finalPrice) => {
  try {
    const notification = new Notification({
      user: winnerId,
      type: 'auction_won',
      title: 'Gratulacje! Wygrana aukcja',
      message: `Wygrywasz aukcję za ${finalPrice} zł! Sprawdź szczegóły i dokonaj płatności.`,
      priority: 'urgent',
      data: {
        auctionId,
        productId,
        price: finalPrice,
        url: `/auction/${auctionId}/payment`
      }
    });

    await notification.save();
    return notification;
  } catch (err) {
    console.error('Błąd tworzenia powiadomienia o wygranej:', err);
  }
};

// Powiadomienie o przegranej aukcji
exports.createAuctionLostNotification = async (auctionId, productId, loserId, finalPrice) => {
  try {
    const notification = new Notification({
      user: loserId,
      type: 'auction_lost',
      title: 'Aukcja zakończona',
      message: `Aukcja została wygrana przez innego użytkownika za ${finalPrice} zł.`,
      priority: 'medium',
      data: {
        auctionId,
        productId,
        price: finalPrice,
        url: `/auction/${auctionId}`
      }
    });

    await notification.save();
    return notification;
  } catch (err) {
    console.error('Błąd tworzenia powiadomienia o przegranej:', err);
  }
};

// Powiadomienie o nowej propozycji cenowej
exports.createNegotiationOfferNotification = async (negotiationId, productId, buyerId, sellerId, offerAmount) => {
  try {
    const buyer = await User.findById(buyerId);
    
    const notification = new Notification({
      user: sellerId,
      type: 'negotiation_offer',
      title: 'Nowa propozycja cenowa',
      message: `${buyer.username || buyer.firstName} złożył propozycję ${offerAmount} zł za Twój produkt`,
      priority: 'medium',
      data: {
        negotiationId,
        productId,
        offerId: buyerId,
        buyerId,
        buyerName: buyer.username || buyer.firstName,
        price: offerAmount,
        url: `/negotiation/${negotiationId}`
      }
    });

    await notification.save();
    return notification;
  } catch (err) {
    console.error('Błąd tworzenia powiadomienia o propozycji:', err);
  }
};

// Powiadomienie o akceptacji propozycji
exports.createNegotiationAcceptedNotification = async (negotiationId, productId, buyerId, sellerId, finalPrice) => {
  try {
    const seller = await User.findById(sellerId);
    
    const notification = new Notification({
      user: buyerId,
      type: 'negotiation_accepted',
      title: 'Propozycja zaakceptowana!',
      message: `${seller.username || seller.firstName} zaakceptował Twoją propozycję ${finalPrice} zł`,
      priority: 'high',
      data: {
        negotiationId,
        productId,
        sellerId,
        sellerName: seller.username || seller.firstName,
        price: finalPrice,
        url: `/negotiation/${negotiationId}/payment`
      }
    });

    await notification.save();
    return notification;
  } catch (err) {
    console.error('Błąd tworzenia powiadomienia o akceptacji:', err);
  }
};

// Powiadomienie o odrzuceniu propozycji
exports.createNegotiationRejectedNotification = async (negotiationId, productId, buyerId, sellerId) => {
  try {
    const seller = await User.findById(sellerId);
    
    const notification = new Notification({
      user: buyerId,
      type: 'negotiation_rejected',
      title: 'Propozycja odrzucona',
      message: `${seller.username || seller.firstName} odrzucił Twoją propozycję cenową`,
      priority: 'medium',
      data: {
        negotiationId,
        productId,
        sellerId,
        sellerName: seller.username || seller.firstName,
        url: `/negotiation/${negotiationId}`
      }
    });

    await notification.save();
    return notification;
  } catch (err) {
    console.error('Błąd tworzenia powiadomienia o odrzuceniu:', err);
  }
};

// Powiadomienie o spadku ceny
exports.createPriceDropNotification = async (productId, userId, oldPrice, newPrice, productName) => {
  try {
    const notification = new Notification({
      user: userId,
      type: 'price_drop',
      title: 'Spadek ceny produktu',
      message: `Cena produktu "${productName}" spadła z ${oldPrice} zł do ${newPrice} zł`,
      priority: 'medium',
      data: {
        productId,
        oldPrice,
        newPrice,
        productName,
        url: `/product/${productId}`
      }
    });

    await notification.save();
    return notification;
  } catch (err) {
    console.error('Błąd tworzenia powiadomienia o spadku ceny:', err);
  }
};

// Powiadomienie o ponownym dostępności produktu
exports.createBackInStockNotification = async (productId, userId, productName) => {
  try {
    const notification = new Notification({
      user: userId,
      type: 'back_in_stock',
      title: 'Produkt ponownie dostępny',
      message: `Produkt "${productName}" jest ponownie dostępny w sprzedaży`,
      priority: 'medium',
      data: {
        productId,
        productName,
        url: `/product/${productId}`
      }
    });

    await notification.save();
    return notification;
  } catch (err) {
    console.error('Błąd tworzenia powiadomienia o dostępności:', err);
  }
};

// Powiadomienie o przypomnieniu koszyka
exports.createCartReminderNotification = async (userId, cartItemsCount) => {
  try {
    const notification = new Notification({
      user: userId,
      type: 'cart_reminder',
      title: 'Przypomnienie o koszyku',
      message: `Masz ${cartItemsCount} produktów w koszyku. Nie zapomnij o nich!`,
      priority: 'low',
      data: {
        url: '/cart'
      }
    });

    await notification.save();
    return notification;
  } catch (err) {
    console.error('Błąd tworzenia powiadomienia o koszyku:', err);
  }
};

// Powiadomienie o spadku ceny produktu z listy życzeń
exports.createWishlistDropNotification = async (productId, userId, oldPrice, newPrice, productName) => {
  try {
    const notification = new Notification({
      user: userId,
      type: 'wishlist_drop',
      title: 'Spadek ceny w liście życzeń',
      message: `Cena produktu "${productName}" z Twojej listy życzeń spadła z ${oldPrice} zł do ${newPrice} zł`,
      priority: 'medium',
      data: {
        productId,
        oldPrice,
        newPrice,
        productName,
        url: `/product/${productId}`
      }
    });

    await notification.save();
    return notification;
  } catch (err) {
    console.error('Błąd tworzenia powiadomienia o spadku ceny z listy życzeń:', err);
  }
};

// Powiadomienie o podobnym produkcie
exports.createSimilarProductNotification = async (productId, userId, similarProductId, productName, similarProductName) => {
  try {
    const notification = new Notification({
      user: userId,
      type: 'similar_product',
      title: 'Podobny produkt',
      message: `Znaleźliśmy produkt "${similarProductName}" podobny do "${productName}"`,
      priority: 'low',
      data: {
        productId,
        marketplaceProductId: similarProductId,
        productName,
        url: `/product/${similarProductId}`
      }
    });

    await notification.save();
    return notification;
  } catch (err) {
    console.error('Błąd tworzenia powiadomienia o podobnym produkcie:', err);
  }
};

// Powiadomienie o wiadomości od sprzedawcy
exports.createSellerMessageNotification = async (sellerId, buyerId, message, productName) => {
  try {
    const seller = await User.findById(sellerId);
    
    const notification = new Notification({
      user: buyerId,
      type: 'seller_message',
      title: 'Wiadomość od sprzedawcy',
      message: `${seller.username || seller.firstName} wysłał wiadomość dotyczącą produktu "${productName}"`,
      priority: 'medium',
      data: {
        sellerId,
        sellerName: seller.username || seller.firstName,
        productName,
        url: '/messages'
      }
    });

    await notification.save();
    return notification;
  } catch (err) {
    console.error('Błąd tworzenia powiadomienia o wiadomości od sprzedawcy:', err);
  }
};

// Powiadomienie o wiadomości od kupującego
exports.createBuyerMessageNotification = async (buyerId, sellerId, message, productName) => {
  try {
    const buyer = await User.findById(buyerId);
    
    const notification = new Notification({
      user: sellerId,
      type: 'buyer_message',
      title: 'Wiadomość od kupującego',
      message: `${buyer.username || buyer.firstName} wysłał wiadomość dotyczącą produktu "${productName}"`,
      priority: 'medium',
      data: {
        buyerId,
        buyerName: buyer.username || buyer.firstName,
        productName,
        url: '/messages'
      }
    });

    await notification.save();
    return notification;
  } catch (err) {
    console.error('Błąd tworzenia powiadomienia o wiadomości od kupującego:', err);
  }
};
