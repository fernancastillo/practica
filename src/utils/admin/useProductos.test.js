
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useProductos } from './useProductos' // ./ para mismo directorio
import { dataService } from '../dataService'

// Mock de dataService
vi.mock('../dataService', () => ({
  dataService: {
    getProductos: vi.fn(),
    addProducto: vi.fn(),
    updateProducto: vi.fn(),
    deleteProducto: vi.fn()
  }
}))

// Mock de localStorage
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: vi.fn(key => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString()
    }),
    removeItem: vi.fn(key => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    })
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock de window.confirm
window.confirm = vi.fn()

describe('useProductos', () => {
  const mockProductos = [
    {
      codigo: 'AC001',
      nombre: 'Producto 1',
      categoria: 'Accesorios',
      precio: 100,
      stock: 10,
      stock_critico: 5
    },
    {
      codigo: 'DE001',
      nombre: 'Producto 2',
      categoria: 'Decoración',
      precio: 200,
      stock: 3,
      stock_critico: 5
    },
    {
      codigo: 'GU001',
      nombre: 'Producto 3',
      categoria: 'Guías',
      precio: 50,
      stock: 0,
      stock_critico: 2
    }
  ]

  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    dataService.getProductos.mockReturnValue([...mockProductos])
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Inicialización', () => {
    it('debe cargar productos y categorías al inicializar', () => {
      const { result } = renderHook(() => useProductos())

      expect(dataService.getProductos).toHaveBeenCalled()
      expect(result.current.productos).toEqual(mockProductos)
      expect(result.current.categorias).toEqual([
        'Accesorios',
        'Decoración',
        'Guías',
        'Juego De Mesa',
        'Mods Digitales',
        'Peluches',
        'Polera Personalizada'
      ])
    })

    it('debe combinar categorías base con categorías personalizadas', () => {
      const categoriasPersonalizadas = ['Nueva Categoria 1', 'Nueva Categoria 2']
      localStorage.setItem('admin_categorias', JSON.stringify(categoriasPersonalizadas))

      const { result } = renderHook(() => useProductos())

      expect(result.current.categorias).toEqual([
        'Accesorios',
        'Decoración',
        'Guías',
        'Juego De Mesa',
        'Mods Digitales',
        'Peluches',
        'Polera Personalizada',
        'Nueva Categoria 1',
        'Nueva Categoria 2'
      ])
    })
  })

  describe('Gestión de productos', () => {
    it('debe crear un nuevo producto exitosamente', () => {
      const { result } = renderHook(() => useProductos())
      const nuevoProducto = {
        nombre: 'Nuevo Producto',
        categoria: 'Accesorios',
        precio: 150,
        stock: 20,
        stock_critico: 5
      }

      act(() => {
        const resultado = result.current.handleCreate(nuevoProducto)
        expect(resultado.success).toBe(true)
      })

      expect(dataService.addProducto).toHaveBeenCalledWith(
        expect.objectContaining({
          nombre: 'Nuevo Producto',
          categoria: 'Accesorios',
          codigo: expect.any(String)
        })
      )
    })

    it('debe actualizar un producto existente', () => {
      const { result } = renderHook(() => useProductos())
      const productoActualizado = {
        nombre: 'Producto Actualizado',
        categoria: 'Accesorios',
        precio: 180,
        stock: 15,
        stock_critico: 5
      }

      act(() => {
        const resultado = result.current.handleUpdate('AC001', productoActualizado)
        expect(resultado.success).toBe(true)
      })

      expect(dataService.updateProducto).toHaveBeenCalledWith('AC001', productoActualizado)
    })

    it('debe eliminar un producto con confirmación', () => {
      window.confirm.mockReturnValue(true)
      const { result } = renderHook(() => useProductos())

      act(() => {
        result.current.handleDelete('AC001')
      })

      expect(window.confirm).toHaveBeenCalledWith('¿Estás seguro de que quieres eliminar este producto?')
      expect(dataService.deleteProducto).toHaveBeenCalledWith('AC001')
    })

    it('no debe eliminar producto si se cancela la confirmación', () => {
      window.confirm.mockReturnValue(false)
      const { result } = renderHook(() => useProductos())

      act(() => {
        result.current.handleDelete('AC001')
      })

      expect(dataService.deleteProducto).not.toHaveBeenCalled()
    })
  })

  describe('Filtros y ordenamiento', () => {
    it('debe filtrar productos por código', () => {
      const { result } = renderHook(() => useProductos())

      act(() => {
        result.current.handleFiltroChange({
          target: { name: 'codigo', value: 'AC' }
        })
      })

      // Los productos filtrados deberían incluir solo el que tiene código AC
      const productosFiltrados = result.current.productosFiltrados
      expect(productosFiltrados.every(p => p.codigo.includes('AC'))).toBe(true)
    })

    it('debe limpiar todos los filtros', () => {
      const { result } = renderHook(() => useProductos())

      // Aplicar algunos filtros primero
      act(() => {
        result.current.handleFiltroChange({
          target: { name: 'codigo', value: 'AC' }
        })
      })

      // Verificar que el filtro se aplicó
      expect(result.current.filtros.codigo).toBe('AC')

      // Limpiar filtros
      act(() => {
        result.current.handleLimpiarFiltros()
      })

      expect(result.current.filtros.codigo).toBe('')
      expect(result.current.filtros.categoria).toBe('')
      expect(result.current.filtros.nombre).toBe('')
    })
  })

  describe('Gestión de modal', () => {
    it('debe abrir modal para crear nuevo producto', () => {
      const { result } = renderHook(() => useProductos())

      act(() => {
        result.current.handleCreateNew()
      })

      expect(result.current.showModal).toBe(true)
      expect(result.current.editingProducto).toBeNull()
    })

    it('debe abrir modal para editar producto', () => {
      const { result } = renderHook(() => useProductos())
      const productoAEditar = mockProductos[0]

      act(() => {
        result.current.handleEdit(productoAEditar)
      })

      expect(result.current.showModal).toBe(true)
      expect(result.current.editingProducto).toBe(productoAEditar)
    })

    it('debe cerrar modal', () => {
      const { result } = renderHook(() => useProductos())

      // Abrir modal primero
      act(() => {
        result.current.handleCreateNew()
      })

      expect(result.current.showModal).toBe(true)

      // Cerrar modal
      act(() => {
        result.current.handleCloseModal()
      })

      expect(result.current.showModal).toBe(false)
      expect(result.current.editingProducto).toBeNull()
    })
  })
})