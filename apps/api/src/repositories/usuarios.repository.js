import { query } from "../config/db.js";
import { escaparLike } from "../utils/validacion.js";


const COLUMNAS_PUBLICAS =
    "id, nombres, apellidos, correo, rol, sede, programa, foto_url, activo, creado_en";

export async function buscarPorCorreo(correo) {
    const resultado = await query(
        `SELECT ${COLUMNAS_PUBLICAS}, password_hash
        FROM usuarios
        WHERE correo = $1`,
        [correo],
    );
    return resultado.rows[0] ?? null;
}

export async function buscarPorId(id) {
    const resultado = await query(
        `SELECT ${COLUMNAS_PUBLICAS}
        FROM usuarios
        WHERE id = $1`,
        [id],
    );
    return resultado.rows[0] ?? null;
}

export async function listar(busqueda = "") {
    const patron = busqueda ? `%${escaparLike(busqueda)}%` : null;
    const resultado = await query(
        `SELECT ${COLUMNAS_PUBLICAS}
        FROM usuarios
        WHERE ($1::text IS NULL
            OR nombres ILIKE $1
            OR apellidos ILIKE $1
            OR correo ILIKE $1)
        ORDER BY apellidos, nombres`,
        [patron],
    );
    return resultado.rows;
}

export async function crear({
    nombres,
    apellidos,
    correo,
    passwordHash,
    rol,
    sede = null,
    programa = null,
    }) {
    const resultado = await query(
        `INSERT INTO usuarios (nombres, apellidos, correo, password_hash, rol, sede, programa)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING ${COLUMNAS_PUBLICAS}`,
        [nombres, apellidos, correo, passwordHash, rol, sede, programa],
    );
    return resultado.rows[0];
}

export async function actualizar(
    id,
    { nombres, apellidos, correo, rol, sede, programa, passwordHash = null },
) {
    const resultado = await query(
        `UPDATE usuarios
            SET nombres = $2,
                apellidos = $3,
                correo = $4,
                rol = $5,
                sede = $6,
                programa = $7,
                password_hash = COALESCE($8, password_hash)
        WHERE id = $1
        RETURNING ${COLUMNAS_PUBLICAS}`,
        [id, nombres, apellidos, correo, rol, sede, programa, passwordHash],
    );
    return resultado.rows[0] ?? null;
}

export async function cambiarEstado(id, activo) {
    const resultado = await query(
        `UPDATE usuarios
            SET activo = $2
        WHERE id = $1
        RETURNING ${COLUMNAS_PUBLICAS}`,
        [id, activo],
    );
    return resultado.rows[0] ?? null;
}

export async function actualizarFoto(id, fotoUrl) {
    const resultado = await query(
        `UPDATE usuarios
            SET foto_url = $2
        WHERE id = $1
        RETURNING ${COLUMNAS_PUBLICAS}`,
        [id, fotoUrl],
    );
    return resultado.rows[0] ?? null;
}
