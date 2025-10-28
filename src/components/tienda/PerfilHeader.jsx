import React from 'react';
import perfilImage from '../../assets/tienda/perfil.png'; // Cambia por la ruta correcta

const PerfilHeader = () => {
  return (
    <div className="text-center">
      {/* Reemplazar el texto por la imagen */}
      <div className="mb-3">
        <img
          src={perfilImage}
          alt="Mi Perfil - Junimo Store"
          className="img-fluid"
          style={{
            maxWidth: '600px', // Ajusta según el tamaño de tu imagen
            width: '100%',
            filter: 'drop-shadow(3px 3px 6px rgba(0,0,0,0.8))'
          }}
          onError={(e) => {
            // Fallback si la imagen no carga
            e.target.style.display = 'none';
            // Mostrar texto alternativo
            const fallbackElement = document.getElementById('fallback-title');
            if (fallbackElement) {
              fallbackElement.style.display = 'block';
            }
          }}
        />
      </div>
      
      {/* Texto alternativo que se muestra si la imagen no carga */}
      <h1 
        id="fallback-title"
        className="mb-3"
        style={{
          fontFamily: "'Indie Flower', cursive",
          color: '#000000',
          fontWeight: 'bold',
          fontSize: '2.5rem',
          textShadow: '2px 2px 4px rgba(255, 255, 255, 0.8)',
          display: 'none' /* Oculto por defecto */
        }}
      >
        Mi Perfil
      </h1>
      
      <p 
        className="fs-5"
        style={{
          color: '#FFFFFF',
          fontWeight: '500',
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
        }}
      >
        Gestiona tu información personal y preferencias
      </p>
    </div>
  );
};

export default PerfilHeader;