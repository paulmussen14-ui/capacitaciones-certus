import { Router } from "express";
import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireRole } from "../middlewares/requireRole.js";
import capacitacionesRoutes from "./capacitaciones.routes.js";
import usuariosRoutes from "./usuarios.routes.js";
import metricasRoutes from "./metricas.routes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/capacitaciones", capacitacionesRoutes);
router.use("/usuarios", usuariosRoutes);
router.use("/metricas", metricasRoutes);

router.get("/admin/ping", requireAuth, requireRole("administrador"), (req, res) => {
    res.json({ ok: true, rol: req.user.rol });
});
router.get("/docente/ping", requireAuth, requireRole("docente"), (req, res) => {
    res.json({ ok: true, rol: req.user.rol });
});


export default router;