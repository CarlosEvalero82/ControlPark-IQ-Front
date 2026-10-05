// RES-01 · Inicio del residente: resumen de cuenta y actividad reciente.
import ListaItems from '../../componentes/ListaItems';
import TarjetaResumen from '../../componentes/TarjetaResumen';
import { useSesion } from '../../contexto/SesionContext';
import { listarNotificaciones, listarPagos } from '../../servicios/residentes';
import { obtenerUsuario } from '../../servicios/usuarios';
import { formatoCOP } from '../../utilidades/formato';
import { proximoPago } from '../../utilidades/residente';
import { useCargar } from '../../utilidades/useCargar';

const OBTENER_PAGOS = listarPagos;
const OBTENER_NOTIFICACIONES = listarNotificaciones;

export default function PaginaInicio() {
  const { usuario } = useSesion();
  const { datos: pagos } = useCargar(OBTENER_PAGOS);
  const { datos: notificaciones } = useCargar(OBTENER_NOTIFICACIONES);
  const { datos: perfil } = useCargar(() => obtenerUsuario(usuario.usuario), null);
  const pendiente = proximoPago(pagos);

  return (
    <>
      <div className="stat-grid cols3">
        <TarjetaResumen etiqueta="Vehículos registrados" valor={perfil?.vehiculos?.length ?? 0} />
        <TarjetaResumen
          etiqueta="Próximo pago"
          valor={pendiente ? formatoCOP(pendiente.monto) : 'Al día'}
          detalle={pendiente?.fecha}
        />
        <TarjetaResumen etiqueta="Espacio asignado" valor={perfil?.espacio ?? '—'} />
      </div>
      <h3>Actividad reciente</h3>
      <ListaItems items={notificaciones.slice(0, 4)} variante="actividad" />
    </>
  );
}
