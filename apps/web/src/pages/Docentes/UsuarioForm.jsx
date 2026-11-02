import { useRef, useState } from 'react';
import Alert from '../../components/Alert/Alert';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import Select from '../../components/Select/Select';

const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LARGO_MINIMO_PASSWORD = 8;
const LARGO_MAXIMO_PASSWORD = 128;

const OPCIONES_ROL = [
    { valor: 'docente', texto: 'Docente' },
    { valor: 'administrador', texto: 'Administrador' },
];

const VACIO = {
    nombres: '',
    apellidos: '',
    correo: '',
    rol: 'docente',
    sede: '',
    programa: '',
    password: '',
};

function desdeUsuario(usuario) {
    if (!usuario) return VACIO;
    return {
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
        rol: usuario.rol,
        sede: usuario.sede ?? '',
        programa: usuario.programa ?? '',
        password: '',
    };
}


function validar(valores, editando) {
    const errores = {};

    if (!valores.nombres.trim()) errores.nombres = 'Escribe los nombres.';
    else if (valores.nombres.trim().length > 100) errores.nombres = 'Los nombres no pueden superar los 100 caracteres.';

    if (!valores.apellidos.trim()) errores.apellidos = 'Escribe los apellidos.';
    else if (valores.apellidos.trim().length > 100) errores.apellidos = 'Los apellidos no pueden superar los 100 caracteres.';

    const correo = valores.correo.trim();
    if (!correo) errores.correo = 'Escribe el correo institucional.';
    else if (!REGEX_CORREO.test(correo)) errores.correo = 'El correo no tiene un formato válido.';

    if (valores.sede.length > 100) errores.sede = 'La sede no puede superar los 100 caracteres.';
    if (valores.programa.length > 100) errores.programa = 'El programa no puede superar los 100 caracteres.';

    const { password } = valores;
    if (!editando && password === '') {
        errores.password = 'Escribe una contraseña inicial.';
    } else if (
        password !== '' &&
        (password.length < LARGO_MINIMO_PASSWORD || password.length > LARGO_MAXIMO_PASSWORD)
    ) {
        errores.password = `La contraseña debe tener entre ${LARGO_MINIMO_PASSWORD} y ${LARGO_MAXIMO_PASSWORD} caracteres.`;
    }

    return errores;
}

function aDatosApi(valores) {
    return {
        nombres: valores.nombres.trim(),
        apellidos: valores.apellidos.trim(),
        correo: valores.correo.trim(),
        rol: valores.rol,
        sede: valores.sede.trim(),
        programa: valores.programa.trim(),
        password: valores.password,
    };
}

export default function UsuarioForm({ usuario, esPropio = false, onGuardar, onCancelar }) {
    const formularioRef = useRef(null);
    const [valores, setValores] = useState(() => desdeUsuario(usuario));
    const [errores, setErrores] = useState({});
    const [errorServidor, setErrorServidor] = useState('');
    const [enviando, setEnviando] = useState(false);

    const editando = usuario !== null;

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

        const encontrados = validar(valores, editando);
        setErrores(encontrados);
        if (Object.keys(encontrados).length > 0) {
        requestAnimationFrame(() =>
            formularioRef.current?.querySelector('[aria-invalid="true"]')?.focus(),
        );
        return;
        }

        setEnviando(true);
        try {
        await onGuardar(aDatosApi(valores));
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
            <Input
            label="Nombres"
            required
            autoComplete="off"
            value={valores.nombres}
            onChange={alCambiar('nombres')}
            error={errores.nombres}
            autoFocus
            />

            <Input
            label="Apellidos"
            required
            autoComplete="off"
            value={valores.apellidos}
            onChange={alCambiar('apellidos')}
            error={errores.apellidos}
            />

            <div className="form-grid__full">
            <Input
                label="Correo institucional"
                type="email"
                required
                autoComplete="off"
                value={valores.correo}
                onChange={alCambiar('correo')}
                error={errores.correo}
            />
            </div>

            <Select
            label="Rol"
            required
            opciones={OPCIONES_ROL}
            value={valores.rol}
            onChange={alCambiar('rol')}
            disabled={esPropio}
            hint={esPropio ? 'No puedes cambiar tu propio rol.' : undefined}
            />

            <Input
            label="Sede"
            value={valores.sede}
            onChange={alCambiar('sede')}
            error={errores.sede}
            />

            <div className="form-grid__full">
            <Input
                label="Programa"
                value={valores.programa}
                onChange={alCambiar('programa')}
                error={errores.programa}
            />
            </div>

            <div className="form-grid__full">
            <Input
                label={editando ? 'Contraseña nueva' : 'Contraseña inicial'}
                type="password"
                required={!editando}
                autoComplete="new-password"
                value={valores.password}
                onChange={alCambiar('password')}
                error={errores.password}
                hint={
                editando
                    ? 'Déjala vacía para conservar la actual.'
                    : `Entre ${LARGO_MINIMO_PASSWORD} y ${LARGO_MAXIMO_PASSWORD} caracteres.`
                }
            />
            </div>
        </div>

        <div className="form-actions">
            <Button variant="secondary" onClick={onCancelar} disabled={enviando}>
            Cancelar
            </Button>
            <Button type="submit" disabled={enviando}>
            {enviando ? 'Guardando...' : editando ? 'Guardar cambios' : 'Crear usuario'}
            </Button>
        </div>
        </form>
    );
}