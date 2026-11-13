import multer from "multer";
import { ValidationError } from "../errors/AppError.js";

const TAMANO_MAXIMO = 2 * 1024 * 1024; // 2 MB

const subir = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: TAMANO_MAXIMO, files: 1 },
}).single("imagen");

export function subirImagen(req, res, next) {
    subir(req, res, (error) => {
        if (!error) return next();
        if (error.code === "LIMIT_FILE_SIZE") {
            return next(new ValidationError("La imagen no puede superar los 2 MB"));
        }
        if (error instanceof multer.MulterError) {
            return next(new ValidationError("No se pudo leer la imagen enviada"));
        }
        next(error);
    });
}
