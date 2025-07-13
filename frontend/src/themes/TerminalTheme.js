const TerminalTheme = {
  name: 'Terminal',
  description: 'Czarno-zielony motyw w stylu terminala',
  
  colors: {
    // Kolory podstawowe
    primary: '#00ff00', // Zielony
    secondary: '#00cc00', // Ciemniejszy zielony
    accent: '#00aa00', // Jeszcze ciemniejszy zielony
    
    // Tło
    background: '#000000', // Czarne tło
    surface: '#0a0a0a', // Ciemno-szare tło
    surfaceHover: '#1a1a1a', // Jaśniejsze na hover
    
    // Tekst
    text: '#00ff00', // Zielony tekst
    textSecondary: '#00cc00', // Ciemniejszy zielony tekst
    textMuted: '#008800', // Bardzo ciemny zielony
    
    // Status
    success: '#00ff00', // Zielony
    warning: '#ffff00', // Żółty
    error: '#ff0000', // Czerwony
    info: '#00ffff', // Cyjan
    
    // Border
    border: '#00ff00', // Zielone obramowanie
    borderLight: '#008800', // Ciemniejsze obramowanie
    
    // Gradient
    gradient: 'linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #1a1a1a 100%)',
    gradientGreen: 'linear-gradient(135deg, #00ff00 0%, #00cc00 50%, #00aa00 100%)',
    
    // Glow effects
    glow: '0 0 10px rgba(0, 255, 0, 0.5)',
    glowStrong: '0 0 20px rgba(0, 255, 0, 0.8)',
    glowText: '0 0 5px rgba(0, 255, 0, 0.8)'
  },
  
  fonts: {
    primary: '"Courier New", "Monaco", "Consolas", monospace',
    secondary: '"Courier New", "Monaco", "Consolas", monospace',
    code: '"Courier New", "Monaco", "Consolas", monospace'
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
  },
  
  borderRadius: {
    none: '0',
    sm: '2px',
    md: '4px',
    lg: '8px',
    xl: '12px',
    full: '9999px'
  },
  
  shadows: {
    none: 'none',
    sm: '0 1px 3px rgba(0, 255, 0, 0.12)',
    md: '0 4px 6px rgba(0, 255, 0, 0.15)',
    lg: '0 10px 15px rgba(0, 255, 0, 0.2)',
    xl: '0 20px 25px rgba(0, 255, 0, 0.25)',
    glow: '0 0 20px rgba(0, 255, 0, 0.5)'
  },
  
  // Komponenty
  components: {
    // Button
    button: {
      primary: {
        backgroundColor: '#00ff00',
        color: '#000000',
        border: '2px solid #00ff00',
        boxShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
        '&:hover': {
          backgroundColor: '#00cc00',
          boxShadow: '0 0 15px rgba(0, 255, 0, 0.8)',
          transform: 'translateY(-2px)'
        },
        '&:active': {
          backgroundColor: '#00aa00',
          transform: 'translateY(0)'
        }
      },
      secondary: {
        backgroundColor: 'transparent',
        color: '#00ff00',
        border: '2px solid #00ff00',
        '&:hover': {
          backgroundColor: 'rgba(0, 255, 0, 0.1)',
          boxShadow: '0 0 10px rgba(0, 255, 0, 0.3)'
        }
      },
      outline: {
        backgroundColor: 'transparent',
        color: '#00ff00',
        border: '1px solid #00ff00',
        '&:hover': {
          backgroundColor: 'rgba(0, 255, 0, 0.05)',
          borderColor: '#00cc00'
        }
      }
    },
    
    // Card
    card: {
      backgroundColor: '#0a0a0a',
      border: '1px solid #00ff00',
      boxShadow: '0 0 10px rgba(0, 255, 0, 0.2)',
      '&:hover': {
        boxShadow: '0 0 15px rgba(0, 255, 0, 0.4)',
        transform: 'translateY(-2px)'
      }
    },
    
    // Input
    input: {
      backgroundColor: '#000000',
      border: '1px solid #00ff00',
      color: '#00ff00',
      '&:focus': {
        borderColor: '#00cc00',
        boxShadow: '0 0 10px rgba(0, 255, 0, 0.3)',
        outline: 'none'
      },
      '&::placeholder': {
        color: '#008800'
      }
    },
    
    // Modal
    modal: {
      backgroundColor: '#0a0a0a',
      border: '2px solid #00ff00',
      boxShadow: '0 0 30px rgba(0, 255, 0, 0.5)'
    },
    
    // Navigation
    navigation: {
      backgroundColor: '#000000',
      borderBottom: '2px solid #00ff00',
      boxShadow: '0 2px 10px rgba(0, 255, 0, 0.3)'
    },
    
    // Sidebar
    sidebar: {
      backgroundColor: '#0a0a0a',
      borderRight: '1px solid #00ff00',
      '& .nav-item': {
        '&:hover': {
          backgroundColor: 'rgba(0, 255, 0, 0.1)',
          borderLeft: '3px solid #00ff00'
        },
        '&.active': {
          backgroundColor: 'rgba(0, 255, 0, 0.2)',
          borderLeft: '3px solid #00cc00',
          boxShadow: '0 0 10px rgba(0, 255, 0, 0.3)'
        }
      }
    },
    
    // Table
    table: {
      backgroundColor: '#0a0a0a',
      border: '1px solid #00ff00',
      '& th': {
        backgroundColor: '#1a1a1a',
        borderBottom: '2px solid #00ff00',
        color: '#00ff00'
      },
      '& td': {
        borderBottom: '1px solid #008800',
        color: '#00cc00'
      },
      '& tr:hover': {
        backgroundColor: 'rgba(0, 255, 0, 0.05)'
      }
    },
    
    // Alert
    alert: {
      success: {
        backgroundColor: 'rgba(0, 255, 0, 0.1)',
        border: '1px solid #00ff00',
        color: '#00ff00'
      },
      warning: {
        backgroundColor: 'rgba(255, 255, 0, 0.1)',
        border: '1px solid #ffff00',
        color: '#ffff00'
      },
      error: {
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
        border: '1px solid #ff0000',
        color: '#ff0000'
      },
      info: {
        backgroundColor: 'rgba(0, 255, 255, 0.1)',
        border: '1px solid #00ffff',
        color: '#00ffff'
      }
    },
    
    // Badge
    badge: {
      backgroundColor: '#00ff00',
      color: '#000000',
      border: '1px solid #00cc00',
      boxShadow: '0 0 5px rgba(0, 255, 0, 0.5)'
    },
    
    // Progress
    progress: {
      backgroundColor: '#1a1a1a',
      progressColor: '#00ff00',
      border: '1px solid #00ff00'
    },
    
    // Tooltip
    tooltip: {
      backgroundColor: '#0a0a0a',
      color: '#00ff00',
      border: '1px solid #00ff00',
      boxShadow: '0 0 10px rgba(0, 255, 0, 0.5)'
    }
  },
  
  // Animacje
  animations: {
    fadeIn: 'fadeIn 0.3s ease-in-out',
    slideIn: 'slideIn 0.3s ease-in-out',
    glow: 'glow 2s ease-in-out infinite alternate',
    pulse: 'pulse 2s ease-in-out infinite',
    typing: 'typing 3s steps(40, end)',
    blink: 'blink 1s infinite'
  },
  
  // Keyframes
  keyframes: {
    fadeIn: {
      '0%': { opacity: 0 },
      '100%': { opacity: 1 }
    },
    slideIn: {
      '0%': { transform: 'translateY(-20px)', opacity: 0 },
      '100%': { transform: 'translateY(0)', opacity: 1 }
    },
    glow: {
      '0%': { boxShadow: '0 0 5px rgba(0, 255, 0, 0.5)' },
      '100%': { boxShadow: '0 0 20px rgba(0, 255, 0, 0.8)' }
    },
    pulse: {
      '0%, 100%': { opacity: 1 },
      '50%': { opacity: 0.5 }
    },
    typing: {
      'from': { width: 0 },
      'to': { width: '100%' }
    },
    blink: {
      '0%, 50%': { opacity: 1 },
      '51%, 100%': { opacity: 0 }
    }
  },
  
  // Utility classes
  utilities: {
    '.terminal-text': {
      fontFamily: '"Courier New", monospace',
      color: '#00ff00',
      textShadow: '0 0 5px rgba(0, 255, 0, 0.8)'
    },
    '.terminal-bg': {
      backgroundColor: '#000000',
      backgroundImage: 'radial-gradient(circle at 50% 50%, #0a0a0a 0%, #000000 100%)'
    },
    '.terminal-border': {
      border: '1px solid #00ff00',
      boxShadow: '0 0 10px rgba(0, 255, 0, 0.3)'
    },
    '.terminal-glow': {
      boxShadow: '0 0 15px rgba(0, 255, 0, 0.5)'
    },
    '.terminal-cursor': {
      borderRight: '2px solid #00ff00',
      animation: 'blink 1s infinite'
    },
    '.terminal-scrollbar': {
      '&::-webkit-scrollbar': {
        width: '8px'
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor: '#0a0a0a'
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#00ff00',
        borderRadius: '4px',
        '&:hover': {
          backgroundColor: '#00cc00'
        }
      }
    }
  },
  
  // Responsive breakpoints
  breakpoints: {
    xs: '480px',
    sm: '768px',
    md: '1024px',
    lg: '1200px',
    xl: '1600px'
  },
  
  // Z-index scale
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070
  }
};

export default TerminalTheme; 