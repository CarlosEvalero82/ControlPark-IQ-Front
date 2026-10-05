// Pruebas de las funciones puras: formato, cálculo de cobro, tablero y exportación.
import { describe, expect, it } from 'vitest';
import { aCsv } from '../utilidades/exportar';
import { aNumero, formatoCOP, iniciales, textoDuracion } from '../utilidades/formato';
import {
  calcularCobro,
  contarEstados,
  disponiblesPorZona,
  esVisitante,
  idEspacio,
  separarIdEspacio,
  siguienteDisponible,
} from '../utilidades/parqueadero';
import { proximoPago, unidadDeUsuario } from '../utilidades/residente';
import { construirParqueadero } from '../servicios/datosDemo';

describe('formato', () => {
  it('da formato de pesos colombianos', () => {
    expect(formatoCOP(150000)).toBe('$150.000');
    expect(formatoCOP(undefined)).toBe('$0');
  });
  it('extrae el número de un texto de dinero', () => {
    expect(aNumero('$150.000')).toBe(150000);
    expect(aNumero('sin número')).toBe(0);
  });
  it('calcula iniciales y duración', () => {
    expect(iniciales('María Torres')).toBe('MT');
    expect(textoDuracion(95)).toBe('1h 35min');
    expect(textoDuracion(40)).toBe('40min');
  });
});

describe('cobro a visitantes', () => {
  it('cobra por fracciones de 30 minutos, redondeando hacia arriba', () => {
    expect(calcularCobro(30, 1500)).toBe(1500);
    expect(calcularCobro(31, 1500)).toBe(3000);
    expect(calcularCobro(95, 1500)).toBe(6000);
  });
});

describe('tablero de espacios', () => {
  const zonas = [
    { id: 'A', nombre: 'Zona A', estados: ['Ocupado', 'Disponible', 'Reservado'] },
    { id: 'B', nombre: 'Zona B', estados: ['Disponible', 'Disponible'] },
  ];
  it('genera y separa identificadores', () => {
    expect(idEspacio('A', 4)).toBe('A-05');
    expect(separarIdEspacio('A-05')).toEqual({ zonaId: 'A', indice: 4 });
  });
  it('asigna el primer espacio disponible', () => {
    expect(siguienteDisponible(zonas)).toEqual({ espacioId: 'A-02', nombreZona: 'Zona A' });
    expect(siguienteDisponible([{ id: 'A', nombre: 'A', estados: ['Ocupado'] }])).toBeNull();
  });
  it('agrupa los disponibles por zona y cuenta estados', () => {
    expect(disponiblesPorZona(zonas)).toEqual([
      { zona: 'Zona A', espacios: ['A-02'] },
      { zona: 'Zona B', espacios: ['B-01', 'B-02'] },
    ]);
    expect(contarEstados(zonas[0])).toEqual({ Disponible: 1, Ocupado: 1, Reservado: 1 });
  });
  it('reconoce visitantes por la placa', () => {
    expect(esVisitante({ placa: 'VIS123' })).toBe(true);
    expect(esVisitante({ placa: 'ABC123' })).toBe(false);
  });
});

describe('parqueadero de demostración', () => {
  it('es determinista: 100 espacios en 4 zonas', () => {
    const a = construirParqueadero();
    const b = construirParqueadero();
    expect(a).toEqual(b);
    expect(a.zonas).toHaveLength(4);
    expect(a.zonas.reduce((s, z) => s + z.estados.length, 0)).toBe(100);
  });
});

describe('exportación y datos del residente', () => {
  it('escapa las comillas en el CSV', () => {
    expect(aCsv([['a', 'dice "hola"']])).toBe('"a","dice ""hola"""');
  });
  it('encuentra el próximo pago y la unidad', () => {
    expect(proximoPago([{ estado: 'Pagado' }, { estado: 'Pendiente', periodo: 'Agosto' }]).periodo).toBe('Agosto');
    expect(proximoPago([{ estado: 'Pagado' }])).toBeUndefined();
    expect(unidadDeUsuario({ detalle: 'Torre 2 - Apto 302 · Residente' })).toBe('Torre 2 - Apto 302');
  });
});
