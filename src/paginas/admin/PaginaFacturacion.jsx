// ADM-06 · Facturación de visitantes: resumen, búsqueda y descarga en Excel.
import BotonExportar from '../../componentes/BotonExportar';
import InsigniaEstado from '../../componentes/InsigniaEstado';
import TablaDatos from '../../componentes/TablaDatos';
import TarjetaResumen from '../../componentes/TarjetaResumen';
import { listarFacturas } from '../../servicios/administracion';
import { formatoCOP } from '../../utilidades/formato';
import { useCargar } from '../../utilidades/useCargar';

const COLUMNAS = [
  { clave: 'id', titulo: 'Factura', estilo: { fontWeight: 600 } },
  { clave: 'placa', titulo: 'Placa' },
  { clave: 'tipo', titulo: 'Tipo de vehículo', estilo: { color: 'var(--gray-700)' } },
  { clave: 'fecha', titulo: 'Fecha', estilo: { color: 'var(--gray-700)' } },
  { clave: 'permanencia', titulo: 'Tiempo de permanencia', estilo: { color: 'var(--gray-700)' } },
  { clave: 'valor', titulo: 'Valor cobrado', estilo: { fontWeight: 600 }, render: (f) => formatoCOP(f.valor) },
  { clave: 'estado', titulo: 'Estado', render: () => <InsigniaEstado estado="Facturado" /> },
];

/** Filas para el archivo de Excel: encabezado + una fila por factura. */
function filasParaExcel(facturas) {
  return [
    COLUMNAS.map((c) => c.titulo),
    ...facturas.map((f) => [f.id, f.placa, f.tipo, f.fecha, f.permanencia, formatoCOP(f.valor), 'Facturado']),
  ];
}

export default function PaginaFacturacion() {
  const { datos: facturas } = useCargar(listarFacturas);
  const total = facturas.reduce((suma, f) => suma + f.valor, 0);
  const promedio = facturas.length ? Math.round(total / facturas.length) : 0;

  return (
    <>
      <div className="stat-grid cols3">
        <TarjetaResumen etiqueta="Facturas del día" valor={facturas.length} />
        <TarjetaResumen etiqueta="Total recaudado" valor={formatoCOP(total)} compacto />
        <TarjetaResumen etiqueta="Valor promedio por factura" valor={formatoCOP(promedio)} compacto />
      </div>
      <TablaDatos
        columnas={COLUMNAS}
        filas={facturas.map((f) => ({ ...f, estado: 'Facturado' }))}
        claveFila={(f) => f.id}
        buscable
        placeholder="Buscar por factura, placa, tipo o fecha..."
        barra={
          <BotonExportar
            etiqueta="Descargar en Excel"
            filas={() => filasParaExcel(facturas)}
            nombreArchivo="facturacion_visitantes_ControlPark-IQ.csv"
          />
        }
      />
    </>
  );
}
