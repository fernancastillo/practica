// src/components/admin/UsuariosFiltros.jsx
import { Card, Row, Col, Form, Button } from 'react-bootstrap';

const UsuariosFiltros = ({ filtros, onFiltroChange, onLimpiarFiltros, resultados }) => {
  return (
    <Card className="shadow mb-4">
      <Card.Header className="py-3">
        <h6 className="m-0 font-weight-bold text-primary">Filtros de Búsqueda</h6>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={3}>
            <Form.Group>
              <Form.Label>RUN</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: 20694795"
                name="run"
                value={filtros.run}
                onChange={onFiltroChange}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Ana González"
                name="nombre"
                value={filtros.nombre}
                onChange={onFiltroChange}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: usuario@email.com"
                name="email"
                value={filtros.email}
                onChange={onFiltroChange}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Tipo</Form.Label>
              <Form.Select
                name="tipo"
                value={filtros.tipo}
                onChange={onFiltroChange}
              >
                <option value="">Todos los tipos</option>
                <option value="Cliente">Cliente</option>
                <option value="Admin">Administrador</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <div className="mt-3">
          <Button variant="outline-secondary" onClick={onLimpiarFiltros}>
            <i className="bi bi-arrow-clockwise me-2"></i>
            Limpiar Filtros
          </Button>
          <span className="text-muted ms-3">
            {resultados.filtrados} de {resultados.totales} usuarios encontrados
          </span>
        </div>
      </Card.Body>
    </Card>
  );
};

export default UsuariosFiltros;