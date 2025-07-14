import React, { useState, useEffect } from 'react';
import { FaBell, FaCheck, FaTimes, FaTrash, FaEye, FaEyeSlash, FaCog } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Notifications = () => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    email: true,
    push: true,
    sound: true
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated, filter]);

  const fetchNotifications = async () => {
    try {
      const url = filter === 'all' 
        ? `${import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com'}/api/notifications`
        : `${import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com'}/api/notifications?type=${filter}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error('Błąd pobierania powiadomień:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com'}/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setNotifications(notifications.map(notif => 
          notif._id === notificationId ? { ...notif, status: 'read' } : notif
        ));
      }
    } catch (error) {
      console.error('Błąd oznaczania jako przeczytane:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com'}/api/notifications/read-all`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setNotifications(notifications.map(notif => ({ ...notif, status: 'read' })));
      }
    } catch (error) {
      console.error('Błąd oznaczania wszystkich jako przeczytane:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com'}/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setNotifications(notifications.filter(notif => notif._id !== notificationId));
      }
    } catch (error) {
      console.error('Błąd usuwania powiadomienia:', error);
    }
  };

  const archiveNotification = async (notificationId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com'}/api/notifications/${notificationId}/archive`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setNotifications(notifications.map(notif => 
          notif._id === notificationId ? { ...notif, status: 'archived' } : notif
        ));
      }
    } catch (error) {
      console.error('Błąd archiwizacji powiadomienia:', error);
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com'}/api/notifications/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newSettings)
      });

      if (response.ok) {
        setSettings(newSettings);
        setShowSettings(false);
      }
    } catch (error) {
      console.error('Błąd aktualizacji ustawień:', error);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'order_status': return '📦';
      case 'payment': return '💳';
      case 'delivery': return '🚚';
      case 'promotion': return '🎉';
      case 'security': return '🔒';
      case 'system': return '⚙️';
      case 'chat': return '💬';
      case 'review': return '⭐';
      case 'stock': return '📊';
      case 'return': return '↩️';
      default: return '🔔';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'order_status': return 'bg-blue-100 text-blue-800';
      case 'payment': return 'bg-green-100 text-green-800';
      case 'delivery': return 'bg-purple-100 text-purple-800';
      case 'promotion': return 'bg-yellow-100 text-yellow-800';
      case 'security': return 'bg-red-100 text-red-800';
      case 'system': return 'bg-gray-100 text-gray-800';
      case 'chat': return 'bg-indigo-100 text-indigo-800';
      case 'review': return 'bg-orange-100 text-orange-800';
      case 'stock': return 'bg-teal-100 text-teal-800';
      case 'return': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'border-red-500';
      case 'high': return 'border-orange-500';
      case 'medium': return 'border-blue-500';
      case 'low': return 'border-gray-500';
      default: return 'border-gray-300';
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Teraz';
    if (diffInMinutes < 60) return `${diffInMinutes} min temu`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} godz. temu`;
    return notificationTime.toLocaleDateString('pl-PL');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaBell className="text-6xl text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Zaloguj się</h2>
          <p className="text-gray-600">Aby zobaczyć powiadomienia, musisz się zalogować.</p>
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

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Powiadomienia</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  {unreadCount} nieprzeczytane powiadomienie{unreadCount !== 1 ? 'a' : ''}
                </p>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-gray-600 hover:text-gray-800"
              >
                <FaCog />
              </button>
              
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Oznacz wszystkie jako przeczytane
                </button>
              )}
            </div>
          </div>

          {/* Filtry */}
          <div className="flex gap-2 mb-6">
            {[
              { value: 'all', label: 'Wszystkie' },
              { value: 'unread', label: 'Nieprzeczytane' },
              { value: 'order_status', label: 'Zamówienia' },
              { value: 'payment', label: 'Płatności' },
              { value: 'promotion', label: 'Promocje' },
              { value: 'security', label: 'Bezpieczeństwo' }
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

        {/* Ustawienia */}
        {showSettings && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ustawienia powiadomień</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Powiadomienia email</p>
                  <p className="text-sm text-gray-600">Otrzymuj powiadomienia na email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.email}
                    onChange={(e) => setSettings({...settings, email: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Powiadomienia push</p>
                  <p className="text-sm text-gray-600">Otrzymuj powiadomienia w przeglądarce</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.push}
                    onChange={(e) => setSettings({...settings, push: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Dźwięki</p>
                  <p className="text-sm text-gray-600">Odtwarzaj dźwięki przy nowych powiadomieniach</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.sound}
                    onChange={(e) => setSettings({...settings, sound: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Anuluj
              </button>
              <button
                onClick={() => updateSettings(settings)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Zapisz
              </button>
            </div>
          </div>
        )}

        {/* Lista powiadomień */}
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <FaBell className="text-6xl text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Brak powiadomień</h2>
            <p className="text-gray-600">Nie masz jeszcze żadnych powiadomień.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`bg-white rounded-lg shadow-sm p-6 border-l-4 ${getPriorityColor(notification.priority)} ${
                  notification.status === 'unread' ? 'ring-2 ring-blue-200' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-2xl">
                    {getTypeIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                        {notification.type}
                      </span>
                      {notification.priority === 'urgent' && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Pilne
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-700 mb-3">{notification.message}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{formatTime(notification.createdAt)}</span>
                        {notification.data?.url && (
                          <a
                            href={notification.data.url}
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            Zobacz więcej
                          </a>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {notification.status === 'unread' && (
                          <button
                            onClick={() => markAsRead(notification._id)}
                            className="p-2 text-gray-600 hover:text-gray-800"
                            title="Oznacz jako przeczytane"
                          >
                            <FaEye />
                          </button>
                        )}
                        
                        <button
                          onClick={() => archiveNotification(notification._id)}
                          className="p-2 text-gray-600 hover:text-gray-800"
                          title="Archiwizuj"
                        >
                          <FaEyeSlash />
                        </button>
                        
                        <button
                          onClick={() => deleteNotification(notification._id)}
                          className="p-2 text-red-600 hover:text-red-800"
                          title="Usuń"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications; 