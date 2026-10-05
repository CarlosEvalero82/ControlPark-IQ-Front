// Asistente de registro del conjunto en 4 pasos: datos personales, datos del
// conjunto, documentos (simulados) y usuario/contraseña del administrador maestro.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSesion } from '../../contexto/SesionContext';
import { conjuntoYaRegistrado, registrarConjunto } from '../../servicios/usuarios';

const NOMBRES_PASOS = ['Datos personales', 'Datos del conjunto', 'Documentos', 'Usuario y contraseña'];
const SIN_ARCHIVO = 'Ningún archivo seleccionado';

const DATOS_INICIALES = {
  nombre: '', cedula: '', direccion: '', telefono: '', correo: '',
  conjunto: '', matricula: '', radicado: '', acto: '',
  certificadoLegal: SIN_ARCHIVO, imagenCedula: SIN_ARCHIVO,
  usuario: '', clave: '', clave2: '',
};

/** Campo de texto con etiqueta (evita repetir el mismo bloque en cada paso). */
function Campo({ id, etiqueta, valor, onCambio, placeholder, tipo = 'text' }) {
  return (
    <div className="field">
      <label htmlFor={id}>{etiqueta}</label>
      <input id={id} type={tipo} value={valor} placeholder={placeholder} onChange={(e) => onCambio(e.target.value)} />
    </div>
  );
}

/** Selector de archivo simulado: solo guarda el nombre, no sube nada. */
function CampoArchivo({ id, etiqueta, nombre, onElegir, accept }) {
  return (
    <div className="field">
      <label>{etiqueta}</label>
      <div className="file-row">
        <span className="fname">{nombre}</span>
        <label className="upload-btn" htmlFor={id}>
          Adjuntar archivo
          <input
            id={id}
            type="file"
            accept={accept}
            style={{ display: 'none' }}
            onChange={(e) => onElegir(e.target.files?.[0]?.name ?? SIN_ARCHIVO)}
          />
        </label>
      </div>
    </div>
  );
}

export default function AsistenteRegistro() {
  const navegar = useNavigate();
  const { iniciarSesion } = useSesion();
  const [paso, setPaso] = useState(1);
  const [datos, setDatos] = useState(DATOS_INICIALES);
  const [error, setError] = useState('');

  const cambiar = (campo) => (valor) => setDatos((previo) => ({ ...previo, [campo]: valor }));
  const ultimoPaso = paso === NOMBRES_PASOS.length;

  // Solo se permite registrar un conjunto.
  if (conjuntoYaRegistrado()) {
    return (
      <div className="registro-pagina">
        <div className="wizard">
          <h1>Registrar conjunto</h1>
          <div className="msg-warn">Este conjunto ya está registrado. Contacta a tu administrador.</div>
          <button className="btn btn-full" style={{ marginTop: 16 }} onClick={() => navegar('/login')}>
            Volver al inicio de sesión
          </button>
        </div>
      </div>
    );
  }

  const finalizar = async () => {
    setError('');
    if (!datos.usuario.trim() || !datos.clave || !datos.clave2) {
      setError('Completa usuario y contraseña.');
      return;
    }
    if (datos.clave !== datos.clave2) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    const sesion = await registrarConjunto({
      ...datos,
      nombre: datos.nombre.trim(),
      usuario: datos.usuario.trim(),
    });
    iniciarSesion(sesion);
    navegar('/admin');
  };

  const siguiente = () => (ultimoPaso ? finalizar() : setPaso(paso + 1));

  return (
    <div className="registro-pagina pagina-acceso">
      <div className="wizard">
        <div className="wizard-head">
          <div className="brand-ic">
            <img src="/favicon.png" alt="ControlPark-IQ" />
          </div>
          <div>
            <h1>Registrar conjunto</h1>
            <p>Crea la cuenta del administrador maestro de tu propiedad horizontal.</p>
          </div>
        </div>

        <div className="steps">
          {NOMBRES_PASOS.map((nombre, i) => (
            <div
              key={nombre}
              className={`step-dot${i + 1 === paso ? ' active' : ''}${i + 1 < paso ? ' done' : ''}`}
            ></div>
          ))}
        </div>
        <div className="step-label">
          Paso <strong>{paso}</strong> de {NOMBRES_PASOS.length} — <span>{NOMBRES_PASOS[paso - 1]}</span>
        </div>

        {paso === 1 && (
          <div className="wiz-panel">
            <Campo id="reg-nombre" etiqueta="Nombres y apellidos" valor={datos.nombre} onCambio={cambiar('nombre')} placeholder="Nombre completo del administrador" />
            <Campo id="reg-cedula" etiqueta="Número de identificación" valor={datos.cedula} onCambio={cambiar('cedula')} placeholder="C.C. 1.020.456.789" />
            <Campo id="reg-direccion" etiqueta="Dirección de residencia" valor={datos.direccion} onCambio={cambiar('direccion')} placeholder="Calle 45 # 12 - 30, Bogotá" />
            <div className="grid2">
              <Campo id="reg-telefono" etiqueta="Teléfono de contacto" valor={datos.telefono} onCambio={cambiar('telefono')} placeholder="300 123 4567" />
              <Campo id="reg-correo" etiqueta="Correo electrónico" valor={datos.correo} onCambio={cambiar('correo')} placeholder="nombre@correo.com" />
            </div>
          </div>
        )}

        {paso === 2 && (
          <div className="wiz-panel">
            <Campo id="reg-conjunto" etiqueta="Nombre del conjunto / propiedad horizontal" valor={datos.conjunto} onCambio={cambiar('conjunto')} placeholder="Conjunto Residencial Los Robles" />
            <Campo id="reg-matricula" etiqueta="Número de la propiedad horizontal (matrícula)" valor={datos.matricula} onCambio={cambiar('matricula')} placeholder="50N-1234567" />
            <div className="grid2">
              <Campo id="reg-radicado" etiqueta="Número de radicado o consecutivo" valor={datos.radicado} onCambio={cambiar('radicado')} placeholder="RAD-2026-00123" />
              <Campo id="reg-acto" etiqueta="Número del acto administrativo" valor={datos.acto} onCambio={cambiar('acto')} placeholder="Res. 0456 de 2019" />
            </div>
          </div>
        )}

        {paso === 3 && (
          <div className="wiz-panel">
            <CampoArchivo id="reg-legal" etiqueta="Certificado de representación legal" nombre={datos.certificadoLegal} onElegir={cambiar('certificadoLegal')} />
            <CampoArchivo id="reg-cedula-img" etiqueta="Imagen de la cédula de ciudadanía" nombre={datos.imagenCedula} onElegir={cambiar('imagenCedula')} accept="image/*" />
            <p style={{ fontSize: 11.5, color: 'var(--gray-700)', marginTop: 4 }}>
              Estos documentos se simulan para efectos de esta demostración; no se suben a ningún servidor.
            </p>
          </div>
        )}

        {paso === 4 && (
          <div className="wiz-panel">
            <Campo id="reg-usuario" etiqueta="Usuario" valor={datos.usuario} onCambio={cambiar('usuario')} placeholder="nombre.apellido" />
            <Campo id="reg-clave" etiqueta="Contraseña" tipo="password" valor={datos.clave} onCambio={cambiar('clave')} placeholder="••••••••" />
            <Campo id="reg-clave2" etiqueta="Confirmar contraseña" tipo="password" valor={datos.clave2} onCambio={cambiar('clave2')} placeholder="••••••••" />
            {error && (
              <div className="msg-warn" role="alert">
                {error}
              </div>
            )}
          </div>
        )}

        <div className="wiz-nav">
          <button className="btn-outline" style={{ visibility: paso === 1 ? 'hidden' : 'visible' }} onClick={() => setPaso(paso - 1)}>
            Atrás
          </button>
          <button className="btn" onClick={siguiente}>
            {ultimoPaso ? 'Crear cuenta y registrar conjunto' : 'Continuar'}
          </button>
        </div>
      </div>
    </div>
  );
}
