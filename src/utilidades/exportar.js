// Exportación de tablas: CSV (se abre en Excel) y ventana imprimible (PDF).

/** Convierte una matriz de filas en texto CSV, escapando las comillas. */
export function aCsv(filas) {
  return filas
    .map((fila) => fila.map((celda) => '"' + String(celda).replace(/"/g, '""') + '"').join(','))
    .join('\r\n');
}

/** Descarga un contenido de texto como archivo en el navegador. */
export function descargarArchivo(contenido, nombreArchivo, tipoMime) {
  const blob = new Blob([contenido], { type: tipoMime });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = nombreArchivo;
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
  URL.revokeObjectURL(url);
}

/** Descarga las filas como CSV con BOM para que Excel respete las tildes. */
export function exportarCsv(filas, nombreArchivo) {
  descargarArchivo('﻿' + aCsv(filas), nombreArchivo, 'text/csv;charset=utf-8;');
}

/** Escapa texto para insertarlo de forma segura dentro de HTML. */
function escaparHtml(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Abre una ventana con la tabla lista para imprimir o guardar como PDF. */
export function imprimirTabla(titulo, filas) {
  const ventana = window.open('', '_blank');
  if (!ventana) return; // el navegador bloqueó la ventana emergente
  const [encabezado, ...cuerpo] = filas;
  let html =
    `<html><head><title>${escaparHtml(titulo)}</title><style>` +
    'body{font-family:Arial,sans-serif;padding:24px;color:#1d1f24;} h1{font-size:18px;margin:0 0 4px;} ' +
    'table{width:100%;border-collapse:collapse;margin-top:14px;} ' +
    'th,td{border:1px solid #ccc;padding:8px;font-size:12px;text-align:left;} th{background:#1F2937;color:#fff;}' +
    `</style></head><body><h1>ControlPark-IQ — ${escaparHtml(titulo)}</h1>` +
    `<p>Fecha: ${new Date().toLocaleDateString('es-CO')}</p><table><thead><tr>`;
  encabezado.forEach((celda) => (html += `<th>${escaparHtml(celda)}</th>`));
  html += '</tr></thead><tbody>';
  cuerpo.forEach((fila) => {
    html += '<tr>' + fila.map((celda) => `<td>${escaparHtml(celda)}</td>`).join('') + '</tr>';
  });
  html += '</tbody></table></body></html>';
  ventana.document.write(html);
  ventana.document.close();
  ventana.focus();
  ventana.print();
}
