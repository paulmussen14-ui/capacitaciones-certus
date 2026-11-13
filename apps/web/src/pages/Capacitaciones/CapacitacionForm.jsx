import { useRef, useState } from 'react';
import Alert from '../../components/Alert/Alert';
import Button from '../../components/Button/Button';
import ImagenInput from '../../components/ImagenInput/ImagenInput';
import Input from '../../components/Input/Input';

const VACIO = {
    titulo: '',
    descripcion: '',
    duracion_horas: '',
    instructor: '',
    sede: '',
    programa: '',
    fecha_inicio: '',
    fecha_fin: '',
};

function desdeCapacitacion(capacitacion) {
    if (!capacitacion) return VACIO;
    return {
        titulo: capacitacion.titulo,
        descripcion: capacitacion.descripcion ?? '',
        duracion_horas: String(capacitacion.duracion_horas),
        instructor: capacitacion.instructor ?? '',
        sede: capacitacion.sede ?? '',
        programa: capacitacion.programa ?? '',
        fecha_inicio: capacitacion.fecha_inicio ?? '',
        fecha_fin: capacitacion.fecha_fin ?? '',
    };
}

function validar(valores) {
    const errores = {};

    const titulo = valores.titulo.trim();
    if (!titulo) errores.titulo = 'Escribe el título de la capacitación.';
    else if (titulo.length > 200) errores.titulo = 'El título no puede superar los 200 caracteres.';

    const horas = Number(valores.duracion_horas);
    if (valores.duracion_horas.trim() === '') {
        errores.duracion_horas = 'Indica la duración en horas.';
    } else if (!Number.isInteger(horas) || horas <= 0) {
        errores.duracion_horas = 'La duración debe ser un número entero mayor que 0.';
    } else if (horas > 1000) {
        errores.duracion_horas = 'La duración no puede ser mayor que 1000 horas.';
    }

    if (valores.descripcion.length > 2000) errores.descripcion = 'La descripción no puede superar los 2000 caracteres.';
    if (valores.instructor.length > 150) errores.instructor = 'El instructor no puede superar los 150 caracteres.';
    if (valores.sede.length > 100) errores.sede = 'La sede no puede superar los 100 caracteres.';
    if (valores.programa.length > 100) errores.programa = 'El programa no puede superar los 100 caracteres.';

    if (valores.fecha_inicio && valores.fecha_fin && valores.fecha_fin < valores.fecha_inicio) {
        errores.fecha_fin = 'La fecha de fin no puede ser anterior a la fecha de inicio.';
    }

    return errores;
}

function aDatosApi(valores) {
    return {
        titulo: valores.titulo.trim(),
        descripcion: valores.descripcion.trim(),
        duracion_horas: Number(valores.duracion_horas),
        instructor: valores.instructor.trim(),
        sede: valores.sede.trim(),
        programa: valores.programa.trim(),
        fecha_inicio: valores.fecha_inicio || null,
        fecha_fin: valores.fecha_fin || null,
    };
}

export default function CapacitacionForm({ capacitacion, onGuardar, onCancelar }) {
    const formularioRef = useRef(null);
    const [valores, setValores] = useState(() => desdeCapacitacion(capacitacion));
    const [errores, setErrores] = useState({});
    const [errorServidor, setErrorServidor] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [imagen, setImagen] = useState(null);

    const editando = capacitacion !== null;

    function alCambiar(campo) {
        return (evento) => {
        const valor = evento.target.value;
        setValores((actuales) => ({ ...actuales, [campo]: valor }));
        setErrores((actuales) => ({ ...actuales, [campo]: undefined }));
        };
    }

    async function alEnviar(evento) {
        evento.preventDefault();
        setErrorServidor('');

        const encontrados = validar(valores);
        setErrores(encontrados);
        if (Object.keys(encontrados).length > 0) {
        // Lleva el cursor al primer campo con error, cuando ya se pintó el mensaje
        requestAnimationFrame(() =>
            formularioRef.current?.querySelector('[aria-invalid="true"]')?.focus(),
        );
        return;
        }

        setEnviando(true);
        try {
        await onGuardar(aDatosApi(valores), imagen);
        } catch (error) {
        setErrorServidor(error.message);
        setEnviando(false);
        }
    }

    return (
        <form ref={formularioRef} onSubmit={alEnviar} noValidate>
        {errorServidor && (
            <div className="form-error">
            <Alert>{errorServidor}</Alert>
            </div>
        )}

        <div className="form-grid">
            <div className="form-grid__full">
            <ImagenInput
                label="Imagen de la capacitación"
                actual={capacitacion?.imagen_url ?? null}
                onChange={setImagen}
            />
            </div>

            <div className="form-grid__full">
            <Input
                label="Título"
                required
                value={valores.titulo}
                onChange={alCambiar('titulo')}
                error={errores.titulo}
                autoFocus
            />
            </div>

            <div className="form-grid__full">
            <Input
                label="Descripción"
                multiline
                value={valores.descripcion}
                onChange={alCambiar('descripcion')}
                error={errores.descripcion}
            />
            </div>

            <Input
            label="Duración (horas)"
            type="number"
            min="1"
            step="1"
            inputMode="numeric"
            required
            value={valores.duracion_horas}
            onChange={alCambiar('duracion_horas')}
            error={errores.duracion_horas}
            />

            <Input
            label="Instructor"
            value={valores.instructor}
            onChange={alCambiar('instructor')}
            error={errores.instructor}
            />

            <Input
            label="Sede"
            value={valores.sede}
            onChange={alCambiar('sede')}
            error={errores.sede}
            />

            <Input
            label="Programa"
            value={valores.programa}
            onChange={alCambiar('programa')}
            error={errores.programa}
            />

            <Input
            label="Fecha de inicio"
            type="date"
            value={valores.fecha_inicio}
            onChange={alCambiar('fecha_inicio')}
            error={errores.fecha_inicio}
            />

            <Input
            label="Fecha de fin"
            type="date"
            value={valores.fecha_fin}
            onChange={alCambiar('fecha_fin')}
            error={errores.fecha_fin}
            />
        </div>

        <div className="form-actions">
            <Button variant="secondary" onClick={onCancelar} disabled={enviando}>
            Cancelar
            </Button>
            <Button type="submit" disabled={enviando}>
            {enviando ? 'Guardando...' : editando ? 'Guardar cambios' : 'Crear capacitación'}
            </Button>
        </div>
        </form>
    );
}