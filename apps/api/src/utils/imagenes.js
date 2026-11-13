import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ValidationError } from "../errors/AppError.js";

export const DIR_UPLOADS = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../uploads",
);

const CARPETAS = ["capacitaciones", "usuarios"];
const PREFIJO_URL = "/api/uploads";
const REGEX_URL = /^\/api\/uploads\/(capacitaciones|usuarios)\/[a-f0-9]{32}\.(jpg|png|webp)$/;

// No nos fiamos del tipo que declara el navegador: se mira la firma real del archivo
function detectarExtension(buffer) {
    if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
        return "jpg";
    }
    if (
        buffer.length >= 8 &&
        buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
    ) {
        return "png";
    }
    if (
        buffer.length >= 12 &&
        buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
        buffer.subarray(8, 12).toString("ascii") === "WEBP"
    ) {
        return "webp";
    }
    return null;
}

export async function guardarImagen(buffer, carpeta) {
    if (!CARPETAS.includes(carpeta)) throw new Error("Carpeta de imágenes no válida");

    const extension = detectarExtension(buffer);
    if (!extension) {
        throw new ValidationError("La imagen debe ser JPG, PNG o WebP");
    }

    const nombre = `${crypto.randomBytes(16).toString("hex")}.${extension}`;
    const directorio = path.join(DIR_UPLOADS, carpeta);
    await fs.mkdir(directorio, { recursive: true });
    await fs.writeFile(path.join(directorio, nombre), buffer);

    return `${PREFIJO_URL}/${carpeta}/${nombre}`;
}

// Solo borra archivos que esta misma API creó (el regex impide salirse de la carpeta)
export async function borrarImagen(url) {
    if (typeof url !== "string" || !REGEX_URL.test(url)) return;
    const relativa = url.slice(PREFIJO_URL.length + 1);
    await fs.rm(path.join(DIR_UPLOADS, relativa), { force: true });
}
