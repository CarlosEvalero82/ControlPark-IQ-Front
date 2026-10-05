// ADM-02 · Usuarios y residentes: buscar, crear, editar y activar/desactivar.
import { useState } from 'react';
import InsigniaEstado from '../../componentes/InsigniaEstado';
import Modal from '../../componentes/Modal';
import TablaDatos from '../../componentes/TablaDatos';
import { guardarUsuarios, listarUsuarios } from '../../servicios/usuarios';
import { useCargar } from '../../utilidades/useCargar';
import FormularioUsuario from './FormularioUsuario';

const COLUMNAS = [
  { clave: 'nombre', titulo: 'Nombre', estilo: { fontWeight: 600 } },
  { clave: 'detalle', titulo: 'Unidad / Rol', estilo: { color: 'var(--gray-700)' } },
  { clave: 'usuario', titulo: 'Usuario', estilo: { color: 'var(--gray-700)' } },
  { clave: 'estado', titulo: 'Estado', render: (u) => <InsigniaEstado estado={u.estado} /> },
];

export default function PaginaUsuarios() {
  const { datos: usuarios, setDatos: setUsuarios } = useCargar(listarUsuarios);
  const [editando, setEditando] = useState(null); // copia del usuario que se edita
  const [agregando, setAgregando] = useState(false);

  // Cambia la lista en pantalla y la guarda en el servicio.
  const actualizar = (nueva) => {
    setUsuarios(nueva);
    guardarUsuarios(nueva);
  };

  const alternarEstado = (usuario) =>
    actualizar(
      usuarios.map((u) =>
        u.usuario === usuario.usuario ? { ...u, estado: u.estado === 'Activo' ? 'Inactivo' : 'Activo' } : u,
      ),
    );

  const guardarEdicion = () => {
    actualizar(
      usuarios.map((u) =>
        u.usuario === editando.usuario
          ? { ...u, nombre: editando.nombre.trim() || u.nombre, detalle: editando.detalle.trim() || u.detalle, estado: editando.estado }
          : u,
      ),
    );
    setEditando(null);
  };

  const crear = (nuevo) => {
    if (usuarios.some((u) => u.usuario === nuevo.usuario)) {
      window.alert('Ya existe un usuario con ese nombre de usuario.');
      return;
    }
    actualizar([...usuarios, nuevo]);
    setAgregando(false);
  };

  const acciones = (usuario) => (
    <span style={{ whiteSpace: 'nowrap' }}>
      <button className="btn-outline" style={{ marginRight: 6 }} onClick={() => setEditando({ ...usuario })}>
        Editar
      </button>
      <button className="btn-outline" onClick={() => alternarEstado(usuario)}>
        {usuario.estado === 'Activo' ? 'Desactivar' : 'Activar'}
      </button>
    </span>
  );

  return (
    <>
      <TablaDatos
        columnas={COLUMNAS}
        filas={usuarios}
        claveFila={(u) => u.usuario}
        buscable
        placeholder="Buscar por nombre, unidad, rol o usuario..."
        barra={
          <button className="btn" onClick={() => setAgregando(true)}>
            + Agregar usuario
          </button>
        }
        acciones={acciones}
      />

      <Modal abierto={editando !== null} titulo="Editar usuario" onCerrar={() => setEditando(null)}>
        {editando && (
          <>
            <div className="field" style={{ marginBottom: 12 }}>
              <label htmlFor="eu-nombre">Nombre completo</label>
              <input id="eu-nombre" value={editando.nombre} onChange={(e) => setEditando({ ...editando, nombre: e.target.value })} />
            </div>
            <div className="field" style={{ marginBottom: 12 }}>
              <label htmlFor="eu-detalle">Unidad / Rol</label>
              <input id="eu-detalle" value={editando.detalle} onChange={(e) => setEditando({ ...editando, detalle: e.target.value })} />
            </div>
            <div className="field" style={{ marginBottom: 16 }}>
              <label htmlFor="eu-estado">Estado</label>
              <select id="eu-estado" value={editando.estado} onChange={(e) => setEditando({ ...editando, estado: e.target.value })}>
                <option>Activo</option>
                <option>Inactivo</option>
              </select>
            </div>
            <button className="btn btn-full" onClick={guardarEdicion}>
              Guardar cambios
            </button>
          </>
        )}
      </Modal>

      <Modal abierto={agregando} titulo="Agregar usuario" onCerrar={() => setAgregando(false)}>
        <FormularioUsuario onCrear={crear} />
      </Modal>
    </>
  );
}
