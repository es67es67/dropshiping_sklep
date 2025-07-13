const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');

// Tworzenie zamówienia z koszyka
exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress, billingAddress, paymentMethod, notes } = req.body;

    // Pobierz koszyk użytkownika
    const cart = await Cart.findOne({ user: req.userId, status: 'active' })
      .populate({
        path: 'items.product',
        populate: { path: 'shop' }
      });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Koszyk jest pusty' });
    }

    // Sprawdź dostępność produktów
    for (let item of cart.items) {
      if (!item.product.isActive) {
        return res.status(400).json({ 
          error: `Produkt "${item.product.name}" jest niedostępny` 
        });
      }
      if (item.product.stock < item.quantity) {
        return res.status(400).json({ 
          error: `Niewystarczający stan magazynowy dla "${item.product.name}"` 
        });
      }
    }

    // Przygotuj elementy zamówienia
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
      originalPrice: item.product.originalPrice,
      selectedOptions: item.selectedOptions,
      shop: item.product.shop._id
    }));

    // Utwórz zamówienie
    const order = new Order({
      user: req.userId,
      items: orderItems,
      shipping: {
        method: cart.shipping.method || 'standard',
        cost: cart.shipping.cost || 0,
        address: shippingAddress
      },
      billing: {
        address: billingAddress || shippingAddress,
        sameAsShipping: !billingAddress
      },
      payment: {
        method: paymentMethod,
        amount: cart.getTotal()
      },
      coupon: cart.coupon,
      notes: {
        customer: notes
      }
    });

    // Oblicz ceny
    await order.calculateTotals();

    // Dodaj pierwszy status
    order.statusHistory.push({
      status: 'pending',
      note: 'Zamówienie utworzone'
    });

    await order.save();

    // Zaktualizuj stan magazynowy
    for (let item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity }
      });
    }

    // Oznacz koszyk jako przekonwertowany
    cart.status = 'converted';
    await cart.save();

    // Pobierz pełne zamówienie z danymi
    const fullOrder = await Order.findById(order._id)
      .populate({
        path: 'items.product',
        select: 'name price images mainImage shop',
        populate: { path: 'shop', select: 'name logo' }
      })
      .populate('user', 'firstName lastName email');

    res.status(201).json({
      message: 'Zamówienie utworzone pomyślnie',
      order: fullOrder
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Pobieranie zamówień użytkownika
exports.getUserOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    let query = { user: req.userId };
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate({
        path: 'items.product',
        select: 'name price images mainImage shop',
        populate: { path: 'shop', select: 'name logo' }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Pobieranie pojedynczego zamówienia
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate({
        path: 'items.product',
        select: 'name price originalPrice images mainImage shop',
        populate: { path: 'shop', select: 'name logo description' }
      })
      .populate('user', 'firstName lastName email phone');

    if (!order) {
      return res.status(404).json({ error: 'Zamówienie nie zostało znalezione' });
    }

    // Sprawdź czy użytkownik ma dostęp do tego zamówienia
    if (order.user._id.toString() !== req.userId && !req.userRole?.includes('admin')) {
      return res.status(403).json({ error: 'Brak uprawnień do tego zamówienia' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Aktualizacja statusu zamówienia (tylko admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Zamówienie nie zostało znalezione' });
    }

    await order.updateStatus(status, note, req.userId);

    res.json({
      message: 'Status zamówienia zaktualizowany',
      order
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Anulowanie zamówienia
exports.cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Zamówienie nie zostało znalezione' });
    }

    // Sprawdź czy użytkownik ma uprawnienia
    if (order.user.toString() !== req.userId && !req.userRole?.includes('admin')) {
      return res.status(403).json({ error: 'Brak uprawnień do tego zamówienia' });
    }

    // Sprawdź czy można anulować
    if (!['pending', 'paid'].includes(order.status)) {
      return res.status(400).json({ error: 'Nie można anulować zamówienia w tym statusie' });
    }

    await order.updateStatus('cancelled', reason, req.userId);

    // Zwróć produkty do magazynu
    for (let item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }

    res.json({
      message: 'Zamówienie anulowane',
      order
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Generowanie faktury
exports.generateInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Zamówienie nie zostało znalezione' });
    }

    if (order.status !== 'paid') {
      return res.status(400).json({ error: 'Faktura może być wygenerowana tylko dla opłaconych zamówień' });
    }

    await order.generateInvoice();

    res.json({
      message: 'Faktura wygenerowana',
      invoice: order.invoice
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Dodawanie zwrotu
exports.addReturn = async (req, res) => {
  try {
    const { items, reason } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Zamówienie nie zostało znalezione' });
    }

    if (order.user.toString() !== req.userId) {
      return res.status(403).json({ error: 'Brak uprawnień do tego zamówienia' });
    }

    if (!['delivered'].includes(order.status)) {
      return res.status(400).json({ error: 'Zwrot możliwy tylko dla dostarczonych zamówień' });
    }

    await order.addReturn(items, reason);

    res.json({
      message: 'Wniosek o zwrot dodany',
      order
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Pobieranie wszystkich zamówień (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'shipping.address.firstName': { $regex: search, $options: 'i' } },
        { 'shipping.address.lastName': { $regex: search, $options: 'i' } }
      ];
    }

    const orders = await Order.find(query)
      .populate('user', 'firstName lastName email')
      .populate({
        path: 'items.product',
        select: 'name price shop',
        populate: { path: 'shop', select: 'name' }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Statystyki zamówień (admin)
exports.getOrderStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          total: { $sum: '$payment.amount' }
        }
      }
    ]);

    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { 'payment.status': 'paid' } },
      { $group: { _id: null, total: { $sum: '$payment.amount' } } }
    ]);

    res.json({
      statusStats: stats,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 