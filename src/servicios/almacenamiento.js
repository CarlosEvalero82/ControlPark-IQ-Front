// Capa mínima sobre localStorage. Mientras no exista una API HTTP, los servicios
// guardan aquí sus datos (por eso las claves conservan el prefijo del prototipo).

/** Lee un JSON guardado; si no existe o está dañado devuelve el valor por defecto. */
export function leerJson(clave, porDefecto) {
  try {
    const crudo = localStorage.getItem(clave);
    return crudo ? JSON.parse(crudo) : porDefecto;
  } catch {
    return porDefecto;
  }
}

/** Guarda un valor como JSON. */
export function guardarJson(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

/** Claves de localStorage. */
export const CLAVES = {
  zonas: 'controlpark_zone_status',
  vehiculos: 'controlpark_vehiculos_activos',
  permisos: 'controlpark_permissions',
  usuariosExtra: 'controlpark_extra_users',
  administradorMaestro: 'controlpark_master_admin',
  sesion: 'controlpark_current_session',
  cupos: 'controlpark_quotas',
  tarifas: 'controlpark_tariffs',
  configuracion: 'controlpark_config',
};
