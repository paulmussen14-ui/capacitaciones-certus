import Logo from "../../components/Logo/Logo";
import Button from "../../components/Button/Button";
import { useAuth } from "../../hooks/useAuth";
import "./Panel.css";

export default function Panel({ titulo }) {
    const { usuario, cerrarSesion } = useAuth();

    return (
        <div className="container panel">
        <Logo size="md" />
        <h1>{titulo}</h1>
        <p>
            Hola, {usuario.nombres} {usuario.apellidos}
        </p>
        <p className="text-muted">Sesión iniciada como {usuario.rol}.</p>
        <Button variant="danger" onClick={cerrarSesion}>
            Cerrar sesión
        </Button>
        </div>
    );
}