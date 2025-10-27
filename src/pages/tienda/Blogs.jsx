// src/pages/tienda/blogs.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';

// Componentes
import BlogCard from '../../components/tienda/BlogCard';
import BlogModal from '../../components/tienda/BlogModal';
import NewsletterCard from '../../components/tienda/NewsletterCard';
import BlogHeader from '../../components/tienda/BlogHeader';

// Utilidades
import { blogsData, manejarSuscripcion } from '../../utils/tienda/blogsUtils';

const Blogs = () => {
  const [email, setEmail] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const [modalBlog, setModalBlog] = useState(null);

  const handleLeerArticulo = (blogId) => {
    const blog = blogsData.find(b => b.id === blogId);
    if (!blog) return;
    
    setModalBlog(blog);
    setModalShow(true);
  };

  const handleSuscribirClick = (e) => {
    e.preventDefault();
    manejarSuscripcion(email, setEmail, setShowAlert, setAlertMessage);
  };

  return (
    <div 
      className="min-vh-100 w-100"
      style={{
        backgroundImage: 'url("https://images3.alphacoders.com/126/1269904.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        fontFamily: "'Lato', sans-serif"
      }}
    >
      <div style={{ height: '80px' }}></div>

      {showAlert && (
        <Alert 
          variant={alertMessage.includes('✅') ? 'success' : 'danger'} 
          className="position-fixed top-0 start-50 translate-middle-x mt-5" 
          style={{ zIndex: 1050, minWidth: '300px' }}
        >
          {alertMessage}
        </Alert>
      )}

      <Container className="py-5">
        {/* HEADER */}
        <BlogHeader />

        {/* LISTA DE BLOGS */}
        <Row>
          {blogsData.map(blog => (
            <Col key={blog.id} lg={6} className="mb-4">
              <BlogCard blog={blog} onLeerArticulo={() => handleLeerArticulo(blog.id)} />
            </Col>
          ))}
        </Row>

        {/* NEWSLETTER */}
        <Row className="mt-5">
          <Col lg={8} className="mx-auto">
            <NewsletterCard 
              email={email}
              setEmail={setEmail}
              onSubmit={handleSuscribirClick}
            />
          </Col>
        </Row>
      </Container>

      {/* MODAL DE BLOG */}
      <BlogModal 
        show={modalShow}
        onHide={() => setModalShow(false)}
        blog={modalBlog}
      />
    </div>
  );
};

export default Blogs;