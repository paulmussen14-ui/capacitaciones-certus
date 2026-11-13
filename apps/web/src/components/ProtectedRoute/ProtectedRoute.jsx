import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { rutaPorRol } from "../../utils/rutaPorRol";


export default function ProtectedRoute({ roles }) {
    const { usuario, cargando } = useAuth();
    const ubicacion = useLocation();

    if (cargando) {
        return <p className="text-center text-muted mt-3">Comprobando sesión...</p>;
    }

    if (!usuario) {
        return <Navigate to="/login" replace state={{ desde: ubicacion }} />;
    }

    if (roles && !roles.includes(usuario.rol)) {
        return <Navigate to={rutaPorRol(usuario.rol)} replace />;
    }

    return <Outlet />;
}