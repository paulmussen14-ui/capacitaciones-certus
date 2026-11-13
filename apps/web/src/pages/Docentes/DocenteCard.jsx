import Avatar from '../../components/Avatar/Avatar';
import Badge from '../../components/Badge/Badge';
import Button from '../../components/Button/Button';

export default function DocenteCard({
    usuario,
    esPropio,
    procesando,
    onVer,
    onEditar,
    onActivar,
    onDesactivar,
}) {
    const u = usuario;
    const nombre = `${u.nombres} ${u.apellidos}`;
    const esDocente = u.rol === 'docente';

    return (
        <article className={`doc-card${u.activo ? '' : ' doc-card--inactivo'}`}>
        <button
            type="button"
            className="doc-card__abrir"
            aria-label={`Ver información de ${nombre}`}
            onClick={() => onVer(u)}
        >
            <span className={`doc-card__banda doc-card__banda--${u.id % 4}`} aria-hidden="true" />
            <Avatar nombres={u.nombres} apellidos={u.apellidos} src={u.foto_url} size="xl" />

            <span className="doc-card__nombre">
            {nombre}
            {esPropio && <span className="text-muted"> (tú)</span>}
            </span>

            <span className="doc-card__insignias">
            {esDocente ? <Badge tono="neutral">Docente</Badge> : <Badge tono="info">Administrador</Badge>}
            {!u.activo && <Badge tono="warning">Inactivo</Badge>}
            </span>

            <span className="doc-card__programa">{u.programa ?? u.sede ?? '—'}</span>
            <span className="doc-card__correo">{u.correo}</span>

            {esDocente ? (
            u.asignadas === 0 ? (
                <span className="doc-card__sin-datos">Sin capacitaciones asignadas</span>
            ) : (
                <span className="doc-card__stats">
                <span>
                    <strong>{u.asignadas}</strong>
                    <small>Asignadas</small>
                </span>
                <span>
                    <strong>{u.completadas}</strong>
                    <small>Completadas</small>
                </span>
                <span>
                    <strong>{u.progreso_promedio}%</strong>
                    <small>Progreso</small>
                </span>
                </span>
            )
            ) : (
            <span className="doc-card__sin-datos">Gestiona capacitaciones y cuentas</span>
            )}
        </button>

        <footer className="doc-card__acciones">
            <Button variant="secondary" size="sm" aria-label={`Editar a ${nombre}`} onClick={() => onEditar(u)}>
            Editar
            </Button>
            {u.activo ? (
            <Button
                variant="danger"
                size="sm"
                aria-label={`Desactivar a ${nombre}`}
                disabled={esPropio}
                title={esPropio ? 'No puedes desactivar tu propia cuenta' : undefined}
                onClick={() => onDesactivar(u)}
            >
                Desactivar
            </Button>
            ) : (
            <Button
                variant="secondary"
                size="sm"
                aria-label={`Activar a ${nombre}`}
                disabled={procesando}
                onClick={() => onActivar(u)}
            >
                Activar
            </Button>
            )}
        </footer>
        </article>
    );
}
