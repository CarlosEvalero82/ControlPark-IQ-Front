// Cobro a visitante: se elige la placa y se calcula el valor por tiempo y tarifa.
// El tiempo y el valor son datos derivados (se calculan), no se guardan en el estado.
import { useState } from 'react';
import { calcularCobro, minutosPermanencia } from '../../utilidades/parqueadero';
import { formatoCOP, textoDuracion } from '../../utilidades/formato';

export default function PanelCobro({ visitantes, tarifaFraccion, onCobrar }) {
  const [placa, setPlaca] = useState('');
  const [cobrado, setCobrado] = useState(false);

  const visitante = visitantes.find((v) => v.placa === placa);
  const minutos = visitante ? minutosPermanencia(visitante) : 0;
  const valor = calcularCobro(minutos, tarifaFraccion);

  const cobrar = () => {
    onCobrar(visitante.placa, valor);
    setPlaca('');
    setCobrado(true);
  };

  return (
    <div className="card" style={{ maxWidth: 520 }}>
      <label htmlFor="cobro-visitante">Visitante activo</label>
      <select
        id="cobro-visitante"
        value={placa}
        onChange={(e) => {
          setPlaca(e.target.value);
          setCobrado(false);
        }}
      >
        <option value="">Selecciona una placa...</option>
        {visitantes.map((v) => (
          <option key={v.placa} value={v.placa}>
            {v.placa} — {v.unidad}
          </option>
        ))}
      </select>

      {visitante && (
        <div style={{ marginTop: 14 }}>
          <div className="caja-resumen">
            <div className="dato-fila">
              <span style={{ color: 'var(--gray-700)' }}>Tiempo transcurrido</span>
              <strong>{textoDuracion(minutos)}</strong>
            </div>
            <div className="dato-fila">
              <span style={{ color: 'var(--gray-700)' }}>Tarifa por fracción (30 min)</span>
              <strong>{formatoCOP(tarifaFraccion)}</strong>
            </div>
            <div className="dato-fila" style={{ fontSize: 16, paddingTop: 8, borderTop: '1px solid #e3e5ea' }}>
              <span>Total a cobrar</span>
              <strong style={{ color: 'var(--blue)' }}>{formatoCOP(valor)}</strong>
            </div>
          </div>
          <button className="btn btn-full" style={{ marginTop: 12 }} onClick={cobrar}>
            Cobrar y generar factura
          </button>
        </div>
      )}
      {cobrado && (
        <div className="msg-ok" role="status">
          Factura generada y cobro registrado en caja.
        </div>
      )}
    </div>
  );
}
