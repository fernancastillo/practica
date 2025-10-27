// src/utils/tienda/blogsUtils.js
import imagenBlog1 from '../../assets/tienda/sv.png';
import imagenBlog2 from '../../assets/tienda/svg.png';

// Datos de los blogs (podría moverse a un archivo JSON separado)
export const blogsData = [
  {
    id: 1,
    titulo: "Guía Completa de Stardew Valley para Principiantes",
    resumen: "Descubre los secretos para comenzar tu aventura en el valle. Desde la creación de tu granja hasta las relaciones con los habitantes del pueblo.",
    contenido: `
      <h2>¡Bienvenido al Valle!</h2>
      <p>Stardew Valley es más que un simple juego de granja. Es un mundo lleno de secretos, personajes memorables y actividades infinitas. Si acabas de empezar, esta guía te ayudará a evitar errores comunes y maximizar tu diversión.</p>
      
      <h3>📅 Tus Primeros Días</h3>
      <p><strong>Día 1-7:</strong> Enfócate en limpiar un pequeño espacio en tu granja para cultivar. Los <strong>frijoles verdes</strong> y las <strong>papas</strong> son excelentes opciones iniciales.</p>
      <p><strong>Consejo:</strong> No gastes toda tu energía el primer día. Guarda algo para explorar el pueblo.</p>
      
      <h3>🌱 Cultivos por Temporada</h3>
      <ul>
        <li><strong>Primavera:</strong> Fresas (después del Festival del Huevo)</li>
        <li><strong>Verano:</strong> Arándanos (muy rentables)</li>
        <li><strong>Otoño:</strong> Arándanos agrios</li>
      </ul>
      
      <h3>💝 Relaciones con los NPCs</h3>
      <p>Cada personaje tiene gustos únicos. Por ejemplo:</p>
      <ul>
        <li><strong>Abigail:</strong> Amatistas y cuarzo</li>
        <li><strong>Shane:</strong> Pizza y cerveza</li>
        <li><strong>Leah:</strong> Ensalada y vino</li>
      </ul>
      
      <h3>⚒️ Herramientas Básicas</h3>
      <p>Mejora tus herramientas en la herrería en este orden:</p>
      <ol>
        <li>Hacha (para madera)</li>
        <li>Pico (para minerales)</li>
        <li>Regadera (para cultivos más grandes)</li>
      </ol>
      
      <p>¡Recuerda que lo más importante es disfrutar del proceso! No hay una forma "correcta" de jugar Stardew Valley.</p>
    `,
    imagen: imagenBlog1,
    fecha: "15 de Noviembre, 2024",
    autor: "Junimo Team",
    categoria: "Guías",
    tiempoLectura: "4 min",
    tags: ["principiantes", "guía", "consejos", "granja"]
  },
  {
    id: 2,
    titulo: "Los Secretos Mejor Guardados de Stardew Valley",
    resumen: "Exploramos los easter eggs, lugares secretos y contenido oculto que muchos jugadores se pierden en su primera partida.",
    contenido: `
      <h2>🔍 Secretos del Valle</h2>
      <p>Stardew Valley está lleno de misterios y contenido oculto. Aquí te revelamos algunos de los mejores secretos:</p>
      
      <h3>🎭 El Mercado Negro de los Viernes</h3>
      <p>Cada viernes, visita el camión junto a la casa de Marnie. Allí encontrarás a una misteriosa vendedora que ofrece objetos raros y prohibidos.</p>
      
      <h3>👻 El Fantasma del Cementerio</h3>
      <p>Visita el cementerio en la noche del día 1 de cada temporada. Si tienes suerte, podrás ver una aparición fantasmagórica.</p>
      
      <h3>🗝️ La Cueva del Bosque Secret</h3>
      <p>En el noroeste del Bosque Ceniciento, hay un tronco grande que puedes romper con un hacha de acero. Detrás encontrarás una cueva secreta con recursos únicos.</p>
      
      <h3>🎮 Referencias a Otros Juegos</h3>
      <ul>
        <li>En la biblioteca, busca el libro "El Príncipe de los Guisantes"</li>
        <li>El nombre "Junimo" es un homenaje a los espíritus del bosque</li>
        <li>Las minas tienen referencias a juegos de rol clásicos</li>
      </ul>
      
      <h3>💎 La Espada Galaxy</h3>
      <p>Para obtener esta poderosa arma:</p>
      <ol>
        <li>Llega al nivel 120 de las minas</li>
        <li>Consigue una barra de iridio</li>
        <li>Ofrécesela al altar en el desierto</li>
      </ol>
      
      <h3>🎨 Arte Oculto</h3>
      <p>Algunos cuadros en las casas de los NPCs cambian según eventos especiales. Presta atención a los detalles.</p>
      
      <h3>🐔 La Gallina de Oro</h3>
      <p>Existe una pequeña posibilidad de que una gallina ponga un huevo de oro. ¡Es extremadamente raro!</p>
      
      <p>¿Conoces algún otro secreto? ¡Compártelo en los comentarios!</p>
    `,
    imagen: imagenBlog2,
    fecha: "10 de Noviembre, 2024",
    autor: "Granjero Experto",
    categoria: "Secretos",
    tiempoLectura: "6 min",
    tags: ["secretos", "easter eggs", "contenido oculto", "misterios"]
  }
];

// Valida el formato de email
export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Maneja el envío del formulario de suscripción
export const manejarSuscripcion = (email, setEmail, setShowAlert, setAlertMessage) => {
  if (!email) {
    setAlertMessage('❌ Por favor ingresa tu email');
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
    return false;
  }

  if (!validarEmail(email)) {
    setAlertMessage('❌ Por favor ingresa un email válido');
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
    return false;
  }

  // Simular suscripción
  console.log('Email suscrito:', email);

  setAlertMessage('✅ ¡Te has suscrito exitosamente! Revisa tu email para confirmar.');
  setShowAlert(true);
  setEmail('');

  setTimeout(() => setShowAlert(false), 5000);
  return true;
};

// Obtener noticias relacionadas basadas en el título del blog
export const obtenerNoticiasRelacionadas = (tituloBlog) => {
  const palabrasClave = tituloBlog.toLowerCase().split(' ');
  
  // Base de datos de noticias relacionadas
  const todasLasNoticias = [
    {
      id: 1,
      titulo: "Nueva Actualización de Stardew Valley Trae Más Contenido",
      resumen: "La última actualización incluye nuevos cultivos, personajes y eventos estacionales.",
      categoria: "Actualizaciones",
      fecha: "20 Nov 2024",
      relevancia: ["stardew", "valley", "actualización", "contenido"]
    },
    {
      id: 2,
      titulo: "Consejos para Maximizar Tu Producción en la Granja",
      resumen: "Aprende a organizar tu granja para obtener las mejores ganancias.",
      categoria: "Guías",
      fecha: "18 Nov 2024",
      relevancia: ["consejos", "granja", "producción", "ganancias", "guía"]
    },
    {
      id: 3,
      titulo: "Los Secretos de las Minas que Todo Jugador Debe Conocer",
      resumen: "Descubre cómo superar los niveles más difíciles de las minas.",
      categoria: "Secretos",
      fecha: "16 Nov 2024",
      relevancia: ["secretos", "minas", "niveles", "jugador"]
    }
  ];

  // Calcular relevancia
  const noticiasConPuntaje = todasLasNoticias.map(noticia => {
    let puntaje = 0;
    palabrasClave.forEach(palabra => {
      if (noticia.relevancia.includes(palabra)) {
        puntaje += 2;
      }
      if (noticia.titulo.toLowerCase().includes(palabra)) {
        puntaje += 1;
      }
      if (noticia.resumen.toLowerCase().includes(palabra)) {
        puntaje += 0.5;
      }
    });
    return { ...noticia, puntaje };
  });

  // Filtrar y ordenar por puntaje
  const noticiasRelacionadas = noticiasConPuntaje
    .filter(noticia => noticia.puntaje > 0)
    .sort((a, b) => b.puntaje - a.puntaje)
    .slice(0, 2);

  // Si no hay suficientes noticias relacionadas, agregar algunas generales
  if (noticiasRelacionadas.length < 2) {
    const noticiasGenerales = todasLasNoticias
      .filter(noticia => !noticiasRelacionadas.some(n => n.id === noticia.id))
      .slice(0, 2 - noticiasRelacionadas.length);
    
    return [...noticiasRelacionadas, ...noticiasGenerales];
  }

  return noticiasRelacionadas;
};