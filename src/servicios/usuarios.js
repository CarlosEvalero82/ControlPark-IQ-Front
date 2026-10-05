// Servicio de usuarios. Hoy usa datos de demostración + localStorage; todas las
// funciones son asíncronas para que, al existir la API (GET/POST /api/personas),
// solo cambie el cuerpo de cada función y no los componentes que las usan.
import { CLAVES, guardarJson, leerJson } from './almacenamiento';
import { CLAVE_DEMO, USUARIOS_INICIALES, USUARIO_DEMO_POR_ROL } from './datosDemo';
import { iniciales } from '../utilidades/formato';

/** Devuelve la lista de usuarios guardada, o la de demostración la primera vez. */
function cargarLista() {
  return leerJson(CLAVES.usuariosExtra, null) ?? USUARIOS_INICIALES.map((u) => ({ ...u, clave: CLAVE_DEMO }));
}

export async function listarUsuarios() {
  return cargarLista();
}

/** Busca un usuario por su nombre de usuario (para el perfil y los vehículos del residente). */
export async function obtenerUsuario(nombreUsuario) {
  return cargarLista().find((u) => u.usuario === nombreUsuario) ?? null;
}

export async function guardarUsuarios(lista) {
  guardarJson(CLAVES.usuariosExtra, lista);
}

/** Agrega un usuario nuevo al final de la lista. */
export async function crearUsuario(usuario) {
  const lista = cargarLista();
  lista.push(usuario);
  guardarJson(CLAVES.usuariosExtra, lista);
  return usuario;
}

/**
 * Valida usuario y contraseña. Devuelve la sesión o lanza un Error con el motivo
 * (se muestra tal cual en la pantalla de login).
 * NOTA: en producción esta validación debe hacerla el back-end, nunca el navegador.
 */
export async function autenticar(nombreUsuario, clave) {
  const buscado = nombreUsuario.trim().toLowerCase();
  const usuario = cargarLista().find(
    (u) => u.usuario.toLowerCase() === buscado || (u.correo && u.correo.toLowerCase() === buscado),
  );
  if (!usuario || usuario.clave !== clave) {
    throw new Error('Usuario o contraseña incorrectos.');
  }
  if (usuario.estado !== 'Activo') {
    throw new Error('Tu usuario está inactivo. Contacta a la administración.');
  }
  return crearSesion(usuario);
}

/** Acceso rápido de demostración: entra con la cuenta de ejemplo del rol. */
export async function autenticarDemo(rol) {
  const nombreUsuario = USUARIO_DEMO_POR_ROL[rol];
  const usuario = cargarLista().find((u) => u.usuario === nombreUsuario);
  if (!usuario) throw new Error('No existe la cuenta de demostración.');
  return crearSesion(usuario);
}

/** Texto del rol que se muestra bajo el nombre en el encabezado. */
export function etiquetaRol(usuario) {
  if (usuario.etiqueta) return usuario.etiqueta;
  if (usuario.rol === 'porteria') return 'Guarda — ' + usuario.detalle.split('· ')[1];
  if (usuario.rol === 'residente') return 'Residente — ' + usuario.detalle.split(' · ')[0];
  return 'Administrador';
}

/** Construye el objeto de sesión que guarda el SesionContext. */
function crearSesion(usuario) {
  return {
    usuario: usuario.usuario,
    nombre: usuario.nombre,
    rol: usuario.rol,
    etiqueta: etiquetaRol(usuario),
    iniciales: iniciales(usuario.nombre),
  };
}

/** Registro del conjunto: crea el administrador maestro y lo agrega a los usuarios. */
export async function registrarConjunto(datos) {
  const maestro = {
    nombre: datos.nombre || 'Administrador',
    cedula: datos.cedula,
    direccion: datos.direccion,
    telefono: datos.telefono,
    correo: datos.correo,
    conjunto: datos.conjunto || 'Conjunto residencial',
    matricula: datos.matricula,
    radicado: datos.radicado,
    acto: datos.acto,
    certificadoLegal: datos.certificadoLegal,
    imagenCedula: datos.imagenCedula,
    usuario: datos.usuario,
    esMaestro: true,
  };
  // No se guarda la contraseña en el registro del conjunto; solo en el usuario.
  guardarJson(CLAVES.administradorMaestro, maestro);
  const lista = cargarLista();
  const nuevo = {
    nombre: maestro.nombre,
    detalle: 'Administración · Administrador (maestro)',
    estado: 'Activo',
    usuario: datos.usuario,
    rol: 'admin',
    etiqueta: 'Administrador (maestro)',
    clave: datos.clave,
    esMaestro: true,
  };
  lista.push(nuevo);
  guardarJson(CLAVES.usuariosExtra, lista);
  return crearSesion(nuevo);
}

/** Indica si el conjunto ya fue registrado (solo se permite un registro). */
export function conjuntoYaRegistrado() {
  return leerJson(CLAVES.administradorMaestro, null) !== null;
}
