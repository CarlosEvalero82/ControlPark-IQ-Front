// Formulario de pago de la mensualidad: elige método y confirma.
import { useState } from 'react';
import { formatoCOP } from '../../utilidades/formato';

const METODOS = [
  { id: 'pse', nombre: 'PSE' },
  { id: 'efectivo', nombre: 'Efectivo en portería' },
];

export default function FormularioPago({ pago }) {
  const [metodo, setMetodo] = useState('pse');
  const [pagado, setPagado] = useState(false);

  return (
    <div className="card" style={{ maxWidth: 460 }}>
      <div className="lbl" style={{ fontSize: 12, color: 'var(--gray-700)', marginBottom: 6 }}>
        Monto a pagar
      </div>
      <div className="val" style={{ fontSize: 34 }}>
        {formatoCOP(pago.monto)}
      </div>
      <div className="sub" style={{ color: 'var(--warn)', fontSize: 13, margin: '4px 0 16px' }}>
        {pago.fecha.replace('Vence ', 'Vence el ')}
      </div>
      <label>Método de pago</label>
      {METODOS.map(({ id, nombre }) => {
        const activo = metodo === id;
        return (
          <div
            key={id}
            className="method"
            role="radio"
            aria-checked={activo}
            tabIndex={0}
            style={{
              borderColor: activo ? 'var(--blue)' : 'var(--gray-300)',
              background: activo ? 'var(--blue-bg)' : 'transparent',
              color: activo ? 'var(--blue-dark)' : 'var(--gray-900)',
            }}
            onClick={() => setMetodo(id)}
            onKeyDown={(evento) => (evento.key === 'Enter' || evento.key === ' ') && setMetodo(id)}
          >
            <span className="radio" style={{ borderColor: activo ? 'var(--blue)' : 'var(--gray-300)' }}>
              <span className="fill" style={{ background: activo ? 'var(--blue)' : 'transparent' }}></span>
            </span>
            {nombre}
          </div>
        );
      })}
      <button className="btn btn-full" style={{ marginTop: 6 }} onClick={() => setPagado(true)}>
        Pagar ahora
      </button>
      {pagado && <div className="msg-ok">Pago registrado correctamente.</div>}
    </div>
  );
}
