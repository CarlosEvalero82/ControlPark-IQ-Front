// RES-06 · Mi perfil: datos de solo lectura + solicitud de cambio por correo.
import Icono from '../../componentes/Icono';
import SolicitudCambio from '../../componentes/SolicitudCambio';
import { useSesion } from '../../contexto/SesionContext';
import { obtenerUsuario } from '../../servicios/usuarios';
import { unidadDeUsuario } from '../../utilidades/residente';
import { useCargar } from '../../utilidades/useCargar';
import DatosSoloLectura from './DatosSoloLectura';

export default function PaginaPerfil() {
  const { usuario } = useSesion();
  const { datos: perfil } = useCargar(() => obtenerUsuario(usuario.usuario), null);
  const unidad = unidadDeUsuario(perfil);

  const campos = [
    { etiqueta: 'Nombre completo', valor: usuario.nombre },
    { etiqueta: 'Correo electrónico', valor: perfil?.correo ?? '—' },
    { etiqueta: 'Teléfono', valor: perfil?.telefono ?? '—' },
    { etiqueta: 'Unidad', valor: unidad },
  ];

  return (
    <>
      <DatosSoloLectura campos={campos} />
      <div className="card" style={{ maxWidth: 460, marginTop: 16 }}>
        <div className="card-header">
          <Icono nombre="correo" tamano={18} color="#0072B2" />
          <h3>Solicitar cambio de datos</h3>
        </div>
        <SolicitudCambio
          conTexto
          etiqueta="¿Qué deseas cambiar?"
          placeholder="Ej: Actualizar mi número de teléfono a 300 111 2233"
          asunto={`Solicitud de cambio de datos — ${usuario.nombre} (${unidad})`}
          cuerpo={(texto) =>
            `Hola administración,\n\nSolicito el siguiente cambio en mis datos registrados en ControlPark-IQ:\n\n${texto}\n\nGracias.\n${usuario.nombre}`
          }
          textoBoton="Enviar solicitud por correo"
          mensajeExito="Se abrió tu cliente de correo con la solicitud lista para enviar a administración."
        />
      </div>
    </>
  );
}
