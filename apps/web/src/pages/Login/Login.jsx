import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Logo from "../../components/Logo/Logo";
import Button from "../../components/Button/Button";
import { useAuth } from "../../hooks/useAuth";
import { rutaPorRol } from "../../utils/rutaPorRol";
import "./Login.css";

export default function Login() {
    const { usuario, cargando, iniciarSesion } = useAuth();
    const ubicacion = useLocation();

    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [enviando, setEnviando] = useState(false);

    if (!cargando && usuario) {
        const destino = ubicacion.state?.desde?.pathname ?? rutaPorRol(usuario.rol);
        return <Navigate to={destino} replace />;
    }

    async function manejarEnvio(evento) {
        evento.preventDefault();
        setError("");
        setEnviando(true);
        try {
        await iniciarSesion(correo.trim(), password);
        } catch (err) {
        setError(err.message);
        setEnviando(false);
        }
    }

    return (
        <main className="login">
        <section className="login__card">
            <Logo size="lg" />
            <h1 className="login__title">Capacitación Docente</h1>
            <p className="text-muted">Ingresa con tu correo institucional.</p>

            <form className="login__form" onSubmit={manejarEnvio} noValidate>
            <label className="login__field">
                <span>Correo institucional</span>
                <input
                type="email"
                name="correo"
                autoComplete="username"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
                autoFocus
                />
            </label>

            <label className="login__field">
                <span>Contraseña</span>
                <input
                type="password"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />
            </label>

            {error && (
                <p className="login__error" role="alert">
                {error}
                </p>
            )}

            <Button type="submit" disabled={enviando}>
                {enviando ? "Ingresando..." : "Ingresar"}
            </Button>
            </form>
        </section>
        </main>
    );
}