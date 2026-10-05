// Contexto del parqueadero: tablero de espacios y vehículos activos.
// Portería ocupa/libera espacios y el Administrador los ve al instante, sin
// pasar por localStorage entre pantallas (reemplaza saveZoneStatus y similares).
import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { cargarParqueadero, guardarParqueadero } from '../servicios/parqueadero';
import { separarIdEspacio } from '../utilidades/parqueadero';

const ParqueaderoContext = createContext(null);

/** Cambia el estado de un espacio dentro de una copia de las zonas. */
function conEspacio(zonas, espacioId, estado) {
  const { zonaId, indice } = separarIdEspacio(espacioId);
  return zonas.map((zona) =>
    zona.id === zonaId
      ? { ...zona, estados: zona.estados.map((e, i) => (i === indice ? estado : e)) }
      : zona,
  );
}

/** Reductor: cada acción describe un cambio del parqueadero. */
export function reductorParqueadero(estado, accion) {
  switch (accion.tipo) {
    case 'REGISTRAR_ENTRADA':
      return {
        zonas: conEspacio(estado.zonas, accion.vehiculo.espacioId, 'Ocupado'),
        vehiculos: [...estado.vehiculos, accion.vehiculo],
      };
    case 'REGISTRAR_SALIDA': {
      const vehiculo = estado.vehiculos.find((v) => v.placa === accion.placa);
      if (!vehiculo) return estado;
      return {
        zonas: conEspacio(estado.zonas, vehiculo.espacioId, 'Disponible'),
        vehiculos: estado.vehiculos.filter((v) => v.placa !== accion.placa),
      };
    }
    case 'CAMBIAR_CAPACIDAD': {
      // Agrega espacios libres o recorta la zona (los vehículos de los espacios
      // eliminados salen del sistema, como advierte la pantalla Zonas y espacios).
      const zonas = estado.zonas.map((zona) => {
        if (zona.id !== accion.zonaId) return zona;
        const estados =
          accion.cantidad > zona.estados.length
            ? [...zona.estados, ...Array(accion.cantidad - zona.estados.length).fill('Disponible')]
            : zona.estados.slice(0, accion.cantidad);
        return { ...zona, estados };
      });
      const vehiculos = estado.vehiculos.filter((v) => {
        const { zonaId, indice } = separarIdEspacio(v.espacioId);
        return zonaId !== accion.zonaId || indice < accion.cantidad;
      });
      return { zonas, vehiculos };
    }
    default:
      return estado;
  }
}

export function ParqueaderoProvider({ children }) {
  const [estado, despachar] = useReducer(reductorParqueadero, undefined, cargarParqueadero);

  // Cada cambio se guarda para que sobreviva a recargar la página.
  useEffect(() => {
    guardarParqueadero(estado);
  }, [estado]);

  const valor = useMemo(() => ({ ...estado, despachar }), [estado]);
  return <ParqueaderoContext.Provider value={valor}>{children}</ParqueaderoContext.Provider>;
}

export function useParqueadero() {
  const contexto = useContext(ParqueaderoContext);
  if (!contexto) throw new Error('useParqueadero debe usarse dentro de <ParqueaderoProvider>');
  return contexto;
}
