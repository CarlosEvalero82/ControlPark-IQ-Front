// Resumen de la caja del día: base, cobros realizados y total esperado.
import BotonExportar from '../../componentes/BotonExportar';
import Icono from '../../componentes/Icono';
import { formatoCOP } from '../../utilidades/formato';

export default function CajaDelDia({ baseCaja, cobros }) {
  const total = cobros.reduce((suma, cobro) => suma + cobro.valor, 0);

  // Filas para exportar: cada cobro y el resumen al final.
  const filasCaja = () => [
    ['Placa', 'Hora', 'Valor cobrado'],
    ...cobros.map((c) => [c.placa, c.hora, formatoCOP(c.valor)]),
    ['', 'Base de caja', formatoCOP(baseCaja)],
    ['', 'Total recaudado hoy', formatoCOP(total)],
    ['', 'Total en caja', formatoCOP(baseCaja + total)],
  ];

  return (
    <div className="card" style={{ maxWidth: 520, marginTop: 16 }}>
      <div className="card-header">
        <Icono nombre="recibo" tamano={18} color="#0072B2" />
        <h3>Caja del día</h3>
      </div>
      <div className="exit-row">
        <span>Base de caja</span>
        <strong>{formatoCOP(baseCaja)}</strong>
      </div>
      <div className="exit-row">
        <span>Cobros realizados hoy</span>
        <strong>{cobros.length}</strong>
      </div>
      <div className="exit-row">
        <span>Total recaudado hoy</span>
        <strong>{formatoCOP(total)}</strong>
      </div>
      <div className="exit-row total">
        <span>Total esperado en caja</span>
        <strong style={{ color: 'var(--blue)' }}>{formatoCOP(baseCaja + total)}</strong>
      </div>
      <BotonExportar
        etiqueta="Exportar caja a Excel"
        filas={filasCaja}
        nombreArchivo="caja_dia_ControlPark-IQ.csv"
        clase="btn-outline btn-full"
      />
    </div>
  );
}
