// Encabezado superior: título de la sección y datos del usuario.

export default function EncabezadoPantalla({ titulo, nombre, etiqueta, iniciales }) {
  return (
    <header>
      <h1>{titulo}</h1>
      <div className="user-box">
        <div>
          <div className="name">{nombre}</div>
          <div className="role">{etiqueta}</div>
        </div>
        <div className="avatar">{iniciales}</div>
      </div>
    </header>
  );
}
