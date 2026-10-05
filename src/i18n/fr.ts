// Textes en français. Même forme que es.ts. Traduction provisoire : à relire par Orto Alresa.
import type { Textos } from './es';

export const fr: Textos = {
  y: 'et',
  meta: {
    locale: 'fr_FR',
    fechas: 'fr-FR',
    pestana: 'Experts en centrifugation · depuis 1949',
    saltar: 'Aller au contenu',
  },
  nav: {
    centrifugas: 'Centrifugeuses',
    tecnologia: 'Technologie',
    distribuidores: 'Distributeurs',
    servicio: 'Service technique',
    empresa: 'Entreprise',
  },
  cabecera: {
    inicio: 'Orto Alresa, accueil',
    principal: 'Principal',
    idioma: 'Langue',
    contacto: 'Contact',
    menu: 'Menu',
    cerrar: 'Fermer',
  },
  buscador: {
    buscar: 'Rechercher',
    etiqueta: 'Rechercher sur le site',
    ejemplo: 'Cherchez un modèle, p. ex. Digicen 22',
    nada: 'Aucun résultat. Essayez le nom du modèle ou écrivez-nous depuis Contact.',
    centrifuga: 'Centrifugeuse',
    seccion: 'Section',
  },
  pie: {
    pedidos: 'Commandes et distributeurs :',
    titulos: { centrifugas: 'Centrifugeuses', empresa: 'Entreprise' },
    enlaces: {
      gama: 'Toute la gamme',
      tecnologia: 'Technologie',
      catalogo: 'Catalogue 2025',
      quienes: 'Qui sommes-nous',
      distribuidores: 'Distributeurs',
      aplicaciones: 'Applications',
      certificados: 'Certifications',
    },
    contacto: 'Contact',
    servicio: 'Service technique',
    info: 'Informations générales',
    siguenos: 'Suivez-nous',
    sellos: { ods: 'Objectifs de développement durable', solidaria: 'Empresa Solidaria 2024' },
    ayudas: 'Aides publiques reçues',
    legal: 'Mentions',
    aviso: 'Mentions légales',
    privacidad: 'Confidentialité',
    cookies: 'Cookies',
  },

  portada: {
    title: 'Orto Alresa · Centrifugeuses de laboratoire fabriquées à Madrid depuis 1949',
    description:
      'Fabricant européen de centrifugeuses de laboratoire depuis 1949. Plus de 25 modèles, livraison en une semaine et 3 ans de garantie, via des distributeurs spécialisés.',
  },

  hero: {
    titulo: ['Experts en ', 'centrifuga', 'tion'],
    lead: 'Depuis 1949, nous concevons et fabriquons des centrifugeuses de laboratoire à Daganzo (Madrid) et nous les diffusons dans le monde entier grâce à un réseau de distributeurs spécialisés.',
    gama: 'Voir la gamme',
    distribuidor: 'Je suis distributeur',
  },

  tecnologia: {
    titulo: ['Notre propre ', 'technologie'],
    intro:
      'Ce qui distingue une centrifugeuse Orto Alresa se trouve à l’intérieur. Voici les systèmes que nous développons nous-mêmes.',
    lollevan: 'Disponible sur',
    lallevan: 'Disponible sur',
    rei: {
      alt: 'Rotors avec REI System : une main soulève la poignée rouge pour retirer le rotor',
      frase: ['Changer de rotor en ', 'quelques secondes, d’une seule main', ' et sans outils.'],
      pasos: [
        'Il se place sur l’axe du moteur et se verrouille tout seul.',
        'S’il n’est pas bien en place, l’écran vous prévient.',
        'Pour le retirer, on soulève la poignée rouge.',
      ],
      video: 'Voir la vidéo',
    },
    smartconnect: {
      alt: 'L’application SmartConnect sur plusieurs tablettes : connexion, graphique du programme et listes',
      entrar: 'Se connecter',
      frase: ['Les centrifugeuses du laboratoire, ', 'surveillées depuis le mobile', '.'],
      puntos: [
        'Application gratuite : elle se connecte au Wi-Fi et se consulte depuis un PC, une tablette ou un mobile.',
        'Historique des programmes et téléchargement des données en CSV.',
        'Utilisateurs avec différents niveaux d’accès et suivi de qui a fait quoi.',
        'Alertes de sécurité et de maintenance, et diagnostic à distance par le service technique.',
      ],
    },
    configurador: {
      nombre: 'Configurateur',
      alt: 'Une main gantée tient un tube à bouchon rouge au-dessus du rotor d’une centrifugeuse',
      cifra: '6 étapes',
      cifraTexto: 'pour trouver votre centrifugeuse',
      frase: ['Répondez à six questions et nous vous indiquons ', 'quel modèle et quel rotor', '.'],
      pasos: ['Type de centrifugeuse', 'Emplacement', 'Type de tube', 'Vitesse', 'Nb de positions', 'Type de rotor'],
      empezar: 'Commencer',
    },
    pantalla: {
      nombre: 'Écran tactile',
      texto:
        'En couleur, facile à lire et à programmer. FCR réelle selon l’adaptateur et jusqu’à 8 programmes enchaînés.',
      cifra: '100',
      unidad: 'mémoires',
      alt: 'Écran tactile d’une Consul 22 avec rotor, vitesse, FCR et rampes',
    },
    pcbs: {
      nombre: 'PCBS',
      texto: 'Freinage progressif pour que l’échantillon ne se remélange pas après la séparation.',
      cifra: '175',
      unidad: 'rampes de freinage',
      antes: 'tous les modèles à écran tactile, ainsi que',
      esquema: 'Schéma : vitesse en fonction du temps avec un freinage brusque et un freinage progressif',
      tiempo: 'temps',
      brusco: 'brusque',
      progresivo: 'progressif',
    },
    uls: {
      nombre: 'ULS',
      texto: 'Si la centrifugeuse s’arrête pour déséquilibre, l’écran indique quel godet en est la cause.',
      cifra: 'N°',
      unidad: 'du godet, à l’écran',
      esquema: 'Schéma : rotor vu de dessus avec le godet 3 signalé pour déséquilibre',
      desequilibrio: 'Déséquilibre',
      vaso: 'Godet 3',
    },
    ademasTitulo: ['Et aussi, ', 'selon le modèle', ' :'],
    ademas: [
      { titulo: 'Reconnaissance du rotor', texto: 'Il l’identifie seul et protège contre la survitesse.' },
      { titulo: 'Couvercle sécurisé', texto: 'Fermeture motorisée, verrouillage en marche et ouverture d’urgence.' },
      { titulo: 'De −20 à 80 °C', texto: 'Sur les modèles réfrigérés et chauffés, par pas de 1 °C.' },
      { titulo: 'Moins de 60 dB', texto: 'Moteur à induction sans balais et sans entretien.' },
    ],
  },

  empresa: {
    titulo: ['Notre objectif n’est pas d’être une option de plus, mais d’aller ', 'au-delà du standard'],
    alt: 'Rotor d’une centrifugeuse Orto Alresa chargé de tubes à bouchon rouge',
    boton: 'Découvrir l’entreprise',
    pompas: [
      {
        cifra: '1949',
        titulo: 'Fabricants de centrifugeuses',
        texto: 'Plus de 75 ans plus tard, nous sommes une référence parmi les fabricants européens.',
      },
      {
        cifra: 'Famille',
        titulo: 'Une entreprise familiale',
        texto: 'Nous cherchons à intégrer nos partenaires, utilisateurs et associés.',
      },
      {
        cifra: 'Daganzo',
        titulo: 'Notre propre usine à Madrid',
        texto: 'Nous fabriquons et assurons le suivi depuis ici, avec ISO 9001, ISO 13485 et ISO 14001.',
      },
    ],
    sellosTitulo: ['Certifications et normes que nous ', 'respectons'],
    anterior: 'Certificat précédent',
    siguiente: 'Certificat suivant',
    certificados: [
      { nombre: 'ISO 9001', detalle: 'Qualité', texto: 'Management de la qualité dans toute l’entreprise.' },
      {
        nombre: 'ISO 13485',
        detalle: 'Dispositifs médicaux',
        texto: 'Système qualité spécifique aux dispositifs médicaux.',
      },
      {
        nombre: 'ISO 14001',
        detalle: 'Environnement',
        texto: 'Management environnemental de l’usine et de ses processus.',
      },
      {
        nombre: 'IVDR',
        detalle: '(UE) 2017/746',
        texto: 'Conformes au règlement européen relatif aux dispositifs médicaux de diagnostic in vitro.',
      },
      {
        nombre: 'CE',
        detalle: 'Marquage européen',
        texto: 'Conformes aux directives européennes basse tension et compatibilité électromagnétique.',
      },
      {
        nombre: 'EN 61010',
        detalle: 'Sécurité',
        texto: 'Sécurité des équipements de laboratoire, avec sa partie spécifique aux centrifugeuses.',
      },
      {
        nombre: 'RoHS',
        detalle: '2011/65/UE',
        texto: 'Composants sans les substances dangereuses restreintes par l’Union européenne.',
      },
      { nombre: 'DEEE', detalle: '2012/19/UE', texto: 'L’équipement est collecté et recyclé en fin de vie.' },
      {
        nombre: 'KC',
        detalle: 'Chargeur connu',
        texto: 'Les envois par avion partent avec les contrôles de sûreté déjà effectués.',
      },
    ],
  },

  distribuidores: {
    titulo: ['Grandissez avec ', 'nous'],
    lead: 'Une entreprise familiale qui traite chaque distributeur comme un partenaire. Voici comment se déroule une commande avec Orto Alresa.',
    laboratorio: 'Vous êtes un laboratoire ? Trouvez votre distributeur',
    pasos: [
      {
        cuando: 'Vous passez commande',
        cifra: 'Stock',
        unidad: '',
        titulo: 'Toujours disponible',
        texto: 'Stock permanent de toute la gamme.',
      },
      {
        cuando: 'Elle arrive dans votre entrepôt en',
        cifra: '1',
        unidad: 'semaine',
        titulo: 'Livraison rapide',
        texto: 'Délai moyen de livraison, grâce au stock permanent.',
      },
      {
        cuando: 'Une question ? Réponse en',
        cifra: '48',
        unidad: 'h',
        titulo: 'Conseil',
        texto: 'Mise en service, incidents, réparations et formation technique en ligne.',
      },
      {
        cuando: 'Votre client, couvert pendant',
        cifra: '3',
        unidad: 'ans',
        titulo: 'Garantie sans surprise',
        texto: 'Sur toutes les centrifugeuses neuves, sauf la Minicen (14 mois).',
      },
    ],
    oemTitulo: ['Besoin d’un équipement ', 'sur mesure', ' ?'],
    oem: 'Fabrication OEM sur mesure, avec analyse des risques et traçabilité de l’origine à l’utilisateur.',
    boton: 'Devenez distributeur',
  },

  aplicaciones: {
    titulo: ['Applications ', 'au laboratoire'],
    leer: 'Lire la note',
    todas: 'Voir toutes les notes',
  },

  catalogo: {
    title: 'Centrifugeuses de laboratoire · Orto Alresa',
    description: (series: number, modelos: number) =>
      `Les ${series} séries de centrifugeuses Orto Alresa (${modelos} modèles), fabriquées à Daganzo (Madrid) : compactes, universelles, grande capacité, clinique et industrie.`,
    titulo: ['Nos ', 'centrifugeuses'],
    lead: (series: number, modelos: number) =>
      `${modelos} modèles en ${series} séries, fabriqués à Daganzo (Madrid) et toujours en stock.`,
    indice: 'Familles',
  },

  familias: {
    peq: 'Compactes',
    uni: 'Universelles',
    gran: 'Grande capacité',
    cli: 'Clinique',
    ind: 'Industrie',
  },
  temperatura: { ventilada: 'ventilée', refrigerada: 'réfrigérée', calefactada: 'chauffée' },
  series: {
    minicen: { frase: 'Votre centrifugeuse personnelle pour le laboratoire le plus exigeant.' },
    'microcen-24': { frase: 'Hautes performances et polyvalence dans une petite centrifugeuse.' },
    'biocen-22': { frase: 'Microtubes et microhématocrite dans très peu d’espace.' },
    'biocen-22-r': { frase: 'Microcentrifugeuse réfrigérée, robuste, polyvalente et efficace.' },
    'digicen-22': { frase: 'Universelle par conception.' },
    'bioprocen-22-r': { frase: 'Conçue pour les bioprocédés, également avec microplaques.' },
    'unicen-21': { frase: 'Universelle, avec rotors angulaires et oscillants.' },
    'consul-22': { frase: 'Grande capacité dans un appareil compact.' },
    'digtor-22': { frase: 'De paillasse, grande capacité et les plus hautes performances.' },
    'dilitcen-22-r': { frase: 'La plus grande de paillasse : jusqu’à 4 litres par cycle.' },
    'magnus-22': { frase: 'Au sol, pour ne pas prendre de place sur la paillasse.' },
    'cyto-22': { uso: 'Cytologie', frase: 'Cytologie : concentre l’échantillon sur la lame.' },
    'plasma-22': { uso: 'PRP et PRF', frase: 'Programmes calculés pour le PRP et le PRF.' },
    vetcen: {
      uso: 'Vétérinaire',
      frase: 'Vétérinaire : microtubes et capillaires dans un même cycle.',
      capacidad: '6 + 6 tubes',
    },
    'digtor-22-col': { uso: 'Liposculpture', frase: 'Pour la liposculpture et la chirurgie réparatrice.' },
    'digtor-22-c': { uso: 'Pétrole', frase: 'Pétrole : le meilleur choix pour les tubes de 8" et 6".' },
    'lacter-21': {
      uso: 'Produits laitiers',
      frase: 'Produits laitiers : butyromètres Gerber, en fonctionnement silencieux.',
      capacidad: '12 butyromètres',
    },
  },
};
