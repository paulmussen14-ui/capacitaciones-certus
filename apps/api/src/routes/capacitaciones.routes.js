import { Router } from "express";
import rateLimit from "express-rate-limit";
import * as capacitacionesController from "../controllers/capacitaciones.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireRole } from "../middlewares/requireRole.js";
import { subirImagen } from "../middlewares/subirImagen.js";

const router = Router();

// Frena el adivinar la clave de administrador (solo cuenta las claves incorrectas)
const limitarEliminar = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    skipSuccessfulRequests: true,
    requestWasSuccessful: (req, res) => res.statusCode !== 403,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
        error: {
            code: "TOO_MANY_REQUESTS",
            message: "Demasiados intentos con clave incorrecta. Intenta de nuevo en unos minutos.",
        },
        });
    },
});

router.use(requireAuth, requireRole("administrador"));

router.get("/", capacitacionesController.listar);
router.get("/:id", capacitacionesController.obtener);
router.post("/", capacitacionesController.crear);
router.put("/:id", capacitacionesController.actualizar);
router.patch("/:id/estado", capacitacionesController.cambiarEstado);
router.delete("/:id", limitarEliminar, capacitacionesController.eliminar);
router.post("/:id/imagen", subirImagen, capacitacionesController.subirImagen);
router.delete("/:id/imagen", capacitacionesController.quitarImagen);

export default router;