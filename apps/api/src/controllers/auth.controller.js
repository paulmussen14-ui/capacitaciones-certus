import { env } from "../config/env.js";
import * as authService from "../services/auth.service.js";


const opcionesCookie = {
    httpOnly: true,
    sameSite: "lax",
    secure: env.nodeEnv === "production",
    path: "/",
};

export async function login(req, res) {
    const { correo, password } = req.body ?? {};
    const { token, usuario } = await authService.iniciarSesion({
        correo,
        password,
    });

    res.cookie(env.session.cookieName, token, {
        ...opcionesCookie,
        maxAge: env.session.hours * 60 * 60 * 1000,
    });
    res.json({ usuario });
}

export function logout(req, res) {
    res.clearCookie(env.session.cookieName, opcionesCookie);
    res.json({ ok: true });
}

export function me(req, res) {
    res.json({ usuario: req.user });
}