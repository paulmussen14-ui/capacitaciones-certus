import { query } from "../config/db.js";

export async function resumen() {
    const resultado = await query(
        `SELECT
            (SELECT COUNT(*)::int FROM usuarios WHERE rol = 'docente' AND activo) AS docentes_activos,
            (SELECT COUNT(*)::int FROM capacitaciones WHERE activa) AS capacitaciones_activas,
            (SELECT COUNT(*)::int FROM inscripciones) AS asignaciones,
            (SELECT COUNT(*)::int FROM inscripciones WHERE estado = 'completada') AS completadas,
            COALESCE((SELECT ROUND(AVG(progreso))::int FROM inscripciones), 0) AS progreso_promedio`,
    );
    return resultado.rows[0];
}

// Ranking: mejor progreso promedio; desempata por más capacitaciones completadas
export async function rankingDocentes(limite) {
    const resultado = await query(
        `SELECT u.id, u.nombres, u.apellidos, u.sede, u.programa, u.foto_url,
                COUNT(i.id)::int AS asignadas,
                (COUNT(*) FILTER (WHERE i.estado = 'completada'))::int AS completadas,
                ROUND(AVG(i.progreso))::int AS progreso_promedio
        FROM usuarios u
        JOIN inscripciones i ON i.usuario_id = u.id
        WHERE u.rol = 'docente' AND u.activo
        GROUP BY u.id
        ORDER BY progreso_promedio DESC, completadas DESC, asignadas DESC, u.apellidos, u.nombres
        LIMIT $1`,
        [limite],
    );
    return resultado.rows;
}
