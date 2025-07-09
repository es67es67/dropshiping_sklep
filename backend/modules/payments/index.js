const express = require('express');
const router = express.Router();
const Order = require('../../models/orderModel');
const Payment = require('../../models/paymentModel');
const User = require('../../models/userModel');
const Shop = require('../../models/shopModel');
const eventSystem = require('../../core/eventSystem');

class PaymentsModule {
  constructor() {
    this.router = router;
    this.setupRoutes();
    this.setupEvents();
  }

  setupRoutes() {
    // Pobieranie wszystkich zamówień (dla adminów)
    router.get('/orders', async (req, res) => {
      try {
        const { page = 1, limit = 50, status } = req.query;
        const skip = (page - 1) * limit;
        
        const query = {};
        if (status) query.status = status;
        
        const orders = await Order.find(query)
          .populate('user', 'username firstName lastName email')
          .populate('items.product', 'name price images')
          .sort({ createdAt: -1 })
          .limit(parseInt(limit))
          .skip(skip);
        
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
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Tworzenie zamówienia
    router.post('/orders', async (req, res) => {
      try {
        const { userId, items, shippingAddress, paymentMethod } = req.body;
        
        // Sprawdź czy użytkownik istnieje
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ error: 'Użytkownik nie znaleziony' });
        }
        
        // Oblicz całkowitą kwotę
        let totalAmount = 0;
        const orderItems = [];
        
        for (const item of items) {
          // W przyszłości będzie pobieranie z modelu Product
          // const product = await Product.findById(item.productId);
          // if (!product) continue;
          
          // Tymczasowo używamy danych z requestu
          const itemTotal = item.price * item.quantity;
          totalAmount += itemTotal;
          
          orderItems.push({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            price: item.price,
            total: itemTotal
          });
        }
        
        if (orderItems.length === 0) {
          return res.status(400).json({ error: 'Brak produktów w zamówieniu' });
        }
        
        // Utwórz zamówienie
        const order = new Order({
          user: userId,
          items: orderItems,
          totalAmount,
          shippingAddress,
          paymentMethod,
          status: 'pending'
        });
        
        await order.save();
        
        // Emit event
        eventSystem.emit('order:created', { orderId: order._id, userId, totalAmount });
        
        res.status(201).json(order);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Pobieranie zamówień użytkownika
    router.get('/orders/user/:userId', async (req, res) => {
      try {
        const { userId } = req.params;
        const { status, page = 1, limit = 20 } = req.query;
        
        const query = { user: userId };
        if (status) query.status = status;
        
        const skip = (page - 1) * limit;
        
        const orders = await Order.find(query)
          .sort({ createdAt: -1 })
          .limit(parseInt(limit))
          .skip(skip)
          .populate('user', 'username firstName lastName email');
        
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
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Szczegóły zamówienia
    router.get('/orders/:orderId', async (req, res) => {
      try {
        const { orderId } = req.params;
        
        const order = await Order.findById(orderId)
          .populate('user', 'username firstName lastName email')
          .populate('payment', 'status amount method');
        
        if (!order) {
          return res.status(404).json({ error: 'Zamówienie nie znalezione' });
        }
        
        res.json(order);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Anulowanie zamówienia
    router.put('/orders/:orderId/cancel', async (req, res) => {
      try {
        const { orderId } = req.params;
        const { userId, reason } = req.body;
        
        const order = await Order.findById(orderId);
        if (!order) {
          return res.status(404).json({ error: 'Zamówienie nie znalezione' });
        }
        
        if (order.user.toString() !== userId) {
          return res.status(403).json({ error: 'Brak uprawnień do anulowania zamówienia' });
        }
        
        if (order.status !== 'pending' && order.status !== 'confirmed') {
          return res.status(400).json({ error: 'Nie można anulować zamówienia w tym statusie' });
        }
        
        order.status = 'cancelled';
        order.cancellationReason = reason;
        order.cancelledAt = new Date();
        
        await order.save();
        
        // Emit event
        eventSystem.emit('order:cancelled', { orderId, userId, reason });
        
        res.json(order);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Tworzenie płatności
    router.post('/payments', async (req, res) => {
      try {
        const { orderId, amount, method, paymentData } = req.body;
        
        const order = await Order.findById(orderId);
        if (!order) {
          return res.status(404).json({ error: 'Zamówienie nie znalezione' });
        }
        
        if (order.status !== 'pending') {
          return res.status(400).json({ error: 'Zamówienie nie może być opłacone' });
        }
        
        // Tymczasowo symulujemy płatność
        // W przyszłości będzie integracja z Stripe/PayPal
        const payment = new Payment({
          order: orderId,
          amount,
          method,
          status: 'completed', // Tymczasowo zawsze completed
          paymentData,
          processedAt: new Date()
        });
        
        await payment.save();
        
        // Aktualizuj status zamówienia
        order.status = 'paid';
        order.payment = payment._id;
        await order.save();
        
        // Emit event
        eventSystem.emitPaymentCompleted(orderId, amount);
        
        res.status(201).json(payment);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Historia płatności
    router.get('/payments/user/:userId', async (req, res) => {
      try {
        const { userId } = req.params;
        const { page = 1, limit = 20 } = req.query;
        
        const skip = (page - 1) * limit;
        
        const payments = await Payment.find()
          .populate({
            path: 'order',
            match: { user: userId },
            populate: { path: 'user', select: 'username firstName lastName' }
          })
          .sort({ createdAt: -1 })
          .limit(parseInt(limit))
          .skip(skip);
        
        // Filtruj tylko płatności użytkownika
        const userPayments = payments.filter(payment => payment.order);
        
        res.json(userPayments);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Webhook dla płatności (przyszłość - Stripe)
    router.post('/webhook/stripe', async (req, res) => {
      try {
        // W przyszłości będzie obsługa webhooków Stripe
        console.log('📡 Webhook Stripe otrzymany:', req.body);
        
        // Tutaj będzie logika weryfikacji i przetwarzania płatności
        
        res.json({ received: true });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Statystyki płatności (admin)
    router.get('/stats', async (req, res) => {
      try {
        const [totalOrders, pendingOrders, completedOrders] = await Promise.all([
          Order.countDocuments(),
          Order.countDocuments({ status: 'pending' }),
          Order.countDocuments({ status: 'completed' })
        ]);
        
        res.json({
          totalOrders,
          pendingOrders,
          completedOrders,
          conversionRate: totalOrders > 0 ? (completedOrders / totalOrders * 100).toFixed(2) : 0
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  }

  setupEvents() {
    // Nasłuchiwanie na eventy płatności
    eventSystem.onPaymentCompleted(async (data) => {
      console.log(`💰 Płatność zakończona: Zamówienie ${data.orderId}, kwota: ${data.amount}`);
      // Tutaj można dodać powiadomienia, email, aktualizacje stanów magazynowych
    });

    eventSystem.onPaymentFailed(async (data) => {
      console.log(`❌ Płatność nieudana: Zamówienie ${data.orderId}, błąd: ${data.error}`);
    });

    // Nasłuchiwanie na tworzenie zamówień
    eventSystem.on('order:created', async (data) => {
      console.log(`📦 Nowe zamówienie: ${data.orderId} od użytkownika ${data.userId}`);
    });

    eventSystem.on('order:cancelled', async (data) => {
      console.log(`❌ Zamówienie anulowane: ${data.orderId}, powód: ${data.reason}`);
    });
  }

  async initialize() {
    console.log('💰 Inicjalizacja modułu płatności...');
    // Tutaj można dodać inicjalizację Stripe, PayPal, itp.
    return true;
  }

  getRoutes() {
    return this.router;
  }
}

module.exports = new PaymentsModule(); 