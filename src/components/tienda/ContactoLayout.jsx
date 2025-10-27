// src/components/tienda/ContactoLayout.jsx
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { ContactoForm } from './ContactoForm';
import { useContactoLogic } from './ContactoLogic';

const ContactoLayout = () => {
  const logic = useContactoLogic();

  // Función para manejar el click de WhatsApp (igual que en el footer)
  const handleWhatsAppClick = () => {
    window.open(
      'https://i.pinimg.com/736x/3d/6c/57/3d6c577dc24561124b094681759aa24a.jpg', 
      '_blank', 
      'noopener,noreferrer'
    );
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
      
      {/* Sección de la imagen - Mismo estilo que el Index */}
      <section className="py-4 text-center">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <img
                src="/src/assets/tienda/contacto.png"
                alt="Contáctanos"
                className="img-fluid"
                style={{ 
                  maxWidth: '800px', 
                  width: '100%', 
                  marginTop: '2rem',
                  filter: 'drop-shadow(3px 3px 6px rgba(0,0,0,0.8))'
                }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x300/87CEEB/FFFFFF?text=Contáctanos';
                }}
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Texto descriptivo - Manteniendo el estilo original */}
      <section className="py-3 text-center">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <p className="fs-4" style={{ 
                color: 'rgba(255,255,255,0.9)', 
                textShadow: '2px 2px 4px rgba(0,0,0,0.9)', 
                fontWeight: '300' 
              }}>
                ¿Tienes preguntas? Estamos aquí para ayudarte
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="py-4">
        <Row className="g-4">
          <Col lg={8}>
            <ContactoForm {...logic} />
          </Col>

          <Col lg={4}>
            <Card className="shadow border-0 mb-3" style={{ borderRadius: '15px', backgroundColor: '#87CEEB', border: '2px solid #000000' }}>
              <Card.Body>
                <h3 className="fw-bold text-center mb-3" style={{ fontFamily: "'Indie Flower', cursive", color: '#000000' }}>Información de Contacto</h3>
                <p className="text-dark small mb-0">📧 wenospalstardewvalley@junimostore.cl</p>
                <p className="text-dark small mb-0">📱 +56 9 1234 5678</p>
                <p className="text-dark small mb-0">🕒 Lun-Vie: 9:00 - 18:00 | Sáb: 10:00 - 14:00</p>
              </Card.Body>
            </Card>

            <Card className="shadow border-0" style={{ borderRadius: '15px', backgroundColor: '#87CEEB', border: '2px solid #000000' }}>
              <Card.Body className="text-center">
                <h5 className="fw-bold mb-2" style={{ fontFamily: "'Indie Flower', cursive", color: '#000000' }}>¿Necesitas Ayuda Rápida?</h5>
                <p className="text-dark small mb-2">Escríbenos por WhatsApp y responderemos tus dudas lo más rápido posible.</p>
                <Button 
                  className="fw-bold border-2" 
                  style={{ background: '#dedd8ff5', borderColor: '#000000', color: '#000000', borderRadius: '8px' }}
                  onClick={handleWhatsAppClick}
                >
                  💬 WhatsApp
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ContactoLayout;