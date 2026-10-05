# Estándar de codificación — ControlPark-IQ Front

Reglas que se aplicaron en todo el código y que `npm run lint` ayuda a verificar.

## 1. Nombres
- **Componentes y archivos de componentes:** `PascalCase` y en español, con nombre que dice qué hacen
  (`PaginaCobro.jsx`, `TarjetaResumen.jsx`).
- **Funciones, variables y props:** `camelCase` (`registrarCobro`, `claveFila`).
- **Constantes globales:** `MAYUSCULAS_CON_GUION` (`CLAVE_DEMO`, `TARIFAS_INICIALES`).
- **Hooks:** empiezan por `use` (`useSesion`, `useCargar`).
- **Carpetas:** minúsculas (`componentes`, `servicios`, `paginas/admin`).

## 2. Estructura de un componente
1. Comentario de una línea al inicio del archivo que explica su propósito.
2. Imports: librerías, contextos y servicios, componentes, utilidades.
3. Constantes fuera del componente (columnas, listas fijas).
4. Función del componente (un componente por archivo, `export default`).
5. Hooks al principio, luego funciones internas y por último el JSX.

## 3. Comentarios
- Cada archivo tiene un comentario inicial; cada función no trivial lleva un comentario `/** ... */` que dice **qué
  hace y por qué**, no repite el código.
- Se comentan las reglas de negocio (cobro por fracciones de 30 minutos, permisos que ocultan secciones, inactivos
  sin acceso) y las decisiones de seguridad.
- Los comentarios están en español, igual que la interfaz.

## 4. Buenas prácticas de React
- Solo componentes de función y Hooks. Sin manipular el DOM directamente (`document.getElementById`).
- Estado local con `useState`; estado compartido con Context API + `useReducer`.
- La lógica de negocio va en funciones puras de `utilidades/` (se pueden probar sin pantalla).
- El acceso a datos va en `servicios/`, nunca dentro de los componentes visuales.
- Listas con `key` estable (placa, id, usuario), nunca el índice cuando el orden puede cambiar.
- Formularios con `label` asociada (`htmlFor`/`id`) y elementos accesibles (`button`, `role`, `aria-label`).
- Sin código duplicado: lo que se repetía en las 4 carpetas del prototipo ahora es un componente o una función.

## 5. Estilo
- Indentación de 2 espacios, comillas simples, punto y coma, líneas de máximo ~120 caracteres.
- Paleta de colores accesible (Okabe-Ito) definida una sola vez en `estilos/global.css` y en `ESTILO_ESTADO`.

## 6. Calidad
- `npm run lint` debe terminar sin errores (reglas de ESLint + reglas de Hooks).
- `npm test` debe pasar antes de cada commit importante: pruebas de funciones puras, del reductor y de navegación
  por los tres roles.

## 7. Control de versiones (Git)
- Rama principal: `main`. Cambios pequeños y frecuentes.
- Mensajes con el formato `tipo: descripción` en español:
  - `feat:` funcionalidad nueva · `fix:` corrección · `docs:` documentación · `test:` pruebas · `chore:` configuración.
- No se suben `node_modules/` ni `dist/` (están en `.gitignore`).
