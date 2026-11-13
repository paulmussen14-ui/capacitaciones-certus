import { useEffect, useState } from 'react';
import Alert from '../../components/Alert/Alert';
import Avatar from '../../components/Avatar/Avatar';
import BarraProgreso from '../../components/BarraProgreso/BarraProgreso';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import Spinner from '../../components/Spinner/Spinner';
import { obtenerMetricas } from '../../services/metricas';
import './Metricas.css';

const ORDINAL = ['1.º', '2.º', '3.º'];

function Resumen({ totales }) {
    const datos = [
        { etiqueta: 'Docentes activos', valor: totales.docentes_activos },
        { etiqueta: 'Capacitaciones activas', valor: totales.capacitaciones_activas },
        { etiqueta: 'Progreso promedio', valor: `${totales.progreso_promedio}%` },
        { etiqueta: 'Completadas', valor: `${totales.completadas} de ${totales.asignaciones}` },
    ];

    return (
        <div className="metricas-resumen">
        {datos.map((d) => (
            <div key={d.etiqueta} className="metrica">
            <span className="metrica__valor">{d.valor}</span>
            <span className="metrica__etiqueta">{d.etiqueta}</span>
            </div>
        ))}
        </div>
    );
}

export default function Metricas() {
    const [estado, setEstado] = useState({ datos: null, error: '', version: 0 });
    const [version, setVersion] = useState(0);

    useEffect(() => {
        let vigente = true;
        obtenerMetricas()
        .then((datos) => vigente && setEstado({ datos, error: '', version }))
        .catch((err) => vigente && setEstado({ datos: null, error: err.message, version }));
        return () => {
        vigente = false;
        };
    }, [version]);

    const { datos, error } = estado;
    const cargando = !datos && !error || estado.version !== version;

    if (error) {
        return (
        <Alert
            accion={
            <Button variant="secondary" size="sm" onClick={() => setVersion((v) => v + 1)}>
                Reintentar
            </Button>
            }
        >
            {error}
        </Alert>
        );
    }
    if (cargando) return <Spinner texto="Cargando métricas..." />;

    const { totales, ranking } = datos;
    const podio = ranking.slice(0, 3);

    return (
        <>
        <div className="page-header">
            <div>
            <h1>Métricas</h1>
            <p className="page-header__sub">
                Los mejores docentes según su progreso promedio en las capacitaciones asignadas.
            </p>
            </div>
        </div>

        <Resumen totales={totales} />

        {ranking.length === 0 ? (
            <p className="metricas-vacio">
            Aún no hay capacitaciones asignadas a docentes. Cuando las haya, aquí aparecerá el ranking.
            </p>
        ) : (
            <>
            <h2 className="metricas-titulo">Mejores docentes</h2>
            <ol className="podio">
                {podio.map((d, indice) => (
                <li key={d.id} className={`podio__item podio__item--${indice + 1}`}>
                    <span className="podio__puesto">{ORDINAL[indice]}</span>
                    <Avatar nombres={d.nombres} apellidos={d.apellidos} src={d.foto_url} size="lg" />
                    <strong className="podio__nombre">{d.nombres} {d.apellidos}</strong>
                    <span className="podio__programa">{d.programa ?? d.sede ?? ''}</span>
                    <span className="podio__progreso">{d.progreso_promedio}%</span>
                    <span className="podio__detalle">
                    {d.completadas} de {d.asignadas} completadas
                    </span>
                </li>
                ))}
            </ol>

            <Card titulo="Ranking completo">
                <div className="table-wrap">
                <table className="table">
                    <caption className="sr-only">Ranking de docentes por progreso</caption>
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Docente</th>
                        <th scope="col">Completadas</th>
                        <th scope="col">Progreso promedio</th>
                    </tr>
                    </thead>
                    <tbody>
                    {ranking.map((d, indice) => (
                        <tr key={d.id}>
                        <td>{indice + 1}</td>
                        <td>
                            <span className="docente-nombre">
                            <Avatar nombres={d.nombres} apellidos={d.apellidos} src={d.foto_url} />
                            <strong>{d.apellidos}, {d.nombres}</strong>
                            </span>
                        </td>
                        <td>{d.completadas} / {d.asignadas}</td>
                        <td className="metricas-celda-barra">
                            <BarraProgreso valor={d.progreso_promedio} />
                            <span>{d.progreso_promedio}%</span>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </Card>
            </>
        )}
        </>
    );
}
