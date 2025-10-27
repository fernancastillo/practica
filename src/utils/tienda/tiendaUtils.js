export const formatearPrecio = (precio) => {
  return `$${precio.toLocaleString('es-CL')}`;
};

export const categoryIcons = {
  'all': '⭐',
  'Accesorios': '🔑',
  'Decoración': '🏠',
  'Peluches': '🧸',
  'Guías': '📚',
  'Mods Digitales': '💻',
  'Polera Personalizada': '👕',
  'Juego De Mesa': '🎲'
};

export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

export const handleImageError = (e, placeholderText = 'Imagen No Disponible') => {
  e.target.src = `https://via.placeholder.com/300x200/2E8B57/000000?text=${encodeURIComponent(placeholderText)}`;
};