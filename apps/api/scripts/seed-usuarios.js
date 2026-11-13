import bcrypt from "bcryptjs";
import { pool, query } from "../src/config/db.js";
import { env } from "../src/config/env.js";

const password = process.env.SEED_PASSWORD;
if (!password || password.length < 8) {
    console.error(
        "Falta SEED_PASSWORD en el .env (mínimo 8 caracteres). Agrégala y vuelve a ejecutar.",
    );
    process.exit(1);
}

const dominio = env.allowedEmailDomain;

const usuarios = [
    {
        nombres: "Admin",
        apellidos: "Gestor",
        correo: `admin@${dominio}`,
        rol: "administrador",
        sede: "Lima Centro",
        programa: null,
    },
    {
        nombres: "Docente",
        apellidos: "Uno",
        correo: `docente1@${dominio}`,
        rol: "docente",
        sede: "Lima Centro",
        programa: "Diseño y Desarrollo de Software",
    },
    {
        nombres: "Docente",
        apellidos: "Dos",
        correo: `docente2@${dominio}`,
        rol: "docente",
        sede: "Lima Norte",
        programa: "Administración de Empresas",
    },
    {
        nombres: "Docente",
        apellidos: "Tres",
        correo: `docente3@${dominio}`,
        rol: "docente",
        sede: "Lima Sur",
        programa: "Contabilidad",
    },
];

try {
    const passwordHash = await bcrypt.hash(password, 10);

    for (const u of usuarios) {
        await query(
        `INSERT INTO usuarios (nombres, apellidos, correo, password_hash, rol, sede, programa)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (correo) DO UPDATE
            SET password_hash = EXCLUDED.password_hash,
                rol = EXCLUDED.rol,
                activo = TRUE`,
        [u.nombres, u.apellidos, u.correo, passwordHash, u.rol, u.sede, u.programa],
        );
        console.log(`OK  ${u.rol.padEnd(13)} ${u.correo}`);
    }
    console.log("\nUsuarios listos. La contraseña es la de SEED_PASSWORD en tu .env.");
} catch (error) {
    console.error("No se pudieron crear los usuarios:", error.message);
    process.exitCode = 1;
} finally {
    ;
}