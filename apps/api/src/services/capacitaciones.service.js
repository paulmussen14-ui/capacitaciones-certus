import { NotFoundError, ValidationError } from "../errors/AppError.js";
import * as capacitacionesRepository from "../repositories/capacitaciones.repository.js";
import {
    enteroPositivo,
    exigirObjeto,
    fechaOpcional,
    parsearId,
    textoObligatorio,
    textoOpcional,
} from "../utils/validaciones.js";

const MAX_BUSQUEDA = 100;


function validarDatos(cuerpo) {
    const datos = exigirObjeto(cuerpo);

    const normalizado = {
        titulo: textoObligatorio(datos.titulo, "El título", 200),
        descripcion: textoOpcional(datos.descripcion, "La descripción", 2000),
        duracionHoras: enteroPositivo(datos.duracion_horas, "La duración (horas)", 1000),
        instructor: textoOpcional(datos.instructor, "El instructor", 150),
        sede: textoOpcional(datos.sede, "La sede", 100),
        programa: textoOpcional(datos.programa, "El programa", 100),
        fechaInicio: fechaOpcional(datos.fecha_inicio, "La fecha de inicio"),
        fechaFin: fechaOpcional(datos.fecha_fin, "La fecha de fin"),
    };

    if (
        normalizado.fechaInicio &&
        normalizado.fechaFin &&
        normalizado.fechaFin < normalizado.fechaInicio
    ) {
        throw new ValidationError(
        "La fecha de fin no puede ser anterior a la fecha de inicio",
        );
    }

    return normalizado;
}

export async function listar({ buscar } = {}) {
    if (buscar !== undefined && typeof buscar !== "string") {
        throw new ValidationError("El texto de búsqueda no es válido");
    }
    const texto = (buscar ?? "").trim().slice(0, MAX_BUSQUEDA);
    return capacitacionesRepository.listar({ buscar: texto });
}

export async function obtener(idTexto) {
    const id = parsearId(idTexto);
    const capacitacion = await capacitacionesRepository.buscarPorId(id);
    if (!capacitacion) {
        throw new NotFoundError("Capacitación no encontrada");
    }
    return capacitacion;
}

export async function crear(cuerpo) {
    const datos = validarDatos(cuerpo);
    return capacitacionesRepository.crear(datos);
}

export async function actualizar(idTexto, cuerpo) {
    const id = parsearId(idTexto);
    const datos = validarDatos(cuerpo);
    const capacitacion = await capacitacionesRepository.actualizar(id, datos);
    if (!capacitacion) {
        throw new NotFoundError("Capacitación no encontrada");
    }
    return capacitacion;
}

export async function cambiarEstado(idTexto, cuerpo) {
    const id = parsearId(idTexto);
    const datos = exigirObjeto(cuerpo);
    if (typeof datos.activa !== "boolean") {
        throw new ValidationError("El campo activa debe ser true o false");
    }
    const capacitacion = await capacitacionesRepository.cambiarEstado(
        id,
        datos.activa,
    );
    if (!capacitacion) {
        throw new NotFoundError("Capacitación no encontrada");
    }
    return capacitacion;
}