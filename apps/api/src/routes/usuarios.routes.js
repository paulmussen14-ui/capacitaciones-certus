import { Router } from "express";
import * as usuariosController from "../controllers/usuarios.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireRole } from "../middlewares/requireRole.js";
import { subirImagen } from "../middlewares/subirImagen.js";

const router = Router();

router.use(requireAuth, requireRole("administrador"));

router.get("/", usuariosController.listar);
router.get("/:id", usuariosController.obtener);
router.get("/:id/capacitaciones", usuariosController.capacitaciones);
router.post("/", usuariosController.crear);
router.put("/:id", usuariosController.actualizar);
router.patch("/:id/estado", usuariosController.cambiarEstado);
router.post("/:id/foto", subirImagen, usuariosController.subirFoto);
router.delete("/:id/foto", usuariosController.quitarFoto);

export default router;