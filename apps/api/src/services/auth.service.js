import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { UnauthorizedError, ValidationError } from "../errors/AppError.js";
import * as usuariosRepository from "../repositories/usuarios.repository.js";

const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LARGO_MAXIMO_PASSWORD = 128;

const HASH_RELLENO = bcrypt.hashSync("relleno-que-no-es-una-clave", 10);

function normalizarCorreo(correo) {
    return typeof correo === "string" ? correo.trim().toLowerCase() : "";
}

function validarEntrada(correo, password) {
    if (!correo || typeof password !== "string" || password.length === 0) {
        throw new ValidationError("Correo y contraseña son obligatorios");
    }
    if (!REGEX_CORREO.test(correo)) {
        throw new ValidationError("El correo no tiene un formato válido");
    }
    if (!correo.endsWith(`@${env.allowedEmailDomain}`)) {
        throw new ValidationError(
        `Solo se permiten correos institucionales (@${env.allowedEmailDomain})`,
        );
    }
}


function aPublico(usuario) {
    const { password_hash: _passwordHash, ...publico } = usuario;
    return publico;
}

export async function iniciarSesion({ correo, password }) {
    const correoNormalizado = normalizarCorreo(correo);
    validarEntrada(correoNormalizado, password);


    if (password.length > LARGO_MAXIMO_PASSWORD) {
        throw new UnauthorizedError("Credenciales inválidas");
    }

    const usuario = await usuariosRepository.buscarPorCorreo(correoNormalizado);
    const coincide = await bcrypt.compare(
        password,
        usuario?.password_hash ?? HASH_RELLENO,
    );

    if (!usuario || !usuario.activo || !coincide) {
        throw new UnauthorizedError("Credenciales inválidas");
    }

    const token = jwt.sign({ rol: usuario.rol }, env.session.secret, {
        algorithm: "HS256",
        subject: String(usuario.id),
        expiresIn: `${env.session.hours}h`,
    });

    return { token, usuario: aPublico(usuario) };
}

export async function usuarioDesdeToken(token) {
    let payload;
    try {
        payload = jwt.verify(token, env.session.secret, { algorithms: ["HS256"] });
    } catch {
        throw new UnauthorizedError("Sesión inválida o vencida");
    }

    const usuario = await usuariosRepository.buscarPorId(Number(payload.sub));
        if (!usuario || !usuario.activo) {
            throw new UnauthorizedError("Sesión inválida o vencida");
        }
        return usuario;
}