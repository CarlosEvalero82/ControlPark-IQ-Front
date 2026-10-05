// Tabla editable: cada fila tiene campos que se modifican y un botón Guardar
// (y opcionalmente Eliminar). Se usa en Zonas y espacios y en Tarifas.
// columnas: [{ clave, titulo, editable?, tipo?, render?(fila), estilo? }]
import { useState } from 'react';

export default function EditorFilas({ columnas, filas, claveFila, onGuardar, onEliminar, anchoMax }) {
  // Valores que el usuario está escribiendo, por fila: { [claveFila]: { [columna]: valor } }
  const [ediciones, setEdiciones] = useState({});

  const valorActual = (fila, columna) => ediciones[claveFila(fila)]?.[columna.clave] ?? fila[columna.clave];

  const cambiar = (fila, columna, valor) => {
    const clave = claveFila(fila);
    setEdiciones((previo) => ({ ...previo, [clave]: { ...previo[clave], [columna.clave]: valor } }));
  };

  const guardar = (fila) => {
    const clave = claveFila(fila);
    onGuardar(fila, { ...fila, ...ediciones[clave] });
    setEdiciones(({ [clave]: _descartada, ...resto }) => resto);
  };

  return (
    <div className="table-card" style={anchoMax ? { maxWidth: anchoMax, marginBottom: 16 } : { marginBottom: 16 }}>
      <table>
        <thead>
          <tr>
            {columnas.map((columna) => (
              <th key={columna.clave}>{columna.titulo}</th>
            ))}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filas.map((fila) => (
            <tr key={claveFila(fila)}>
              {columnas.map((columna) => (
                <td key={columna.clave} style={columna.estilo}>
                  {columna.editable ? (
                    <input
                      type={columna.tipo ?? 'text'}
                      min={columna.tipo === 'number' ? 0 : undefined}
                      value={valorActual(fila, columna)}
                      aria-label={`${columna.titulo} de ${claveFila(fila)}`}
                      style={{ width: columna.ancho ?? 120, padding: '6px 8px', fontSize: 13 }}
                      onChange={(evento) => cambiar(fila, columna, evento.target.value)}
                    />
                  ) : columna.render ? (
                    columna.render(fila)
                  ) : (
                    fila[columna.clave]
                  )}
                </td>
              ))}
              <td className="col-num">
                <button className="btn-outline" style={{ marginRight: onEliminar ? 6 : 0 }} onClick={() => guardar(fila)}>
                  Guardar
                </button>
                {onEliminar && (
                  <button className="btn-outline-danger" onClick={() => onEliminar(fila)}>
                    Eliminar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
