import { Link } from 'react-router-dom';
import Card from '../../components/Card/Card';
import { useAuth } from '../../hooks/useAuth';
import './AdminInicio.css';

export default function AdminInicio() {
    const { usuario } = useAuth();

    return (
        <>
        <h1>Hola, {usuario.nombres}</h1>
        <p className="text-muted">
            Desde aquí administras el catálogo de capacitaciones y las cuentas del personal.
        </p>

        <div className="inicio-tarjetas">
            <Card titulo="Capacitaciones">
            <p>Crea, edita y desactiva las capacitaciones disponibles para los docentes.</p>
            <Link className="btn btn--primary btn--md" to="/admin/capacitaciones">
                Ir a capacitaciones
            </Link>
            </Card>

            <Card titulo="Docentes">
            <p>Da de alta cuentas, actualiza sus datos o desactívalas cuando ya no correspondan.</p>
            <Link className="btn btn--primary btn--md" to="/admin/docentes">
                Ir a docentes
            </Link>
            </Card>

            <Card titulo="Métricas">
            <p>Mira qué docentes llevan el mejor progreso en sus capacitaciones.</p>
            <Link className="btn btn--primary btn--md" to="/admin/metricas">
                Ir a métricas
            </Link>
            </Card>
        </div>
        </>
    );
}