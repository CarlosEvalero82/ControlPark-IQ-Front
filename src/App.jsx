// Raíz de la aplicación: contextos + rutas de los tres roles y del acceso.
import { Navigate, Route, Routes } from 'react-router-dom';
import { ParqueaderoProvider } from './contexto/ParqueaderoContext';
import { PermisosProvider } from './contexto/PermisosContext';
import { SesionProvider } from './contexto/SesionContext';
import LayoutRol from './layouts/LayoutRol';
import RutaProtegida from './layouts/RutaProtegida';
import AsistenteRegistro from './paginas/acceso/AsistenteRegistro';
import PaginaLogin from './paginas/acceso/PaginaLogin';
import PaginaCobro from './paginas/porteria/PaginaCobro';
import PaginaEntrada from './paginas/porteria/PaginaEntrada';
import PaginaEspacios from './paginas/porteria/PaginaEspacios';
import PaginaHistorial from './paginas/porteria/PaginaHistorial';
import PaginaSalida from './paginas/porteria/PaginaSalida';
import PaginaHistorialPagos from './paginas/residente/PaginaHistorialPagos';
import PaginaInicio from './paginas/residente/PaginaInicio';
import PaginaNotificaciones from './paginas/residente/PaginaNotificaciones';
import PaginaPago from './paginas/residente/PaginaPago';
import PaginaPerfil from './paginas/residente/PaginaPerfil';
import PaginaVehiculos from './paginas/residente/PaginaVehiculos';
import PaginaConfiguracion from './paginas/admin/PaginaConfiguracion';
import PaginaDashboard from './paginas/admin/PaginaDashboard';
import PaginaFacturacion from './paginas/admin/PaginaFacturacion';
import PaginaMapa from './paginas/admin/PaginaMapa';
import PaginaPermisos from './paginas/admin/PaginaPermisos';
import PaginaTarifas from './paginas/admin/PaginaTarifas';
import PaginaUsuarios from './paginas/admin/PaginaUsuarios';
import PaginaZonas from './paginas/admin/PaginaZonas';

/** Rutas de un rol: el layout con sus pantallas hijas. */
function rutasDeRol(rol, pantallas) {
  return (
    <Route
      path={`/${rol}`}
      element={
        <RutaProtegida rolPermitido={rol}>
          <LayoutRol rol={rol} />
        </RutaProtegida>
      }
    >
      {Object.entries(pantallas).map(([ruta, Pantalla]) => (
        <Route key={ruta} path={ruta} element={<Pantalla />} />
      ))}
    </Route>
  );
}

/** Rutas sin el enrutador (así se pueden probar con MemoryRouter). */
export function AppRutas() {
  return (
    <Routes>
      <Route path="/login" element={<PaginaLogin />} />
      <Route path="/registro" element={<AsistenteRegistro />} />
      {rutasDeRol('porteria', {
        entrada: PaginaEntrada,
        salida: PaginaSalida,
        espacios: PaginaEspacios,
        cobro: PaginaCobro,
        historial: PaginaHistorial,
      })}
      {rutasDeRol('residente', {
        inicio: PaginaInicio,
        pago: PaginaPago,
        historial: PaginaHistorialPagos,
        vehiculos: PaginaVehiculos,
        notificaciones: PaginaNotificaciones,
        perfil: PaginaPerfil,
      })}
      {rutasDeRol('admin', {
        dashboard: PaginaDashboard,
        usuarios: PaginaUsuarios,
        permisos: PaginaPermisos,
        zonas: PaginaZonas,
        tarifas: PaginaTarifas,
        facturacion: PaginaFacturacion,
        mapa: PaginaMapa,
        configuracion: PaginaConfiguracion,
      })}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <SesionProvider>
      <PermisosProvider>
        <ParqueaderoProvider>
          <AppRutas />
        </ParqueaderoProvider>
      </PermisosProvider>
    </SesionProvider>
  );
}
