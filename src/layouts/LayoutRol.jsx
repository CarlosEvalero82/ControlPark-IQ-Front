// Diseño común de los tres roles: menú lateral + encabezado + contenido (Outlet).
// Si la sección actual fue desactivada en Permisos, redirige a la primera permitida.
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSesion } from '../contexto/SesionContext';
import { usePermisos } from '../contexto/PermisosContext';
import EncabezadoPantalla from './EncabezadoPantalla';
import MenuLateral from './MenuLateral';
import { NOMBRE_ROL, SECCIONES, seccionesPermitidas } from './secciones';

export default function LayoutRol({ rol }) {
  const { usuario, cerrarSesion } = useSesion();
  const { permisos } = usePermisos();
  const ubicacion = useLocation();
  const navegar = useNavigate();

  const permitidas = seccionesPermitidas(rol, permisos);
  const rutaActual = ubicacion.pathname.split('/')[2];
  const seccionActual = SECCIONES[rol].find((s) => s.ruta === rutaActual);

  const salir = () => {
    cerrarSesion();
    navegar('/login');
  };

  // Sin sección en la URL, o sección sin permiso: ir a la primera permitida.
  if (!seccionActual || !permitidas.includes(seccionActual)) {
    if (permitidas.length > 0) return <Navigate to={`/${rol}/${permitidas[0].ruta}`} replace />;
  }

  return (
    <div className="app">
      <MenuLateral rol={rol} nombreRol={NOMBRE_ROL[rol]} secciones={permitidas} onCerrarSesion={salir} />
      <div className="main">
        <EncabezadoPantalla
          titulo={seccionActual?.titulo ?? NOMBRE_ROL[rol]}
          nombre={usuario.nombre}
          etiqueta={usuario.etiqueta}
          iniciales={usuario.iniciales}
        />
        <main className="content">
          {permitidas.length === 0 ? (
            <div className="info-box">El administrador no ha habilitado ninguna sección para tu rol.</div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
}
