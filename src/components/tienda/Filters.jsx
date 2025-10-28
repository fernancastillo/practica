import React from 'react';
import { Row, Col, Form, Button, Badge } from 'react-bootstrap';
import { categoryIcons } from '../../utils/tienda/tiendaUtils';

const Filters = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  searchTerm,
  setSearchTerm,
  filteredProducts
}) => {
  return (
    <div
      className="rounded-4 p-4 mb-4"
      style={{
        backgroundColor: '#dedd8ff5',
        border: '3px solid #000000'
      }}
    >
      {/* Filtros Responsivos */}
      <Row className="mb-4">
        <Col md={6} className="mb-3">
          <Form.Group>
            <Form.Label className="fw-bold mb-2" style={{ color: '#000000', fontSize: '1.1rem' }}>
              🔍 Buscar Productos
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Buscar por nombre o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                borderRadius: '10px',
                border: '2px solid #000000',
                background: '#ffffff',
                color: '#000000',
                padding: '0.75rem 1rem',
                fontWeight: '600'
              }}
            />
          </Form.Group>
        </Col>

        <Col md={6} className="mb-3">
          <Form.Group>
            <Form.Label className="fw-bold mb-2" style={{ color: '#000000', fontSize: '1.1rem' }}>
              📂 Filtrar por Categoría
            </Form.Label>
            <Form.Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                borderRadius: '10px',
                border: '2px solid #000000',
                background: '#ffffff',
                color: '#000000',
                padding: '0.75rem 1rem',
                fontWeight: '600'
              }}
            >
              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                  style={{ color: '#000000', fontWeight: '600' }}
                >
                  {categoryIcons[category]} {category === 'all' ? 'Todas las Categorías' : category}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {/* Botones de Categorías Rápidas */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex flex-wrap gap-2 justify-content-center">
            {categories.map((category) => (
              <Button
                key={category}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="rounded-pill px-3 fw-bold"
                style={{
                  backgroundColor: selectedCategory === category ? '#000000' : '#ffffff',
                  borderColor: '#000000',
                  color: selectedCategory === category ? '#ffffff' : '#000000',
                  borderWidth: '2px'
                }}
              >
                <span className="me-1">{categoryIcons[category]}</span>
                {category === 'all' ? 'Todos' : category}
              </Button>
            ))}
          </div>
        </Col>
      </Row>

      {/* Contador de Resultados */}
      <Row className="mb-4">
        <Col>
          <div className="text-center">
            <Badge
              className="fs-6 px-3 py-2 rounded-pill fw-bold"
              style={{
                background: '#000000',
                color: '#ffffff',
                border: '2px solid #000000'
              }}
            >
              {filteredProducts.length} producto
              {filteredProducts.length !== 1 ? 's' : ''} encontrado
              {filteredProducts.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Filters;
