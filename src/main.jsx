import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter } from 'react-router-dom'
import { dataService } from './utils/dataService' 

// Función async para inicializar datos antes de renderizar
const initializeApp = async () => {
  try {
    console.log('🔄 Inicializando datos de la aplicación...');
    
    // Inicializar datos
    const success = dataService.initializeData();
    
    if (!success) {
      throw new Error('Falló la inicialización de datos');
    }
    
    // Verificar que los datos se cargaron correctamente
    const productos = dataService.getProductos();
    const usuarios = dataService.getUsuarios();
    const ordenes = dataService.getOrdenes();
    
    console.log('📦 Productos cargados:', productos.length);
    console.log('👤 Usuarios cargados:', usuarios.length);
    console.log('📋 Órdenes cargadas:', ordenes.length);
    
    if (productos.length === 0) {
      console.warn('⚠️ No se cargaron productos, forzando reset...');
      dataService.resetData();
    }
    
    console.log('✅ Inicialización completada exitosamente');
    return true;
  } catch (error) {
    console.error('💥 Error crítico inicializando datos:', error);
    
    // Último intento con reset completo
    try {
      console.log('🔄 Intentando reset de emergencia...');
      dataService.resetData();
      console.log('✅ Datos reseteados de emergencia');
      return true;
    } catch (resetError) {
      console.error('💥 Error incluso en reset de emergencia:', resetError);
      return false;
    }
  }
};

// Inicializar y luego renderizar
initializeApp().then((success) => {
  if (success) {
    createRoot(document.getElementById('root')).render(
      <StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StrictMode>,
    );
    console.log('🚀 Aplicación React montada correctamente');
  } else {
    console.error('❌ No se pudo inicializar la aplicación - Error crítico');
    // Mostrar mensaje de error al usuario
    document.getElementById('root').innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #f8d7da; color: #721c24; font-family: Arial, sans-serif;">
        <div style="text-align: center; padding: 2rem;">
          <h1>❌ Error de Carga</h1>
          <p>No se pudieron cargar los datos iniciales. Por favor, recarga la página.</p>
          <button onclick="window.location.reload()" style="padding: 10px 20px; background: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer;">
            Recargar Página
          </button>
        </div>
      </div>
    `;
  }
});