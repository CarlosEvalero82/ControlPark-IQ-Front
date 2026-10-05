// Etiqueta de color para un estado. Centraliza la paleta accesible del proyecto.
import { ESTILO_ESTADO } from '../servicios/datosDemo';

const GRIS = { fondo: '#eef0f3', texto: '#6b6f76' };

// Cada estado reutiliza el color de Disponible, Ocupado o Reservado.
const COLORES = {
  Disponible: ESTILO_ESTADO.Disponible,
  Ocupado: ESTILO_ESTADO.Ocupado,
  Reservado: ESTILO_ESTADO.Reservado,
  Activo: ESTILO_ESTADO.Disponible,
  Inactivo: ESTILO_ESTADO.Ocupado,
  Pagado: ESTILO_ESTADO.Disponible,
  Facturado: ESTILO_ESTADO.Disponible,
  Pendiente: ESTILO_ESTADO.Reservado,
  Finalizado: GRIS,
  'En parqueadero': { fondo: '#eef0f3', texto: '#555' },
};

export default function InsigniaEstado({ estado }) {
  const color = COLORES[estado] ?? GRIS;
  return (
    <span className="badge" style={{ background: color.fondo, color: color.texto }}>
      {estado}
    </span>
  );
}
