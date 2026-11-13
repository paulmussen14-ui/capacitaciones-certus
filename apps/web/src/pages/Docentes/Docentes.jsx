import { useState } from 'react';
import Alert from '../../components/Alert/Alert';
import Avatar from '../../components/Avatar/Avatar';
import Badge from '../../components/Badge/Badge';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import Modal from '../../components/Modal/Modal';
import Spinner from '../../components/Spinner/Spinner';
import Table from '../../components/Table/Table';
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
import UsuarioForm from './UsuarioForm';
import './Docentes.css';

const NUEVO = 'nuevo';

export default function Docentes() {
    const toast = useToast();
    const { usuario: sesion } = useAuth();

    const [texto, setTexto] = useState('');
    const busqueda = useDebounce(texto.trim(), 300);
    const { filas, cargando, error, recargar } = useLista(listarUsuarios, busqueda);

    // editando: null (cerrado) | 'nuevo' | el usuario que se edita
    const [editando, setEditando] = useState(null);
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

    const columnas = [
        {
        clave: 'nombre',
        titulo: 'Nombre',
        className: 'table__principal',
        render: (fila) => (
            <span className="docente-nombre">
            <Avatar nombres={fila.nombres} apellidos={fila.apellidos} src={fila.foto_url} />
            <span>
                <strong>{nombreCompleto(fila)}</strong>
                {fila.id === sesion.id && <span className="text-muted"> (tú)</span>}
            </span>
            </span>
        ),
        },
        { clave: 'correo', titulo: 'Correo' },
        {
        clave: 'rol',
        titulo: 'Rol',
        render: (fila) =>
            fila.rol === 'administrador' ? (
            <Badge tono="info">Administrador</Badge>
            ) : (
            <Badge tono="neutral">Docente</Badge>
            ),
        },
        { clave: 'sede', titulo: 'Sede' },
        { clave: 'programa', titulo: 'Programa' },
        {
        clave: 'activo',
        titulo: 'Estado',
        render: (fila) =>
            fila.activo ? (
            <Badge tono="success">Activo</Badge>
            ) : (
            <Badge tono="neutral">Inactivo</Badge>
            ),
        },
        {
        clave: 'acciones',
        titulo: 'Acciones',
        className: 'table__acciones',
        render: (fila) => (
            <>
            <Button
                variant="secondary"
                size="sm"
                aria-label={`Editar a ${nombreCompleto(fila)}`}
                onClick={() => setEditando(fila)}
            >
                Editar
            </Button>{' '}
            {fila.activo ? (
                <Button
                variant="danger"
                size="sm"
                aria-label={`Desactivar a ${nombreCompleto(fila)}`}
                disabled={fila.id === sesion.id}
                title={fila.id === sesion.id ? 'No puedes desactivar tu propia cuenta' : undefined}
                onClick={() => setADesactivar(fila)}
                >
                Desactivar
                </Button>
            ) : (
                <Button
                variant="secondary"
                size="sm"
                aria-label={`Activar a ${nombreCompleto(fila)}`}
                disabled={procesando}
                onClick={() => cambiarEstado(fila, true)}
                >
                Activar
                </Button>
            )}
            </>
        ),
        },
    ];

    const mensajeVacio = busqueda
        ? `No se encontraron usuarios con «${busqueda}».`
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
            {!error && !cargando && (
            <span className="toolbar__conteo">
                {filas.length} {filas.length === 1 ? 'usuario' : 'usuarios'}
            </span>
            )}
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
        ) : (
            <div className={cargando ? 'is-loading' : undefined} aria-busy={cargando}>
            <Table
                descripcion="Lista de docentes y administradores"
                columnas={columnas}
                filas={filas}
                vacio={mensajeVacio}
            />
            </div>
        )}

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