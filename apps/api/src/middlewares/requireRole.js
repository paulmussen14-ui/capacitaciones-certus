import { ForbiddenError, UnauthorizedError } from "../errors/AppError.js";

export function requireRole(...rolesPermitidos) {
    return (req, res, next) => {
        if (!req.user) {
        throw new UnauthorizedError();
        }
        if (!rolesPermitidos.includes(req.user.rol)) {
        throw new ForbiddenError();
        }
        next();
    };
}