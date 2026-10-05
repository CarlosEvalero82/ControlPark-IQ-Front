// Contexto de sesión: quién inició sesión y con qué rol.
// Reemplaza goLogin()/controlpark_current_session del prototipo.
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CLAVES, guardarJson, leerJson } from '../servicios/almacenamiento';

const SesionContext = createContext(null);

export function SesionProvider({ children }) {
  // La sesión se recupera al recargar la página.
  const [usuario, setUsuario] = useState(() => leerJson(CLAVES.sesion, null));

  const iniciarSesion = useCallback((sesion) => {
    guardarJson(CLAVES.sesion, sesion);
    setUsuario(sesion);
  }, []);

  const cerrarSesion = useCallback(() => {
    localStorage.removeItem(CLAVES.sesion);
    setUsuario(null);
  }, []);

  const valor = useMemo(() => ({ usuario, iniciarSesion, cerrarSesion }), [usuario, iniciarSesion, cerrarSesion]);
  return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>;
}

/** Hook para leer la sesión desde cualquier componente. */
export function useSesion() {
  const contexto = useContext(SesionContext);
  if (!contexto) throw new Error('useSesion debe usarse dentro de <SesionProvider>');
  return contexto;
}
