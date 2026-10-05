// RES-04 · Mis vehículos. Solo lectura salvo que el administrador active
// el permiso "vehiculos_editar"; entonces se pueden agregar o quitar.
import { useCallback, useState } from 'react';
import SolicitudCambio from '../../componentes/SolicitudCambio';
import TablaDatos from '../../componentes/TablaDatos';
import { usePermisos } from '../../contexto/PermisosContext';
import { useSesion } from '../../contexto/SesionContext';
import { guardarUsuarios, listarUsuarios } from '../../servicios/usuarios';
import { useCargar } from '../../utilidades/useCargar';

const TIPOS = ['Automóvil', 'Motocicleta', 'Camioneta'];

export default function PaginaVehiculos() {
  const { usuario } = useSesion();
  const { permisos } = usePermisos();
  const puedeEditar = permisos.residente.vehiculos_editar;
  const { datos: usuarios, recargar } = useCargar(listarUsuarios);
  const yo = usuarios.find((u) => u.usuario === usuario.usuario);
  const vehiculos = yo?.vehiculos ?? [];

  const [placa, setPlaca] = useState('');
  const [tipo, setTipo] = useState(TIPOS[0]);

  // Guarda la nueva lista de vehículos del residente y vuelve a cargar.
  const guardarVehiculos = useCallback(
    async (nuevos) => {
      await guardarUsuarios(usuarios.map((u) => (u.usuario === usuario.usuario ? { ...u, vehiculos: nuevos } : u)));
      await recargar();
    },
    [usuarios, usuario.usuario, recargar],
  );

  const agregar = () => {
    const texto = placa.trim().toUpperCase();
    if (!texto || vehiculos.some((v) => v.placa === texto)) return;
    guardarVehiculos([...vehiculos, { placa: texto, tipo, color: 'N/D' }]);
    setPlaca('');
  };

  const columnas = [
    { clave: 'placa', titulo: 'Placa', estilo: { fontWeight: 600 } },
    { clave: 'tipo', titulo: 'Tipo' },
    { clave: 'color', titulo: 'Color' },
  ];

  const acciones = (vehiculo) =>
    puedeEditar ? (
      <button className="btn-outline-danger" onClick={() => guardarVehiculos(vehiculos.filter((v) => v.placa !== vehiculo.placa))}>
        Eliminar
      </button>
    ) : (
      <span style={{ fontSize: 12, color: 'var(--gray-700)' }}>Gestionado por administración</span>
    );

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <TablaDatos columnas={columnas} filas={vehiculos} claveFila={(v) => v.placa} acciones={acciones} anchoMax={640} />
      </div>
      {puedeEditar ? (
        <div className="new-row" style={{ maxWidth: 640 }}>
          <div>
            <label htmlFor="veh-placa">Placa</label>
            <input
              id="veh-placa"
              placeholder="XYZ000"
              className="upper"
              style={{ width: 110 }}
              value={placa}
              onChange={(evento) => setPlaca(evento.target.value)}
            />
          </div>
          <div>
            <label htmlFor="veh-tipo">Tipo</label>
            <select id="veh-tipo" value={tipo} onChange={(evento) => setTipo(evento.target.value)}>
              {TIPOS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <button className="btn" style={{ padding: '9px 18px' }} onClick={agregar}>
            Agregar vehículo
          </button>
        </div>
      ) : (
        <div className="info-box" style={{ maxWidth: 640, justifyContent: 'space-between' }}>
          <span>
            La administración del conjunto controla el registro de vehículos. Solicita cualquier cambio por correo.
          </span>
          <SolicitudCambio
            asunto={`Solicitud sobre vehículos registrados — ${usuario.nombre}`}
            cuerpo={() =>
              `Hola administración,\n\nSolicito agregar o dar de baja un vehículo de mi parque automotor registrado en ControlPark-IQ.\n\nDetalle de la solicitud:\n\n\nGracias.\n${usuario.nombre}`
            }
            textoBoton="Solicitar por correo"
          />
        </div>
      )}
    </>
  );
}
