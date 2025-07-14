import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
`;
const Title = styled.h1`
  font-size: 2.2rem;
  margin-bottom: 1rem;
`;
const BackButton = styled.button`
  margin-bottom: 1.5rem;
  background: ${({ theme }) => theme.primary};
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  cursor: pointer;
`;
const Section = styled.div`
  margin-bottom: 2rem;
`;
const Label = styled.div`
  font-weight: bold;
  margin-bottom: 0.3rem;
`;
const Value = styled.div`
  margin-bottom: 0.7rem;
`;

export default function Product({ theme }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/products/${id}`);
        if (!res.ok) throw new Error('Nie znaleziono produktu');
        const data = await res.json();
        setProduct(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <Container>Ładowanie...</Container>;
  if (error) return <Container>Błąd: {error}</Container>;
  if (!product) return <Container>Brak danych produktu.</Container>;

  return (
    <Container>
      <BackButton theme={theme} onClick={() => navigate(-1)}>← Powrót</BackButton>
      <Title>{product.name}</Title>
      <Section>
        <Label>Opis:</Label>
        <Value>{product.description || 'Brak opisu'}</Value>
        <Label>Cena:</Label>
        <Value>{product.price ? `${product.price} zł` : 'Brak ceny'}</Value>
        <Label>Kategoria:</Label>
        <Value>{product.category || 'Brak danych'}</Value>
        <Label>Sklep:</Label>
        <Value>{product.shop?.name || 'Brak danych'}</Value>
        {product.mainImage && <img src={product.mainImage} alt="Zdjęcie" style={{ maxWidth: 220, margin: '1rem 0' }} />}
      </Section>
    </Container>
  );
} 