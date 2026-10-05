// Textos de la web en español (el idioma de partida). en.ts y fr.ts tienen exactamente la misma forma.
// Los trozos en lista ['antes ', 'en negrita', ' después'] son frases con una parte destacada.
// Cifras y nombres de modelo salen del Catálogo General 2025 y no se traducen.

/** Textos de una serie del catálogo; `capacidad` solo cuando lleva palabras ("6 + 6 tubos") */
export interface TextoSerie {
  frase: string;
  uso?: string;
  capacidad?: string;
}

export const es = {
  y: 'y',
  meta: {
    locale: 'es_ES',
    fechas: 'es-ES',
    saltar: 'Saltar al contenido',
  },
  nav: {
    centrifugas: 'Centrífugas',
    tecnologia: 'Tecnología',
    smartconnect: 'SmartConnect',
    rei: 'REI System',
    configurador: 'Configurador',
    distribuidores: 'Distribuidores',
    servicio: 'Servicio técnico',
    empresa: 'Empresa',
  },
  cabecera: {
    inicio: 'Orto Alresa, inicio',
    principal: 'Principal',
    idioma: 'Idioma',
    contacto: 'Contacto',
    menu: 'Menú',
    cerrar: 'Cerrar',
  },
  buscador: {
    buscar: 'Buscar',
    etiqueta: 'Buscar en la web',
    ejemplo: 'Busca un modelo, p. ej. Digicen 22',
    nada: 'No hay resultados. Prueba con el nombre del modelo o escríbenos desde Contacto.',
    centrifuga: 'Centrífuga',
    seccion: 'Sección',
  },
  pie: {
    pedidos: 'Pedidos y distribuidores:',
    titulos: { centrifugas: 'Centrífugas', empresa: 'Empresa' },
    enlaces: {
      gama: 'Toda la gama',
      tecnologia: 'Tecnología',
      catalogo: 'Catálogo 2025',
      quienes: 'Quiénes somos',
      distribuidores: 'Distribuidores',
      aplicaciones: 'Aplicaciones',
      certificados: 'Certificados',
    },
    contacto: 'Contacto',
    servicio: 'Servicio técnico',
    info: 'Información general',
    siguenos: 'Síguenos',
    sellos: { ods: 'Objetivos de Desarrollo Sostenible', solidaria: 'Empresa Solidaria 2024' },
    ayudas: 'Ayudas públicas recibidas',
    legal: 'Legal',
    aviso: 'Aviso legal',
    privacidad: 'Privacidad',
    cookies: 'Cookies',
  },

  portada: {
    title: 'Orto Alresa · Centrífugas de laboratorio fabricadas en Madrid desde 1949',
    description:
      'Fabricantes europeos de centrífugas de laboratorio desde 1949. Más de 25 modelos, entrega en una semana y 3 años de garantía, a través de distribuidores especializados.',
  },

  hero: {
    // "Expertos en <b>centrifuga<i>ción</i></b>"
    titulo: ['Expertos en ', 'centrifuga', 'ción'],
    lead: 'Desde 1949 diseñamos y fabricamos centrífugas de laboratorio en Daganzo (Madrid) y las llevamos a todo el mundo a través de una red de distribuidores especializados.',
    gama: 'Ver la gama',
    distribuidor: 'Soy distribuidor',
  },

  tecnologia: {
    titulo: ['Tecnología ', 'propia'],
    intro:
      'Lo que diferencia a una centrífuga Orto Alresa está dentro. Estos son los sistemas que desarrollamos nosotros.',
    lollevan: 'Lo llevan',
    rei: {
      alt: 'Rotores con REI System: una mano levanta el tirador rojo para sacar el rotor',
      frase: ['Cambiar de rotor en ', 'segundos, con una mano', ' y sin herramientas.'],
      pasos: [
        'Se coloca en el eje del motor y queda anclado solo.',
        'Si no ha quedado bien puesto, la pantalla avisa.',
        'Para sacarlo, se levanta el tirador rojo.',
      ],
      video: 'Ver el vídeo',
    },
    smartconnect: {
      alt: 'La app SmartConnect en varias tablets: acceso, gráfica del programa y listados',
      entrar: 'Iniciar sesión',
      frase: ['Las centrífugas del laboratorio, ', 'vigiladas desde el móvil', '.'],
      puntos: [
        'App gratuita: se conecta a la WiFi y se consulta desde PC, tablet o móvil.',
        'Histórico de programas y descarga de datos en CSV.',
        'Usuarios con distintos niveles de acceso y registro de quién hizo qué.',
        'Avisos de seguridad y mantenimiento, y diagnóstico a distancia del servicio técnico.',
      ],
    },
    configurador: {
      nombre: 'Configurador',
      alt: 'Una mano con guante sostiene un tubo de tapón rojo sobre el rotor de una centrífuga',
      cifra: '6 pasos',
      cifraTexto: 'y das con tu centrífuga',
      frase: ['Responde a seis preguntas y te decimos ', 'qué modelo y qué rotor', '.'],
      pasos: ['Tipo de centrífuga', 'Ubicación', 'Tipo de tubo', 'Velocidad', 'Nº de posiciones', 'Tipo de rotor'],
      empezar: 'Empezar',
    },
  },

  empresa: {
    titulo: ['Nuestro objetivo no es ser una opción más, sino ir ', 'más allá de lo estándar'],
    alt: 'Rotor de una centrífuga Orto Alresa cargado con tubos de tapón rojo',
    boton: 'Conoce la empresa',
    pompas: [
      {
        cifra: '1949',
        titulo: 'Fabricantes de centrífugas',
        texto: 'Más de 75 años después, somos referente entre los fabricantes europeos.',
      },
      {
        cifra: 'Familiar',
        titulo: 'Una empresa de familia',
        texto: 'Buscamos integrar a nuestros socios, usuarios y asociados.',
      },
      {
        cifra: 'Daganzo',
        titulo: 'Fábrica propia en Madrid',
        texto: 'Fabricamos y atendemos desde aquí, con ISO 9001, ISO 13485 e ISO 14001.',
      },
    ],
    sellosTitulo: ['Certificados y normas que ', 'cumplimos'],
    anterior: 'Certificado anterior',
    siguiente: 'Certificado siguiente',
    certificados: [
      { nombre: 'ISO 9001', detalle: 'Calidad', texto: 'Gestión de la calidad en toda la empresa.' },
      {
        nombre: 'ISO 13485',
        detalle: 'Producto sanitario',
        texto: 'Sistema de calidad específico para productos sanitarios.',
      },
      { nombre: 'ISO 14001', detalle: 'Medio ambiente', texto: 'Gestión ambiental de la fábrica y de sus procesos.' },
      {
        nombre: 'IVDR',
        detalle: '(UE) 2017/746',
        texto: 'Conformes con el Reglamento europeo de diagnóstico in vitro.',
      },
      {
        nombre: 'CE',
        detalle: 'Marcado europeo',
        texto: 'Cumplen las directivas europeas de baja tensión y compatibilidad electromagnética.',
      },
      {
        nombre: 'EN 61010',
        detalle: 'Seguridad',
        texto: 'Seguridad de equipos de laboratorio, con su parte específica para centrífugas.',
      },
      {
        nombre: 'RoHS',
        detalle: '2011/65/UE',
        texto: 'Componentes sin las sustancias peligrosas que restringe la Unión Europea.',
      },
      { nombre: 'RAEE', detalle: '2012/19/UE', texto: 'El equipo se recoge y se recicla al final de su vida útil.' },
      {
        nombre: 'KC',
        detalle: 'Expedidor conocido',
        texto: 'Los envíos por avión salen con los controles de seguridad ya hechos.',
      },
    ],
  },

  distribuidores: {
    titulo: ['Crece con ', 'nosotros'],
    lead: 'Una empresa familiar que trata a cada distribuidor como socio. Así funciona un pedido con Orto Alresa.',
    laboratorio: '¿Eres un laboratorio? Encuentra tu distribuidor',
    pasos: [
      {
        cuando: 'Haces el pedido',
        cifra: 'Stock',
        unidad: '',
        titulo: 'Siempre disponible',
        texto: 'Stock continuo de toda la gama.',
      },
      {
        cuando: 'Llega a tu almacén en',
        cifra: '1',
        unidad: 'semana',
        titulo: 'Entrega rápida',
        texto: 'Plazo medio de entrega, gracias al stock continuo.',
      },
      {
        cuando: 'Si tienes una duda, respuesta en',
        cifra: '48',
        unidad: 'h',
        titulo: 'Asesoramiento',
        texto: 'Puesta en marcha, incidencias, reparaciones y formación técnica online.',
      },
      {
        cuando: 'Tu cliente, cubierto durante',
        cifra: '3',
        unidad: 'años',
        titulo: 'Garantía sin sorpresas',
        texto: 'En todas las centrífugas nuevas, salvo la Minicen (14 meses).',
      },
    ],
    oemTitulo: ['¿Necesitas un equipo ', 'a medida', '?'],
    oem: 'Fabricación OEM a medida, con análisis de riesgos y trazabilidad de origen a usuario.',
    boton: 'Hazte distribuidor',
  },

  aplicaciones: {
    titulo: ['Aplicaciones ', 'en el laboratorio'],
    leer: 'Leer la nota',
    todas: 'Ver todas las notas',
  },

  catalogo: {
    title: 'Centrífugas de laboratorio · Orto Alresa',
    description: (series: number, modelos: number) =>
      `Las ${series} series de centrífugas Orto Alresa (${modelos} modelos), fabricadas en Daganzo (Madrid): compactas, universales, gran capacidad, clínica e industria.`,
    titulo: ['Nuestras ', 'centrífugas'],
    lead: (series: number, modelos: number) =>
      `${modelos} modelos en ${series} series, fabricados en Daganzo (Madrid) y siempre en stock.`,
    indice: 'Familias',
  },

  /** Nombres de familia y textos de cada serie (las cifras están en src/data/productos.ts) */
  familias: {
    peq: 'Compactas',
    uni: 'Universales',
    gran: 'Gran capacidad',
    cli: 'Clínica',
    ind: 'Industria',
  },
  temperatura: { ventilada: 'ventilada', refrigerada: 'refrigerada', calefactada: 'calefactada' },
  series: {
    minicen: { frase: 'Su centrífuga personal para el laboratorio más exigente.' },
    'microcen-24': { frase: 'Altas prestaciones y versatilidad en una centrífuga pequeña.' },
    'biocen-22': { frase: 'Microtubos y microhematocrito en muy poco espacio.' },
    'biocen-22-r': { frase: 'Microcentrífuga refrigerada, robusta, versátil y eficiente.' },
    'digicen-22': { frase: 'Universal por concepto.' },
    'bioprocen-22-r': { frase: 'Pensada para bioprocesos, también con microplacas.' },
    'unicen-21': { frase: 'Universal, con rotores angulares y oscilantes.' },
    'consul-22': { frase: 'Gran capacidad en un equipo compacto.' },
    'digtor-22': { frase: 'Sobremesa, gran capacidad y las más altas prestaciones.' },
    'dilitcen-22-r': { frase: 'La mayor de sobremesa: hasta 4 litros por ciclo.' },
    'magnus-22': { frase: 'De suelo, para no quitar sitio en la poyata.' },
    'cyto-22': { uso: 'Citología', frase: 'Citología: concentra la muestra sobre el portaobjetos.' },
    'plasma-22': { uso: 'PRP y PRF', frase: 'Programas calculados para PRP y PRF.' },
    vetcen: {
      uso: 'Veterinaria',
      frase: 'Veterinaria: microtubos y capilares en un mismo ciclo.',
      capacidad: '6 + 6 tubos',
    },
    'digtor-22-col': { uso: 'Lipoescultura', frase: 'Para lipoescultura y cirugía reparativa.' },
    'digtor-22-c': { uso: 'Petróleo', frase: 'Petróleo: la mejor opción para tubos de 8" y 6".' },
    'lacter-21': {
      uso: 'Lácteos',
      frase: 'Lácteos: butirómetros Gerber, en marcha silenciosa.',
      capacidad: '12 butirómetros',
    },
  } satisfies Record<string, TextoSerie>,
};

export type Textos = typeof es;
