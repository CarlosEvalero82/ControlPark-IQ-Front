// RES-03 · Historial de pagos de mensualidad.
import InsigniaEstado from '../../componentes/InsigniaEstado';
import TablaDatos from '../../componentes/TablaDatos';
import { listarPagos } from '../../servicios/residentes';
import { formatoCOP } from '../../utilidades/formato';
import { useCargar } from '../../utilidades/useCargar';

const COLUMNAS = [
  { clave: 'periodo', titulo: 'Periodo', estilo: { fontWeight: 600 } },
  { clave: 'monto', titulo: 'Monto', render: (p) => formatoCOP(p.monto) },
  { clave: 'fecha', titulo: 'Fecha', estilo: { color: 'var(--gray-700)' } },
  { clave: 'estado', titulo: 'Estado', render: (p) => <InsigniaEstado estado={p.estado} /> },
];

export default function PaginaHistorialPagos() {
  const { datos: pagos } = useCargar(listarPagos);
  return <TablaDatos columnas={COLUMNAS} filas={pagos} claveFila={(p) => p.periodo} anchoMax={640} />;
}
