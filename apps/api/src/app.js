import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";
import { notFound, errorHandler } from "./middlewares/errorHandler.js";
import { DIR_UPLOADS } from "./utils/imagenes.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Imágenes subidas (nombres aleatorios, no se pueden listar)
app.use("/api/uploads", express.static(DIR_UPLOADS, { index: false, maxAge: "1d" }));

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;