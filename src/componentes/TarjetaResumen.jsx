// Tarjeta con una cifra (etiqueta, valor y detalle opcional).

export default function TarjetaResumen({ etiqueta, valor, detalle, compacto = false }) {
  return (
    <div className="stat-card">
      <div className="lbl">{etiqueta}</div>
      <div className="val" style={compacto ? { fontSize: 24 } : undefined}>
        {valor}
      </div>
      {detalle && <div className="sub">{detalle}</div>}
    </div>
  );
}
