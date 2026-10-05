// Lista de casillas de permisos de un rol (tarjeta de la pantalla Permisos).
import Icono from '../../componentes/Icono';

export default function MatrizPermisos({ titulo, icono, etiquetas, valores, onCambiar }) {
  return (
    <div className="card">
      <div className="card-header">
        <Icono nombre={icono} tamano={18} color="#0072B2" />
        <h3>{titulo}</h3>
      </div>
      <div>
        {Object.entries(etiquetas).map(([clave, texto]) => (
          <label className="perm-item" key={clave}>
            <input type="checkbox" checked={Boolean(valores[clave])} onChange={(e) => onCambiar(clave, e.target.checked)} />
            {texto}
          </label>
        ))}
      </div>
    </div>
  );
}
