// ADM-04 · Zonas y espacios: capacidad real del tablero y cupos por tipo de vehículo.
import { useState } from 'react';
import EditorFilas from '../../componentes/EditorFilas';
import Icono from '../../componentes/Icono';
import { useParqueadero } from '../../contexto/ParqueaderoContext';
import { cargarCupos, guardarCupos } from '../../servicios/administracion';
import { contarEstados } from '../../utilidades/parqueadero';
import { useCargar } from '../../utilidades/useCargar';

const TIPOS_CUPO = [
  { clave: 'automovil', etiqueta: 'Automóvil' },
  { clave: 'motocicleta', etiqueta: 'Motocicleta' },
  { clave: 'camioneta', etiqueta: 'Camioneta' },
];

export default function PaginaZonas() {
  const { zonas, despachar } = useParqueadero();
  const { datos: cupos, cargando } = useCargar(cargarCupos, null);
  const [borrador, setBorrador] = useState({});
  const [guardado, setGuardado] = useState(false);

  const filas = zonas.map((zona) => {
    const conteo = contarEstados(zona);
    return { id: zona.id, nombre: zona.nombre, capacidad: zona.estados.length, ...conteo };
  });

  const columnas = [
    { clave: 'nombre', titulo: 'Zona', estilo: { fontWeight: 600 } },
    { clave: 'capacidad', titulo: 'Capacidad', editable: true, tipo: 'number', ancho: 80 },
    { clave: 'Disponible', titulo: 'Disponibles', estilo: { color: 'var(--green)' } },
    { clave: 'Ocupado', titulo: 'Ocupados', estilo: { color: 'var(--danger)' } },
    { clave: 'Reservado', titulo: 'Reservados', estilo: { color: 'var(--warn)' } },
  ];

  const guardarCapacidad = (fila, valores) => {
    const cantidad = parseInt(valores.capacidad, 10);
    if (Number.isNaN(cantidad) || cantidad < 0) return;
    despachar({ tipo: 'CAMBIAR_CAPACIDAD', zonaId: fila.id, cantidad });
  };

  const valorCupo = (clave) => borrador[clave] ?? cupos?.[clave] ?? 0;

  const guardarTodosLosCupos = async () => {
    const nuevos = {};
    TIPOS_CUPO.forEach(({ clave }) => (nuevos[clave] = parseInt(valorCupo(clave), 10) || 0));
    await guardarCupos(nuevos);
    setGuardado(true);
  };

  return (
    <>
      <div className="info-box" style={{ marginBottom: 14, maxWidth: 720 }}>
        <span>
          Cambia la &quot;Capacidad&quot; de una zona y guarda para agregar o quitar espacios reales del tablero. Si
          reduces por debajo de los espacios ocupados actuales, esos vehículos se retiran del sistema.
        </span>
      </div>
      <EditorFilas columnas={columnas} filas={filas} claveFila={(f) => f.id} onGuardar={guardarCapacidad} anchoMax={820} />

      <div className="card" style={{ maxWidth: 520 }}>
        <div className="card-header">
          <Icono nombre="vehiculo" tamano={18} color="#0072B2" />
          <h3>Cupos por tipo de vehículo</h3>
        </div>
        <p style={{ fontSize: 13, color: 'var(--gray-700)', margin: '-6px 0 16px' }}>
          Meta de referencia de cuántos espacios del total se destinan a cada tipo de vehículo (informativo — no
          reduce ni amplía el tablero).
        </p>
        {!cargando && (
          <div className="grid2" style={{ marginBottom: 16 }}>
            {TIPOS_CUPO.map(({ clave, etiqueta }) => (
              <div key={clave}>
                <label htmlFor={`cupo-${clave}`}>{etiqueta}</label>
                <input
                  id={`cupo-${clave}`}
                  type="number"
                  min="0"
                  value={valorCupo(clave)}
                  onChange={(e) => {
                    setBorrador({ ...borrador, [clave]: e.target.value });
                    setGuardado(false);
                  }}
                />
              </div>
            ))}
          </div>
        )}
        <button className="btn btn-full" onClick={guardarTodosLosCupos}>
          Guardar cupos
        </button>
        {guardado && <div className="msg-ok">Cupos actualizados correctamente.</div>}
      </div>
    </>
  );
}
