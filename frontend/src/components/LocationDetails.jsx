import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './LocationDetails.css';

const LocationDetails = ({ locationId, onClose }) => {
  const { user } = useAuth();
  const [location, setLocation] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [userRating, setUserRating] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ratingForm, setRatingForm] = useState({
    rating: 5,
    comment: ''
  });
  const [showRatingForm, setShowRatingForm] = useState(false);

  useEffect(() => {
    if (locationId) {
      loadLocationDetails();
    }
  }, [locationId]);

  const loadLocationDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/locations/${locationId}`);
      const data = await response.json();
      
      if (response.ok) {
        setLocation(data);
        setRecommendations(data.recommendations || []);
        
        // Sprawdź subskrypcję użytkownika
        if (user && user.subscribedLocations) {
          setIsSubscribed(user.subscribedLocations.includes(locationId));
        }
        
        // Pobierz oceny
        loadRatings();
        
        // Sprawdź ocenę użytkownika
        if (user) {
          loadUserRating();
        }
      }
    } catch (error) {
      console.error('Błąd ładowania szczegółów lokalizacji:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRatings = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/locations/${locationId}/ratings`);
      const data = await response.json();
      
      if (response.ok) {
        setRatings(data.ratings);
      }
    } catch (error) {
      console.error('Błąd ładowania ocen:', error);
    }
  };

  const loadUserRating = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/locations/${locationId}/ratings?userId=${user._id}`);
      const data = await response.json();
      
      if (response.ok && data.ratings.length > 0) {
        const userRatingData = data.ratings.find(r => r.user._id === user._id);
        if (userRatingData) {
          setUserRating(userRatingData);
          setRatingForm({
            rating: userRatingData.rating,
            comment: userRatingData.comment || ''
          });
        }
      }
    } catch (error) {
      console.error('Błąd ładowania oceny użytkownika:', error);
    }
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/locations/${locationId}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id,
          rating: ratingForm.rating,
          comment: ratingForm.comment
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setShowRatingForm(false);
        loadRatings();
        loadLocationDetails(); // Odśwież dane lokalizacji
        alert('Ocena została zapisana!');
      } else {
        alert('Błąd zapisywania oceny: ' + data.error);
      }
    } catch (error) {
      console.error('Błąd zapisywania oceny:', error);
      alert('Błąd zapisywania oceny');
    }
  };

  const handleSubscribe = async () => {
    try {
      const method = isSubscribed ? 'DELETE' : 'POST';
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/locations/${locationId}/subscribe`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setIsSubscribed(!isSubscribed);
        alert(isSubscribed ? 'Subskrypcja została usunięta' : 'Subskrypcja została dodana');
      } else {
        alert('Błąd: ' + data.error);
      }
    } catch (error) {
      console.error('Błąd subskrypcji:', error);
      alert('Błąd subskrypcji');
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span key={index} className={`star ${index < rating ? 'filled' : ''}`}>
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="location-details-overlay">
        <div className="location-details">
          <div className="loading">Ładowanie...</div>
        </div>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="location-details-overlay">
        <div className="location-details">
          <div className="error">Lokalizacja nie została znaleziona</div>
        </div>
      </div>
    );
  }

  return (
    <div className="location-details-overlay">
      <div className="location-details">
        <div className="details-header">
          <h2>{location.name}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="details-content">
          {/* Podstawowe informacje */}
          <div className="basic-info">
            <div className="info-row">
              <span className="label">Typ:</span>
              <span className="value">{location.type}</span>
            </div>
            {location.population && (
              <div className="info-row">
                <span className="label">Populacja:</span>
                <span className="value">{location.population.toLocaleString()}</span>
              </div>
            )}
            {location.area && (
              <div className="info-row">
                <span className="label">Powierzchnia:</span>
                <span className="value">{location.area} km²</span>
              </div>
            )}
            {location.description && (
              <div className="description">
                <h4>Opis</h4>
                <p>{location.description}</p>
              </div>
            )}
          </div>

          {/* Statystyki */}
          <div className="stats-section">
            <h4>Statystyki</h4>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">{location.stats?.totalUsers || 0}</span>
                <span className="stat-label">Użytkownicy</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{location.stats?.totalShops || 0}</span>
                <span className="stat-label">Sklepy</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{location.stats?.totalProducts || 0}</span>
                <span className="stat-label">Produkty</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{location.stats?.totalPosts || 0}</span>
                <span className="stat-label">Posty</span>
              </div>
            </div>
          </div>

          {/* Oceny */}
          <div className="ratings-section">
            <div className="ratings-header">
              <h4>Oceny</h4>
              {user && (
                <button 
                  className="rate-btn"
                  onClick={() => setShowRatingForm(!showRatingForm)}
                >
                  {userRating ? 'Edytuj ocenę' : 'Dodaj ocenę'}
                </button>
              )}
            </div>

            {location.stats?.averageRating > 0 && (
              <div className="average-rating">
                <div className="stars">{renderStars(Math.round(location.stats.averageRating))}</div>
                <span className="rating-text">
                  {location.stats.averageRating.toFixed(1)} ({location.stats.totalRatings} ocen)
                </span>
              </div>
            )}

            {showRatingForm && (
              <form className="rating-form" onSubmit={handleRatingSubmit}>
                <div className="rating-input">
                  <label>Twoja ocena:</label>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        className={`star-btn ${star <= ratingForm.rating ? 'active' : ''}`}
                        onClick={() => setRatingForm(prev => ({ ...prev, rating: star }))}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div className="comment-input">
                  <label>Komentarz (opcjonalnie):</label>
                  <textarea
                    value={ratingForm.comment}
                    onChange={(e) => setRatingForm(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Podziel się swoją opinią..."
                    maxLength={1000}
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="submit-btn">Zapisz ocenę</button>
                  <button type="button" className="cancel-btn" onClick={() => setShowRatingForm(false)}>
                    Anuluj
                  </button>
                </div>
              </form>
            )}

            {/* Lista ocen */}
            <div className="ratings-list">
              {ratings.map(rating => (
                <div key={rating._id} className="rating-item">
                  <div className="rating-header">
                    <span className="user-name">{rating.user.username}</span>
                    <div className="stars">{renderStars(rating.rating)}</div>
                  </div>
                  {rating.comment && (
                    <p className="rating-comment">{rating.comment}</p>
                  )}
                  <span className="rating-date">
                    {new Date(rating.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Rekomendacje */}
          {recommendations.length > 0 && (
            <div className="recommendations-section">
              <h4>Polecane lokalizacje</h4>
              <div className="recommendations-grid">
                {recommendations.map(rec => (
                  <div key={rec._id} className="recommendation-item">
                    <h5>{rec.name}</h5>
                    <p className="rec-type">{rec.type}</p>
                    {rec.description && (
                      <p className="rec-description">{rec.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Akcje */}
          {user && (
            <div className="actions-section">
              <button 
                className={`subscribe-btn ${isSubscribed ? 'subscribed' : ''}`}
                onClick={handleSubscribe}
              >
                {isSubscribed ? 'Anuluj subskrypcję' : 'Subskrybuj'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationDetails; 