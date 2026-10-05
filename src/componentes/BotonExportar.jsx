// Botón que descarga una tabla como CSV (Excel) o abre la versión imprimible (PDF).
import { exportarCsv, imprimirTabla } from '../utilidades/exportar';

export default function BotonExportar({ etiqueta, filas, nombreArchivo, formato = 'csv', titulo = '', clase = 'btn-outline' }) {
  const alHacerClic = () => {
    // `filas` puede ser una función para calcular los datos justo al hacer clic.
    const datos = typeof filas === 'function' ? filas() : filas;
    if (formato === 'pdf') imprimirTabla(titulo, datos);
    else exportarCsv(datos, nombreArchivo);
  };
  return (
    <button className={clase} onClick={alHacerClic}>
      {etiqueta}
    </button>
  );
}
