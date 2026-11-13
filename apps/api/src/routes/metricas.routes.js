import { Router } from "express";
import * as metricasController from "../controllers/metricas.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireRole } from "../middlewares/requireRole.js";

const router = Router();

router.use(requireAuth, requireRole("administrador"));

router.get("/", metricasController.resumen);

export default router;
