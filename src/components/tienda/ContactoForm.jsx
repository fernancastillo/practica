// src/components/tienda/ContactoForm.jsx
import { Form, Button, Alert, Row, Col, Card } from 'react-bootstrap';

export const ContactoForm = ({
  formData,
  errores,
  enviando,
  showAlert,
  alertMensaje,
  handleChange,
  handleBlur,
  handleSubmit
}) => {
  return (
    <Card className="shadow border-0" style={{ borderRadius: '15px', backgroundColor: '#87CEEB', border: '2px solid #000000' }}>
      <Card.Body>
        <h2 className="fw-bold mb-3 text-center" style={{ fontFamily: "'Indie Flower', cursive", fontSize: '1.8rem', color: '#000000' }}>
          Envíanos un Mensaje
        </h2>

        {showAlert && (
          <Alert variant={alertMensaje.includes('✅') ? 'success' : 'danger'} className="mb-3">
            {alertMensaje}
          </Alert>
        )}

        <Form onSubmit={handleSubmit} noValidate>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label className="fw-bold" style={{ color: '#000000' }}>Nombre Completo</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errores.nombre ? 'is-invalid' : ''}
                  placeholder="Tu nombre"
                  required
                  disabled={enviando}
                />
                {errores.nombre && <div className="invalid-feedback d-block">{errores.nombre}</div>}
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label className="fw-bold" style={{ color: '#000000' }}>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errores.email ? 'is-invalid' : ''}
                  placeholder="tu@email.com"
                  required
                  disabled={enviando}
                />
                {errores.email && <div className="invalid-feedback d-block">{errores.email}</div>}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label className="fw-bold" style={{ color: '#000000' }}>Teléfono (Opcional)</Form.Label>
                <Form.Control
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errores.telefono ? 'is-invalid' : ''}
                  placeholder="912345678"
                  disabled={enviando}
                />
                {errores.telefono && <div className="invalid-feedback d-block">{errores.telefono}</div>}
                <Form.Text className="text-dark">
                  {formData.telefono ? `${formData.telefono.length}/9 dígitos` : '9 dígitos, comenzando con 9'}
                </Form.Text>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label className="fw-bold" style={{ color: '#000000' }}>Asunto</Form.Label>
                <Form.Select
                  name="asunto"
                  value={formData.asunto}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errores.asunto ? 'is-invalid' : ''}
                  required
                  disabled={enviando}
                >
                  <option value="">Selecciona un asunto</option>
                  <option value="consulta">Consulta General</option>
                  <option value="pedido">Estado de Pedido</option>
                  <option value="devolucion">Devolución</option>
                  <option value="sugerencia">Sugerencia</option>
                  <option value="problema">Problema Técnico</option>
                  <option value="otro">Otro</option>
                </Form.Select>
                {errores.asunto && <div className="invalid-feedback d-block">{errores.asunto}</div>}
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold" style={{ color: '#000000' }}>Mensaje</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="mensaje"
              value={formData.mensaje}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errores.mensaje ? 'is-invalid' : ''}
              placeholder="Cuéntanos en qué podemos ayudarte..."
              required
              disabled={enviando}
            />
            {errores.mensaje && <div className="invalid-feedback d-block">{errores.mensaje}</div>}
            <Form.Text className="text-dark">
              {formData.mensaje.length}/1000 caracteres
            </Form.Text>
          </Form.Group>

          <div className="text-center">
            <Button 
              type="submit" 
              className="fw-bold border-2"
              disabled={enviando}
              style={{
                background: '#dedd8ff5',
                borderColor: '#000000',
                color: '#000000',
                borderRadius: '10px',
                padding: '0.8rem 1.5rem',
                fontSize: '1.1rem'
              }}
            >
              {enviando ? '⏳ Enviando...' : 'Enviar Mensaje'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};
