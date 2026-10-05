// Construcción de enlaces mailto para las solicitudes a administración.

/** Devuelve un enlace mailto con asunto y cuerpo ya codificados. */
export function construirMailto(destino, asunto, cuerpo) {
  return `mailto:${destino}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
}
