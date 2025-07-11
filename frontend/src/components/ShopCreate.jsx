import React, { useState } from 'react';
import styled from 'styled-components';
import MapSelector from './MapSelector';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 2rem;
  background: ${props => props.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Form = styled.form`
  background: ${props => props.theme.surface};
  border-radius: 20px;
  padding: 2rem;
  box-shadow: ${props => props.theme.shadow};
`;

const FormSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: ${props => props.theme.text};
  font-size: 0.875rem;
`;

const Input = styled.input`
  padding: 1rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}20;
  }
  
  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }
`;

const TextArea = styled.textarea`
  padding: 1rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  transition: all 0.2s ease;
  resize: vertical;
  min-height: 120px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}20;
  }
  
  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }
`;

const Select = styled.select`
  padding: 1rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}20;
  }
`;

const LogoUpload = styled.div`
  border: 2px dashed ${props => props.theme.border};
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.primary};
    background: ${props => props.theme.primary}05;
  }
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.textSecondary};
`;

const UploadText = styled.div`
  color: ${props => props.theme.textSecondary};
  margin-bottom: 0.5rem;
`;

const UploadHint = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
`;

const LogoPreview = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 12px;
  overflow: hidden;
  background: ${props => props.theme.background};
  border: 2px solid ${props => props.theme.border};
  margin: 1rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CategoriesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const Category = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${props => props.selected ? props.theme.primary : props.theme.background};
  color: ${props => props.selected ? 'white' : props.theme.text};
  border: 2px solid ${props => props.selected ? props.theme.primary : props.theme.border};
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.primary};
    background: ${props => props.selected ? props.theme.primary : props.theme.primary}10;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  flex: 1;
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.primary {
    background: ${props => props.theme.gradient};
    color: white;
    
    &:hover {
      background: ${props => props.theme.gradientHover};
      transform: translateY(-2px);
      box-shadow: ${props => props.theme.shadowHover};
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
  }
  
  &.secondary {
    background: ${props => props.theme.background};
    color: ${props => props.theme.text};
    border: 2px solid ${props => props.theme.border};
    
    &:hover {
      background: ${props => props.theme.border};
    }
  }
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.error};
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const SuccessMessage = styled.div`
  color: ${props => props.theme.success};
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

export default function ShopCreate({ theme }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    email: '',
    website: '',
    openingHours: '',
    deliveryOptions: [],
    paymentMethods: []
  });
  const [coordinates, setCoordinates] = useState(null);
  
  const [logo, setLogo] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Elektronika',
    'Odzież i moda',
    'Książki i multimedia',
    'Sport i rekreacja',
    'Dom i ogród',
    'Motoryzacja',
    'Zdrowie i uroda',
    'Zabawki i gry',
    'Spożywcze',
    'Inne'
  ];

  const deliveryOptions = [
    'Dostawa kurierem',
    'Odbiór osobisty',
    'Poczta polska',
    'Paczkomaty',
    'Dostawa w dniu zamówienia'
  ];

  const paymentMethods = [
    'Płatność online',
    'Płatność przy odbiorze',
    'Przelew bankowy',
    'Karta kredytowa',
    'PayPal',
    'BLIK'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleLocationSelect = (coords, address) => {
    setCoordinates(coords);
    // Automatycznie wypełnij adres z mapy
    if (address) {
      setFormData(prev => ({
        ...prev,
        address: address
      }));
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo({
        file,
        preview: URL.createObjectURL(file)
      });
    }
  };

  const toggleDeliveryOption = (option) => {
    setFormData({
      ...formData,
      deliveryOptions: formData.deliveryOptions.includes(option)
        ? formData.deliveryOptions.filter(o => o !== option)
        : [...formData.deliveryOptions, option]
    });
  };

  const togglePaymentMethod = (method) => {
    setFormData({
      ...formData,
      paymentMethods: formData.paymentMethods.includes(method)
        ? formData.paymentMethods.filter(m => m !== method)
        : [...formData.paymentMethods, method]
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Nazwa sklepu jest wymagana';
    if (!formData.description.trim()) newErrors.description = 'Opis sklepu jest wymagany';
    if (!formData.category) newErrors.category = 'Kategoria jest wymagana';
    if (!formData.address.trim()) newErrors.address = 'Adres jest wymagany';
    if (!formData.city.trim()) newErrors.city = 'Miasto jest wymagane';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Kod pocztowy jest wymagany';
    if (!formData.phone.trim()) newErrors.phone = 'Telefon jest wymagany';
    if (!formData.email.trim()) newErrors.email = 'Email jest wymagany';
    if (formData.deliveryOptions.length === 0) newErrors.deliveryOptions = 'Wybierz przynajmniej jedną opcję dostawy';
    if (formData.paymentMethods.length === 0) newErrors.paymentMethods = 'Wybierz przynajmniej jedną metodę płatności';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');
      
      console.log('Tworzenie sklepu...');
      console.log('API URL:', apiUrl);
      console.log('Token available:', !!token);
      
      // Przygotuj dane do wysłania
      const shopData = {
        name: formData.name,
        description: formData.description,
        categories: [formData.category],
        address: {
          street: formData.address,
          city: formData.city,
          postalCode: formData.postalCode
        },
        location: formData.city, // Użyj miasta jako lokalizacji
        coordinates: coordinates, // Dodaj koordynaty z mapy
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        openingHours: formData.openingHours,
        deliveryOptions: formData.deliveryOptions.map(option => ({
          type: option,
          description: `Dostawa ${option}`,
          cost: 0
        })),
        paymentMethods: formData.paymentMethods
      };

      console.log('Dane sklepu:', shopData);

      const response = await fetch(`${apiUrl}/api/shops`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(shopData)
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.error || 'Nie udało się utworzyć sklepu');
      }

      const result = await response.json();
      console.log('Sklep utworzony:', result);
      
      setIsSubmitting(false);
      alert('✅ Sklep został dodany pomyślnie!');
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        category: '',
        address: '',
        city: '',
        postalCode: '',
        phone: '',
        email: '',
        website: '',
        openingHours: '',
        deliveryOptions: [],
        paymentMethods: []
      });
      setLogo(null);
      setCoordinates(null);
      
      // Przekieruj do zarządzania sklepami
      window.location.href = '/shop-management';
      
    } catch (error) {
      console.error('Błąd podczas tworzenia sklepu:', error);
      setIsSubmitting(false);
      alert('❌ Błąd podczas tworzenia sklepu: ' + error.message);
    }
  };

  const handleReset = () => {
    if (window.confirm('Czy na pewno chcesz zresetować formularz?')) {
      setFormData({
        name: '',
        description: '',
        category: '',
        address: '',
        city: '',
        postalCode: '',
        phone: '',
        email: '',
        website: '',
        openingHours: '',
        deliveryOptions: [],
        paymentMethods: []
      });
      setLogo(null);
      setErrors({});
    }
  };

  return (
    <Container>
      <Title>Dodaj nowy sklep</Title>
      
      <Form onSubmit={handleSubmit}>
        <FormSection>
          <SectionTitle>🏪 Podstawowe informacje</SectionTitle>
          <FormGrid>
            <FormRow>
              <Label>Nazwa sklepu *</Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Wprowadź nazwę sklepu"
              />
              {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
            </FormRow>
            
            <FormRow>
              <Label>Kategoria *</Label>
              <Select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="">Wybierz kategorię</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </Select>
              {errors.category && <ErrorMessage>{errors.category}</ErrorMessage>}
            </FormRow>
          </FormGrid>
          
          <FormRow>
            <Label>Opis sklepu *</Label>
            <TextArea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Opisz swój sklep, oferowane produkty i usługi..."
            />
            {errors.description && <ErrorMessage>{errors.description}</ErrorMessage>}
          </FormRow>
        </FormSection>

        <FormSection>
          <SectionTitle>📍 Lokalizacja i dane kontaktowe</SectionTitle>
          
          <FormRow>
            <Label>Wybierz lokalizację na mapie *</Label>
            <MapSelector 
              onLocationSelect={handleLocationSelect}
              initialAddress={formData.address}
              theme={theme}
            />
          </FormRow>
          
          <FormGrid>
            <FormRow>
              <Label>Adres *</Label>
              <Input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Ulica i numer"
              />
              {errors.address && <ErrorMessage>{errors.address}</ErrorMessage>}
            </FormRow>
            
            <FormRow>
              <Label>Miasto *</Label>
              <Input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Nazwa miasta"
              />
              {errors.city && <ErrorMessage>{errors.city}</ErrorMessage>}
            </FormRow>
            
            <FormRow>
              <Label>Kod pocztowy *</Label>
              <Input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                placeholder="00-000"
              />
              {errors.postalCode && <ErrorMessage>{errors.postalCode}</ErrorMessage>}
            </FormRow>
            
            <FormRow>
              <Label>Telefon *</Label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+48 123 456 789"
              />
              {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
            </FormRow>
            
            <FormRow>
              <Label>Email *</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="kontakt@sklep.pl"
              />
              {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
            </FormRow>
            
            <FormRow>
              <Label>Strona internetowa</Label>
              <Input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://www.sklep.pl"
              />
            </FormRow>
          </FormGrid>
          
          <FormRow>
            <Label>Godziny otwarcia</Label>
            <Input
              type="text"
              name="openingHours"
              value={formData.openingHours}
              onChange={handleInputChange}
              placeholder="np. Pon-Pt 9:00-18:00, Sob 9:00-14:00"
            />
          </FormRow>
        </FormSection>

        <FormSection>
          <SectionTitle>🚚 Opcje dostawy *</SectionTitle>
          <CategoriesContainer>
            {deliveryOptions.map(option => (
              <Category
                key={option}
                selected={formData.deliveryOptions.includes(option)}
                onClick={() => toggleDeliveryOption(option)}
              >
                {option}
              </Category>
            ))}
          </CategoriesContainer>
          {errors.deliveryOptions && <ErrorMessage>{errors.deliveryOptions}</ErrorMessage>}
        </FormSection>

        <FormSection>
          <SectionTitle>💳 Metody płatności *</SectionTitle>
          <CategoriesContainer>
            {paymentMethods.map(method => (
              <Category
                key={method}
                selected={formData.paymentMethods.includes(method)}
                onClick={() => togglePaymentMethod(method)}
              >
                {method}
              </Category>
            ))}
          </CategoriesContainer>
          {errors.paymentMethods && <ErrorMessage>{errors.paymentMethods}</ErrorMessage>}
        </FormSection>

        <FormSection>
          <SectionTitle>🖼️ Logo sklepu</SectionTitle>
          <LogoUpload>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              style={{ display: 'none' }}
              id="logo-upload"
            />
            <label htmlFor="logo-upload">
              <UploadIcon>📷</UploadIcon>
              <UploadText>Kliknij aby dodać logo</UploadText>
              <UploadHint>Format JPG/PNG, maksymalnie 2MB</UploadHint>
            </label>
          </LogoUpload>
          
          {logo && (
            <LogoPreview>
              <img
                src={logo.preview}
                alt="Logo preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </LogoPreview>
          )}
        </FormSection>

        <ButtonGroup>
          <Button type="submit" className="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Dodawanie...' : 'Dodaj sklep'}
          </Button>
          <Button type="button" className="secondary" onClick={handleReset}>
            Resetuj
          </Button>
        </ButtonGroup>
      </Form>
    </Container>
  );
} 