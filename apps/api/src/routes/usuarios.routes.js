import { Router } from "express";
import * as usuariosController from "../controllers/usuarios.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireRole } from "../middlewares/requireRole.js";

const router = Router();

router.use(requireAuth, requireRole("administrador"));

router.get("/", usuariosController.listar);
router.get("/:id", usuariosController.obtener);
router.post("/", usuariosController.crear);
router.put("/:id", usuariosController.actualizar);
router.patch("/:id/estado", usuariosController.cambiarEstado);

export default router;