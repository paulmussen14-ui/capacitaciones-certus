import * as capacitacionesService from "../services/capacitaciones.service.js";

export async function listar(req, res) {
    const capacitaciones = await capacitacionesService.listar({
        buscar: req.query.buscar,
    });
    res.json({ capacitaciones });
}

export async function obtener(req, res) {
    const capacitacion = await capacitacionesService.obtener(req.params.id);
    res.json({ capacitacion });
}

export async function crear(req, res) {
    const capacitacion = await capacitacionesService.crear(req.body);
    res.status(201).json({ capacitacion });
}

export async function actualizar(req, res) {
    const capacitacion = await capacitacionesService.actualizar(
        req.params.id,
        req.body,
    );
    res.json({ capacitacion });
}

export async function cambiarEstado(req, res) {
    const capacitacion = await capacitacionesService.cambiarEstado(
        req.params.id,
        req.body,
    );
    res.json({ capacitacion });
}