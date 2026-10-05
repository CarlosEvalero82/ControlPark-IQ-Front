// Arma las filas de movimientos del día (vehículos dentro + salidas ya registradas).
import { MOVIMIENTOS_FINALIZADOS } from '../servicios/datosDemo';

/** Lista de movimientos con el mismo formato para la tabla y para la exportación. */
export function listarMovimientos(vehiculos) {
  const dentro = vehiculos.map((v) => ({
    placa: v.placa,
    unidad: v.unidad,
    tipo: v.tipo,
    entrada: v.entrada,
    salida: '—',
    estado: 'En parqueadero',
  }));
  return [...dentro, ...MOVIMIENTOS_FINALIZADOS];
}

/** Filas (con encabezado) para exportar a CSV o PDF. */
export function filasMovimientos(vehiculos) {
  return [
    ['Placa', 'Unidad / Visitante', 'Tipo', 'Entrada', 'Salida', 'Estado'],
    ...listarMovimientos(vehiculos).map((m) => [m.placa, m.unidad, m.tipo, m.entrada, m.salida, m.estado]),
  ];
}
