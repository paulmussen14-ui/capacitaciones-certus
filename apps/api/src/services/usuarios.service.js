import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import {
    ConflictError,
    ForbiddenError,
    NotFoundError,
    ValidationError,
} from "../errors/AppError.js";
import * as usuariosRepository from "../repositories/usuarios.repository.js";
import { borrarImagen, guardarImagen } from "../utils/imagenes.js";
import {
    booleano,
    busquedaDesdeQuery,
    textoObligatorio,
    textoOpcional,
} from "../utils/validacion.js";

const ROLES = ["docente", "administrador"];
const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LARGO_MINIMO_PASSWORD = 8;
const LARGO_MAXIMO_PASSWORD = 128;
const CODIGO_PG_DUPLICADO = "23505";

function validarCorreo(valor) {
    const correo = typeof valor === "string" ? valor.trim().toLowerCase() : "";
    if (!correo) {
        throw new ValidationError("El correo es obligatorio");
    }
    if (correo.length > 150 || !REGEX_CORREO.test(correo)) {
        throw new ValidationError("El correo no tiene un formato válido");
    }
    if (!correo.endsWith(`@${env.allowedEmailDomain}`)) {
        throw new ValidationError(
        `Solo se permiten correos institucionales (@${env.allowedEmailDomain})`,
        );
    }
    return correo;
}

function validarPassword(valor) {
    if (
        typeof valor !== "string" ||
        valor.length < LARGO_MINIMO_PASSWORD ||
        valor.length > LARGO_MAXIMO_PASSWORD
    ) {
        throw new ValidationError(
        `La contraseña debe tener entre ${LARGO_MINIMO_PASSWORD} y ${LARGO_MAXIMO_PASSWORD} caracteres`,
        );
    }
    return valor;
}

function validarDatos(datos) {
    const d = datos ?? {};

    if (!ROLES.includes(d.rol)) {
        throw new ValidationError("El rol debe ser docente o administrador");
    }

    return {
        nombres: textoObligatorio(d.nombres, "Los nombres", 100),
        apellidos: textoObligatorio(d.apellidos, "Los apellidos", 100),
        correo: validarCorreo(d.correo),
        rol: d.rol,
        sede: textoOpcional(d.sede, "La sede", 100),
        programa: textoOpcional(d.programa, "El programa", 100),
    };
}

// Convierte el choque con la restricción UNIQUE de PostgreSQL en un 409 legible
function traducirDuplicado(error) {
    if (error?.code === CODIGO_PG_DUPLICADO) {
        return new ConflictError("Ya existe un usuario con ese correo");
    }
    return error;
}

export function listar(busqueda) {
    return usuariosRepository.listar(busquedaDesdeQuery(busqueda));
}

export async function obtener(id) {
    const usuario = await usuariosRepository.buscarPorId(id);
    if (!usuario) throw new NotFoundError("Usuario no encontrado");
    return usuario;
}

export async function crear(datos) {
    const usuario = validarDatos(datos);
    const password = validarPassword(datos?.password);

    if (await usuariosRepository.buscarPorCorreo(usuario.correo)) {
        throw new ConflictError("Ya existe un usuario con ese correo");
    }

    try {
        return await usuariosRepository.crear({
        ...usuario,
        passwordHash: await bcrypt.hash(password, 10),
        });
    } catch (error) {
        throw traducirDuplicado(error);
    }
}

export async function actualizar(id, datos, usuarioActual) {
    const existente = await usuariosRepository.buscarPorId(id);
    if (!existente) throw new NotFoundError("Usuario no encontrado");

    const usuario = validarDatos(datos);

    // Evita que el administrador se quite a sí mismo el acceso al panel
    if (id === usuarioActual.id && usuario.rol !== existente.rol) {
        throw new ForbiddenError("No puedes cambiar tu propio rol");
    }

    const otro = await usuariosRepository.buscarPorCorreo(usuario.correo);
    if (otro && otro.id !== id) {
        throw new ConflictError("Ya existe un usuario con ese correo");
    }

    const nuevaPassword = datos?.password;
    const hayPassword = typeof nuevaPassword === "string" && nuevaPassword !== "";
    const passwordHash = hayPassword
        ? await bcrypt.hash(validarPassword(nuevaPassword), 10)
        : null;

    try {
        return await usuariosRepository.actualizar(id, { ...usuario, passwordHash });
    } catch (error) {
        throw traducirDuplicado(error);
    }
}

export async function cambiarEstado(id, datos, usuarioActual) {
    const activo = booleano(datos?.activo, "El estado (activo)");

    if (id === usuarioActual.id && !activo) {
        throw new ForbiddenError("No puedes desactivar tu propia cuenta");
    }

    const usuario = await usuariosRepository.cambiarEstado(id, activo);
    if (!usuario) throw new NotFoundError("Usuario no encontrado");
    return usuario;
}

export async function subirFoto(id, archivo) {
    if (!archivo) throw new ValidationError("Selecciona una imagen");

    const existente = await usuariosRepository.buscarPorId(id);
    if (!existente) throw new NotFoundError("Usuario no encontrado");

    const url = await guardarImagen(archivo.buffer, "usuarios");
    const usuario = await usuariosRepository.actualizarFoto(id, url);
    await borrarImagen(existente.foto_url);
    return usuario;
}

export async function quitarFoto(id) {
    const existente = await usuariosRepository.buscarPorId(id);
    if (!existente) throw new NotFoundError("Usuario no encontrado");

    const usuario = await usuariosRepository.actualizarFoto(id, null);
    await borrarImagen(existente.foto_url);
    return usuario;
}


export async function capacitacionesDe(id) {
    const existente = await usuariosRepository.buscarPorId(id);
    if (!existente) throw new NotFoundError("Usuario no encontrado");
    return usuariosRepository.capacitacionesDeUsuario(id);
}
