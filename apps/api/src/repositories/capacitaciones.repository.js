import { query } from "../config/db.js";
import { escaparLike } from "../utils/validacion.js";

const COLUMNAS = `id, titulo, descripcion, duracion_horas, instructor, sede, programa,
    to_char(fecha_inicio, 'YYYY-MM-DD') AS fecha_inicio,
    to_char(fecha_fin, 'YYYY-MM-DD') AS fecha_fin,
    activa, creado_en`;

export async function listar(busqueda = "") {
    const patron = busqueda ? `%${escaparLike(busqueda)}%` : null;
    const resultado = await query(
        `SELECT ${COLUMNAS}
        FROM capacitaciones
        WHERE ($1::text IS NULL OR titulo ILIKE $1)
        ORDER BY creado_en DESC, id DESC`,
        [patron],
    );
    return resultado.rows;
}

export async function buscarPorId(id) {
    const resultado = await query(
        `SELECT ${COLUMNAS}
        FROM capacitaciones
        WHERE id = $1`,
        [id],
    );
    return resultado.rows[0] ?? null;
}

export async function crear({
    titulo,
    descripcion,
    duracionHoras,
    instructor,
    sede,
    programa,
    fechaInicio,
    fechaFin,
}) {
    const resultado = await query(
        `INSERT INTO capacitaciones
            (titulo, descripcion, duracion_horas, instructor, sede, programa, fecha_inicio, fecha_fin)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING ${COLUMNAS}`,
        [titulo, descripcion, duracionHoras, instructor, sede, programa, fechaInicio, fechaFin],
    );
    return resultado.rows[0];
}

export async function actualizar(
    id,
    { titulo, descripcion, duracionHoras, instructor, sede, programa, fechaInicio, fechaFin },
) {
    const resultado = await query(
        `UPDATE capacitaciones
            SET titulo = $2,
                descripcion = $3,
                duracion_horas = $4,
                instructor = $5,
                sede = $6,
                programa = $7,
                fecha_inicio = $8,
                fecha_fin = $9
        WHERE id = $1
        RETURNING ${COLUMNAS}`,
        [id, titulo, descripcion, duracionHoras, instructor, sede, programa, fechaInicio, fechaFin],
    );
    return resultado.rows[0] ?? null;
}

export async function cambiarEstado(id, activa) {
    const resultado = await query(
        `UPDATE capacitaciones
            SET activa = $2
        WHERE id = $1
        RETURNING ${COLUMNAS}`,
        [id, activa],
    );
    return resultado.rows[0] ?? null;
}