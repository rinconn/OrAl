// Escena de la propuesta de valor (Empresa): la Digicen 22 sale de su caja y pasa por el escáner. Todo lo decide el
// scroll (Empresa.astro llama a `estado`); la escena suaviza, añade el movimiento vivo y dibuja solo mientras se ve.
// · Caja: cae cerrada, con la marca impresa, cuando el título ya está. Sale volando la tapa con un destello de dentro,
//   caen los cuatro lados (una onda recorre el suelo) y la máquina sube girando hasta flotar sobre su base.
// · Escáner: una lámina de luz roja con estela y chispas baja por la máquina. Por encima pasa a rayos X en cian (la
//   superficie arde en el corte y se enfría al alejarse); por debajo sigue con su acabado real.
// · Anatomía: en rayos X, las piezas se separan en vertical y se nombran las principales.
// · Sistemas: la cámara se acerca a la pieza de cada uno, que se enciende en rojo mientras el resto se apaga.
import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  BackSide,
  Box3,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  DoubleSide,
  EdgesGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Plane,
  PlaneGeometry,
  PMREMGenerator,
  Points,
  PointsMaterial,
  RingGeometry,
  Scene,
  ShaderMaterial,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
  type Material,
  type Object3D,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { despiece } from '../data/digicen22';

/** Dónde va cada sistema en la Digicen 22 (código de pieza del modelo) y desde dónde se ve mejor */
export const paradas: { codigo: string; phi: number; theta: number }[] = [
  { codigo: 'PP 821', phi: 1.22, theta: 0.18 }, // pantalla táctil: la carátula
  { codigo: 'PE 494', phi: 1.32, theta: 0.95 }, // frenado: el motor
  { codigo: 'PP 367', phi: 0.82, theta: 0.5 }, // GRS: la tapa
  { codigo: 'PI 448', phi: 0.55, theta: 0.2 }, // refrigeradas: el depósito
  { codigo: 'PI 448', phi: 0.95, theta: -0.55 }, // calefactadas: el depósito, desde el otro lado
  { codigo: 'PC 497', phi: 1.12, theta: 1.25 }, // desequilibrio: el amortiguador
];
const GENERAL = { phi: 1.12, theta: 0.55 };
const ANATOMIA = { phi: 1.4, theta: 0.82 };
/** Cuánto del despiece completo se usa en la anatomía */
const SEPARA = 0.72;
// Rayos X en azul acero, menos chillón que el cian; la pieza encendida, en el rojo de la marca
const AZUL = 0x3a9fd6;
const ROJO = 0xff1f26;

export interface Estado {
  /** 0 la caja aún no está · 1 posada en el suelo */
  llega: number;
  /** 0 caja cerrada · 1 abierta, con la máquina fuera */
  caja: number;
  /** 0 todo real · 1 todo rayos X */
  escaneo: number;
  /** 0 montada · 1 separada */
  despiece: number;
  /** Sistema encendido (-1 ninguno) */
  paso: number;
}
export interface Pos {
  x: number;
  y: number;
  ve: boolean;
}
export interface Escaner {
  estado: (e: Estado) => void;
  /** Cada fotograma: dónde caen en el lienzo la pieza encendida y las piezas de la anatomía */
  alProyectar: (f: (punto: Pos, partes: Pos[]) => void) => void;
}

interface Opciones {
  lienzo: HTMLElement;
  src: string;
  draco: string;
  /** Códigos de las piezas que se nombran en la anatomía */
  partes: string[];
  /** Lo que va impreso en la caja */
  marca: [string, string];
  quieto: boolean;
  alProgreso: (p: number) => void;
}

const entre = (x: number) => Math.max(0, Math.min(1, x));
const sale = (x: number) => 1 - Math.pow(1 - x, 3);
const mezcla = (a: number, b: number, t: number) => a + (b - a) * t;
// Cae como un objeto con peso: acelera, toca el suelo y rebota un poco
const cae = (t: number) => (t < 0.78 ? Math.pow(t / 0.78, 2) : 1 - 0.07 * Math.sin(((t - 0.78) / 0.22) * Math.PI));

// Rayos X: casi transparente de frente y luminosa en los bordes (fresnel), con líneas de escaneo finas y una banda
// de luz que recorre la máquina de abajo arriba. Junto a la lámina (uCorte) la superficie arde y se enfría hacia
// arriba; uRelleno da cuerpo a la pieza encendida. Suma luz, no tapa
const rayosX = (color: number, relleno: number, u: Record<string, { value: number }>) =>
  new ShaderMaterial({
    uniforms: { uColor: { value: new Color(color) }, uFuerza: { value: 1 }, uRelleno: { value: relleno }, ...u },
    vertexShader: /* glsl */ `
      #include <clipping_planes_pars_vertex>
      varying vec3 vN;
      varying vec3 vV;
      varying float vY;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vN = normalize(normalMatrix * normal);
        vV = normalize(-mvPosition.xyz);
        vY = (modelMatrix * vec4(position, 1.0)).y;
        gl_Position = projectionMatrix * mvPosition;
        #include <clipping_planes_vertex>
      }`,
    fragmentShader: /* glsl */ `
      #include <clipping_planes_pars_fragment>
      uniform vec3 uColor;
      uniform float uFuerza;
      uniform float uRelleno;
      uniform float uT;
      uniform float uAlto;
      uniform float uCorte;
      uniform float uFilo;
      varying vec3 vN;
      varying vec3 vV;
      varying float vY;
      void main() {
        #include <clipping_planes_fragment>
        float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.2);
        float lineas = smoothstep(0.82, 1.0, abs(fract(vY * 140.0) * 2.0 - 1.0)) * 0.18;
        float t = fract(uT * 0.16) * uAlto * 1.8 - uAlto * 0.3;
        float banda = exp(-pow((vY - t) / (uAlto * 0.035), 2.0));
        float filo = exp(-max(0.0, vY - uCorte) / (uAlto * 0.07)) * uFilo;
        vec3 c = uColor * (0.045 + uRelleno + f + lineas * (0.4 + f) + banda * (0.25 + 1.4 * f)) * uFuerza;
        gl_FragColor = vec4(c + filo * (uColor * 1.6 + 0.35) * (0.35 + f), 1.0);
      }`,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    side: DoubleSide,
    clipping: true,
  });

const lienzo2d = (lado: number, pintar: (g: CanvasRenderingContext2D) => void) => {
  const c = document.createElement('canvas');
  c.width = c.height = lado;
  pintar(c.getContext('2d')!);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
};
const halo = (centro: string, medio: string) =>
  lienzo2d(128, (g) => {
    const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    r.addColorStop(0, centro);
    r.addColorStop(0.5, medio);
    r.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = r;
    g.fillRect(0, 0, 128, 128);
  });
// Material que suma luz (aros, velos, destellos)
const luz = (o: ConstructorParameters<typeof MeshBasicMaterial>[0]) =>
  new MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, blending: AdditiveBlending, ...o });
const aro = (r0: number, r1: number, mat: Material, arco = Math.PI * 2) => {
  const m = new Mesh(new RingGeometry(r0, r1, 160, 1, 0, arco), mat);
  m.rotation.x = -Math.PI / 2;
  return m;
};

export async function crearEscaner(o: Opciones): Promise<Escaner> {
  const { lienzo } = o;
  const dpr = Math.min(window.devicePixelRatio, 1.5);
  const renderer = new WebGLRenderer({ antialias: dpr < 1.4, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(dpr);
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.localClippingEnabled = true;
  lienzo.prepend(renderer.domElement);

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();
  scene.environmentIntensity = 0.9;
  const camera = new PerspectiveCamera(24, 1, 0.01, 30);

  // ——— Modelo ———
  const draco = new DRACOLoader().setDecoderPath(o.draco);
  const gltf = await new GLTFLoader().setDRACOLoader(draco).loadAsync(o.src, (ev) => {
    if (ev.total) o.alProgreso(ev.loaded / ev.total);
  });
  draco.dispose();
  const interior = gltf.scene;
  const caja0 = new Box3().setFromObject(interior);
  const c0 = caja0.getCenter(new Vector3());
  interior.position.set(-c0.x, -caja0.min.y, -c0.z);
  // `modelo` gira y flota; `interior` es el modelo centrado con la base en y = 0
  const modelo = new Group();
  modelo.add(interior);
  scene.add(modelo);
  modelo.updateMatrixWorld(true);
  const tam = caja0.getSize(new Vector3());
  const alto = tam.y;
  const radio = tam.length() / 2;
  const u = { uT: { value: 0 }, uAlto: { value: alto }, uCorte: { value: 0 }, uFilo: { value: 0 } };

  // Real debajo de la lámina, rayos X encima: dos planos con la misma altura. Rayos X en cian; la pieza de cada
  // sistema, en el rojo de la marca. Al encender una, el resto casi se apaga: el rojo no se mezcla con el azul
  const bajo = new Plane(new Vector3(0, -1, 0), alto);
  const sobre = new Plane(new Vector3(0, 1, 0), 0);
  const xAzul = rayosX(AZUL, 0, u);
  const xRojo = rayosX(ROJO, 0.3, u);
  const arista = new LineBasicMaterial({ color: 0x8fe3ff, transparent: true, opacity: 0.22, depthWrite: false });
  for (const m of [xAzul, xRojo, arista]) m.clippingPlanes = [sobre];

  const fantasmas = new Map<Mesh, Mesh>();
  const mallas: Mesh[] = [];
  interior.traverse((n) => {
    if ((n as Mesh).isMesh) mallas.push(n as Mesh);
  });
  for (const m of mallas) {
    for (const mat of ([] as Material[]).concat(m.material)) mat.clippingPlanes = [bajo];
    const f = new Mesh(m.geometry, xAzul);
    f.renderOrder = 2;
    m.add(f);
    fantasmas.set(m, f);
  }
  // Las aristas cuestan un poco: se calculan cuando el navegador está libre
  const conAristas = () => {
    for (const m of mallas) {
      const l = new LineSegments(new EdgesGeometry(m.geometry, 32), arista);
      l.renderOrder = 3;
      m.add(l);
    }
    pedir();
  };
  if ('requestIdleCallback' in window) requestIdleCallback(conAristas, { timeout: 1500 });
  else setTimeout(conAristas, 300);

  // Piezas con código ("PE 494 Motor (NAUO12)"; three.js cambia espacios por "_"): sus mallas, su centro y su tamaño
  // (en el espacio de `modelo`) y los nodos que se separan en la anatomía
  const de = new Map<string, { mallas: Mesh[]; centro: Vector3; r: number; d: Vector3 }>();
  const piezas: { obj: Object3D; base: Vector3; d: Vector3 }[] = [];
  const nodos: Object3D[] = [];
  interior.traverse((n) => {
    if (/^[A-Z]{2}[ _]\d{3}.*NAUO\d+/.test(n.name)) nodos.push(n);
  });
  for (const n of nodos) {
    const cod = n.name.match(/^([A-Z]{2})[ _](\d{3})/)!;
    const k = `${cod[1]} ${cod[2]}`;
    const d = new Vector3(...(despiece[k] ?? [0, 0, 0]));
    const e = de.get(k) ?? { mallas: [], centro: new Vector3(), r: radio * 0.4, d };
    n.traverse((m) => {
      if ((m as Mesh).isMesh && fantasmas.has(m as Mesh)) e.mallas.push(m as Mesh);
    });
    de.set(k, e);
    if (despiece[k]) piezas.push({ obj: n, base: n.position.clone(), d });
  }
  const medida = new Vector3();
  for (const e of de.values()) {
    const b = new Box3();
    for (const m of e.mallas) b.expandByObject(m);
    if (b.isEmpty()) continue;
    b.getCenter(e.centro);
    e.r = b.getSize(medida).length() / 2;
  }

  // ——— Base: dos aros finos, un arco que da la vuelta despacio y un halo bajo la máquina; poca línea ———
  const base = new Group();
  scene.add(base);
  const mAro = luz({ color: 0x9aa6ad });
  const mArco = luz({ color: AZUL, side: DoubleSide });
  base.add(aro(radio * 1.25, radio * 1.257, mAro), aro(radio * 0.98, radio * 0.984, mAro));
  const arco = aro(radio * 1.235, radio * 1.272, mArco, Math.PI * 0.35);
  base.add(arco);
  const mSombra = luz({ map: halo('rgba(255,40,46,0.55)', 'rgba(221,4,10,0.14)') });
  const sombra = new Mesh(new PlaneGeometry(radio * 2.2, radio * 2.2), mSombra);
  sombra.rotation.x = -Math.PI / 2;
  base.add(sombra);
  base.position.y = 0.001;
  // La onda que corre por el suelo cuando caen los lados
  const mOnda = luz({ color: 0xdfe4e7 });
  const onda = aro(radio * 0.97, radio, mOnda);
  base.add(onda);

  // ——— La caja: cuatro lados con bisagra abajo y una tapa; la marca va impresa en los lados ———
  const W = tam.x * 1.12;
  const D = tam.z * 1.12;
  const H = alto * 1.05;
  const impreso = lienzo2d(512, (g) => {
    g.fillStyle = '#1d2023';
    g.fillRect(0, 0, 512, 512);
    g.strokeStyle = 'rgba(255,255,255,0.22)';
    g.lineWidth = 3;
    g.strokeRect(22, 22, 468, 468);
    g.fillStyle = '#dd040a';
    g.fillRect(22, 22, 10, 468);
    g.fillStyle = '#ffffff';
    g.font = '700 54px "Helvetica Neue", Arial, sans-serif';
    g.fillText(o.marca[0], 64, 112);
    g.fillStyle = 'rgba(255,255,255,0.55)';
    g.font = '300 44px "Helvetica Neue", Arial, sans-serif';
    g.fillText(o.marca[1], 64, 168);
    g.fillStyle = '#dd040a';
    g.font = '700 120px "Helvetica Neue", Arial, sans-serif';
    g.fillText('»', 384, 456);
  });
  // Por fuera, la marca; por dentro, liso (al caer, la cara de dentro queda arriba)
  const mLado = new MeshBasicMaterial({ map: impreso, transparent: true });
  const mDentro = new MeshBasicMaterial({ color: 0x24282b, side: BackSide, transparent: true });
  const mTapa = new MeshBasicMaterial({ color: 0x1d2023, side: DoubleSide, transparent: true });
  const mBorde = new LineBasicMaterial({ color: 0xdfe4e7, transparent: true, opacity: 0.55 });
  const caja = new Group();
  scene.add(caja);
  const plancha = (w: number, h: number, mat: MeshBasicMaterial) => {
    const g = new PlaneGeometry(w, h);
    const m = new Mesh(g, mat);
    m.add(new LineSegments(new EdgesGeometry(g), mBorde));
    return m;
  };
  const lados = (
    [
      [0, D / 2, 0, W],
      [W / 2, 0, Math.PI / 2, D],
      [0, -D / 2, Math.PI, W],
      [-W / 2, 0, -Math.PI / 2, D],
    ] as const
  ).map(([x, z, giro, w]) => {
    const fuera = new Group();
    fuera.position.set(x, 0, z);
    fuera.rotation.y = giro;
    const bisagra = new Group();
    const m = plancha(w, H, mLado);
    m.add(new Mesh(m.geometry, mDentro));
    m.position.y = H / 2;
    bisagra.add(m);
    fuera.add(bisagra);
    caja.add(fuera);
    return bisagra;
  });
  const tapa = plancha(W, D, mTapa);
  tapa.rotation.x = -Math.PI / 2;
  const tapaG = new Group();
  tapaG.position.y = H;
  tapaG.add(tapa);
  caja.add(tapaG);
  // Al levantarse la tapa sale luz de dentro
  const mDestello = new SpriteMaterial({
    map: halo('rgba(200,240,255,1)', 'rgba(34,184,255,0.35)'),
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: AdditiveBlending,
  });
  const destello = new Sprite(mDestello);
  destello.position.y = H * 0.85;
  scene.add(destello);

  // Al encender una pieza, un aro rojo se abre desde ella
  const mPulso = new SpriteMaterial({
    map: lienzo2d(128, (g) => {
      g.strokeStyle = '#fff';
      g.lineWidth = 3;
      g.beginPath();
      g.arc(64, 64, 60, 0, Math.PI * 2);
      g.stroke();
    }),
    color: ROJO,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    depthTest: false,
    blending: AdditiveBlending,
  });
  const pulso = new Sprite(mPulso);
  pulso.renderOrder = 4;
  scene.add(pulso);
  let tPulso = 9;

  // ——— La lámina de luz: velo, aro, dos estelas y chispas ———
  const laser = new Group();
  scene.add(laser);
  const mVelo = luz({ map: halo('rgba(255,70,76,0.6)', 'rgba(221,4,10,0.15)'), side: DoubleSide });
  const velo = new Mesh(new PlaneGeometry(radio * 2.8, radio * 2.8), mVelo);
  velo.rotation.x = -Math.PI / 2;
  laser.add(velo);
  const aros = [1, 0.45, 0.18].map((fuerza, i) => {
    const m = luz({ color: i ? 0xff3036 : 0xffd2d4, side: DoubleSide });
    const a = aro(radio * (0.995 - i * 0.02), radio, m);
    laser.add(a);
    return { a, m, fuerza };
  });
  const N = 320;
  const pChispas = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const r = radio * Math.sqrt(Math.random()) * 1.02;
    const a = Math.random() * Math.PI * 2;
    pChispas.set([Math.cos(a) * r, (Math.random() - 0.5) * alto * 0.02, Math.sin(a) * r], i * 3);
  }
  const gChispas = new BufferGeometry();
  gChispas.setAttribute('position', new BufferAttribute(pChispas, 3));
  const mChispas = new PointsMaterial({
    color: 0xff7a7e,
    size: radio * 0.012,
    map: halo('rgba(255,255,255,1)', 'rgba(255,120,124,0.5)'),
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });
  const chispas = new Points(gChispas, mChispas);
  laser.add(chispas);

  // ——— Estado: lo que pide el scroll y lo que se ve (suavizado) ———
  const pide: Estado = { llega: 0, caja: 0, escaneo: 0, despiece: 0, paso: -1 };
  const ve = { llega: 0, caja: 0, escaneo: 0, despiece: 0, foco: 0 };
  let destacado: Mesh[] = [];
  let brillo = 0;
  const vista = { ...GENERAL };
  const mirar = new Vector3(0, alto, 0);
  const objMirar = new Vector3();
  let dist = 0;
  let giro = 0;
  let raton = 0;
  let ratonObj = 0;
  let t = 0;
  const sinPunto: Pos = { x: 0, y: 0, ve: false };
  let avisar: (p: Pos, partes: Pos[]) => void = () => {};
  const partes = o.partes.map(() => ({ x: 0, y: 0, ve: false }));
  const punto = { x: 0, y: 0, ve: false };

  const encender = (k: number) => {
    for (const m of destacado) fantasmas.get(m)!.material = xAzul;
    destacado = k >= 0 ? (de.get(paradas[k]!.codigo)?.mallas ?? []) : [];
    for (const m of destacado) fantasmas.get(m)!.material = xRojo;
    brillo = o.quieto ? 1 : 0;
    tPulso = o.quieto ? 9 : 0;
  };

  let ancho = 1;
  let altoPx = 1;
  const medir = () => {
    ancho = lienzo.clientWidth || 1;
    altoPx = lienzo.clientHeight || 1;
    renderer.setSize(ancho, altoPx, false);
    camera.aspect = ancho / altoPx;
    camera.updateProjectionMatrix();
    pedir();
  };

  const p = new Vector3();
  const aPantalla = (v: Vector3, out: Pos) => {
    p.copy(v).applyMatrix4(modelo.matrixWorld).project(camera);
    out.x = ((p.x + 1) / 2) * ancho;
    out.y = ((1 - p.y) / 2) * altoPx;
  };
  const cLocal = new Vector3();
  const altoAbierta = (alto + despiece['PP 367']![1] * SEPARA) * 0.5;
  const tanFov = Math.tan((camera.fov * Math.PI) / 360);

  const dibujar = (dt: number) => {
    t += dt;
    u.uT.value = t;
    const k = o.quieto ? 1 : 1 - Math.exp(-dt * 3.2);
    const kr = o.quieto ? 1 : 1 - Math.exp(-dt * 7);
    ve.llega += (pide.llega - ve.llega) * kr;
    ve.caja += (pide.caja - ve.caja) * kr;
    ve.escaneo += (pide.escaneo - ve.escaneo) * kr;
    ve.despiece += (pide.despiece - ve.despiece) * kr;
    ve.foco += ((pide.paso >= 0 ? 1 : 0) - ve.foco) * k;
    raton += (ratonObj - raton) * (1 - Math.exp(-dt * 3));
    brillo = Math.min(1, brillo + dt * 1.6);
    const late = o.quieto ? 1 : 0.85 + 0.15 * Math.sin(t * 2.6);
    xRojo.uniforms.uFuerza!.value = 0.45 + 1.05 * brillo * late;
    // Con un sistema encendido, el resto de la máquina se apaga para que la pieza roja destaque
    xAzul.uniforms.uFuerza!.value = 0.75 - 0.6 * ve.foco;
    arista.opacity = 0.22 - 0.12 * ve.foco;

    // La caja cae y se posa; luego sale la tapa, caen los lados uno tras otro y se desvanecen en el suelo
    const c = ve.caja;
    caja.position.y = (1 - cae(entre(ve.llega))) * alto * 1.6;
    const lt = sale(entre(c / 0.3));
    tapaG.position.y = H + lt * alto * 1.3;
    tapaG.rotation.set(lt * 0.5, 0, lt * 0.35);
    lados.forEach((b, i) => (b.rotation.x = (cae(entre((c - 0.1 - i * 0.05) / 0.3)) * Math.PI) / 2));
    const fundido = (1 - entre((c - 0.72) / 0.28)) * entre(ve.llega * 4);
    mLado.opacity = mDentro.opacity = fundido;
    // Mientras no se desvanece, la caja es opaca: así se pinta antes que las piezas transparentes de la máquina y
    // ninguna asoma a través de los lados
    const opaca = fundido > 0.999;
    if (mLado.transparent === opaca) {
      for (const m of [mLado, mDentro]) {
        m.transparent = !opaca;
        m.needsUpdate = true;
      }
    }
    mBorde.opacity = 0.55 * fundido;
    mTapa.opacity = (1 - lt) * entre(ve.llega * 4);
    caja.visible = fundido > 0.01;
    tapaG.visible = lt < 0.99;
    mDestello.opacity = Math.sin(Math.PI * entre(c / 0.62)) * 0.95;
    destello.visible = mDestello.opacity > 0.01;
    destello.scale.setScalar(radio * (1.6 + 1.8 * entre(c / 0.62)));
    // La onda sale cuando tocan el suelo los lados
    const w = entre((c - 0.32) / 0.42);
    onda.scale.setScalar(1 + w * 1.6);
    mOnda.opacity = Math.sin(Math.PI * w) * 0.5;
    onda.visible = mOnda.opacity > 0.01;

    // La máquina sube girando y se queda flotando; sin sistema encendido gira despacio, como en un expositor
    // Sube cuando los lados ya están casi en el suelo y solo gira cuando están tumbados: así no los atraviesa
    const r = sale(entre((c - 0.42) / 0.58));
    const gira = sale(entre((c - 0.52) / 0.48));
    modelo.visible = c > 0.002;
    const flota = alto * 0.1 * r + (o.quieto ? 0 : Math.sin(t * 1.3) * alto * 0.008 * r);
    modelo.position.y = flota;
    if (pide.paso < 0 && !o.quieto) giro += dt * 0.22 * r;
    else giro += (Math.round(giro / (Math.PI * 2)) * Math.PI * 2 - giro) * k;
    // Al volver a cerrarse, la máquina se endereza antes que los lados: si se quedara girada, sus esquinas
    // atravesarían la caja. El giro se cuenta en una sola vuelta para no deshacer todas las acumuladas
    giro = Math.atan2(Math.sin(giro), Math.cos(giro));
    modelo.rotation.y = giro * gira - (1 - gira) * Math.PI;
    mAro.opacity = 0.32 * r;
    mArco.opacity = (0.35 + 0.5 * ve.escaneo) * r;
    arco.rotation.z = -t * 0.35;
    mSombra.opacity = r * (0.35 + 0.65 * ve.escaneo) * (1 - 0.75 * ve.foco);
    base.visible = r > 0.01 || onda.visible;

    // Anatomía: cada pieza se separa en vertical
    const x = ve.despiece * SEPARA;
    for (const pz of piezas) pz.obj.position.copy(pz.base).addScaledVector(pz.d, x);

    // La lámina: de arriba (todo real) abajo (todo rayos X), con margen a cada lado
    const s = ve.escaneo;
    const y = flota + alto * 1.04 - s * alto * 1.08;
    bajo.constant = y;
    sobre.constant = -y;
    const v = s > 0.003 && s < 0.997 ? Math.min(1, Math.min(s, 1 - s) * 12) : 0;
    u.uCorte.value = y;
    u.uFilo.value = v;
    laser.position.y = y;
    laser.visible = v > 0.01;
    mVelo.opacity = v;
    mChispas.opacity = v;
    chispas.rotation.y = t * 0.6;
    // Las estelas van detrás de la lámina, en el sentido en que se mueve
    const sentido = pide.escaneo >= ve.escaneo ? 1 : -1;
    aros.forEach(({ a, m, fuerza }, i) => {
      a.position.y = i * alto * 0.035 * sentido;
      m.opacity = v * fuerza;
    });

    // Cámara: más lejos con la caja y en la anatomía; en cada sistema se acerca a su pieza y la centra
    const paso = pide.paso;
    const parada = paso >= 0 ? paradas[paso]! : null;
    const pieza = parada ? de.get(parada.codigo) : undefined;
    const objPhi = parada ? parada.phi : mezcla(GENERAL.phi, ANATOMIA.phi, ve.despiece);
    const objTheta = (parada ? parada.theta : mezcla(GENERAL.theta, ANATOMIA.theta, ve.despiece)) + raton;
    vista.phi += (objPhi - vista.phi) * k;
    vista.theta += (objTheta - vista.theta) * k;
    // La distancia cuenta con el ancho del lienzo: la máquina nunca se sale por los lados
    const objDist =
      (pieza
        ? Math.min(radio * 1.25, Math.max(radio * 0.95, pieza.r * 1.7))
        : radio * (1.7 + 0.5 * (1 - r) + 0.75 * ve.despiece)) /
      (tanFov * Math.min(1, (ancho / altoPx) * 1.15));
    dist = dist ? dist + (objDist - dist) * k : objDist;
    // Con la caja cerrada se mira bastante más arriba: la caja queda abajo, sin tocar el título
    if (pieza) objMirar.copy(pieza.centro).applyMatrix4(modelo.matrixWorld);
    else objMirar.set(0, flota + mezcla(alto * 0.5, altoAbierta, ve.despiece) + (1 - r) * alto * 1.35, 0);
    mirar.lerp(objMirar, k);
    camera.position.set(
      mirar.x + dist * Math.sin(vista.phi) * Math.sin(vista.theta),
      mirar.y + dist * Math.cos(vista.phi),
      mirar.z + dist * Math.sin(vista.phi) * Math.cos(vista.theta),
    );
    camera.lookAt(mirar);
    if (pieza && tPulso < 1.2) {
      tPulso += dt;
      const a = tPulso / 1.2;
      pulso.position.copy(cLocal.copy(pieza.centro).addScaledVector(pieza.d, x)).applyMatrix4(modelo.matrixWorld);
      pulso.scale.setScalar(pieza.r * (0.8 + 2.4 * sale(a)));
      mPulso.opacity = (1 - a) * 0.9;
    } else mPulso.opacity = 0;
    pulso.visible = mPulso.opacity > 0.01;
    renderer.render(scene, camera);

    // Dónde caen en pantalla la pieza encendida y las de la anatomía
    const enRayos = ve.escaneo > 0.9;
    if (pieza && destacado.length) {
      aPantalla(cLocal.copy(pieza.centro).addScaledVector(pieza.d, x), punto);
      punto.ve = enRayos && brillo > 0.3;
    } else punto.ve = false;
    o.partes.forEach((cod, i) => {
      const e = de.get(cod);
      const q = partes[i]!;
      if (!e) return;
      q.ve = enRayos && ve.despiece > 0.85;
      if (q.ve) aPantalla(cLocal.copy(e.centro).addScaledVector(e.d, x), q);
    });
    avisar(punto.ve ? punto : sinPunto, partes);

    return (
      !o.quieto ||
      Math.abs(pide.caja - ve.caja) + Math.abs(pide.escaneo - ve.escaneo) + Math.abs(pide.despiece - ve.despiece) >
        0.0005 ||
      Math.abs(objPhi - vista.phi) + Math.abs(objTheta - vista.theta) > 0.0005
    );
  };

  // Solo dibuja mientras se ve
  let visible = false;
  let bucle = 0;
  let antes = 0;
  const vuelta = (ahora: number) => {
    const dt = Math.min(0.05, (ahora - antes) / 1000 || 0.016);
    antes = ahora;
    const sigue = dibujar(dt);
    bucle = visible && sigue ? requestAnimationFrame(vuelta) : 0;
  };
  function pedir() {
    if (!bucle && visible) {
      antes = performance.now();
      bucle = requestAnimationFrame(vuelta);
    }
  }
  new IntersectionObserver(([e]) => {
    visible = !!e?.isIntersecting;
    if (visible) pedir();
  }).observe(lienzo);
  new ResizeObserver(medir).observe(lienzo);
  medir();

  // Con el ratón, la máquina sigue un poco la mano
  if (!o.quieto && window.matchMedia('(pointer: fine)').matches) {
    lienzo.closest('section')?.addEventListener(
      'pointermove',
      (ev) => {
        ratonObj = ((ev as PointerEvent).clientX / window.innerWidth - 0.5) * 0.35;
      },
      { passive: true },
    );
  }

  return {
    estado(e) {
      if (e.paso !== pide.paso) encender(e.paso);
      Object.assign(pide, e);
      if (o.quieto) dibujar(1);
      else pedir();
    },
    alProyectar(f) {
      avisar = f;
    },
  };
}
