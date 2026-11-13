import Badge from '../../components/Badge/Badge';
import Button from '../../components/Button/Button';
import { formatearRango } from '../../utils/formato';

export function Portada({ capacitacion }) {
    if (capacitacion.imagen_url) {
        return <img src={capacitacion.imagen_url} alt={`Imagen de ${capacitacion.titulo}`} loading="lazy" />;
    }
    // Sin imagen: portada de color con la inicial, distinta según la capacitación
    return (
        <div className={`cap-card__portada cap-card__portada--${capacitacion.id % 4}`} aria-hidden="true">
        {capacitacion.titulo.trim()[0]?.toUpperCase()}
        </div>
    );
}

export default function CapacitacionCard({
    capacitacion,
    procesando,
    onVer,
    onEditar,
    onActivar,
    onDesactivar,
    onEliminar,
}) {
    const c = capacitacion;

    return (
        <article className={`cap-card${c.activa ? '' : ' cap-card--inactiva'}`}>
        <div className="cap-card__media">
            <Portada capacitacion={c} />
            <span className="cap-card__estado">
            {c.activa ? <Badge tono="success">Activa</Badge> : <Badge tono="neutral">Inactiva</Badge>}
            </span>
        </div>

        <div className="cap-card__cuerpo">
            <h2 className="cap-card__titulo">{c.titulo}</h2>
            {c.descripcion && <p className="cap-card__descripcion">{c.descripcion}</p>}

            <dl className="cap-card__datos">
            <div><dt>Duración</dt><dd>{c.duracion_horas} h</dd></div>
            <div><dt>Instructor</dt><dd>{c.instructor ?? '—'}</dd></div>
            <div><dt>Sede</dt><dd>{c.sede ?? '—'}</dd></div>
            <div><dt>Fechas</dt><dd>{formatearRango(c.fecha_inicio, c.fecha_fin)}</dd></div>
            </dl>

            <p className="cap-card__inscritos">
            {c.inscritos === 0
                ? 'Sin docentes asignados'
                : `${c.inscritos} ${c.inscritos === 1 ? 'docente asignado' : 'docentes asignados'}`}
            </p>
        </div>

        <footer className="cap-card__acciones">
            <Button variant="ghost" size="sm" aria-label={`Ver detalle de ${c.titulo}`} onClick={() => onVer(c)}>
            Ver
            </Button>
            <Button variant="secondary" size="sm" aria-label={`Editar ${c.titulo}`} onClick={() => onEditar(c)}>
            Editar
            </Button>
            {c.activa ? (
            <Button variant="secondary" size="sm" aria-label={`Desactivar ${c.titulo}`} onClick={() => onDesactivar(c)}>
                Desactivar
            </Button>
            ) : (
            <Button variant="secondary" size="sm" aria-label={`Activar ${c.titulo}`} disabled={procesando} onClick={() => onActivar(c)}>
                Activar
            </Button>
            )}
            <Button variant="danger" size="sm" aria-label={`Eliminar ${c.titulo}`} onClick={() => onEliminar(c)}>
            Eliminar
            </Button>
        </footer>
        </article>
    );
}
