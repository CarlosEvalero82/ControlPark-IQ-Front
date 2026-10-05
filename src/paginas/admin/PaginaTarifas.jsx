// ADM-05 · Tarifas: editar valores, eliminar y agregar conceptos.
import { useState } from 'react';
import EditorFilas from '../../componentes/EditorFilas';
import { guardarTarifas, listarTarifas } from '../../servicios/tarifas';
import { useCargar } from '../../utilidades/useCargar';

const COLUMNAS = [
  { clave: 'concepto', titulo: 'Concepto' },
  { clave: 'valor', titulo: 'Valor (COP)', editable: true, tipo: 'number', ancho: 130 },
];

export default function PaginaTarifas() {
  const { datos: tarifas, setDatos: setTarifas } = useCargar(listarTarifas);
  const [concepto, setConcepto] = useState('');
  const [valor, setValor] = useState('');
  const [mensaje, setMensaje] = useState('');

  const actualizar = (nuevas, texto) => {
    setTarifas(nuevas);
    guardarTarifas(nuevas);
    setMensaje(texto);
  };

  const guardarFila = (fila, valores) =>
    actualizar(
      tarifas.map((t) => (t.concepto === fila.concepto ? { ...t, valor: parseInt(valores.valor, 10) || 0 } : t)),
      'Tarifas actualizadas.',
    );

  const eliminar = (fila) =>
    actualizar(
      tarifas.filter((t) => t.concepto !== fila.concepto),
      'Concepto eliminado.',
    );

  const agregar = () => {
    const nombre = concepto.trim();
    const monto = parseInt(valor, 10);
    if (!nombre || Number.isNaN(monto) || tarifas.some((t) => t.concepto === nombre)) return;
    actualizar([...tarifas, { concepto: nombre, valor: monto }], 'Tarifas actualizadas.');
    setConcepto('');
    setValor('');
  };

  return (
    <>
      <EditorFilas columnas={COLUMNAS} filas={tarifas} claveFila={(t) => t.concepto} onGuardar={guardarFila} onEliminar={eliminar} anchoMax={640} />
      <div className="new-row" style={{ maxWidth: 640 }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label htmlFor="nueva-tarifa-concepto">Concepto</label>
          <input id="nueva-tarifa-concepto" placeholder="Nuevo concepto" value={concepto} onChange={(e) => setConcepto(e.target.value)} />
        </div>
        <div>
          <label htmlFor="nueva-tarifa-valor">Valor</label>
          <input id="nueva-tarifa-valor" type="number" min="0" placeholder="0" style={{ width: 110 }} value={valor} onChange={(e) => setValor(e.target.value)} />
        </div>
        <button className="btn" style={{ padding: '9px 18px' }} onClick={agregar}>
          Agregar concepto
        </button>
      </div>
      {mensaje && <div className="msg-ok">{mensaje}</div>}
    </>
  );
}
