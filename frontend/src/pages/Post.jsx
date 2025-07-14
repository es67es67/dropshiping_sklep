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

export default function Post({ theme }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/posts/${id}`);
        if (!res.ok) throw new Error('Nie znaleziono posta');
        const data = await res.json();
        setPost(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <Container>Ładowanie...</Container>;
  if (error) return <Container>Błąd: {error}</Container>;
  if (!post) return <Container>Brak danych posta.</Container>;

  return (
    <Container>
      <BackButton theme={theme} onClick={() => navigate(-1)}>← Powrót</BackButton>
      <Title>{post.title}</Title>
      <Section>
        <Label>Autor:</Label>
        <Value>{post.author?.username || 'Brak danych'}</Value>
        <Label>Data:</Label>
        <Value>{post.createdAt ? new Date(post.createdAt).toLocaleString() : 'Brak daty'}</Value>
        <Label>Treść:</Label>
        <Value>{post.content || 'Brak treści'}</Value>
        <Label>Liczba polubień:</Label>
        <Value>{post.likes?.length || 0}</Value>
        <Label>Komentarze:</Label>
        <Value>{post.comments?.length ? post.comments.map(c => c.content).join(' | ') : 'Brak komentarzy'}</Value>
      </Section>
    </Container>
  );
} 