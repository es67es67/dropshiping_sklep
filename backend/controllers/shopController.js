const Shop = require('../models/shopModel');
const User = require('../models/userModel');
const Location = require('../models/locationModel');
const Notification = require('../models/notificationModel');
const Product = require('../models/productModel');

// Tworzenie sklepu
exports.createShop = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      location,
      address,
      coordinates,
      phone,
      email,
      website,
      categories,
      tags,
      openingHours,
      paymentMethods,
      deliveryOptions
    } = req.body;
    
    const owner = req.userId;
    
    // Obsługa lokalizacji - jeśli location to string (nazwa miasta), znajdź lub utwórz lokalizację
    let locationId = location;
    if (typeof location === 'string' && location.trim()) {
      try {
        // Sprawdź czy lokalizacja już istnieje
        let existingLocation = await Location.findOne({ name: location.trim() });
        
        if (!existingLocation) {
          // Utwórz nową lokalizację
          existingLocation = new Location({
            name: location.trim(),
            type: 'city',
            description: `Miasto ${location.trim()}`,
            isActive: true
          });
          await existingLocation.save();
        }
        
        locationId = existingLocation._id;
      } catch (locationError) {
        console.error('Błąd podczas obsługi lokalizacji:', locationError);
        // Jeśli nie można utworzyć/znaleźć lokalizacji, ustaw jako null
        locationId = null;
      }
    }
    
    const shop = new Shop({ 
      name, 
      description, 
      owner,
      location: locationId,
      address,
      coordinates,
      phone,
      email,
      website,
      categories,
      tags,
      openingHours,
      paymentMethods,
      deliveryOptions
    });
    
    await shop.save();
    
    const populatedShop = await Shop.findById(shop._id)
      .populate('owner', 'username firstName lastName avatar')
      .populate('location', 'name');
    
    res.status(201).json(populatedShop);
  } catch (err) {
    console.error('Błąd podczas tworzenia sklepu:', err);
    res.status(500).json({ error: err.message });
  }
};

// Pobieranie sklepów użytkownika
exports.getUserShops = async (req, res) => {
  try {
    const shops = await Shop.find({ owner: req.userId })
      .populate('owner', 'username firstName lastName avatar')
      .populate('location', 'name')
      .sort({ createdAt: -1 });
    res.json(shops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Pobieranie konkretnego sklepu
exports.getShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id)
      .populate('owner', 'username firstName lastName avatar')
      .populate('location', 'name')
      .populate('followers', 'username firstName lastName avatar')
      .populate('reviews.user', 'username firstName lastName avatar');
    
    if (!shop) {
      return res.status(404).json({ error: 'Sklep nie został znaleziony' });
    }
    
    // Pobierz produkty sklepu
    const products = await Product.find({ shop: shop._id })
      .sort({ createdAt: -1 })
      .limit(20); // Ogranicz do 20 najnowszych produktów
    
    // Aktualizuj statystyki produktów
    shop.stats.totalProducts = products.length;
    
    // Zwiększ licznik wyświetleń
    shop.stats.totalViews++;
    await shop.save();
    
    // Dodaj produkty do odpowiedzi
    const shopWithProducts = {
      ...shop.toObject(),
      products: products
    };
    
    res.json(shopWithProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Aktualizacja sklepu
exports.updateShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    
    if (!shop) {
      return res.status(404).json({ error: 'Sklep nie został znaleziony' });
    }
    
    // Sprawdź czy użytkownik jest właścicielem
    if (shop.owner.toString() !== req.userId) {
      return res.status(403).json({ error: 'Nie masz uprawnień do edycji tego sklepu' });
    }
    
    const updateFields = req.body;
    
    // Obsługa lokalizacji - jeśli location to string (nazwa miasta), znajdź lub utwórz lokalizację
    if (updateFields.location && typeof updateFields.location === 'string' && updateFields.location.trim()) {
      try {
        // Sprawdź czy lokalizacja już istnieje
        let existingLocation = await Location.findOne({ name: updateFields.location.trim() });
        
        if (!existingLocation) {
          // Utwórz nową lokalizację
          existingLocation = new Location({
            name: updateFields.location.trim(),
            type: 'city',
            description: `Miasto ${updateFields.location.trim()}`,
            isActive: true
          });
          await existingLocation.save();
        }
        
        updateFields.location = existingLocation._id;
      } catch (locationError) {
        console.error('Błąd podczas obsługi lokalizacji:', locationError);
        // Jeśli nie można utworzyć/znaleźć lokalizacji, usuń pole location
        delete updateFields.location;
      }
    }
    
    Object.keys(updateFields).forEach(key => {
      if (key !== 'owner' && key !== '_id') {
        shop[key] = updateFields[key];
      }
    });
    
    await shop.save();
    
    const updatedShop = await Shop.findById(shop._id)
      .populate('owner', 'username firstName lastName avatar')
      .populate('location', 'name');
    
    res.json(updatedShop);
  } catch (err) {
    console.error('Błąd podczas aktualizacji sklepu:', err);
    res.status(500).json({ error: err.message });
  }
};

// Usuwanie sklepu
exports.deleteShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    
    if (!shop) {
      return res.status(404).json({ error: 'Sklep nie został znaleziony' });
    }
    
    if (shop.owner.toString() !== req.userId) {
      return res.status(403).json({ error: 'Nie masz uprawnień do usunięcia tego sklepu' });
    }
    
    await Shop.findByIdAndDelete(req.params.id);
    res.json({ message: 'Sklep został usunięty' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Dodawanie recenzji
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const shop = await Shop.findById(req.params.id);
    
    if (!shop) {
      return res.status(404).json({ error: 'Sklep nie został znaleziony' });
    }
    
    await shop.addReview(req.userId, rating, comment);
    
    // Utwórz powiadomienie dla właściciela sklepu
    if (shop.owner.toString() !== req.userId) {
      const notification = new Notification({
        recipient: shop.owner,
        sender: req.userId,
        type: 'review',
        shop: shop._id,
        message: 'dodał recenzję do Twojego sklepu'
      });
      await notification.save();
    }
    
    const updatedShop = await Shop.findById(shop._id)
      .populate('owner', 'username firstName lastName avatar')
      .populate('reviews.user', 'username firstName lastName avatar');
    
    res.json(updatedShop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obserwowanie sklepu
exports.toggleFollow = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    
    if (!shop) {
      return res.status(404).json({ error: 'Sklep nie został znaleziony' });
    }
    
    await shop.toggleFollow(req.userId);
    
    // Utwórz powiadomienie dla właściciela sklepu
    if (shop.owner.toString() !== req.userId) {
      const isFollowing = shop.followers.includes(req.userId);
      const notification = new Notification({
        recipient: shop.owner,
        sender: req.userId,
        type: isFollowing ? 'follow' : 'unfollow',
        shop: shop._id,
        message: isFollowing ? 'zaczął obserwować Twój sklep' : 'przestał obserwować Twój sklep'
      });
      await notification.save();
    }
    
    const updatedShop = await Shop.findById(shop._id)
      .populate('owner', 'username firstName lastName avatar')
      .populate('followers', 'username firstName lastName avatar');
    
    res.json(updatedShop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Dodawanie story
exports.addStory = async (req, res) => {
  try {
    const { content, media, type } = req.body;
    const shop = await Shop.findById(req.params.id);
    
    if (!shop) {
      return res.status(404).json({ error: 'Sklep nie został znaleziony' });
    }
    
    if (shop.owner.toString() !== req.userId) {
      return res.status(403).json({ error: 'Nie masz uprawnień do dodawania stories do tego sklepu' });
    }
    
    await shop.addStory(content, media, type);
    
    const updatedShop = await Shop.findById(shop._id);
    res.json(updatedShop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Rozpoczęcie live stream
exports.startLiveStream = async (req, res) => {
  try {
    const { title, description, products } = req.body;
    const shop = await Shop.findById(req.params.id);
    
    if (!shop) {
      return res.status(404).json({ error: 'Sklep nie został znaleziony' });
    }
    
    if (shop.owner.toString() !== req.userId) {
      return res.status(403).json({ error: 'Nie masz uprawnień do prowadzenia live stream w tym sklepie' });
    }
    
    await shop.startLiveStream(title, description, products);
    
    const updatedShop = await Shop.findById(shop._id);
    res.json(updatedShop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Zakończenie live stream
exports.endLiveStream = async (req, res) => {
  try {
    const { streamId } = req.params;
    const shop = await Shop.findById(req.params.id);
    
    if (!shop) {
      return res.status(404).json({ error: 'Sklep nie został znaleziony' });
    }
    
    if (shop.owner.toString() !== req.userId) {
      return res.status(403).json({ error: 'Nie masz uprawnień do kończenia live stream w tym sklepie' });
    }
    
    await shop.endLiveStream(streamId);
    
    const updatedShop = await Shop.findById(shop._id);
    res.json(updatedShop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Dodawanie wydarzenia
exports.addEvent = async (req, res) => {
  try {
    const { title, description, startDate, endDate, type } = req.body;
    const shop = await Shop.findById(req.params.id);
    
    if (!shop) {
      return res.status(404).json({ error: 'Sklep nie został znaleziony' });
    }
    
    if (shop.owner.toString() !== req.userId) {
      return res.status(403).json({ error: 'Nie masz uprawnień do dodawania wydarzeń do tego sklepu' });
    }
    
    await shop.addEvent(title, description, startDate, endDate, type);
    
    const updatedShop = await Shop.findById(shop._id);
    res.json(updatedShop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Wyszukiwanie sklepów
exports.searchShops = async (req, res) => {
  try {
    const { q, location, category, rating, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    let query = { isActive: true };
    
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ];
    }
    
    if (location) {
      query.location = location;
    }
    
    if (category) {
      query.categories = { $in: [category] };
    }
    
    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }
    
    const shops = await Shop.find(query)
      .populate('owner', 'username firstName lastName avatar')
      .populate('location', 'name')
      .sort({ rating: -1, totalReviews: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Shop.countDocuments(query);
    
    res.json({
      shops,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalShops: total
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Upload zdjęć sklepu
exports.uploadImages = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    
    if (!shop) {
      return res.status(404).json({ error: 'Sklep nie został znaleziony' });
    }
    
    if (shop.owner.toString() !== req.userId) {
      return res.status(403).json({ error: 'Nie masz uprawnień do uploadu zdjęć do tego sklepu' });
    }
    
    const uploadedFiles = req.files;
    const imageUrls = [];
    
    if (uploadedFiles.logo) {
      shop.logo = `/uploads/${uploadedFiles.logo[0].filename}`;
    }
    
    if (uploadedFiles.coverImage) {
      shop.coverImage = `/uploads/${uploadedFiles.coverImage[0].filename}`;
    }
    
    if (uploadedFiles.images) {
      uploadedFiles.images.forEach(file => {
        imageUrls.push(`/uploads/${file.filename}`);
      });
      shop.images = [...shop.images, ...imageUrls];
    }
    
    await shop.save();
    
    const updatedShop = await Shop.findById(shop._id)
      .populate('owner', 'username firstName lastName avatar')
      .populate('location', 'name');
    
    res.json(updatedShop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Pobieranie statystyk sklepu
exports.getShopStats = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    
    if (!shop) {
      return res.status(404).json({ error: 'Sklep nie został znaleziony' });
    }
    
    if (shop.owner.toString() !== req.userId) {
      return res.status(403).json({ error: 'Nie masz uprawnień do przeglądania statystyk tego sklepu' });
    }
    
    res.json(shop.stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
