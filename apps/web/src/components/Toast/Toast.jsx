export default function Toast({ tipo = 'exito', children, onCerrar }) {
    return (
        <div className={`toast toast--${tipo}`} role={tipo === 'error' ? 'alert' : 'status'}>
        <span className="toast__mensaje">{children}</span>
        <button
            type="button"
            className="toast__cerrar"
            aria-label="Cerrar aviso"
            onClick={onCerrar}
        >
            ×
        </button>
        </div>
    );
}