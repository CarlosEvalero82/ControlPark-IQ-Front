// POR-05 · Historial del día: vehículos dentro y salidas ya registradas.
import InsigniaEstado from '../../componentes/InsigniaEstado';
import TablaDatos from '../../componentes/TablaDatos';
import { useParqueadero } from '../../contexto/ParqueaderoContext';
import { listarMovimientos } from '../../utilidades/movimientos';

const COLUMNAS = [
  { clave: 'placa', titulo: 'Placa', estilo: { fontWeight: 600 } },
  { clave: 'unidad', titulo: 'Unidad / Visitante' },
  { clave: 'tipo', titulo: 'Tipo' },
  { clave: 'entrada', titulo: 'Entrada', estilo: { color: 'var(--gray-700)' } },
  { clave: 'salida', titulo: 'Salida', estilo: { color: 'var(--gray-700)' } },
  { clave: 'estado', titulo: 'Estado', render: (fila) => <InsigniaEstado estado={fila.estado} /> },
];

export default function PaginaHistorial() {
  const { vehiculos } = useParqueadero();
  return (
    <TablaDatos
      columnas={COLUMNAS}
      filas={listarMovimientos(vehiculos)}
      claveFila={(m) => `${m.placa}-${m.entrada}-${m.estado}`}
    />
  );
}
