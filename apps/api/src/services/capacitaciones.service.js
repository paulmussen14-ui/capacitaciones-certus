import { NotFoundError, ValidationError } from "../errors/AppError.js";
import * as capacitacionesRepository from "../repositories/capacitaciones.repository.js";
import {
    booleano,
    busquedaDesdeQuery,
    enteroPositivo,
    fechaOpcional,
    textoObligatorio,
    textoOpcional,
} from "../utils/validacion.js";

function validarDatos(datos) {
    const d = datos ?? {};

    const capacitacion = {
        titulo: textoObligatorio(d.titulo, "El título", 200),
        descripcion: textoOpcional(d.descripcion, "La descripción", 2000),
        duracionHoras: enteroPositivo(d.duracion_horas, "La duración en horas", 1000),
        instructor: textoOpcional(d.instructor, "El instructor", 150),
        sede: textoOpcional(d.sede, "La sede", 100),
        programa: textoOpcional(d.programa, "El programa", 100),
        fechaInicio: fechaOpcional(d.fecha_inicio, "La fecha de inicio"),
        fechaFin: fechaOpcional(d.fecha_fin, "La fecha de fin"),
    };

    if (
        capacitacion.fechaInicio &&
        capacitacion.fechaFin &&
        capacitacion.fechaFin < capacitacion.fechaInicio
    ) {
        throw new ValidationError(
        "La fecha de fin no puede ser anterior a la fecha de inicio",
        );
    }

    return capacitacion;
}

export function listar(busqueda) {
    return capacitacionesRepository.listar(busquedaDesdeQuery(busqueda));
}

export async function obtener(id) {
    const capacitacion = await capacitacionesRepository.buscarPorId(id);
    if (!capacitacion) throw new NotFoundError("Capacitación no encontrada");
    return capacitacion;
}

export function crear(datos) {
    return capacitacionesRepository.crear(validarDatos(datos));
}

export async function actualizar(id, datos) {
    const capacitacion = await capacitacionesRepository.actualizar(
        id,
        validarDatos(datos),
    );
    if (!capacitacion) throw new NotFoundError("Capacitación no encontrada");
    return capacitacion;
}

export async function cambiarEstado(id, datos) {
    const activa = booleano(datos?.activa, "El estado (activa)");
    const capacitacion = await capacitacionesRepository.cambiarEstado(id, activa);
    if (!capacitacion) throw new NotFoundError("Capacitación no encontrada");
    return capacitacion;
}