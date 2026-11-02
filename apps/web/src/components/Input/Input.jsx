import { useId } from 'react';
import './Input.css';

export default function Input({
    label,
    error,
    hint,
    multiline = false,
    id,
    required,
    ...props
}) {
    const idGenerado = useId();
    const idCampo = id ?? idGenerado;
    const idMensaje = `${idCampo}-mensaje`;
    const Control = multiline ? 'textarea' : 'input';

    return (
        <div className={`field${error ? ' field--error' : ''}`}>
        <label className="field__label" htmlFor={idCampo}>
            {label}
            {required && <span className="field__required" aria-hidden="true"> *</span>}
        </label>
        <Control
            id={idCampo}
            className="field__control"
            required={required}
            aria-invalid={error ? true : undefined}
            aria-describedby={error || hint ? idMensaje : undefined}
            {...props}
        />
        {error ? (
            <p className="field__error" id={idMensaje} role="alert">{error}</p>
        ) : (
            hint && <p className="field__hint" id={idMensaje}>{hint}</p>
        )}
        </div>
    );
}