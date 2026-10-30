import { query } from "../config/db.js";


const COLUMNAS_PUBLICAS =
    "id, nombres, apellidos, correo, rol, sede, programa, activo, creado_en";

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

export async function listar() {
    const resultado = await query(
        `SELECT ${COLUMNAS_PUBLICAS}
        FROM usuarios
        ORDER BY apellidos, nombres`,
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

// Los usuarios no se eliminan: se activan o se desactivan
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