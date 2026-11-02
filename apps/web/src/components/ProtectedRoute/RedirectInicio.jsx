import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { rutaPorRol } from "../../utils/rutaPorRol";

export default function RedirectInicio() {
    const { usuario, cargando } = useAuth();

    if (cargando) {
        return <p className="text-center text-muted mt-3">Comprobando sesión...</p>;
    }

    return <Navigate to={usuario ? rutaPorRol(usuario.rol) : "/login"} replace />;
}