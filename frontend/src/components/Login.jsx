import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  max-width: 400px;
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

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 0.5rem;
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
`;

const RegisterLink = styled.div`
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
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.error};
  font-size: 0.875rem;
  margin-top: 0.5rem;
  text-align: center;
`;

const SuccessMessage = styled.div`
  color: ${props => props.theme.success};
  font-size: 0.875rem;
  margin-top: 0.5rem;
  text-align: center;
`;

const TestCredentials = styled.div`
  background: ${props => props.theme.background};
  border: 2px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
`;

const TestTitle = styled.div`
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 0.5rem;
`;

const TestInfo = styled.div`
  color: ${props => props.theme.textSecondary};
  margin-bottom: 0.25rem;
`;

const CopyButton = styled.button`
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  cursor: pointer;
  margin-left: 0.5rem;
  
  &:hover {
    background: ${props => props.theme.primary}dd;
  }
`;

export default function Login() {
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // Sprawdź czy użytkownik jest już zalogowany
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.emailOrUsername.trim()) {
      newErrors.emailOrUsername = 'Email lub nazwa użytkownika jest wymagana';
    }
    
    if (!formData.password) {
      newErrors.password = 'Hasło jest wymagane';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Hasło musi mieć co najmniej 6 znaków';
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
      // Sprawdź czy to email czy username
      const isEmail = /\S+@\S+\.\S+/.test(formData.emailOrUsername);
      const loginData = isEmail 
        ? { email: formData.emailOrUsername, password: formData.password }
        : { username: formData.emailOrUsername, password: formData.password };
      
      const result = await login(loginData);
      
      if (result.success) {
        setMessage('Zalogowano pomyślnie! Przekierowywanie...');
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        setMessage(result.error);
      }
    } catch (error) {
      setMessage('Wystąpił błąd podczas logowania');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    setMessage(`Logowanie przez ${provider} (symulacja)`);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Skopiowano do schowka!');
  };

  return (
    <Container>
      <Title>Logowanie</Title>
      
      <Form onSubmit={handleSubmit}>
        <TestCredentials>
          <TestTitle>🧪 Dane testowe:</TestTitle>
          <TestInfo>
            Email: test@example.com
            <CopyButton onClick={() => copyToClipboard('test@example.com')}>
              Kopiuj
            </CopyButton>
          </TestInfo>
          <TestInfo>
            Nazwa użytkownika: testuser
            <CopyButton onClick={() => copyToClipboard('testuser')}>
              Kopiuj
            </CopyButton>
          </TestInfo>
          <TestInfo>
            Hasło: password123
            <CopyButton onClick={() => copyToClipboard('password123')}>
              Kopiuj
            </CopyButton>
          </TestInfo>
        </TestCredentials>

        {message && (
          message.includes('pomyślnie') ? (
            <SuccessMessage>{message}</SuccessMessage>
          ) : (
            <ErrorMessage>{message}</ErrorMessage>
          )
        )}
        
        <FormGroup>
          <Label>Email lub nazwa użytkownika</Label>
          <Input
            type="text"
            name="emailOrUsername"
            value={formData.emailOrUsername}
            onChange={handleInputChange}
            placeholder="Wprowadź email lub nazwę użytkownika"
            disabled={isLoading}
          />
          {errors.emailOrUsername && <ErrorMessage>{errors.emailOrUsername}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup>
          <Label>Hasło</Label>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Wprowadź swoje hasło"
            disabled={isLoading}
          />
          {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
        </FormGroup>
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Logowanie...' : 'Zaloguj się'}
        </Button>
        
        <Divider>
          <span>lub</span>
        </Divider>
        
        <SocialButton type="button" onClick={() => handleSocialLogin('Google')}>
          🔍 Zaloguj przez Google
        </SocialButton>
        
        <SocialButton type="button" onClick={() => handleSocialLogin('Facebook')}>
          📘 Zaloguj przez Facebook
        </SocialButton>
        
        <RegisterLink>
          Nie masz konta? <Link to="/register">Zarejestruj się</Link>
        </RegisterLink>
      </Form>
    </Container>
  );
} 