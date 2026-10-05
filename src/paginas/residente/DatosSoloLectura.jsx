// Tarjeta "Mis datos": campos deshabilitados (el residente no los edita).
import Icono from '../../componentes/Icono';

export default function DatosSoloLectura({ campos }) {
  return (
    <div className="card" style={{ maxWidth: 460 }}>
      <div className="card-header">
        <Icono nombre="persona" tamano={18} color="#0072B2" />
        <h3>Mis datos</h3>
      </div>
      {campos.map(({ etiqueta, valor }) => (
        <div style={{ marginBottom: 14 }} key={etiqueta}>
          <label>{etiqueta}</label>
          <input value={valor} disabled readOnly aria-label={etiqueta} />
        </div>
      ))}
      <div className="info-box">
        <span>Tus datos son de solo lectura. Para modificarlos, envía una solicitud a administración.</span>
      </div>
    </div>
  );
}
