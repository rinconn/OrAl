// Digicen 22 (modelo 3D en public/3d/digicen22.glb): datos que comparten las escenas de Productos y de Empresa.

/** Despiece: cuánto se separa cada pieza (en metros, Y hacia arriba y +Z hacia delante). Lo demás no se mueve. */
export const despiece: Record<string, [number, number, number]> = {
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
