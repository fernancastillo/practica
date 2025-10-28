import React from 'react';
import { Row, Col } from 'react-bootstrap';

// Importar la imagen del blog
import blogImage from '../../assets/tienda/blog.png';

const BlogHeader = () => {
  return (
    <Row className="mb-5">
      <Col>
        <div className="text-center">
          {/* Imagen del blog */}
          <div className="mb-3">
            <img
              src={blogImage}
              alt="Blog de Stardew Valley"
              className="img-fluid"
              style={{
                maxWidth: '500px',
                width: '100%',
                filter: 'drop-shadow(3px 3px 6px rgba(0,0,0,0.8))'
              }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x200/87CEEB/FFFFFF?text=Blog+Stardew+Valley';
              }}
            />
          </div>
          
          {/* Texto descriptivo debajo de la imagen */}
          <p 
            className="fs-4 mt-3"
            style={{
              fontFamily: "'Lato', sans-serif",
              color: '#FFFFFF', // Blanco
              fontWeight: '300',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)'
            }}
          >
            Descubre consejos, guías y secretos del valle
          </p>
        </div>
      </Col>
    </Row>
  );
};

export default BlogHeader;