import { createGlobalStyle } from 'styled-components';

export const lightTheme = {
  primary: '#00D4AA',
  secondary: '#8B5CF6',
  accent: '#F59E0B',
  background: '#FFFFFF',
  surface: '#F8FAFC',
  text: '#1E293B',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  shadowHover: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  gradient: 'linear-gradient(135deg, #00D4AA 0%, #8B5CF6 100%)',
  gradientHover: 'linear-gradient(135deg, #00B894 0%, #7C3AED 100%)'
};

export const darkTheme = {
  primary: '#00D4AA',
  secondary: '#8B5CF6',
  accent: '#F59E0B',
  background: '#0F172A',
  surface: '#1E293B',
  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  border: '#334155',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
  shadowHover: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
  gradient: 'linear-gradient(135deg, #00D4AA 0%, #8B5CF6 100%)',
  gradientHover: 'linear-gradient(135deg, #00B894 0%, #7C3AED 100%)'
};

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    background-color: ${props => props.theme.background};
    color: ${props => props.theme.text};
    transition: all 0.3s ease;
    line-height: 1.6;
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.surface};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.border};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.textSecondary};
  }

  /* Button styles */
  .btn {
    padding: 12px 24px;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 14px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .btn-primary {
    background: ${props => props.theme.gradient};
    color: white;
  }

  .btn-primary:hover {
    background: ${props => props.theme.gradientHover};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadowHover};
  }

  .btn-secondary {
    background: ${props => props.theme.surface};
    color: ${props => props.theme.text};
    border: 2px solid ${props => props.theme.border};
  }

  .btn-secondary:hover {
    background: ${props => props.theme.border};
    transform: translateY(-2px);
  }

  /* Input styles */
  .input {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid ${props => props.theme.border};
    border-radius: 12px;
    font-size: 14px;
    transition: all 0.2s ease;
    background: ${props => props.theme.surface};
    color: ${props => props.theme.text};
  }

  .input:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}20;
  }

  /* Card styles */
  .card {
    background: ${props => props.theme.surface};
    border-radius: 16px;
    padding: 20px;
    box-shadow: ${props => props.theme.shadow};
    transition: all 0.2s ease;
  }

  .card:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadowHover};
  }

  /* Animation classes */
  .fade-in {
    animation: fadeIn 0.3s ease-in;
  }

  .slide-up {
    animation: slideUp 0.3s ease-out;
  }

  .bounce {
    animation: bounce 0.6s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @keyframes bounce {
    0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
    40%, 43% { transform: translate3d(0,-8px,0); }
    70% { transform: translate3d(0,-4px,0); }
    90% { transform: translate3d(0,-2px,0); }
  }

  /* Utility classes */
  .text-gradient {
    background: ${props => props.theme.gradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .glass {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .glass-dark {
    background: rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
`; 