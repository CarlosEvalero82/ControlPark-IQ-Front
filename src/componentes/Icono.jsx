// Íconos SVG del menú y de las tarjetas (los mismos trazos del prototipo).

const TRAZOS = {
  entrada: <path d="M3 12h13M12 5l7 7-7 7" />,
  salida: <path d="M21 12H8M12 19l-7-7 7-7" />,
  cuadricula: <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />,
  recibo: <path d="M6 3h12v18l-3-2-3 2-3-2-3 2z M9 8h6M9 12h6" />,
  reloj: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l4 2" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4l3 2" />
    </>
  ),
  vehiculo: (
    <path d="M4 16l1.2-5A2 2 0 017.1 9.5h9.8a2 2 0 011.9 1.5L20 16M6 16v3M18 16v3M7 16a1 1 0 102 0 1 1 0 00-2 0zM15 16a1 1 0 102 0 1 1 0 00-2 0z" />
  ),
  campana: <path d="M12 4a4 4 0 00-4 4v3l-2 4h12l-2-4V8a4 4 0 00-4-4z M10 19a2 2 0 004 0" />,
  persona: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20a8 8 0 0116 0" />
    </>
  ),
  escudo: (
    <>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  engranaje: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1L7 17M17 7l2.1-2.1" />
    </>
  ),
  correo: (
    <>
      <path d="M4 4h16v16H4z" />
      <path d="M4 6l8 6 8-6" />
    </>
  ),
};

/** Muestra un ícono por nombre. `color` por defecto hereda el del texto. */
export default function Icono({ nombre, tamano = 17, color = 'currentColor' }) {
  return (
    <svg
      width={tamano}
      height={tamano}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      aria-hidden="true"
      style={{ flex: 'none' }}
    >
      {TRAZOS[nombre]}
    </svg>
  );
}
