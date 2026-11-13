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
        <aside className="login__brand" aria-hidden="false">
            <div className="login__brand-inner">
            <span className="login__pill">CERTUS</span>
            <h2 className="login__brand-title">Capacitación Docente</h2>
            <p className="login__brand-text">
                Un solo lugar para seguir tu formación, completar tus capacitaciones y
                descargar tus constancias.
            </p>
            <ul className="login__features">
                <li>Consulta tu progreso en cada capacitación</li>
                <li>Descarga tus constancias cuando las completes</li>
                <li>Acceso con tu correo institucional</li>
            </ul>
            </div>
        </aside>

        <section className="login__panel">
            <div className="login__card">
            <Logo size="lg" />
            <h1 className="login__title">Bienvenido</h1>
            <p className="text-muted">Ingresa con tu correo institucional.</p>

            <form className="login__form" onSubmit={manejarEnvio} noValidate>
                <label className="login__field">
                <span>Correo institucional</span>
                <input
                    type="email"
                    name="correo"
                    autoComplete="username"
                    placeholder="nombre@certus.edu.pe"
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
            </div>
        </section>
        </main>
    );
}
