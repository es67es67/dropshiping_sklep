import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const ProfileContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
`;

const Header = styled.div`
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 40px 30px;
  margin-bottom: 30px;
  color: white;
  overflow: hidden;
`;

const CoverImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: ${props => props.image ? `url(${props.image})` : 'none'};
  background-size: cover;
  background-position: center;
  opacity: 0.3;
  z-index: 1;
`;

const HeaderContent = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  align-items: flex-end;
  gap: 30px;
`;

const Logo = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${props => props.image ? `url(${props.image})` : '#fff'};
  background-size: cover;
  background-position: center;
  border: 4px solid white;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  flex-shrink: 0;
`;

const CompanyInfo = styled.div`
  flex: 1;
`;

const CompanyName = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 10px 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
`;

const CompanyDescription = styled.p`
  font-size: 1.1rem;
  margin: 0 0 15px 0;
  opacity: 0.9;
  line-height: 1.5;
`;

const CompanyMeta = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  opacity: 0.8;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  
  &.primary {
    background: #0073b1;
    color: white;
    
    &:hover {
      background: #005885;
    }
  }
  
  &.secondary {
    background: rgba(255,255,255,0.2);
    color: white;
    border: 1px solid rgba(255,255,255,0.3);
    
    &:hover {
      background: rgba(255,255,255,0.3);
    }
  }
  
  &.outline {
    background: transparent;
    color: white;
    border: 2px solid white;
    
    &:hover {
      background: rgba(255,255,255,0.1);
    }
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Section = styled.div`
  background: ${props => props.theme.cardBackground};
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 20px 0;
  color: ${props => props.theme.primary};
  display: flex;
  align-items: center;
  gap: 10px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
`;

const StatCard = styled.div`
  text-align: center;
  padding: 15px;
  background: ${props => props.theme.background};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.primary};
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`;

const TeamMember = styled.div`
  text-align: center;
  padding: 20px;
  background: ${props => props.theme.background};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
`;

const MemberPhoto = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${props => props.image ? `url(${props.image})` : '#e0e0e0'};
  background-size: cover;
  background-position: center;
  margin: 0 auto 15px;
`;

const MemberName = styled.div`
  font-weight: 600;
  margin-bottom: 5px;
`;

const MemberPosition = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.textSecondary};
`;

const PostsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const PostCard = styled.div`
  background: ${props => props.theme.background};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
  padding: 20px;
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
`;

const PostTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
`;

const PostDate = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.textSecondary};
`;

const PostContent = styled.p`
  line-height: 1.6;
  margin: 0 0 15px 0;
`;

const PostTags = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  background: ${props => props.theme.primary}20;
  color: ${props => props.theme.primary};
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
`;

const JobOffersGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const JobCard = styled.div`
  background: ${props => props.theme.background};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
  padding: 20px;
`;

const JobTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 10px 0;
  color: ${props => props.theme.primary};
`;

const JobMeta = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 10px;
  font-size: 0.9rem;
  color: ${props => props.theme.textSecondary};
`;

const JobDescription = styled.p`
  line-height: 1.5;
  margin: 0 0 15px 0;
`;

const ReviewsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ReviewCard = styled.div`
  background: ${props => props.theme.background};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
  padding: 20px;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const ReviewAuthor = styled.div`
  font-weight: 600;
`;

const ReviewRating = styled.div`
  display: flex;
  gap: 2px;
`;

const Star = styled.span`
  color: ${props => props.filled ? '#ffd700' : '#e0e0e0'};
`;

const ReviewContent = styled.p`
  line-height: 1.5;
  margin: 0;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${props => props.theme.textSecondary};
`;

export default function CompanyProfile({ companyId, theme }) {
  const { user, isAuthenticated } = useAuth();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    if (companyId) {
      fetchCompanyProfile();
    }
  }, [companyId]);

  const fetchCompanyProfile = async () => {
    try {
      const response = await fetch(`/api/company-profiles/${companyId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCompany(data);
        setIsFollowing(data.followers?.some(f => f._id === user?._id) || false);
      }
    } catch (error) {
      console.error('Błąd pobierania profilu firmy:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      const response = await fetch(`/api/company-profiles/${companyId}/follow`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsFollowing(data.isFollowing);
        setCompany(prev => ({
          ...prev,
          stats: { ...prev.stats, followers: data.followersCount }
        }));
      }
    } catch (error) {
      console.error('Błąd obserwowania firmy:', error);
    }
  };

  const handleApplyForJob = async (jobId) => {
    try {
      const response = await fetch(`/api/company-profiles/${companyId}/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          coverLetter: 'Zainteresowany ofertą pracy',
          resume: 'CV dostępne na profilu'
        })
      });
      
      if (response.ok) {
        alert('Aplikacja została wysłana!');
      }
    } catch (error) {
      console.error('Błąd aplikowania na ofertę:', error);
    }
  };

  if (loading) {
    return (
      <ProfileContainer theme={theme}>
        <div>Ładowanie profilu firmy...</div>
      </ProfileContainer>
    );
  }

  if (!company) {
    return (
      <ProfileContainer theme={theme}>
        <div>Nie znaleziono profilu firmy</div>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer theme={theme}>
      <Header>
        <CoverImage image={company.coverImage} />
        <HeaderContent>
          <Logo image={company.logo} />
          <CompanyInfo>
            <CompanyName>{company.name}</CompanyName>
            <CompanyDescription>{company.shortDescription}</CompanyDescription>
            <CompanyMeta>
              <MetaItem>
                📍 {company.address?.city}, {company.address?.voivodeship}
              </MetaItem>
              <MetaItem>
                🏢 {company.companyType}
              </MetaItem>
              <MetaItem>
                👥 {company.companyInfo?.employeeCount} pracowników
              </MetaItem>
              <MetaItem>
                ⭐ {company.stats?.averageRating?.toFixed(1)} ({company.stats?.totalReviews} recenzji)
              </MetaItem>
            </CompanyMeta>
            <ActionButtons>
              <Button 
                className={isFollowing ? 'secondary' : 'primary'}
                onClick={handleFollow}
              >
                {isFollowing ? '✓ Obserwujesz' : '+ Obserwuj'}
              </Button>
              <Button className="outline">
                💬 Wiadomość
              </Button>
              {company.owner?._id === user?._id && (
                <Button className="outline">
                  ✏️ Edytuj profil
                </Button>
              )}
            </ActionButtons>
          </CompanyInfo>
        </HeaderContent>
      </Header>

      <ContentGrid>
        <MainContent>
          <Section theme={theme}>
            <SectionTitle>📊 Statystyki</SectionTitle>
            <StatsGrid>
              <StatCard theme={theme}>
                <StatValue theme={theme}>{company.stats?.followers || 0}</StatValue>
                <StatLabel theme={theme}>Obserwujących</StatLabel>
              </StatCard>
              <StatCard theme={theme}>
                <StatValue theme={theme}>{company.stats?.profileViews || 0}</StatValue>
                <StatLabel theme={theme}>Wyświetleń</StatLabel>
              </StatCard>
              <StatCard theme={theme}>
                <StatValue theme={theme}>{company.stats?.applications || 0}</StatValue>
                <StatLabel theme={theme}>Aplikacji</StatLabel>
              </StatCard>
              <StatCard theme={theme}>
                <StatValue theme={theme}>{company.stats?.projectsCompleted || 0}</StatValue>
                <StatLabel theme={theme}>Projektów</StatLabel>
              </StatCard>
            </StatsGrid>
          </Section>

          <Section theme={theme}>
            <SectionTitle>👥 Zespół</SectionTitle>
            {company.team && company.team.length > 0 ? (
              <TeamGrid>
                {company.team.map((member, index) => (
                  <TeamMember key={index} theme={theme}>
                    <MemberPhoto image={member.photo} />
                    <MemberName>{member.name}</MemberName>
                    <MemberPosition theme={theme}>{member.position}</MemberPosition>
                  </TeamMember>
                ))}
              </TeamGrid>
            ) : (
              <EmptyState theme={theme}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
                <h3>Brak informacji o zespole</h3>
                <p>Firma nie dodała jeszcze informacji o swoim zespole.</p>
              </EmptyState>
            )}
          </Section>

          <Section theme={theme}>
            <SectionTitle>📝 Posty firmowe</SectionTitle>
            {company.posts && company.posts.length > 0 ? (
              <PostsGrid>
                {company.posts.slice(0, 5).map((post, index) => (
                  <PostCard key={index} theme={theme}>
                    <PostHeader>
                      <PostTitle>{post.title}</PostTitle>
                      <PostDate theme={theme}>
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </PostDate>
                    </PostHeader>
                    <PostContent>{post.content}</PostContent>
                    {post.tags && post.tags.length > 0 && (
                      <PostTags>
                        {post.tags.map((tag, tagIndex) => (
                          <Tag key={tagIndex} theme={theme}>{tag}</Tag>
                        ))}
                      </PostTags>
                    )}
                  </PostCard>
                ))}
              </PostsGrid>
            ) : (
              <EmptyState theme={theme}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
                <h3>Brak postów firmowych</h3>
                <p>Firma nie opublikowała jeszcze żadnych postów.</p>
              </EmptyState>
            )}
          </Section>

          <Section theme={theme}>
            <SectionTitle>💼 Oferty pracy</SectionTitle>
            {company.jobOffers && company.jobOffers.filter(job => job.isActive).length > 0 ? (
              <JobOffersGrid>
                {company.jobOffers.filter(job => job.isActive).slice(0, 3).map((job, index) => (
                  <JobCard key={index} theme={theme}>
                    <JobTitle>{job.title}</JobTitle>
                    <JobMeta theme={theme}>
                      <span>📍 {job.location}</span>
                      <span>💰 {job.salary?.min}-{job.salary?.max} {job.salary?.currency}</span>
                      <span>⏰ {job.type}</span>
                    </JobMeta>
                    <JobDescription>{job.description}</JobDescription>
                    <Button 
                      className="primary"
                      onClick={() => handleApplyForJob(job._id)}
                    >
                      Aplikuj teraz
                    </Button>
                  </JobCard>
                ))}
              </JobOffersGrid>
            ) : (
              <EmptyState theme={theme}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💼</div>
                <h3>Brak aktywnych ofert pracy</h3>
                <p>Firma nie ma obecnie żadnych aktywnych ofert pracy.</p>
              </EmptyState>
            )}
          </Section>

          <Section theme={theme}>
            <SectionTitle>⭐ Recenzje klientów</SectionTitle>
            {company.reviews && company.reviews.length > 0 ? (
              <ReviewsGrid>
                {company.reviews.slice(0, 5).map((review, index) => (
                  <ReviewCard key={index} theme={theme}>
                    <ReviewHeader>
                      <ReviewAuthor>{review.client}</ReviewAuthor>
                      <ReviewRating>
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star key={star} filled={star <= review.rating}>★</Star>
                        ))}
                      </ReviewRating>
                    </ReviewHeader>
                    <ReviewContent>{review.content}</ReviewContent>
                  </ReviewCard>
                ))}
              </ReviewsGrid>
            ) : (
              <EmptyState theme={theme}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⭐</div>
                <h3>Brak recenzji</h3>
                <p>Firma nie ma jeszcze żadnych recenzji od klientów.</p>
              </EmptyState>
            )}
          </Section>
        </MainContent>

        <Sidebar>
          <Section theme={theme}>
            <SectionTitle>ℹ️ O firmie</SectionTitle>
            <div>
              <p><strong>Branża:</strong> {company.industry}</p>
              <p><strong>Typ:</strong> {company.companyType}</p>
              {company.companyInfo?.foundedYear && (
                <p><strong>Założona:</strong> {company.companyInfo.foundedYear}</p>
              )}
              {company.companyInfo?.headquarters && (
                <p><strong>Siedziba:</strong> {company.companyInfo.headquarters}</p>
              )}
            </div>
          </Section>

          <Section theme={theme}>
            <SectionTitle>📞 Kontakt</SectionTitle>
            <div>
              <p><strong>Email:</strong> {company.contact?.email}</p>
              {company.contact?.phone && (
                <p><strong>Telefon:</strong> {company.contact.phone}</p>
              )}
              {company.contact?.website && (
                <p><strong>Strona:</strong> <a href={company.contact.website} target="_blank" rel="noopener noreferrer">{company.contact.website}</a></p>
              )}
            </div>
          </Section>

          <Section theme={theme}>
            <SectionTitle>🏢 Usługi</SectionTitle>
            {company.services && company.services.length > 0 ? (
              <div>
                {company.services.slice(0, 5).map((service, index) => (
                  <div key={index} style={{ marginBottom: '10px' }}>
                    <div style={{ fontWeight: '600' }}>{service.name}</div>
                    <div style={{ fontSize: '0.9rem', color: theme.textSecondary }}>{service.description}</div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState theme={theme}>
                <p>Brak informacji o usługach</p>
              </EmptyState>
            )}
          </Section>
        </Sidebar>
      </ContentGrid>
    </ProfileContainer>
  );
} 