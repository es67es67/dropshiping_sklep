import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaSmile, FaPaperclip, FaTimes, FaUser, FaStore, FaEllipsisV } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Chat = () => {
  const { user, isAuthenticated } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchConversations();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://portal-backend-igf9.onrender.com'}/api/conversations`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations);
        
        // Wybierz pierwszą konwersację jeśli nie ma wybranej
        if (data.conversations.length > 0 && !selectedConversation) {
          setSelectedConversation(data.conversations[0]);
        }
      }
    } catch (error) {
      console.error('Błąd pobierania konwersacji:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://portal-backend-igf9.onrender.com'}/api/conversations/${conversationId}/messages`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Błąd pobierania wiadomości:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://portal-backend-igf9.onrender.com'}/api/conversations/${selectedConversation._id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          content: newMessage,
          messageType: 'text'
        })
      });

      if (response.ok) {
        setNewMessage('');
        // Odśwież wiadomości
        await fetchMessages(selectedConversation._id);
        // Odśwież konwersacje (dla aktualizacji ostatniej wiadomości)
        await fetchConversations();
      }
    } catch (error) {
      console.error('Błąd wysyłania wiadomości:', error);
    }
  };

  const sendFile = async (file) => {
    if (!selectedConversation) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('messageType', 'file');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://portal-backend-igf9.onrender.com'}/api/conversations/${selectedConversation._id}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (response.ok) {
        await fetchMessages(selectedConversation._id);
        await fetchConversations();
      }
    } catch (error) {
      console.error('Błąd wysyłania pliku:', error);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      sendFile(file);
    }
  };

  const createNewConversation = async (recipientId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://portal-backend-igf9.onrender.com'}/api/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          recipientId,
          type: 'direct'
        })
      });

      if (response.ok) {
        const conversation = await response.json();
        setSelectedConversation(conversation);
        await fetchConversations();
      }
    } catch (error) {
      console.error('Błąd tworzenia konwersacji:', error);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('pl-PL', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Dzisiaj';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Wczoraj';
    } else {
      return date.toLocaleDateString('pl-PL');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaUser className="text-6xl text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Zaloguj się</h2>
          <p className="text-gray-600">Aby korzystać z czatu, musisz się zalogować.</p>
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto h-screen flex">
        {/* Lista konwersacji */}
        <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Wiadomości</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-600">
                <p>Brak konwersacji</p>
                <p className="text-sm">Rozpocznij rozmowę z innymi użytkownikami</p>
              </div>
            ) : (
              <div className="space-y-1">
                {conversations.map((conversation) => (
                  <div
                    key={conversation._id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 ${
                      selectedConversation?._id === conversation._id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                        {conversation.type === 'shop_support' ? <FaStore /> : <FaUser />}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {conversation.name || conversation.participants.find(p => p.user._id !== user._id)?.user.firstName || 'Nieznany użytkownik'}
                        </h3>
                        
                        {conversation.lastMessage && (
                          <p className="text-sm text-gray-600 truncate">
                            {conversation.lastMessage.content}
                          </p>
                        )}
                        
                        <p className="text-xs text-gray-500">
                          {conversation.lastMessage ? formatTime(conversation.lastMessage.timestamp) : ''}
                        </p>
                      </div>
                      
                      {conversation.stats.unreadCount > 0 && (
                        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                          {conversation.stats.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Okno czatu */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Nagłówek konwersacji */}
              <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                    {selectedConversation.type === 'shop_support' ? <FaStore /> : <FaUser />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {selectedConversation.name || selectedConversation.participants.find(p => p.user._id !== user._id)?.user.firstName || 'Nieznany użytkownik'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedConversation.participants.find(p => p.user._id !== user._id)?.user.online ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-600 hover:text-gray-800">
                    <FaEllipsisV />
                  </button>
                </div>
              </div>

              {/* Wiadomości */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-600 py-8">
                    <p>Brak wiadomości</p>
                    <p className="text-sm">Rozpocznij rozmowę!</p>
                  </div>
                ) : (
                  messages.map((message, index) => {
                    const isOwn = message.sender._id === user._id;
                    const showDate = index === 0 || 
                      formatDate(message.createdAt) !== formatDate(messages[index - 1].createdAt);
                    
                    return (
                      <div key={message._id}>
                        {showDate && (
                          <div className="text-center text-xs text-gray-500 my-4">
                            {formatDate(message.createdAt)}
                          </div>
                        )}
                        
                        <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            isOwn 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-200 text-gray-900'
                          }`}>
                            {message.messageType === 'text' && (
                              <p>{message.content}</p>
                            )}
                            
                            {message.messageType === 'image' && (
                              <img 
                                src={message.attachments[0]?.url} 
                                alt="Obraz" 
                                className="max-w-full rounded"
                              />
                            )}
                            
                            {message.messageType === 'file' && (
                              <div className="flex items-center gap-2">
                                <FaPaperclip />
                                <a 
                                  href={message.attachments[0]?.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="underline"
                                >
                                  {message.attachments[0]?.filename || 'Plik'}
                                </a>
                              </div>
                            )}
                            
                            <p className={`text-xs mt-1 ${
                              isOwn ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {formatTime(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Formularz wiadomości */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <form onSubmit={sendMessage} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-gray-600 hover:text-gray-800"
                  >
                    <FaPaperclip />
                  </button>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx"
                  />
                  
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 text-gray-600 hover:text-gray-800"
                  >
                    <FaSmile />
                  </button>
                  
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Napisz wiadomość..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    <FaPaperPlane />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-600">
                <FaUser className="text-6xl text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Wybierz konwersację</h3>
                <p>Wybierz konwersację z listy, aby rozpocząć rozmowę</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat; 