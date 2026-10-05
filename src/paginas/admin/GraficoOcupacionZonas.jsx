// Gráfico de barras: porcentaje de ocupación de cada zona.
import { contarEstados } from '../../utilidades/parqueadero';

export default function GraficoOcupacionZonas({ zonas }) {
  return (
    <div className="zone-chart">
      {zonas.map((zona) => {
        const ocupados = contarEstados(zona).Ocupado;
        const total = zona.estados.length;
        const porcentaje = total ? Math.round((ocupados / total) * 100) : 0;
        return (
          <div className="zone-bar-wrap" key={zona.id}>
            <div className="sub" style={{ color: 'var(--gray-700)' }}>
              {ocupados}/{total}
            </div>
            <div className="zone-bar-track" role="img" aria-label={`${zona.nombre}: ${porcentaje}% ocupado`}>
              <div className="zone-bar-fill" style={{ height: `${porcentaje}%` }}></div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{zona.nombre}</div>
          </div>
        );
      })}
    </div>
  );
}
