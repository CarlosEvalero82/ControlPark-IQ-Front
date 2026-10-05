// Ventana modal reutilizable (salida de vehículo, detalle de espacio, usuarios...).
import { useEffect } from 'react';

export default function Modal({ abierto, titulo, onCerrar, ancho = false, children }) {
  // Se cierra con la tecla Escape.
  useEffect(() => {
    if (!abierto) return undefined;
    const alPresionar = (evento) => {
      if (evento.key === 'Escape') onCerrar();
    };
    document.addEventListener('keydown', alPresionar);
    return () => document.removeEventListener('keydown', alPresionar);
  }, [abierto, onCerrar]);

  if (!abierto) return null;

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div
        className={`modal-box${ancho ? ' ancho' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        onClick={(evento) => evento.stopPropagation()}
      >
        <div className="modal-head">
          <h3>{titulo}</h3>
          <button className="modal-close" onClick={onCerrar} aria-label="Cerrar">
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
