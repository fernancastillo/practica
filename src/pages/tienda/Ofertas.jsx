// src/pages/tienda/Ofertas.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../utils/tienda/authService';
import { actualizarStockEnProductos } from '../../utils/tienda/stockService'; // ✅ CORREGIR IMPORT
import OfertasHeader from '../../components/tienda/OfertasHeader'; // ✅ AGREGAR /ofertas/
import OfertasInfoCard from '../../components/tienda/OfertasInfoCard'; // ✅ AGREGAR /ofertas/
import OfertasGrid from '../../components/tienda/OfertasGrid'; // ✅ AGREGAR /ofertas/
import { aplicarOfertasAProductos } from '../../utils/tienda/ofertasData';

const Ofertas = () => {
  const [ofertas, setOfertas] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Función simplificada: Cargar productos con ofertas
  const cargarOfertas = () => {
    try {
      // Obtener productos del localStorage
      const productosStorage = localStorage.getItem('app_productos');
      
      if (productosStorage) {
        const productos = JSON.parse(productosStorage);
        
        // Aplicar ofertas a los productos
        const productosConOfertas = aplicarOfertasAProductos(productos);
        
        console.log('🔄 Ofertas cargadas:', productosConOfertas);
        setOfertas(productosConOfertas);
      } else {
        console.log('❌ No hay productos en localStorage');
        // Si no hay productos en localStorage, cargar desde JSON local
        import('../../data/productos.json')
          .then(productosData => {
            const productosConOfertas = aplicarOfertasAProductos(productosData.default);
            setOfertas(productosConOfertas);
            
            // Guardar en localStorage para futuras cargas
            localStorage.setItem('app_productos', JSON.stringify(productosData.default));
          })
          .catch(error => {
            console.error('Error cargando productos desde JSON:', error);
          });
      }
    } catch (error) {
      console.error('Error cargando ofertas:', error);
    }
  };

  // Cargar ofertas al montar el componente
  useEffect(() => {
    actualizarStockEnProductos();
    cargarOfertas();
  }, []);

  // Verificar autenticación al cargar
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);

    const handleAuthChange = () => {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
    };

    window.addEventListener('authStateChanged', handleAuthChange);
    return () => {
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);

  return (
    <div 
      className="min-vh-100"
      style={{
        backgroundImage: 'url("https://images3.alphacoders.com/126/1269904.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center 20%',
        backgroundAttachment: 'fixed',
        fontFamily: "'Lato', sans-serif"
      }}
    >
      <div style={{ height: '120px' }}></div>

      <Container className="py-5">
        <OfertasHeader user={user} />
        <OfertasInfoCard user={user} ofertasCount={ofertas.length} navigate={navigate} />
        <OfertasGrid 
          ofertas={ofertas}
          user={user}
        />
      </Container>
    </div>
  );
};

export default Ofertas;