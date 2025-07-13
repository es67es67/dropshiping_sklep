const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');

// Pobieranie koszyka użytkownika
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.userId, status: 'active' })
      .populate({
        path: 'items.product',
        select: 'name price originalPrice images mainImage stock isActive shop',
        populate: {
          path: 'shop',
          select: 'name logo'
        }
      });

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

    res.json({
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

// Dodawanie produktu do koszyka
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, options = [] } = req.body;

    // Sprawdź czy produkt istnieje i jest aktywny
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ error: 'Produkt nie został znaleziony lub jest niedostępny' });
    }

    // Sprawdź stan magazynowy
    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Niewystarczający stan magazynowy' });
    }

    let cart = await Cart.findOne({ user: req.userId, status: 'active' });
    if (!cart) {
      cart = new Cart({ user: req.userId, items: [] });
    }

    await cart.addItem(productId, quantity, options);

    // Pobierz zaktualizowany koszyk
    cart = await Cart.findById(cart._id)
      .populate({
        path: 'items.product',
        select: 'name price originalPrice images mainImage stock isActive shop',
        populate: {
          path: 'shop',
          select: 'name logo'
        }
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

// Pobieranie podsumowania koszyka
exports.getCartSummary = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId, status: 'active' });
    
    if (!cart || cart.items.length === 0) {
      return res.json({
        itemCount: 0,
        subtotal: 0,
        discount: 0,
        shipping: 0,
        total: 0
      });
    }

    res.json({
      itemCount: cart.getItemCount(),
      subtotal: cart.getSubtotal(),
      discount: cart.getDiscount(),
      shipping: cart.getShippingCost(),
      total: cart.getTotal()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 