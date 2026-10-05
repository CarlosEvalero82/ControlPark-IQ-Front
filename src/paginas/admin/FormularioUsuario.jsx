// Formulario para crear un usuario (Residente, Portero o Administrador).
// Si es residente también se registran sus vehículos autorizados.
import { useState } from 'react';
import Icono from '../../componentes/Icono';
import { CLAVE_DEMO } from '../../servicios/datosDemo';

const ROLES = { Residente: 'residente', Portero: 'porteria', Administrador: 'admin' };
const TIPOS = ['Automóvil', 'Motocicleta', 'Camioneta'];
const VACIO = { nombre: '', rol: 'Residente', unidad: '', turno: 'Diurno', usuario: '', clave: '' };

/** Arma el objeto usuario con el mismo formato que usa el servicio. */
export function construirUsuario(datos, vehiculos) {
  let detalle = 'Administración · Administrador';
  if (datos.rol === 'Residente') detalle = `${datos.unidad.trim() || 'Sin unidad'} · Residente`;
  if (datos.rol === 'Portero') detalle = `Portería · Guarda turno ${datos.turno.toLowerCase()}`;
  const usuario = {
    nombre: datos.nombre.trim(),
    detalle,
    estado: 'Activo',
    usuario: datos.usuario.trim(),
    rol: ROLES[datos.rol],
    clave: datos.clave,
  };
  if (datos.rol === 'Residente') usuario.vehiculos = vehiculos;
  return usuario;
}

export default function FormularioUsuario({ onCrear }) {
  const [datos, setDatos] = useState(VACIO);
  const [vehiculos, setVehiculos] = useState([]);
  const [vehiculo, setVehiculo] = useState({ placa: '', tipo: TIPOS[0], color: '' });
  const [error, setError] = useState('');

  const cambiar = (campo) => (evento) => setDatos({ ...datos, [campo]: evento.target.value });

  const agregarVehiculo = () => {
    const placa = vehiculo.placa.trim().toUpperCase();
    if (!placa) return;
    setVehiculos([...vehiculos, { placa, tipo: vehiculo.tipo, color: vehiculo.color.trim() || 'N/D' }]);
    setVehiculo({ placa: '', tipo: vehiculo.tipo, color: '' });
  };

  const crear = () => {
    if (!datos.nombre.trim() || !datos.usuario.trim() || !datos.clave) {
      setError('Completa nombre, usuario y contraseña.');
      return;
    }
    setError('');
    onCrear(construirUsuario(datos, vehiculos));
  };

  return (
    <>
      <div className="field" style={{ marginBottom: 12 }}>
        <label htmlFor="nu-nombre">Nombre completo</label>
        <input id="nu-nombre" placeholder="Nombre y apellido" value={datos.nombre} onChange={cambiar('nombre')} />
      </div>
      <div className="field" style={{ marginBottom: 12 }}>
        <label htmlFor="nu-rol">Rol</label>
        <select id="nu-rol" value={datos.rol} onChange={cambiar('rol')}>
          {Object.keys(ROLES).map((rol) => (
            <option key={rol}>{rol}</option>
          ))}
        </select>
      </div>

      {datos.rol === 'Residente' && (
        <div className="field" style={{ marginBottom: 12 }}>
          <label htmlFor="nu-unidad">Unidad (Torre - Apto)</label>
          <input id="nu-unidad" placeholder="Torre 3 - Apto 210" value={datos.unidad} onChange={cambiar('unidad')} />
        </div>
      )}
      {datos.rol === 'Portero' && (
        <div className="field" style={{ marginBottom: 12 }}>
          <label htmlFor="nu-turno">Turno</label>
          <select id="nu-turno" value={datos.turno} onChange={cambiar('turno')}>
            <option>Diurno</option>
            <option>Nocturno</option>
          </select>
        </div>
      )}

      <div className="grid2" style={{ marginBottom: 12 }}>
        <div className="field">
          <label htmlFor="nu-usuario">Usuario</label>
          <input id="nu-usuario" placeholder="nombre.apellido" value={datos.usuario} onChange={cambiar('usuario')} />
        </div>
        <div className="field">
          <label htmlFor="nu-clave">Contraseña</label>
          <input id="nu-clave" type="password" placeholder="••••••••" value={datos.clave} onChange={cambiar('clave')} />
        </div>
      </div>
      <p style={{ fontSize: 12, color: 'var(--gray-700)', margin: '-4px 0 8px' }}>
        Las cuentas de demostración usan la clave {CLAVE_DEMO}.
      </p>

      {datos.rol === 'Residente' && (
        <div>
          <div className="card-header" style={{ margin: '16px -24px 12px' }}>
            <Icono nombre="vehiculo" tamano={16} color="#0072B2" />
            <h3>Vehículos autorizados</h3>
          </div>
          <p style={{ fontSize: 12.5, color: 'var(--gray-700)', margin: '-4px 0 10px' }}>
            Solo los vehículos agregados aquí tendrán permiso para usar las instalaciones.
          </p>
          <div style={{ marginBottom: 10 }}>
            {vehiculos.length === 0 ? (
              <p style={{ fontSize: 12.5, color: 'var(--gray-700)', margin: 0 }}>Aún no has agregado vehículos.</p>
            ) : (
              vehiculos.map((v) => (
                <div className="exit-row" key={v.placa}>
                  <span>
                    {v.placa} — {v.tipo} ({v.color})
                  </span>
                  <button
                    className="link-btn"
                    style={{ color: 'var(--danger)' }}
                    onClick={() => setVehiculos(vehiculos.filter((x) => x.placa !== v.placa))}
                  >
                    Quitar
                  </button>
                </div>
              ))
            )}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 90 }}>
              <label htmlFor="nv-placa" style={{ fontSize: 11.5 }}>Placa</label>
              <input
                id="nv-placa"
                className="upper"
                placeholder="ABC123"
                value={vehiculo.placa}
                onChange={(e) => setVehiculo({ ...vehiculo, placa: e.target.value })}
              />
            </div>
            <div style={{ flex: 1, minWidth: 110 }}>
              <label htmlFor="nv-tipo" style={{ fontSize: 11.5 }}>Tipo</label>
              <select id="nv-tipo" value={vehiculo.tipo} onChange={(e) => setVehiculo({ ...vehiculo, tipo: e.target.value })}>
                {TIPOS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1, minWidth: 90 }}>
              <label htmlFor="nv-color" style={{ fontSize: 11.5 }}>Color</label>
              <input
                id="nv-color"
                placeholder="Gris"
                value={vehiculo.color}
                onChange={(e) => setVehiculo({ ...vehiculo, color: e.target.value })}
              />
            </div>
            <button className="btn-outline" style={{ padding: '9px 14px' }} onClick={agregarVehiculo}>
              Agregar
            </button>
          </div>
        </div>
      )}

      {error && <div className="msg-warn">{error}</div>}
      <button className="btn btn-full" style={{ marginTop: 18 }} onClick={crear}>
        Crear usuario
      </button>
    </>
  );
}
