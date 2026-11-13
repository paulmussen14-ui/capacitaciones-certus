import { useEffect, useId, useRef, useState } from 'react';
import Button from '../Button/Button';
import './ImagenInput.css';

const TIPOS = ['image/jpeg', 'image/png', 'image/webp'];
const TAMANO_MAXIMO = 2 * 1024 * 1024;

// Elige una imagen y la muestra antes de guardar.
// Avisa al formulario con onChange({ archivo, quitar }); la subida la hace la pantalla.
export default function ImagenInput({ label, actual = null, forma = 'rect', onChange }) {
    const idCampo = useId();
    const entradaRef = useRef(null);
    const vistaRef = useRef(null);
    const [vista, setVista] = useState(null);
    const [quitada, setQuitada] = useState(false);
    const [error, setError] = useState('');

    useEffect(
        () => () => {
        if (vistaRef.current) URL.revokeObjectURL(vistaRef.current);
        },
        [],
    );

    function soltarVista() {
        if (vistaRef.current) URL.revokeObjectURL(vistaRef.current);
        vistaRef.current = null;
    }

    function elegir(evento) {
        const archivo = evento.target.files?.[0];
        evento.target.value = '';
        if (!archivo) return;

        if (!TIPOS.includes(archivo.type)) {
        setError('Elige una imagen JPG, PNG o WebP.');
        return;
        }
        if (archivo.size > TAMANO_MAXIMO) {
        setError('La imagen no puede superar los 2 MB.');
        return;
        }

        setError('');
        soltarVista();
        vistaRef.current = URL.createObjectURL(archivo);
        setVista(vistaRef.current);
        setQuitada(false);
        onChange({ archivo, quitar: false });
    }

    function quitar() {
        setError('');
        soltarVista();
        setVista(null);
        setQuitada(true);
        onChange({ archivo: null, quitar: Boolean(actual) });
    }

    const origen = vista ?? (quitada ? null : actual);

    return (
        <div className="imagen-input">
        <span className="field__label" id={`${idCampo}-label`}>{label}</span>

        <div className="imagen-input__fila">
            <div
            className={`imagen-input__vista imagen-input__vista--${forma}`}
            aria-hidden={!origen}
            >
            {origen ? <img src={origen} alt="Vista previa" /> : <span>Sin imagen</span>}
            </div>

            <div className="imagen-input__acciones">
            <input
                ref={entradaRef}
                id={idCampo}
                className="sr-only"
                type="file"
                accept={TIPOS.join(',')}
                aria-labelledby={`${idCampo}-label`}
                onChange={elegir}
            />
            <Button variant="secondary" size="sm" onClick={() => entradaRef.current?.click()}>
                {origen ? 'Cambiar' : 'Elegir imagen'}
            </Button>
            {origen && (
                <Button variant="ghost" size="sm" onClick={quitar}>
                Quitar
                </Button>
            )}
            <p className="field__hint">JPG, PNG o WebP. Máximo 2 MB.</p>
            </div>
        </div>

        {error && <p className="field__error" role="alert">{error}</p>}
        </div>
    );
}
