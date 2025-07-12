import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem;
  }
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
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }
`;

const Form = styled.form`
  background: ${props => props.theme.surface};
  border-radius: 20px;
  padding: 2rem;
  box-shadow: ${props => props.theme.shadow};
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
    border-radius: 12px;
  }
`;

const FormSection = styled.div`
  margin-bottom: 2rem;
  
  @media (max-width: 480px) {
    margin-bottom: 1.5rem;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 1rem;
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
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
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
  
  @media (max-width: 768px) {
    padding: 0.875rem;
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    font-size: 0.9rem;
    border-radius: 8px;
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
  
  @media (max-width: 768px) {
    padding: 0.875rem;
    font-size: 0.95rem;
    min-height: 100px;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    font-size: 0.9rem;
    border-radius: 8px;
    min-height: 80px;
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
  
  @media (max-width: 768px) {
    padding: 0.875rem;
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    font-size: 0.9rem;
    border-radius: 8px;
  }
`;

const ImageUpload = styled.div`
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
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.textSecondary};
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const UploadText = styled.div`
  color: ${props => props.theme.textSecondary};
  margin-bottom: 0.5rem;
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const UploadHint = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const ImagePreview = styled.div`
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
  
  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
  }
  
  @media (max-width: 480px) {
    width: 80px;
    height: 80px;
  }
`;

const PreviewImage = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  background: ${props => props.theme.background};
  border: 2px solid ${props => props.theme.border};
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 0.75rem;
  
  &:hover {
    background: rgba(239, 68, 68, 1);
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const Tag = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${props => props.theme.primary}20;
  color: ${props => props.theme.primary};
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
`;

const RemoveTag = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.primary};
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
  
  &:hover {
    color: ${props => props.theme.error};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.75rem;
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
    background: ${props => props.theme.surface};
    color: ${props => props.theme.text};
    border: 2px solid ${props => props.theme.border};
    
    &:hover {
      background: ${props => props.theme.border};
    }
  }
  
  @media (max-width: 768px) {
    padding: 0.875rem 1.75rem;
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
    border-radius: 8px;
  }
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.error};
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const Button = styled.button`
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
    
    &:hover:not(:disabled) {
      background: ${props => props.theme.gradientHover};
      transform: translateY(-2px);
      box-shadow: ${props => props.theme.shadowHover};
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
  
  &.secondary {
    background: ${props => props.theme.border};
    color: ${props => props.theme.text};
    
    &:hover {
      background: ${props => props.theme.primary}20;
      color: ${props => props.theme.primary};
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const Tag = styled.span`
  background: ${props => props.theme.primary}20;
  color: ${props => props.theme.primary};
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RemoveTag = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.primary};
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0;
  line-height: 1;
  
  &:hover {
    color: ${props => props.theme.error};
  }
`;

const ImageUpload = styled.div`
  border: 2px dashed ${props => props.theme.border};
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.primary};
    background: ${props => props.theme.primary}10;
  }
  
  input[type="file"] {
    display: none;
  }
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const UploadText = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 0.5rem;
`;

const UploadHint = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
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
  border: 2px solid ${props => props.theme.border};
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  background: ${props => props.theme.error};
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  
  &:hover {
    background: ${props => props.theme.error}dd;
  }
`;

export default function ProductCreate() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    brand: '',
    sku: '',
    weight: '',
    dimensions: '',
    stock: '0',
    tags: [],
    shopId: ''
  });
  
  const [images, setImages] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userShops, setUserShops] = useState([]);
  const [loadingShops, setLoadingShops] = useState(true);

  const categories = [
    'Elektronika',
    'Odzież',
    'Książki',
    'Sport',
    'Dom i ogród',
    'Motoryzacja',
    'Zdrowie i uroda',
    'Zabawki',
    'Inne'
  ];

  // Pobierz sklepy użytkownika
  useEffect(() => {
    fetchUserShops();
  }, []);

  const fetchUserShops = async () => {
    try {
      setLoadingShops(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}/api/shops/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Nie udało się pobrać Twoich sklepów');
      }

      const shops = await response.json();
      setUserShops(shops);
      
      // Automatycznie wybierz pierwszy sklep jeśli użytkownik ma tylko jeden
      if (shops.length === 1) {
        setFormData(prev => ({ ...prev, shopId: shops[0]._id }));
      }
    } catch (err) {
      console.error('Błąd podczas pobierania sklepów:', err);
      setErrors({ shops: err.message });
    } finally {
      setLoadingShops(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages([...images, ...newImages]);
  };

  const removeImage = (id) => {
    setImages(images.filter(img => img.id !== id));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Nazwa produktu jest wymagana';
    if (!formData.description.trim()) newErrors.description = 'Opis produktu jest wymagany';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Cena musi być większa od 0';
    if (!formData.category) newErrors.category = 'Kategoria jest wymagana';
    if (!formData.shopId) newErrors.shopId = 'Musisz wybrać sklep';
    
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
      
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        location: 'Polska', // Domyślna lokalizacja
        shopId: formData.shopId, // Backend oczekuje shopId
        brand: formData.brand,
        sku: formData.sku,
        weight: formData.weight,
        dimensions: formData.dimensions,
        stock: parseInt(formData.stock) || 0,
        tags: formData.tags
      };
      
      const response = await fetch(`${apiUrl}/api/products`, {
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
      
      alert('Produkt został dodany pomyślnie!');
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        brand: '',
        sku: '',
        weight: '',
        dimensions: '',
        stock: '0',
        tags: [],
        shopId: formData.shopId // Zachowaj wybrany sklep
      });
      setImages([]);
      setErrors({});
      
    } catch (err) {
      console.error('Błąd podczas dodawania produktu:', err);
      alert('Błąd podczas dodawania produktu: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Czy na pewno chcesz zresetować formularz?')) {
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        brand: '',
        sku: '',
        weight: '',
        dimensions: '',
        stock: '0',
        tags: [],
        shopId: formData.shopId // Zachowaj wybrany sklep
      });
      setImages([]);
      setErrors({});
    }
  };

  return (
    <Container>
      <Title>Dodaj nowy produkt</Title>
      
      <Form onSubmit={handleSubmit}>
        <FormSection>
          <SectionTitle>🏪 Wybór sklepu</SectionTitle>
          <FormRow>
            <Label>Sklep *</Label>
            {loadingShops ? (
              <div style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>
                Ładowanie Twoich sklepów...
              </div>
            ) : userShops.length === 0 ? (
              <div style={{ padding: '1rem', textAlign: 'center', color: '#ef4444' }}>
                Nie masz żadnych sklepów. <a href="/shop-create" style={{ color: '#00D4AA' }}>Utwórz pierwszy sklep</a>
              </div>
            ) : (
              <Select
                name="shopId"
                value={formData.shopId}
                onChange={handleInputChange}
              >
                <option value="">Wybierz sklep</option>
                {userShops.map(shop => (
                  <option key={shop._id} value={shop._id}>
                    {shop.name} {!shop.isActive && '(Nieaktywny)'}
                  </option>
                ))}
              </Select>
            )}
            {errors.shopId && <ErrorMessage>{errors.shopId}</ErrorMessage>}
            {errors.shops && <ErrorMessage>{errors.shops}</ErrorMessage>}
          </FormRow>
        </FormSection>

        <FormSection>
          <SectionTitle>📝 Podstawowe informacje</SectionTitle>
          <FormGrid>
            <FormRow>
              <Label>Nazwa produktu *</Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Wprowadź nazwę produktu"
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
              />
              {errors.price && <ErrorMessage>{errors.price}</ErrorMessage>}
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
          </FormGrid>
        </FormSection>

        <FormSection>
          <SectionTitle>📄 Opis produktu</SectionTitle>
          <FormRow>
            <Label>Opis *</Label>
            <TextArea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Opisz szczegółowo swój produkt..."
            />
            {errors.description && <ErrorMessage>{errors.description}</ErrorMessage>}
          </FormRow>
        </FormSection>

        <FormSection>
          <SectionTitle>🏷️ Tagi</SectionTitle>
          <FormRow>
            <Label>Dodaj tagi</Label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Wprowadź tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" className="secondary" onClick={addTag}>
                Dodaj
              </Button>
            </div>
            <TagsContainer>
              {formData.tags.map(tag => (
                <Tag key={tag}>
                  {tag}
                  <RemoveTag onClick={() => removeTag(tag)}>×</RemoveTag>
                </Tag>
              ))}
            </TagsContainer>
          </FormRow>
        </FormSection>

        <FormSection>
          <SectionTitle>📦 Szczegóły techniczne</SectionTitle>
          <FormGrid>
            <FormRow>
              <Label>SKU</Label>
              <Input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                placeholder="Kod produktu"
              />
            </FormRow>
            
            <FormRow>
              <Label>Stan magazynowy</Label>
              <Input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
              />
            </FormRow>
            
            <FormRow>
              <Label>Waga (kg)</Label>
              <Input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                placeholder="0.0"
                step="0.1"
                min="0"
              />
            </FormRow>
            
            <FormRow>
              <Label>Wymiary (cm)</Label>
              <Input
                type="text"
                name="dimensions"
                value={formData.dimensions}
                onChange={handleInputChange}
                placeholder="Dł. x Szer. x Wys."
              />
            </FormRow>
          </FormGrid>
        </FormSection>

        <FormSection>
          <SectionTitle>🖼️ Zdjęcia produktu</SectionTitle>
          <ImageUpload>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              id="image-upload"
            />
            <label htmlFor="image-upload">
              <UploadIcon>📷</UploadIcon>
              <UploadText>Kliknij aby dodać zdjęcia</UploadText>
              <UploadHint>Maksymalnie 10 zdjęć, format JPG/PNG</UploadHint>
            </label>
          </ImageUpload>
          
          {images.length > 0 && (
            <ImagePreview>
              {images.map(image => (
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

        <ButtonGroup>
          <Button type="submit" className="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Dodawanie...' : 'Dodaj produkt'}
          </Button>
          <Button type="button" className="secondary" onClick={handleReset}>
            Resetuj
          </Button>
        </ButtonGroup>
      </Form>
    </Container>
  );
} 