// Leyenda de colores del tablero de espacios.
import { ESTILO_ESTADO } from '../servicios/datosDemo';

export default function LeyendaEstados() {
  return (
    <div className="legend">
      {Object.entries(ESTILO_ESTADO).map(([estado, color]) => (
        <div className="item" key={estado}>
          <span className="sw" style={{ background: color.fondo, border: `1px solid ${color.borde}` }}></span>
          {estado}
        </div>
      ))}
    </div>
  );
}
