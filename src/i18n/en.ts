// English texts. Same shape as es.ts. Draft translation: pending review by Orto Alresa.
import type { Textos } from './es';

export const en: Textos = {
  y: 'and',
  meta: {
    locale: 'en_GB',
    fechas: 'en-GB',
    saltar: 'Skip to content',
  },
  nav: {
    centrifugas: 'Products',
    tecnologia: 'Technology',
    smartconnect: 'SmartConnect',
    rei: 'REI System',
    configurador: 'Configurator',
    distribuidores: 'Distributors',
    servicio: 'Technical service',
    descargas: 'Downloads',
    noticias: 'News',
    empresa: 'Company',
  },
  cabecera: {
    inicio: 'Orto Alresa, home',
    principal: 'Main',
    idioma: 'Language',
    contacto: 'Contact',
    menu: 'Menu',
    cerrar: 'Close',
  },
  buscador: {
    buscar: 'Search',
    etiqueta: 'Search the site',
    ejemplo: 'Search for a model, e.g. Digicen 22',
    nada: 'No results. Try the model name or write to us from Contact.',
    centrifuga: 'Centrifuge',
    seccion: 'Section',
  },
  pie: {
    pedidos: 'Orders and distributors:',
    titulos: { centrifugas: 'Centrifuges', empresa: 'Company' },
    enlaces: {
      gama: 'Full range',
      tecnologia: 'Technology',
      catalogo: 'Catalogue 2025',
      quienes: 'About us',
      distribuidores: 'Distributors',
      aplicaciones: 'Applications',
      certificados: 'Certificates',
    },
    contacto: 'Contact',
    servicio: 'Technical service',
    info: 'General information',
    siguenos: 'Follow us',
    sellos: { ods: 'Sustainable Development Goals', solidaria: 'Empresa Solidaria 2024' },
    ayudas: 'Public funding received',
    legal: 'Legal',
    aviso: 'Legal notice',
    privacidad: 'Privacy',
    cookies: 'Cookies',
  },

  portada: {
    title: 'Orto Alresa · Laboratory centrifuges made in Madrid since 1949',
    description:
      'European manufacturers of laboratory centrifuges since 1949. More than 25 models, one-week delivery and a 3-year warranty, through specialised distributors.',
  },

  hero: {
    titulo: ['Experts in ', 'centrifuga', 'tion'],
    lead: 'Since 1949 we have designed and manufactured laboratory centrifuges in Daganzo (Madrid), and we take them all over the world through a network of specialised distributors.',
    gama: 'See the range',
    distribuidor: 'I’m a distributor',
  },

  tecnologia: {
    titulo: ['Our own ', 'technology'],
    intro: 'What sets an Orto Alresa centrifuge apart is on the inside. These are the systems we develop ourselves.',
    lollevan: 'Available on',
    rei: {
      alt: 'Rotors with REI System: a hand lifts the red handle to take the rotor out',
      frase: ['Change the rotor in ', 'seconds, with one hand', ' and no tools.'],
      pasos: [
        'It goes onto the motor shaft and locks itself in place.',
        'If it is not seated properly, the display warns you.',
        'To take it out, lift the red handle.',
      ],
      video: 'Watch the video',
    },
    smartconnect: {
      alt: 'The SmartConnect app on several tablets: login, program graph and lists',
      entrar: 'Log in',
      frase: ['Your lab’s centrifuges, ', 'monitored from your phone', '.'],
      puntos: [
        'Free app: it connects to the Wi-Fi and can be checked from a PC, tablet or phone.',
        'Program history and data download in CSV.',
        'Users with different access levels and a record of who did what.',
        'Safety and maintenance alerts, and remote diagnosis by our technical service.',
      ],
    },
    configurador: {
      nombre: 'Configurator',
      alt: 'A gloved hand holds a red-capped tube above a centrifuge rotor',
      cifra: '6 steps',
      cifraTexto: 'to find your centrifuge',
      frase: ['Answer six questions and we’ll tell you ', 'which model and which rotor', '.'],
      pasos: ['Centrifuge type', 'Location', 'Tube type', 'Speed', 'No. of positions', 'Rotor type'],
      empezar: 'Start',
    },
  },

  empresa: {
    titulo: ['Our goal is not to be just another option, but to go ', 'beyond the standard'],
    alt: 'Rotor of an Orto Alresa centrifuge loaded with red-capped tubes',
    boton: 'Discover the company',
    pompas: [
      {
        cifra: '1949',
        titulo: 'Centrifuge manufacturers',
        texto: 'More than 75 years later, we are a benchmark among European manufacturers.',
      },
      {
        cifra: 'Family',
        titulo: 'A family business',
        texto: 'We strive to bring our partners, users and associates into the family.',
      },
      {
        cifra: 'Daganzo',
        titulo: 'Our own factory in Madrid',
        texto: 'We manufacture and give support from here, with ISO 9001, ISO 13485 and ISO 14001.',
      },
    ],
    sellosTitulo: ['Certificates and standards we ', 'comply with'],
    anterior: 'Previous certificate',
    siguiente: 'Next certificate',
    certificados: [
      { nombre: 'ISO 9001', detalle: 'Quality', texto: 'Quality management across the whole company.' },
      { nombre: 'ISO 13485', detalle: 'Medical devices', texto: 'Quality system specific to medical devices.' },
      {
        nombre: 'ISO 14001',
        detalle: 'Environment',
        texto: 'Environmental management of the factory and its processes.',
      },
      {
        nombre: 'IVDR',
        detalle: '(EU) 2017/746',
        texto: 'Compliant with the European In Vitro Diagnostic Medical Devices Regulation.',
      },
      {
        nombre: 'CE',
        detalle: 'European marking',
        texto: 'They meet the European low voltage and electromagnetic compatibility directives.',
      },
      {
        nombre: 'EN 61010',
        detalle: 'Safety',
        texto: 'Safety of laboratory equipment, with its specific part for centrifuges.',
      },
      {
        nombre: 'RoHS',
        detalle: '2011/65/EU',
        texto: 'Components free of the hazardous substances restricted by the European Union.',
      },
      {
        nombre: 'WEEE',
        detalle: '2012/19/EU',
        texto: 'The equipment is collected and recycled at the end of its life.',
      },
      {
        nombre: 'KC',
        detalle: 'Known consignor',
        texto: 'Air shipments leave with the security checks already done.',
      },
    ],
  },

  distribuidores: {
    titulo: ['Grow with ', 'us'],
    lead: 'A family business that treats every distributor as a partner. This is how an order with Orto Alresa works.',
    laboratorio: 'Are you a laboratory? Find your distributor',
    pasos: [
      {
        cuando: 'You place the order',
        cifra: 'Stock',
        unidad: '',
        titulo: 'Always available',
        texto: 'Continuous stock of the whole range.',
      },
      {
        cuando: 'It reaches your warehouse in',
        cifra: '1',
        unidad: 'week',
        titulo: 'Fast delivery',
        texto: 'Average delivery time, thanks to continuous stock.',
      },
      {
        cuando: 'Any question? Answer within',
        cifra: '48',
        unidad: 'h',
        titulo: 'Expert advice',
        texto: 'Start-up, incidents, repairs and online technical training.',
      },
      {
        cuando: 'Your customer, covered for',
        cifra: '3',
        unidad: 'years',
        titulo: 'No-surprise warranty',
        texto: 'On all new centrifuges, except the Minicen (14 months).',
      },
    ],
    oemTitulo: ['Need ', 'custom-built', ' equipment?'],
    oem: 'Custom OEM manufacturing, with risk analysis and traceability from origin to user.',
    boton: 'Become a distributor',
  },

  aplicaciones: {
    titulo: ['Applications ', 'in the laboratory'],
    leer: 'Read the note',
    todas: 'See all notes',
  },

  catalogo: {
    title: 'Products · Centrifuges and laboratory equipment · Orto Alresa',
    description: (series: number, modelos: number) =>
      `The ${series} Orto Alresa centrifuge series (${modelos} models), made in Daganzo (Madrid), plus sieve shaker, ball mill, water stills and accessories.`,
    titulo: ['Our ', 'products'],
    lead: (series: number, modelos: number) =>
      `${modelos} centrifuges in ${series} series, made in Daganzo (Madrid) and always in stock, plus laboratory equipment and accessories.`,
    indice: 'Families',
    iconos: { capacidad: 'Capacity', pantalla: 'Display', velocidad: 'Speed', temperatura: 'Temperature' },
    categorias: {
      mini: 'Mini centrifuge',
      pequena: 'Small',
      micro: 'Microcentrifuge',
      universal: 'Universal',
      gran: 'High capacity',
      sobrepiso: 'Floor-standing',
      oil: 'Oil/Petrol',
      tejidos: 'Tissues',
      lacteos: 'Dairy/Vet',
    },
    grupos: { generales: 'General applications', especiales: 'Special applications', otros: 'More products' },
    cifras: {
      desde: 'manufacturing in Daganzo',
      stock: 'Always in stock',
      centrifugas: 'centrifuges',
      aplicaciones: 'applications',
      otros: 'accessories and equipment',
    },
    filtros: {
      cortos: { accesorios: 'Accessories', laboratorio: 'Laboratory' },
      titulo: 'Filter by',
      buscar: 'Search a model or an application',
      todo: 'All',
      temperatura: 'Temperature',
      resultados: (n: number) => (n === 1 ? '1 product' : `${n} products`),
      limpiar: 'Clear filters',
      vacio: 'No product matches all these filters.',
    },
  },

  laboratorio: {
    equipos: 'Other laboratory products',
    accesorios: 'Centrifuge accessories',
    pdf: 'PDF catalogue',
    items: {
      tamizadora: {
        nombre: 'Sieve shaker and sieves',
        frase: 'Analytical wet and dry sieving with reproducible results.',
        datos: 'Up to 6 kg · 8 sieves of 50 mm · from 40 µm to 125 mm',
      },
      'molino-de-bolas': {
        nombre: 'Ball mill',
        frase: 'Grinding in sealed jars that prevent sample contamination.',
        datos: '1 to 15 l jars · 50 to 300 rpm · alumina or stainless steel',
      },
      destiladores: {
        nombre: 'Water stills',
        frase: 'Laboratory-grade distilled water from the mains supply.',
        datos: '4 or 8 l/h · type III and IV water · ASTM D 1193',
      },
      'mesas-moviles': {
        nombre: 'Mobile tables',
        frase: 'To move the centrifuge easily or store it under the laboratory bench.',
        datos: '4 models · 360° castors with brakes',
      },
      grs: {
        nombre: 'GRS',
        frase: 'Extracts the gases from petroleum analysis out of the centrifuge to a safe area.',
        datos: 'Digtor 22 C series · 10 l/min · compressed air at 2 bar',
      },
    },
  },

  familias: {
    peq: 'Compact',
    uni: 'Universal',
    gran: 'High capacity',
    cli: 'Clinical',
    ind: 'Industry',
  },
  temperatura: { ventilada: 'ventilated', refrigerada: 'refrigerated', calefactada: 'heated' },
  series: {
    minicen: { frase: 'Your personal centrifuge for the most demanding laboratory.' },
    'microcen-24': { frase: 'High performance and versatility in a small centrifuge.' },
    'biocen-22': { frase: 'Microtubes and microhaematocrit in very little space.' },
    'biocen-22-r': { frase: 'Refrigerated microcentrifuge: robust, versatile and efficient.' },
    'digicen-22': { frase: 'Universal by design.' },
    'bioprocen-22-r': { frase: 'Designed for bioprocessing, also with microplates.' },
    'unicen-21': { frase: 'Universal, with angle and swing-out rotors.' },
    'consul-22': { frase: 'High capacity in a compact unit.' },
    'digtor-22': { frase: 'Benchtop, high capacity and top performance.' },
    'dilitcen-22-r': { frase: 'The largest benchtop model: up to 4 litres per cycle.' },
    'magnus-22': { frase: 'Floor-standing, so it takes no space on the bench.' },
    'cyto-22': { uso: 'Cytology', frase: 'Cytology: concentrates the sample onto the slide.' },
    'plasma-22': { uso: 'PRP and PRF', frase: 'Programs calculated for PRP and PRF.' },
    vetcen: {
      uso: 'Veterinary',
      frase: 'Veterinary: microtubes and capillaries in the same cycle.',
      capacidad: '6 + 6 tubes',
    },
    'digtor-22-col': { uso: 'Liposculpture', frase: 'For liposculpture and reconstructive surgery.' },
    'digtor-22-c': { uso: 'Oil industry', frase: 'Oil industry: the best choice for 8" and 6" tubes.' },
    'lacter-21': {
      uso: 'Dairy',
      frase: 'Dairy: Gerber butyrometers, running quietly.',
      capacidad: '12 butyrometers',
    },
  },
};
