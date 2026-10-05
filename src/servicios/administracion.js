// Servicio de datos de administración: facturas, cupos por tipo y configuración.
import { CLAVES, guardarJson, leerJson } from './almacenamiento';
import { CONFIGURACION_POR_DEFECTO, CUPOS_POR_DEFECTO, FACTURAS_INICIALES } from './datosDemo';

export async function listarFacturas() {
  return FACTURAS_INICIALES;
}

export async function cargarCupos() {
  return { ...CUPOS_POR_DEFECTO, ...leerJson(CLAVES.cupos, {}) };
}

export async function guardarCupos(cupos) {
  guardarJson(CLAVES.cupos, cupos);
}

export async function cargarConfiguracion() {
  return { ...CONFIGURACION_POR_DEFECTO, ...leerJson(CLAVES.configuracion, {}) };
}

export async function guardarConfiguracion(configuracion) {
  guardarJson(CLAVES.configuracion, configuracion);
}
