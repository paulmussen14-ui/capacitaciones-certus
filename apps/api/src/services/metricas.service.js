import * as metricasRepository from "../repositories/metricas.repository.js";

const LIMITE_RANKING = 10;

export async function obtenerResumen() {
    const [totales, ranking] = await Promise.all([
        metricasRepository.resumen(),
        metricasRepository.rankingDocentes(LIMITE_RANKING),
    ]);
    return { totales, ranking };
}
