import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import {
    ConflictError,
    ForbiddenError,
    NotFoundError,
    ValidationError,
} from "../errors/AppError.js";
import * as usuariosRepository from "../repositories/usuarios.repository.js";
import {
    exigirObjeto,
    parsearId,
    textoObligatorio,
    textoOpcional,
} from "../utils/validaciones.js";

const ROLES = ["docente", "administrador"];
const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_BUSQUEDA = 100;

function validarCorreo(valor) {
    const correo = textoObligatorio(valor, "El correo", 150).toLowerCase();
    if (!REGEX_CORREO.test(correo)) {
        throw new ValidationError("El correo no tiene un formato válido");
    }
    if (!correo.endsWith(`@${env.allowedEmailDomain}`)) {
        throw new ValidationError(
        `Solo se permiten correos institucionales (@${env.allowedEmailDomain})`,
        );
    }
    return correo;
}

function validarRol(valor) {
    if (!ROLES.includes(valor)) {
        throw new ValidationError("El rol debe ser docente o administrador");
    }
    return valor;
}

function validarPassword(valor) {
    if (typeof valor !== "string" || valor.length < 8) {
        throw new ValidationError("La contraseña debe tener al menos 8 caracteres");
    }
    if (Buffer.byteLength(valor, "utf8") > 72) {
        throw new ValidationError("La contraseña es demasiado larga (máximo 72 caracteres)");
    }
    return valor;
}

function validarPerfil(cuerpo) {
    const datos = exigirObjeto(cuerpo);
    return {
        nombres: textoObligatorio(datos.nombres, "Los nombres", 100),
        apellidos: textoObligatorio(datos.apellidos, "Los apellidos", 100),
        correo: validarCorreo(datos.correo),
        rol: validarRol(datos.rol),
        sede: textoOpcional(datos.sede, "La sede", 100),
        programa: textoOpcional(datos.programa, "El programa", 100),
    };
}


function traducirErrorDeBase(error) {
    if (error?.code === "23505") {
        return new ConflictError("Ya existe un usuario con ese correo");
    }
    return error;
}

export async function listar({ buscar, rol } = {}) {
    if (buscar !== undefined && typeof buscar !== "string") {
        throw new ValidationError("El texto de búsqueda no es válido");
    }
    if (rol !== undefined && rol !== "") {
        validarRol(rol);
    }
    return usuariosRepository.listar({
        buscar: (buscar ?? "").trim().slice(0, MAX_BUSQUEDA),
        rol: rol || undefined,
    });
}

export async function crear(cuerpo) {
    const perfil = validarPerfil(cuerpo);
    const password = validarPassword(cuerpo.password);
    const passwordHash = await bcrypt.hash(password, 10);

    try {
        return await usuariosRepository.crear({ ...perfil, passwordHash });
    } catch (error) {
        throw traducirErrorDeBase(error);
    }
}


export async function actualizar(idTexto, cuerpo, actor) {
    const id = parsearId(idTexto);
    const perfil = validarPerfil(cuerpo);

    // Evita que un administrador se quite a sí mismo el acceso al panel
    if (id === actor.id && perfil.rol !== actor.rol) {
        throw new ForbiddenError("No puedes cambiar tu propio rol");
    }

    let usuario;
    try {
        usuario = await usuariosRepository.actualizar(id, perfil);
    } catch (error) {
        throw traducirErrorDeBase(error);
    }
    if (!usuario) {
        throw new NotFoundError("Usuario no encontrado");
    }
    return usuario;
}

export async function cambiarEstado(idTexto, cuerpo, actor) {
    const id = parsearId(idTexto);
    const datos = exigirObjeto(cuerpo);
    if (typeof datos.activo !== "boolean") {
        throw new ValidationError("El campo activo debe ser true o false");
    }

    // Evita que un administrador desactive su propia cuenta y deje el sistema sin gestor
    if (id === actor.id && datos.activo === false) {
        throw new ForbiddenError("No puedes desactivar tu propia cuenta");
    }

    const usuario = await usuariosRepository.cambiarEstado(id, datos.activo);
    if (!usuario) {
        throw new NotFoundError("Usuario no encontrado");
    }
    return usuario;
}