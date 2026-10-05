// POR-01 · Registro de entrada.
import FormularioEntrada from './FormularioEntrada';
import { useParqueadero } from '../../contexto/ParqueaderoContext';
import { disponiblesPorZona, siguienteDisponible } from '../../utilidades/parqueadero';

export default function PaginaEntrada() {
  const { zonas, despachar } = useParqueadero();
  const espaciosLibres = { siguiente: siguienteDisponible(zonas), porZona: disponiblesPorZona(zonas) };

  return (
    <FormularioEntrada
      espaciosLibres={espaciosLibres}
      onConfirmar={(vehiculo) => despachar({ tipo: 'REGISTRAR_ENTRADA', vehiculo })}
    />
  );
}
