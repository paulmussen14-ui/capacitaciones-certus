import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Avatar from '../Avatar/Avatar';
import Button from '../Button/Button';
import Logo from '../Logo/Logo';
import './Navbar.css';

export default function Navbar({ enlaces, usuario, onCerrarSesion }) {
    const [abierto, setAbierto] = useState(false);

    return (
        <header className="navbar">
        <div className="container navbar__inner">
            <div className="navbar__marca">
            <Logo size="sm" />
            <span className="navbar__nombre">Capacitación Docente</span>
            </div>

            <button
            type="button"
            className="navbar__toggle"
            aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={abierto}
            aria-controls="menu-principal"
            onClick={() => setAbierto((valor) => !valor)}
            >
            <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
                <path
                d="M4 6h16M4 12h16M4 18h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                />
            </svg>
            </button>

            <nav
            id="menu-principal"
            className={`navbar__menu${abierto ? ' navbar__menu--abierto' : ''}`}
            aria-label="Principal"
            >
            <ul className="navbar__enlaces">
                {enlaces.map((enlace) => (
                <li key={enlace.to}>
                    <NavLink
                    to={enlace.to}
                    end={enlace.end}
                    className="navbar__enlace"
                    onClick={() => setAbierto(false)}
                    >
                    {enlace.texto}
                    </NavLink>
                </li>
                ))}
            </ul>

            <div className="navbar__usuario">
                <span className="navbar__saludo">
                <Avatar nombres={usuario.nombres} apellidos={usuario.apellidos} src={usuario.foto_url} size="sm" />
                {usuario.nombres} {usuario.apellidos}
                </span>
                <Button variant="secondary" size="sm" onClick={onCerrarSesion}>
                Cerrar sesión
                </Button>
            </div>
            </nav>
        </div>
        </header>
    );
}