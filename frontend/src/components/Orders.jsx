import React, { useState, useEffect } from 'react';
import { FaBox, FaTruck, FaCheck, FaTimes, FaEye, FaDownload, FaUndo } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Orders = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, filter]);

  const fetchOrders = async () => {
    try {
      const url = filter === 'all' 
        ? `${import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com'}/api/orders/my-orders`
        : `${import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com'}/api/orders/my-orders?status=${filter}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Błąd pobierania zamówień:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOrderDetails = async (orderId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com'}/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const order = await response.json();
        setSelectedOrder(order);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Błąd pobierania szczegółów zamówienia:', error);
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm('Czy na pewno chcesz anulować to zamówienie?')) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com'}/api/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ reason: 'Anulowane przez klienta' })
      });

      if (response.ok) {
        await fetchOrders();
        alert('Zamówienie zostało anulowane');
      } else {
        const error = await response.json();
        alert(error.error || 'Błąd anulowania zamówienia');
      }
    } catch (error) {
      console.error('Błąd anulowania zamówienia:', error);
    }
  };

  const generateInvoice = async (orderId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com'}/api/orders/${orderId}/invoice`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        alert('Faktura została wygenerowana');
      } else {
        const error = await response.json();
        alert(error.error || 'Błąd generowania faktury');
      }
    } catch (error) {
      console.error('Błąd generowania faktury:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FaBox className="text-yellow-500" />;
      case 'paid': return <FaCheck className="text-green-500" />;
      case 'processing': return <FaBox className="text-blue-500" />;
      case 'shipped': return <FaTruck className="text-blue-500" />;
      case 'delivered': return <FaCheck className="text-green-500" />;
      case 'cancelled': return <FaTimes className="text-red-500" />;
      default: return <FaBox className="text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Oczekujące na płatność';
      case 'paid': return 'Opłacone';
      case 'processing': return 'W przygotowaniu';
      case 'shipped': return 'Wysłane';
      case 'delivered': return 'Dostarczone';
      case 'cancelled': return 'Anulowane';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaBox className="text-6xl text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Zaloguj się</h2>
          <p className="text-gray-600">Aby zobaczyć swoje zamówienia, musisz się zalogować.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Moje zamówienia</h1>
          
          {/* Filtry */}
          <div className="flex gap-2 mb-6">
            {[
              { value: 'all', label: 'Wszystkie' },
              { value: 'pending', label: 'Oczekujące' },
              { value: 'paid', label: 'Opłacone' },
              { value: 'processing', label: 'W przygotowaniu' },
              { value: 'shipped', label: 'Wysłane' },
              { value: 'delivered', label: 'Dostarczone' },
              { value: 'cancelled', label: 'Anulowane' }
            ].map((filterOption) => (
              <button
                key={filterOption.value}
                onClick={() => setFilter(filterOption.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filter === filterOption.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <FaBox className="text-6xl text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Brak zamówień</h2>
            <p className="text-gray-600 mb-4">Nie masz jeszcze żadnych zamówień.</p>
            <button
                              onClick={() => window.location.href = '/market'}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Przejdź do sklepu
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Zamówienie #{order.orderNumber}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString('pl-PL')}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>

                {/* Produkty */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {order.items.slice(0, 3).map((item) => (
                    <div key={item._id} className="flex items-center gap-3">
                      <img
                        src={item.product.mainImage || '/placeholder-product.jpg'}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium text-sm">{item.product.name}</p>
                        <p className="text-sm text-gray-600">Ilość: {item.quantity}</p>
                        <p className="text-sm font-semibold">{item.price.toFixed(2)} zł</p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="text-sm text-gray-600">
                      +{order.items.length - 3} więcej produktów
                    </div>
                  )}
                </div>

                {/* Suma */}
                <div className="flex justify-between items-center mb-4">
                  <div className="text-lg font-semibold">
                    Razem: {order.payment.amount.toFixed(2)} zł
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => getOrderDetails(order._id)}
                      className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <FaEye />
                      Szczegóły
                    </button>
                    
                    {order.status === 'paid' && (
                      <button
                        onClick={() => generateInvoice(order._id)}
                        className="flex items-center gap-2 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <FaDownload />
                        Faktura
                      </button>
                    )}
                    
                    {['pending', 'paid'].includes(order.status) && (
                      <button
                        onClick={() => cancelOrder(order._id)}
                        className="flex items-center gap-2 px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        <FaUndo />
                        Anuluj
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal ze szczegółami zamówienia */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Zamówienie #{selectedOrder.orderNumber}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Szczegóły zamówienia */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Szczegóły zamówienia</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="font-medium">{getStatusText(selectedOrder.status)}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Data zamówienia</p>
                      <p className="font-medium">
                        {new Date(selectedOrder.createdAt).toLocaleDateString('pl-PL')}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Metoda płatności</p>
                      <p className="font-medium">{selectedOrder.payment.method}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Kwota</p>
                      <p className="font-medium">{selectedOrder.payment.amount.toFixed(2)} zł</p>
                    </div>
                  </div>
                </div>

                {/* Adres dostawy */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Adres dostawy</h3>
                  
                  <div className="space-y-1">
                    <p>{selectedOrder.shipping.address.firstName} {selectedOrder.shipping.address.lastName}</p>
                    <p>{selectedOrder.shipping.address.street} {selectedOrder.shipping.address.houseNumber}</p>
                    {selectedOrder.shipping.address.apartment && (
                      <p>Lokal: {selectedOrder.shipping.address.apartment}</p>
                    )}
                    <p>{selectedOrder.shipping.address.postalCode} {selectedOrder.shipping.address.city}</p>
                    <p>{selectedOrder.shipping.address.country}</p>
                    <p>{selectedOrder.shipping.address.phone}</p>
                    <p>{selectedOrder.shipping.address.email}</p>
                  </div>
                </div>
              </div>

              {/* Produkty */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Produkty</h3>
                
                <div className="space-y-4">
                  {selectedOrder.items.map((item) => (
                    <div key={item._id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                      <img
                        src={item.product.mainImage || '/placeholder-product.jpg'}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.product.name}</h4>
                        <p className="text-sm text-gray-600">{item.product.shop?.name}</p>
                        <p className="text-sm">Ilość: {item.quantity}</p>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold">{item.price.toFixed(2)} zł</p>
                        <p className="text-sm text-gray-600">
                          Razem: {(item.price * item.quantity).toFixed(2)} zł
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Historia statusów */}
              {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Historia statusów</h3>
                  
                  <div className="space-y-3">
                    {selectedOrder.statusHistory.map((status, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                        <div>
                          <p className="font-medium">{getStatusText(status.status)}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(status.timestamp).toLocaleDateString('pl-PL')} - {status.note}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders; 