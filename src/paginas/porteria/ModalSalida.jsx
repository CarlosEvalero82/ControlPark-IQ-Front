// Ventana de confirmación de salida: muestra el resumen y, si es visitante, el valor a pagar.
import Modal from '../../componentes/Modal';
import { calcularCobro, esVisitante, minutosPermanencia } from '../../utilidades/parqueadero';
import { formatoCOP, horaActual, textoDuracion } from '../../utilidades/formato';

function Fila({ etiqueta, valor, color, total = false }) {
  return (
    <div className={`exit-row${total ? ' total' : ''}`}>
      <span>{etiqueta}</span>
      <strong style={color ? { color } : undefined}>{valor}</strong>
    </div>
  );
}

export default function ModalSalida({ vehiculo, tarifaFraccion, onConfirmar, onCerrar }) {
  if (!vehiculo) return null;
  const visitante = esVisitante(vehiculo);
  const minutos = minutosPermanencia(vehiculo);

  return (
    <Modal abierto titulo="Registrar salida" onCerrar={onCerrar}>
      <Fila etiqueta="Placa" valor={vehiculo.placa} />
      <Fila etiqueta="Hora de entrada" valor={vehiculo.entrada} />
      <Fila etiqueta="Hora de salida" valor={horaActual()} />
      {visitante ? (
        <>
          <Fila etiqueta="Tipo" valor="Visitante" color="var(--warn)" />
          <Fila etiqueta="Visita a" valor={vehiculo.unidad.replace(/^Visita a /, '')} />
        </>
      ) : (
        <>
          <Fila etiqueta="Tipo" valor="Residente" color="var(--green)" />
          <Fila etiqueta="Unidad" valor={vehiculo.unidad} />
        </>
      )}
      <Fila etiqueta="Conductor" valor={vehiculo.conductor} />
      <Fila etiqueta="Identificación" valor={vehiculo.identificacion} />
      {visitante && (
        <>
          <Fila etiqueta="Tiempo de permanencia" valor={textoDuracion(minutos)} />
          <Fila etiqueta="Valor a pagar" valor={formatoCOP(calcularCobro(minutos, tarifaFraccion))} color="var(--blue)" total />
        </>
      )}
      <button className="btn btn-full" style={{ marginTop: 16 }} onClick={() => onConfirmar(vehiculo.placa)}>
        Confirmar salida
      </button>
    </Modal>
  );
}
