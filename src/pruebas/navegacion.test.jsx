// Pruebas de navegación e integración: login, menú por rol, permisos y flujos clave.
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AppRutas } from '../App';
import { ParqueaderoProvider } from '../contexto/ParqueaderoContext';
import { PermisosProvider } from '../contexto/PermisosContext';
import { SesionProvider } from '../contexto/SesionContext';

/** Monta la app completa en una ruta inicial, con los tres contextos. */
function montar(ruta = '/login') {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <SesionProvider>
        <PermisosProvider>
          <ParqueaderoProvider>
            <AppRutas />
          </ParqueaderoProvider>
        </PermisosProvider>
      </SesionProvider>
    </MemoryRouter>,
  );
}

const menu = () => within(screen.getByRole('navigation', { name: 'Secciones' }));

async function entrarComo(texto) {
  const usuario = userEvent.setup();
  montar();
  await usuario.click(screen.getByRole('button', { name: new RegExp(texto) }));
  return usuario;
}

describe('acceso', () => {
  it('sin sesión, una ruta protegida lleva al login', () => {
    montar('/admin/dashboard');
    expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeInTheDocument();
  });

  it('rechaza credenciales incorrectas', async () => {
    const usuario = userEvent.setup();
    montar();
    await usuario.type(screen.getByLabelText('Usuario o correo'), 'maria.torres');
    await usuario.type(screen.getByLabelText('Contraseña'), 'mala');
    await usuario.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Usuario o contraseña incorrectos.');
  });

  it('entra con usuario y contraseña válidos', async () => {
    const usuario = userEvent.setup();
    montar();
    await usuario.type(screen.getByLabelText('Usuario o correo'), 'maria.torres');
    await usuario.type(screen.getByLabelText('Contraseña'), 'demo123');
    await usuario.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    expect(await screen.findByText('Vehículos registrados')).toBeInTheDocument();
  });

  it('un residente no puede abrir el área del administrador', async () => {
    await entrarComo('Entrar como Residente');
    await screen.findByText('Vehículos registrados');
    expect(menu().queryByText('Permisos')).not.toBeInTheDocument();
  });
});

describe('navegación por rol', () => {
  it('Portería recorre sus cinco pantallas', async () => {
    const usuario = await entrarComo('Entrar como Portería');
    expect(await screen.findByRole('heading', { name: 'Registro de entrada' })).toBeInTheDocument();
    for (const titulo of ['Registro de salida', 'Espacios disponibles', 'Cobro a visitante', 'Historial del día']) {
      await usuario.click(menu().getByText(titulo));
      expect(await screen.findByRole('heading', { name: titulo, level: 1 })).toBeInTheDocument();
    }
  });

  it('Residente recorre sus seis pantallas', async () => {
    const usuario = await entrarComo('Entrar como Residente');
    await screen.findByText('Próximo pago');
    for (const titulo of ['Pago de mensualidad', 'Historial de pagos', 'Mis vehículos', 'Notificaciones', 'Mi perfil']) {
      await usuario.click(menu().getByText(titulo));
      expect(await screen.findByRole('heading', { name: titulo, level: 1 })).toBeInTheDocument();
    }
  });

  it('Administrador recorre sus ocho pantallas', async () => {
    const usuario = await entrarComo('Entrar como Administrador');
    await screen.findByText('Ocupación total');
    for (const titulo of [
      'Usuarios y residentes',
      'Permisos',
      'Zonas y espacios',
      'Tarifas',
      'Facturación visitantes',
      'Mapa de ocupación',
      'Configuración',
    ]) {
      await usuario.click(menu().getByText(titulo));
      expect(await screen.findByRole('heading', { name: titulo, level: 1 })).toBeInTheDocument();
    }
  });

  it('cerrar sesión vuelve al login', async () => {
    const usuario = await entrarComo('Entrar como Residente');
    await screen.findByText('Próximo pago');
    await usuario.click(screen.getByRole('button', { name: 'Cerrar sesión' }));
    expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeInTheDocument();
  });
});

describe('flujos de negocio', () => {
  it('el residente ve sus vehículos en solo lectura', async () => {
    const usuario = await entrarComo('Entrar como Residente');
    await screen.findByText('Próximo pago');
    await usuario.click(menu().getByText('Mis vehículos'));
    expect(await screen.findByText('MNO654')).toBeInTheDocument();
    expect(screen.getAllByText('Gestionado por administración').length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: 'Solicitar por correo' })).toBeInTheDocument();
  });

  it('el residente puede registrar el pago', async () => {
    const usuario = await entrarComo('Entrar como Residente');
    await screen.findByText('Próximo pago');
    await usuario.click(menu().getByText('Pago de mensualidad'));
    await usuario.click(await screen.findByRole('button', { name: 'Pagar ahora' }));
    expect(screen.getByText('Pago registrado correctamente.')).toBeInTheDocument();
  });

  it('el administrador oculta una sección y desaparece del menú del residente', async () => {
    const usuario = userEvent.setup();
    montar();
    await usuario.click(screen.getByRole('button', { name: /Entrar como Administrador/ }));
    await screen.findByText('Ocupación total');
    await usuario.click(menu().getByText('Permisos'));
    await usuario.click(await screen.findByLabelText('Ver notificaciones'));
    await usuario.click(screen.getByRole('button', { name: 'Guardar permisos' }));
    expect(screen.getByText('Permisos actualizados correctamente.')).toBeInTheDocument();
    await usuario.click(screen.getByRole('button', { name: 'Cerrar sesión' }));
    await usuario.click(screen.getByRole('button', { name: /Entrar como Residente/ }));
    await screen.findByText('Próximo pago');
    expect(menu().queryByText('Notificaciones')).not.toBeInTheDocument();
  });

  it('el administrador crea un usuario y aparece en la tabla', async () => {
    const usuario = await entrarComo('Entrar como Administrador');
    await screen.findByText('Ocupación total');
    await usuario.click(menu().getByText('Usuarios y residentes'));
    await usuario.click(await screen.findByRole('button', { name: '+ Agregar usuario' }));
    await usuario.type(screen.getByLabelText('Nombre completo'), 'Ana Prueba');
    await usuario.type(screen.getByLabelText('Usuario'), 'ana.prueba');
    await usuario.type(screen.getByLabelText('Contraseña'), 'clave123');
    await usuario.click(screen.getByRole('button', { name: 'Crear usuario' }));
    expect(await screen.findByText('Ana Prueba')).toBeInTheDocument();
  });

  it('un usuario inactivo no puede iniciar sesión', async () => {
    const usuario = userEvent.setup();
    montar();
    await usuario.type(screen.getByLabelText('Usuario o correo'), 'andres.gil');
    await usuario.type(screen.getByLabelText('Contraseña'), 'demo123');
    await usuario.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('inactivo');
  });
});
