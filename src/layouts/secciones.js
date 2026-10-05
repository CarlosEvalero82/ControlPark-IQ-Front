// Definición de las secciones (menú) de cada rol.
// `ruta`: parte final de la URL; `permiso`: clave en PermisosContext (null = siempre visible).

export const SECCIONES = {
  porteria: [
    { ruta: 'entrada', titulo: 'Registro de entrada', icono: 'entrada', permiso: 'entrada' },
    { ruta: 'salida', titulo: 'Registro de salida', icono: 'salida', permiso: 'salida' },
    { ruta: 'espacios', titulo: 'Espacios disponibles', icono: 'cuadricula', permiso: 'espacios' },
    { ruta: 'cobro', titulo: 'Cobro a visitante', icono: 'recibo', permiso: 'cobro' },
    { ruta: 'historial', titulo: 'Historial del día', icono: 'reloj', permiso: 'historial' },
  ],
  residente: [
    { ruta: 'inicio', titulo: 'Inicio', icono: 'cuadricula', permiso: 'dashboard' },
    { ruta: 'pago', titulo: 'Pago de mensualidad', icono: 'recibo', permiso: 'pago' },
    { ruta: 'historial', titulo: 'Historial de pagos', icono: 'reloj', permiso: 'historial' },
    { ruta: 'vehiculos', titulo: 'Mis vehículos', icono: 'vehiculo', permiso: 'vehiculos_ver' },
    { ruta: 'notificaciones', titulo: 'Notificaciones', icono: 'campana', permiso: 'notif' },
    { ruta: 'perfil', titulo: 'Mi perfil', icono: 'persona', permiso: 'perfil' },
  ],
  admin: [
    { ruta: 'dashboard', titulo: 'Dashboard / Reportes', icono: 'cuadricula', permiso: null },
    { ruta: 'usuarios', titulo: 'Usuarios y residentes', icono: 'persona', permiso: null },
    { ruta: 'permisos', titulo: 'Permisos', icono: 'escudo', permiso: null },
    { ruta: 'zonas', titulo: 'Zonas y espacios', icono: 'cuadricula', permiso: null },
    { ruta: 'tarifas', titulo: 'Tarifas', icono: 'recibo', permiso: null },
    { ruta: 'facturacion', titulo: 'Facturación visitantes', icono: 'recibo', permiso: null },
    { ruta: 'mapa', titulo: 'Mapa de ocupación', icono: 'cuadricula', permiso: null },
    { ruta: 'configuracion', titulo: 'Configuración', icono: 'engranaje', permiso: null },
  ],
};

export const NOMBRE_ROL = {
  porteria: 'Portería / Guarda',
  residente: 'Residente',
  admin: 'Administrador',
};

/** Secciones que el rol puede ver según los permisos que fijó el administrador. */
export function seccionesPermitidas(rol, permisos) {
  return SECCIONES[rol].filter((s) => s.permiso === null || permisos[rol]?.[s.permiso] !== false);
}
