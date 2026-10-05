// Detalle de un espacio: disponible, reservado u ocupado (con datos del vehículo).
import Modal from './Modal';
import { esVisitante } from '../utilidades/parqueadero';

function Fila({ etiqueta, valor, color }) {
  return (
    <div className="exit-row">
      <span>{etiqueta}</span>
      <strong style={color ? { color } : undefined}>{valor}</strong>
    </div>
  );
}

function Nota({ texto }) {
  return <p style={{ fontSize: 13, color: 'var(--gray-700)', marginTop: 10 }}>{texto}</p>;
}

// espacio: { id, estado } | null — vehiculo: el vehículo que ocupa el espacio, si existe.
export default function ModalEspacio({ espacio, vehiculo, onCerrar }) {
  if (!espacio) return null;
  const visitante = vehiculo ? esVisitante(vehiculo) : false;

  return (
    <Modal abierto titulo="Detalle del espacio" onCerrar={onCerrar}>
      <Fila etiqueta="Espacio" valor={espacio.id} />
      {vehiculo ? (
        <>
          <Fila etiqueta="Estado" valor="Ocupado" color="var(--danger)" />
          <Fila etiqueta="Placa" valor={vehiculo.placa} />
          <Fila etiqueta="Ocupado por" valor={visitante ? 'Visitante' : 'Residente'} />
          <Fila etiqueta={visitante ? 'Visita a' : 'Unidad'} valor={vehiculo.unidad} />
          <Fila etiqueta="Conductor" valor={vehiculo.conductor} />
          <Fila etiqueta="Identificación" valor={vehiculo.identificacion} />
          <Fila etiqueta="Hora de ingreso" valor={vehiculo.entrada} />
        </>
      ) : espacio.estado === 'Reservado' ? (
        <>
          <Fila etiqueta="Estado" valor="Reservado" color="var(--warn)" />
          <Nota texto="Espacio reservado, aún sin vehículo registrado." />
        </>
      ) : espacio.estado === 'Ocupado' ? (
        <>
          <Fila etiqueta="Estado" valor="Ocupado" color="var(--danger)" />
          <Nota texto="Sin información adicional para este espacio." />
        </>
      ) : (
        <>
          <Fila etiqueta="Estado" valor="Disponible" color="var(--green)" />
          <Nota texto="Este espacio no tiene ningún vehículo asignado actualmente." />
        </>
      )}
    </Modal>
  );
}
