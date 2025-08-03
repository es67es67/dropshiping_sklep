import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const ARContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CameraView = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: ${props => props.isActive ? 'url(https://picsum.photos/800/600?random=1) center/cover' : 'rgba(0,0,0,0.3)'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
`;

const ARProduct = styled.div`
  position: absolute;
  width: ${props => props.scale * 100}px;
  height: ${props => props.scale * 100}px;
  background: ${props => props.productImage ? `url(${props.productImage}) center/cover` : '#fff'};
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  cursor: move;
  user-select: none;
  transform: translate(${props => props.x}px, ${props => props.y}px) rotate(${props => props.rotation}deg);
  transition: transform 0.1s ease;
  
  &:hover {
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  }
`;

const ControlsPanel = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.95);
  border-radius: 25px;
  padding: 15px 25px;
  display: flex;
  gap: 15px;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
`;

const ControlButton = styled.button`
  background: ${props => props.$active ? '#667eea' : 'rgba(102, 126, 234, 0.1)'};
  color: ${props => props.$active ? 'white' : '#667eea'};
  border: 2px solid #667eea;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
  
  &:hover {
    background: #667eea;
    color: white;
    transform: scale(1.1);
  }
`;

const Slider = styled.input`
  width: 100px;
  height: 4px;
  border-radius: 2px;
  background: #ddd;
  outline: none;
  -webkit-appearance: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #667eea;
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #667eea;
    cursor: pointer;
    border: none;
  }
`;

const ProductInfo = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 15px;
  max-width: 250px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

const ProductName = styled.h3`
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #333;
`;

const ProductPrice = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 8px;
`;

const ProductDescription = styled.p`
  margin: 0;
  font-size: 12px;
  color: #666;
  line-height: 1.4;
`;

const ARStatus = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background: ${props => props.status === 'scanning' ? '#ffa726' : props.status === 'detected' ? '#4caf50' : '#f44336'};
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
  animation: ${props => props.pulsing ? 'pulse 1.5s infinite' : 'none'};
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const Instructions = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  max-width: 300px;
  display: ${props => props.show ? 'block' : 'none'};
`;

const InstructionText = styled.p`
  margin: 0 0 15px 0;
  font-size: 14px;
  line-height: 1.5;
`;

const StartButton = styled.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #5a6fd8;
    transform: scale(1.05);
  }
`;

const ARProductPreview = ({ product, theme }) => {
  const [isActive, setIsActive] = useState(false);
  const [arStatus, setArStatus] = useState('ready');
  const [productPosition, setProductPosition] = useState({ x: 0, y: 0 });
  const [productScale, setProductScale] = useState(1);
  const [productRotation, setProductRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const mockProduct = {
    name: "iPhone 15 Pro",
    price: "4999 zł",
    description: "Najnowszy iPhone z kamerą 48MP, chipem A17 Pro i tytanową obudową.",
    image: "https://picsum.photos/200/200?random=10"
  };

  const currentProduct = product || mockProduct;

  useEffect(() => {
    if (isActive) {
      // Symulacja skanowania powierzchni
      setArStatus('scanning');
      setTimeout(() => {
        setArStatus('detected');
      }, 2000);
    }
  }, [isActive]);

  const handleStartAR = () => {
    setIsActive(true);
  };

  const handleMouseDown = (e) => {
    if (!isActive) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDragging(true);
    setDragOffset({
      x: x - productPosition.x,
      y: y - productPosition.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !isActive) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffset.x;
    const y = e.clientY - rect.top - dragOffset.y;
    
    setProductPosition({ x, y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleScaleChange = (e) => {
    setProductScale(parseFloat(e.target.value));
  };

  const handleRotationChange = (e) => {
    setProductRotation(parseFloat(e.target.value));
  };

  const resetPosition = () => {
    setProductPosition({ x: 0, y: 0 });
    setProductScale(1);
    setProductRotation(0);
  };

  const captureScreenshot = () => {
    // Symulacja zrzutu ekranu
    alert('Zrzut ekranu został zapisany! 📸');
  };

  const shareAR = () => {
    // Symulacja udostępniania
    if (navigator.share) {
      navigator.share({
        title: `Podgląd AR: ${currentProduct.name}`,
        text: `Sprawdź jak wygląda ${currentProduct.name} w AR!`,
        url: window.location.href
      });
    } else {
      alert('Link do podglądu AR został skopiowany do schowka! 🔗');
    }
  };

  return (
    <ARContainer>
      <CameraView 
        ref={containerRef}
        isActive={isActive}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {isActive && (
          <ARProduct
            productImage={currentProduct.image}
            x={productPosition.x}
            y={productPosition.y}
            scale={productScale}
            rotation={productRotation}
            onMouseDown={handleMouseDown}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          />
        )}

        <ARStatus status={arStatus}>
          <StatusDot pulsing={arStatus === 'scanning'} />
          {arStatus === 'ready' && 'Gotowy do AR'}
          {arStatus === 'scanning' && 'Skanowanie...'}
          {arStatus === 'detected' && 'Powierzchnia wykryta'}
        </ARStatus>

        <ProductInfo>
          <ProductName>{currentProduct.name}</ProductName>
          <ProductPrice>{currentProduct.price}</ProductPrice>
          <ProductDescription>{currentProduct.description}</ProductDescription>
        </ProductInfo>

        <Instructions show={!isActive}>
          <InstructionText>
            🎯 Wskazówki AR:<br/>
            • Ustaw telefon na płaskiej powierzchni<br/>
            • Poruszaj telefonem, aby skanować otoczenie<br/>
            • Dotknij ekranu, aby umieścić produkt
          </InstructionText>
          <StartButton onClick={handleStartAR}>
            🚀 Rozpocznij AR
          </StartButton>
        </Instructions>
      </CameraView>

      <ControlsPanel>
        <ControlButton 
          onClick={resetPosition}
          title="Resetuj pozycję"
        >
          🔄
        </ControlButton>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
          <span style={{ fontSize: '10px', color: '#666' }}>Skala</span>
          <Slider
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={productScale}
            onChange={handleScaleChange}
          />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
          <span style={{ fontSize: '10px', color: '#666' }}>Obrót</span>
          <Slider
            type="range"
            min="0"
            max="360"
            step="1"
            value={productRotation}
            onChange={handleRotationChange}
          />
        </div>
        
        <ControlButton 
          onClick={captureScreenshot}
          title="Zrzut ekranu"
        >
          📸
        </ControlButton>
        
        <ControlButton 
          onClick={shareAR}
          title="Udostępnij"
        >
          📤
        </ControlButton>
      </ControlsPanel>
    </ARContainer>
  );
};

export default ARProductPreview; 