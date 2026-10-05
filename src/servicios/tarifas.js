// Servicio de tarifas.
import { CLAVES, guardarJson, leerJson } from './almacenamiento';
import { CONCEPTO_FRACCION, TARIFAS_INICIALES } from './datosDemo';

export function cargarTarifas() {
  return leerJson(CLAVES.tarifas, TARIFAS_INICIALES);
}

export async function listarTarifas() {
  return cargarTarifas();
}

export async function guardarTarifas(lista) {
  guardarJson(CLAVES.tarifas, lista);
}

/** Valor de la fracción de 30 minutos que se cobra a los visitantes. */
export function tarifaFraccionVisitante() {
  const tarifa = cargarTarifas().find((t) => t.concepto === CONCEPTO_FRACCION);
  return tarifa ? tarifa.valor : 1500;
}
