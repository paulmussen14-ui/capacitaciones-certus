import { useState } from 'react';
import Alert from '../../components/Alert/Alert';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import { eliminarCapacitacion } from '../../services/capacitaciones';

// Pide la clave del administrador siempre. Si la capacitación ya tiene docentes
// asignados, el servidor no la elimina y aquí se sugiere desactivarla.
export default function EliminarCapacitacion({ capacitacion, onEliminada, onDesactivar, onCancelar }) {
    const [password, setPassword] = useState('');
    const [errorClave, setErrorClave] = useState('');
    const [bloqueo, setBloqueo] = useState('');
    const [errorGeneral, setErrorGeneral] = useState('');
    const [enviando, setEnviando] = useState(false);

    async function confirmar(evento) {
        evento.preventDefault();
        setErrorClave('');
        setErrorGeneral('');

        if (!password) {
        setErrorClave('Escribe tu clave de administrador.');
        return;
        }

        setEnviando(true);
        try {
        await eliminarCapacitacion(capacitacion.id, password);
        onEliminada();
        } catch (error) {
        if (error.codigo === 'CONFLICT') setBloqueo(error.message);
        else if (error.codigo === 'FORBIDDEN') setErrorClave(error.message);
        else setErrorGeneral(error.message);
        setEnviando(false);
        }
    }

    if (bloqueo) {
        return (
        <>
            <Alert tono="info">{bloqueo}</Alert>
            <div className="form-actions">
            <Button variant="secondary" onClick={onCancelar}>
                Cerrar
            </Button>
            {capacitacion.activa && (
                <Button onClick={() => onDesactivar(capacitacion)}>Desactivar en su lugar</Button>
            )}
            </div>
        </>
        );
    }

    return (
        <form onSubmit={confirmar} noValidate>
        {errorGeneral && (
            <div className="form-error">
            <Alert>{errorGeneral}</Alert>
            </div>
        )}

        <p>
            Vas a eliminar <strong>{capacitacion.titulo}</strong>. Esta acción no se puede deshacer.
            Solo se elimina si no tiene docentes asignados.
        </p>

        <Input
            label="Tu clave de administrador"
            type="password"
            required
            autoComplete="current-password"
            autoFocus
            value={password}
            onChange={(evento) => {
            setPassword(evento.target.value);
            setErrorClave('');
            }}
            error={errorClave}
        />

        <div className="form-actions">
            <Button variant="secondary" onClick={onCancelar} disabled={enviando}>
            Cancelar
            </Button>
            <Button type="submit" variant="danger" disabled={enviando}>
            {enviando ? 'Eliminando...' : 'Eliminar'}
            </Button>
        </div>
        </form>
    );
}
