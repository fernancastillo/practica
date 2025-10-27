import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/tienda/Navbar/Navbar'
import Footer from './components/tienda/Footer/Footer'
import Index from './pages/tienda/Index'
import Login from './pages/tienda/Login'
import RegistroUsuario from './pages/tienda/RegistroUsuario'
import Dashboard from './pages/admin/Dashboard'
import Ordenes from './pages/admin/Ordenes'
import Usuarios from './pages/admin/Usuarios'
import Perfil from './pages/admin/Perfil'
import ProductoDetalle from './pages/tienda/productoDetalle'
import Nosotros from './pages/tienda/Nosotros'
import Contacto from './pages/tienda/Contacto'
import Blogs from './pages/tienda/blogs'
import Ofertas from './pages/tienda/ofertas'
import Carrito from './pages/tienda/Carrito'
import AdminSidebar, { AdminMobileNavbar } from './components/admin/AdminSidebar'
import AdminProtectedRoute from './components/admin/AdminProtectedRoute' 
import Pedidos from './pages/tienda/Pedidos' 
import PerfilUsuario from './pages/tienda/PerfilUsuario'
import UserProtectedRoute from './components/UserProtectedRoute'

function App() {
  return (
    <>
      <Routes>
        {/* RUTAS DE ADMIN */}
        <Route path="/admin/*" element={
          <AdminProtectedRoute>
            <div className="container-fluid p-0">
              <AdminMobileNavbar />
              
              <div className="row g-0">
                <div className="col-lg-1 col-md-2 d-none d-md-block min-vh-100">
                  <AdminSidebar />
                </div>
                
                <div className="col-lg-11 col-md-10 ms-auto">
                  <div className="d-md-none" style={{ height: '70px' }}></div>
                  <div className="container-fluid mt-4">
                    <Routes>
                      <Route path='/dashboard' element={<Dashboard/>} />
                      <Route path='/ordenes' element={<Ordenes/>} />
                      <Route path='/usuarios' element={<Usuarios/>} />
                      <Route path='/perfil' element={<Perfil/>} />
                      <Route path='/' element={<Navigate to="/admin/dashboard" replace />} />
                      <Route path='*' element={<Navigate to="/admin/dashboard" replace />} />
                    </Routes>
                  </div>
                </div>
              </div>
            </div>
          </AdminProtectedRoute>
        } />
        
        {/* RUTAS PÚBLICAS */}
        <Route path="/*" element={
          <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <main className="flex-grow-1">
              <Routes>
                {/* Rutas públicas principales */}
                <Route path='/index' element={<Index/>} />
                <Route path="/producto/:codigo" element={<ProductoDetalle />} />
                <Route path='/carrito' element={<Carrito/>} />
                <Route path='/blogs' element={<Blogs/>} />
                <Route path='/nosotros' element={<Nosotros/>} />
                <Route path='/contacto' element={<Contacto/>} />
                <Route path='/ofertas' element={<Ofertas/>} />
                <Route path='/login' element={<Login/>} />
                <Route path='/registro' element={<RegistroUsuario/>} />
                
                {/* Rutas protegidas para usuarios logueados */}
                <Route path='/pedidos' element={
                  <UserProtectedRoute>
                    <Pedidos/>
                  </UserProtectedRoute>
                } />
                <Route path='/perfil' element={
                  <UserProtectedRoute>
                    <PerfilUsuario/>
                  </UserProtectedRoute>
                } />
                
                {/* Redirecciones y catch-all */}
                <Route path='/' element={<Navigate to="/index" replace />} />
                <Route path='/home' element={<Navigate to="/index" replace />} />
                <Route path='*' element={<Navigate to="/index" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        } />
      </Routes>
    </>
  )
}

export default App