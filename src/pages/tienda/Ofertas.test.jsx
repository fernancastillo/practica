// src/pages/tienda/Ofertas.test.jsx
import { render, screen, waitFor, act } from '@testing-library/react'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import Ofertas from './Ofertas'

// Paso 1: Mock básico de react-bootstrap
vi.mock('react-bootstrap', () => ({
  Container: ({ children, ...props }) => <div {...props}>{children}</div>,
  Row: ({ children, ...props }) => <div {...props}>{children}</div>,
  Col: ({ children, ...props }) => <div {...props}>{children}</div>,
}))

// Paso 2: Mock básico de react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  BrowserRouter: ({ children }) => <div>{children}</div>,
}))

// Paso 3: Mock básico de los servicios
vi.mock('../../utils/tienda/authService', () => ({
  authService: {
    getCurrentUser: vi.fn(() => null),
  },
}))

vi.mock('../../utils/tienda/stockService', () => ({
  actualizarStockEnProductos: vi.fn(),
}))

vi.mock('../../utils/tienda/ofertasData', () => ({
  aplicarOfertasAProductos: vi.fn((productos) => productos),
}))

// Paso 4: Mock básico de componentes hijos
vi.mock('../../components/tienda/OfertasHeader', () => ({
  default: () => <div data-testid="ofertas-header">Header Mock</div>,
}))

vi.mock('../../components/tienda/OfertasInfoCard', () => ({
  default: () => <div data-testid="ofertas-info-card">Info Card Mock</div>,
}))

vi.mock('../../components/tienda/OfertasGrid', () => ({
  default: () => <div data-testid="ofertas-grid">Grid Mock</div>,
}))

// Mock de localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('Ofertas', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
  })

  test('renderiza el componente sin errores', async () => {
    localStorageMock.getItem.mockReturnValue(null)

    await act(async () => {
      render(
        <BrowserRouter>
          <Ofertas />
        </BrowserRouter>
      )
    })

    // Verifica que los componentes hijos se renderizan
    expect(screen.getByTestId('ofertas-header')).toBeInTheDocument()
    expect(screen.getByTestId('ofertas-info-card')).toBeInTheDocument()
    expect(screen.getByTestId('ofertas-grid')).toBeInTheDocument()
  })

  test('intenta cargar productos desde localStorage', async () => {
    localStorageMock.getItem.mockReturnValue(null)

    await act(async () => {
      render(
        <BrowserRouter>
          <Ofertas />
        </BrowserRouter>
      )
    })

    expect(localStorageMock.getItem).toHaveBeenCalledWith('app_productos')
  })

  test('actualiza stock al montar el componente', async () => {
    localStorageMock.getItem.mockReturnValue(null)

    await act(async () => {
      render(
        <BrowserRouter>
          <Ofertas />
        </BrowserRouter>
      )
    })

    // Verifica que se llamó a actualizarStockEnProductos
    const stockService = await import('../../utils/tienda/stockService')
    expect(stockService.actualizarStockEnProductos).toHaveBeenCalledTimes(1)
  })
})