// Formulario con los datos generales del conjunto.
import { useState } from 'react';

export default function PanelConfiguracion({ configuracion, onGuardar }) {
  const [valores, setValores] = useState(configuracion);
  const [guardado, setGuardado] = useState(false);

  const cambiar = (campo) => (evento) => {
    setValores({ ...valores, [campo]: evento.target.value });
    setGuardado(false);
  };

  const guardar = async () => {
    await onGuardar(valores);
    setGuardado(true);
  };

  return (
    <div className="card" style={{ maxWidth: 480 }}>
      <div style={{ marginBottom: 14 }}>
        <label htmlFor="cfg-nombre">Nombre del conjunto</label>
        <input id="cfg-nombre" value={valores.nombre} onChange={cambiar('nombre')} />
      </div>
      <div style={{ marginBottom: 14 }}>
        <label htmlFor="cfg-direccion">Dirección</label>
        <input id="cfg-direccion" value={valores.direccion} onChange={cambiar('direccion')} />
      </div>
      <div className="grid2" style={{ marginBottom: 14 }}>
        <div>
          <label htmlFor="cfg-moneda">Moneda</label>
          <input id="cfg-moneda" value={valores.moneda} onChange={cambiar('moneda')} />
        </div>
        <div>
          <label htmlFor="cfg-tarifa">Tarifa visitante/hora</label>
          <input id="cfg-tarifa" value={valores.tarifaVisitanteHora} onChange={cambiar('tarifaVisitanteHora')} />
        </div>
      </div>
      <button className="btn btn-full" onClick={guardar}>
        Guardar cambios
      </button>
      {guardado && <div className="msg-ok">Configuración guardada.</div>}
    </div>
  );
}
