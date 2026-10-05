// ADM-07 · Mapa de ocupación: el mismo tablero de Portería, visto por el administrador.
import { useState } from 'react';
import LeyendaEstados from '../../componentes/LeyendaEstados';
import ModalEspacio from '../../componentes/ModalEspacio';
import TableroEspacios from '../../componentes/TableroEspacios';
import { useParqueadero } from '../../contexto/ParqueaderoContext';

export default function PaginaMapa() {
  const { zonas, vehiculos } = useParqueadero();
  const [espacio, setEspacio] = useState(null);

  return (
    <>
      <LeyendaEstados />
      <TableroEspacios zonas={zonas} onSeleccionar={(id, estado) => setEspacio({ id, estado })} />
      <ModalEspacio
        espacio={espacio}
        vehiculo={espacio ? vehiculos.find((v) => v.espacioId === espacio.id) : undefined}
        onCerrar={() => setEspacio(null)}
      />
    </>
  );
}
