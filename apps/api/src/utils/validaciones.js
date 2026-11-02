import { ValidationError } from "../errors/AppError.js";

const ID_MAXIMO = 2147483647;

export function parsearId(valor) {
    if (typeof valor !== "string" || !/^\d+$/.test(valor)) {
        throw new ValidationError("El id no es válido");
    }
    const id = Number(valor);
    if (id < 1 || id > ID_MAXIMO) {
        throw new ValidationError("El id no es válido");
    }
    return id;
}

export function exigirObjeto(cuerpo) {
    if (cuerpo === null || typeof cuerpo !== "object" || Array.isArray(cuerpo)) {
        throw new ValidationError("El cuerpo de la petición debe ser un objeto JSON");
    }
    return cuerpo;
}

export function textoObligatorio(valor, campo, max) {
    if (typeof valor !== "string" || valor.trim() === "") {
        throw new ValidationError(`${campo} es obligatorio`);
    }
    const texto = valor.trim();
    if (texto.length > max) {
        throw new ValidationError(`${campo} no puede superar ${max} caracteres`);
    }
    return texto;
    }

export function textoOpcional(valor, campo, max) {
    if (valor === undefined || valor === null) return null;
    if (typeof valor !== "string") {
        throw new ValidationError(`${campo} debe ser texto`);
    }
    const texto = valor.trim();
    if (texto === "") return null;
    if (texto.length > max) {
        throw new ValidationError(`${campo} no puede superar ${max} caracteres`);
    }
    return texto;
}

export function fechaOpcional(valor, campo) {
    if (valor === undefined || valor === null || valor === "") return null;
    if (typeof valor !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
        throw new ValidationError(`${campo} debe tener el formato AAAA-MM-DD`);
    }
    const fecha = new Date(`${valor}T00:00:00Z`);
    if (Number.isNaN(fecha.getTime()) || fecha.toISOString().slice(0, 10) !== valor) {
        throw new ValidationError(`${campo} no es una fecha válida`);
    }
    return valor;
}

export function enteroPositivo(valor, campo, max) {
    const numero =
        typeof valor === "string" && /^\d+$/.test(valor.trim())
        ? Number(valor.trim())
        : valor;
    if (!Number.isInteger(numero) || numero < 1) {
        throw new ValidationError(`${campo} debe ser un número entero mayor que 0`);
    }
    if (numero > max) {
        throw new ValidationError(`${campo} no puede superar ${max}`);
    }
    return numero;
}