import { Card, Row, Col, Form, Button } from 'react-bootstrap';

const OrdenesFiltros = ({ filtros, onFiltroChange, onLimpiarFiltros, resultados }) => {
  return (
    <Card className="shadow mb-4">
      <Card.Header className="py-3">
        <h6 className="m-0 font-weight-bold text-primary">Filtros de Búsqueda</h6>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Número de Orden</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: SO1001"
                name="numeroOrden"
                value={filtros.numeroOrden}
                onChange={onFiltroChange}
              />
            </Form.Group>
          </Col>
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
              <Form.Label>Estado</Form.Label>
              <Form.Select
                name="estado"
                value={filtros.estado}
                onChange={onFiltroChange}
              >
                <option value="">Todos los estados</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Enviado">Enviado</option>
                <option value="Entregado">Entregado</option>
                <option value="Cancelado">Cancelado</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                name="fecha"
                value={filtros.fecha}
                onChange={onFiltroChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <div className="mt-3">
          <Button variant="outline-secondary" onClick={onLimpiarFiltros}>
            <i className="bi bi-arrow-clockwise me-2"></i>
            Limpiar Filtros
          </Button>
          <span className="text-muted ms-3">
            {resultados.filtradas} de {resultados.totales} órdenes encontradas
          </span>
        </div>
      </Card.Body>
    </Card>
  );
};

export default OrdenesFiltros;