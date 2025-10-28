import React from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';

// Componente para etiquetas con asterisco rojo
const FormLabelWithAsterisk = ({ children, required = false }) => (
  <Form.Label className="fw-semibold" style={{ color: '#000000', fontSize: '1.1rem' }}>
    {children} {required && <span style={{ color: 'red' }}>*</span>}
  </Form.Label>
);

const InformacionPersonal = ({ 
  formData, 
  onInputChange, 
  onBlur,
  onSubmit, 
  regiones, 
  comunasFiltradas,
  errores = {}
}) => {
  return (
    <Form onSubmit={onSubmit}>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <FormLabelWithAsterisk required>Nombre</FormLabelWithAsterisk>
            <Form.Control
              type="text"
              name="nombre"
              value={formData.nombre || ''}
              onChange={onInputChange}
              onBlur={onBlur}
              isInvalid={!!errores.nombre}
              required
              className="border-3 border-dark rounded-3 py-3"
              style={{
                backgroundColor: '#FFFFFF',
                color: '#000000',
                fontFamily: "'Lato', sans-serif"
              }}
              placeholder="Ingresa tu nombre"
            />
            <Form.Control.Feedback type="invalid" style={{ fontFamily: "'Lato', sans-serif" }}>
              {errores.nombre}
            </Form.Control.Feedback>
            <Form.Text className="text-muted" style={{ fontFamily: "'Lato', sans-serif" }}>
              Mínimo 3 caracteres (sin contar espacios)
            </Form.Text>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <FormLabelWithAsterisk required>Apellido</FormLabelWithAsterisk>
            <Form.Control
              type="text"
              name="apellido"
              value={formData.apellido || ''}
              onChange={onInputChange}
              onBlur={onBlur}
              isInvalid={!!errores.apellido}
              required
              className="border-3 border-dark rounded-3 py-3"
              style={{
                backgroundColor: '#FFFFFF',
                color: '#000000',
                fontFamily: "'Lato', sans-serif"
              }}
              placeholder="Ingresa tu apellido"
            />
            <Form.Control.Feedback type="invalid" style={{ fontFamily: "'Lato', sans-serif" }}>
              {errores.apellido}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <FormLabelWithAsterisk required>Email</FormLabelWithAsterisk>
        <Form.Control
          type="email"
          name="email"
          value={formData.email || ''}
          onChange={onInputChange}
          onBlur={onBlur}
          isInvalid={!!errores.email}
          required
          className="border-3 border-dark rounded-3 py-3"
          style={{
            backgroundColor: '#FFFFFF',
            color: '#000000',
            fontFamily: "'Lato', sans-serif"
          }}
          placeholder="ejemplo@correo.com"
        />
        <Form.Control.Feedback type="invalid" style={{ fontFamily: "'Lato', sans-serif" }}>
          {errores.email}
        </Form.Control.Feedback>
        <Form.Text className="text-muted" style={{ fontFamily: "'Lato', sans-serif" }}>
          Solo se permiten: @gmail.com, @duoc.cl, @profesor.duoc.cl
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3">
        <FormLabelWithAsterisk>Teléfono</FormLabelWithAsterisk>
        <Form.Control
          type="tel"
          name="telefono"
          value={formData.telefono || ''}
          onChange={onInputChange}
          onBlur={onBlur}
          isInvalid={!!errores.telefono}
          className="border-3 border-dark rounded-3 py-3"
          style={{
            backgroundColor: '#FFFFFF',
            color: '#000000',
            fontFamily: "'Lato', sans-serif"
          }}
          placeholder="912345678 (9 dígitos, comenzando con 9)"
        />
        <Form.Control.Feedback type="invalid" style={{ fontFamily: "'Lato', sans-serif" }}>
          {errores.telefono}
        </Form.Control.Feedback>
        <Form.Text className="text-muted" style={{ fontFamily: "'Lato', sans-serif" }}>
          Opcional - 9 dígitos, debe comenzar con 9
        </Form.Text>
      </Form.Group>

      {/* Campos de Dirección */}
      <Form.Group className="mb-3">
        <FormLabelWithAsterisk required>Dirección</FormLabelWithAsterisk>
        <Form.Control
          type="text"
          name="direccion"
          value={formData.direccion || ''}
          onChange={onInputChange}
          onBlur={onBlur}
          isInvalid={!!errores.direccion}
          required
          className="border-3 border-dark rounded-3 py-3"
          style={{
            backgroundColor: '#FFFFFF',
            color: '#000000',
            fontFamily: "'Lato', sans-serif"
          }}
          placeholder="Calle, número, departamento"
        />
        <Form.Control.Feedback type="invalid" style={{ fontFamily: "'Lato', sans-serif" }}>
          {errores.direccion}
        </Form.Control.Feedback>
        <Form.Text className="text-muted" style={{ fontFamily: "'Lato', sans-serif" }}>
          Mínimo 5 caracteres (sin contar espacios)
        </Form.Text>
      </Form.Group>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <FormLabelWithAsterisk required>Región</FormLabelWithAsterisk>
            <Form.Select
              name="region"
              value={formData.region || ''}
              onChange={onInputChange}
              onBlur={onBlur}
              isInvalid={!!errores.region}
              required
              className="border-3 border-dark rounded-3 py-3"
              style={{
                backgroundColor: '#FFFFFF',
                color: '#000000',
                fontFamily: "'Lato', sans-serif"
              }}
            >
              <option value="">Selecciona una región</option>
              {regiones.map(region => (
                <option key={region.id} value={region.id}>
                  {region.nombre}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid" style={{ fontFamily: "'Lato', sans-serif" }}>
              {errores.region}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <FormLabelWithAsterisk required>Comuna</FormLabelWithAsterisk>
            <Form.Select
              name="comuna"
              value={formData.comuna || ''}
              onChange={onInputChange}
              onBlur={onBlur}
              isInvalid={!!errores.comuna}
              disabled={!formData.region}
              required
              className="border-3 border-dark rounded-3 py-3"
              style={{
                backgroundColor: '#FFFFFF',
                color: '#000000',
                fontFamily: "'Lato', sans-serif"
              }}
            >
              <option value="">
                {formData.region ? 'Selecciona una comuna' : 'Primero selecciona una región'}
              </option>
              {comunasFiltradas.map(comuna => (
                <option key={comuna} value={comuna}>
                  {comuna}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid" style={{ fontFamily: "'Lato', sans-serif" }}>
              {errores.comuna}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <div className="text-center">
        <Button 
          type="submit" 
          className="rounded-pill px-5 py-3 border-3 border-dark fw-bold"
          style={{
            backgroundColor: '#dedd8ff5',
            color: '#000000',
            transition: 'all 0.3s ease',
            fontFamily: "'Lato', sans-serif",
            fontSize: '1.1rem'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(222, 221, 143, 0.6)';
            e.target.style.backgroundColor = '#FFD700';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
            e.target.style.backgroundColor = '#dedd8ff5';
          }}
        >
          💾 Guardar Cambios
        </Button>
      </div>

      <div className="text-center mt-3">
        <p style={{ color: '#000000', fontSize: '0.9rem' }}>
          <span style={{ color: 'red' }}>*</span> Campos obligatorios
        </p>
      </div>
    </Form>
  );
};

export default InformacionPersonal;