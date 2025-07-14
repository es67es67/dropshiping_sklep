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

export default function Shop({ theme }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShop = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/shops/${id}`);
        if (!res.ok) throw new Error('Nie znaleziono sklepu');
        const data = await res.json();
        setShop(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchShop();
  }, [id]);

  if (loading) return <Container>Ładowanie...</Container>;
  if (error) return <Container>Błąd: {error}</Container>;
  if (!shop) return <Container>Brak danych sklepu.</Container>;

  return (
    <Container>
      <BackButton theme={theme} onClick={() => navigate(-1)}>← Powrót</BackButton>
      <Title>{shop.name}</Title>
      <Section>
        <Label>Opis:</Label>
        <Value>{shop.description || 'Brak opisu'}</Value>
        <Label>Właściciel:</Label>
        <Value>{shop.owner?.username || 'Brak danych'}</Value>
        <Label>Lokalizacja:</Label>
        <Value>{shop.location?.name || 'Brak danych'}</Value>
        {shop.logo && <img src={shop.logo} alt="Logo" style={{ maxWidth: 180, margin: '1rem 0' }} />}
      </Section>
      <Section>
        <Label>Produkty:</Label>
        <Value>{shop.products?.length ? shop.products.map(p => p.name).join(', ') : 'Brak produktów'}</Value>
      </Section>
    </Container>
  );
} 