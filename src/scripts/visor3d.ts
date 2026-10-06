// Visor 3D de la Digicen 22 (modelo del STEP de SolidWorks de la empresa, 34 piezas con su código).
// Gira despacio, se puede girar arrastrando y se abre en despiece: cada pieza se separa en vertical, como en un plano
// técnico, y las principales llevan su etiqueta. Solo dibuja cuando se ve en pantalla.
import {
  ACESFilmicToneMapping,
  Box3,
  CanvasTexture,
  Group,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Scene,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/**
 * Despiece: cuánto se separa cada pieza (en metros, Y hacia arriba y +Z hacia delante) con la máquina abierta.
 * La clave es el código de la pieza ("PP 367"). Lo que no está aquí no se mueve.
 */
const despiece: Record<string, [number, number, number]> = {
  // Tapa y lo que va con ella, arriba del todo
  'PP 367': [0, 0.5, -0.02],
  'PC 304': [0, 0.43, -0.02],
  'PI 519': [0, 0.37, 0],
  'PC 497': [0, 0.33, 0],
  // Cuerpo y su chapa, levantados para ver lo de dentro
  'PC 278': [0, 0.25, 0],
  'PC 272': [0, 0.25, -0.12],
  'PC 286': [0, 0.27, 0],
  'PA 147': [0, 0.3, -0.04],
  'PV 186': [0, 0.3, 0.06],
  'PE 087': [0.1, 0.25, -0.1],
  // Frente y carátula, hacia delante
  'PP 366': [0, 0.2, 0.2],
  'PP 821': [0, 0.22, 0.3],
  // Depósito con su goma, entre el cuerpo y el motor
  'PG 120': [0, 0.17, 0],
  'PI 448': [0, 0.13, 0],
  'PA 250': [0, 0.09, 0],
  'PI 037': [0, 0.075, 0],
  'PG 086': [0, 0.06, 0],
  // Motor y su brida, un poco
  'PC 256': [0, 0.035, 0],
  'PE 494': [0, 0.015, 0],
  // Base y patas, hacia abajo
  'PC 279': [0, -0.05, 0],
  'PG 128': [0, -0.1, 0],
};

export interface Etiqueta {
  /** Código de la pieza en el modelo ("PP 367") */
  codigo: string;
  el: HTMLElement;
}

export interface Visor {
  abrir: (abierto: boolean) => void;
  parar: () => void;
}

const suave = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

/** Mancha de sombra en el suelo, dibujada una vez en un canvas */
const sombra = () => {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, 'rgba(0,0,0,0.55)');
  r.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = r;
  g.fillRect(0, 0, 128, 128);
  const tex = new CanvasTexture(c);
  return new Mesh(new PlaneGeometry(1, 1), new MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }));
};

export async function crearVisor(
  lienzo: HTMLElement,
  opciones: {
    src: string;
    draco: string;
    etiquetas: Etiqueta[];
    quieto: boolean;
    alCargar: () => void;
    alProgreso?: (p: number) => void;
  },
): Promise<Visor> {
  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  lienzo.prepend(renderer.domElement);

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new PerspectiveCamera(26, 1, 0.01, 20);

  const draco = new DRACOLoader().setDecoderPath(opciones.draco);
  const loader = new GLTFLoader().setDRACOLoader(draco);
  const gltf = await loader.loadAsync(opciones.src, (e) => {
    if (e.total) opciones.alProgreso?.(e.loaded / e.total);
  });
  draco.dispose();

  // El modelo, centrado y apoyado en el suelo
  const modelo = gltf.scene;
  const caja = new Box3().setFromObject(modelo);
  const centro = caja.getCenter(new Vector3());
  modelo.position.set(-centro.x, -caja.min.y, -centro.z);
  const giro = new Group();
  giro.add(modelo);
  scene.add(giro);
  const alto = caja.max.y - caja.min.y;
  const ancho = Math.max(caja.max.x - caja.min.x, caja.max.z - caja.min.z);

  const suelo = sombra();
  suelo.rotation.x = -Math.PI / 2;
  suelo.scale.setScalar(ancho * 1.6);
  suelo.position.y = 0.001;
  giro.add(suelo);

  // Piezas que se mueven en el despiece: los nodos con código ("PP 367 Tapa (NAUO18)")
  const piezas: { obj: Object3D; base: Vector3; fin: Vector3 }[] = [];
  const porCodigo = new Map<string, Object3D>();
  // three.js cambia los espacios de los nombres por "_": "PP_367_Tapa_(NAUO18)"
  const nodos: Object3D[] = [];
  modelo.traverse((o) => {
    if (/NAUO\d+/.test(o.name)) nodos.push(o);
  });
  for (const obj of nodos) {
    const cod = obj.name.match(/^([A-Z]{2})[ _](\d{3})/);
    if (!cod) continue;
    const codigo = `${cod[1]} ${cod[2]}`;
    if (!porCodigo.has(codigo)) porCodigo.set(codigo, obj);
    const d = despiece[codigo];
    if (d) piezas.push({ obj, base: obj.position.clone(), fin: obj.position.clone().add(new Vector3(...d)) });
  }

  // Cámara: de tres cuartos, un poco desde arriba, encuadrando la máquina abierta o cerrada
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minPolarAngle = Math.PI * 0.2;
  controls.maxPolarAngle = Math.PI * 0.5;
  controls.rotateSpeed = 0.7;
  // En pantallas táctiles no se gira con el dedo: así el dedo sigue bajando la página aunque toque la máquina
  if (matchMedia('(pointer: coarse)').matches) {
    controls.enabled = false;
    renderer.domElement.style.touchAction = 'pan-y';
  }
  const encuadre = (e: number) => {
    const h = alto + 0.62 * e;
    const objetivo = new Vector3(0, h * 0.5 - 0.04 * e, 0);
    const dist = (Math.max(h, ancho * 1.25) / 2 / Math.tan((camera.fov * Math.PI) / 360)) * 1.25;
    return { objetivo, dist };
  };
  {
    const { objetivo, dist } = encuadre(0);
    controls.target.copy(objetivo);
    camera.position.copy(objetivo).addScaledVector(new Vector3(0.62, 0.36, 0.7).normalize(), dist);
  }

  // Tamaño del lienzo
  const medir = () => {
    const { clientWidth: w, clientHeight: h } = lienzo;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // En lienzos estrechos se abre un poco el ángulo para que quepa la máquina abierta
    camera.fov = w / h < 0.9 ? 34 : 26;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(medir);
  ro.observe(lienzo);
  medir();

  // Etiquetas: siguen a su pieza en pantalla y solo se ven con la máquina abierta
  const ancla = new Vector3();
  const cajaPieza = new Box3();
  const ponerEtiquetas = (e: number) => {
    const { clientWidth: w, clientHeight: h } = lienzo;
    for (const et of opciones.etiquetas) {
      const obj = porCodigo.get(et.codigo);
      if (!obj) continue;
      cajaPieza.setFromObject(obj);
      cajaPieza.getCenter(ancla);
      ancla.x = cajaPieza.max.x;
      ancla.project(camera);
      et.el.style.transform = `translate(${((ancla.x + 1) / 2) * w}px, ${((1 - ancla.y) / 2) * h}px)`;
      et.el.style.opacity = String(Math.max(0, (e - 0.6) / 0.4));
    }
  };

  // Despiece animado
  let e = 0;
  let desde = 0;
  let hacia = 0;
  let t0 = 0;
  const dur = opciones.quieto ? 1 : 1400;
  const abrir = (abierto: boolean) => {
    desde = e;
    hacia = abierto ? 1 : 0;
    t0 = performance.now();
    lienzo.classList.toggle('abierto', abierto);
    despertar();
  };

  // Bucle: solo mientras se ve, y quieto si el sistema pide menos movimiento
  let visible = true;
  let pedido = 0;
  let quietoDesde = performance.now();
  const auto = !opciones.quieto;
  controls.addEventListener('start', () => {
    quietoDesde = Infinity;
    lienzo.classList.add('tocado');
  });
  controls.addEventListener('end', () => (quietoDesde = performance.now()));
  const vel = (Math.PI * 2) / 40; // una vuelta cada 40 s
  let antes = performance.now();
  const frame = (ahora: number) => {
    pedido = 0;
    const dt = Math.min((ahora - antes) / 1000, 0.05);
    antes = ahora;
    if (e !== hacia) {
      const p = Math.min((ahora - t0) / dur, 1);
      e = desde + (hacia - desde) * suave(p);
      if (p === 1) e = hacia;
      for (const pz of piezas) pz.obj.position.lerpVectors(pz.base, pz.fin, e);
      // La cámara se aleja y sube lo justo para que quepa la máquina abierta
      const { objetivo, dist } = encuadre(e);
      const dir = camera.position.clone().sub(controls.target).normalize();
      controls.target.copy(objetivo);
      camera.position.copy(objetivo).addScaledVector(dir, dist);
    }
    // Vuelve a girar sola a los 3 s de soltarla
    if (auto && ahora - quietoDesde > 3000) giro.rotation.y += vel * dt;
    controls.update();
    renderer.render(scene, camera);
    ponerEtiquetas(e);
    if (visible) pedido = requestAnimationFrame(frame);
  };
  const despertar = () => {
    if (!pedido && visible) {
      antes = performance.now();
      pedido = requestAnimationFrame(frame);
    }
  };
  const io = new IntersectionObserver(([en]) => {
    visible = en.isIntersecting && !document.hidden;
    despertar();
  });
  io.observe(lienzo);
  const alCambiarPestana = () => {
    visible = !document.hidden;
    despertar();
  };
  document.addEventListener('visibilitychange', alCambiarPestana);

  renderer.render(scene, camera);
  opciones.alCargar();
  despertar();

  return {
    abrir,
    parar: () => {
      cancelAnimationFrame(pedido);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', alCambiarPestana);
      controls.dispose();
      renderer.dispose();
    },
  };
}
