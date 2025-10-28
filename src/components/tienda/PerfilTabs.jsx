import React, { useState, useEffect } from 'react';
import { Tab, Tabs, Card } from 'react-bootstrap';
import InformacionPersonal from './InformacionPersonal';
import Seguridad from './Seguridad';
import Preferencias from './Preferencias';
import regionesComunasData from '../../data/regiones_comunas.json';

const PerfilTabs = ({ 
  formData, 
  onInputChange, 
  onBlur,
  onSubmit, 
  errores = {}
}) => {
  const [comunasFiltradas, setComunasFiltradas] = useState([]);
  const [regiones, setRegiones] = useState([]);

  useEffect(() => {
    setRegiones(regionesComunasData.regiones || []);
  }, []);

  useEffect(() => {
    if (formData.region) {
      const regionSeleccionada = regiones.find(r => r.id === parseInt(formData.region));
      const comunas = regionSeleccionada ? regionSeleccionada.comunas : [];
      setComunasFiltradas(comunas);
    } else {
      setComunasFiltradas([]);
    }
  }, [formData.region, regiones]);

  const handleRegionChange = (e) => {
    const { name, value } = e.target;
    const regionSeleccionada = regiones.find(r => r.id === parseInt(value));
    
    onInputChange({
      target: {
        name: 'region',
        value: value
      }
    });

    if (formData.comuna) {
      onInputChange({
        target: {
          name: 'comuna',
          value: ''
        }
      });
    }
  };

  return (
    <div>
      <Tabs 
        defaultActiveKey="perfil" 
        className="mb-0"
        style={{ 
          fontFamily: "'Lato', sans-serif",
          border: 'none'
        }}
      >
        <Tab 
          eventKey="perfil" 
          title={
            <span 
              className="rounded-top-4 px-3 py-2"
              style={{ 
                fontFamily: "'Lato', sans-serif", 
                fontWeight: '600',
                backgroundColor: '#87CEEB',
                border: '3px solid #000000',
                borderBottom: '3px solid #000000',
                color: '#000000',
                marginRight: '5px',
                marginBottom: '-3px',
                position: 'relative',
                zIndex: 1
              }}
            >
              📝 Información Personal
            </span>
          }
        >
          <Card 
            className="shadow-lg border-3 border-dark rounded-4"
            style={{ 
              backgroundColor: '#87CEEB',
              borderTopLeftRadius: '0 !important',
              borderTopRightRadius: '0 !important',
              marginTop: '-3px'
            }}
          >
            <Card.Body className="p-4">
              <InformacionPersonal 
                formData={formData}
                onInputChange={onInputChange}
                onRegionChange={handleRegionChange}
                onBlur={onBlur}
                onSubmit={onSubmit}
                regiones={regiones}
                comunasFiltradas={comunasFiltradas}
                errores={errores}
              />
            </Card.Body>
          </Card>
        </Tab>

        <Tab 
          eventKey="seguridad" 
          title={
            <span 
              className="rounded-top-4 px-3 py-2"
              style={{ 
                fontFamily: "'Lato', sans-serif", 
                fontWeight: '600',
                backgroundColor: '#87CEEB',
                border: '3px solid #000000',
                borderBottom: '3px solid #000000',
                color: '#000000',
                marginRight: '5px',
                marginBottom: '-3px',
                position: 'relative',
                zIndex: 1
              }}
            >
              🔒 Seguridad
            </span>
          }
        >
          <Card 
            className="shadow-lg border-3 border-dark rounded-4"
            style={{ 
              backgroundColor: '#87CEEB',
              borderTopLeftRadius: '0 !important',
              borderTopRightRadius: '0 !important',
              marginTop: '-3px'
            }}
          >
            <Card.Body className="p-4">
              <Seguridad />
            </Card.Body>
          </Card>
        </Tab>

        <Tab 
          eventKey="preferencias" 
          title={
            <span 
              className="rounded-top-4 px-3 py-2"
              style={{ 
                fontFamily: "'Lato', sans-serif", 
                fontWeight: '600',
                backgroundColor: '#87CEEB',
                border: '3px solid #000000',
                borderBottom: '3px solid #000000',
                color: '#000000',
                marginBottom: '-3px',
                position: 'relative',
                zIndex: 1
              }}
            >
              ⚙️ Preferencias
            </span>
          }
        >
          <Card 
            className="shadow-lg border-3 border-dark rounded-4"
            style={{ 
              backgroundColor: '#87CEEB',
              borderTopLeftRadius: '0 !important',
              borderTopRightRadius: '0 !important',
              marginTop: '-3px'
            }}
          >
            <Card.Body className="p-4">
              <Preferencias />
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Estilos personalizados para hacer el tab activo más alto */}
      <style>
        {`
          .nav-tabs {
            border-bottom: none !important;
          }
          .nav-tabs .nav-link {
            border: none !important;
            background-color: transparent !important;
          }
          .nav-tabs .nav-link.active {
            background-color: transparent !important;
            border: none !important;
          }
          .nav-tabs .nav-item.show .nav-link {
            background-color: transparent !important;
            border: none !important;
          }
          
          /* Tabs inactivos - altura normal */
          .nav-tabs .nav-item .nav-link:not(.active) span {
            padding: 8px 16px !important;
            margin-bottom: -3px !important;
            transition: all 0.3s ease;
          }
          
          /* Tab activo - más alto */
          .nav-tabs .nav-item .nav-link.active span {
            padding: 12px 20px !important; /* Más padding = más alto */
            margin-bottom: -7px !important; /* Ajustar margen para mantener alineación */
            transform: translateY(-2px); /* Levantar un poco */
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Sombra para más profundidad */
            transition: all 0.3s ease;
          }
          
          /* Efecto hover para tabs inactivos */
          .nav-tabs .nav-item .nav-link:not(.active):hover span {
            background-color: #dedd8ff5 !important;
            transform: translateY(-1px);
            transition: all 0.2s ease;
          }
        `}
      </style>
    </div>
  );
};

export default PerfilTabs;