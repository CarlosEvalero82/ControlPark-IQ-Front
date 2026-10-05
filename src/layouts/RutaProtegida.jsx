// Protege las rutas de un rol: sin sesión, o con otro rol, vuelve al login.
import { Navigate } from 'react-router-dom';
import { useSesion } from '../contexto/SesionContext';

export default function RutaProtegida({ rolPermitido, children }) {
  const { usuario } = useSesion();
  if (!usuario || usuario.rol !== rolPermitido) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
