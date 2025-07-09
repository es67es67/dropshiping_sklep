const EventEmitter = require('events');

class EventSystem extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(100); // Zwiększamy limit listenerów dla modułowej architektury
  }

  // Eventy dla modułu lokalizacji
  emitLocationChanged(userId, locationId) {
    this.emit('location:changed', { userId, locationId });
  }

  // Eventy dla modułu komunikacji
  emitMessageSent(senderId, receiverId, messageId) {
    this.emit('message:sent', { senderId, receiverId, messageId });
  }

  emitMessageReceived(receiverId, messageId) {
    this.emit('message:received', { receiverId, messageId });
  }

  // Eventy dla modułu płatności
  emitPaymentCompleted(orderId, amount) {
    this.emit('payment:completed', { orderId, amount });
  }

  emitPaymentFailed(orderId, error) {
    this.emit('payment:failed', { orderId, error });
  }

  // Eventy dla modułu statusów/gamification
  emitUserLevelUp(userId, newLevel) {
    this.emit('user:levelUp', { userId, newLevel });
  }

  emitBadgeEarned(userId, badgeId) {
    this.emit('badge:earned', { userId, badgeId });
  }

  // Eventy dla modułu produktów/sklepów
  emitProductCreated(productId, shopId) {
    this.emit('product:created', { productId, shopId });
  }

  emitShopCreated(shopId, ownerId) {
    this.emit('shop:created', { shopId, ownerId });
  }

  // Eventy dla modułu dropshipping (przyszłość)
  emitDropshippingOrderPlaced(orderId, supplierId) {
    this.emit('dropshipping:orderPlaced', { orderId, supplierId });
  }

  // Eventy dla modułu kurierów (przyszłość)
  emitShippingStatusChanged(orderId, status) {
    this.emit('shipping:statusChanged', { orderId, status });
  }

  // Eventy dla modułu AI (przyszłość)
  emitAIRecommendation(userId, recommendationType) {
    this.emit('ai:recommendation', { userId, recommendationType });
  }

  // Eventy systemowe
  emitModuleLoaded(moduleName) {
    this.emit('module:loaded', { moduleName });
  }

  emitUserOnline(userId) {
    this.emit('user:online', { userId });
  }

  emitUserOffline(userId) {
    this.emit('user:offline', { userId });
  }

  // Metody pomocnicze
  onLocationChanged(callback) {
    this.on('location:changed', callback);
  }

  onMessageSent(callback) {
    this.on('message:sent', callback);
  }

  onPaymentCompleted(callback) {
    this.on('payment:completed', callback);
  }

  onPaymentFailed(callback) {
    this.on('payment:failed', callback);
  }

  onUserLevelUp(callback) {
    this.on('user:levelUp', callback);
  }

  onBadgeEarned(callback) {
    this.on('badge:earned', callback);
  }

  // Rejestracja wszystkich eventów dla modułu
  registerModuleEvents(moduleName, events) {
    events.forEach(event => {
      this.on(event.name, (data) => {
        console.log(`📡 Event ${event.name} dla modułu ${moduleName}:`, data);
        if (event.handler) {
          event.handler(data);
        }
      });
    });
  }
}

module.exports = new EventSystem(); 