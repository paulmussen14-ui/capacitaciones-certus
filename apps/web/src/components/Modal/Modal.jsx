import { useEffect, useId, useRef } from 'react';
import './Modal.css';

export default function Modal({ abierto, titulo, onCerrar, children }) {
    const dialogoRef = useRef(null);
    const idTitulo = useId();

    useEffect(() => {
        const dialogo = dialogoRef.current;
        if (!dialogo) return;
        if (abierto && !dialogo.open) dialogo.showModal();
        if (!abierto && dialogo.open) dialogo.close();
    }, [abierto]);

    function alPulsarEscape(evento) {
        evento.preventDefault();
        onCerrar();
    }

    function alHacerClic(evento) {
        if (evento.target === dialogoRef.current) onCerrar();
    }

    return (
        <dialog
        ref={dialogoRef}
        className="modal"
        aria-labelledby={idTitulo}
        onCancel={alPulsarEscape}
        onClick={alHacerClic}
        >
        {abierto && (
            <div className="modal__contenido">
            <div className="modal__header">
                <h2 className="modal__title" id={idTitulo}>{titulo}</h2>
                <button
                type="button"
                className="modal__cerrar"
                aria-label="Cerrar ventana"
                onClick={onCerrar}
                >
                ×
                </button>
            </div>
            {children}
            </div>
        )}
        </dialog>
    );
}