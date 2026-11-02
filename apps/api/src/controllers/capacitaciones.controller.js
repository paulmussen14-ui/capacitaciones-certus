import * as capacitacionesService from "../services/capacitaciones.service.js";
import { idDesdeParametro } from "../utils/validacion.js";

export async function listar(req, res) {
    const capacitaciones = await capacitacionesService.listar(req.query.q);
    res.json({ capacitaciones });
}

export async function obtener(req, res) {
    const capacitacion = await capacitacionesService.obtener(
        idDesdeParametro(req.params.id),
    );
    res.json({ capacitacion });
}

export async function crear(req, res) {
    const capacitacion = await capacitacionesService.crear(req.body);
    res.status(201).json({ capacitacion });
}

export async function actualizar(req, res) {
    const capacitacion = await capacitacionesService.actualizar(
        idDesdeParametro(req.params.id),
        req.body,
    );
    res.json({ capacitacion });
}

export async function cambiarEstado(req, res) {
    const capacitacion = await capacitacionesService.cambiarEstado(
        idDesdeParametro(req.params.id),
        req.body,
    );
    res.json({ capacitacion });
}