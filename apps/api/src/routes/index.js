import { Router } from "express";
import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js";
import capacitacionesRoutes from "./capacitaciones.routes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/capacitaciones", capacitacionesRoutes);


export default router;