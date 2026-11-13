import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { useAuth } from '../../hooks/useAuth';
import './AdminLayout.css';

const ENLACES_ADMIN = [
    { to: '/admin', texto: 'Inicio', end: true },
    { to: '/admin/capacitaciones', texto: 'Capacitaciones' },
    { to: '/admin/docentes', texto: 'Docentes' },
    { to: '/admin/metricas', texto: 'Métricas' },
];

export default function AdminLayout() {
    const { usuario, cerrarSesion } = useAuth();

    return (
        <>
        <Navbar enlaces={ENLACES_ADMIN} usuario={usuario} onCerrarSesion={cerrarSesion} />
        <main className="container admin-main">
            <Outlet />
        </main>
        </>
    );
}