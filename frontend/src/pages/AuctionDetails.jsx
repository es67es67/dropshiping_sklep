import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const BackButton = styled(Link)`
  display: inline-block;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.primary};
  text-decoration: none;
  font-weight: 600;
`;

const AuctionBox = styled.div`
  display: flex;
  gap: 2rem;
  background: ${props => props.theme.surface};
  border-radius: 16px;
  box-shadow: ${props => props.theme.shadow};
  padding: 2rem;
  margin-bottom: 2rem;
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem;
  }
`;

const ImageGallery = styled.div`
  width: 400px;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const MainImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 12px;
  background: #f0f0f0;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.02);
  }
`;

const ThumbnailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid ${props => props.active ? props.theme.primary : 'transparent'};
  transition: all 0.2s;
  
  &:hover {
    border-color: ${props => props.theme.primary};
  }
`;

const Info = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
`;

const CurrentPrice = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.theme.primary};
`;

const StartPrice = styled.div`
  font-size: 1.2rem;
  color: ${props => props.theme.textSecondary};
  text-decoration: line-through;
`;

const TimeLeft = styled.div`
  font-size: 1.1rem;
  color: ${props => props.theme.warning};
  font-weight: 600;
`;

const Description = styled.p`
  color: ${props => props.theme.textSecondary};
  line-height: 1.6;
`;

const Label = styled.span`
  font-weight: 600;
  color: ${props => props.theme.textPrimary};
`;

const SellerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${props => props.theme.background};
  border-radius: 8px;
  margin: 1rem 0;
`;

const SellerName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.textPrimary};
`;

const SellerRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Stars = styled.span`
  color: #ffd700;
`;

const ContactButton = styled.button`
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
  
  &:hover {
    background: ${props => props.theme.primaryDark};
  }
`;

const BiddingSection = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 12px;
  padding: 2rem;
  margin: 2rem 0;
  border: 2px solid ${props => props.theme.primary};
`;

const BidForm = styled.form`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin: 1rem 0;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const BidInput = styled.input`
  padding: 0.75rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  min-width: 150px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const BidButton = styled.button`
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: ${props => props.theme.primaryDark};
  }
  
  &:disabled {
    background: ${props => props.theme.textSecondary};
    cursor: not-allowed;
  }
`;

const MinBid = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.textSecondary};
  margin-top: 0.5rem;
`;

const BidsHistory = styled.div`
  margin-top: 2rem;
`;

const BidItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid ${props => props.theme.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const Bidder = styled.div`
  font-weight: 600;
  color: ${props => props.theme.textPrimary};
`;

const BidAmount = styled.div`
  font-weight: 700;
  color: ${props => props.theme.primary};
`;

const BidTime = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.textSecondary};
`;

const DetailsSection = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 12px;
  padding: 2rem;
  margin: 2rem 0;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid ${props => props.theme.border};
`;

const TabButton = styled.button`
  background: none;
  border: none;
  padding: 1rem 1.5rem;
  font-weight: 600;
  color: ${props => props.active ? props.theme.primary : props.theme.textSecondary};
  border-bottom: 3px solid ${props => props.active ? props.theme.primary : 'transparent'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: ${props => props.theme.primary};
  }
`;

const TabContent = styled.div`
  min-height: 200px;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalImage = styled.img`
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  border-radius: 8px;
`;

const ModalClose = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function AuctionDetails({ theme }) {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [bidding, setBidding] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    fetchAuction();
    const interval = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [id]);

  const fetchAuction = async () => {
    try {
      const response = await fetch(`/api/marketplace/${id}`);
      if (response.ok) {
        const data = await response.json();
        setAuction(data);
        updateTimeLeft(data);
      } else {
        console.error('Błąd podczas pobierania aukcji');
      }
    } catch (error) {
      console.error('Błąd:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTimeLeft = (auctionData = auction) => {
    if (!auctionData?.auction?.endTime) return;
    
    const now = new Date().getTime();
    const endTime = new Date(auctionData.auction.endTime).getTime();
    const difference = endTime - now;
    
    if (difference <= 0) {
      setTimeLeft('Aukcja zakończona');
      return;
    }
    
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
  };

  const handleBid = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Musisz być zalogowany, aby licytować');
      return;
    }
    
    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= auction.auction.currentPrice) {
      alert('Oferta musi być wyższa niż aktualna cena');
      return;
    }
    
    setBidding(true);
    try {
      const response = await fetch(`/api/marketplace/${id}/bid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ amount })
      });
      
      if (response.ok) {
        alert('Oferta została złożona!');
        setBidAmount('');
        fetchAuction(); // Odśwież dane aukcji
      } else {
        const error = await response.json();
        alert(error.message || 'Błąd podczas składania oferty');
      }
    } catch (error) {
      console.error('Błąd:', error);
      alert('Błąd podczas składania oferty');
    } finally {
      setBidding(false);
    }
  };

  const handleImageClick = (index) => {
    setSelectedImage(index);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (loading) {
    return (
      <Container>
        <div>Ładowanie aukcji...</div>
      </Container>
    );
  }

  if (!auction) {
    return (
      <Container>
        <div>Aukcja nie została znaleziona</div>
      </Container>
    );
  }

  const images = auction.images || [auction.mainImage].filter(Boolean);
  const minBid = auction.auction.currentPrice + (auction.auction.minIncrement || 1);
  const isAuctionActive = auction.auction.isActive && new Date(auction.auction.endTime) > new Date();

  return (
    <Container>
      <BackButton to="/market">← Wróć do giełdy</BackButton>
      
      <AuctionBox>
        <ImageGallery>
          <MainImage 
            src={images[selectedImage] || 'https://via.placeholder.com/400x300'} 
            alt={auction.name}
            onClick={() => setShowModal(true)}
          />
          {images.length > 1 && (
            <ThumbnailGrid>
              {images.map((image, index) => (
                <Thumbnail
                  key={index}
                  src={image}
                  alt={`${auction.name} - zdjęcie ${index + 1}`}
                  active={index === selectedImage}
                  onClick={() => handleImageClick(index)}
                />
              ))}
            </ThumbnailGrid>
          )}
        </ImageGallery>
        
        <Info>
          <Title>{auction.name}</Title>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <CurrentPrice theme={theme}>{auction.auction.currentPrice} zł</CurrentPrice>
            {auction.auction.startPrice !== auction.auction.currentPrice && (
              <StartPrice theme={theme}>Start: {auction.auction.startPrice} zł</StartPrice>
            )}
          </div>
          
          <TimeLeft theme={theme}>⏰ {timeLeft}</TimeLeft>
          
          <Description theme={theme}>{auction.description}</Description>
          
          <div><Label theme={theme}>Kategoria:</Label> {auction.category}</div>
          {auction.brand && <div><Label theme={theme}>Marka:</Label> {auction.brand}</div>}
          <div><Label theme={theme}>Stan:</Label> {auction.condition}</div>
          <div><Label theme={theme}>Lokalizacja:</Label> {auction.location.city}</div>
          
          <SellerInfo theme={theme}>
            <SellerName theme={theme}>Sprzedawca: {auction.seller?.username || 'Nieznany'}</SellerName>
            <SellerRating>
              <Stars>★★★★☆</Stars>
              <span>4.2 (156 opinii)</span>
            </SellerRating>
            <ContactButton theme={theme}>💬 Skontaktuj się</ContactButton>
          </SellerInfo>
          
          {isAuctionActive && (
            <BiddingSection theme={theme}>
              <h3>🎯 Złóż ofertę</h3>
              <BidForm onSubmit={handleBid}>
                <BidInput
                  theme={theme}
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder={`Min. ${minBid} zł`}
                  min={minBid}
                  step="0.01"
                />
                <BidButton 
                  theme={theme}
                  type="submit"
                  disabled={bidding || !bidAmount}
                >
                  {bidding ? 'Składanie oferty...' : 'Złóż ofertę'}
                </BidButton>
              </BidForm>
              <MinBid theme={theme}>
                Minimalna oferta: {minBid} zł
              </MinBid>
            </BiddingSection>
          )}
        </Info>
      </AuctionBox>

      {/* Historia ofert */}
      {auction.auction.bids && auction.auction.bids.length > 0 && (
        <BidsHistory>
          <h3>📊 Historia ofert ({auction.auction.bids.length})</h3>
          {auction.auction.bids.slice().reverse().map((bid, index) => (
            <BidItem key={index} theme={theme}>
              <div>
                <Bidder theme={theme}>
                  {bid.bidder === user?._id ? 'Ty' : `Użytkownik ${bid.bidder?.username || 'Anonim'}`}
                </Bidder>
                <BidTime theme={theme}>
                  {new Date(bid.timestamp).toLocaleString()}
                </BidTime>
              </div>
              <BidAmount theme={theme}>{bid.amount} zł</BidAmount>
            </BidItem>
          ))}
        </BidsHistory>
      )}

      {/* Szczegóły aukcji */}
      <DetailsSection theme={theme}>
        <TabsContainer theme={theme}>
          <TabButton 
            theme={theme}
            active={activeTab === 'description'}
            onClick={() => handleTabChange('description')}
          >
            Opis
          </TabButton>
          <TabButton 
            theme={theme}
            active={activeTab === 'specifications'}
            onClick={() => handleTabChange('specifications')}
          >
            Specyfikacja
          </TabButton>
          <TabButton 
            theme={theme}
            active={activeTab === 'auction'}
            onClick={() => handleTabChange('auction')}
          >
            Szczegóły aukcji
          </TabButton>
        </TabsContainer>
        
        <TabContent>
          {activeTab === 'description' && (
            <div>
              <h3>Opis produktu</h3>
              <p>{auction.description}</p>
              {auction.tags && auction.tags.length > 0 && (
                <div>
                  <h4>Tagi:</h4>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {auction.tags.map((tag, index) => (
                      <span key={index} style={{ 
                        background: theme.primary, 
                        color: 'white', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '4px',
                        fontSize: '0.8rem'
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'specifications' && (
            <div>
              <h3>Specyfikacja techniczna</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee', fontWeight: '600' }}>Kategoria</td>
                    <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>{auction.category}</td>
                  </tr>
                  {auction.brand && (
                    <tr>
                      <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee', fontWeight: '600' }}>Marka</td>
                      <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>{auction.brand}</td>
                    </tr>
                  )}
                  <tr>
                    <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee', fontWeight: '600' }}>Stan</td>
                    <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>{auction.condition}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee', fontWeight: '600' }}>Lokalizacja</td>
                    <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>{auction.location.city}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          
          {activeTab === 'auction' && (
            <div>
              <h3>Szczegóły aukcji</h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <h4>💰 Cena początkowa</h4>
                  <p>{auction.auction.startPrice} zł</p>
                </div>
                <div>
                  <h4>📈 Aktualna cena</h4>
                  <p>{auction.auction.currentPrice} zł</p>
                </div>
                <div>
                  <h4>⏰ Czas zakończenia</h4>
                  <p>{new Date(auction.auction.endTime).toLocaleString()}</p>
                </div>
                <div>
                  <h4>📊 Liczba ofert</h4>
                  <p>{auction.auction.bids?.length || 0}</p>
                </div>
                <div>
                  <h4>👤 Licytujący</h4>
                  <p>{new Set(auction.auction.bids?.map(bid => bid.bidder) || []).size}</p>
                </div>
              </div>
            </div>
          )}
        </TabContent>
      </DetailsSection>

      {/* Modal dla galerii */}
      {showModal && (
        <Modal onClick={handleModalClose}>
          <ModalImage 
            src={images[selectedImage] || 'https://via.placeholder.com/400x300'} 
            alt={auction.name}
            onClick={(e) => e.stopPropagation()}
          />
          <ModalClose onClick={handleModalClose}>×</ModalClose>
        </Modal>
      )}
    </Container>
  );
} 