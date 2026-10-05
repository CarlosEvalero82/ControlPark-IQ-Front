// POR-03 · Espacios disponibles: tablero por zonas con detalle al pulsar un espacio.
import { useState } from 'react';
import LeyendaEstados from '../../componentes/LeyendaEstados';
import ModalEspacio from '../../componentes/ModalEspacio';
import TableroEspacios from '../../componentes/TableroEspacios';
import { useParqueadero } from '../../contexto/ParqueaderoContext';

export default function PaginaEspacios() {
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
