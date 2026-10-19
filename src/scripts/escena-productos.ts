// Escena del hero de Productos: la Digicen 22 (modelo de SolidWorks de la empresa) en un estudio oscuro, con un
// remolino de luz detrás que se acelera al girarla, un haz de luz con polvo y un aro rojo con destello en el suelo.
// Se gira arrastrando, tiene vistas fijas (3/4, frente, lado, arriba), acabado real o rayos X, zoom, despiece con
// etiquetas en columna y un recorrido por dentro pieza a pieza. Solo dibuja mientras se ve en pantalla.
import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  Box3,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  CircleGeometry,
  ConeGeometry,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  Plane,
  PlaneGeometry,
  PMREMGenerator,
  PointLight,
  Points,
  Raycaster,
  RingGeometry,
  Scene,
  ShaderMaterial,
  Spherical,
  SpotLight,
  Vector2,
  Vector3,
  WebGLRenderer,
  type Material,
  type Object3D,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/** Despiece: cuánto se separa cada pieza (en metros, Y hacia arriba y +Z hacia delante). Lo demás no se mueve. */
const despiece: Record<string, [number, number, number]> = {
  'PP 367': [0, 0.5, -0.02],
  'PC 304': [0, 0.43, -0.02],
  'PI 519': [0, 0.37, 0],
  'PC 497': [0, 0.33, 0],
  'PC 278': [0, 0.25, 0],
  'PC 272': [0, 0.25, -0.12],
  'PC 286': [0, 0.27, 0],
  'PA 147': [0, 0.3, -0.04],
  'PV 186': [0, 0.3, 0.06],
  'PE 087': [0.1, 0.25, -0.1],
  'PP 366': [0, 0.2, 0.2],
  'PP 821': [0, 0.22, 0.3],
  'PG 120': [0, 0.17, 0],
  'PI 448': [0, 0.13, 0],
  'PA 250': [0, 0.09, 0],
  'PI 037': [0, 0.075, 0],
  'PG 086': [0, 0.06, 0],
  'PC 256': [0, 0.035, 0],
  'PE 494': [0, 0.015, 0],
  'PC 279': [0, -0.05, 0],
  'PG 128': [0, -0.1, 0],
};

/** Recorrido por dentro: de arriba abajo, con el ángulo desde el que mejor se ve cada pieza */
export const recorrido: { codigo: string; phi: number; theta: number }[] = [
  { codigo: 'PP 367', phi: 0.8, theta: 0.5 },
  { codigo: 'PC 497', phi: 1.0, theta: 1.1 },
  { codigo: 'PI 448', phi: 0.42, theta: 0.3 },
  { codigo: 'PE 494', phi: 1.2, theta: 0.9 },
  { codigo: 'PP 821', phi: 1.25, theta: 0.12 },
  { codigo: 'PC 279', phi: 0.95, theta: -0.6 },
];

type Vista = 'tres' | 'frente' | 'lado' | 'arriba';
const vistas: Record<Vista, { phi: number; theta: number }> = {
  tres: { theta: 0.72, phi: 1.18 },
  frente: { theta: 0, phi: Math.PI * 0.47 },
  lado: { theta: Math.PI / 2, phi: Math.PI * 0.47 },
  arriba: { theta: 0, phi: 0.0006 },
};

export interface Escena {
  vista: (v: Vista) => void;
  modo: (rayos: boolean) => void;
  despiece: (abierto: boolean) => void;
  /** Va a una pieza del recorrido; -1 sale del recorrido */
  paso: (i: number) => void;
  zoom: (factor: number) => number;
}

export interface Opciones {
  src: string;
  draco: string;
  /** Lienzo: la escena ocupa todo el hero */
  lienzo: HTMLElement;
  /** Columna donde va la máquina; en pantallas anchas la cámara la centra ahí */
  columna: HTMLElement;
  /** Etiquetas del despiece (con data-codigo) y el SVG donde van sus líneas */
  etiquetas: HTMLElement[];
  lineas: SVGSVGElement;
  quieto: boolean;
  alProgreso: (p: number) => void;
  alAngulo: (az: number, el: number) => void;
  alZoom: (z: number) => void;
  /** El usuario ha girado la máquina a mano: ya no está en ninguna vista fija */
  alSoltarVista: () => void;
}

const suave = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const ZMAX = 4;

const textura = (paradas: [number, string][]) => {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d')!;
  const r = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  for (const [p, col] of paradas) r.addColorStop(p, col);
  g.fillStyle = r;
  g.fillRect(0, 0, 256, 256);
  return new CanvasTexture(c);
};

export async function crearEscena(o: Opciones): Promise<Escena> {
  const { lienzo, columna } = o;
  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.toneMapping = ACESFilmicToneMapping;
  // Planos de corte por material: los usa la regeneración de la carcasa, de abajo arriba
  renderer.localClippingEnabled = true;
  lienzo.prepend(renderer.domElement);

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();
  scene.environmentIntensity = 0.9;
  const camera = new PerspectiveCamera(26, 1, 0.01, 30);

  // ——— Modelo ———
  const draco = new DRACOLoader().setDecoderPath(o.draco);
  const gltf = await new GLTFLoader().setDRACOLoader(draco).loadAsync(o.src, (ev) => {
    if (ev.total) o.alProgreso(ev.loaded / ev.total);
  });
  draco.dispose();
  const modelo = gltf.scene;
  const caja = new Box3().setFromObject(modelo);
  const centro = caja.getCenter(new Vector3());
  modelo.position.set(-centro.x, -caja.min.y, -centro.z);
  scene.add(modelo);
  const alto = caja.max.y - caja.min.y;
  const ancho = Math.max(caja.max.x - caja.min.x, caja.max.z - caja.min.z);
  const mallas: Mesh[] = [];
  modelo.traverse((m) => {
    if ((m as Mesh).isMesh) mallas.push(m as Mesh);
  });

  // Piezas con código ("PP 367 Tapa (NAUO18)"; three.js cambia los espacios por "_")
  const piezas: { obj: Object3D; base: Vector3; fin: Vector3 }[] = [];
  const nodosDe = new Map<string, Object3D[]>();
  const mallasDe = new Map<string, Set<Mesh>>();
  const nodos: Object3D[] = [];
  modelo.traverse((n) => {
    if (/NAUO\d+/.test(n.name)) nodos.push(n);
  });
  for (const obj of nodos) {
    const cod = obj.name.match(/^([A-Z]{2})[ _](\d{3})/);
    if (!cod) continue;
    const codigo = `${cod[1]} ${cod[2]}`;
    if (!nodosDe.has(codigo)) {
      nodosDe.set(codigo, []);
      mallasDe.set(codigo, new Set());
    }
    nodosDe.get(codigo)!.push(obj);
    obj.traverse((m) => (m as Mesh).isMesh && mallasDe.get(codigo)!.add(m as Mesh));
    const d = despiece[codigo];
    if (d) piezas.push({ obj, base: obj.position.clone(), fin: obj.position.clone().add(new Vector3(...d)) });
  }
  const cajaDe = (codigo: string, out: Box3) => {
    out.makeEmpty();
    for (const n of nodosDe.get(codigo) ?? []) out.expandByObject(n);
    return out;
  };

  // ——— Estudio ———
  const uT = { value: 0 };
  const uC = { value: new Vector2(0.66, 0.5) };
  const uRes = { value: new Vector2(1, 1) };
  const uFase = { value: 0 };
  // Remolino de luz: las estelas de un rotor girando, como una foto de larga exposición, detrás de la máquina
  const remolino = new Mesh(
    new PlaneGeometry(2, 2),
    new ShaderMaterial({
      uniforms: { uC, uRes, uFase },
      depthTest: false,
      depthWrite: false,
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, .9999, 1.); }',
      fragmentShader: `uniform float uFase; uniform vec2 uC; uniform vec2 uRes; varying vec2 vUv;
        float h(float n){ return fract(sin(n * 91.345) * 47453.21); }
        void main(){
          vec2 p = (vUv - uC) * vec2(uRes.x / uRes.y, 1.);
          float r = length(p) * 2.1;
          float a = atan(p.y, p.x) / 6.28318 + .5;
          vec3 luz = vec3(0.);
          for (int k = 0; k < 2; k++) {
            float K = k == 0 ? 26. : 11.;
            float i = floor(r * K);
            float f = fract(r * K);
            float hi = h(i + float(k) * 13.);
            float banda = smoothstep(0., .25, f) * smoothstep(1., .55, f) * step(.35, hi);
            float giro = uFase * (.6 + hi * 1.2) * (k == 0 ? 1. : -.7);
            float n = 1. + floor(hi * 3.);
            float estela = pow(fract(a * n + hi * 7. + giro), 7.) * banda;
            vec3 tinte = hi > .72 ? vec3(1., .1, .12) : vec3(.85, .88, .9) * .55;
            luz += tinte * estela * (k == 0 ? .5 : .32);
          }
          float vi = smoothstep(1.25, .25, r) * smoothstep(.12, .42, r);
          gl_FragColor = vec4(vec3(.071, .078, .086) + luz * vi * .8, 1.);
        }`,
    }),
  );
  remolino.frustumCulled = false;
  remolino.renderOrder = -10;
  scene.add(remolino);

  // Suelo que se funde con el fondo y sombra de contacto
  const suelo = new Mesh(
    new CircleGeometry(ancho * 3.2, 64),
    new MeshStandardMaterial({
      color: 0x24282c,
      roughness: 0.62,
      metalness: 0.35,
      transparent: true,
      alphaMap: textura([
        [0, '#fff'],
        [0.45, '#888'],
        [1, '#000'],
      ]),
      depthWrite: false,
    }),
  );
  suelo.rotation.x = -Math.PI / 2;
  scene.add(suelo);
  const sombra = new Mesh(
    new PlaneGeometry(ancho * 1.5, ancho * 1.5),
    new MeshBasicMaterial({
      map: textura([
        [0, 'rgba(0,0,0,.75)'],
        [1, 'rgba(0,0,0,0)'],
      ]),
      transparent: true,
      depthWrite: false,
    }),
  );
  sombra.rotation.x = -Math.PI / 2;
  sombra.position.y = 0.002;
  scene.add(sombra);

  // Aro rojo del suelo con un destello blanco que lo recorre, como la raya de los pasos de la portada
  const aro = new Mesh(
    new RingGeometry(ancho * 0.8, ancho * 0.8 + 0.003, 200),
    new ShaderMaterial({
      uniforms: { uT },
      transparent: true,
      depthWrite: false,
      vertexShader:
        'varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
      fragmentShader: `uniform float uT; varying vec2 vP;
        void main(){
          float d = fract(atan(vP.y, vP.x) / 6.28318 + .5 - uT * .09);
          float f = smoothstep(.86, .985, d) * (1. - smoothstep(.985, 1., d));
          gl_FragColor = vec4(mix(vec3(1., .14, .16), vec3(1.), f), .8 + f * .2);
        }`,
    }),
  );
  aro.rotation.x = -Math.PI / 2;
  aro.position.y = 0.003;
  scene.add(aro);

  // Haz de luz desde arriba con motas de polvo flotando dentro
  const HZ = 2.3;
  const RZ = ancho * 0.95;
  const haz = new Mesh(
    new ConeGeometry(RZ, HZ, 64, 1, true),
    new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: { uH: { value: HZ } },
      vertexShader: `uniform float uH; varying float vH; varying vec3 vN; varying vec3 vV;
        void main(){
          vH = position.y / uH + .5;
          vec4 mv = modelViewMatrix * vec4(position,1.);
          vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `varying float vH; varying vec3 vN; varying vec3 vV;
        void main(){
          float a = .12 * pow(abs(dot(vN, vV)), 2.2) * smoothstep(0., .25, vH) * (.45 + .55 * vH);
          gl_FragColor = vec4(vec3(1., .97, .94) * a, a);
        }`,
    }),
  );
  haz.position.y = HZ / 2;
  scene.add(haz);
  {
    const N = 380;
    const pos = new Float32Array(N * 3);
    const sem = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const y = Math.random() * HZ;
      const r = RZ * (1 - y / HZ) * Math.sqrt(Math.random()) * 0.95;
      const a = Math.random() * Math.PI * 2;
      pos.set([Math.cos(a) * r, y, Math.sin(a) * r], i * 3);
      sem[i] = Math.random();
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(pos, 3));
    g.setAttribute('sem', new BufferAttribute(sem, 1));
    scene.add(
      new Points(
        g,
        new ShaderMaterial({
          transparent: true,
          depthWrite: false,
          blending: AdditiveBlending,
          uniforms: { uT, uH: { value: HZ }, uPx: { value: renderer.getPixelRatio() } },
          vertexShader: `uniform float uT; uniform float uH; uniform float uPx; attribute float sem; varying float vA;
            void main(){
              vec3 p = position;
              p.y = mod(p.y + uT * (.012 + sem * .02), uH);
              p.x += sin(uT * .3 + sem * 40.) * .025; p.z += cos(uT * .25 + sem * 30.) * .025;
              vec4 mv = modelViewMatrix * vec4(p, 1.);
              gl_PointSize = (1.2 + sem * 2.2) * uPx * (2.2 / -mv.z);
              vA = (.25 + .75 * fract(sem * 7. + uT * .1 * (sem - .5))) * smoothstep(0., .3, p.y) * smoothstep(uH, uH * .7, p.y);
              gl_Position = projectionMatrix * mv;
            }`,
          fragmentShader: `varying float vA;
            void main(){ float a = smoothstep(.5, 0., length(gl_PointCoord - .5)) * vA * .55; gl_FragColor = vec4(vec3(a), a); }`,
        }),
      ),
    );
  }
  const foco = new SpotLight(0xffffff, 6, 0, 0.42, 1, 1.4);
  foco.position.set(0.2, 2.4, 0.6);
  scene.add(foco, foco.target);
  // Filo rojo que sigue al ratón: los cantos de la máquina cambian de luz al moverse por la página
  const filo = new PointLight(0xff2a2f, 0.6, 2.4, 2);
  filo.position.set(0, alto * 0.9, -ancho * 0.9);
  scene.add(filo);
  const raton = new Vector2();
  const hero = lienzo.parentElement!;
  hero.addEventListener('pointermove', (ev) => {
    const r = hero.getBoundingClientRect();
    raton.set(((ev.clientX - r.left) / r.width) * 2 - 1, ((ev.clientY - r.top) / r.height) * 2 - 1);
  });

  // ——— Materiales: real, rayos X y la pieza aislada del recorrido ———
  const originales = new Map<Mesh, Material | Material[]>(mallas.map((m) => [m, m.material]));
  const fantasma = new MeshBasicMaterial({ color: 0x6d7880, transparent: true, opacity: 0.07, depthWrite: false });
  const linea = new LineBasicMaterial({ color: 0xff3a40, transparent: true, opacity: 0.75 });
  const lineaTenue = new LineBasicMaterial({ color: 0xff3a40, transparent: true, opacity: 0.18 });
  let aristas: Map<Mesh, LineSegments> | null = null;
  const prepararAristas = () => {
    if (aristas) return aristas;
    aristas = new Map(
      mallas.map((m) => {
        const l = new LineSegments(new EdgesGeometry(m.geometry, 30), linea);
        l.visible = false;
        m.add(l);
        return [m, l];
      }),
    );
    return aristas;
  };
  let rayos = false;
  let paso = -1;
  const aplicarMateriales = () => {
    const destacadas = paso >= 0 ? mallasDe.get(recorrido[paso].codigo) : undefined;
    const ar = rayos || destacadas ? prepararAristas() : aristas;
    for (const m of mallas) {
      const l = ar?.get(m);
      if (destacadas) {
        const esta = destacadas.has(m);
        m.material = esta ? originales.get(m)! : fantasma;
        if (l) {
          l.visible = !esta;
          l.material = lineaTenue;
        }
      } else {
        m.material = rayos ? fantasma : originales.get(m)!;
        if (l) {
          l.visible = rayos;
          l.material = linea;
        }
      }
    }
    foco.intensity = rayos && !destacadas ? 1.5 : 6;
  };

  // ——— Paso de real a rayos X, y vuelta, contado como una historia. Hacia rayos X la carcasa arde: se enciende al
  // rojo blanco, se deshace en brasas que saltan, se enfrían y caen al suelo como cenizas, y entre ellas queda la
  // máquina en rayos X. De vuelta, renace de sus cenizas: suben en remolino y la carcasa se rehace de abajo arriba,
  // con un frente de brasas justo donde se está formando. Los puntos de cada malla se muestrean una vez, con el
  // navegador libre, en sus coordenadas propias; al empezar se llevan a su sitio actual ———
  const N_PUNTOS = 22000;
  let muestras: { malla: Mesh; local: Float32Array }[] | null = null;
  const muestrear = () => {
    if (muestras) return muestras;
    const tam = new Vector3();
    const caja_ = new Box3();
    const areas = mallas.map((m) => {
      m.geometry.computeBoundingBox();
      caja_.copy(m.geometry.boundingBox!).getSize(tam);
      return tam.x * tam.y + tam.y * tam.z + tam.x * tam.z + 1e-6;
    });
    const total = areas.reduce((a, b) => a + b, 0);
    const p = new Vector3();
    muestras = mallas.map((malla, i) => {
      const n = Math.max(4, Math.round((areas[i] / total) * N_PUNTOS));
      const sampler = new MeshSurfaceSampler(malla).build();
      const local = new Float32Array(n * 3);
      for (let k = 0; k < n; k++) {
        sampler.sample(p);
        local.set([p.x, p.y, p.z], k * 3);
      }
      return { malla, local };
    });
    return muestras;
  };
  const uP = { value: 0 };
  const uA = { value: 0 };
  const uModo = { value: 0 };
  const uCentro = { value: new Vector3() };
  const uSuelo = { value: 0 };
  const uAlto = { value: 1 };
  const nube = new Points(
    new BufferGeometry(),
    new ShaderMaterial({
      uniforms: { uP, uA, uModo, uCentro, uSuelo, uAlto, uPx: { value: renderer.getPixelRatio() } },
      vertexShader: `
        attribute vec3 rumbo;
        attribute float semilla;
        attribute float altura;
        uniform float uP;
        uniform float uA;
        uniform float uModo;
        uniform vec3 uCentro;
        uniform float uSuelo;
        uniform float uAlto;
        uniform float uPx;
        varying float vA;
        varying float vCalor;
        vec3 girar(vec3 q, float a) {
          float c = cos(a);
          float s = sin(a);
          q.xz = mat2(c, -s, s, c) * q.xz;
          return q;
        }
        void main() {
          // Dónde acaba cada brasa en el suelo, ya hecha ceniza
          vec3 ceniza = vec3(position.x + rumbo.x, uSuelo + 0.002, position.z + rumbo.z);
          vec3 p;
          float calor;
          float alfa;
          if (uModo < 0.5) {
            // Destrucción: cada punto arde con su retraso, salta un poco, se enfría y cae al suelo
            float k = clamp((uP - semilla * 0.3) / 0.7, 0.0, 1.0);
            float sal = 1.0 - pow(1.0 - k, 2.0);
            p = mix(position, ceniza, vec3(sal, k * k, sal));
            p.y += uAlto * 0.32 * (0.5 + semilla) * k * (1.0 - k);
            p = girar(p - uCentro, k * (0.6 + semilla)) + uCentro;
            calor = 1.0 - k;
            alfa = 1.0 - 0.65 * smoothstep(0.75, 1.0, k);
          } else {
            // Regeneración: las cenizas suben en remolino y llegan a su sitio cuando el frente pasa por su altura
            float llega = 0.12 + 0.72 * altura;
            float k = clamp((uP - (llega - 0.42)) / 0.42, 0.0, 1.0);
            float sk = k * k * (3.0 - 2.0 * k);
            p = mix(ceniza, position, sk);
            p = girar(p - uCentro, (1.0 - sk) * (2.2 + 2.0 * semilla)) + uCentro;
            calor = sk;
            // En el suelo, ceniza tenue; al llegar, se funde con la carcasa que renace
            alfa = mix(0.35, 1.0, sk) * (1.0 - smoothstep(llega, llega + 0.1, uP));
          }
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = uPx * (1.8 + 3.4 * calor) * (1.6 / -mv.z);
          vA = uA * alfa * (0.55 + 0.45 * semilla);
          vCalor = calor;
        }`,
      fragmentShader: `
        varying float vA;
        varying float vCalor;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          // Del blanco al rojo vivo se enfría a naranja, rojo de la marca y, al final, ceniza
          vec3 ceniza = vec3(0.32, 0.3, 0.3);
          vec3 rojo = vec3(1.0, 0.16, 0.2);
          vec3 naranja = vec3(1.0, 0.55, 0.25);
          vec3 blanco = vec3(1.0, 0.93, 0.88);
          vec3 c = mix(ceniza, rojo, smoothstep(0.0, 0.35, vCalor));
          c = mix(c, naranja, smoothstep(0.35, 0.7, vCalor));
          c = mix(c, blanco, smoothstep(0.7, 1.0, vCalor));
          c += vec3(0.3) * smoothstep(0.22, 0.0, d) * vCalor;
          gl_FragColor = vec4(c, vA * smoothstep(0.5, 0.0, d));
        }`,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    }),
  );
  nube.frustumCulled = false;
  nube.visible = false;
  scene.add(nube);
  const cajaNube = new Box3();
  const montarNube = () => {
    const lista = muestrear();
    const n = lista.reduce((a, x) => a + x.local.length / 3, 0);
    const pos = new Float32Array(n * 3);
    const rumbo = new Float32Array(n * 3);
    const semilla = new Float32Array(n);
    const altura = new Float32Array(n);
    cajaNube.setFromObject(modelo);
    const centro_ = cajaNube.getCenter(new Vector3());
    const alto_ = Math.max(cajaNube.max.y - cajaNube.min.y, 1e-3);
    uCentro.value.copy(centro_);
    uSuelo.value = cajaNube.min.y;
    uAlto.value = alto_;
    const v = new Vector3();
    const r = new Vector3();
    let i = 0;
    for (const { malla, local } of lista) {
      for (let k = 0; k < local.length; k += 3, i++) {
        v.set(local[k], local[k + 1], local[k + 2]).applyMatrix4(malla.matrixWorld);
        pos.set([v.x, v.y, v.z], i * 3);
        // En el suelo, las cenizas quedan esparcidas hacia fuera de la máquina
        r.set(v.x - centro_.x, 0, v.z - centro_.z).normalize();
        r.x += (Math.random() - 0.5) * 0.9;
        r.z += (Math.random() - 0.5) * 0.9;
        r.normalize().multiplyScalar(ancho * (0.12 + Math.random() * 0.45));
        rumbo.set([r.x, 0, r.z], i * 3);
        semilla[i] = Math.random();
        altura[i] = MathUtils.clamp((v.y - cajaNube.min.y) / alto_, 0, 1);
      }
    }
    const g = nube.geometry;
    g.setAttribute('position', new BufferAttribute(pos, 3));
    g.setAttribute('rumbo', new BufferAttribute(rumbo, 3));
    g.setAttribute('semilla', new BufferAttribute(semilla, 1));
    g.setAttribute('altura', new BufferAttribute(altura, 1));
  };
  // Al renacer, la carcasa real se ve solo por debajo del frente de brasas, que sube; las líneas, solo por encima
  const LEJOS = 1e6;
  const planoReal = new Plane(new Vector3(0, -1, 0), LEJOS);
  const planoLineas = new Plane(new Vector3(0, -1, 0), LEJOS);
  for (const mat of originales.values()) for (const x of [mat].flat()) x.clippingPlanes = [planoReal];
  linea.clippingPlanes = [planoLineas];
  const OPACIDAD_FANTASMA = fantasma.opacity;
  const OPACIDAD_LINEA = linea.opacity;
  const verRayos = (f: number) => {
    fantasma.opacity = OPACIDAD_FANTASMA * f;
    linea.opacity = OPACIDAD_LINEA * f;
  };
  const ponerAristas = (si: boolean) => {
    for (const m of mallas) {
      const l = aristas?.get(m);
      if (l) {
        l.visible = si;
        l.material = linea;
      }
    }
  };
  const IGNICION = 0.12;
  let transicion: { t0: number; dur: number; aRayos: boolean; cambiado: boolean } | null = null;
  const empezarTransicion = (aRayos: boolean) => {
    prepararAristas();
    montarNube();
    uModo.value = aRayos ? 0 : 1;
    if (aRayos) {
      // Se sigue viendo lo real mientras se enciende
      rayos = false;
      aplicarMateriales();
    } else {
      // La carcasa real, recortada bajo el frente (de momento, nada) y las líneas de rayos X a la vista
      for (const m of mallas) m.material = originales.get(m)!;
      ponerAristas(true);
      planoReal.set(new Vector3(0, -1, 0), -LEJOS);
      foco.intensity = 6;
    }
    rayos = aRayos;
    verRayos(1);
    nube.visible = true;
    transicion = { t0: performance.now(), dur: aRayos ? 2100 : 2300, aRayos, cambiado: false };
  };
  const suaveEntre = (a: number, b: number, x: number) => {
    const t = MathUtils.clamp((x - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
  };
  // Dibuja el fotograma y, durante el paso, mueve la nube y cambia los materiales en su momento
  const dibujar = (ahora: number) => {
    if (transicion) {
      const t = transicion;
      const p = Math.min((ahora - t.t0) / t.dur, 1);
      if (t.aRayos) {
        // Ignición sobre la carcasa; al arder, la carcasa desaparece con un golpe de luz y quedan los rayos X
        uA.value = suaveEntre(0, IGNICION, p) * (1 - suaveEntre(0.88, 1, p));
        uP.value = suaveEntre(IGNICION, 1, p);
        if (!t.cambiado && p >= IGNICION) {
          t.cambiado = true;
          aplicarMateriales();
        }
        if (t.cambiado) verRayos(suaveEntre(0.3, 0.9, p));
        const golpe = (p - IGNICION) / 0.25;
        renderer.toneMappingExposure = 1 + 0.55 * (golpe >= 0 ? Math.max(0, 1 - golpe) : 0);
      } else {
        // El frente sube al mismo ritmo al que llegan las brasas (0,12 + 0,72 × altura)
        uA.value = 1 - suaveEntre(0.94, 1, p);
        uP.value = p;
        const h = uSuelo.value + uAlto.value * ((p - 0.12) / 0.72) + uAlto.value * 0.01;
        planoReal.set(new Vector3(0, -1, 0), h);
        planoLineas.set(new Vector3(0, 1, 0), -h);
        verRayos(1 - suaveEntre(0.55, 0.95, p));
      }
      if (p === 1) terminarTransicion();
    }
    renderer.render(scene, camera);
  };
  const terminarTransicion = () => {
    transicion = null;
    nube.visible = false;
    renderer.toneMappingExposure = 1;
    planoReal.set(new Vector3(0, -1, 0), LEJOS);
    planoLineas.set(new Vector3(0, -1, 0), LEJOS);
    verRayos(1);
    aplicarMateriales();
  };

  // ——— Cámara ———
  const controls = new OrbitControls(camera, renderer.domElement);
  Object.assign(controls, {
    enableZoom: false,
    enablePan: false,
    enableDamping: true,
    dampingFactor: 0.09,
    rotateSpeed: 0.75,
    minPolarAngle: 0.0005,
    maxPolarAngle: Math.PI * 0.485,
    autoRotateSpeed: 0.6,
  });
  // En pantallas táctiles el dedo sigue bajando la página: se gira con los botones de vista
  if (matchMedia('(pointer: coarse)').matches) {
    controls.enabled = false;
    renderer.domElement.style.touchAction = 'pan-y';
  }

  let zona = { cx: 0.66, cy: 0.5, w: 0.55, h: 0.8 };
  let e = 0;
  let desde = 0;
  let hacia = 0;
  let t0 = 0;
  let dur = 1400;
  let etiquetasOn = false;
  let aparte = 0;
  const tan = () => Math.tan((camera.fov * Math.PI) / 360);
  // La máquina entera, del tamaño de su columna; con etiquetas deja sitio a la derecha para la columna de nombres
  const encuadre = () => {
    const h = alto + 0.62 * e;
    const w = ancho * (1.45 + 0.35 * e) * (1 + 0.5 * aparte);
    const dist = Math.max(h / 2 / (tan() * zona.h), w / 2 / (tan() * camera.aspect * zona.w)) * 1.32;
    return { objetivo: new Vector3(0, h * 0.5 - 0.04 * e, 0), dist };
  };
  // Una pieza del recorrido, de cerca
  const cp = new Box3();
  const tam = new Vector3();
  const enfoque = (codigo: string) => {
    cajaDe(codigo, cp).getSize(tam);
    const r = Math.max(tam.x, tam.y, tam.z, 0.05);
    const dist = Math.max(r / 2 / (tan() * zona.h), r / 2 / (tan() * camera.aspect * zona.w)) * 1.9;
    return { objetivo: cp.getCenter(new Vector3()), dist };
  };
  const desplazar = () => {
    const W = lienzo.clientWidth;
    const H = lienzo.clientHeight;
    if (W <= 900) return;
    camera.setViewOffset(W, H, -(zona.cx - zona.w * 0.17 * aparte - 0.5) * W, -(zona.cy - 0.5) * H, W, H);
    camera.updateProjectionMatrix();
  };
  const medir = () => {
    const W = lienzo.clientWidth;
    const H = lienzo.clientHeight;
    if (!W || !H) return;
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    if (W > 900) {
      const a = lienzo.getBoundingClientRect();
      const b = columna.getBoundingClientRect();
      // Abajo, hasta la placa con el nombre: la elipse del suelo no la pisa aunque el hero sea bajo
      const pie = columna.querySelector('.pie')?.getBoundingClientRect();
      const top = b.top + 50 - a.top;
      const bottom = (pie ? pie.top - 10 : b.bottom - 100) - a.top;
      zona = {
        cx: (b.left + b.width / 2 - a.left) / W,
        cy: (top + bottom) / 2 / H,
        w: b.width / W,
        h: (bottom - top) / H,
      };
      desplazar();
    } else {
      zona = { cx: 0.5, cy: 0.5, w: 0.94, h: 0.9 };
      camera.clearViewOffset();
    }
    uC.value.set(zona.cx, 1 - zona.cy);
    uRes.value.set(W, H);
    o.lineas.setAttribute('viewBox', `0 0 ${hero.clientWidth} ${hero.clientHeight}`);
    camera.updateProjectionMatrix();
    pedir();
  };

  const esf = new Spherical();
  const ponerCamara = (r: number, phi: number, theta: number) => {
    esf.set(r, phi, theta);
    camera.position.setFromSpherical(esf).add(controls.target);
  };
  let viaje: { de: Spherical; phi: number; theta: number; t0: number; dur: number } | null = null;
  let idle = performance.now();
  let arrastrando = false;
  const irA = (v: { phi: number; theta: number }, d = 1200) => {
    const de = new Spherical().setFromVector3(camera.position.clone().sub(controls.target));
    let dt = v.theta - de.theta;
    dt = Math.atan2(Math.sin(dt), Math.cos(dt));
    viaje = { de, phi: v.phi, theta: de.theta + dt, t0: performance.now(), dur: o.quieto ? 1 : d };
    idle = performance.now();
    pedir();
  };
  controls.addEventListener('start', () => {
    viaje = null;
    arrastrando = true;
    o.alSoltarVista();
  });
  controls.addEventListener('end', () => {
    arrastrando = false;
    idle = performance.now();
  });

  // ——— Zoom: botones, Ctrl + rueda (y el pellizco del trackpad) y doble clic en una pieza para acercarse ahí ———
  let zoom = 1;
  let zoomVa = 1;
  let puntoZoom: Vector3 | null = null;
  const ponerZoom = (z: number, punto?: Vector3 | null) => {
    zoom = MathUtils.clamp(z, 1, ZMAX);
    if (punto !== undefined) puntoZoom = punto;
    if (zoom === 1) puntoZoom = null;
    idle = performance.now();
    o.alZoom(zoom);
    pedir();
    return zoom;
  };
  renderer.domElement.addEventListener(
    'wheel',
    (ev) => {
      if (!ev.ctrlKey && !ev.metaKey) return; // la rueda sola sigue bajando la página
      ev.preventDefault();
      ponerZoom(zoom * Math.exp(-ev.deltaY * 0.01));
    },
    { passive: false },
  );
  const rayo = new Raycaster();
  const ndc = new Vector2();
  renderer.domElement.addEventListener('dblclick', (ev) => {
    const r = renderer.domElement.getBoundingClientRect();
    ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
    rayo.setFromCamera(ndc, camera);
    const [hit] = rayo.intersectObjects(mallas, false);
    if (hit) ponerZoom(Math.max(zoom * 1.8, 2.2), hit.point.clone());
    else ponerZoom(1);
  });

  // ——— Despiece ———
  const abrir = (si: boolean, d = 1400) => {
    desde = e;
    hacia = si ? 1 : 0;
    t0 = performance.now();
    dur = o.quieto ? 1 : d;
    pedir();
  };

  // ——— Etiquetas: una columna a la derecha, en el orden de las piezas, con su línea hasta un punto en cada pieza ———
  const NS = 'http://www.w3.org/2000/svg';
  const trazos = new Map(
    o.etiquetas.map((el) => {
      const g = document.createElementNS(NS, 'g');
      g.setAttribute('opacity', '0');
      const halo = document.createElementNS(NS, 'circle');
      halo.setAttribute('class', 'halo');
      halo.setAttribute('r', '4');
      const punto = document.createElementNS(NS, 'circle');
      punto.setAttribute('class', 'punto');
      punto.setAttribute('r', '4.5');
      g.append(document.createElementNS(NS, 'path'), halo, punto);
      o.lineas.append(g);
      return [el, g] as const;
    }),
  );
  const v3 = new Vector3();
  const cm = new Box3();
  const aPantalla = (v: Vector3) => {
    v.project(camera);
    return [((v.x + 1) / 2) * lienzo.clientWidth, ((1 - v.y) / 2) * lienzo.clientHeight + lienzo.offsetTop] as const;
  };
  let etiquetasVisibles = false;
  const ponerEtiquetas = () => {
    const ver =
      etiquetasOn && paso < 0
        ? Math.max(0, (e - 0.6) / 0.4) * MathUtils.clamp((controls.getPolarAngle() - 0.35) / 0.3, 0, 1)
        : 0;
    if (!ver) {
      if (etiquetasVisibles) {
        for (const el of o.etiquetas) el.style.opacity = '0';
        for (const g of trazos.values()) g.setAttribute('opacity', '0');
        etiquetasVisibles = false;
      }
      return;
    }
    etiquetasVisibles = true;
    cm.setFromObject(modelo);
    let x1 = -Infinity;
    for (let i = 0; i < 8; i++) {
      v3.set(i & 1 ? cm.max.x : cm.min.x, i & 2 ? cm.max.y : cm.min.y, i & 4 ? cm.max.z : cm.min.z);
      x1 = Math.max(x1, aPantalla(v3)[0]);
    }
    const zDer = (zona.cx + zona.w / 2) * lienzo.clientWidth;
    const lista = o.etiquetas
      .map((el) => {
        cajaDe(el.dataset.codigo!, cp).getCenter(v3);
        const [ax, ay] = aPantalla(v3);
        return { el, ax, ay, y: ay, w: el.offsetWidth, h: el.offsetHeight };
      })
      .sort((a, b) => a.ay - b.ay);
    const colX = Math.min(x1 + 36, zDer - Math.max(...lista.map((it) => it.w)));
    let y = -Infinity;
    for (const it of lista) {
      it.y = Math.max(it.ay, y + 36); // sin pisarse
      y = it.y;
      it.el.style.transform = `translate(${colX}px, ${it.y - it.h / 2}px)`;
      it.el.style.opacity = String(ver);
      const g = trazos.get(it.el)!;
      g.setAttribute('opacity', String(ver));
      g.children[0].setAttribute('d', `M${it.ax} ${it.ay} L${colX - 14} ${it.y} L${colX} ${it.y}`);
      for (const c of [g.children[1], g.children[2]]) {
        c.setAttribute('cx', String(it.ax));
        c.setAttribute('cy', String(it.ay));
      }
    }
  };

  // ——— Bucle: en marcha mientras se ve; se para fuera de pantalla o en otra pestaña ———
  let pedido = 0;
  let visible = true;
  let antes = performance.now();
  let azAntes = 0;
  let velRemolino = 0.25;
  function pedir() {
    if (!pedido && visible) {
      antes = performance.now();
      pedido = requestAnimationFrame(frame);
    }
  }
  function frame(ahora: number) {
    pedido = 0;
    const dt = Math.min((ahora - antes) / 1000, 0.05);
    antes = ahora;
    uT.value += dt;
    if (e !== hacia) {
      const p = Math.min((ahora - t0) / dur, 1);
      e = desde + (hacia - desde) * suave(p);
      if (p === 1) e = hacia;
      for (const pz of piezas) pz.obj.position.lerpVectors(pz.base, pz.fin, e);
    }
    const quiere = etiquetasOn && paso < 0 ? 1 : 0;
    if (Math.abs(quiere - aparte) > 0.001) {
      aparte += (quiere - aparte) * 0.08;
      desplazar();
    }
    const base = paso >= 0 ? enfoque(recorrido[paso].codigo) : encuadre();
    zoomVa += (zoom - zoomVa) * 0.12;
    const objetivo = puntoZoom ? base.objetivo.clone().lerp(puntoZoom, Math.min(1, (zoomVa - 1) / 1.2)) : base.objetivo;
    const dist = base.dist / zoomVa;
    controls.target.lerp(objetivo, viaje ? 0.12 : 0.2);
    if (viaje) {
      const p = Math.min((ahora - viaje.t0) / viaje.dur, 1);
      const s = suave(p);
      ponerCamara(
        viaje.de.radius + (dist - viaje.de.radius) * s,
        viaje.de.phi + (viaje.phi - viaje.de.phi) * s,
        viaje.de.theta + (viaje.theta - viaje.de.theta) * s,
      );
      if (p === 1) viaje = null;
    } else {
      const rel = esf.setFromVector3(camera.position.clone().sub(controls.target));
      ponerCamara(rel.radius + (dist - rel.radius) * 0.15, rel.phi, rel.theta);
    }
    // El remolino gira despacio y se acelera al girar la máquina, en el mismo sentido
    const az = controls.getAzimuthalAngle();
    let dAz = az - azAntes;
    dAz = Math.atan2(Math.sin(dAz), Math.cos(dAz));
    azAntes = az;
    velRemolino += (0.05 + Math.min(Math.abs(dAz) / Math.max(dt, 0.001), 6) * 0.35 - velRemolino) * 0.06;
    uFase.value += velRemolino * dt * (dAz < 0 ? -1 : 1);
    filo.position.x += (raton.x * ancho * 1.4 - filo.position.x) * 0.05;
    filo.position.y += ((0.9 - raton.y * 0.5) * alto - filo.position.y) * 0.05;
    controls.autoRotate = !o.quieto && paso < 0 && !viaje && !arrastrando && ahora - idle > 5000;
    controls.update(dt);
    dibujar(ahora);
    ponerEtiquetas();
    o.alAngulo(MathUtils.radToDeg(az), 90 - MathUtils.radToDeg(controls.getPolarAngle()));
    // Con "reducir movimiento" solo se dibuja cuando algo cambia
    if (!o.quieto || viaje || arrastrando || transicion || e !== hacia || Math.abs(zoom - zoomVa) > 0.001) pedir();
  }
  controls.addEventListener('change', () => pedir());
  new IntersectionObserver(([en]) => {
    visible = en.isIntersecting && !document.hidden;
    pedir();
  }).observe(lienzo);
  document.addEventListener('visibilitychange', () => {
    visible = !document.hidden;
    pedir();
  });
  new ResizeObserver(medir).observe(lienzo);
  medir();

  // Entrada: la máquina aparece ya montada, un poco más lejos y más alta, y la cámara se asienta en tres cuartos
  {
    const { objetivo, dist } = encuadre();
    controls.target.copy(objetivo);
    if (o.quieto) ponerCamara(dist, vistas.tres.phi, vistas.tres.theta);
    else {
      ponerCamara(dist * 1.12, vistas.tres.phi - 0.22, vistas.tres.theta - 0.35);
      irA(vistas.tres, 1800);
    }
  }
  // Aristas y puntos de rayos X se preparan con el navegador libre, para que el botón responda al momento
  (window.requestIdleCallback ?? setTimeout)(() => {
    prepararAristas();
    muestrear();
  });

  return {
    vista: (v) => {
      ponerZoom(1);
      irA(vistas[v]);
    },
    modo: (si) => {
      if (si === rayos) return;
      rayos = si;
      // Con la máquina entera a la vista, el cambio va con partículas; en el recorrido o con movimiento reducido, directo
      if (!o.quieto && paso < 0) empezarTransicion(si);
      else aplicarMateriales();
      pedir();
    },
    despiece: (si) => {
      etiquetasOn = si;
      abrir(si);
    },
    paso: (i) => {
      const antes_ = paso;
      paso = i;
      ponerZoom(1);
      if (transicion) terminarTransicion();
      aplicarMateriales();
      if (i >= 0) {
        if (antes_ < 0) abrir(true, 1200);
        irA(recorrido[i], 1500);
      } else {
        if (!etiquetasOn) abrir(false, 1200);
        irA(vistas.tres, 1500);
      }
    },
    zoom: (f) => ponerZoom(zoom * f),
  };
}
