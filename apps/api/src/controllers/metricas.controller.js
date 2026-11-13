import * as metricasService from "../services/metricas.service.js";

export async function resumen(req, res) {
    res.json(await metricasService.obtenerResumen());
}
