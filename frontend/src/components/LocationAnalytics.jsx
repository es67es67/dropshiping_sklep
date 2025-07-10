import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './LocationAnalytics.css';

const LocationAnalytics = ({ locationId }) => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('users');

  useEffect(() => {
    if (locationId) {
      loadAnalytics();
    }
  }, [locationId, period]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/locations/${locationId}/analytics?period=${period}`);
      const data = await response.json();
      
      if (response.ok) {
        setAnalytics(data);
      } else {
        console.error('Błąd ładowania analityki:', data.error);
      }
    } catch (error) {
      console.error('Błąd ładowania analityki:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportAnalytics = async (format = 'json') => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/locations/${locationId}/export?format=${format}`);
      const data = await response.json();
      
      if (response.ok) {
        // Utwórz plik do pobrania
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics_${locationId}_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Błąd eksportu:', error);
      alert('Błąd eksportu danych');
    }
  };

  const renderMetricCard = (title, value, change, icon) => (
    <div className="metric-card">
      <div className="metric-icon">{icon}</div>
      <div className="metric-content">
        <h4>{title}</h4>
        <div className="metric-value">{value.toLocaleString()}</div>
        {change !== undefined && (
          <div className={`metric-change ${change >= 0 ? 'positive' : 'negative'}`}>
            {change >= 0 ? '+' : ''}{change}%
          </div>
        )}
      </div>
    </div>
  );

  const renderChart = () => {
    if (!analytics) return null;

    const metrics = {
      users: {
        total: analytics.stats.totalUsers,
        new: analytics.stats.newUsers,
        label: 'Użytkownicy',
        color: '#667eea'
      },
      shops: {
        total: analytics.stats.totalShops,
        new: analytics.stats.newShops,
        label: 'Sklepy',
        color: '#28a745'
      },
      products: {
        total: analytics.stats.totalProducts,
        new: analytics.stats.newProducts,
        label: 'Produkty',
        color: '#ffc107'
      },
      posts: {
        total: analytics.stats.totalPosts,
        new: analytics.stats.newPosts,
        label: 'Posty',
        color: '#dc3545'
      }
    };

    const selectedData = metrics[selectedMetric];
    const percentage = selectedData.total > 0 ? (selectedData.new / selectedData.total) * 100 : 0;

    return (
      <div className="chart-container">
        <div className="chart-header">
          <h4>Wzrost w okresie {period}</h4>
          <select 
            value={selectedMetric} 
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="metric-selector"
          >
            <option value="users">Użytkownicy</option>
            <option value="shops">Sklepy</option>
            <option value="products">Produkty</option>
            <option value="posts">Posty</option>
          </select>
        </div>
        
        <div className="chart-content">
          <div className="chart-bar">
            <div 
              className="chart-fill"
              style={{ 
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: selectedData.color
              }}
            ></div>
          </div>
          <div className="chart-stats">
            <span>Nowe: {selectedData.new}</span>
            <span>Wzrost: {percentage.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="analytics-container">
        <div className="loading">Ładowanie analityki...</div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="analytics-container">
        <div className="error">Nie udało się załadować analityki</div>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h3>Analityka lokalizacji: {analytics.location.name}</h3>
        <div className="header-controls">
          <select 
            value={period} 
            onChange={(e) => setPeriod(e.target.value)}
            className="period-selector"
          >
            <option value="7d">Ostatnie 7 dni</option>
            <option value="30d">Ostatnie 30 dni</option>
            <option value="90d">Ostatnie 90 dni</option>
          </select>
          <button 
            className="export-btn"
            onClick={() => exportAnalytics()}
          >
            Eksportuj dane
          </button>
        </div>
      </div>

      <div className="metrics-grid">
        {renderMetricCard(
          'Użytkownicy',
          analytics.stats.totalUsers,
          analytics.trends.userGrowth,
          '👥'
        )}
        {renderMetricCard(
          'Sklepy',
          analytics.stats.totalShops,
          analytics.trends.shopGrowth,
          '🏪'
        )}
        {renderMetricCard(
          'Produkty',
          analytics.stats.totalProducts,
          analytics.trends.productGrowth,
          '📦'
        )}
        {renderMetricCard(
          'Posty',
          analytics.stats.totalPosts,
          analytics.trends.postGrowth,
          '📝'
        )}
      </div>

      <div className="growth-section">
        <h4>Nowe w okresie {period}</h4>
        <div className="growth-grid">
          <div className="growth-item">
            <span className="growth-number">{analytics.stats.newUsers}</span>
            <span className="growth-label">Nowi użytkownicy</span>
          </div>
          <div className="growth-item">
            <span className="growth-number">{analytics.stats.newShops}</span>
            <span className="growth-label">Nowe sklepy</span>
          </div>
          <div className="growth-item">
            <span className="growth-number">{analytics.stats.newProducts}</span>
            <span className="growth-label">Nowe produkty</span>
          </div>
          <div className="growth-item">
            <span className="growth-number">{analytics.stats.newPosts}</span>
            <span className="growth-label">Nowe posty</span>
          </div>
        </div>
      </div>

      {renderChart()}

      <div className="insights-section">
        <h4>Wnioski</h4>
        <div className="insights-grid">
          <div className="insight-item">
            <div className="insight-icon">📈</div>
            <div className="insight-content">
              <h5>Aktywność</h5>
              <p>
                {analytics.stats.newUsers > 0 
                  ? `Dodano ${analytics.stats.newUsers} nowych użytkowników w tym okresie`
                  : 'Brak nowych użytkowników w tym okresie'
                }
              </p>
            </div>
          </div>
          
          <div className="insight-item">
            <div className="insight-icon">🏪</div>
            <div className="insight-content">
              <h5>Handel</h5>
              <p>
                {analytics.stats.newShops > 0 
                  ? `Dodano ${analytics.stats.newShops} nowych sklepów`
                  : 'Brak nowych sklepów w tym okresie'
                }
              </p>
            </div>
          </div>
          
          <div className="insight-item">
            <div className="insight-icon">📦</div>
            <div className="insight-content">
              <h5>Produkty</h5>
              <p>
                {analytics.stats.newProducts > 0 
                  ? `Dodano ${analytics.stats.newProducts} nowych produktów`
                  : 'Brak nowych produktów w tym okresie'
                }
              </p>
            </div>
          </div>
          
          <div className="insight-item">
            <div className="insight-icon">💬</div>
            <div className="insight-content">
              <h5>Engagement</h5>
              <p>
                {analytics.stats.newPosts > 0 
                  ? `Utworzono ${analytics.stats.newPosts} nowych postów`
                  : 'Brak nowych postów w tym okresie'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationAnalytics; 