import { query } from "../config/db.js";

const COLUMNAS = `id, titulo, descripcion, duracion_horas, instructor, sede, programa,
    fecha_inicio::text AS fecha_inicio, fecha_fin::text AS fecha_fin, activa, creado_en`;


function escaparLike(texto) {
    return texto.replace(/[\\%_]/g, "\\$&");
}

export async function listar({ buscar } = {}) {
    const params = [];
    let donde = "";
    if (buscar) {
        params.push(`%${escaparLike(buscar)}%`);
        donde = "WHERE titulo ILIKE $1";
    }
    const resultado = await query(
        `SELECT ${COLUMNAS}
        FROM capacitaciones
        ${donde}
        ORDER BY creado_en DESC, id DESC`,
        params,
    );
    return resultado.rows;
}

export async function buscarPorId(id) {
    const resultado = await query(
        `SELECT ${COLUMNAS} FROM capacitaciones WHERE id = $1`,
        [id],
    );
    return resultado.rows[0] ?? null;
}

export async function crear(datos) {
    const resultado = await query(
        `INSERT INTO capacitaciones
        (titulo, descripcion, duracion_horas, instructor, sede, programa, fecha_inicio, fecha_fin)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING ${COLUMNAS}`,
        [
        datos.titulo,
        datos.descripcion,
        datos.duracionHoras,
        datos.instructor,
        datos.sede,
        datos.programa,
        datos.fechaInicio,
        datos.fechaFin,
        ],
    );
    return resultado.rows[0];
}

export async function actualizar(id, datos) {
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
        [
        id,
        datos.titulo,
        datos.descripcion,
        datos.duracionHoras,
        datos.instructor,
        datos.sede,
        datos.programa,
        datos.fechaInicio,
        datos.fechaFin,
        ],
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