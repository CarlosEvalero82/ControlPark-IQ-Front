// Tabla reutilizable con buscador opcional y columna de acciones.
// columnas: [{ clave, titulo, render?(fila), estilo? }]
import { useState } from 'react';

export default function TablaDatos({
  columnas,
  filas,
  claveFila,
  buscable = false,
  placeholder = 'Buscar...',
  barra = null,
  acciones = null,
  anchoMax,
  vacio = 'Sin registros.',
}) {
  const [texto, setTexto] = useState('');

  // El buscador compara el texto escrito contra el contenido de las columnas.
  const consulta = texto.trim().toUpperCase();
  const visibles = consulta
    ? filas.filter((fila) =>
        columnas
          .map((columna) => String(fila[columna.clave] ?? ''))
          .join(' ')
          .toUpperCase()
          .includes(consulta),
      )
    : filas;

  return (
    <>
      {(buscable || barra) && (
        <div className="toolbar">
          {buscable ? (
            <input
              value={texto}
              onChange={(evento) => setTexto(evento.target.value)}
              placeholder={placeholder}
              aria-label={placeholder}
            />
          ) : (
            <span />
          )}
          {barra}
        </div>
      )}
      <div className="table-card" style={anchoMax ? { maxWidth: anchoMax } : undefined}>
        <table>
          <thead>
            <tr>
              {columnas.map((columna) => (
                <th key={columna.clave}>{columna.titulo}</th>
              ))}
              {acciones && <th></th>}
            </tr>
          </thead>
          <tbody>
            {visibles.map((fila) => (
              <tr key={claveFila(fila)}>
                {columnas.map((columna) => (
                  <td key={columna.clave} style={columna.estilo}>
                    {columna.render ? columna.render(fila) : fila[columna.clave]}
                  </td>
                ))}
                {acciones && <td className="col-num">{acciones(fila)}</td>}
              </tr>
            ))}
            {visibles.length === 0 && (
              <tr>
                <td colSpan={columnas.length + (acciones ? 1 : 0)} style={{ color: 'var(--gray-700)' }}>
                  {vacio}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
