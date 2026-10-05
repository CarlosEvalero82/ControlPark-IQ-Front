// Lista de textos con fecha: actividad reciente (con punto) o notificaciones (con campana).
import Icono from './Icono';

export default function ListaItems({ items, variante = 'actividad', vacio = 'Sin elementos.' }) {
  if (items.length === 0) return <p style={{ color: 'var(--gray-700)' }}>{vacio}</p>;

  return (
    <div className={variante === 'actividad' ? 'activity-list' : 'notif-list'}>
      {items.map((item) =>
        variante === 'actividad' ? (
          <div className="activity-row" key={item.texto}>
            <span className="dot"></span>
            <div>
              <div>{item.texto}</div>
              <div className="date">{item.fecha}</div>
            </div>
          </div>
        ) : (
          <div className="notif-row" key={item.texto}>
            <span style={{ marginTop: 2, display: 'flex' }}>
              <Icono nombre="campana" tamano={18} color="#0072B2" />
            </span>
            <div>
              <div style={{ fontSize: 13.5 }}>{item.texto}</div>
              <div style={{ fontSize: 11.5, color: 'var(--gray-700)', marginTop: 3 }}>{item.fecha}</div>
            </div>
          </div>
        ),
      )}
    </div>
  );
}
