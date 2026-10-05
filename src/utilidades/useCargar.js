// Hook para cargar datos desde un servicio asíncrono.
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Ejecuta `funcion` (un servicio async) al montar el componente y devuelve
 * { datos, cargando, recargar }. `recargar` vuelve a pedir los datos.
 * `funcion` puede ser una flecha en línea: se guarda en una referencia, así
 * cambiar de función entre renders no dispara cargas repetidas.
 */
export function useCargar(funcion, valorInicial = []) {
  const [datos, setDatos] = useState(valorInicial);
  const [cargando, setCargando] = useState(true);
  const ultimaFuncion = useRef(funcion);
  // La referencia se actualiza después de pintar, no durante el render.
  useEffect(() => {
    ultimaFuncion.current = funcion;
  });

  const recargar = useCallback(async () => {
    const resultado = await ultimaFuncion.current();
    setDatos(resultado);
    setCargando(false);
  }, []);

  useEffect(() => {
    let activo = true;
    ultimaFuncion.current().then((resultado) => {
      if (activo) {
        setDatos(resultado);
        setCargando(false);
      }
    });
    return () => {
      activo = false;
    };
  }, []);

  return { datos, setDatos, cargando, recargar };
}
