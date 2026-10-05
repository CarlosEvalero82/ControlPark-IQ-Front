// Datos de demostración de ControlPark-IQ.
// Son los mismos datos del prototipo HTML/CSS/JS aprobado en AA3/AA4 (GA6).
// Cuando el back-end exponga una API, solo cambian los servicios que usan este archivo.

/** Colores de cada estado de un espacio (paleta accesible Okabe-Ito). */
export const ESTILO_ESTADO = {
  Disponible: { fondo: '#E0F5F0', borde: '#009E73', texto: '#00694d' },
  Ocupado: { fondo: '#FBE9DC', borde: '#C2540A', texto: '#943e08' },
  Reservado: { fondo: '#FDFAE0', borde: '#F0E442', texto: '#7A6300' },
};

/** Contraseña de las cuentas de demostración (solo para el prototipo sin back-end). */
export const CLAVE_DEMO = 'demo123';

/** Permisos por defecto de cada rol (los edita el Administrador). */
export const PERMISOS_POR_DEFECTO = {
  porteria: { entrada: true, salida: true, espacios: true, cobro: true, historial: true },
  residente: {
    dashboard: true,
    pago: true,
    historial: true,
    vehiculos_ver: true,
    vehiculos_editar: false,
    notif: true,
    perfil: true,
  },
};

/** Texto de cada permiso en la pantalla Permisos. */
export const ETIQUETAS_PERMISO = {
  porteria: {
    entrada: 'Registro de entrada',
    salida: 'Registro de salida',
    espacios: 'Espacios disponibles',
    cobro: 'Cobro a visitante',
    historial: 'Historial del día',
  },
  residente: {
    dashboard: 'Ver panel de inicio',
    pago: 'Pagar mensualidad',
    historial: 'Ver historial de pagos',
    vehiculos_ver: 'Ver mis vehículos',
    vehiculos_editar: 'Agregar o eliminar vehículos propios',
    notif: 'Ver notificaciones',
    perfil: 'Editar perfil',
  },
};

/**
 * Genera el parqueadero de demostración: 100 espacios en 4 zonas y los vehículos
 * que ocupan algunos de ellos. Es determinista (semilla fija) para que siempre
 * salgan los mismos datos, igual que en el prototipo.
 */
export function construirParqueadero() {
  const definicionZonas = [
    { id: 'A', nombre: 'Zona A', cantidad: 35, ocupacion: 0.62, reserva: 0.08 },
    { id: 'B', nombre: 'Zona B', cantidad: 35, ocupacion: 0.58, reserva: 0.08 },
    { id: 'C', nombre: 'Zona C', cantidad: 10, ocupacion: 0.6, reserva: 0.1 },
    { id: 'D', nombre: 'Zona D — Visitantes', cantidad: 20, ocupacion: 0.35, reserva: 0.05 },
  ];
  const nombres = ['Jorge', 'Patricia', 'Andrés', 'Sandra', 'María', 'Felipe', 'Camila', 'Diego', 'Laura', 'Esteban', 'Natalia', 'Carlos', 'Paula', 'Julián', 'Daniela', 'Andrea', 'Mateo', 'Valentina', 'Santiago', 'Isabella', 'Rubén', 'Tatiana', 'Óscar', 'Marcela'];
  const apellidos = ['Ramírez', 'León', 'Gil', 'Ruiz', 'Torres', 'Duarte', 'Rey', 'Salazar', 'Méndez', 'Cárdenas', 'Ospina', 'Vélez', 'Paz', 'Gómez', 'Rojas', 'Castro', 'Peña', 'Suárez', 'Molina', 'Cortés'];
  const tipos = ['Automóvil', 'Motocicleta', 'Camioneta'];

  // Generador pseudoaleatorio con semilla fija (congruencial lineal).
  let semilla = 42;
  const aleatorio = () => {
    semilla = (semilla * 9301 + 49297) % 233280;
    return semilla / 233280;
  };
  const elegir = (lista) => lista[Math.floor(aleatorio() * lista.length)];
  const dosDigitos = (n) => String(n).padStart(2, '0');

  const placa = (esVisitante) => {
    if (esVisitante) {
      return 'VIS' + dosDigitos(Math.floor(aleatorio() * 90 + 10)) + Math.floor(aleatorio() * 10);
    }
    let letras = '';
    for (let i = 0; i < 3; i++) letras += String.fromCharCode(65 + Math.floor(aleatorio() * 26));
    let numeros = '';
    for (let i = 0; i < 3; i++) numeros += Math.floor(aleatorio() * 10);
    return letras + numeros;
  };
  const identificacion = () =>
    'C.C. 1.0' + Math.floor(aleatorio() * 90 + 10) + '.' + Math.floor(aleatorio() * 900 + 100) + '.' + Math.floor(aleatorio() * 900 + 100);
  const horaAleatoria = () => {
    const h = Math.floor(aleatorio() * 11) + 7;
    const m = Math.floor(aleatorio() * 60);
    const h12 = h > 12 ? h - 12 : h;
    return `${dosDigitos(h12)}:${dosDigitos(m)} ${h >= 12 ? 'p.m.' : 'a.m.'}`;
  };

  const zonas = [];
  const vehiculos = [];

  definicionZonas.forEach((def) => {
    const estados = [];
    for (let i = 0; i < def.cantidad; i++) {
      const r = aleatorio();
      const estado = r < def.ocupacion ? 'Ocupado' : r < def.ocupacion + def.reserva ? 'Reservado' : 'Disponible';
      estados.push(estado);
      if (estado === 'Ocupado') {
        const esZonaVisitantes = def.id === 'D';
        const conductor = elegir(nombres) + ' ' + elegir(apellidos);
        const torre = Math.floor(aleatorio() * 6) + 1;
        const apto = Math.floor(aleatorio() * 40) + 101;
        const vehiculo = {
          placa: placa(esZonaVisitantes),
          unidad: (esZonaVisitantes ? 'Visita a Torre ' : 'Torre ') + torre + ' - Apto ' + apto,
          tipo: elegir(tipos),
          espacioId: `${def.id}-${dosDigitos(i + 1)}`,
          entrada: horaAleatoria(),
          conductor,
          identificacion: identificacion(),
        };
        if (esZonaVisitantes) {
          vehiculo.minutos = Math.floor(aleatorio() * 200) + 15;
        }
        vehiculos.push(vehiculo);
      }
    }
    zonas.push({ id: def.id, nombre: def.nombre, estados });
  });

  return { zonas, vehiculos };
}

/** Movimientos ya finalizados del día (aparecen en el historial de Portería). */
export const MOVIMIENTOS_FINALIZADOS = [
  { placa: 'TER741', unidad: 'Torre 1 - Apto 101', tipo: 'Automóvil', entrada: '08:10', salida: '09:45', estado: 'Finalizado' },
  { placa: 'VIS900', unidad: 'Visita a Torre 3 - Apto 208', tipo: 'Motocicleta', entrada: '07:30', salida: '08:20', estado: 'Finalizado' },
  { placa: 'BCD852', unidad: 'Torre 2 - Apto 204', tipo: 'Automóvil', entrada: '06:50', salida: '07:40', estado: 'Finalizado' },
];

/** Caja del día en portería. */
export const BASE_CAJA = 50000;
export const COBROS_INICIALES = [
  { placa: 'VIS900', hora: '08:20 a.m.', valor: 3000 },
  { placa: 'VIS801', hora: '10:05 a.m.', valor: 6000 },
  { placa: 'VIS500', hora: '12:40 p.m.', valor: 4500 },
];

/** Usuarios del sistema (los de demostración tienen la clave CLAVE_DEMO). */
export const USUARIOS_INICIALES = [
  { nombre: 'María Torres', detalle: 'Torre 2 - Apto 302 · Residente', estado: 'Activo', usuario: 'maria.torres', rol: 'residente', etiqueta: 'Residente — Apto 302', espacio: 'A-05', correo: 'maria.torres@example.com', telefono: '300 555 1234', vehiculos: [{ placa: 'MNO654', tipo: 'Automóvil', color: 'Gris' }, { placa: 'QRS222', tipo: 'Motocicleta', color: 'Negra' }] },
  { nombre: 'Jorge Ramírez', detalle: 'Torre 1 - Apto 101 · Residente', estado: 'Activo', usuario: 'jorge.ramirez', rol: 'residente', vehiculos: [{ placa: 'ABC123', tipo: 'Automóvil', color: 'Blanco' }] },
  { nombre: 'Patricia León', detalle: 'Torre 1 - Apto 204 · Residente', estado: 'Activo', usuario: 'patricia.leon', rol: 'residente', vehiculos: [{ placa: 'DEF456', tipo: 'Automóvil', color: 'Azul' }] },
  { nombre: 'Andrés Gil', detalle: 'Torre 1 - Apto 305 · Residente', estado: 'Inactivo', usuario: 'andres.gil', rol: 'residente', vehiculos: [{ placa: 'GHI789', tipo: 'Camioneta', color: 'Negra' }] },
  { nombre: 'Sandra Ruiz', detalle: 'Torre 2 - Apto 102 · Residente', estado: 'Activo', usuario: 'sandra.ruiz', rol: 'residente', vehiculos: [{ placa: 'JKL321', tipo: 'Motocicleta', color: 'Roja' }] },
  { nombre: 'Felipe Duarte', detalle: 'Torre 3 - Apto 101 · Residente', estado: 'Activo', usuario: 'felipe.duarte', rol: 'residente', vehiculos: [{ placa: 'PQR987', tipo: 'Automóvil', color: 'Gris' }] },
  { nombre: 'Camila Rey', detalle: 'Torre 3 - Apto 208 · Residente', estado: 'Activo', usuario: 'camila.rey', rol: 'residente', vehiculos: [{ placa: 'STU159', tipo: 'Motocicleta', color: 'Azul' }] },
  { nombre: 'Carlos Vélez', detalle: 'Portería · Guarda turno diurno', estado: 'Activo', usuario: 'carlos.velez', rol: 'porteria', etiqueta: 'Guarda — Turno diurno' },
  { nombre: 'Rubén Paz', detalle: 'Portería · Guarda turno nocturno', estado: 'Activo', usuario: 'ruben.paz', rol: 'porteria', etiqueta: 'Guarda — Turno nocturno' },
  { nombre: 'Laura Gómez', detalle: 'Administración · Administradora', estado: 'Activo', usuario: 'laura.gomez', rol: 'admin', etiqueta: 'Administradora' },
];

/** Cuentas de los accesos rápidos de demostración de la pantalla de login. */
export const USUARIO_DEMO_POR_ROL = {
  porteria: 'carlos.velez',
  residente: 'maria.torres',
  admin: 'laura.gomez',
};

export const TARIFAS_INICIALES = [
  { concepto: 'Mensualidad residente — Automóvil', valor: 150000 },
  { concepto: 'Mensualidad residente — Motocicleta', valor: 90000 },
  { concepto: 'Visitante — por hora', valor: 3000 },
  { concepto: 'Visitante — fracción adicional (30 min)', valor: 1500 },
  { concepto: 'Recargo por mora', valor: 15000 },
];

/** Concepto de tarifa que se usa para calcular el cobro a visitantes. */
export const CONCEPTO_FRACCION = 'Visitante — fracción adicional (30 min)';

export const FACTURAS_INICIALES = [
  { id: 'INV-0101', placa: 'VIS801', tipo: 'Automóvil', fecha: '04/08/2026', permanencia: '1h 35min', valor: 6000 },
  { id: 'INV-0102', placa: 'VIS802', tipo: 'Motocicleta', fecha: '04/08/2026', permanencia: '40min', valor: 3000 },
  { id: 'INV-0103', placa: 'VIS803', tipo: 'Camioneta', fecha: '04/08/2026', permanencia: '2h 30min', valor: 9000 },
  { id: 'INV-0104', placa: 'VIS804', tipo: 'Motocicleta', fecha: '04/08/2026', permanencia: '20min', valor: 3000 },
  { id: 'INV-0105', placa: 'VIS805', tipo: 'Automóvil', fecha: '04/08/2026', permanencia: '3h 30min', valor: 12000 },
  { id: 'INV-0106', placa: 'VIS806', tipo: 'Automóvil', fecha: '04/08/2026', permanencia: '1h 5min', valor: 6000 },
  { id: 'INV-0107', placa: 'VIS807', tipo: 'Camioneta', fecha: '03/08/2026', permanencia: '2h 10min', valor: 9000 },
  { id: 'INV-0108', placa: 'VIS808', tipo: 'Motocicleta', fecha: '03/08/2026', permanencia: '30min', valor: 3000 },
  { id: 'INV-0109', placa: 'VIS809', tipo: 'Automóvil', fecha: '03/08/2026', permanencia: '3h', valor: 9000 },
];

/** Fecha que el prototipo toma como "hoy" para el dashboard del administrador. */
export const FECHA_HOY_DEMO = '04/08/2026';

export const CUPOS_POR_DEFECTO = { automovil: 60, motocicleta: 30, camioneta: 10 };

export const CONFIGURACION_POR_DEFECTO = {
  nombre: 'Conjunto Residencial Los Robles',
  direccion: 'Cra 45 #12-34, Bogotá D.C.',
  moneda: 'COP',
  tarifaVisitanteHora: '3000',
};

export const NOTIFICACIONES = [
  { texto: 'Se registró el ingreso de tu visitante Esteban Cárdenas.', fecha: 'Hoy, 10:40 a.m.' },
  { texto: 'Tu vehículo MNO654 fue registrado en el espacio A-05.', fecha: 'Hoy, 07:55 a.m.' },
  { texto: 'Tu pago de julio fue registrado exitosamente.', fecha: 'Hace 2 días' },
  { texto: 'Recuerda renovar tu mensualidad antes del 5 de agosto.', fecha: 'Hace 3 días' },
  { texto: 'Mantenimiento programado en la Zona B el sábado 8 de agosto.', fecha: 'Hace 4 días' },
  { texto: 'Nueva tarifa de visitantes vigente desde el 1 de agosto.', fecha: 'Hace 5 días' },
  { texto: 'Bienvenida al nuevo portal de ControlPark-IQ.', fecha: 'Hace 12 días' },
];

export const HISTORIAL_PAGOS = [
  { periodo: 'Agosto 2026', monto: 150000, fecha: 'Vence 05/08/2026', estado: 'Pendiente' },
  { periodo: 'Julio 2026', monto: 150000, fecha: '03/07/2026', estado: 'Pagado' },
  { periodo: 'Junio 2026', monto: 150000, fecha: '04/06/2026', estado: 'Pagado' },
  { periodo: 'Mayo 2026', monto: 150000, fecha: '02/05/2026', estado: 'Pagado' },
  { periodo: 'Abril 2026', monto: 150000, fecha: '05/04/2026', estado: 'Pagado' },
  { periodo: 'Marzo 2026', monto: 150000, fecha: '03/03/2026', estado: 'Pagado' },
  { periodo: 'Febrero 2026', monto: 150000, fecha: '04/02/2026', estado: 'Pagado' },
  { periodo: 'Enero 2026', monto: 150000, fecha: '06/01/2026', estado: 'Pagado' },
];

export const CORREO_ADMINISTRACION = 'administracion@controlpark-iq.com';
