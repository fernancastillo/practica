// src/components/tienda/BlogModal.jsx
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const BlogModal = ({ show, onHide, blog }) => {
  if (!blog) return null;

  return (
    <Modal show={show} onHide={onHide} size="xl" centered scrollable>
      <Modal.Header 
        closeButton
        style={{
          background: '#dedd8ff5', // Amarillo Mostaza
          color: '#000000', // Negro
          borderBottom: '3px solid #87CEEB' // Azul Cielo
        }}
      >
        <Modal.Title style={{ 
          fontFamily: "'Indie Flower', cursive", 
          fontSize: '1.8rem',
          fontWeight: '700'
        }}>
          {blog.titulo}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ 
        padding: '2rem',
        background: '#FFFFFF' // Blanco
      }}>
        <div 
          dangerouslySetInnerHTML={{ __html: blog.contenido }}
          style={{
            fontFamily: "'Lato', sans-serif",
            lineHeight: '1.7',
            color: '#000000', // Negro
          }}
        />
      </Modal.Body>
      <Modal.Footer style={{
        background: '#87CEEB', // Azul Cielo
        borderTop: '3px solid #dedd8ff5' // Amarillo Mostaza
      }}>
        <Button 
          style={{
            background: '#dedd8ff5', // Amarillo Mostaza
            border: '2px solid #000000',
            color: '#000000', // Negro
            fontFamily: "'Lato', sans-serif",
            fontWeight: '600'
          }}
          onClick={onHide}
        >
          Cerrar Artículo
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BlogModal;