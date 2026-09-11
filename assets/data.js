// =========================================================================
// Cajitas llenas de amor — data.js
// Datos de cada persona, sus colores y los mensajes que le han dedicado.
// Para agregar más mensajes a una persona, añade objetos al array `mensajes`.
// =========================================================================

window.CAJITAS_DATA = {
  equipo: 'Cajitas llenas de amor',
  subtitulo: 'Una colección de cariños para cada persona del equipo.',
  personas: {
    'andres-gamba': {
      slug: 'andres-gamba',
      nombre: 'Andres Gamba',
      alias: null,
      iniciales: 'AG',
      color: '#345fea',
      colorSuave: '#1bc5ff',
      saludo: 'Para Andres Gamba',
      mensajes: []
    },
    'carlos-corredor': {
      slug: 'carlos-corredor',
      nombre: 'Carlos Corredor',
      alias: null,
      iniciales: 'CC',
      color: '#611ad8',
      colorSuave: '#345fea',
      saludo: 'Para Carlos Corredor',
      mensajes: [
        {
          texto: 'Te regalo este reconocimiento porque tu nobleza y caballerosidad transforman el ambiente. Eres la prueba diaria de que los valores impecables y una gran actitud son la mejor huella humana.'
        }
      ]
    },
    'santiago-daza': {
      slug: 'santiago-daza',
      nombre: 'Santiago Daza',
      alias: 'Santi',
      iniciales: 'SD',
      color: '#1bc5ff',
      colorSuave: '#32d894',
      saludo: 'Para Santiago Daza',
      mensajes: [
        {
          texto: 'Te regalo este reconocimiento porque detrás de tu sereno silencio habitan las ideas más brillantes; tu creatividad y agilidad son la solución justa cuando el camino se complica.'
        }
      ]
    },
    'andres-felipe': {
      slug: 'andres-felipe',
      nombre: 'Andrés Felipe',
      alias: 'Pipe',
      iniciales: 'AF',
      color: '#32d894',
      colorSuave: '#1bc5ff',
      saludo: 'Para Pipe',
      mensajes: [
        {
          texto: 'Te regalo este reconocimiento porque en cada reto encuentras un motivo para aprender, y tu sentido de la responsabilidad y apoyo constante son el verdadero motor que impulsa a este equipo.'
        }
      ]
    },
    'daniela-vivas': {
      slug: 'daniela-vivas',
      nombre: 'Daniela Vivas',
      alias: 'Dani',
      iniciales: 'DV',
      color: '#345fea',
      colorSuave: '#611ad8',
      saludo: 'Para Daniela Vivas',
      mensajes: [
        {
          texto: 'Te regalo este reconocimiento porque tu liderazgo trasciende lo ordinario; gracias por defender con nobleza a tu gente, ir más allá de la estrategia y enseñarnos a ver luz y color donde otros ven dificultad.'
        }
      ]
    },
    'paula-vivas': {
      slug: 'paula-vivas',
      nombre: 'Paula Vivas',
      alias: 'Pau',
      iniciales: 'PV',
      color: '#611ad8',
      colorSuave: '#1bc5ff',
      saludo: 'Para Paula Vivas',
      mensajes: [
        {
          texto: 'Te regalo este reconocimiento porque tu curiosidad e innovación le dan vida a nuestras redes, combinando una estrategia brillante con la puntualidad y el compromiso de siempre.'
        }
      ]
    },
    'luisa-pulido': {
      slug: 'luisa-pulido',
      nombre: 'Luisa Pulido',
      alias: 'Lu',
      iniciales: 'LP',
      color: '#1bc5ff',
      colorSuave: '#32d894',
      saludo: 'Para Luisa Pulido',
      mensajes: [
        {
          texto: 'Te regalo este reconocimiento porque siempre buscas el bienestar ajeno y, aun en las conversaciones más difíciles, tus palabras entregan la sabiduría y el equilibrio que todos necesitamos.'
        }
      ]
    },
    'nelson-rodriguez': {
      slug: 'nelson-rodriguez',
      nombre: 'Nelson Rodriguez',
      alias: null,
      iniciales: 'NR',
      color: '#32d894',
      colorSuave: '#345fea',
      saludo: 'Para Nelson Rodriguez',
      mensajes: [
        {
          texto: 'Te regalo este reconocimiento porque tu silencio guarda una resiliencia admirable. Gracias por adaptarte, ser nuestro salvavidas en estos momentos clave en servicio técnico y demostrarnos que tu compromiso siempre encuentra la forma de sumar.'
        }
      ]
    }
  },

  // Orden en que aparecen en la landing
  orden: [
    'andres-gamba',
    'carlos-corredor',
    'santiago-daza',
    'andres-felipe',
    'daniela-vivas',
    'paula-vivas',
    'luisa-pulido',
    'nelson-rodriguez'
  ],

  // Mensaje para cajas vacías (cuando aún no han escrito)
  mensajeVacio: {
    titulo: 'Tu caja se está llenando de cariño',
    cuerpo: 'Pronto encontrarás aquí los mensajes que el equipo tiene para ti. Vuelve cuando recibas la notificación ✨',
    icono: '💌'
  }
};

// Helper: busca una persona por slug
window.getPersona = function (slug) {
  return window.CAJITAS_DATA.personas[slug] || null;
};
