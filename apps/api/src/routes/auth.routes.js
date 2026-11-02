import { Router } from "express";
import rateLimit from "express-rate-limit";
import * as authController from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = Router();

const limitarLogin = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    skipSuccessfulRequests: true,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
        error: {
            code: "TOO_MANY_REQUESTS",
            message: "Demasiados intentos fallidos. Intenta de nuevo en unos minutos.",
        },
        });
    },
});

router.post("/login", limitarLogin, authController.login);
router.post("/logout", authController.logout);
router.get("/me", requireAuth, authController.me);

export default router;