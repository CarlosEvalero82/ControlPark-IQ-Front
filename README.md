# ControlPark-IQ — Front-end en React

Front-end del proyecto formativo **ControlPark-IQ** (sistema de gestión de parqueaderos para propiedad horizontal).
Es la migración a **React** del prototipo HTML/CSS/JS de la actividad GA6, siguiendo el diseño de componentes
entregado en la evidencia GA7-220501096-AA4-EV02.

- **Aprendiz:** Carlos Eduardo Valero · **Ficha:** 3235898 · **Instructora:** Adriana Milena Rangel Márquez
- **Programa:** Tecnólogo en Análisis y Desarrollo de Software — SENA
- **Evidencia:** GA7-220501096-AA4-EV03 — Componente front-end del proyecto formativo
- **Repositorio:** https://github.com/CarlosEvalero82/ControlPark-IQ-Front

## Qué hace

Tres áreas según el rol, más el acceso:

| Área | Pantallas |
|---|---|
| Acceso | Inicio de sesión (con recuperación de clave y accesos de demostración), registro del conjunto en 4 pasos |
| Portería / Guarda | Registro de entrada, registro de salida, espacios disponibles, cobro a visitante, historial del día |
| Residente | Inicio, pago de mensualidad, historial de pagos, mis vehículos, notificaciones, mi perfil |
| Administrador | Dashboard, usuarios, permisos, zonas y espacios, tarifas, facturación de visitantes, mapa de ocupación, configuración |

Reglas de negocio conservadas del prototipo: el administrador activa o desactiva secciones y el menú de Portería y
Residente cambia al instante; el residente es de solo lectura (cambios por correo a administración, salvo que se le
active el permiso de editar vehículos); el espacio se asigna de forma automática o manual; el visitante paga
`ceil(minutos / 30) × tarifa de la fracción`.

## Cómo ejecutarlo

Requisitos: **Node.js 20.19 o superior (o 22+)**.

```bash
npm install        # instala dependencias
npm run dev        # servidor de desarrollo (http://localhost:5173)
npm test           # pruebas automáticas (Vitest + Testing Library)
npm run lint       # revisión de estilo y errores (ESLint)
npm run build      # versión de producción en dist/
```

**Cuentas de demostración** (clave `demo123`): `maria.torres` (residente), `carlos.velez` (portería),
`laura.gomez` (administrador). También hay tres botones de acceso rápido en el login. El usuario `andres.gil` está
inactivo y no puede entrar (valida esa regla).

## Arquitectura

```
src/
├── componentes/   Componentes reutilizables (Modal, TablaDatos, TarjetaResumen, TableroEspacios, ...)
├── contexto/      Estado global con Context API: SesionContext, PermisosContext, ParqueaderoContext
├── layouts/       Estructura común de los roles: MenuLateral, EncabezadoPantalla, LayoutRol, RutaProtegida
├── paginas/       Una carpeta por área: acceso/, porteria/, residente/, admin/
├── servicios/     Acceso a datos (async). Hoy usan datos de demostración + localStorage
├── utilidades/    Funciones puras (formato, cobro, tablero, exportar a CSV/PDF) y hooks
├── estilos/       global.css (una sola hoja; antes había 4 copias en el prototipo)
├── pruebas/       Pruebas automáticas
├── App.jsx        Rutas de los tres roles
└── main.jsx       Punto de entrada (HashRouter)
```

- **Componentes y hooks:** componentes de función con `useState`, `useEffect`, `useReducer`, `useMemo`, `useContext`
  y un hook propio (`useCargar`).
- **Estado global:** tres contextos. El `ParqueaderoContext` usa un reductor (`reductorParqueadero`) para que Portería
  ocupe y libere espacios y el Administrador los vea al instante, sin pasar por `localStorage` entre pantallas.
- **Navegación:** React Router (`HashRouter`), una ruta por pantalla (`/porteria/entrada`, `/residente/pago`,
  `/admin/permisos`...). `RutaProtegida` impide entrar a un área sin sesión o con otro rol.
- **Capa de servicios:** todas las funciones son `async`. Cuando el back-end exponga una API HTTP solo cambia el cuerpo
  de cada función en `servicios/`, no los componentes.

## Relación con el diseño de la EV02

Los componentes y los 3 contextos definidos en la EV02 están implementados (más páginas y componentes de apoyo que salieron al programar). Diferencias menores, a propósito:

- Los componentes específicos de cada pantalla viven en `paginas/<rol>/` (por ejemplo `FormularioEntrada`,
  `PanelCobro`, `MatrizPermisos`) y los genéricos en `componentes/`.
- Los nombres de datos están en español (`placa`, `estado`, `espacioId`) en lugar de los del prototipo en inglés.
- `FormularioEntrada` recibe `espaciosLibres = { siguiente, porZona }`, calculado con funciones puras de
  `utilidades/parqueadero.js`.

## Limitaciones conocidas y seguridad

- **No hay back-end HTTP todavía.** El back-end del proyecto (Java, JDBC/DAO) aún no expone una API; por eso los datos
  se guardan en `localStorage`. Los servicios están preparados para cambiar a `fetch`.
- **La autenticación es solo de demostración.** Validar usuario y contraseña en el navegador no es seguro: en
  producción debe hacerlo el servidor (hash de contraseña, sesiones o tokens).
- La carga de archivos del registro del conjunto solo guarda el nombre del archivo.

## Control de versiones

Se trabaja con Git. Convención de mensajes: `tipo: descripción corta` (`feat`, `fix`, `docs`, `test`, `chore`).
Más detalles en [`docs/ESTANDAR_CODIFICACION.md`](docs/ESTANDAR_CODIFICACION.md).
