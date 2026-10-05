// Funciones puras sobre el tablero de espacios (sin efectos secundarios).
// Al ser puras son fáciles de probar y se reutilizan en Portería y Administrador.

/** Identificador visible de un espacio. Ej.: zona "A", índice 4 -> "A-05". */
export function idEspacio(zonaId, indice) {
  return `${zonaId}-${String(indice + 1).padStart(2, '0')}`;
}

/** Separa "A-05" en { zonaId: "A", indice: 4 }. */
export function separarIdEspacio(espacioId) {
  const [zonaId, numero] = espacioId.split('-');
  return { zonaId, indice: parseInt(numero, 10) - 1 };
}

/** Primer espacio disponible recorriendo las zonas en orden (asignación automática). */
export function siguienteDisponible(zonas) {
  for (const zona of zonas) {
    const indice = zona.estados.indexOf('Disponible');
    if (indice !== -1) {
      return { espacioId: idEspacio(zona.id, indice), nombreZona: zona.nombre };
    }
  }
  return null;
}

/** Lista de espacios disponibles agrupados por zona (para la asignación manual). */
export function disponiblesPorZona(zonas) {
  return zonas
    .map((zona) => ({
      zona: zona.nombre,
      espacios: zona.estados
        .map((estado, i) => (estado === 'Disponible' ? idEspacio(zona.id, i) : null))
        .filter(Boolean),
    }))
    .filter((grupo) => grupo.espacios.length > 0);
}

/** Cuenta cuántos espacios hay en cada estado dentro de una zona. */
export function contarEstados(zona) {
  const conteo = { Disponible: 0, Ocupado: 0, Reservado: 0 };
  zona.estados.forEach((estado) => (conteo[estado] += 1));
  return conteo;
}

/** Indica si un vehículo es visitante (por marca explícita o por placa "VIS..."). */
export function esVisitante(vehiculo) {
  return vehiculo.esVisitante ?? vehiculo.placa.startsWith('VIS');
}

/** Minutos de permanencia: real si hay hora de entrada, o el dato de demostración. */
export function minutosPermanencia(vehiculo, ahora = Date.now()) {
  if (vehiculo.entradaMs) {
    return Math.max(1, Math.round((ahora - vehiculo.entradaMs) / 60000));
  }
  return vehiculo.minutos ?? 0;
}

/**
 * Valor a cobrar a un visitante: se cobra por fracciones de 30 minutos
 * (misma regla del prototipo: ceil(minutos / 30) * tarifa de fracción).
 */
export function calcularCobro(minutos, tarifaFraccion) {
  return Math.ceil(minutos / 30) * tarifaFraccion;
}
