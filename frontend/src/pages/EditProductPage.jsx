import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowLeft, FaSave, FaTimes, FaUpload, FaTag, FaMapMarkerAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import PageTitle from '../components/PageTitle';

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

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: ${props => props.theme.textSecondary};
`;

const EditProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
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
    tags: [],
    isActive: true,
    isAvailable: true
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

  // Pobierz dane produktu
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const apiUrl = 'http://localhost:5000';
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${apiUrl}/api/marketplace/${productId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 404) {
            setMessage({ type: 'error', text: 'Produkt nie został znaleziony' });
          } else if (response.status === 403) {
            setMessage({ type: 'error', text: 'Nie masz uprawnień do edycji tego produktu' });
          } else {
            setMessage({ type: 'error', text: 'Błąd podczas pobierania produktu' });
          }
          return;
        }

        const product = await response.json();
        
        // Sprawdź czy użytkownik jest właścicielem
        if (product.seller._id !== user._id) {
          setMessage({ type: 'error', text: 'Nie masz uprawnień do edycji tego produktu' });
          return;
        }

        // Przygotuj istniejące zdjęcia
        const existingImages = (product.images || []).map((img, index) => ({
          id: `existing-${index}`,
          preview: img,
          isExisting: true
        }));

        // Wypełnij formularz danymi produktu
        setFormData({
          name: product.name || '',
          description: product.description || '',
          price: product.price?.toString() || '',
          stock: product.stock || 1,
          category: product.category || '',
          brand: product.brand || '',
          condition: product.condition || 'new',
          saleType: product.saleType || 'fixed_price',
          location: product.location || {
            voivodeship: '',
            county: '',
            municipality: '',
            city: '',
            terytCode: ''
          },
          images: existingImages,
          tags: product.tags || [],
          isActive: product.isActive !== undefined ? product.isActive : true,
          isAvailable: product.isAvailable !== undefined ? product.isAvailable : true
        });

      } catch (error) {
        console.error('Błąd podczas pobierania produktu:', error);
        setMessage({ type: 'error', text: 'Błąd podczas pobierania produktu' });
      } finally {
        setIsLoading(false);
      }
    };

    if (productId && user) {
      fetchProduct();
    }
  }, [productId, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

  const validateForm = () => {
    if (!formData.name.trim()) {
      setMessage({ type: 'error', text: 'Nazwa produktu jest wymagana' });
      return false;
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setMessage({ type: 'error', text: 'Cena musi być większa od 0' });
      return false;
    }
    
    if (!formData.stock || parseInt(formData.stock) < 0) {
      setMessage({ type: 'error', text: 'Ilość dostępna nie może być ujemna' });
      return false;
    }
    
    if (!formData.category) {
      setMessage({ type: 'error', text: 'Wybierz kategorię produktu' });
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
      const apiUrl = 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      // Debug: sprawdź token
      console.log('🔍 Debug - Token:', token ? token.substring(0, 50) + '...' : 'Brak tokenu');
      console.log('🔍 Debug - API URL:', apiUrl);
      console.log('🔍 Debug - Product ID:', productId);
      
      // Najpierw uploaduj nowe zdjęcia
      const newImages = formData.images.filter(img => img.file);
      const existingImages = formData.images.filter(img => img.isExisting);
      
      let uploadedImageUrls = [];
      
      if (newImages.length > 0) {
        // Upload nowych zdjęć
        const formDataUpload = new FormData();
        newImages.forEach((img, index) => {
          if (index === 0) {
            formDataUpload.append('mainImage', img.file);
          } else {
            formDataUpload.append('images', img.file);
          }
        });
        
        const uploadResponse = await fetch(`${apiUrl}/api/marketplace/${productId}/upload-images`, {
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
        uploadedImageUrls = uploadResult.images;
      }
      
      // Przygotuj wszystkie URL-e zdjęć
      const allImageUrls = [
        ...existingImages.map(img => img.preview),
        ...uploadedImageUrls
      ];

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: formData.category,
        brand: formData.brand,
        condition: formData.condition,
        saleType: formData.saleType,
        location: formData.location,
        images: allImageUrls,
        tags: formData.tags,
        isActive: formData.isActive,
        isAvailable: formData.isAvailable
      };
      
      const response = await fetch(`${apiUrl}/api/marketplace/${productId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Nie udało się zaktualizować produktu');
      }

      const updatedProduct = await response.json();
      
      setMessage({ type: 'success', text: 'Produkt został zaktualizowany pomyślnie!' });
      
      // Przekieruj do strony produktu po 2 sekundach
      setTimeout(() => {
        navigate(`/marketproduct/${productId}`);
      }, 2000);
      
    } catch (err) {
      console.error('Błąd podczas aktualizacji produktu:', err);
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/marketproduct/${productId}`);
  };

  if (isLoading) {
    return (
      <Container>
        <LoadingSpinner>Ładowanie produktu...</LoadingSpinner>
      </Container>
    );
  }

  return (
    <Container>
      <PageTitle 
        title="Edytuj produkt" 
        description="Zaktualizuj informacje o swoim produkcie" 
      />
      
      <Form onSubmit={handleSubmit}>
        {/* Podstawowe informacje */}
        <FormSection>
          <SectionTitle>
            <FaMapMarkerAlt />
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
                min="0"
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
            
            <FormRow>
              <Label>Status produktu</Label>
              <Select
                name="isActive"
                value={formData.isActive.toString()}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  isActive: e.target.value === 'true'
                }))}
              >
                <option value="true">Aktywny</option>
                <option value="false">Nieaktywny</option>
              </Select>
            </FormRow>
          </FormGrid>
        </FormSection>

        {/* Opis */}
        <FormSection>
          <SectionTitle>
            <FaMapMarkerAlt />
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
          
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Input
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
              Dodaj
            </Button>
          </div>
          
          {formData.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  style={{
                    background: '#3b82f620',
                    color: '#3b82f6',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {tag}
                  <FaTimes 
                    onClick={() => removeTag(tag)}
                    style={{ cursor: 'pointer' }}
                  />
                </span>
              ))}
            </div>
          )}
                 </FormSection>

         {/* Zdjęcia */}
         <FormSection>
           <SectionTitle>
             <FaUpload />
             Zdjęcia produktu
           </SectionTitle>
           
           <div style={{ 
             border: '2px dashed #ccc', 
             borderRadius: '8px', 
             padding: '2rem', 
             textAlign: 'center', 
             cursor: 'pointer',
             marginBottom: '1rem'
           }}>
             <input
               type="file"
               multiple
               accept="image/*"
               onChange={handleImageUpload}
               style={{ display: 'none' }}
               id="image-upload-edit"
             />
             <label htmlFor="image-upload-edit" style={{ cursor: 'pointer' }}>
               <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📷</div>
               <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                 Kliknij aby dodać zdjęcia
               </div>
               <div style={{ fontSize: '0.875rem', color: '#666' }}>
                 Maksymalnie 10 zdjęć, format JPG/PNG
               </div>
             </label>
           </div>
           
           {formData.images.length > 0 && (
             <div style={{ 
               display: 'grid', 
               gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', 
               gap: '1rem', 
               marginTop: '1rem' 
             }}>
               {formData.images.map(image => (
                 <div key={image.id} style={{ 
                   position: 'relative', 
                   aspectRatio: '1', 
                   borderRadius: '8px', 
                   overflow: 'hidden', 
                   border: '1px solid #ccc' 
                 }}>
                   <img
                     src={image.preview}
                     alt="Preview"
                     style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                   />
                   <button 
                     onClick={() => removeImage(image.id)}
                     style={{
                       position: 'absolute',
                       top: '0.25rem',
                       right: '0.25rem',
                       background: 'rgba(0, 0, 0, 0.7)',
                       color: 'white',
                       border: 'none',
                       borderRadius: '50%',
                       width: '24px',
                       height: '24px',
                       cursor: 'pointer',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center',
                       fontSize: '14px'
                     }}
                   >
                     ×
                   </button>
                 </div>
               ))}
             </div>
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
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            <FaArrowLeft />
            Anuluj
          </Button>
          
          <Button 
            type="submit" 
            variant="primary"
            disabled={isSubmitting}
          >
            <FaSave />
            {isSubmitting ? 'Zapisywanie...' : 'Zapisz zmiany'}
          </Button>
        </ButtonGroup>
      </Form>
    </Container>
  );
};

export default EditProductPage; 