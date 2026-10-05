// Pruebas del reductor del parqueadero (entradas, salidas y cambio de capacidad).
import { describe, expect, it } from 'vitest';
import { reductorParqueadero } from '../contexto/ParqueaderoContext';

const inicial = () => ({
  zonas: [{ id: 'A', nombre: 'Zona A', estados: ['Disponible', 'Ocupado', 'Disponible'] }],
  vehiculos: [{ placa: 'AAA111', espacioId: 'A-02' }],
});

describe('reductorParqueadero', () => {
  it('registra una entrada: ocupa el espacio y agrega el vehículo', () => {
    const nuevo = reductorParqueadero(inicial(), {
      tipo: 'REGISTRAR_ENTRADA',
      vehiculo: { placa: 'BBB222', espacioId: 'A-01' },
    });
    expect(nuevo.zonas[0].estados[0]).toBe('Ocupado');
    expect(nuevo.vehiculos).toHaveLength(2);
  });

  it('registra una salida: libera el espacio y quita el vehículo', () => {
    const nuevo = reductorParqueadero(inicial(), { tipo: 'REGISTRAR_SALIDA', placa: 'AAA111' });
    expect(nuevo.zonas[0].estados[1]).toBe('Disponible');
    expect(nuevo.vehiculos).toHaveLength(0);
  });

  it('ignora la salida de una placa que no está', () => {
    const estado = inicial();
    expect(reductorParqueadero(estado, { tipo: 'REGISTRAR_SALIDA', placa: 'ZZZ999' })).toBe(estado);
  });

  it('amplía la capacidad con espacios disponibles', () => {
    const nuevo = reductorParqueadero(inicial(), { tipo: 'CAMBIAR_CAPACIDAD', zonaId: 'A', cantidad: 5 });
    expect(nuevo.zonas[0].estados).toHaveLength(5);
    expect(nuevo.zonas[0].estados[4]).toBe('Disponible');
  });

  it('reduce la capacidad y retira los vehículos de los espacios eliminados', () => {
    const nuevo = reductorParqueadero(inicial(), { tipo: 'CAMBIAR_CAPACIDAD', zonaId: 'A', cantidad: 1 });
    expect(nuevo.zonas[0].estados).toHaveLength(1);
    expect(nuevo.vehiculos).toHaveLength(0);
  });
});
