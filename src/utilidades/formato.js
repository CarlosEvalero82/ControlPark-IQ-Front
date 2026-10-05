// Utilidades de formato (moneda, iniciales, texto) usadas en varias pantallas.

/** Convierte un número en pesos colombianos. Ej.: 6000 -> "$6.000". */
export function formatoCOP(valor) {
  return '$' + Number(valor || 0).toLocaleString('es-CO');
}

/** Extrae solo los dígitos de un texto de dinero. Ej.: "$150.000" -> 150000. */
export function aNumero(texto) {
  return parseInt(String(texto).replace(/[^0-9]/g, ''), 10) || 0;
}

/** Devuelve las iniciales (máx. 2) de un nombre. Ej.: "María Torres" -> "MT". */
export function iniciales(nombre) {
  return String(nombre || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((palabra) => palabra[0].toUpperCase())
    .join('');
}

/** Hora actual en formato local colombiano (HH:MM). */
export function horaActual() {
  return new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
}

/** Convierte minutos en texto legible. Ej.: 95 -> "1h 35min". */
export function textoDuracion(minutos) {
  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;
  return (horas > 0 ? `${horas}h ` : '') + `${resto}min`;
}
