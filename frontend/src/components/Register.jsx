import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
    max-width: 100%;
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

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  &.full-width {
    grid-column: 1 / -1;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 1rem;
  }
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 0.5rem;
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const Input = styled.input`
  width: 100%;
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
  
  &.error {
    border-color: ${props => props.theme.error};
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

const Select = styled.select`
  width: 100%;
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

const Button = styled.button`
  width: 100%;
  padding: 1rem 2rem;
  background: ${props => props.theme.gradient};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 1rem;
  
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

const Divider = styled.div`
  text-align: center;
  margin: 1.5rem 0;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: ${props => props.theme.border};
  }
  
  span {
    background: ${props => props.theme.surface};
    padding: 0 1rem;
    color: ${props => props.theme.textSecondary};
    font-size: 0.875rem;
  }
  
  @media (max-width: 480px) {
    margin: 1rem 0;
    
    span {
      font-size: 0.8rem;
    }
  }
`;

const SocialButton = styled.button`
  width: 100%;
  padding: 1rem 2rem;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  border: 2px solid ${props => props.theme.border};
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${props => props.theme.primary}10;
    border-color: ${props => props.theme.primary};
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

const LoginLink = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  color: ${props => props.theme.textSecondary};
  
  a {
    color: ${props => props.theme.primary};
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  @media (max-width: 480px) {
    margin-top: 1rem;
    font-size: 0.9rem;
  }
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.error};
  font-size: 0.875rem;
  margin-top: 0.5rem;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const SuccessMessage = styled.div`
  color: ${props => props.theme.success};
  font-size: 0.875rem;
  margin-top: 0.5rem;
  text-align: center;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const PasswordStrength = styled.div`
  margin-top: 0.5rem;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const StrengthBar = styled.div`
  height: 4px;
  background: ${props => props.theme.border};
  border-radius: 2px;
  margin-top: 0.25rem;
  overflow: hidden;
`;

const StrengthFill = styled.div`
  height: 100%;
  background: ${props => props.strength === 'weak' ? props.theme.error :
                props.strength === 'medium' ? props.theme.warning :
                props.strength === 'strong' ? props.theme.success : props.theme.border};
  width: ${props => props.strength === 'weak' ? '33%' :
           props.strength === 'medium' ? '66%' :
           props.strength === 'strong' ? '100%' : '0%'};
  transition: all 0.3s ease;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  font-size: 0.875rem;
  color: ${props => props.theme.text};
  cursor: pointer;
  
  a {
    color: ${props => props.theme.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: '', // Zmieniam z birthDate na dateOfBirth
    gender: '',
    city: '',
    username: '', // Dodaję username
    acceptTerms: false,
    acceptNewsletter: false
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('weak');
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();

  // Sprawdź czy użytkownik jest już zalogowany
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }

    // Sprawdź siłę hasła
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    if (strength <= 2) setPasswordStrength('weak');
    else if (strength <= 4) setPasswordStrength('medium');
    else setPasswordStrength('strong');
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Imię jest wymagane';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Nazwisko jest wymagane';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email jest wymagany';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email jest nieprawidłowy';
    }
    
    if (!formData.password) {
      newErrors.password = 'Hasło jest wymagane';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Hasło musi mieć co najmniej 8 znaków';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Hasła nie są identyczne';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefon jest wymagany';
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Data urodzenia jest wymagana';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'Miasto jest wymagane';
    }
    
    if (!formData.username.trim()) {
      newErrors.username = 'Nazwa użytkownika jest wymagana';
    }
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Musisz zaakceptować regulamin';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const result = await register(formData);
      
      if (result.success) {
        setMessage('Konto zostało utworzone pomyślnie! Przekierowywanie...');
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setMessage(result.error);
      }
    } catch (error) {
      setMessage('Wystąpił błąd podczas rejestracji');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialRegister = (provider) => {
    setMessage(`Rejestracja przez ${provider} (symulacja)`);
  };

  return (
    <Container>
      <Title>Rejestracja</Title>
      
      <Form onSubmit={handleSubmit}>
        {message && (
          message.includes('pomyślnie') ? (
            <SuccessMessage>{message}</SuccessMessage>
          ) : (
            <ErrorMessage style={{ textAlign: 'center' }}>{message}</ErrorMessage>
          )
        )}
        
        <FormGrid>
          <FormGroup>
            <Label>Imię *</Label>
            <Input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Wprowadź imię"
              disabled={isLoading}
              className={errors.firstName ? 'error' : ''}
            />
            {errors.firstName && <ErrorMessage>{errors.firstName}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label>Nazwisko *</Label>
            <Input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Wprowadź nazwisko"
              disabled={isLoading}
              className={errors.lastName ? 'error' : ''}
            />
            {errors.lastName && <ErrorMessage>{errors.lastName}</ErrorMessage>}
          </FormGroup>
        </FormGrid>
        
        <FormGroup>
          <Label>Email *</Label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Wprowadź swój email"
            disabled={isLoading}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
        </FormGroup>
        
        <FormGrid>
          <FormGroup>
            <Label>Hasło *</Label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Wprowadź hasło"
              disabled={isLoading}
              className={errors.password ? 'error' : ''}
            />
            <PasswordStrength>
              Siła hasła: {passwordStrength === 'weak' ? 'Słabe' : 
                           passwordStrength === 'medium' ? 'Średnie' : 'Silne'}
              <StrengthBar>
                <StrengthFill strength={passwordStrength} />
              </StrengthBar>
            </PasswordStrength>
            {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label>Potwierdź hasło *</Label>
            <Input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Potwierdź hasło"
              disabled={isLoading}
              className={errors.confirmPassword ? 'error' : ''}
            />
            {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
          </FormGroup>
        </FormGrid>
        
        <FormGrid>
          <FormGroup>
            <Label>Telefon *</Label>
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+48 123 456 789"
              disabled={isLoading}
              className={errors.phone ? 'error' : ''}
            />
            {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label>Data urodzenia *</Label>
            <Input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              disabled={isLoading}
              className={errors.dateOfBirth ? 'error' : ''}
            />
            {errors.dateOfBirth && <ErrorMessage>{errors.dateOfBirth}</ErrorMessage>}
          </FormGroup>
        </FormGrid>
        
        <FormGrid>
          <FormGroup>
            <Label>Płeć</Label>
            <Select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              disabled={isLoading}
            >
              <option value="">Wybierz płeć</option>
              <option value="male">Męska</option>
              <option value="female">Żeńska</option>
              <option value="other">Inna</option>
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label>Miasto *</Label>
            <Input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="Wprowadź miasto"
              disabled={isLoading}
              className={errors.city ? 'error' : ''}
            />
            {errors.city && <ErrorMessage>{errors.city}</ErrorMessage>}
          </FormGroup>
        </FormGrid>
        
        <FormGroup>
          <Label>Nazwa użytkownika *</Label>
          <Input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Wprowadź nazwę użytkownika"
            disabled={isLoading}
            className={errors.username ? 'error' : ''}
          />
          {errors.username && <ErrorMessage>{errors.username}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup className="full-width">
          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <CheckboxLabel>
              Akceptuję <a href="#" onClick={(e) => e.preventDefault()}>regulamin</a> i{' '}
              <a href="#" onClick={(e) => e.preventDefault()}>politykę prywatności</a> *
            </CheckboxLabel>
          </CheckboxContainer>
          {errors.acceptTerms && <ErrorMessage>{errors.acceptTerms}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup className="full-width">
          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              name="acceptNewsletter"
              checked={formData.acceptNewsletter}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <CheckboxLabel>
              Chcę otrzymywać newsletter z ofertami i promocjami
            </CheckboxLabel>
          </CheckboxContainer>
        </FormGroup>
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Tworzenie konta...' : 'Zarejestruj się'}
        </Button>
        
        <Divider>
          <span>lub</span>
        </Divider>
        
        <SocialButton type="button" onClick={() => handleSocialRegister('Google')}>
          🔍 Zarejestruj przez Google
        </SocialButton>
        
        <SocialButton type="button" onClick={() => handleSocialRegister('Facebook')}>
          📘 Zarejestruj przez Facebook
        </SocialButton>
        
        <LoginLink>
          Masz już konto? <Link to="/login">Zaloguj się</Link>
        </LoginLink>
      </Form>
    </Container>
  );
} 