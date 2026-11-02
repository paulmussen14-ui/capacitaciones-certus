import { env } from "../config/env.js";
import { UnauthorizedError } from "../errors/AppError.js";
import { usuarioDesdeToken } from "../services/auth.service.js";


export async function requireAuth(req, res, next) {
    const token = req.cookies?.[env.session.cookieName];
    if (!token) {
        throw new UnauthorizedError();
    }
    req.user = await usuarioDesdeToken(token);
    next();
}