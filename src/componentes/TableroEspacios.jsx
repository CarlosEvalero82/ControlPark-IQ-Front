// Tablero de espacios por zona. Reemplaza renderZones() de Portería y Administrador.
import { ESTILO_ESTADO } from '../servicios/datosDemo';
import { contarEstados, idEspacio } from '../utilidades/parqueadero';

export default function TableroEspacios({ zonas, onSeleccionar }) {
  return (
    <div>
      {zonas.map((zona) => {
        const { Disponible } = contarEstados(zona);
        return (
          <div className="zone-block" key={zona.id}>
            <h3>{zona.nombre}</h3>
            <span className="summary">
              {Disponible} de {zona.estados.length} disponibles
            </span>
            <div className="zone-grid">
              {zona.estados.map((estado, i) => {
                const id = idEspacio(zona.id, i);
                const color = ESTILO_ESTADO[estado];
                return (
                  <button
                    key={id}
                    className="spot"
                    title={`${id} · ${estado}`}
                    style={{ background: color.fondo, borderColor: color.borde, color: color.texto }}
                    onClick={() => onSeleccionar(id, estado)}
                  >
                    {id}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
