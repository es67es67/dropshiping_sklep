const Payment = require('../models/paymentModel');
const Order = require('../models/orderModel');
const User = require('../models/userModel');

// Inicjalizacja płatności
exports.initializePayment = async (req, res) => {
  try {
    const { orderId, paymentMethod, cardDetails } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Zamówienie nie zostało znalezione' });
    }

    if (order.user.toString() !== req.userId) {
      return res.status(403).json({ error: 'Brak uprawnień do tego zamówienia' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ error: 'Zamówienie nie może być opłacone' });
    }

    // Sprawdź czy płatność już istnieje
    const existingPayment = await Payment.findOne({ order: orderId });
    if (existingPayment) {
      return res.status(400).json({ error: 'Płatność już istnieje dla tego zamówienia' });
    }

    // Utwórz płatność
    const payment = new Payment({
      order: orderId,
      user: req.userId,
      amount: order.payment.amount,
      method: paymentMethod,
      cardDetails: cardDetails ? {
        last4: cardDetails.last4,
        brand: cardDetails.brand,
        expiryMonth: cardDetails.expiryMonth,
        expiryYear: cardDetails.expiryYear
      } : null,
      metadata: {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        device: req.headers['user-agent']?.includes('Mobile') ? 'mobile' : 'desktop'
      }
    });

    await payment.save();

    // Symulacja procesowania płatności
    if (paymentMethod === 'card') {
      // Symulacja bramki płatności
      await simulatePaymentProcessing(payment);
    } else if (paymentMethod === 'transfer') {
      // Płatność przelewem - oczekuje na potwierdzenie
      await payment.updateStatus('pending', 'Oczekuje na potwierdzenie przelewu');
    } else if (paymentMethod === 'cash_on_delivery') {
      // Płatność przy odbiorze
      await payment.updateStatus('pending', 'Płatność przy odbiorze');
      await order.updateStatus('paid', 'Płatność przy odbiorze');
    }

    res.json({
      message: 'Płatność zainicjalizowana',
      payment: {
        id: payment._id,
        amount: payment.amount,
        status: payment.status,
        method: payment.method
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Symulacja procesowania płatności kartą
async function simulatePaymentProcessing(payment) {
  // Symulacja opóźnienia
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // 90% szans na udaną płatność
  const isSuccessful = Math.random() > 0.1;
  
  if (isSuccessful) {
    await payment.updateStatus('completed', 'Płatność zrealizowana pomyślnie', {
      gateway: 'stripe',
      transactionId: 'txn_' + Math.random().toString(36).substr(2, 9)
    });
    
    // Aktualizuj status zamówienia
    const order = await Order.findById(payment.order);
    if (order) {
      await order.updateStatus('paid', 'Płatność zrealizowana');
    }
  } else {
    await payment.updateStatus('failed', 'Płatność nieudana - błąd karty', {
      error: 'card_declined',
      message: 'Karta została odrzucona'
    });
  }
}

// Pobieranie statusu płatności
exports.getPaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId)
      .populate('order', 'orderNumber status')
      .populate('user', 'firstName lastName email');

    if (!payment) {
      return res.status(404).json({ error: 'Płatność nie została znaleziona' });
    }

    if (payment.user._id.toString() !== req.userId && !req.userRole?.includes('admin')) {
      return res.status(403).json({ error: 'Brak uprawnień do tej płatności' });
    }

    res.json({
      payment: {
        id: payment._id,
        amount: payment.amount,
        status: payment.status,
        method: payment.method,
        order: payment.order,
        createdAt: payment.createdAt,
        completedAt: payment.completedAt
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Zwrot płatności
exports.refundPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { amount, reason } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ error: 'Płatność nie została znaleziona' });
    }

    if (payment.status !== 'completed') {
      return res.status(400).json({ error: 'Można zwrócić tylko zrealizowane płatności' });
    }

    const remainingAmount = payment.getRemainingAmount();
    if (amount > remainingAmount) {
      return res.status(400).json({ error: 'Kwota zwrotu przekracza dostępną kwotę' });
    }

    await payment.addRefund(amount, reason);

    // Symulacja procesowania zwrotu
    setTimeout(async () => {
      const refund = payment.refunds[payment.refunds.length - 1];
      refund.status = 'completed';
      refund.processedAt = new Date();
      await payment.save();
    }, 3000);

    res.json({
      message: 'Zwrot zainicjalizowany',
      refund: {
        amount,
        reason,
        status: 'pending'
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Pobieranie historii płatności użytkownika
exports.getUserPayments = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    let query = { user: req.userId };
    if (status) {
      query.status = status;
    }

    const payments = await Payment.find(query)
      .populate('order', 'orderNumber status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Payment.countDocuments(query);

    res.json({
      payments,
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

// Webhook dla bramki płatności
exports.paymentWebhook = async (req, res) => {
  try {
    const { paymentId, status, transactionId, signature } = req.body;

    // TODO: Sprawdź podpis webhooka
    // if (!verifyWebhookSignature(req.body, signature)) {
    //   return res.status(400).json({ error: 'Nieprawidłowy podpis' });
    // }

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ error: 'Płatność nie została znaleziona' });
    }

    if (status === 'succeeded') {
      await payment.updateStatus('completed', 'Płatność potwierdzona przez bramkę', {
        gateway: 'stripe',
        transactionId
      });

      // Aktualizuj status zamówienia
      const order = await Order.findById(payment.order);
      if (order) {
        await order.updateStatus('paid', 'Płatność potwierdzona');
      }
    } else if (status === 'failed') {
      await payment.updateStatus('failed', 'Płatność nieudana', {
        gateway: 'stripe',
        transactionId
      });
    }

    res.json({ received: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Statystyki płatności (admin)
exports.getPaymentStats = async (req, res) => {
  try {
    const stats = await Payment.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          total: { $sum: '$amount' }
        }
      }
    ]);

    const totalPayments = await Payment.countDocuments();
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const methodStats = await Payment.aggregate([
      {
        $group: {
          _id: '$method',
          count: { $sum: 1 },
          total: { $sum: '$amount' }
        }
      }
    ]);

    res.json({
      statusStats: stats,
      methodStats,
      totalPayments,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 