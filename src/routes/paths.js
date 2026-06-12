export const HOME_PATH = "/";
export const LICITACIONES_PATH = "/licitaciones";
export const PROVEEDORES_PATH = "/proveedores";

export function getLicitacionDetailPath(codigo) {
  return `${LICITACIONES_PATH}/${codigo}`;
}
