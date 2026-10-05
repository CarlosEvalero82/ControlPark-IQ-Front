// Funciones puras con datos derivados del residente (sin acceso a localStorage).

/** Primer pago pendiente de la lista (el "próximo pago"), o undefined si está al día. */
export function proximoPago(pagos) {
  return pagos.find((pago) => pago.estado === 'Pendiente');
}

/** Unidad del residente. El detalle viene como "Torre 2 - Apto 302 · Residente". */
export function unidadDeUsuario(usuario) {
  return usuario?.detalle?.split(' · ')[0] ?? '—';
}
