import { query } from "../config/db.js";

const COLUMNAS_PUBLICAS =
    "id, nombres, apellidos, correo, rol, sede, programa, activo, creado_en";

function escaparLike(texto) {
    return texto.replace(/[\\%_]/g, "\\$&");
}

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

export async function listar({ buscar, rol } = {}) {
    const condiciones = [];
    const params = [];

    if (buscar) {
        params.push(`%${escaparLike(buscar)}%`);
        condiciones.push(
        `((nombres || ' ' || apellidos) ILIKE $${params.length} OR correo ILIKE $${params.length})`,
        );
    }
    if (rol) {
        params.push(rol);
        condiciones.push(`rol = $${params.length}`);
    }

    const donde = condiciones.length ? `WHERE ${condiciones.join(" AND ")}` : "";

    const resultado = await query(
        `SELECT ${COLUMNAS_PUBLICAS}
        FROM usuarios
        ${donde}
        ORDER BY apellidos, nombres, id`,
        params,
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

export async function actualizar(id, datos) {
    const resultado = await query(
        `UPDATE usuarios
            SET nombres = $2,
                apellidos = $3,
                correo = $4,
                rol = $5,
                sede = $6,
                programa = $7
        WHERE id = $1
        RETURNING ${COLUMNAS_PUBLICAS}`,
        [
        id,
        datos.nombres,
        datos.apellidos,
        datos.correo,
        datos.rol,
        datos.sede,
        datos.programa,
        ],
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