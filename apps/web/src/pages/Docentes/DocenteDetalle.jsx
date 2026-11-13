import { useEffect, useState } from 'react';
import Alert from '../../components/Alert/Alert';
import Avatar from '../../components/Avatar/Avatar';
import Badge from '../../components/Badge/Badge';
import BarraProgreso from '../../components/BarraProgreso/BarraProgreso';
import Button from '../../components/Button/Button';
import Spinner from '../../components/Spinner/Spinner';
import { listarCapacitacionesDeUsuario } from '../../services/usuarios';
import { formatearFecha, formatearMarcaDeTiempo } from '../../utils/formato';

const ESTADOS = {
    pendiente: { tono: 'neutral', texto: 'Pendiente' },
    en_curso: { tono: 'info', texto: 'En curso' },
    completada: { tono: 'success', texto: 'Completada' },
};

export default function DocenteDetalle({ usuario, onEditar, onCerrar }) {
    const u = usuario;
    const esDocente = u.rol === 'docente';
    const [estado, setEstado] = useState({ id: null, filas: [], error: '' });

    useEffect(() => {
        if (!esDocente) return undefined;
        let vigente = true;
        listarCapacitacionesDeUsuario(u.id)
        .then((filas) => vigente && setEstado({ id: u.id, filas, error: '' }))
        .catch((err) => vigente && setEstado({ id: u.id, filas: [], error: err.message }));
        return () => {
        vigente = false;
        };
    }, [u.id, esDocente]);

    const cargando = esDocente && estado.id !== u.id;

    return (
        <div className="doc-detalle">
        <div className="doc-detalle__cabecera">
            <Avatar nombres={u.nombres} apellidos={u.apellidos} src={u.foto_url} size="xl" />
            <div>
            <p className="doc-detalle__nombre">{u.nombres} {u.apellidos}</p>
            <p className="doc-detalle__correo">{u.correo}</p>
            <p className="doc-detalle__insignias">
                {esDocente ? <Badge tono="neutral">Docente</Badge> : <Badge tono="info">Administrador</Badge>}
                {u.activo ? <Badge tono="success">Activo</Badge> : <Badge tono="warning">Inactivo</Badge>}
            </p>
            </div>
        </div>

        <dl className="doc-detalle__datos">
            <div><dt>Sede</dt><dd>{u.sede ?? '—'}</dd></div>
            <div><dt>Programa</dt><dd>{u.programa ?? '—'}</dd></div>
            <div><dt>Cuenta creada</dt><dd>{formatearMarcaDeTiempo(u.creado_en) ?? '—'}</dd></div>
            {esDocente && <div><dt>Progreso promedio</dt><dd>{u.progreso_promedio}%</dd></div>}
        </dl>

        {esDocente && (
            <section aria-labelledby="doc-detalle-capacitaciones">
            <h3 id="doc-detalle-capacitaciones" className="doc-detalle__subtitulo">
                Capacitaciones ({u.asignadas}, {u.completadas} completadas)
            </h3>

            {estado.error ? (
                <Alert>{estado.error}</Alert>
            ) : cargando ? (
                <Spinner texto="Cargando capacitaciones..." />
            ) : estado.filas.length === 0 ? (
                <p className="text-muted">Todavía no tiene capacitaciones asignadas.</p>
            ) : (
                <ul className="doc-detalle__lista">
                {estado.filas.map((f) => {
                    const info = ESTADOS[f.estado] ?? ESTADOS.pendiente;
                    return (
                    <li key={f.capacitacion_id} className="doc-detalle__item">
                        <div className="doc-detalle__item-cabecera">
                        <strong>{f.titulo}</strong>
                        <Badge tono={info.tono}>{info.texto}</Badge>
                        </div>
                        <div className="doc-detalle__item-progreso">
                        <BarraProgreso valor={f.progreso} />
                        <span>{f.progreso}%</span>
                        </div>
                        <small className="text-muted">
                        {f.duracion_horas} h
                        {f.fecha_limite && ` · Fecha límite: ${formatearFecha(f.fecha_limite)}`}
                        {f.completada_en && ` · Completada: ${formatearMarcaDeTiempo(f.completada_en)}`}
                        </small>
                    </li>
                    );
                })}
                </ul>
            )}
            </section>
        )}

        <div className="form-actions">
            <Button variant="secondary" onClick={onCerrar}>
            Cerrar
            </Button>
            <Button onClick={() => onEditar(u)}>Editar</Button>
        </div>
        </div>
    );
}
