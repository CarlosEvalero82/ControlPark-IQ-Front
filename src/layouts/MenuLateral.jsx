// Menú lateral: logo, secciones permitidas y botón de cerrar sesión.
import { NavLink } from 'react-router-dom';
import Icono from '../componentes/Icono';

export default function MenuLateral({ rol, nombreRol, secciones, onCerrarSesion }) {
  return (
    <aside className="sidebar">
      <div className="brand-row">
        <div className="brand-ic">
          <img src="/favicon.png" alt="ControlPark-IQ" />
        </div>
        <div>
          <div className="brand-name">ControlPark-IQ</div>
          <div className="role-line">{nombreRol}</div>
        </div>
      </div>
      <nav aria-label="Secciones">
        {secciones.map((seccion) => (
          <NavLink key={seccion.ruta} to={`/${rol}/${seccion.ruta}`}>
            <Icono nombre={seccion.icono} />
            {seccion.titulo}
          </NavLink>
        ))}
      </nav>
      <button className="logout" onClick={onCerrarSesion}>
        Cerrar sesión
      </button>
    </aside>
  );
}
