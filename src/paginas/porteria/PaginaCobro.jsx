// POR-04 · Cobro a visitante y caja del día.
import { useState } from 'react';
import { useParqueadero } from '../../contexto/ParqueaderoContext';
import { BASE_CAJA, COBROS_INICIALES } from '../../servicios/datosDemo';
import { tarifaFraccionVisitante } from '../../servicios/tarifas';
import { horaActual } from '../../utilidades/formato';
import { esVisitante } from '../../utilidades/parqueadero';
import CajaDelDia from './CajaDelDia';
import PanelCobro from './PanelCobro';

export default function PaginaCobro() {
  const { vehiculos } = useParqueadero();
  const [cobros, setCobros] = useState(COBROS_INICIALES);

  // Un visitante ya cobrado no vuelve a aparecer en la lista.
  const visitantes = vehiculos.filter((v) => esVisitante(v) && !cobros.some((c) => c.placa === v.placa));

  const registrarCobro = (placa, valor) =>
    setCobros((previo) => [...previo, { placa, hora: horaActual(), valor }]);

  return (
    <>
      <PanelCobro visitantes={visitantes} tarifaFraccion={tarifaFraccionVisitante()} onCobrar={registrarCobro} />
      <CajaDelDia baseCaja={BASE_CAJA} cobros={cobros} />
    </>
  );
}
