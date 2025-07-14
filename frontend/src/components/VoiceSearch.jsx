import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const VoiceSearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px 50px 12px 15px;
  border: 2px solid ${props => props.isListening ? '#667eea' : props.theme.border};
  border-radius: 25px;
  font-size: 16px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  transition: all 0.3s ease;
  box-shadow: ${props => props.isListening ? '0 0 0 3px rgba(102, 126, 234, 0.1)' : 'none'};
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }
`;

const VoiceButton = styled.button`
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: ${props => props.isListening 
    ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)' 
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  };
  color: white;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  animation: ${props => props.isListening ? 'pulse 1.5s infinite' : 'none'};
  
  &:hover {
    transform: translateY(-50%) scale(1.05);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: translateY(-50%);
  }
  
  @keyframes pulse {
    0% { transform: translateY(-50%) scale(1); }
    50% { transform: translateY(-50%) scale(1.1); }
    100% { transform: translateY(-50%) scale(1); }
  }
`;

const StatusIndicator = styled.div`
  position: absolute;
  top: -30px;
  right: 0;
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 12px;
  color: ${props => props.theme.text};
  display: ${props => props.show ? 'block' : 'none'};
  animation: slideIn 0.3s ease;
  
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Waveform = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  margin-left: 8px;
  
  .bar {
    width: 3px;
    background: #667eea;
    border-radius: 2px;
    animation: wave 1s infinite ease-in-out;
    
    &:nth-child(1) { animation-delay: -0.4s; }
    &:nth-child(2) { animation-delay: -0.3s; }
    &:nth-child(3) { animation-delay: -0.2s; }
    &:nth-child(4) { animation-delay: -0.1s; }
    &:nth-child(5) { animation-delay: 0s; }
  }
  
  @keyframes wave {
    0%, 40%, 100% { height: 8px; }
    20% { height: 20px; }
  }
`;

const SuggestionsContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  margin-top: 5px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const SuggestionItem = styled.div`
  padding: 10px 15px;
  cursor: pointer;
  border-bottom: 1px solid ${props => props.theme.border};
  transition: background 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.background};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const SuggestionText = styled.div`
  font-size: 14px;
  color: ${props => props.theme.text};
`;

const SuggestionCategory = styled.div`
  font-size: 12px;
  color: ${props => props.theme.textSecondary};
  margin-top: 2px;
`;

const ErrorMessage = styled.div`
  position: absolute;
  top: -40px;
  right: 0;
  background: #ff6b6b;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  animation: slideIn 0.3s ease;
`;

const VoiceSearch = ({ theme, onSearch, placeholder = "Wyszukaj głosowo..." }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);

  // Symulowane sugestie wyszukiwania
  const mockSuggestions = [
    { text: "laptop gamingowy", category: "Elektronika" },
    { text: "smartfon samsung", category: "Telefony" },
    { text: "słuchawki bezprzewodowe", category: "Akcesoria" },
    { text: "tablet apple", category: "Tablety" },
    { text: "kamera go pro", category: "Fotografia" }
  ];

  useEffect(() => {
    // Sprawdź czy przeglądarka obsługuje Web Speech API
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Twoja przeglądarka nie obsługuje rozpoznawania mowy');
      return;
    }

    // Inicjalizacja rozpoznawania mowy
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'pl-PL';

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setError('');
    };

    recognitionRef.current.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      const fullTranscript = finalTranscript || interimTranscript;
      setTranscript(fullTranscript);
      
      // Generuj sugestie na podstawie transkryptu
      if (fullTranscript.length > 2) {
        generateSuggestions(fullTranscript);
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Błąd rozpoznawania mowy:', event.error);
      setIsListening(false);
      
      switch (event.error) {
        case 'no-speech':
          setError('Nie wykryto mowy. Spróbuj ponownie.');
          break;
        case 'audio-capture':
          setError('Błąd dostępu do mikrofonu. Sprawdź uprawnienia.');
          break;
        case 'not-allowed':
          setError('Dostęp do mikrofonu został zablokowany.');
          break;
        default:
          setError('Wystąpił błąd podczas rozpoznawania mowy.');
      }
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
      if (transcript.trim()) {
        handleSearch(transcript);
      }
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const generateSuggestions = (query) => {
    const filtered = mockSuggestions.filter(suggestion =>
      suggestion.text.toLowerCase().includes(query.toLowerCase())
    );
    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setTranscript('');
      setSuggestions([]);
      setShowSuggestions(false);
      setError('');
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleSearch = (searchTerm) => {
    if (onSearch && searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setTranscript(suggestion.text);
    handleSearch(suggestion.text);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setTranscript(value);
    
    if (value.length > 2) {
      generateSuggestions(value);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(transcript);
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pl-PL';
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <VoiceSearchContainer>
      <SearchInput
        ref={inputRef}
        type="text"
        value={transcript}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        theme={theme}
        isListening={isListening}
      />
      
      <VoiceButton
        onClick={toggleListening}
        isListening={isListening}
        disabled={!recognitionRef.current}
        title={isListening ? 'Zatrzymaj nagrywanie' : 'Rozpocznij nagrywanie głosowe'}
      >
        {isListening ? (
          <Waveform>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </Waveform>
        ) : (
          '🎤'
        )}
      </VoiceButton>

      <StatusIndicator 
        show={isListening} 
        theme={theme}
      >
        Słucham... {isListening && <Waveform><div className="bar"></div><div className="bar"></div><div className="bar"></div></Waveform>}
      </StatusIndicator>

      {error && (
        <ErrorMessage>
          {error}
        </ErrorMessage>
      )}

      {showSuggestions && (
        <SuggestionsContainer theme={theme}>
          {suggestions.map((suggestion, index) => (
            <SuggestionItem 
              key={index} 
              theme={theme}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <SuggestionText theme={theme}>{suggestion.text}</SuggestionText>
              <SuggestionCategory theme={theme}>{suggestion.category}</SuggestionCategory>
            </SuggestionItem>
          ))}
        </SuggestionsContainer>
      )}
    </VoiceSearchContainer>
  );
};

export default VoiceSearch; 