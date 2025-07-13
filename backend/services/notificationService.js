const Notification = require('../models/notificationModel');
const User = require('../models/userModel');

class NotificationService {
  // Tworzenie powiadomienia
  static async createNotification(userId, type, title, message, data = {}, priority = 'medium') {
    try {
      const notification = new Notification({
        user: userId,
        type,
        title,
        message,
        data,
        priority
      });

      await notification.save();

      // Automatyczne wysłanie przez różne kanały
      await this.sendNotification(notification);

      return notification;
    } catch (error) {
      console.error('Błąd tworzenia powiadomienia:', error);
      throw error;
    }
  }

  // Wysyłanie powiadomienia przez różne kanały
  static async sendNotification(notification) {
    try {
      const user = await User.findById(notification.user);
      if (!user) return;

      // Wysyłanie email
      if (user.email && user.settings?.notifications?.email !== false) {
        await this.sendEmail(notification, user.email);
      }

      // Wysyłanie SMS
      if (user.phone && user.settings?.notifications?.sms === true) {
        await this.sendSMS(notification, user.phone);
      }

      // Wysyłanie push notification
      if (user.settings?.notifications?.push !== false) {
        await this.sendPushNotification(notification);
      }

    } catch (error) {
      console.error('Błąd wysyłania powiadomienia:', error);
    }
  }

  // Wysyłanie email
  static async sendEmail(notification, email) {
    try {
      // TODO: Integracja z serwisem email (SendGrid, Mailgun, etc.)
      console.log(`📧 Email wysłany do ${email}: ${notification.title}`);
      
      await notification.markChannelAsSent('email');
    } catch (error) {
      console.error('Błąd wysyłania email:', error);
    }
  }

  // Wysyłanie SMS
  static async sendSMS(notification, phone) {
    try {
      // TODO: Integracja z serwisem SMS (Twilio, etc.)
      console.log(`📱 SMS wysłany do ${phone}: ${notification.title}`);
      
      await notification.markChannelAsSent('sms');
    } catch (error) {
      console.error('Błąd wysyłania SMS:', error);
    }
  }

  // Wysyłanie push notification
  static async sendPushNotification(notification) {
    try {
      // TODO: Integracja z FCM, OneSignal, etc.
      console.log(`🔔 Push notification wysłany: ${notification.title}`);
      
      await notification.markChannelAsSent('push');
    } catch (error) {
      console.error('Błąd wysyłania push notification:', error);
    }
  }

  // Powiadomienia o statusie zamówienia
  static async orderStatusNotification(orderId, userId, status, orderNumber) {
    const statusMessages = {
      'paid': {
        title: 'Zamówienie opłacone',
        message: `Twoje zamówienie ${orderNumber} zostało opłacone i jest w przygotowaniu.`
      },
      'processing': {
        title: 'Zamówienie w przygotowaniu',
        message: `Twoje zamówienie ${orderNumber} jest przygotowywane do wysyłki.`
      },
      'shipped': {
        title: 'Zamówienie wysłane',
        message: `Twoje zamówienie ${orderNumber} zostało wysłane.`
      },
      'delivered': {
        title: 'Zamówienie dostarczone',
        message: `Twoje zamówienie ${orderNumber} zostało dostarczone.`
      },
      'cancelled': {
        title: 'Zamówienie anulowane',
        message: `Twoje zamówienie ${orderNumber} zostało anulowane.`
      }
    };

    const statusInfo = statusMessages[status];
    if (statusInfo) {
      await this.createNotification(
        userId,
        'order_status',
        statusInfo.title,
        statusInfo.message,
        { orderId, url: `/orders/${orderId}` },
        status === 'cancelled' ? 'high' : 'medium'
      );
    }
  }

  // Powiadomienia o płatności
  static async paymentNotification(paymentId, userId, status, amount) {
    const messages = {
      'completed': {
        title: 'Płatność zrealizowana',
        message: `Płatność w kwocie ${amount.toFixed(2)} zł została zrealizowana pomyślnie.`
      },
      'failed': {
        title: 'Płatność nieudana',
        message: `Płatność w kwocie ${amount.toFixed(2)} zł nie została zrealizowana.`
      },
      'refunded': {
        title: 'Zwrot zrealizowany',
        message: `Zwrot w kwocie ${amount.toFixed(2)} zł został zrealizowany.`
      }
    };

    const messageInfo = messages[status];
    if (messageInfo) {
      await this.createNotification(
        userId,
        'payment',
        messageInfo.title,
        messageInfo.message,
        { paymentId, url: `/payments/${paymentId}` },
        status === 'failed' ? 'high' : 'medium'
      );
    }
  }

  // Powiadomienia o promocjach
  static async promotionNotification(userId, title, message, productId = null) {
    await this.createNotification(
      userId,
      'promotion',
      title,
      message,
      { productId, url: productId ? `/products/${productId}` : '/promotions' },
      'low'
    );
  }

  // Powiadomienia o bezpieczeństwie
  static async securityNotification(userId, title, message) {
    await this.createNotification(
      userId,
      'security',
      title,
      message,
      { url: '/account/security' },
      'urgent'
    );
  }

  // Powiadomienia o stanie magazynowym
  static async stockNotification(productId, userId, productName, stock) {
    await this.createNotification(
      userId,
      'stock',
      'Stan magazynowy',
      `Produkt "${productName}" ma niski stan magazynowy (${stock} sztuk).`,
      { productId, url: `/products/${productId}` },
      'medium'
    );
  }

  // Powiadomienia o prośbie o recenzję
  static async reviewRequestNotification(orderId, userId, productName) {
    await this.createNotification(
      userId,
      'review',
      'Oceń swój zakup',
      `Jak oceniasz produkt "${productName}"? Podziel się swoją opinią!`,
      { orderId, url: `/orders/${orderId}/review` },
      'low'
    );
  }

  // Masowe powiadomienia
  static async bulkNotification(userIds, type, title, message, data = {}) {
    const notifications = [];
    
    for (const userId of userIds) {
      try {
        const notification = await this.createNotification(
          userId,
          type,
          title,
          message,
          data
        );
        notifications.push(notification);
      } catch (error) {
        console.error(`Błąd tworzenia powiadomienia dla użytkownika ${userId}:`, error);
      }
    }

    return notifications;
  }

  // Czyszczenie starych powiadomień
  static async cleanupOldNotifications() {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      
      const result = await Notification.deleteMany({
        createdAt: { $lt: thirtyDaysAgo },
        status: { $in: ['read', 'archived'] }
      });

      console.log(`🧹 Usunięto ${result.deletedCount} starych powiadomień`);
      return result.deletedCount;
    } catch (error) {
      console.error('Błąd czyszczenia powiadomień:', error);
      throw error;
    }
  }
}

module.exports = NotificationService; 