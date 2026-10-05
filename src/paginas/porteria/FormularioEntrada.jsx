// Formulario de registro de entrada (POR-01): pestaña residente/visitante, datos del
// vehículo y asignación de espacio automática (siguiente libre) o manual.
import { useEffect, useState } from 'react';
import Icono from '../../componentes/Icono';
import { horaActual } from '../../utilidades/formato';

const TIPOS_VEHICULO = ['Automóvil', 'Motocicleta', 'Camioneta'];
const FORMULARIO_VACIO = { unidad: '', placa: '', conductor: '', tipo: TIPOS_VEHICULO[0] };

// espaciosLibres: { siguiente: {espacioId, nombreZona} | null, porZona: [{zona, espacios[]}] }
export default function FormularioEntrada({ espaciosLibres, onConfirmar }) {
  const [pestana, setPestana] = useState('Residente');
  const [campos, setCampos] = useState(FORMULARIO_VACIO);
  const [modo, setModo] = useState('auto');
  const [espacioManual, setEspacioManual] = useState('');
  const [mensaje, setMensaje] = useState({ texto: '', tipo: 'ok' });

  const { siguiente, porZona } = espaciosLibres;
  const visitante = pestana === 'Visitante';

  // El espacio manual elegido solo vale si sigue disponible; si no, el primero de la lista.
  const todos = porZona.flatMap((grupo) => grupo.espacios);
  const espacioManualValido = todos.includes(espacioManual) ? espacioManual : (todos[0] ?? '');

  // El mensaje de confirmación desaparece solo a los 2,5 segundos.
  useEffect(() => {
    if (!mensaje.texto) return undefined;
    const temporizador = setTimeout(() => setMensaje({ texto: '', tipo: 'ok' }), 2500);
    return () => clearTimeout(temporizador);
  }, [mensaje]);

  const cambiar = (campo) => (evento) => setCampos((previo) => ({ ...previo, [campo]: evento.target.value }));

  const confirmar = () => {
    const espacioId = modo === 'manual' ? espacioManualValido : siguiente?.espacioId;
    if (!espacioId) {
      setMensaje({
        texto: modo === 'manual' ? 'Selecciona un espacio disponible.' : 'No hay espacios disponibles en este momento.',
        tipo: 'error',
      });
      return;
    }
    const unidad = campos.unidad.trim() || 'N/D';
    onConfirmar({
      placa: campos.placa.trim().toUpperCase() || 'NEW' + Math.floor(100 + Math.random() * 900),
      unidad: visitante ? `Visita a ${unidad}` : unidad,
      tipo: campos.tipo,
      espacioId,
      entrada: horaActual(),
      conductor: campos.conductor.trim() || 'N/D',
      identificacion: 'C.C. N/D',
      esVisitante: visitante,
      entradaMs: Date.now(),
    });
    setMensaje({ texto: `Entrada registrada en el espacio ${espacioId}.`, tipo: 'ok' });
    setCampos(FORMULARIO_VACIO);
  };

  return (
    <>
      <div className="tabs" role="tablist">
        {['Residente', 'Visitante'].map((nombre) => (
          <button
            key={nombre}
            role="tab"
            aria-selected={pestana === nombre}
            className={`tab${pestana === nombre ? ' active' : ''}`}
            onClick={() => setPestana(nombre)}
          >
            {nombre}
          </button>
        ))}
      </div>
      <div className="card" style={{ maxWidth: 640 }}>
        <div className="card-header">
          <Icono nombre="entrada" tamano={18} color="#0072B2" />
          <h3>Datos del ingreso</h3>
        </div>
        <div className="field-group">
          <div style={{ marginBottom: 14 }}>
            <label htmlFor="entrada-unidad">{visitante ? 'Visita a (Torre - Apto)' : 'Unidad (Torre - Apto)'}</label>
            <input id="entrada-unidad" value={campos.unidad} onChange={cambiar('unidad')} placeholder="Torre 2 - Apto 302" />
          </div>
          <div className="grid2">
            <div>
              <label htmlFor="entrada-placa">Placa</label>
              <input id="entrada-placa" className="upper" value={campos.placa} onChange={cambiar('placa')} placeholder="ABC123" />
            </div>
            <div>
              <label htmlFor="entrada-conductor">Conductor</label>
              <input id="entrada-conductor" value={campos.conductor} onChange={cambiar('conductor')} placeholder="Nombre completo" />
            </div>
          </div>
        </div>
        <div className="field-group">
          <label htmlFor="entrada-tipo">Tipo de vehículo</label>
          <select id="entrada-tipo" value={campos.tipo} onChange={cambiar('tipo')}>
            {TIPOS_VEHICULO.map((tipo) => (
              <option key={tipo}>{tipo}</option>
            ))}
          </select>
        </div>
        <div className="field-group">
          <label>Asignación de espacio</label>
          <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
            {[
              ['auto', 'Automática'],
              ['manual', 'Manual'],
            ].map(([valor, texto]) => (
              <label key={valor} style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 400, fontSize: 13.5, cursor: 'pointer' }}>
                <input type="radio" name="modo-asignacion" style={{ width: 'auto' }} checked={modo === valor} onChange={() => setModo(valor)} />
                {texto}
              </label>
            ))}
          </div>
        </div>
        {modo === 'auto' ? (
          <div className="info-box">
            <Icono nombre="info" tamano={16} />
            <span>
              Espacio asignado automáticamente:{' '}
              <strong>{siguiente ? `${siguiente.espacioId} (${siguiente.nombreZona})` : 'Sin espacios disponibles'}</strong>
            </span>
          </div>
        ) : (
          <div className="field-group">
            <label htmlFor="entrada-espacio">Elegir espacio disponible</label>
            <select id="entrada-espacio" value={espacioManualValido} onChange={(e) => setEspacioManual(e.target.value)}>
              {porZona.length === 0 && <option value="">Sin espacios disponibles</option>}
              {porZona.map((grupo) => (
                <optgroup key={grupo.zona} label={grupo.zona}>
                  {grupo.espacios.map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        )}
        <button className="btn btn-full" style={{ marginTop: 14 }} onClick={confirmar}>
          Confirmar entrada
        </button>
        {mensaje.texto && (
          <div className={mensaje.tipo === 'ok' ? 'msg-ok' : 'msg-warn'} role="status">
            {mensaje.texto}
          </div>
        )}
      </div>
    </>
  );
}
