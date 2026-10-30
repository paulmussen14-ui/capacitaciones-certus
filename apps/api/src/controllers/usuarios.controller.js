import * as usuariosService from "../services/usuarios.service.js";

export async function listar(req, res) {
    const usuarios = await usuariosService.listar({
        buscar: req.query.buscar,
        rol: req.query.rol,
    });
    res.json({ usuarios });
}

export async function crear(req, res) {
    const usuario = await usuariosService.crear(req.body);
    res.status(201).json({ usuario });
}

export async function actualizar(req, res) {
    const usuario = await usuariosService.actualizar(
        req.params.id,
        req.body,
        req.user,
    );
    res.json({ usuario });
}

export async function cambiarEstado(req, res) {
    const usuario = await usuariosService.cambiarEstado(
        req.params.id,
        req.body,
        req.user,
    );
    res.json({ usuario });
}