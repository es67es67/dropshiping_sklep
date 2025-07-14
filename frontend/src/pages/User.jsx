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

export default function User({ theme }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/users/${id}`);
        if (!res.ok) throw new Error('Nie znaleziono użytkownika');
        const data = await res.json();
        setUser(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return <Container>Ładowanie...</Container>;
  if (error) return <Container>Błąd: {error}</Container>;
  if (!user) return <Container>Brak danych użytkownika.</Container>;

  return (
    <Container>
      <BackButton theme={theme} onClick={() => navigate(-1)}>← Powrót</BackButton>
      <Title>{user.username || user.firstName + ' ' + user.lastName}</Title>
      <Section>
        <Label>Email:</Label>
        <Value>{user.email || 'Brak emaila'}</Value>
        <Label>Imię i nazwisko:</Label>
        <Value>{user.firstName} {user.lastName}</Value>
        {user.avatar && <img src={user.avatar} alt="Avatar" style={{ maxWidth: 120, margin: '1rem 0' }} />}
        <Label>Bio:</Label>
        <Value>{user.bio || 'Brak opisu'}</Value>
      </Section>
      <Section>
        <Label>Sklepy:</Label>
        <Value>{user.shops?.length ? user.shops.map(s => s.name).join(', ') : 'Brak sklepów'}</Value>
      </Section>
      <Section>
        <Label>Posty:</Label>
        <Value>{user.posts?.length ? user.posts.map(p => p.title).join(', ') : 'Brak postów'}</Value>
      </Section>
    </Container>
  );
} 