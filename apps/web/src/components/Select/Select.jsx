import { useId } from 'react';
import '../Input/Input.css';
import './Select.css';

export default function Select({
    label,
    opciones,
    error,
    hint,
    id,
    required,
    ...props
    }) {
    const idGenerado = useId();
    const idCampo = id ?? idGenerado;
    const idMensaje = `${idCampo}-mensaje`;

    return (
        <div className={`field${error ? ' field--error' : ''}`}>
        <label className="field__label" htmlFor={idCampo}>
            {label}
            {required && <span className="field__required" aria-hidden="true"> *</span>}
        </label>
        <select
            id={idCampo}
            className="field__control select"
            required={required}
            aria-invalid={error ? true : undefined}
            aria-describedby={error || hint ? idMensaje : undefined}
            {...props}
        >
            {opciones.map((opcion) => (
            <option key={opcion.valor} value={opcion.valor}>
                {opcion.texto}
            </option>
            ))}
        </select>
        {error ? (
            <p className="field__error" id={idMensaje} role="alert">{error}</p>
        ) : (
            hint && <p className="field__hint" id={idMensaje}>{hint}</p>
        )}
        </div>
    );
}