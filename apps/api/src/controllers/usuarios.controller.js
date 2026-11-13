import * as usuariosService from "../services/usuarios.service.js";
import { idDesdeParametro } from "../utils/validacion.js";

export async function listar(req, res) {
    const usuarios = await usuariosService.listar(req.query.q);
    res.json({ usuarios });
}

export async function obtener(req, res) {
    const usuario = await usuariosService.obtener(idDesdeParametro(req.params.id));
    res.json({ usuario });
}

export async function crear(req, res) {
    const usuario = await usuariosService.crear(req.body);
    res.status(201).json({ usuario });
}

export async function actualizar(req, res) {
    const usuario = await usuariosService.actualizar(
        idDesdeParametro(req.params.id),
        req.body,
        req.user,
    );
    res.json({ usuario });
}

export async function cambiarEstado(req, res) {
    const usuario = await usuariosService.cambiarEstado(
        idDesdeParametro(req.params.id),
        req.body,
        req.user,
    );
    res.json({ usuario });
}

export async function subirFoto(req, res) {
    const usuario = await usuariosService.subirFoto(
        idDesdeParametro(req.params.id),
        req.file,
    );
    res.json({ usuario });
}

export async function quitarFoto(req, res) {
    const usuario = await usuariosService.quitarFoto(idDesdeParametro(req.params.id));
    res.json({ usuario });
}


export async function capacitaciones(req, res) {
    const capacitaciones = await usuariosService.capacitacionesDe(
        idDesdeParametro(req.params.id),
    );
    res.json({ capacitaciones });
}
