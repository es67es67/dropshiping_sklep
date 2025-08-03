import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlus, FaMapMarkerAlt, FaSave, FaTimes, FaUpload, FaTag, FaSearch } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import PageTitle from './PageTitle';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Form = styled.form.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  background: ${props => props.theme.surface};
  border-radius: 20px;
  padding: 2rem;
  box-shadow: ${props => props.theme.shadow};
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const FormSection = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  background: ${props => props.theme.background};
`;

const SectionTitle = styled.h3.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  font-weight: 600;
  color: ${props => props.theme.text};
  font-size: 0.9rem;
`;

const Input = styled.input.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}20;
  }
  
  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }
`;

const TextArea = styled.textarea.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}20;
  }
  
  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }
`;

const Select = styled.select.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}20;
  }
`;

const Button = styled.button.withConfig({
  shouldForwardProp: (prop) => !['theme', 'variant'].includes(prop)
})`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  ${props => props.variant === 'primary' && `
    background: ${props.theme.primary};
    color: white;
    
    &:hover {
      background: ${props.theme.primary}dd;
    }
    
    &:disabled {
      background: ${props.theme.border};
      cursor: not-allowed;
    }
  `}
  
  ${props => props.variant === 'secondary' && `
    background: ${props.theme.border};
    color: ${props.theme.text};
    
    &:hover {
      background: ${props.theme.border}dd;
    }
  `}
  
  ${props => props.variant === 'danger' && `
    background: #dc3545;
    color: white;
    
    &:hover {
      background: #c82333;
    }
  `}
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const SuccessMessage = styled.div`
  color: #28a745;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const LocationDisplay = styled.div.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  padding: 1rem;
  background: ${props => props.theme.primary}10;
  border: 1px solid ${props => props.theme.primary}30;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const LocationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const LocationText = styled.span.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  color: ${props => props.theme.text};
  font-weight: 500;
`;

const TerytCode = styled.span.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  color: ${props => props.theme.primary};
  font-weight: 600;
  font-family: monospace;
`;

const ImageUpload = styled.div`
  border: 2px dashed ${props => props.theme.border};
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.primary};
    background: ${props => props.theme.primary}05;
  }
`;

const ImagePreview = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const PreviewImage = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid ${props => props.theme.border};
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  
  &:hover {
    background: rgba(0, 0, 0, 0.9);
  }
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const Tag = styled.span.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  background: ${props => props.theme.primary}20;
  color: ${props => props.theme.primary};
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TagInput = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const TagInputField = styled.input.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const LocationModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  background: ${props => props.theme.surface};
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: ${props => props.theme.shadow};
`;

const SearchInput = styled.input.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 1rem;
  margin-bottom: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}20;
  }
`;

const SearchResults = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const LocationItem = styled.div.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.primary}10;
    border-color: ${props => props.theme.primary};
  }
`;

const LocationName = styled.div.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 0.25rem;
`;

const LocationDetails = styled.div.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
`;

const LoadingText = styled.div.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  text-align: center;
  color: ${props => props.theme.textSecondary};
  padding: 1rem;
`;

const AddProduct = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: 1,
    category: '',
    brand: '',
    condition: 'new',
    saleType: 'fixed_price',
    location: {
      voivodeship: '',
      county: '',
      municipality: '',
      city: '',
      terytCode: ''
    },
    images: [],
    tags: []
  });

  const [locationData, setLocationData] = useState({
    voivodeship: '',
    county: '',
    municipality: '',
    city: '',
    terytCode: ''
  });

  const [tagInput, setTagInput] = useState('');

  // Kategorie produktów
  const categories = [
    'Elektronika',
    'Moda',
    'Dom i ogród',
    'Sport',
    'Książki',
    'Motoryzacja',
    'Zdrowie i uroda',
    'Dzieci',
    'Hobby',
    'Inne'
  ];

  // Pobierz dane lokalizacji użytkownika
  useEffect(() => {
    if (user) {
      let userLocation = {
        voivodeship: '',
        county: '',
        municipality: '',
        city: '',
        terytCode: ''
      };
      
      // Sprawdź czy użytkownik ma ustawioną lokalizację
      if (user.location) {
        // Jeśli location jest obiektem z danymi
        if (typeof user.location === 'object' && user.location.name) {
          userLocation = {
            voivodeship: user.location.voivodeship || '',
            county: user.location.county || '',
            municipality: user.location.municipality || '',
            city: user.location.name || '',
            terytCode: user.location.code || ''
          };
        }
      }
      
      // Sprawdź dane TERYT użytkownika
      if (user.teryt) {
        userLocation = {
          ...userLocation,
          terytCode: user.teryt.fullCode || user.teryt.tercCode || ''
        };
      }
      
      // Sprawdź adres użytkownika
      if (user.address && user.address.city) {
        userLocation = {
          ...userLocation,
          city: user.address.city || userLocation.city
        };
      }
      
      setLocationData(userLocation);
      setFormData(prev => ({
        ...prev,
        location: userLocation
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationChange = (newLocation) => {
    setLocationData(newLocation);
    setFormData(prev => ({
      ...prev,
      location: newLocation
    }));
  };

  const searchLocations = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/locations/search?q=${encodeURIComponent(query)}`);
      
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.locations || []);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Błąd podczas wyszukiwania lokalizacji:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocationSelect = (location) => {
    const newLocation = {
      voivodeship: location.wojewodztwo?.name || '',
      county: location.powiat?.name || '',
      municipality: location.gmina?.name || '',
      city: location.name || '',
      terytCode: location.code || ''
    };
    
    handleLocationChange(newLocation);
    setShowLocationModal(false);
    setLocationSearch('');
    setSearchResults([]);
  };

  const openLocationModal = () => {
    setShowLocationModal(true);
    setLocationSearch('');
    setSearchResults([]);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  const removeImage = (id) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== id)
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setMessage({ type: 'error', text: 'Nazwa produktu jest wymagana' });
      return false;
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setMessage({ type: 'error', text: 'Cena musi być większa od 0' });
      return false;
    }
    
    if (!formData.stock || parseInt(formData.stock) < 1) {
      setMessage({ type: 'error', text: 'Ilość dostępna musi być większa od 0' });
      return false;
    }
    
    if (!formData.category) {
      setMessage({ type: 'error', text: 'Wybierz kategorię produktu' });
      return false;
    }
    
    if (!locationData.city) {
      setMessage({ type: 'error', text: 'Wybierz lokalizację produktu' });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      // Najpierw uploaduj zdjęcia
      let imageUrls = [];
      
      if (formData.images.length > 0) {
        const formDataUpload = new FormData();
        formData.images.forEach((img, index) => {
          if (index === 0) {
            formDataUpload.append('mainImage', img.file);
          } else {
            formDataUpload.append('images', img.file);
          }
        });
        
        const uploadResponse = await fetch(`${apiUrl}/api/marketplace/upload-images`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formDataUpload
        });
        
        if (!uploadResponse.ok) {
          const uploadError = await uploadResponse.json();
          throw new Error(uploadError.error || 'Błąd podczas uploadu zdjęć');
        }
        
        const uploadResult = await uploadResponse.json();
        imageUrls = uploadResult.images;
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: formData.category,
        brand: formData.brand,
        condition: formData.condition,
        saleType: formData.saleType,
        location: locationData,
        images: imageUrls,
        tags: formData.tags,
        seller: user._id
      };
      
      const response = await fetch(`${apiUrl}/api/marketplace`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Nie udało się dodać produktu');
      }

      const newProduct = await response.json();
      
      setMessage({ type: 'success', text: 'Produkt został dodany pomyślnie!' });
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: 1,
        category: '',
        brand: '',
        condition: 'new',
        saleType: 'fixed_price',
        location: locationData,
        images: [],
        tags: []
      });
      
    } catch (err) {
      console.error('Błąd podczas dodawania produktu:', err);
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: 1,
      category: '',
      brand: '',
      condition: 'new',
      saleType: 'fixed_price',
      location: locationData,
      images: [],
      tags: []
    });
    setMessage({ type: '', text: '' });
  };

  return (
    <Container>
      <PageTitle 
        title="Dodaj produkt" 
        description="Dodaj nowy produkt do giełdy" 
      />
      
      <Form onSubmit={handleSubmit}>
        {/* Lokalizacja */}
        <FormSection>
          <SectionTitle>
            <FaMapMarkerAlt />
            Lokalizacja produktu
          </SectionTitle>
          
          <LocationDisplay>
            <LocationInfo>
              <FaMapMarkerAlt />
              <LocationText>
                {locationData.city ? 
                  `${locationData.city}, ${locationData.county}, ${locationData.voivodeship}` :
                  'Lokalizacja z profilu użytkownika'
                }
              </LocationText>
            </LocationInfo>
            {locationData.terytCode && (
              <LocationInfo>
                <TerytCode>TERYT: {locationData.terytCode}</TerytCode>
              </LocationInfo>
            )}
          </LocationDisplay>
          
                     <FormRow>
             <Label>Chcesz zmienić lokalizację?</Label>
             <Button 
               type="button" 
               variant="secondary"
               onClick={openLocationModal}
             >
               <FaMapMarkerAlt />
               Zmień lokalizację
             </Button>
           </FormRow>
        </FormSection>

        {/* Podstawowe informacje */}
        <FormSection>
          <SectionTitle>
            <FaPlus />
            Podstawowe informacje
          </SectionTitle>
          
          <FormGrid>
            <FormRow>
              <Label>Nazwa produktu *</Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Wprowadź nazwę produktu"
                required
              />
            </FormRow>
            
            <FormRow>
              <Label>Kategoria *</Label>
              <Select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Wybierz kategorię</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </Select>
            </FormRow>
            
            <FormRow>
              <Label>Cena (zł) *</Label>
              <Input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </FormRow>
            
            <FormRow>
              <Label>Ilość dostępna *</Label>
              <Input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                placeholder="1"
                min="1"
                required
              />
            </FormRow>
            
            <FormRow>
              <Label>Marka</Label>
              <Input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                placeholder="Nazwa marki"
              />
            </FormRow>
            
            <FormRow>
              <Label>Stan</Label>
              <Select
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
              >
                <option value="new">Nowy</option>
                <option value="like_new">Jak nowy</option>
                <option value="good">Dobry</option>
                <option value="acceptable">Akceptowalny</option>
                <option value="used">Używany</option>
              </Select>
            </FormRow>
            
            <FormRow>
              <Label>Typ sprzedaży</Label>
              <Select
                name="saleType"
                value={formData.saleType}
                onChange={handleInputChange}
              >
                <option value="fixed_price">Cena stała</option>
                <option value="auction">Aukcja</option>
                <option value="negotiation">Negocjacja</option>
                <option value="free">Za darmo</option>
              </Select>
            </FormRow>
          </FormGrid>
        </FormSection>

        {/* Opis */}
        <FormSection>
          <SectionTitle>
            <FaPlus />
            Opis produktu
          </SectionTitle>
          
          <FormRow>
            <Label>Opis</Label>
            <TextArea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Opisz swój produkt..."
              rows="5"
            />
          </FormRow>
        </FormSection>

        {/* Tagi */}
        <FormSection>
          <SectionTitle>
            <FaTag />
            Tagi
          </SectionTitle>
          
          <TagInput>
            <TagInputField
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Dodaj tag..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
            <Button 
              type="button" 
              variant="secondary"
              onClick={addTag}
            >
              <FaPlus />
              Dodaj
            </Button>
          </TagInput>
          
          {formData.tags.length > 0 && (
            <TagContainer>
              {formData.tags.map(tag => (
                <Tag key={tag}>
                  {tag}
                  <FaTimes 
                    onClick={() => removeTag(tag)}
                    style={{ cursor: 'pointer' }}
                  />
                </Tag>
              ))}
            </TagContainer>
          )}
        </FormSection>

        {/* Zdjęcia */}
        <FormSection>
          <SectionTitle>
            <FaUpload />
            Zdjęcia produktu
          </SectionTitle>
          
          <ImageUpload>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              id="image-upload"
            />
            <label htmlFor="image-upload" style={{ cursor: 'pointer' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📷</div>
              <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                Kliknij aby dodać zdjęcia
              </div>
              <div style={{ fontSize: '0.875rem', color: '#666' }}>
                Maksymalnie 10 zdjęć, format JPG/PNG
              </div>
            </label>
          </ImageUpload>
          
          {formData.images.length > 0 && (
            <ImagePreview>
              {formData.images.map(image => (
                <PreviewImage key={image.id}>
                  <img
                    src={image.preview}
                    alt="Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <RemoveButton onClick={() => removeImage(image.id)}>×</RemoveButton>
                </PreviewImage>
              ))}
            </ImagePreview>
          )}
        </FormSection>

        {/* Komunikaty */}
        {message.text && (
          <div style={{ 
            padding: '1rem', 
            borderRadius: '8px', 
            marginBottom: '1rem',
            background: message.type === 'error' ? '#f8d7da' : '#d4edda',
            color: message.type === 'error' ? '#721c24' : '#155724',
            border: `1px solid ${message.type === 'error' ? '#f5c6cb' : '#c3e6cb'}`
          }}>
            {message.text}
          </div>
        )}

        {/* Przyciski */}
        <ButtonGroup>
          <Button 
            type="button" 
            variant="secondary"
            onClick={handleReset}
            disabled={isSubmitting}
          >
            <FaTimes />
            Resetuj
          </Button>
          
          <Button 
            type="submit" 
            variant="primary"
            disabled={isSubmitting}
          >
            <FaSave />
            {isSubmitting ? 'Dodawanie...' : 'Dodaj produkt'}
          </Button>
                 </ButtonGroup>
       </Form>

       {/* Modal wyboru lokalizacji */}
       {showLocationModal && (
         <LocationModal onClick={() => setShowLocationModal(false)}>
           <ModalContent onClick={(e) => e.stopPropagation()}>
             <SectionTitle>
               <FaMapMarkerAlt />
               Wybierz lokalizację produktu
             </SectionTitle>
             
             <SearchInput
               type="text"
               placeholder="Wyszukaj miejscowość..."
               value={locationSearch}
               onChange={(e) => {
                 setLocationSearch(e.target.value);
                 searchLocations(e.target.value);
               }}
             />
             
             <SearchResults>
               {isSearching ? (
                 <LoadingText>Wyszukiwanie...</LoadingText>
               ) : searchResults.length > 0 ? (
                 searchResults.map((location) => (
                   <LocationItem
                     key={location._id}
                     onClick={() => handleLocationSelect(location)}
                   >
                     <LocationName>{location.name}</LocationName>
                     <LocationDetails>
                       {location.type} • {location.code}
                     </LocationDetails>
                   </LocationItem>
                 ))
               ) : locationSearch ? (
                 <LoadingText>Nie znaleziono lokalizacji</LoadingText>
               ) : (
                 <LoadingText>Wpisz nazwę miejscowości aby wyszukać</LoadingText>
               )}
             </SearchResults>
             
             <ButtonGroup>
               <Button 
                 type="button" 
                 variant="secondary"
                 onClick={() => setShowLocationModal(false)}
               >
                 <FaTimes />
                 Anuluj
               </Button>
             </ButtonGroup>
           </ModalContent>
         </LocationModal>
       )}
     </Container>
   );
 };

export default AddProduct; 