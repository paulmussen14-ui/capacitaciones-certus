import { useCallback, useMemo, useRef, useState } from 'react';
import { ToastContext } from './ToastContext';
import Toast from '../components/Toast/Toast';
import '../components/Toast/Toast.css';

const DURACION_EXITO_MS = 4000;
const DURACION_ERROR_MS = 7000;

export default function ToastProvider({ children }) {
    const [avisos, setAvisos] = useState([]);
    const siguienteId = useRef(0);

    const cerrar = useCallback((id) => {
        setAvisos((actuales) => actuales.filter((aviso) => aviso.id !== id));
    }, []);

    const mostrar = useCallback(
        (tipo, mensaje) => {
        siguienteId.current += 1;
        const id = siguienteId.current;
        setAvisos((actuales) => [...actuales, { id, tipo, mensaje }]);
        setTimeout(() => cerrar(id), tipo === 'error' ? DURACION_ERROR_MS : DURACION_EXITO_MS);
        },
        [cerrar],
    );

    const valor = useMemo(
        () => ({
        exito: (mensaje) => mostrar('exito', mensaje),
        error: (mensaje) => mostrar('error', mensaje),
        }),
        [mostrar],
    );

    return (
        <ToastContext.Provider value={valor}>
        {children}
        <div className="toast-lista" aria-live="polite">
            {avisos.map((aviso) => (
            <Toast key={aviso.id} tipo={aviso.tipo} onCerrar={() => cerrar(aviso.id)}>
                {aviso.mensaje}
            </Toast>
            ))}
        </div>
        </ToastContext.Provider>
    );
}