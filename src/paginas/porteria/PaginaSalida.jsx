// POR-02 · Registro de salida: lista de vehículos dentro, buscador y exportación.
import { useState } from 'react';
import BotonExportar from '../../componentes/BotonExportar';
import TablaDatos from '../../componentes/TablaDatos';
import { useParqueadero } from '../../contexto/ParqueaderoContext';
import { tarifaFraccionVisitante } from '../../servicios/tarifas';
import { filasMovimientos } from '../../utilidades/movimientos';
import ModalSalida from './ModalSalida';

const COLUMNAS = [
  { clave: 'placa', titulo: 'Placa', estilo: { fontWeight: 600 } },
  { clave: 'unidad', titulo: 'Unidad / Visitante' },
  { clave: 'tipo', titulo: 'Tipo' },
  { clave: 'espacioId', titulo: 'Espacio' },
  { clave: 'entrada', titulo: 'Ingreso', estilo: { color: 'var(--gray-700)' } },
];

export default function PaginaSalida() {
  const { vehiculos, despachar } = useParqueadero();
  const [seleccionado, setSeleccionado] = useState(null);

  const confirmarSalida = (placa) => {
    despachar({ tipo: 'REGISTRAR_SALIDA', placa });
    setSeleccionado(null);
  };

  return (
    <>
      <TablaDatos
        columnas={COLUMNAS}
        filas={vehiculos}
        claveFila={(v) => v.placa}
        buscable
        placeholder="Buscar por placa o unidad..."
        barra={
          <div className="acciones">
            <BotonExportar etiqueta="Exportar a Excel" filas={() => filasMovimientos(vehiculos)} nombreArchivo="movimientos_diarios_ControlPark-IQ.csv" />
            <BotonExportar etiqueta="Exportar a PDF" formato="pdf" titulo="Movimientos diarios" filas={() => filasMovimientos(vehiculos)} />
          </div>
        }
        acciones={(v) => (
          <button className="btn-outline-danger" onClick={() => setSeleccionado(v)}>
            Registrar salida
          </button>
        )}
      />
      <ModalSalida
        vehiculo={seleccionado}
        tarifaFraccion={tarifaFraccionVisitante()}
        onConfirmar={confirmarSalida}
        onCerrar={() => setSeleccionado(null)}
      />
    </>
  );
}
