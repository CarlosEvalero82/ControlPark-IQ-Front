// Pantalla de inicio de sesión con recuperación de clave y accesos de demostración.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../../componentes/Modal';
import { useParqueadero } from '../../contexto/ParqueaderoContext';
import { useSesion } from '../../contexto/SesionContext';
import { autenticar, autenticarDemo, conjuntoYaRegistrado } from '../../servicios/usuarios';

const ACCESOS_RAPIDOS = [
  { rol: 'porteria', letra: 'P', texto: 'Entrar como Portería / Guarda', fondo: '#E1F0F9', color: '#0072B2' },
  { rol: 'residente', letra: 'R', texto: 'Entrar como Residente', fondo: '#E0F5F0', color: '#00694d' },
  { rol: 'admin', letra: 'A', texto: 'Entrar como Administrador', fondo: '#F3E1EC', color: '#A6547E' },
];

export default function PaginaLogin() {
  const navegar = useNavigate();
  const { iniciarSesion } = useSesion();
  const { zonas } = useParqueadero();

  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const [avisoRegistro, setAvisoRegistro] = useState(false);

  // Recuperación de contraseña (ventana modal)
  const [recuperando, setRecuperando] = useState(false);
  const [correo, setCorreo] = useState('');
  const [enlaceEnviado, setEnlaceEnviado] = useState(false);

  const totalEspacios = zonas.reduce((suma, zona) => suma + zona.estados.length, 0);

  /** Guarda la sesión y entra al área del rol. */
  const entrar = (sesion) => {
    iniciarSesion(sesion);
    navegar(`/${sesion.rol}`);
  };

  const enviarFormulario = async (evento) => {
    evento.preventDefault();
    setError('');
    if (!usuario.trim() || !clave) {
      setError('Escribe tu usuario y tu contraseña.');
      return;
    }
    try {
      entrar(await autenticar(usuario, clave));
    } catch (e) {
      setError(e.message);
    }
  };

  const accesoRapido = async (rol) => entrar(await autenticarDemo(rol));

  const irARegistro = () => {
    if (conjuntoYaRegistrado()) setAvisoRegistro(true);
    else navegar('/registro');
  };

  const abrirRecuperacion = () => {
    setCorreo('');
    setEnlaceEnviado(false);
    setRecuperando(true);
  };

  return (
    <div id="login" className="pagina-acceso">
      <div className="login-left">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
        <div className="login-left-content">
          <img
            src="/logo_general.png"
            alt="ControlPark-IQ — Software de sistema de gestión de parqueaderos para propiedad horizontal"
            className="login-logo"
          />
          <p>
            Sistema de gestión inteligente de parqueaderos para conjuntos residenciales. Controla el ingreso y salida
            de vehículos, la disponibilidad de espacios, los cobros a visitantes y los pagos de mensualidad, todo
            desde un solo lugar.
          </p>
          <div className="stat-row">
            <div>
              <div className="num">{zonas.length}</div>
              <div className="lbl">Zonas de parqueo</div>
            </div>
            <div>
              <div className="num">{totalEspacios}</div>
              <div className="lbl">Espacios totales</div>
            </div>
            <div>
              <div className="num">24/7</div>
              <div className="lbl">Monitoreo</div>
            </div>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-card">
          <form className="login-form" onSubmit={enviarFormulario}>
            <div>
              <h1>Iniciar sesión</h1>
              <p>Ingresa con tu usuario o correo institucional.</p>
            </div>
            <div className="field">
              <label htmlFor="login-usuario">Usuario o correo</label>
              <input
                id="login-usuario"
                value={usuario}
                placeholder="nombre@losrobles.com"
                autoComplete="username"
                onChange={(e) => setUsuario(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="login-clave">Contraseña</label>
              <input
                id="login-clave"
                type="password"
                value={clave}
                placeholder="••••••••"
                autoComplete="current-password"
                onChange={(e) => setClave(e.target.value)}
              />
              <button type="button" className="link-btn" style={{ alignSelf: 'flex-end', fontSize: 12 }} onClick={abrirRecuperacion}>
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            {error && (
              <div className="msg-warn" role="alert" style={{ marginTop: 0 }}>
                {error}
              </div>
            )}
            <button className="btn" type="submit">
              Iniciar sesión
            </button>

            <div className="divider">
              <div className="line"></div>Accesos rápidos de demostración<div className="line"></div>
            </div>
            <div className="quick">
              {ACCESOS_RAPIDOS.map((acceso) => (
                <button type="button" key={acceso.rol} onClick={() => accesoRapido(acceso.rol)}>
                  <span className="ic" style={{ background: acceso.fondo, color: acceso.color }}>
                    {acceso.letra}
                  </span>
                  {acceso.texto}
                </button>
              ))}
            </div>
            <p className="acceso-aviso">
              ¿Primera vez aquí?{' '}
              <button type="button" className="link-btn" style={{ fontSize: 12.5 }} onClick={irARegistro}>
                Registra tu conjunto
              </button>
            </p>
            {avisoRegistro && (
              <div className="msg-warn" style={{ textAlign: 'center' }}>
                Este conjunto ya está registrado. Contacta a tu administrador.
              </div>
            )}
          </form>
        </div>
      </div>

      <Modal abierto={recuperando} titulo="Recuperar contraseña" onCerrar={() => setRecuperando(false)}>
        <p className="modal-sub">
          Ingresa tu correo institucional y te enviaremos un enlace para restablecer tu contraseña.
        </p>
        <div className="field">
          <label htmlFor="recuperar-correo">Correo institucional</label>
          <input
            id="recuperar-correo"
            value={correo}
            placeholder="nombre@losrobles.com"
            onChange={(e) => setCorreo(e.target.value)}
          />
        </div>
        <button
          className="btn btn-full"
          style={{ marginTop: 6 }}
          onClick={() => correo.trim() && setEnlaceEnviado(true)}
        >
          Enviar enlace de recuperación
        </button>
        {enlaceEnviado && (
          <div className="msg-ok">Si el correo existe en nuestro sistema, recibirás un enlace en unos minutos.</div>
        )}
      </Modal>
    </div>
  );
}
