import { ValidationError } from "../errors/AppError.js";

const ID_MAXIMO = 2147483647;

export function textoObligatorio(valor, nombreCampo, maximo) {
    const texto = typeof valor === "string" ? valor.trim() : "";
    if (!texto) {
        throw new ValidationError(`${nombreCampo} es obligatorio`);
    }
    if (texto.length > maximo) {
        throw new ValidationError(
        `${nombreCampo} no puede superar los ${maximo} caracteres`,
        );
    }
    return texto;
}

export function textoOpcional(valor, nombreCampo, maximo) {
    if (valor === undefined || valor === null) return null;
    if (typeof valor !== "string") {
        throw new ValidationError(`${nombreCampo} no es válido`);
    }
    const texto = valor.trim();
    if (!texto) return null;
    if (texto.length > maximo) {
        throw new ValidationError(
        `${nombreCampo} no puede superar los ${maximo} caracteres`,
        );
    }
    return texto;
}

export function enteroPositivo(valor, nombreCampo, maximo) {
    const numero =
        typeof valor === "string" && valor.trim() !== "" ? Number(valor) : valor;
    if (!Number.isInteger(numero) || numero <= 0) {
        throw new ValidationError(
        `${nombreCampo} debe ser un número entero mayor que 0`,
        );
    }
    if (numero > maximo) {
        throw new ValidationError(`${nombreCampo} no puede ser mayor que ${maximo}`);
    }
    return numero;
}

export function fechaOpcional(valor, nombreCampo) {
    if (valor === undefined || valor === null || valor === "") return null;
    if (typeof valor !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
        throw new ValidationError(`${nombreCampo} debe tener el formato AAAA-MM-DD`);
    }
    const fecha = new Date(`${valor}T00:00:00Z`);
    if (Number.isNaN(fecha.getTime()) || fecha.toISOString().slice(0, 10) !== valor) {
        throw new ValidationError(`${nombreCampo} no es una fecha válida`);
    }
    return valor;
}

export function booleano(valor, nombreCampo) {
    if (typeof valor !== "boolean") {
        throw new ValidationError(`${nombreCampo} debe ser verdadero o falso`);
    }
    return valor;
}

export function idDesdeParametro(valor) {
    const id = Number(valor);
    if (!Number.isInteger(id) || id <= 0 || id > ID_MAXIMO) {
        throw new ValidationError("El identificador no es válido");
    }
    return id;
}

export function busquedaDesdeQuery(valor) {
    const texto = typeof valor === "string" ? valor.trim() : "";
    if (texto.length > 100) {
        throw new ValidationError("La búsqueda no puede superar los 100 caracteres");
    }
    return texto;
}

export function escaparLike(texto) {
    return texto.replace(/[\\%_]/g, "\\$&");
}