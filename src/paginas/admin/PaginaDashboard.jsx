// ADM-01 · Dashboard: cifras generales y ocupación por zona.
import TarjetaResumen from '../../componentes/TarjetaResumen';
import { useParqueadero } from '../../contexto/ParqueaderoContext';
import { FECHA_HOY_DEMO } from '../../servicios/datosDemo';
import { listarFacturas } from '../../servicios/administracion';
import { formatoCOP } from '../../utilidades/formato';
import { contarEstados, esVisitante } from '../../utilidades/parqueadero';
import { useCargar } from '../../utilidades/useCargar';
import GraficoOcupacionZonas from './GraficoOcupacionZonas';

export default function PaginaDashboard() {
  const { zonas, vehiculos } = useParqueadero();
  const { datos: facturas } = useCargar(listarFacturas);

  const totalEspacios = zonas.reduce((suma, z) => suma + z.estados.length, 0);
  const ocupados = zonas.reduce((suma, z) => suma + contarEstados(z).Ocupado, 0);
  const porcentaje = totalEspacios ? Math.round((ocupados / totalEspacios) * 100) : 0;
  const ingresosHoy = facturas.filter((f) => f.fecha === FECHA_HOY_DEMO).reduce((suma, f) => suma + f.valor, 0);

  return (
    <>
      <div className="stat-grid cols4">
        <TarjetaResumen etiqueta="Ocupación total" valor={`${porcentaje}%`} />
        <TarjetaResumen etiqueta="Ingresos por visitantes hoy" valor={formatoCOP(ingresosHoy)} compacto />
        <TarjetaResumen etiqueta="Vehículos activos" valor={vehiculos.length} />
        <TarjetaResumen etiqueta="Visitantes del día" valor={vehiculos.filter(esVisitante).length} />
      </div>
      <div className="card">
        <h3 style={{ margin: '0 0 18px' }}>Ocupación por zona</h3>
        <GraficoOcupacionZonas zonas={zonas} />
      </div>
    </>
  );
}
