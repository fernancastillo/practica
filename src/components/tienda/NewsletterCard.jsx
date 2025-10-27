// src/components/tienda/NewsletterCard.jsx
import React from 'react';
import { Card, Form, Button } from 'react-bootstrap';

const NewsletterCard = ({ email, setEmail, onSubmit }) => {
  return (
    <Card style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(15px)',
      borderRadius: '20px',
      border: '3px solid #dedd8ff5', // Amarillo Mostaza
      boxShadow: '0 15px 35px rgba(222, 221, 143, 0.2)'
    }}>
      <Card.Body className="p-4 text-center">
        <h3 style={{
          fontFamily: "'Indie Flower', cursive",
          fontSize: '2rem',
          color: '#000000', // Negro
          marginBottom: '1.5rem',
          fontWeight: '700'
        }}>
          📧 Suscríbete a Nuestro Blog
        </h3>
        <p style={{
          fontFamily: "'Lato', sans-serif",
          fontSize: '1.1rem',
          lineHeight: '1.7',
          color: '#000000', // Negro
          marginBottom: '1rem'
        }}>
          Recibe las últimas guías, noticias y secretos de Stardew Valley directamente en tu email.
        </p>
        <Form onSubmit={onSubmit} className="d-flex gap-2 justify-content-center flex-wrap">
          <Form.Control 
            type="email" 
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              border: '2px solid #87CEEB', // Azul Cielo
              borderRadius: '10px',
              padding: '0.7rem 1rem',
              fontFamily: "'Lato', sans-serif",
              fontSize: '1rem',
              background: '#FFFFFF', // Blanco
              color: '#000000', // Negro
              minWidth: '250px'
            }}
          />
          <Button 
            type="submit"
            style={{
              fontFamily: "'Lato', sans-serif",
              fontWeight: '600',
              background: '#87CEEB', // Azul Cielo
              border: '2px solid #000000',
              color: '#000000', // Negro
              borderRadius: '10px',
              padding: '0.7rem 1.5rem',
              fontSize: '1rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#dedd8ff5'; // Amarillo Mostaza
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#87CEEB'; // Azul Cielo
            }}
          >
            Suscribirse
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default NewsletterCard;