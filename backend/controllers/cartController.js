const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const MarketplaceProduct = require('../models/marketplaceProductModel');
const User = require('../models/userModel');

// Funkcja do grupowania produktów według sprzedawców
const groupItemsBySeller = (items) => {
  const sellerGroups = {};
  
  items.forEach(item => {
    if (item.product) {
      let sellerId, sellerName, sellerLogo;
      
      // Sprawdź czy to produkt ze sklepu czy marketplace
      if (item.product.shop) {
        // Produkt ze sklepu
        sellerId = item.product.shop._id.toString();
        sellerName = item.product.shop.name;
        sellerLogo = item.product.shop.logo;
      } else if (item.product.seller) {
        // Produkt marketplace
        sellerId = item.product.seller._id.toString();
        sellerName = item.product.seller.username || item.product.seller.firstName + ' ' + item.product.seller.lastName;
        sellerLogo = item.product.seller.avatar || null;
      } else {
        // Produkt bez sprzedawcy - dodaj do grupy "Inne"
        sellerId = 'other';
        sellerName = 'Inne';
        sellerLogo = null;
      }
      
      if (!sellerGroups[sellerId]) {
        sellerGroups[sellerId] = {
          shopId: sellerId,
          shopName: sellerName,
          shopLogo: sellerLogo,
          items: [],
          subtotal: 0,
          shippingCost: 0,
          itemCount: 0
        };
      }
      
      const itemTotal = item.price * item.quantity;
      sellerGroups[sellerId].items.push(item);
      sellerGroups[sellerId].subtotal += itemTotal;
      sellerGroups[sellerId].itemCount += item.quantity;
    }
  });
  
  // Oblicz koszt dostawy dla każdego sprzedawcy
  Object.values(sellerGroups).forEach(group => {
    // Domyślny koszt dostawy - można dostosować logikę
    if (group.subtotal >= 100) {
      group.shippingCost = 0; // Darmowa dostawa od 100 zł
    } else {
      group.shippingCost = 15.99; // Standardowa dostawa
    }
  });
  
  return Object.values(sellerGroups);
};

// Pobieranie koszyka użytkownika
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.userId, status: 'active' });

    if (!cart) {
      cart = new Cart({ user: req.userId, items: [] });
      await cart.save();
    }

    // Ręcznie zrób populate dla każdego produktu
    for (let item of cart.items) {
      if (item.productType === 'MarketplaceProduct') {
        const MarketplaceProduct = require('../models/marketplaceProductModel');
        item.product = await MarketplaceProduct.findById(item.product)
          .select('name price originalPrice images mainImage stock isActive seller saleType _id')
          .populate({
            path: 'seller',
            select: 'username firstName lastName avatar'
          });
      } else if (item.productType === 'Product') {
        const Product = require('../models/productModel');
        item.product = await Product.findById(item.product)
          .select('name price originalPrice images mainImage stock isActive shop')
          .populate({
            path: 'shop',
            select: 'name logo address city'
          });
      }
    }

    if (!cart) {
      cart = new Cart({ user: req.userId, items: [] });
      await cart.save();
    }

    // Aktualizuj ceny produktów
    for (let item of cart.items) {
      if (item.product && item.product.isActive) {
        item.price = item.product.price;
        item.originalPrice = item.product.originalPrice;
      }
    }
    await cart.save();

    // Debug: sprawdź dane produktów
    console.log('🔍 Debug cart items:', cart.items.map(item => ({
      productId: item.product?._id,
      productType: item.productType,
      hasShop: !!item.product?.shop,
      hasSeller: !!item.product?.seller,
      shopData: item.product?.shop,
      sellerData: item.product?.seller
    })));

    // Grupuj produkty według sprzedawców
    const sellerGroups = groupItemsBySeller(cart.items);
    
    console.log('🔍 Debug sellerGroups:', sellerGroups);
    
    // Oblicz ogólne podsumowanie
    const totalSubtotal = sellerGroups.reduce((sum, group) => sum + group.subtotal, 0);
    const totalShipping = sellerGroups.reduce((sum, group) => sum + group.shippingCost, 0);
    const totalDiscount = cart.getDiscount();
    const total = Math.max(0, totalSubtotal - totalDiscount + totalShipping);

    res.json({
      cart,
      sellerGroups,
      summary: {
        itemCount: cart.getItemCount(),
        subtotal: totalSubtotal,
        discount: totalDiscount,
        shipping: totalShipping,
        total: total,
        sellerCount: sellerGroups.length
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Dodawanie produktu do koszyka
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, options = [] } = req.body;

    // Sprawdź czy produkt istnieje w sklepach lub marketplace
    let product = await Product.findById(productId);
    let isMarketplaceProduct = false;
    
    if (!product) {
      // Sprawdź w marketplace
      product = await MarketplaceProduct.findById(productId);
      isMarketplaceProduct = true;
    }
    
    if (!product || !product.isActive) {
      return res.status(404).json({ error: 'Produkt nie został znaleziony lub jest niedostępny' });
    }

    // Sprawdź stan magazynowy
    if (product.stock < quantity) {
      return res.status(400).json({ 
        error: 'Niewystarczający stan magazynowy',
        available: product.stock,
        requested: quantity
      });
    }

    // Sprawdź czy produkt jest dostępny
    if (!product.isAvailable) {
      return res.status(400).json({ error: 'Produkt jest niedostępny' });
    }

    let cart = await Cart.findOne({ user: req.userId, status: 'active' });
    if (!cart) {
      cart = new Cart({ user: req.userId, items: [] });
    }

    const productType = isMarketplaceProduct ? 'MarketplaceProduct' : 'Product';
    await cart.addItem(productId, quantity, options, productType);

    // Pobierz zaktualizowany koszyk
    cart = await Cart.findById(cart._id)
      .populate({
        path: 'items.product',
        select: 'name price originalPrice images mainImage stock isActive shop seller',
        populate: [
          {
            path: 'shop',
            select: 'name logo'
          },
          {
            path: 'seller',
            select: 'username firstName lastName'
          }
        ]
      });

    res.json({
      message: 'Produkt dodany do koszyka',
      cart,
      summary: {
        itemCount: cart.getItemCount(),
        subtotal: cart.getSubtotal(),
        discount: cart.getDiscount(),
        shipping: cart.getShippingCost(),
        total: cart.getTotal()
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Aktualizacja ilości produktu w koszyku
exports.updateQuantity = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ error: 'Ilość musi być większa od 0' });
    }

    const cart = await Cart.findOne({ user: req.userId, status: 'active' });
    if (!cart) {
      return res.status(404).json({ error: 'Koszyk nie został znaleziony' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Produkt nie został znaleziony w koszyku' });
    }

    // Sprawdź stan magazynowy
    const product = await Product.findById(item.product);
    if (product && product.stock < quantity) {
      return res.status(400).json({ error: 'Niewystarczający stan magazynowy' });
    }

    await cart.updateQuantity(itemId, quantity);

    res.json({
      message: 'Ilość zaktualizowana',
      cart,
      summary: {
        itemCount: cart.getItemCount(),
        subtotal: cart.getSubtotal(),
        discount: cart.getDiscount(),
        shipping: cart.getShippingCost(),
        total: cart.getTotal()
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Usuwanie produktu z koszyka
exports.removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.userId, status: 'active' });
    if (!cart) {
      return res.status(404).json({ error: 'Koszyk nie został znaleziony' });
    }

    await cart.removeItem(itemId);

    res.json({
      message: 'Produkt usunięty z koszyka',
      cart,
      summary: {
        itemCount: cart.getItemCount(),
        subtotal: cart.getSubtotal(),
        discount: cart.getDiscount(),
        shipping: cart.getShippingCost(),
        total: cart.getTotal()
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Czyszczenie koszyka
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId, status: 'active' });
    if (!cart) {
      return res.status(404).json({ error: 'Koszyk nie został znaleziony' });
    }

    await cart.clear();

    res.json({
      message: 'Koszyk wyczyszczony',
      cart,
      summary: {
        itemCount: 0,
        subtotal: 0,
        discount: 0,
        shipping: 0,
        total: 0
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Aplikowanie kuponu
exports.applyCoupon = async (req, res) => {
  try {
    const { couponCode } = req.body;

    const cart = await Cart.findOne({ user: req.userId, status: 'active' });
    if (!cart) {
      return res.status(404).json({ error: 'Koszyk nie został znaleziony' });
    }

    if (cart.items.length === 0) {
      return res.status(400).json({ error: 'Koszyk jest pusty' });
    }

    // TODO: Sprawdź kupon w bazie danych
    // Na razie symulacja
    if (couponCode === 'WELCOME10') {
      await cart.applyCoupon(couponCode);
      res.json({
        message: 'Kupon zastosowany',
        cart,
        summary: {
          itemCount: cart.getItemCount(),
          subtotal: cart.getSubtotal(),
          discount: cart.getDiscount(),
          shipping: cart.getShippingCost(),
          total: cart.getTotal()
        }
      });
    } else {
      res.status(400).json({ error: 'Nieprawidłowy kod kuponu' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Usuwanie kuponu
exports.removeCoupon = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId, status: 'active' });
    if (!cart) {
      return res.status(404).json({ error: 'Koszyk nie został znaleziony' });
    }

    await cart.removeCoupon();

    res.json({
      message: 'Kupon usunięty',
      cart,
      summary: {
        itemCount: cart.getItemCount(),
        subtotal: cart.getSubtotal(),
        discount: cart.getDiscount(),
        shipping: cart.getShippingCost(),
        total: cart.getTotal()
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Aktualizacja adresu dostawy
exports.updateShipping = async (req, res) => {
  try {
    const { method, address } = req.body;

    const cart = await Cart.findOne({ user: req.userId, status: 'active' });
    if (!cart) {
      return res.status(404).json({ error: 'Koszyk nie został znaleziony' });
    }

    // Oblicz koszt dostawy na podstawie metody
    let shippingCost = 0;
    switch (method) {
      case 'free':
        shippingCost = 0;
        break;
      case 'standard':
        shippingCost = 15.99;
        break;
      case 'express':
        shippingCost = 29.99;
        break;
      case 'pickup':
        shippingCost = 0;
        break;
      default:
        shippingCost = 15.99;
    }

    cart.shipping = {
      method,
      cost: shippingCost,
      address: address || cart.shipping.address
    };

    await cart.save();

    res.json({
      message: 'Adres dostawy zaktualizowany',
      cart,
      summary: {
        itemCount: cart.getItemCount(),
        subtotal: cart.getSubtotal(),
        discount: cart.getDiscount(),
        shipping: cart.getShippingCost(),
        total: cart.getTotal()
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Usuwanie wszystkich produktów od jednego sprzedawcy
exports.removeSellerItems = async (req, res) => {
  try {
    const { shopId } = req.params;

    const cart = await Cart.findOne({ user: req.userId, status: 'active' })
      .populate({
        path: 'items.product',
        populate: { path: 'shop' }
      });

    if (!cart) {
      return res.status(404).json({ error: 'Koszyk nie został znaleziony' });
    }

    // Usuń wszystkie produkty od danego sprzedawcy
    const originalLength = cart.items.length;
    cart.items = cart.items.filter(item => 
      item.product.shop._id.toString() !== shopId
    );

    if (cart.items.length === originalLength) {
      return res.status(404).json({ error: 'Nie znaleziono produktów od tego sprzedawcy' });
    }

    await cart.save();

    // Pobierz zaktualizowany koszyk z grupowaniem
    const updatedCart = await Cart.findById(cart._id)
      .populate({
        path: 'items.product',
        select: 'name price originalPrice images mainImage stock isActive shop',
        populate: {
          path: 'shop',
          select: 'name logo address city'
        }
      });

    const sellerGroups = groupItemsBySeller(updatedCart.items);
    const totalSubtotal = sellerGroups.reduce((sum, group) => sum + group.subtotal, 0);
    const totalShipping = sellerGroups.reduce((sum, group) => sum + group.shippingCost, 0);
    const totalDiscount = updatedCart.getDiscount();
    const total = Math.max(0, totalSubtotal - totalDiscount + totalShipping);

    res.json({
      message: 'Produkty od sprzedawcy zostały usunięte',
      cart: updatedCart,
      sellerGroups,
      summary: {
        itemCount: updatedCart.getItemCount(),
        subtotal: totalSubtotal,
        discount: totalDiscount,
        shipping: totalShipping,
        total: total,
        sellerCount: sellerGroups.length
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Aktualizacja ilości produktu w grupie sprzedawcy
exports.updateSellerItemQuantity = async (req, res) => {
  try {
    const { shopId, itemId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ error: 'Ilość musi być większa od 0' });
    }

    const cart = await Cart.findOne({ user: req.userId, status: 'active' })
      .populate({
        path: 'items.product',
        populate: { path: 'shop' }
      });

    if (!cart) {
      return res.status(404).json({ error: 'Koszyk nie został znaleziony' });
    }

    // Znajdź produkt w grupie sprzedawcy
    const item = cart.items.find(item => 
      item._id.toString() === itemId && 
      item.product.shop._id.toString() === shopId
    );

    if (!item) {
      return res.status(404).json({ error: 'Produkt nie został znaleziony w tej grupie' });
    }

    // Sprawdź stan magazynowy
    if (item.product.stock < quantity) {
      return res.status(400).json({ error: 'Niewystarczający stan magazynowy' });
    }

    // Aktualizuj ilość
    item.quantity = quantity;
    await cart.save();

    // Pobierz zaktualizowany koszyk z grupowaniem
    const updatedCart = await Cart.findById(cart._id)
      .populate({
        path: 'items.product',
        select: 'name price originalPrice images mainImage stock isActive shop',
        populate: {
          path: 'shop',
          select: 'name logo address city'
        }
      });

    const sellerGroups = groupItemsBySeller(updatedCart.items);
    const totalSubtotal = sellerGroups.reduce((sum, group) => sum + group.subtotal, 0);
    const totalShipping = sellerGroups.reduce((sum, group) => sum + group.shippingCost, 0);
    const totalDiscount = updatedCart.getDiscount();
    const total = Math.max(0, totalSubtotal - totalDiscount + totalShipping);

    res.json({
      message: 'Ilość zaktualizowana',
      cart: updatedCart,
      sellerGroups,
      summary: {
        itemCount: updatedCart.getItemCount(),
        subtotal: totalSubtotal,
        discount: totalDiscount,
        shipping: totalShipping,
        total: total,
        sellerCount: sellerGroups.length
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Pobieranie podsumowania koszyka (liczba produktów)
exports.getCartSummary = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId, status: 'active' });
    
    if (!cart) {
      return res.json({
        itemCount: 0,
        totalItems: 0,
        totalPrice: 0
      });
    }

    const itemCount = cart.items.length;
    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.json({
      itemCount,
      totalItems,
      totalPrice
    });
  } catch (error) {
    console.error('Błąd pobierania podsumowania koszyka:', error);
    res.status(500).json({ error: 'Błąd serwera' });
  }
};

// Aktualizuj stany magazynowe po zakupie
exports.updateStockAfterPurchase = async (req, res) => {
  try {
    const { items } = req.body; // items: [{ productId, quantity, productType }]
    
    const results = [];
    
    for (const item of items) {
      try {
        let product;
        
        if (item.productType === 'MarketplaceProduct') {
          product = await MarketplaceProduct.findById(item.productId);
        } else {
          product = await Product.findById(item.productId);
        }
        
        if (!product) {
          results.push({
            productId: item.productId,
            success: false,
            error: 'Produkt nie znaleziony'
          });
          continue;
        }
        
        // Sprawdź stan magazynowy
        if (product.stock < item.quantity) {
          results.push({
            productId: item.productId,
            success: false,
            error: 'Niewystarczający stan magazynowy',
            available: product.stock,
            requested: item.quantity
          });
          continue;
        }
        
        // Aktualizuj stan magazynowy
        product.stock = Math.max(0, product.stock - item.quantity);
        
        // Jeśli stan magazynowy = 0, oznacz jako niedostępny
        if (product.stock === 0) {
          product.isAvailable = false;
        }
        
        await product.save();
        
        results.push({
          productId: item.productId,
          success: true,
          newStock: product.stock,
          isAvailable: product.isAvailable
        });
        
      } catch (error) {
        results.push({
          productId: item.productId,
          success: false,
          error: error.message
        });
      }
    }
    
    res.json({
      success: true,
      results
    });
    
  } catch (error) {
    console.error('Błąd aktualizacji stanów magazynowych:', error);
    res.status(500).json({ error: 'Błąd serwera' });
  }
}; 