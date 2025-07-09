import React, { useState } from 'react';
import styled from 'styled-components';

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

const ImagePreview = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
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

export default function ProductCreate() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    brand: '',
    sku: '',
    weight: '',
    dimensions: '',
    tags: []
  });
  
  const [images, setImages] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Symulacja wysyłania danych
    setTimeout(() => {
      setIsSubmitting(false);
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
        tags: []
      });
      setImages([]);
    }, 2000);
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
        tags: []
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