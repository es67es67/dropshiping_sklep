import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import PageTitle from '../components/PageTitle';

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

export default function CompanyProfile({ theme }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompany = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/company-profiles/${id}`);
        if (!res.ok) throw new Error('Nie znaleziono firmy');
        const data = await res.json();
        setCompany(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [id]);

  if (loading) return <Container>Ładowanie...</Container>;
  if (error) return <Container>Błąd: {error}</Container>;
  if (!company) return <Container>Brak danych firmy.</Container>;

  return (
    <Container>
      <PageTitle title={`Profil firmy - ${company.name}`} description={`Profil firmy ${company.name}`} />
      <BackButton theme={theme} onClick={() => navigate(-1)}>← Powrót</BackButton>
      <Title>{company.name}</Title>
      <Section>
        <Label>Opis:</Label>
        <Value>{company.description || 'Brak opisu'}</Value>
        <Label>Branża:</Label>
        <Value>{company.industry || 'Brak danych'}</Value>
        <Label>Właściciel:</Label>
        <Value>{company.owner?.username || 'Brak danych'}</Value>
        {company.logo && <img src={company.logo} alt="Logo" style={{ maxWidth: 180, margin: '1rem 0' }} />}
      </Section>
      <Section>
        <Label>Produkty:</Label>
        <Value>{company.products?.length ? company.products.map(p => p.name).join(', ') : 'Brak produktów'}</Value>
      </Section>
      <Section>
        <Label>Posty firmowe:</Label>
        <Value>{company.posts?.length ? company.posts.map(p => p.title).join(', ') : 'Brak postów'}</Value>
      </Section>
    </Container>
  );
} 