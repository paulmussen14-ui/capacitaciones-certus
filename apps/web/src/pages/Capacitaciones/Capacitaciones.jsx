import { useState } from 'react';
import Alert from '../../components/Alert/Alert';
import Badge from '../../components/Badge/Badge';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import Modal from '../../components/Modal/Modal';
import Spinner from '../../components/Spinner/Spinner';
import { useDebounce } from '../../hooks/useDebounce';
import { useLista } from '../../hooks/useLista';
import { useToast } from '../../hooks/useToast';
import {
    actualizarCapacitacion,
    cambiarEstadoCapacitacion,
    crearCapacitacion,
    listarCapacitaciones,
    quitarImagenCapacitacion,
    subirImagenCapacitacion,
} from '../../services/capacitaciones';
import { formatearRango } from '../../utils/formato';
import { aplicarCambioImagen } from '../../utils/imagen';
import CapacitacionCard, { Portada } from './CapacitacionCard';
import CapacitacionForm from './CapacitacionForm';
import EliminarCapacitacion from './EliminarCapacitacion';
import './Capacitaciones.css';

const NUEVA = 'nueva';

const FILTROS = [
    { valor: 'todas', texto: 'Todas' },
    { valor: 'activas', texto: 'Activas' },
    { valor: 'inactivas', texto: 'Inactivas' },
];

export default function Capacitaciones() {
    const toast = useToast();

    const [texto, setTexto] = useState('');
    const busqueda = useDebounce(texto.trim(), 300);
    const { filas, cargando, error, recargar } = useLista(listarCapacitaciones, busqueda);

    const [filtro, setFiltro] = useState('todas');
    const [editando, setEditando] = useState(null);
    const [viendo, setViendo] = useState(null);
    const [aDesactivar, setADesactivar] = useState(null);
    const [aEliminar, setAEliminar] = useState(null);
    const [procesando, setProcesando] = useState(false);

    const totales = {
        todas: filas.length,
        activas: filas.filter((fila) => fila.activa).length,
        inactivas: filas.filter((fila) => !fila.activa).length,
    };
    const visibles = filas.filter(
        (fila) => filtro === 'todas' || (filtro === 'activas' ? fila.activa : !fila.activa),
    );

    async function guardar(datos, imagen) {
        let guardada;
        if (editando === NUEVA) {
        guardada = await crearCapacitacion(datos);
        toast.exito('Capacitación creada.');
        } else {
        guardada = await actualizarCapacitacion(editando.id, datos);
        toast.exito('Cambios guardados.');
        }

        // Los datos ya quedaron guardados; si la imagen falla se avisa sin perderlos
        try {
        await aplicarCambioImagen(
            imagen,
            guardada.id,
            subirImagenCapacitacion,
            quitarImagenCapacitacion,
        );
        } catch (err) {
        toast.error(`Se guardó, pero la imagen no se pudo actualizar: ${err.message}`);
        }

        setEditando(null);
        recargar();
    }

    async function cambiarEstado(capacitacion, activa) {
        setProcesando(true);
        try {
        await cambiarEstadoCapacitacion(capacitacion.id, activa);
        toast.exito(activa ? 'Capacitación activada.' : 'Capacitación desactivada.');
        recargar();
        } catch (err) {
        toast.error(err.message);
        } finally {
        setProcesando(false);
        setADesactivar(null);
        setAEliminar(null);
        }
    }

    function alEliminada() {
        toast.exito('Capacitación eliminada.');
        setAEliminar(null);
        recargar();
    }

    const mensajeVacio = busqueda
        ? `No se encontraron capacitaciones con «${busqueda}».`
        : filtro !== 'todas'
            ? `No hay capacitaciones ${filtro}.`
            : 'Aún no hay capacitaciones. Crea la primera con el botón «Nueva».';

    return (
        <>
        <div className="page-header">
            <div>
            <h1>Capacitaciones</h1>
            <p className="page-header__sub">
                Catálogo de capacitaciones. Las desactivadas se conservan con su historial.
            </p>
            </div>
            <Button onClick={() => setEditando(NUEVA)}>Nueva</Button>
        </div>

        <div className="toolbar">
            <div className="toolbar__buscar">
            <Input
                label="Buscar por título"
                type="search"
                value={texto}
                onChange={(evento) => setTexto(evento.target.value)}
                placeholder="Escribe parte del título"
            />
            </div>

            <div className="filtros" role="group" aria-label="Filtrar por estado">
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
            <Spinner texto="Cargando capacitaciones..." />
        ) : visibles.length === 0 ? (
            <p className="cap-vacio">{mensajeVacio}</p>
        ) : (
            <div className={`cap-grid${cargando ? ' is-loading' : ''}`} aria-busy={cargando}>
            {visibles.map((fila) => (
                <CapacitacionCard
                key={fila.id}
                capacitacion={fila}
                procesando={procesando}
                onVer={setViendo}
                onEditar={setEditando}
                onActivar={(c) => cambiarEstado(c, true)}
                onDesactivar={setADesactivar}
                onEliminar={setAEliminar}
                />
            ))}
            </div>
        )}

        <Modal
            abierto={editando !== null}
            titulo={editando === NUEVA ? 'Nueva capacitación' : 'Editar capacitación'}
            onCerrar={() => setEditando(null)}
        >
            <CapacitacionForm
            capacitacion={editando === NUEVA ? null : editando}
            onGuardar={guardar}
            onCancelar={() => setEditando(null)}
            />
        </Modal>

        <Modal abierto={viendo !== null} titulo={viendo?.titulo ?? ''} onCerrar={() => setViendo(null)}>
            {viendo && (
            <div className="cap-detalle">
                <div className="cap-detalle__portada">
                <Portada capacitacion={viendo} />
                </div>
                <p>
                {viendo.activa ? <Badge tono="success">Activa</Badge> : <Badge tono="neutral">Inactiva</Badge>}
                </p>
                <p>{viendo.descripcion ?? 'Sin descripción.'}</p>
                <ul className="cap-detalle__datos">
                <li><strong>Duración:</strong> {viendo.duracion_horas} h</li>
                <li><strong>Instructor:</strong> {viendo.instructor ?? '—'}</li>
                <li><strong>Sede:</strong> {viendo.sede ?? '—'}</li>
                <li><strong>Programa:</strong> {viendo.programa ?? '—'}</li>
                <li><strong>Fechas:</strong> {formatearRango(viendo.fecha_inicio, viendo.fecha_fin)}</li>
                <li><strong>Docentes asignados:</strong> {viendo.inscritos}</li>
                </ul>
            </div>
            )}
        </Modal>

        <Modal
            abierto={aDesactivar !== null}
            titulo="Desactivar capacitación"
            onCerrar={() => !procesando && setADesactivar(null)}
        >
            {aDesactivar && (
            <>
                <p>
                ¿Desactivar <strong>{aDesactivar.titulo}</strong>? No se elimina: se conserva su
                historial y podrás activarla de nuevo cuando quieras.
                </p>
                <div className="form-actions">
                <Button variant="secondary" disabled={procesando} onClick={() => setADesactivar(null)}>
                    Cancelar
                </Button>
                <Button variant="danger" disabled={procesando} onClick={() => cambiarEstado(aDesactivar, false)}>
                    {procesando ? 'Desactivando...' : 'Desactivar'}
                </Button>
                </div>
            </>
            )}
        </Modal>

        <Modal
            abierto={aEliminar !== null}
            titulo="Eliminar capacitación"
            onCerrar={() => setAEliminar(null)}
        >
            {aEliminar && (
            <EliminarCapacitacion
                capacitacion={aEliminar}
                onEliminada={alEliminada}
                onDesactivar={(c) => cambiarEstado(c, false)}
                onCancelar={() => setAEliminar(null)}
            />
            )}
        </Modal>
        </>
    );
}
