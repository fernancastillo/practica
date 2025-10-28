import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';

const BlogCard = ({ blog, onLeerArticulo }) => {
  return (
    <Card
      className="h-100 shadow"
      style={{
        background: '#87CEEB',
        backdropFilter: 'blur(15px)',
        borderRadius: '0px',
        border: '3px solid #87CEEB', // Azul Cielo
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.borderColor = '#dedd8ff5'; // Amarillo Mostaza
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(135, 206, 235, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = '#87CEEB'; // Azul Cielo
        e.currentTarget.style.boxShadow = '';
      }}
    >
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <Card.Img
          variant="top"
          src={blog.imagen}
          style={{
            height: '250px',
            objectFit: 'contain',
            width: '100%',
            background: '#87CEEB',
            padding: '10px',
            transition: 'transform 0.3s ease'
          }}
          onError={(e) => {
            console.error('Error cargando imagen:', blog.imagen);
            e.target.src =
              'https://via.placeholder.com/600x400/87CEEB/FFFFFF?text=Imagen+No+Disponible';
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
          }}
        />
        <Badge
          style={{
            position: 'absolute',
            top: '15px',
            left: '15px',
            fontSize: '0.8rem',
            fontWeight: '600',
            background: '#dedd8ff5', // Amarillo Mostaza
            color: '#000000', // Negro
            border: '2px solid #000000'
          }}
        >
          {blog.categoria}
        </Badge>
      </div>

      <Card.Body className="d-flex flex-column">
        <div className="mb-2">
          <small style={{ 
            color: '#000000', // Negro
            fontFamily: "'Lato', sans-serif"
          }}>
            📅 {blog.fecha} • ⏱️ {blog.tiempoLectura} • ✍️ {blog.autor}
          </small>
        </div>

        <Card.Title
          style={{
            fontFamily: "'Indie Flower', cursive",
            fontSize: '1.4rem',
            fontWeight: '700',
            color: '#000000', // Negro
            lineHeight: '1.3',
            marginBottom: '1rem',
            minHeight: '3.5rem'
          }}
        >
          {blog.titulo}
        </Card.Title>

        <Card.Text
          style={{
            fontFamily: "'Lato', sans-serif",
            fontSize: '1rem',
            color: '#000000', // Negro
            lineHeight: '1.6',
            marginBottom: '1rem',
            flexGrow: '1'
          }}
        >
          {blog.resumen}
        </Card.Text>

        <div className="d-flex flex-wrap gap-1 mb-3">
          {blog.tags.map((tag, index) => (
            <Badge
              key={index}
              style={{
                fontFamily: "'Lato', sans-serif",
                fontSize: '0.75rem',
                background: '#87CEEB', // Azul Cielo
                color: '#000000', // Negro
                border: '1px solid #000000',
                borderRadius: '20px',
                padding: '0.3rem 0.6rem'
              }}
            >
              #{tag}
            </Badge>
          ))}
        </div>

        <div className="mt-auto">
          <Button
            onClick={() => onLeerArticulo(blog.id)}
            style={{
              fontFamily: "'Lato', sans-serif",
              fontWeight: '600',
              background: '#dedd8ff5', // Amarillo Mostaza
              border: '2px solid #000000',
              color: '#000000', // Negro
              borderRadius: '10px',
              padding: '0.7rem 1.5rem',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease',
              width: '100%'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#87CEEB'; // Azul Cielo
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 15px rgba(135, 206, 235, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#dedd8ff5'; // Amarillo Mostaza
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            📖 Leer Artículo Completo
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default BlogCard;