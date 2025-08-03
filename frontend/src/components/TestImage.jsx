import React from 'react';
import styled from 'styled-components';

const TestContainer = styled.div`
  padding: 20px;
  margin: 20px;
  border: 2px solid #333;
  background: white;
`;

const TestImage = styled.img`
  width: 300px;
  height: 200px;
  object-fit: cover;
  border: 2px solid red;
  background: #f0f0f0;
`;

const TestImageComponent = () => {
  // Lokalne ścieżki do zdjęć
  const localImages = [
    '/images/products/product_1.jpg',
    '/images/products/product_2.jpg',
    '/images/products/product_3.jpg',
    '/images/products/product_4.jpg',
    '/images/products/product_5.jpg',
    '/images/products/product_6.jpg',
    '/images/products/product_7.jpg',
    '/images/products/product_8.jpg',
    '/images/products/product_10.jpg',
    '/images/products/product_11.jpg',
    '/images/products/product_12.jpg',
    '/images/products/product_13.jpg'
  ];

  return (
    <TestContainer>
      <h2>🧪 Test Wyświetlania Lokalnych Zdjęć</h2>
      <p>Jeśli widzisz zdjęcia poniżej, problem jest w komponencie ProductCard.</p>
      <p>Jeśli nie widzisz zdjęć, problem jest globalny.</p>
      
      {localImages.map((imagePath, index) => (
        <div key={index} style={{ marginBottom: '20px' }}>
          <h3>Test {index + 1}: {imagePath}</h3>
          <TestImage
            src={imagePath}
            alt={`Test image ${index + 1}`}
            onLoad={() => console.log(`✅ Test ${index + 1} załadowany:`, imagePath)}
            onError={(e) => {
              console.error(`❌ Test ${index + 1} błąd:`, imagePath);
              e.target.src = 'https://via.placeholder.com/300x200/ff0000/ffffff?text=Błąd+ładowania';
            }}
          />
        </div>
      ))}
    </TestContainer>
  );
};

export default TestImageComponent; 