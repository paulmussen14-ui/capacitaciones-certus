import { useState } from 'react';
import Alert from '../../components/Alert/Alert';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import Modal from '../../components/Modal/Modal';
import Spinner from '../../components/Spinner/Spinner';
import { useAuth } from '../../hooks/useAuth';
import { useDebounce } from '../../hooks/useDebounce';
import { useLista } from '../../hooks/useLista';
import { useToast } from '../../hooks/useToast';
import {
    actualizarUsuario,
    cambiarEstadoUsuario,
    crearUsuario,
    listarUsuarios,
    quitarFotoUsuario,
    subirFotoUsuario,
} from '../../services/usuarios';
import { aplicarCambioImagen } from '../../utils/imagen';
import DocenteCard from './DocenteCard';
import DocenteDetalle from './DocenteDetalle';
import UsuarioForm from './UsuarioForm';
import './Docentes.css';

const NUEVO = 'nuevo';

const FILTROS = [
    { valor: 'todos', texto: 'Todos' },
    { valor: 'docentes', texto: 'Docentes' },
    { valor: 'administradores', texto: 'Administradores' },
    { valor: 'inactivos', texto: 'Inactivos' },
];

export default function Docentes() {
    const toast = useToast();
    const { usuario: sesion } = useAuth();

    const [texto, setTexto] = useState('');
    const busqueda = useDebounce(texto.trim(), 300);
    const { filas, cargando, error, recargar } = useLista(listarUsuarios, busqueda);

    // editando: null (cerrado) | 'nuevo' | el usuario que se edita
    const [editando, setEditando] = useState(null);
    const [viendo, setViendo] = useState(null);
    const [filtro, setFiltro] = useState('todos');
    const [aDesactivar, setADesactivar] = useState(null);
    const [procesando, setProcesando] = useState(false);

    async function guardar(datos, imagen) {
        let guardado;
        if (editando === NUEVO) {
        guardado = await crearUsuario(datos);
        toast.exito('Usuario creado.');
        } else {
        guardado = await actualizarUsuario(editando.id, datos);
        toast.exito('Cambios guardados.');
        }

        // Los datos ya quedaron guardados; si la foto falla se avisa sin perderlos
        try {
        await aplicarCambioImagen(imagen, guardado.id, subirFotoUsuario, quitarFotoUsuario);
        } catch (err) {
        toast.error(`Se guardó, pero la foto no se pudo actualizar: ${err.message}`);
        }

        setEditando(null);
        recargar();
    }

    async function cambiarEstado(usuario, activo) {
        setProcesando(true);
        try {
        await cambiarEstadoUsuario(usuario.id, activo);
        toast.exito(activo ? 'Usuario activado.' : 'Usuario desactivado.');
        recargar();
        } catch (err) {
        toast.error(err.message);
        } finally {
        setProcesando(false);
        setADesactivar(null);
        }
    }

    const nombreCompleto = (usuario) => `${usuario.apellidos}, ${usuario.nombres}`;

    const coincide = {
        todos: () => true,
        docentes: (u) => u.rol === 'docente',
        administradores: (u) => u.rol === 'administrador',
        inactivos: (u) => !u.activo,
    };
    const totales = Object.fromEntries(
        Object.entries(coincide).map(([clave, prueba]) => [clave, filas.filter(prueba).length]),
    );
    const visibles = filas.filter(coincide[filtro]);

    function editarDesdeDetalle(usuario) {
        setViendo(null);
        setEditando(usuario);
    }

    const mensajeVacio = busqueda
        ? `No se encontraron usuarios con «${busqueda}».`
        : filtro !== 'todos'
            ? 'No hay usuarios en esta categoría.'
            : 'Aún no hay usuarios. Crea el primero con el botón «Nuevo».';

    return (
        <>
        <div className="page-header">
            <div>
            <h1>Docentes</h1>
            <p className="page-header__sub">
                Docentes y administradores. Las cuentas desactivadas no pueden iniciar sesión.
            </p>
            </div>
            <Button onClick={() => setEditando(NUEVO)}>Nuevo</Button>
        </div>

        <div className="toolbar">
            <div className="toolbar__buscar">
            <Input
                label="Buscar por nombre o correo"
                type="search"
                value={texto}
                onChange={(evento) => setTexto(evento.target.value)}
                placeholder="Escribe un nombre o un correo"
            />
            </div>
            <div className="filtros" role="group" aria-label="Filtrar usuarios">
            {FILTROS.map((f) => (
                <button
                key={f.valor}
                type="button"
                className={`filtros__boton${filtro === f.valor ? ' filtros__boton--activo' : ''}`}
                aria-pressed={filtro === f.valor}
                onClick={() => setFiltro(f.valor)}
                >
                {f.texto}
                {!error && !cargando && <span className="filtros__conteo">{totales[f.valor]}</span>}
                </button>
            ))}
            </div>
        </div>

        {error ? (
            <Alert
            accion={
                <Button variant="secondary" size="sm" onClick={recargar}>
                Reintentar
                </Button>
            }
            >
            {error}
            </Alert>
        ) : cargando && filas.length === 0 ? (
            <Spinner texto="Cargando usuarios..." />
        ) : visibles.length === 0 ? (
            <p className="doc-vacio">{mensajeVacio}</p>
        ) : (
            <div className={`doc-grid${cargando ? ' is-loading' : ''}`} aria-busy={cargando}>
            {visibles.map((fila) => (
                <DocenteCard
                key={fila.id}
                usuario={fila}
                esPropio={fila.id === sesion.id}
                procesando={procesando}
                onVer={setViendo}
                onEditar={setEditando}
                onActivar={(u) => cambiarEstado(u, true)}
                onDesactivar={setADesactivar}
                />
            ))}
            </div>
        )}

        <Modal
            abierto={viendo !== null}
            titulo="Ficha del usuario"
            onCerrar={() => setViendo(null)}
        >
            {viendo && (
            <DocenteDetalle
                usuario={viendo}
                onEditar={editarDesdeDetalle}
                onCerrar={() => setViendo(null)}
            />
            )}
        </Modal>

        <Modal
            abierto={editando !== null}
            titulo={editando === NUEVO ? 'Nuevo usuario' : 'Editar usuario'}
            onCerrar={() => setEditando(null)}
        >
            <UsuarioForm
            usuario={editando === NUEVO ? null : editando}
            esPropio={editando !== null && editando !== NUEVO && editando.id === sesion.id}
            onGuardar={guardar}
            onCancelar={() => setEditando(null)}
            />
        </Modal>

        <Modal
            abierto={aDesactivar !== null}
            titulo="Desactivar usuario"
            onCerrar={() => !procesando && setADesactivar(null)}
        >
            {aDesactivar && (
            <>
                <p>
                ¿Desactivar a <strong>{nombreCompleto(aDesactivar)}</strong>? Ya no podrá iniciar
                sesión, pero se conserva su historial y podrás activar la cuenta de nuevo.
                </p>
                <div className="form-actions">
                <Button
                    variant="secondary"
                    disabled={procesando}
                    onClick={() => setADesactivar(null)}
                >
                    Cancelar
                </Button>
                <Button
                    variant="danger"
                    disabled={procesando}
                    onClick={() => cambiarEstado(aDesactivar, false)}
                >
                    {procesando ? 'Desactivando...' : 'Desactivar'}
                </Button>
                </div>
            </>
            )}
        </Modal>
        </>
    );
}