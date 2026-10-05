// Contexto de permisos por rol. El Administrador los cambia y el menú de
// Portería y Residente se actualiza al instante (antes: controlpark_permissions).
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CLAVES, guardarJson, leerJson } from '../servicios/almacenamiento';
import { PERMISOS_POR_DEFECTO } from '../servicios/datosDemo';

const PermisosContext = createContext(null);

/** Mezcla lo guardado con los valores por defecto (por si se agregan permisos nuevos). */
function cargarPermisos() {
  const guardados = leerJson(CLAVES.permisos, {});
  return {
    porteria: { ...PERMISOS_POR_DEFECTO.porteria, ...(guardados.porteria || {}) },
    residente: { ...PERMISOS_POR_DEFECTO.residente, ...(guardados.residente || {}) },
  };
}

export function PermisosProvider({ children }) {
  const [permisos, setPermisos] = useState(cargarPermisos);

  const guardarPermisos = useCallback((nuevos) => {
    guardarJson(CLAVES.permisos, nuevos);
    setPermisos(nuevos);
  }, []);

  const valor = useMemo(() => ({ permisos, guardarPermisos }), [permisos, guardarPermisos]);
  return <PermisosContext.Provider value={valor}>{children}</PermisosContext.Provider>;
}

export function usePermisos() {
  const contexto = useContext(PermisosContext);
  if (!contexto) throw new Error('usePermisos debe usarse dentro de <PermisosProvider>');
  return contexto;
}
