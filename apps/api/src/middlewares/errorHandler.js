import { AppError } from "../errors/AppError.js";
import { env } from "../config/env.js";

export function notFound(req, res, next) {
    res.status(404).json({
        error: {
        code: "NOT_FOUND",
        message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
        },
    });
}

export function errorHandler(err, req, res, next) {

    if (err?.type === "entity.parse.failed") {
        return res.status(400).json({
        error: {
            code: "VALIDATION_ERROR",
            message: "El cuerpo de la petición no es un JSON válido",
        },
        });
    }

    const isKnown = err instanceof AppError;
    const statusCode = isKnown ? err.statusCode : 500;


    if (!isKnown) console.error(err);

    res.status(statusCode).json({
        error: {
        code: isKnown ? err.code : "INTERNAL_ERROR",
        message: isKnown ? err.message : "Ocurrió un error interno",
        ...(env.nodeEnv === "development" && !isKnown && { detail: err.message }),
        },
    });
}