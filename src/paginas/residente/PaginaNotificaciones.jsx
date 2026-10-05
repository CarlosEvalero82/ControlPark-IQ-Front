// RES-05 · Notificaciones del residente.
import ListaItems from '../../componentes/ListaItems';
import { listarNotificaciones } from '../../servicios/residentes';
import { useCargar } from '../../utilidades/useCargar';

export default function PaginaNotificaciones() {
  const { datos } = useCargar(listarNotificaciones);
  return <ListaItems items={datos} variante="notificacion" vacio="No tienes notificaciones." />;
}
