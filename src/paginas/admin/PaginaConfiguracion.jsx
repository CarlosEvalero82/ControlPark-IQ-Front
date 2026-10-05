// ADM-08 · Configuración general del conjunto.
import { cargarConfiguracion, guardarConfiguracion } from '../../servicios/administracion';
import { useCargar } from '../../utilidades/useCargar';
import PanelConfiguracion from './PanelConfiguracion';

export default function PaginaConfiguracion() {
  const { datos: configuracion, cargando } = useCargar(cargarConfiguracion, null);
  // Se espera a tener los datos para que el formulario arranque con ellos.
  if (cargando) return null;
  return <PanelConfiguracion configuracion={configuracion} onGuardar={guardarConfiguracion} />;
}
