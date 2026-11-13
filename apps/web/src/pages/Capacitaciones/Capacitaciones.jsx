import { useState } from 'react';
import Alert from '../../components/Alert/Alert';
import Badge from '../../components/Badge/Badge';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import Modal from '../../components/Modal/Modal';
import Spinner from '../../components/Spinner/Spinner';
import Table from '../../components/Table/Table';
import { useDebounce } from '../../hooks/useDebounce';
import { useLista } from '../../hooks/useLista';
import { useToast } from '../../hooks/useToast';
import {
    actualizarCapacitacion,
    cambiarEstadoCapacitacion,
    crearCapacitacion,
    listarCapacitaciones,
} from '../../services/capacitaciones';
import { formatearRango } from '../../utils/formato';
import CapacitacionForm from './CapacitacionForm';

const NUEVA = 'nueva';

export default function Capacitaciones() {
    const toast = useToast();

    const [texto, setTexto] = useState('');
    const busqueda = useDebounce(texto.trim(), 300);
    const { filas, cargando, error, recargar } = useLista(listarCapacitaciones, busqueda);

    const [editando, setEditando] = useState(null);
    const [aDesactivar, setADesactivar] = useState(null);
    const [procesando, setProcesando] = useState(false);

    async function guardar(datos) {
        if (editando === NUEVA) {
        await crearCapacitacion(datos);
        toast.exito('Capacitación creada.');
        } else {
        await actualizarCapacitacion(editando.id, datos);
        toast.exito('Cambios guardados.');
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
        }
    }

    const columnas = [
        {
        clave: 'titulo',
        titulo: 'Título',
        className: 'table__principal',
        render: (fila) => <strong>{fila.titulo}</strong>,
        },
        {
        clave: 'duracion_horas',
        titulo: 'Duración',
        render: (fila) => `${fila.duracion_horas} h`,
        },
        { clave: 'instructor', titulo: 'Instructor' },
        { clave: 'sede', titulo: 'Sede' },
        {
        clave: 'fechas',
        titulo: 'Fechas',
        render: (fila) => formatearRango(fila.fecha_inicio, fila.fecha_fin),
        },
        {
        clave: 'activa',
        titulo: 'Estado',
        render: (fila) =>
            fila.activa ? (
            <Badge tono="success">Activa</Badge>
            ) : (
            <Badge tono="neutral">Inactiva</Badge>
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
                aria-label={`Editar ${fila.titulo}`}
                onClick={() => setEditando(fila)}
            >
                Editar
            </Button>{' '}
            {fila.activa ? (
                <Button
                variant="danger"
                size="sm"
                aria-label={`Desactivar ${fila.titulo}`}
                onClick={() => setADesactivar(fila)}
                >
                Desactivar
                </Button>
            ) : (
                <Button
                variant="secondary"
                size="sm"
                aria-label={`Activar ${fila.titulo}`}
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
        ? `No se encontraron capacitaciones con «${busqueda}».`
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
            {!error && !cargando && (
            <span className="toolbar__conteo">
                {filas.length} {filas.length === 1 ? 'capacitación' : 'capacitaciones'}
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
            <Spinner texto="Cargando capacitaciones..." />
        ) : (
            <div className={cargando ? 'is-loading' : undefined} aria-busy={cargando}>
            <Table
                descripcion="Lista de capacitaciones"
                columnas={columnas}
                filas={filas}
                vacio={mensajeVacio}
            />
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