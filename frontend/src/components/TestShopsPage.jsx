import React from 'react';

export default function TestShopsPage() {
  return (
    <div style={{ textAlign: 'center', padding: '5rem' }}>
      <h1 style={{ fontSize: '3rem', color: '#4CAF50' }}>To jest testowa strona sklepów!</h1>
      <p style={{ fontSize: '1.5rem', margin: '2rem 0' }}>
        Jeśli widzisz ten napis, routing i renderowanie działają poprawnie.
      </p>
      <button
        style={{ padding: '1rem 2rem', fontSize: '1.2rem', borderRadius: '12px', background: '#2196F3', color: 'white', border: 'none', cursor: 'pointer' }}
        onClick={() => alert('Testowy przycisk działa!')}
      >
        Testowy przycisk
      </button>
    </div>
  );
} 