// Servicio del parqueadero: zonas, espacios y vehículos activos.
import { CLAVES, guardarJson, leerJson } from './almacenamiento';
import { construirParqueadero } from './datosDemo';

/**
 * Carga el estado del parqueadero. Si ya hay datos guardados los usa; si no,
 * parte del parqueadero de demostración. Es síncrona porque el contexto la
 * necesita para su estado inicial.
 */
export function cargarParqueadero() {
  const base = construirParqueadero();
  const estadosGuardados = leerJson(CLAVES.zonas, null);
  const vehiculosGuardados = leerJson(CLAVES.vehiculos, null);
  const zonas = base.zonas.map((zona) => ({
    ...zona,
    estados: estadosGuardados?.[zona.id] ?? zona.estados,
  }));
  return { zonas, vehiculos: vehiculosGuardados ?? base.vehiculos };
}

/** Guarda zonas y vehículos activos. */
export function guardarParqueadero({ zonas, vehiculos }) {
  const estados = {};
  zonas.forEach((zona) => (estados[zona.id] = zona.estados));
  guardarJson(CLAVES.zonas, estados);
  guardarJson(CLAVES.vehiculos, vehiculos);
}
