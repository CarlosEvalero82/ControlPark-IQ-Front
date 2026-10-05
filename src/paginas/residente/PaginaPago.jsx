// RES-02 · Pago de mensualidad.
import { listarPagos } from '../../servicios/residentes';
import { proximoPago } from '../../utilidades/residente';
import { useCargar } from '../../utilidades/useCargar';
import FormularioPago from './FormularioPago';

export default function PaginaPago() {
  const { datos: pagos, cargando } = useCargar(listarPagos);
  const pendiente = proximoPago(pagos);

  if (cargando) return null;
  if (!pendiente) return <div className="info-box">No tienes pagos pendientes. ¡Estás al día!</div>;
  return <FormularioPago pago={pendiente} />;
}
