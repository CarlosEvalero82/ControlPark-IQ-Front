// Solicitud a administración por correo. El residente no puede editar sus datos ni
// sus vehículos: la regla del proyecto es pedirlo por correo (mailto prellenado).
import { useState } from 'react';
import { CORREO_ADMINISTRACION } from '../servicios/datosDemo';
import { construirMailto } from '../utilidades/correo';

/**
 * Con `conTexto` muestra un cuadro para escribir el detalle (perfil); sin él
 * solo un botón (vehículos). `cuerpo(texto)` arma el mensaje del correo.
 */
export default function SolicitudCambio({
  asunto,
  cuerpo,
  conTexto = false,
  textoBoton,
  placeholder = '',
  etiqueta = '',
  mensajeExito = '',
}) {
  const [texto, setTexto] = useState('');
  const [enviado, setEnviado] = useState(false);

  const enviar = () => {
    if (conTexto && !texto.trim()) return;
    window.location.href = construirMailto(CORREO_ADMINISTRACION, asunto, cuerpo(texto.trim()));
    setEnviado(true);
  };

  return (
    <>
      {conTexto && (
        <div style={{ marginBottom: 14 }}>
          <label htmlFor="solicitud-texto">{etiqueta}</label>
          <textarea
            id="solicitud-texto"
            rows={4}
            value={texto}
            placeholder={placeholder}
            onChange={(evento) => setTexto(evento.target.value)}
          />
        </div>
      )}
      <button className={conTexto ? 'btn btn-full' : 'btn-outline'} style={conTexto ? undefined : { flex: 'none' }} onClick={enviar}>
        {textoBoton}
      </button>
      {enviado && mensajeExito && <div className="msg-ok">{mensajeExito}</div>}
    </>
  );
}
