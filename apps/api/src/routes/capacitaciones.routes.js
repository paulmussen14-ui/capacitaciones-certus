import { Router } from "express";
import * as capacitacionesController from "../controllers/capacitaciones.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireRole } from "../middlewares/requireRole.js";

const router = Router();

router.use(requireAuth, requireRole("administrador"));

router.get("/", capacitacionesController.listar);
router.get("/:id", capacitacionesController.obtener);
router.post("/", capacitacionesController.crear);
router.put("/:id", capacitacionesController.actualizar);
router.patch("/:id/estado", capacitacionesController.cambiarEstado);

export default router;