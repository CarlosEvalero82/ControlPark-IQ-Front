// ADM-03 · Permisos: define qué secciones ve cada rol. Al guardar, el menú de
// Portería y Residente cambia al instante gracias al PermisosContext.
import { useState } from 'react';
import { usePermisos } from '../../contexto/PermisosContext';
import { ETIQUETAS_PERMISO } from '../../servicios/datosDemo';
import MatrizPermisos from './MatrizPermisos';

export default function PaginaPermisos() {
  const { permisos, guardarPermisos } = usePermisos();
  const [borrador, setBorrador] = useState(permisos);
  const [guardado, setGuardado] = useState(false);

  const cambiar = (rol) => (clave, valor) => {
    setBorrador({ ...borrador, [rol]: { ...borrador[rol], [clave]: valor } });
    setGuardado(false);
  };

  const guardar = () => {
    guardarPermisos(borrador);
    setGuardado(true);
  };

  return (
    <>
      <div className="info-box" style={{ marginBottom: 18, maxWidth: 820 }}>
        <span>
          Controla qué secciones puede ver o usar cada rol. Los cambios se guardan de inmediato para Portería y
          Residente.
        </span>
      </div>
      <div className="grid2" style={{ alignItems: 'start', maxWidth: 820 }}>
        <MatrizPermisos
          titulo="Portería / Guarda"
          icono="entrada"
          etiquetas={ETIQUETAS_PERMISO.porteria}
          valores={borrador.porteria}
          onCambiar={cambiar('porteria')}
        />
        <MatrizPermisos
          titulo="Residente"
          icono="persona"
          etiquetas={ETIQUETAS_PERMISO.residente}
          valores={borrador.residente}
          onCambiar={cambiar('residente')}
        />
      </div>
      <button className="btn" style={{ marginTop: 18, maxWidth: 240 }} onClick={guardar}>
        Guardar permisos
      </button>
      {guardado && <div className="msg-ok">Permisos actualizados correctamente.</div>}
    </>
  );
}
