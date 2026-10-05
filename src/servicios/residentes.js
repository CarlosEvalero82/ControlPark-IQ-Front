// Servicio con los datos del panel del residente (notificaciones y pagos).
import { HISTORIAL_PAGOS, NOTIFICACIONES } from './datosDemo';

export async function listarNotificaciones() {
  return NOTIFICACIONES;
}

export async function listarPagos() {
  return HISTORIAL_PAGOS;
}
