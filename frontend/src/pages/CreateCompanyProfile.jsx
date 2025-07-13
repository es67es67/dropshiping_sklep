import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 10px 0;
  color: ${props => props.theme.primary};
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.textSecondary};
  margin: 0;
`;

const Form = styled.form`
  background: ${props => props.theme.cardBackground};
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const FormSection = styled.div`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 20px 0;
  color: ${props => props.theme.primary};
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 0.9rem;
  color: ${props => props.theme.textSecondary};
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const Textarea = styled.textarea`
  padding: 12px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 0.9rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const Button = styled.button`
  padding: 15px 30px;
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  
  &:hover {
    background: ${props => props.theme.primary}dd;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  padding: 15px 30px;
  background: transparent;
  color: ${props => props.theme.textSecondary};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  
  &:hover {
    background: ${props => props.theme.background};
  }
`;

const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 30px;
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.9rem;
  margin-top: 5px;
`;

const SuccessMessage = styled.div`
  color: #10b981;
  font-size: 0.9rem;
  margin-top: 5px;
`;

const industries = [
  'Technologia', 'Finanse', 'Zdrowie', 'Edukacja', 'Handel', 
  'Produkcja', 'Usługi', 'Media', 'Transport', 'Nieruchomości',
  'Turystyka', 'Rolnictwo', 'Energia', 'Budownictwo', 'Inne'
];

const companyTypes = [
  { value: 'startup', label: '🚀 Startup' },
  { value: 'sme', label: '🏢 MŚP' },
  { value: 'corporation', label: '🏭 Korporacja' },
  { value: 'nonprofit', label: '🤝 Organizacja non-profit' },
  { value: 'government', label: '🏛️ Instytucja rządowa' },
  { value: 'freelance', label: '👨‍💻 Freelancer' }
];

const employeeCounts = [
  '1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'
];

const revenues = [
  '<1M', '1M-10M', '10M-50M', '50M-100M', '100M+'
];

export default function CreateCompanyProfile({ theme }) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    legalName: '',
    description: '',
    shortDescription: '',
    companyType: 'sme',
    industry: '',
    subIndustry: '',
    categories: [],
    tags: [],
    contact: {
      email: '',
      phone: '',
      website: '',
      linkedin: '',
      facebook: '',
      twitter: '',
      instagram: ''
    },
    address: {
      street: '',
      houseNumber: '',
      postalCode: '',
      city: '',
      voivodeship: '',
      county: '',
      municipality: '',
      country: 'Polska'
    },
    location: {
      coordinates: {
        lat: null,
        lng: null
      }
    },
    logo: '',
    coverImage: '',
    images: [],
    videos: [],
    companyInfo: {
      foundedYear: '',
      employeeCount: '',
      revenue: '',
      headquarters: '',
      specializations: [],
      certifications: [],
      awards: []
    },
    services: [],
    products: [],
    team: [],
    seo: {
      title: '',
      description: '',
      keywords: []
    },
    settings: {
      allowMessages: true,
      allowReviews: true,
      allowJobApplications: true,
      notifications: {
        email: true,
        sms: false,
        push: true
      }
    }
  });

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/company-profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess('Profil firmy został utworzony pomyślnie!');
        setTimeout(() => {
          navigate(`/company/${data._id}`);
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Wystąpił błąd podczas tworzenia profilu');
      }
    } catch (err) {
      setError('Błąd połączenia z serwerem');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Container theme={theme}>
        <div>Musisz być zalogowany, aby utworzyć profil firmy.</div>
      </Container>
    );
  }

  return (
    <Container theme={theme}>
      <Header>
        <Title theme={theme}>🏢 Utwórz Profil Firmy</Title>
        <Subtitle theme={theme}>
          Stwórz profesjonalny profil swojej firmy i nawiąż wartościowe kontakty biznesowe
        </Subtitle>
      </Header>

      <Form onSubmit={handleSubmit} theme={theme}>
        {/* Podstawowe informacje */}
        <FormSection>
          <SectionTitle theme={theme}>📋 Podstawowe informacje</SectionTitle>
          <FormGrid>
            <FormGroup>
              <Label theme={theme}>Nazwa firmy *</Label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Nazwa Twojej firmy"
                required
                theme={theme}
              />
            </FormGroup>
            
            <FormGroup>
              <Label theme={theme}>Nazwa prawna</Label>
              <Input
                type="text"
                value={formData.legalName}
                onChange={(e) => handleInputChange('legalName', e.target.value)}
                placeholder="Nazwa prawna (jeśli inna)"
                theme={theme}
              />
            </FormGroup>
          </FormGrid>

          <FormGroup>
            <Label theme={theme}>Opis firmy *</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Opisz czym zajmuje się Twoja firma..."
              required
              theme={theme}
            />
          </FormGroup>

          <FormGroup>
            <Label theme={theme}>Krótki opis</Label>
            <Input
              type="text"
              value={formData.shortDescription}
              onChange={(e) => handleInputChange('shortDescription', e.target.value)}
              placeholder="Krótki opis (max 200 znaków)"
              maxLength={200}
              theme={theme}
            />
          </FormGroup>

          <FormGrid>
            <FormGroup>
              <Label theme={theme}>Typ firmy *</Label>
              <Select
                value={formData.companyType}
                onChange={(e) => handleInputChange('companyType', e.target.value)}
                required
                theme={theme}
              >
                {companyTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label theme={theme}>Branża *</Label>
              <Select
                value={formData.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                required
                theme={theme}
              >
                <option value="">Wybierz branżę</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </Select>
            </FormGroup>
          </FormGrid>
        </FormSection>

        {/* Kontakt */}
        <FormSection>
          <SectionTitle theme={theme}>📞 Informacje kontaktowe</SectionTitle>
          <FormGrid>
            <FormGroup>
              <Label theme={theme}>Email *</Label>
              <Input
                type="email"
                value={formData.contact.email}
                onChange={(e) => handleInputChange('contact.email', e.target.value)}
                placeholder="kontakt@firma.pl"
                required
                theme={theme}
              />
            </FormGroup>
            
            <FormGroup>
              <Label theme={theme}>Telefon</Label>
              <Input
                type="tel"
                value={formData.contact.phone}
                onChange={(e) => handleInputChange('contact.phone', e.target.value)}
                placeholder="+48 123 456 789"
                theme={theme}
              />
            </FormGroup>
          </FormGrid>

          <FormGroup>
            <Label theme={theme}>Strona internetowa</Label>
            <Input
              type="url"
              value={formData.contact.website}
              onChange={(e) => handleInputChange('contact.website', e.target.value)}
              placeholder="https://www.firma.pl"
              theme={theme}
            />
          </FormGroup>

          <FormGrid>
            <FormGroup>
              <Label theme={theme}>LinkedIn</Label>
              <Input
                type="url"
                value={formData.contact.linkedin}
                onChange={(e) => handleInputChange('contact.linkedin', e.target.value)}
                placeholder="https://linkedin.com/company/firma"
                theme={theme}
              />
            </FormGroup>
            
            <FormGroup>
              <Label theme={theme}>Facebook</Label>
              <Input
                type="url"
                value={formData.contact.facebook}
                onChange={(e) => handleInputChange('contact.facebook', e.target.value)}
                placeholder="https://facebook.com/firma"
                theme={theme}
              />
            </FormGroup>
          </FormGrid>
        </FormSection>

        {/* Adres */}
        <FormSection>
          <SectionTitle theme={theme}>📍 Adres</SectionTitle>
          <FormGrid>
            <FormGroup>
              <Label theme={theme}>Ulica</Label>
              <Input
                type="text"
                value={formData.address.street}
                onChange={(e) => handleInputChange('address.street', e.target.value)}
                placeholder="ul. Przykładowa"
                theme={theme}
              />
            </FormGroup>
            
            <FormGroup>
              <Label theme={theme}>Numer domu</Label>
              <Input
                type="text"
                value={formData.address.houseNumber}
                onChange={(e) => handleInputChange('address.houseNumber', e.target.value)}
                placeholder="123"
                theme={theme}
              />
            </FormGroup>
          </FormGrid>

          <FormGrid>
            <FormGroup>
              <Label theme={theme}>Kod pocztowy</Label>
              <Input
                type="text"
                value={formData.address.postalCode}
                onChange={(e) => handleInputChange('address.postalCode', e.target.value)}
                placeholder="00-000"
                theme={theme}
              />
            </FormGroup>
            
            <FormGroup>
              <Label theme={theme}>Miasto *</Label>
              <Input
                type="text"
                value={formData.address.city}
                onChange={(e) => handleInputChange('address.city', e.target.value)}
                placeholder="Warszawa"
                required
                theme={theme}
              />
            </FormGroup>
          </FormGrid>

          <FormGrid>
            <FormGroup>
              <Label theme={theme}>Województwo</Label>
              <Input
                type="text"
                value={formData.address.voivodeship}
                onChange={(e) => handleInputChange('address.voivodeship', e.target.value)}
                placeholder="Mazowieckie"
                theme={theme}
              />
            </FormGroup>
            
            <FormGroup>
              <Label theme={theme}>Powiat</Label>
              <Input
                type="text"
                value={formData.address.county}
                onChange={(e) => handleInputChange('address.county', e.target.value)}
                placeholder="Warszawski"
                theme={theme}
              />
            </FormGroup>
          </FormGrid>
        </FormSection>

        {/* Informacje o firmie */}
        <FormSection>
          <SectionTitle theme={theme}>🏢 Informacje o firmie</SectionTitle>
          <FormGrid>
            <FormGroup>
              <Label theme={theme}>Rok założenia</Label>
              <Input
                type="number"
                value={formData.companyInfo.foundedYear}
                onChange={(e) => handleInputChange('companyInfo.foundedYear', e.target.value)}
                placeholder="2020"
                min="1800"
                max={new Date().getFullYear()}
                theme={theme}
              />
            </FormGroup>
            
            <FormGroup>
              <Label theme={theme}>Liczba pracowników</Label>
              <Select
                value={formData.companyInfo.employeeCount}
                onChange={(e) => handleInputChange('companyInfo.employeeCount', e.target.value)}
                theme={theme}
              >
                <option value="">Wybierz</option>
                {employeeCounts.map(count => (
                  <option key={count} value={count}>{count}</option>
                ))}
              </Select>
            </FormGroup>
          </FormGrid>

          <FormGrid>
            <FormGroup>
              <Label theme={theme}>Przychody</Label>
              <Select
                value={formData.companyInfo.revenue}
                onChange={(e) => handleInputChange('companyInfo.revenue', e.target.value)}
                theme={theme}
              >
                <option value="">Wybierz</option>
                {revenues.map(revenue => (
                  <option key={revenue} value={revenue}>{revenue} PLN</option>
                ))}
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label theme={theme}>Siedziba główna</Label>
              <Input
                type="text"
                value={formData.companyInfo.headquarters}
                onChange={(e) => handleInputChange('companyInfo.headquarters', e.target.value)}
                placeholder="Miasto siedziby głównej"
                theme={theme}
              />
            </FormGroup>
          </FormGrid>

          <FormGroup>
            <Label theme={theme}>Specjalizacje</Label>
            <Input
              type="text"
              placeholder="np. e-commerce, mobile apps, AI (oddzielone przecinkami)"
              theme={theme}
            />
          </FormGroup>
        </FormSection>

        {/* SEO */}
        <FormSection>
          <SectionTitle theme={theme}>🔍 SEO</SectionTitle>
          <FormGroup>
            <Label theme={theme}>Tytuł SEO</Label>
            <Input
              type="text"
              value={formData.seo.title}
              onChange={(e) => handleInputChange('seo.title', e.target.value)}
              placeholder="Tytuł strony w wyszukiwarce"
              theme={theme}
            />
          </FormGroup>

          <FormGroup>
            <Label theme={theme}>Opis SEO</Label>
            <Textarea
              value={formData.seo.description}
              onChange={(e) => handleInputChange('seo.description', e.target.value)}
              placeholder="Opis firmy dla wyszukiwarek"
              theme={theme}
            />
          </FormGroup>

          <FormGroup>
            <Label theme={theme}>Słowa kluczowe</Label>
            <Input
              type="text"
              placeholder="słowo kluczowe 1, słowo kluczowe 2, słowo kluczowe 3"
              theme={theme}
            />
          </FormGroup>
        </FormSection>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <ButtonGroup>
          <CancelButton
            type="button"
            onClick={() => navigate('/company-profiles')}
            theme={theme}
          >
            ❌ Anuluj
          </CancelButton>
          <Button
            type="submit"
            disabled={loading}
            theme={theme}
          >
            {loading ? '🔄 Tworzenie...' : '✅ Utwórz profil firmy'}
          </Button>
        </ButtonGroup>
      </Form>
    </Container>
  );
} 