# Ruta de trabajo: Capacitación Docente (CERTUS)

Guía paso a paso, de la raíz del proyecto hasta la entrega final. Marca cada casilla cambiando `[ ]` por `[x]` a medida que avances.

> **Caso:** prototipo de aplicación web responsiva para gestionar la capacitación de los docentes de CERTUS.
> **Requisitos del caso:** (1) login con correo institucional, (2) el docente consulta su progreso, (3) el gestor ve reportes de seguimiento, (4) el docente descarga la constancia de cada capacitación completada.
> **Stack:** Node.js + Express, PostgreSQL, React (Vite), Docker, GitHub Actions.

---

## Cómo usar este archivo

1. Guárdalo en la raíz del proyecto como `RUTA-DE-TRABAJO.md` y ábrelo en VS Code (`Ctrl + Shift + V` para ver la vista previa con las casillas).
2. Trabaja **una etapa a la vez** y no pases a la siguiente sin cumplir su "Listo cuando...".
3. Al final de cada etapa hay un commit y un Pull Request. Así tu historial en GitHub cuenta tu avance.
4. Si algo falla, copia el **mensaje de error completo** y pídeme ayuda con él.

### Convenciones

| Tema                 | Regla                                                                                                |
| -------------------- | ---------------------------------------------------------------------------------------------------- |
| Terminal recomendada | **Git Bash** dentro de VS Code. Si usas PowerShell, donde un comando cambia verás las dos versiones. |
| Ramas                | `main` (estable) → `develop` (integración) → `feature/nombre-de-la-tarea` (tu trabajo)               |
| Commits              | Con prefijo: `feat:` (algo nuevo), `fix:` (arreglo), `docs:`, `chore:`, `refactor:`                  |
| Pull Requests        | Nada entra a `main` ni a `develop` sin Pull Request                                                  |
| Secretos             | Solo `.env.example` se sube. El `.env` real **nunca**                                                |
| Rutas de ejemplo     | Proyecto en `C:\proyectos\capacitaciones-certus` (en Git Bash: `/c/proyectos/capacitaciones-certus`) |

### Mapa de etapas (sugerido para las 8 semanas)

| Etapa                    | Contenido                                                 | Semana sugerida |
| ------------------------ | --------------------------------------------------------- | --------------- |
| 0                        | Raíz del proyecto: carpetas, Docker, API base, React base | 1               |
| 1                        | Modelo de datos en PostgreSQL                             | 2               |
| 2                        | Autenticación y roles                                     | 2-3             |
| 3                        | Gestión de capacitaciones y docentes                      | 3               |
| **Evaluación de avance** | Presentación + informe (50 % de la nota)                  | **4**           |
| 4                        | Asignación y progreso                                     | 5               |
| 5                        | Constancias en PDF con código QR                          | 6               |
| 6                        | Reportes con filtros y exportación                        | 6               |
| 7                        | Calidad: errores, seguridad, pruebas, responsive          | 7               |
| 8                        | Docker completo y GitHub Actions                          | 7               |
| 9                        | Documentación, informe final y exposición                 | 7-8             |
| **Evaluación final**     | Informe final + Pitch de 5 a 7 minutos (50 % de la nota)  | **8**           |

---

## Estado actual (lo que ya hiciste)

- [x] Git instalado (`git --version` responde)
- [x] Identidad configurada (nombre y correo `noreply` de GitHub)
- [x] Carpeta `C:\proyectos` creada
- [x] Repositorio `capacitaciones-certus` creado en GitHub y clonado
- [x] Primer commit con `.editorconfig` subido a `main`
- [x] Rama `develop` creada y subida
- [x] Repositorio cambiado a público
- [x] Regla de protección (Ruleset) activa para `main` y `develop`
- [x] Compañeros invitados en **Settings > Collaborators**
- [x] Docente informado de que el repositorio es público

### Pendiente: crear la regla de protección

1. GitHub > tu repo > **Settings > Rules > Rulesets > New ruleset > New branch ruleset**.
2. **Ruleset Name:** `proteger-main-y-develop`.
3. **Enforcement status:** **Active** (si queda en _Disabled_, no hace nada).
4. **Target branches > Add target:** _Include default branch_ y _Include by pattern_ con `develop`.
5. En **Branch rules** marca: _Restrict deletions_, _Block force pushes_ y _Require a pull request before merging_.
6. Pulsa **Create**.

---

# ETAPA 0: La raíz del proyecto

**Objetivo:** que React, Express y PostgreSQL funcionen juntos, con todo ordenado desde el inicio.

### 0.1 Crear la rama de trabajo

- [x] Abre una terminal en la raíz del proyecto.

Git Bash:

```bash
cd /c/proyectos/capacitaciones-certus
```

PowerShell:

```powershell
cd C:\proyectos\capacitaciones-certus
```

- [x] Corrige el nombre de la rama si la creaste con el error de tipeo (`estrcutura`), o créala si no existe:

```bash
git branch -m feature/estructura-inicial
git branch
```

Si no existe aún:

```bash
git switch develop
git pull
git switch -c feature/estructura-inicial
```

- [x] `git branch` muestra `feature/estructura-inicial` con un asterisco.

### 0.2 Crear las carpetas base

Git Bash:

```bash
mkdir -p apps database docs .github/workflows
touch apps/.gitkeep database/.gitkeep docs/.gitkeep .github/workflows/.gitkeep
```

PowerShell:

```powershell
mkdir apps, database, docs, .github\workflows
New-Item apps\.gitkeep, database\.gitkeep, docs\.gitkeep, .github\workflows\.gitkeep -ItemType File
```

> Los `.gitkeep` son archivos vacíos para que Git suba carpetas que todavía no tienen contenido.

- [x] Las cuatro carpetas existen (míralas en el Explorador de VS Code).

### 0.3 Variables de entorno

- [x] Crea el archivo `.env.example` en la raíz con este contenido:

```
# Base de datos (PostgreSQL)
POSTGRES_USER=capacitaciones
POSTGRES_PASSWORD=cambia_esta_clave
POSTGRES_DB=capacitaciones_db
POSTGRES_PORT=5432

# API
API_PORT=3000
DB_HOST=localhost
NODE_ENV=development
SESSION_SECRET=cambia_este_secreto_largo
```

- [x] Crea tu copia real.

Git Bash: `cp .env.example .env`

PowerShell: `Copy-Item .env.example .env`

- [x] Abre `.env` y cambia `POSTGRES_PASSWORD` y `SESSION_SECRET` por valores propios (una clave que no uses en otro sitio y un texto largo y aleatorio).

### 0.4 Verificar que `.env` está protegido

- [x] Ejecuta:

```bash
git check-ignore -v .env
git check-ignore -v .env.example
```

- [x] El primero muestra una línea con `.gitignore` (significa que se ignora). El segundo **no muestra nada** (significa que sí se subirá).
- [x] Si el primero no muestra nada: abre `.gitignore`, agrega una línea `.env`, guarda y repite.

### 0.5 Primer commit de la rama

```bash
git status
git add .
git commit -m "chore: estructura de carpetas y variables de entorno de ejemplo"
```

- [x] `git status` **no** listó `.env` antes de confirmar.
- [x] El commit se creó sin errores.

### 0.6 PostgreSQL con Docker

- [x] Abre **Docker Desktop** y espera a que diga que está en ejecución.
- [x] Crea `docker-compose.yml` en la raíz:

```yaml
services:
  db:
    image: postgres:16
    container_name: capacitaciones_db
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    ports:
      - ${POSTGRES_PORT}:5432
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  db_data:
```

- [x] Levántala y comprueba:

```bash
docker compose up -d
docker compose ps
docker compose exec db psql -U capacitaciones -d capacitaciones_db -c "select version();"
```

(Si cambiaste el usuario o la base en tu `.env`, usa esos nombres.)

- [x] `docker compose ps` muestra `db` en estado _running_.
- [x] El último comando muestra la versión de PostgreSQL.

Comandos útiles:

| Comando                  | Qué hace                                    |
| ------------------------ | ------------------------------------------- |
| `docker compose stop`    | Apaga la base sin borrar datos              |
| `docker compose up -d`   | La enciende                                 |
| `docker compose down`    | Elimina el contenedor, conserva los datos   |
| `docker compose down -v` | Elimina también los datos (empezar de cero) |
| `docker compose logs db` | Ver los mensajes de la base                 |

```bash
git add .
git commit -m "chore: PostgreSQL en Docker Compose"
```

- [x] Commit hecho.

### 0.7 La API: crear el proyecto

```bash
cd apps
mkdir api
cd api
npm init -y
npm install express pg dotenv cors helmet
```

Crear la estructura de carpetas.

Git Bash:

```bash
mkdir -p src/config src/routes src/controllers src/services src/repositories src/middlewares src/errors
```

PowerShell:

```powershell
mkdir src\config, src\routes, src\controllers, src\services, src\repositories, src\middlewares, src\errors
```

- [x] Abre `apps/api/package.json` y agrega/ajusta estas dos partes (el resto queda igual):

```json
"type": "module",
"scripts": {
  "dev": "node --watch src/server.js",
  "start": "node src/server.js"
}
```

> `"type": "module"` permite usar `import`. `--watch` reinicia el servidor cada vez que guardas un archivo.

Qué hace cada carpeta:

| Carpeta         | Responsabilidad                                          |
| --------------- | -------------------------------------------------------- |
| `routes/`       | Define las URLs (`/api/capacitaciones`)                  |
| `controllers/`  | Recibe la petición y arma la respuesta                   |
| `services/`     | Lógica de negocio (las reglas del sistema)               |
| `repositories/` | Consultas SQL                                            |
| `middlewares/`  | Código que corre antes o después (login, roles, errores) |
| `config/`       | Variables de entorno y conexión a la BD                  |
| `errors/`       | Tipos de error propios                                   |

### 0.8 La API: crear los archivos

Crea cada archivo en la ruta indicada, con VS Code.

- [x] **`apps/api/src/config/env.js`**

```js
import dotenv from "dotenv";

// Se ejecuta desde apps/api, por eso subimos dos niveles hasta la raíz
dotenv.config({ path: "../../.env" });

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.API_PORT) || 3000,
  db: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.POSTGRES_PORT) || 5432,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  },
};
```

- [x] **`apps/api/src/config/db.js`**

```js
import pg from "pg";
import { env } from "./env.js";

export const pool = new pg.Pool(env.db);

// Siempre usamos parámetros ($1, $2) para evitar inyección SQL
export const query = (text, params) => pool.query(text, params);
```

- [x] **`apps/api/src/errors/AppError.js`**

```js
export class AppError extends Error {
  constructor(message, statusCode = 500, code = "INTERNAL_ERROR") {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Recurso no encontrado") {
    super(message, 404, "NOT_FOUND");
  }
}

export class ValidationError extends AppError {
  constructor(message = "Datos inválidos") {
    super(message, 400, "VALIDATION_ERROR");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "No autenticado") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "No tienes permisos para esta acción") {
    super(message, 403, "FORBIDDEN");
  }
}
```

- [x] **`apps/api/src/middlewares/errorHandler.js`**

```js
import { AppError } from "../errors/AppError.js";
import { env } from "../config/env.js";

export function notFound(req, res, next) {
  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
    },
  });
}

export function errorHandler(err, req, res, next) {
  const isKnown = err instanceof AppError;
  const statusCode = isKnown ? err.statusCode : 500;

  // Los errores inesperados se registran, pero no se muestran al cliente
  if (!isKnown) console.error(err);

  res.status(statusCode).json({
    error: {
      code: isKnown ? err.code : "INTERNAL_ERROR",
      message: isKnown ? err.message : "Ocurrió un error interno",
      ...(env.nodeEnv === "development" && !isKnown && { detail: err.message }),
    },
  });
}
```

> Todas las respuestas de error tienen el mismo formato: `{ error: { code, message } }`. El frontend siempre sabrá cómo leerlas.

- [x] **`apps/api/src/routes/health.routes.js`**

```js
import { Router } from "express";
import { query } from "../config/db.js";

const router = Router();

router.get("/", async (req, res) => {
  const result = await query("SELECT NOW() AS hora");
  res.json({
    status: "ok",
    baseDeDatos: "conectada",
    hora: result.rows[0].hora,
  });
});

export default router;
```

- [x] **`apps/api/src/routes/index.js`**

```js
import { Router } from "express";
import healthRoutes from "./health.routes.js";

const router = Router();

router.use("/health", healthRoutes);
// Aquí iremos agregando: /auth, /capacitaciones, /usuarios, /inscripciones...

export default router;
```

- [x] **`apps/api/src/app.js`**

```js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes/index.js";
import { notFound, errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use("/api", routes);

// Siempre al final: primero la ruta no encontrada, luego el manejador de errores
app.use(notFound);
app.use(errorHandler);

export default app;
```

- [x] **`apps/api/src/server.js`**

```js
import app from "./app.js";
import { env } from "./config/env.js";

app.listen(env.port, () => {
  console.log(`API escuchando en http://localhost:${env.port}`);
});
```

> `app.js` y `server.js` están separados para poder probar la aplicación más adelante sin encender el servidor.

### 0.9 La API: probarla

- [x] Desde `apps/api` ejecuta `npm run dev`. Debe decir `API escuchando en http://localhost:3000`.
- [x] Abre `http://localhost:3000/api/health`: debe mostrar `"status":"ok"`.
- [x] Abre `http://localhost:3000/api/loquesea`: debe mostrar el JSON de error 404.
- [x] Apaga la base (`docker compose stop db`, desde la raíz), recarga `/api/health`: debe responder un error 500 controlado y la API **no se cae**.
- [x] Enciende la base otra vez (`docker compose up -d`).

Deja la API corriendo y **abre una segunda terminal** (signo **+** del panel de terminal).

```bash
cd /c/proyectos/capacitaciones-certus
git add .
git commit -m "feat(api): servidor Express, conexion a PostgreSQL y manejo de errores"
```

- [x] Commit hecho.

### 0.10 El frontend: crear el proyecto

En la segunda terminal:

```bash
cd /c/proyectos/capacitaciones-certus/apps
npm create vite@latest web -- --template react
cd web
npm install
npm install react-router-dom
```

(Si el asistente pregunta, elige **JavaScript** y deja el resto por defecto.)

- [x] Borra `src/App.css`, `src/index.css` y lo que haya dentro de `src/assets/`.

Crear la estructura.

Git Bash:

```bash
mkdir -p src/assets/images/logos src/assets/images/icons src/assets/images/illustrations src/assets/images/photos
mkdir -p src/styles/base src/styles/layout src/styles/utilities
mkdir -p src/components/Button src/pages src/services src/hooks src/context
```

PowerShell:

```powershell
mkdir src\assets\images\logos, src\assets\images\icons, src\assets\images\illustrations, src\assets\images\photos
mkdir src\styles\base, src\styles\layout, src\styles\utilities
mkdir src\components\Button, src\pages, src\services, src\hooks, src\context
```

Reglas para mantener el CSS ordenado:

1. Los estilos globales viven **solo** en `src/styles/` (variables, reset, tipografía, layout, utilidades).
2. Cada componente o página tiene **su propio `.css`** al lado de su `.jsx`, y lo importa.
3. Clases con prefijo del componente: `.btn`, `.btn--primary`, `.card__title`.
4. Nunca escribas un color o tamaño suelto: usa variables (`var(--color-primary)`).
5. Un archivo, una responsabilidad. Si pasa de unas 150 líneas, divídelo.
6. Diseña primero para móvil y agrega `@media (min-width: 768px)` para pantallas grandes.

### 0.11 El frontend: estilos base

- [x] **`src/styles/base/variables.css`**

```css
:root {
  /* Colores */
  --color-primary: #1f3a8a;
  --color-primary-dark: #172a63;
  --color-accent: #e11d74;
  --color-bg: #f5f7fb;
  --color-surface: #ffffff;
  --color-text: #1f2937;
  --color-text-muted: #6b7280;
  --color-border: #e5e7eb;
  --color-success: #16a34a;
  --color-warning: #d97706;
  --color-danger: #dc2626;

  /* Tipografía */
  --font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.25rem;
  --font-size-xl: 1.75rem;

  /* Espacios, bordes y sombras */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 1rem;
  --space-4: 1.5rem;
  --space-5: 2rem;
  --radius: 0.5rem;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
```

- [x] **`src/styles/base/reset.css`**

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  color: var(--color-text);
  background: var(--color-bg);
  line-height: 1.5;
}

img {
  max-width: 100%;
  display: block;
}

button,
input,
select,
textarea {
  font: inherit;
}
```

- [x] **`src/styles/base/typography.css`**

```css
h1,
h2,
h3 {
  margin: 0 0 var(--space-3);
  line-height: 1.2;
  color: var(--color-primary);
}

h1 {
  font-size: var(--font-size-xl);
}
h2 {
  font-size: var(--font-size-lg);
}

a {
  color: var(--color-primary);
}
```

- [x] **`src/styles/layout/container.css`**

```css
.container {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 var(--space-3);
}
```

- [x] **`src/styles/utilities/helpers.css`**

```css
.text-center {
  text-align: center;
}
.text-muted {
  color: var(--color-text-muted);
}
.mt-3 {
  margin-top: var(--space-3);
}
.mb-3 {
  margin-bottom: var(--space-3);
}
```

- [x] **`src/styles/main.css`** (es el único que importa al resto)

```css
@import "./base/variables.css";
@import "./base/reset.css";
@import "./base/typography.css";
@import "./layout/container.css";
@import "./utilities/helpers.css";
```

- [x] En `src/main.jsx`, reemplaza la importación del CSS antiguo (`import './index.css'`) por:

```jsx
import "./styles/main.css";
```

### 0.12 El frontend: un componente de ejemplo y la conexión con la API

- [x] **`src/components/Button/Button.jsx`**

```jsx
import "./Button.css";

export default function Button({ children, variant = "primary", ...props }) {
  return (
    <button className={`btn btn--${variant}`} {...props}>
      {children}
    </button>
  );
}
```

- [x] **`src/components/Button/Button.css`**

```css
.btn {
  padding: var(--space-2) var(--space-3);
  border: none;
  border-radius: var(--radius);
  font-weight: 600;
  cursor: pointer;
}

.btn--primary {
  background: var(--color-primary);
  color: #fff;
}

.btn--primary:hover {
  background: var(--color-primary-dark);
}

.btn--danger {
  background: var(--color-danger);
  color: #fff;
}
```

- [x] En **`vite.config.js`**, deja el archivo como está y agrega solo el bloque `server` dentro de `defineConfig`:

```js
server: {
  port: 5173,
  proxy: { '/api': 'http://localhost:3000' },
},
```

- [x] **`src/services/api.js`**

```js
// Todas las llamadas al backend pasan por aquí
export async function apiFetch(path, options = {}) {
  const response = await fetch(`/api${path}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message || "Error de conexión con el servidor",
    );
  }
  return data;
}
```

- [x] **`src/App.jsx`** (prueba temporal; reemplaza todo el contenido)

```jsx
import { useEffect, useState } from "react";
import { apiFetch } from "./services/api";

export default function App() {
  const [estado, setEstado] = useState("Comprobando conexión...");

  useEffect(() => {
    apiFetch("/health")
      .then((d) => setEstado(`API y base de datos: ${d.status}`))
      .catch((e) => setEstado(`Error: ${e.message}`));
  }, []);

  return (
    <div className="container">
      <h1>{estado}</h1>
    </div>
  );
}
```

**Manejo de imágenes** (para cuando las agregues):

- Las que usan los componentes van en `src/assets/images/` y se importan:

```jsx
import logo from "../../assets/images/logos/logo-certus.svg";

<img src={logo} alt="Logo de CERTUS" />;
```

- Lo que necesita una URL fija (como el favicon) va en `public/`.
- Nombres en minúsculas y con guiones: `ilustracion-login.webp`.
- SVG para logos e íconos; WebP para fotos; ancho máximo de unos 1200 px y menos de 300 KB.
- Todas las imágenes llevan atributo `alt`. Usa imágenes propias o de bancos libres de derechos.

### 0.13 El frontend: probarlo

- [x] Con la API encendida en la otra terminal, ejecuta en `apps/web`: `npm run dev`.
- [x] Abre `http://localhost:5173`: debe mostrar **"API y base de datos: ok"**.
- [x] Apaga la API (`Ctrl + C` en su terminal) y recarga: debe mostrar un `Error:` legible, sin pantalla en blanco. Enciéndela de nuevo.

```bash
cd /c/proyectos/capacitaciones-certus
git add .
git commit -m "feat(web): proyecto React con estilos base ordenados y conexion a la API"
```

- [x] Commit hecho.

### 0.14 README del proyecto

- [x] Reemplaza el contenido de `README.md` por:

```markdown
# Capacitación Docente – CERTUS

Prototipo de aplicación web responsiva para gestionar las capacitaciones de los docentes de CERTUS: seguimiento del progreso, constancias descargables y reportes para el gestor.

## Tecnologías

Node.js + Express · PostgreSQL · React (Vite) · Docker · GitHub Actions

## Requisitos

Node.js LTS, Git y Docker Desktop.

## Cómo ejecutar

1. Copia las variables de entorno y edítalas: `cp .env.example .env`
2. Levanta la base de datos: `docker compose up -d`
3. API: `cd apps/api && npm install && npm run dev`
4. Web: `cd apps/web && npm install && npm run dev`
5. Abre http://localhost:5173

## Normas de trabajo

- Ramas: `main` (estable) → `develop` → `feature/nombre-de-la-tarea`.
- Todo cambio entra por Pull Request.
- Commits con prefijo: `feat:`, `fix:`, `docs:`, `chore:`.
- El archivo `.env` nunca se sube.

## Integrantes

(Agrega aquí los nombres del equipo)
```

```bash
git add .
git commit -m "docs: README con instrucciones de ejecucion y normas de trabajo"
```

- [x] Commit hecho.

### 0.15 Subir y unir a `develop`

```bash
git push -u origin feature/estructura-inicial
```

- [x] En GitHub aparece **Compare & pull request**. Créalo con destino `develop`.
- [x] Escribe en la descripción qué incluye (carpetas, Docker, API base, React base).
- [x] Si hay compañeros, pide que alguien lo revise. Luego pulsa **Merge pull request**.
- [x] Actualiza tu PC:

```bash
git switch develop
git pull
```

### Etapa 0: listo cuando...

- [x] `docker compose ps` muestra `db` en ejecución
- [x] `/api/health` responde `ok` y una ruta inexistente devuelve JSON 404
- [x] React muestra "API y base de datos: ok"
- [x] `.env` no está en GitHub y `.env.example` sí
- [x] Todo está unido en `develop`

---

# ETAPA 1: El modelo de datos

**Objetivo:** tener las tablas del sistema creadas en PostgreSQL, con las reglas del negocio protegidas desde la base de datos.

### 1.1 Rama y diseño previo

```bash
git switch develop
git pull
git switch -c feature/modelo-datos
```

- [ ] Dibuja el diagrama entidad-relación (a mano, en https://dbdiagram.io o en draw.io) con las 4 tablas de abajo y guárdalo como imagen en `docs/modelo-datos.png`. Lo usarás en el informe.

Las 4 tablas y por qué existen:
V
| Tabla | Para qué |
|---|---|
| `usuarios` | Docentes y administradores (gestores), diferenciados por la columna `rol` |
| `capacitaciones` | Catálogo de capacitaciones |
| `inscripciones` | Qué docente tiene asignada qué capacitación, con su estado y progreso |
| `constancias` | Una constancia por inscripción completada, con código único |

### 1.2 Escribir el esquema

- [ ] Crea **`database/schema.sql`**:

```sql
-- Esquema de la base de datos: Capacitación Docente (CERTUS)
-- ATENCIÓN: los DROP borran los datos. Solo para desarrollo.

DROP TABLE IF EXISTS constancias;
DROP TABLE IF EXISTS inscripciones;
DROP TABLE IF EXISTS capacitaciones;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
  id            SERIAL PRIMARY KEY,
  nombres       VARCHAR(100) NOT NULL,
  apellidos     VARCHAR(100) NOT NULL,
  correo        VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  rol           VARCHAR(20)  NOT NULL CHECK (rol IN ('docente', 'administrador')),
  sede          VARCHAR(100),
  programa      VARCHAR(100),
  activo        BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en     TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE capacitaciones (
  id             SERIAL PRIMARY KEY,
  titulo         VARCHAR(200) NOT NULL,
  descripcion    TEXT,
  duracion_horas INTEGER NOT NULL CHECK (duracion_horas > 0),
  instructor     VARCHAR(150),
  sede           VARCHAR(100),
  programa       VARCHAR(100),
  fecha_inicio   DATE,
  fecha_fin      DATE,
  activa         BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en      TIMESTAMP NOT NULL DEFAULT NOW(),
  CHECK (fecha_fin IS NULL OR fecha_inicio IS NULL OR fecha_fin >= fecha_inicio)
);

CREATE TABLE inscripciones (
  id              SERIAL PRIMARY KEY,
  usuario_id      INTEGER NOT NULL REFERENCES usuarios(id),
  capacitacion_id INTEGER NOT NULL REFERENCES capacitaciones(id),
  estado          VARCHAR(20) NOT NULL DEFAULT 'pendiente'
                  CHECK (estado IN ('pendiente', 'en_curso', 'completada')),
  progreso        INTEGER NOT NULL DEFAULT 0 CHECK (progreso BETWEEN 0 AND 100),
  fecha_limite    DATE,
  asignada_en     TIMESTAMP NOT NULL DEFAULT NOW(),
  completada_en   TIMESTAMP,
  actualizado_en  TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (usuario_id, capacitacion_id)
);

CREATE TABLE constancias (
  id             SERIAL PRIMARY KEY,
  inscripcion_id INTEGER NOT NULL UNIQUE REFERENCES inscripciones(id),
  codigo         VARCHAR(40) NOT NULL UNIQUE,
  emitida_en     TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_inscripciones_usuario ON inscripciones(usuario_id);
CREATE INDEX idx_inscripciones_capacitacion ON inscripciones(capacitacion_id);
```

Qué protege cada restricción:

| Restricción                            | Regla de negocio                                              |
| -------------------------------------- | ------------------------------------------------------------- |
| `usuarios.correo UNIQUE`               | No hay dos cuentas con el mismo correo                        |
| `CHECK (rol IN ...)`                   | Solo existen los roles docente y administrador                |
| `CHECK (estado IN ...)`                | Solo hay tres estados: pendiente, en curso, completada        |
| `UNIQUE (usuario_id, capacitacion_id)` | No se asigna dos veces la misma capacitación al mismo docente |
| `constancias.inscripcion_id UNIQUE`    | La constancia se genera **una sola vez** por inscripción      |
| `usuarios.activo`                      | Los usuarios se **desactivan**, no se eliminan                |

### 1.3 Datos de ejemplo

- [ ] Crea **`database/seed.sql`** (capacitaciones de ejemplo; los usuarios se crean en la Etapa 2 con contraseña cifrada):

```sql
INSERT INTO capacitaciones
  (titulo, descripcion, duracion_horas, instructor, sede, programa, fecha_inicio, fecha_fin)
VALUES
  ('Metodologías activas en el aula', 'Estrategias para fomentar la participación del estudiante.', 8, 'Equipo académico', 'Lima Centro', 'Todos', '2026-11-03', '2026-11-30'),
  ('Uso de la plataforma virtual', 'Gestión de cursos y evaluaciones en el aula virtual.', 6, 'Soporte TI', 'Lima Norte', 'Todos', '2026-11-05', '2026-12-05'),
  ('Evaluación por competencias', 'Diseño de rúbricas e instrumentos de evaluación.', 10, 'Equipo académico', 'Lima Sur', 'Todos', '2026-11-10', '2026-12-10'),
  ('Seguridad de la información', 'Buenas prácticas de seguridad para el personal docente.', 4, 'Soporte TI', 'Lima Centro', 'Todos', '2026-11-15', '2026-12-15');
```

### 1.4 Aplicar el esquema

Git Bash:

```bash
docker compose exec -T db psql -U capacitaciones -d capacitaciones_db < database/schema.sql
docker compose exec -T db psql -U capacitaciones -d capacitaciones_db < database/seed.sql
```

PowerShell (el símbolo `<` no funciona ahí; usa la tubería):

```powershell
Get-Content database\schema.sql -Raw | docker compose exec -T db psql -U capacitaciones -d capacitaciones_db
Get-Content database\seed.sql -Raw | docker compose exec -T db psql -U capacitaciones -d capacitaciones_db
```

- [ ] Verifica las tablas:

```bash
docker compose exec db psql -U capacitaciones -d capacitaciones_db -c "\dt"
docker compose exec db psql -U capacitaciones -d capacitaciones_db -c "select id, titulo from capacitaciones;"
```

- [ ] Aparecen las 4 tablas y las 4 capacitaciones de ejemplo.
- [ ] Prueba que la base te protege: intenta insertar un `rol` inválido y confirma que da error.

```bash
docker compose exec db psql -U capacitaciones -d capacitaciones_db -c "insert into usuarios (nombres, apellidos, correo, password_hash, rol) values ('x','y','z@z.com','abc','supervisor');"
```

### 1.5 Documentar y subir

- [ ] Crea `docs/modelo-datos.md` explicando en pocas líneas cada tabla y la imagen del diagrama.

```bash
git add .
git commit -m "feat(db): esquema SQL, datos de ejemplo y documentacion del modelo"
git push -u origin feature/modelo-datos
```

- [ ] Pull Request hacia `develop` y merge. Luego `git switch develop` y `git pull`.

### Etapa 1: listo cuando...

- [ ] Las 4 tablas existen y tienen sus restricciones
- [ ] El diagrama está en `docs/`
- [ ] Cualquier compañero puede recrear la base con 2 comandos (documentado en `docs/modelo-datos.md`)

---

# ETAPA 2: Autenticación y roles

**Objetivo:** que solo entren usuarios con correo institucional válido y que cada rol vea solo lo suyo.

> Cuando llegues aquí, pídeme el código de esta etapa. Debajo tienes el plan completo para que sepas qué construirás.

### 2.1 Preparación

- [ ] Rama: `git switch develop`, `git pull`, `git switch -c feature/autenticacion`.
- [ ] Averigua con tu docente el **dominio del correo institucional** (por ejemplo `@certus.edu.pe`; **confirma el real**) y agrégalo a `.env.example` y `.env` como `ALLOWED_EMAIL_DOMAIN=...`.
- [ ] Instala en `apps/api`: `npm install bcryptjs jsonwebtoken cookie-parser express-rate-limit`.

### 2.2 Qué construirás en la API

| Archivo                               | Responsabilidad                                                              |
| ------------------------------------- | ---------------------------------------------------------------------------- |
| `repositories/usuarios.repository.js` | Buscar usuario por correo; crear; listar; activar o desactivar               |
| `services/auth.service.js`            | Validar correo y dominio, comparar contraseña (`bcryptjs`), generar el token |
| `controllers/auth.controller.js`      | Recibir login y logout, y responder                                          |
| `routes/auth.routes.js`               | `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`          |
| `middlewares/requireAuth.js`          | Verifica la cookie con el token en cada petición protegida                   |
| `middlewares/requireRole.js`          | `requireRole('administrador')` bloquea a quien no tenga el rol               |
| `scripts/seed-usuarios.js`            | Crea un administrador y 3 docentes de prueba con contraseña cifrada          |

### 2.3 Reglas de seguridad de esta etapa

- [ ] Las contraseñas se guardan con **hash** (`bcryptjs`), nunca en texto plano.
- [ ] El token JWT viaja en una **cookie `httpOnly`** (con `sameSite` y, en producción, `secure`).
- [ ] El login tiene **límite de intentos** (`express-rate-limit`).
- [ ] El mensaje de error del login es el mismo si falla el correo o la contraseña ("Credenciales inválidas").
- [ ] Solo se aceptan correos del dominio institucional y usuarios con `activo = true`.
- [ ] Las rutas de administrador están protegidas con `requireRole`, **también en el backend** (no solo ocultar botones).

### 2.4 Qué construirás en React

- [ ] `pages/Login/` con formulario, mensajes de error claros y estado de carga.
- [ ] `context/AuthContext.jsx` que guarda el usuario actual y llama a `/api/auth/me` al abrir la app.
- [ ] `components/ProtectedRoute/` que redirige al login si no hay sesión, o a otra página si el rol no corresponde.
- [ ] Rutas con React Router: `/login`, `/docente/...`, `/admin/...`.

### 2.5 Pruebas manuales (Thunder Client o Postman)

- [ ] Login correcto devuelve los datos del usuario y guarda la cookie.
- [ ] Login con contraseña mala devuelve 401.
- [ ] Login con correo fuera del dominio devuelve 400.
- [ ] Un docente que llama a una ruta de administrador recibe 403.
- [ ] Sin sesión, una ruta protegida devuelve 401.
- [ ] Más de N intentos seguidos activan el límite.

```bash
git add .
git commit -m "feat(auth): login con cookie httpOnly, roles y rutas protegidas"
git push -u origin feature/autenticacion
```

- [ ] Pull Request hacia `develop` y merge.

### Etapa 2: listo cuando...

- [ ] Puedes entrar como administrador y como docente, y cada uno llega a su pantalla
- [ ] Todas las pruebas de 2.5 pasan

---

# ETAPA 3: Gestión de capacitaciones y docentes

**Objetivo:** que el administrador cree y mantenga el catálogo y las cuentas.

### 3.1 Preparación

- [ ] Rama: `feature/gestion-capacitaciones`.

### 3.2 Endpoints (solo administrador)

| Método y ruta                          | Qué hace                            |
| -------------------------------------- | ----------------------------------- |
| `GET /api/capacitaciones`              | Lista (con búsqueda por título)     |
| `GET /api/capacitaciones/:id`          | Detalle                             |
| `POST /api/capacitaciones`             | Crear                               |
| `PUT /api/capacitaciones/:id`          | Editar                              |
| `PATCH /api/capacitaciones/:id/estado` | Activar o desactivar (no se borra)  |
| `GET /api/usuarios`                    | Lista de docentes y administradores |
| `POST /api/usuarios`                   | Crear usuario                       |
| `PUT /api/usuarios/:id`                | Editar usuario                      |
| `PATCH /api/usuarios/:id/estado`       | Activar o desactivar                |

### 3.3 Reglas

- [ ] Solo el administrador crea, edita o desactiva capacitaciones.
- [ ] Validar los datos de entrada en el backend (campos obligatorios, duración mayor que 0, fecha fin posterior a fecha inicio, correo con dominio institucional).
- [ ] Desactivar, **no eliminar**: se conserva el historial.
- [ ] Cada fila lleva su fecha de creación (ya está en las tablas).

### 3.4 Componentes base de React (con su propio CSS cada uno)

- [ ] `Button`, `Input`, `Select`, `Card`, `Badge` (estados con color), `Table`, `Modal`, `Navbar`/`Sidebar`, `Toast` (avisos de éxito o error), `Spinner`.
- [ ] Diseño responsivo: menú tipo hamburguesa en móvil, tablas con desplazamiento horizontal.

### 3.5 Pantallas

- [ ] Administrador > Capacitaciones: tabla con búsqueda, botón **Nueva**, editar y desactivar.
- [ ] Administrador > Docentes: tabla con alta, edición y desactivación.

### 3.6 Pruebas y cierre

- [ ] Crear una capacitación con datos inválidos muestra un mensaje claro (no pantalla en blanco).
- [ ] Un docente no puede abrir las pantallas de administrador.

```bash
git add .
git commit -m "feat: CRUD de capacitaciones y usuarios con validaciones"
git push -u origin feature/gestion-capacitaciones
```

- [ ] Pull Request y merge.

### Etapa 3: listo cuando...

- [ ] Administras capacitaciones y usuarios desde la interfaz, con validaciones y mensajes de error legibles

---

# EVALUACIÓN DE AVANCE (semana 4)

Vale el **50 %** de la nota. Se califica con 5 criterios de 0 a 4 puntos (20 en total). Usa esta lista para llegar a _Sobresaliente_.

### Informe de avance (documento) y presentación

- [ ] **1. Identificación de la problemática (4 pts):** contexto de CERTUS, a quién afecta (docentes, gestores), qué falla hoy (control disperso, falta de trazabilidad, constancias lentas) y qué implicaciones tiene. Incluye la **Ficha del Anexo 1**.
- [ ] **2. Propuesta de solución (4 pts):** qué hace el sistema, cómo cubre los 4 requisitos del caso, **por qué elegiste cada tecnología** (una línea de justificación por decisión).
- [ ] **3. Planificación (4 pts)**, con todos estos apartados completos:
  - [ ] Resumen ejecutivo
  - [ ] Objetivos claros y alineados con el proyecto
  - [ ] Alcance (qué entra y qué **no** entra)
  - [ ] Cronograma detallado de 8 semanas
  - [ ] Presupuesto
  - [ ] Análisis de riesgos
- [ ] **4. Desarrollo del proyecto (4 pts):** demo funcionando. Mínimo recomendado: login por roles + gestión de capacitaciones + base de datos en Docker, con capturas en el informe.
- [ ] **5. Viabilidad y sostenibilidad (4 pts):** viabilidad técnica, económica y operativa, riesgos con estrategias y plan para sostener el sistema a largo plazo.

### Plantilla de riesgos (ajústala a tu equipo)

| Riesgo                           | Probabilidad | Impacto | Mitigación                                                  |
| -------------------------------- | ------------ | ------- | ----------------------------------------------------------- |
| Pérdida de datos                 | Media        | Alto    | Copias de seguridad con `pg_dump` y volumen de Docker       |
| Fuga de credenciales             | Media        | Alto    | `.env` fuera del repo, GitHub Secrets, claves rotadas       |
| Retraso por carga académica      | Alta         | Medio   | Priorizar el alcance mínimo y revisar el avance cada semana |
| Un integrante no disponible      | Media        | Medio   | Pull Requests, documentación y tareas compartidas           |
| Vulnerabilidades en dependencias | Media        | Medio   | `npm audit` y Dependabot                                    |
| Diferencias entre PCs del equipo | Media        | Bajo    | Docker Compose para un entorno igual                        |

### Plantilla de presupuesto (reemplaza los ejemplos por tus datos)

| Concepto                                   | Detalle                                                  | Costo estimado |
| ------------------------------------------ | -------------------------------------------------------- | -------------- |
| Recurso humano                             | 5 integrantes × horas del proyecto (valorizado)          | (calcula)      |
| Herramientas de desarrollo                 | Node.js, PostgreSQL, Docker, VS Code, GitHub (gratuitas) | S/ 0           |
| Infraestructura de pruebas                 | Entorno local con Docker                                 | S/ 0           |
| Infraestructura de producción (proyección) | Servidor o hosting para el despliegue real               | (cotiza)       |
| Mantenimiento anual (proyección)           | Horas de soporte y actualizaciones                       | (estima)       |

### Presentación

- [ ] Preparada y ensayada, con demo en vivo y plan B (capturas o video corto por si falla algo).

---

# ETAPA 4: Asignación y progreso

**Objetivo:** que el administrador asigne capacitaciones y el docente vea y actualice su progreso.

### 4.1 Preparación

- [ ] Rama: `feature/asignacion-progreso`.

### 4.2 Endpoints

| Método y ruta                           | Rol             | Qué hace                                            |
| --------------------------------------- | --------------- | --------------------------------------------------- |
| `POST /api/inscripciones`               | Administrador   | Asigna una capacitación a **uno o varios** docentes |
| `GET /api/inscripciones`                | Administrador   | Lista con filtros (docente, capacitación, estado)   |
| `GET /api/inscripciones/mias`           | Docente         | Sus capacitaciones con estado y progreso            |
| `PATCH /api/inscripciones/:id/progreso` | Docente (dueño) | Actualiza progreso y estado                         |

### 4.3 Reglas de negocio

- [ ] Estados válidos: `pendiente`, `en_curso`, `completada`.
- [ ] Un docente **solo ve y modifica sus propias inscripciones** (comprobar el dueño en el backend).
- [ ] Al llegar el progreso a 100 %, el estado pasa a `completada` y se registra `completada_en`.
- [ ] No se puede asignar dos veces la misma capacitación al mismo docente (la base ya lo impide; devuelve un mensaje claro, no un error técnico).
- [ ] Toda asignación y cambio de estado queda con fecha.
- [ ] Al completar se genera la constancia **dentro de una transacción** (`BEGIN` / `COMMIT`) para que nunca queden datos a medias.

### 4.4 Pantallas

- [ ] Docente > **Mis capacitaciones:** tarjetas con barra de progreso, estado (Badge) y botón para actualizar.
- [ ] Administrador > **Asignar:** elegir capacitación, marcar docentes y confirmar.

### 4.5 Pruebas y cierre

- [ ] Un docente no puede modificar la inscripción de otro (devuelve 403 o 404).
- [ ] El progreso solo acepta valores de 0 a 100.
- [ ] Asignar duplicado muestra un aviso entendible.

```bash
git add .
git commit -m "feat: asignacion de capacitaciones y seguimiento de progreso"
git push -u origin feature/asignacion-progreso
```

- [ ] Pull Request y merge.

---

# ETAPA 5: Constancias en PDF con código QR

**Objetivo:** que el docente descargue su constancia solo cuando completó la capacitación.

### 5.1 Preparación

- [ ] Rama: `feature/constancias`.
- [ ] En `apps/api`: `npm install pdfkit qrcode`.

### 5.2 Endpoints

| Método y ruta                            | Acceso                | Qué hace                           |
| ---------------------------------------- | --------------------- | ---------------------------------- |
| `GET /api/constancias/mias`              | Docente               | Lista de sus constancias           |
| `GET /api/constancias/:id/descargar`     | Dueño o administrador | Devuelve el PDF                    |
| `GET /api/constancias/verificar/:codigo` | **Público**           | Confirma si el código es auténtico |

### 5.3 Reglas

- [ ] **No se descarga** la constancia si la capacitación no está completada (validar en el backend).
- [ ] Una sola constancia por inscripción (`UNIQUE` en la base).
- [ ] La constancia incluye como mínimo: **nombre del docente, capacitación, fecha, duración y código** único; el QR apunta a la página de verificación.
- [ ] El código se genera con un valor difícil de adivinar (por ejemplo `crypto.randomUUID()` recortado).
- [ ] La verificación pública muestra solo lo necesario (nombre, capacitación, fecha), no datos sensibles.

### 5.4 Pantallas

- [ ] Docente > **Mis constancias:** lista con botón **Descargar PDF**.
- [ ] Página pública **Verificar constancia** (campo de código y resultado).

### 5.5 Pruebas y cierre

- [ ] Intentar descargar una constancia de otro docente devuelve error de permisos.
- [ ] Un código inventado en la verificación muestra "no válida".
- [ ] El PDF abre bien y el QR se lee con el celular.

```bash
git add .
git commit -m "feat: constancias en PDF con codigo QR y verificacion publica"
git push -u origin feature/constancias
```

- [ ] Pull Request y merge.

---

# ETAPA 6: Reportes con filtros y exportación

**Objetivo:** que el gestor haga seguimiento del cumplimiento de todos los docentes.

### 6.1 Preparación

- [ ] Rama: `feature/reportes`.

### 6.2 Endpoints (solo administrador)

| Método y ruta                             | Qué hace                                                                            |
| ----------------------------------------- | ----------------------------------------------------------------------------------- |
| `GET /api/reportes/resumen`               | Totales: inscripciones, completadas, en curso, pendientes y % de cumplimiento       |
| `GET /api/reportes/cumplimiento`          | Detalle con filtros: sede, programa, docente, capacitación, estado, rango de fechas |
| `GET /api/reportes/cumplimiento/exportar` | Mismo detalle en **CSV**                                                            |

### 6.3 Reglas

- [ ] Los filtros son opcionales y combinables; construye el SQL con **parámetros** (nunca concatenes texto del usuario).
- [ ] El CSV respeta los filtros aplicados.
- [ ] Solo el administrador accede.

### 6.4 Pantallas

- [ ] Administrador > **Dashboard:** tarjetas con los totales y el porcentaje de cumplimiento (al final, si hay tiempo, una gráfica simple).
- [ ] Administrador > **Reportes:** filtros arriba, tabla con resultados y botón **Exportar CSV**.

### 6.5 Pruebas y cierre

- [ ] Cada filtro por separado y combinados dan resultados coherentes.
- [ ] El CSV abre en Excel con tildes correctas (guárdalo en UTF-8 con BOM si hace falta).

```bash
git add .
git commit -m "feat: reportes de cumplimiento con filtros y exportacion CSV"
git push -u origin feature/reportes
```

- [ ] Pull Request y merge.

---

# ETAPA 7: Calidad, seguridad y pulido

**Objetivo:** que el prototipo sea estable, seguro y se vea bien en celular.

### 7.1 Rama y revisiones

- [ ] Rama: `feature/calidad`.

### 7.2 Seguridad (checklist)

- [ ] Contraseñas con hash y nunca en logs ni respuestas.
- [ ] Todas las rutas sensibles exigen sesión y rol, verificado en el backend.
- [ ] Todas las consultas SQL usan parámetros.
- [ ] Validación de datos en el backend para cada endpoint que recibe datos.
- [ ] `helmet`, CORS restringido y límite de intentos en el login.
- [ ] Ningún secreto en el código ni en el repositorio (`git log -p | grep -i password` no muestra claves reales).
- [ ] `npm audit` revisado en `apps/api` y `apps/web`.
- [ ] Mensajes de error genéricos hacia el cliente (sin detalles técnicos en producción).

### 7.3 Control de errores (checklist)

- [ ] Todos los errores de la API tienen el formato `{ error: { code, message } }`.
- [ ] El frontend muestra los errores con avisos (Toast) y no se queda en blanco.
- [ ] Estados de carga y de "sin datos" en todas las listas.

### 7.4 Responsive

- [ ] Probado en ancho de celular (en el navegador: `F12` > modo dispositivo).
- [ ] Menú adaptable, tablas con desplazamiento y botones fáciles de tocar.

### 7.5 Casos de prueba manuales (anótalos con su resultado para el informe)

| #   | Caso                                            | Resultado esperado                      | ¿Pasó? |
| --- | ----------------------------------------------- | --------------------------------------- | ------ |
| 1   | Login correcto como docente                     | Entra al panel docente                  | [ ]    |
| 2   | Login con contraseña incorrecta                 | Mensaje "Credenciales inválidas"        | [ ]    |
| 3   | Docente intenta abrir pantalla de administrador | Redirigido o 403                        | [ ]    |
| 4   | Administrador crea capacitación válida          | Aparece en el listado                   | [ ]    |
| 5   | Administrador asigna capacitación a 2 docentes  | Ambos la ven                            | [ ]    |
| 6   | Docente llega a 100 %                           | Estado completada y constancia generada | [ ]    |
| 7   | Descargar constancia no completada              | Rechazado                               | [ ]    |
| 8   | Verificar código inventado                      | "No válida"                             | [ ]    |
| 9   | Reporte filtrado por estado                     | Solo esos registros                     | [ ]    |
| 10  | Exportar CSV                                    | Archivo con los datos filtrados         | [ ]    |

### 7.6 Cierre

```bash
git add .
git commit -m "chore: revision de seguridad, errores y responsive"
git push -u origin feature/calidad
```

- [ ] Pull Request y merge.

---

# ETAPA 8: Docker completo y GitHub Actions

**Objetivo:** que todo el sistema levante con un comando y que cada Pull Request se verifique solo.

### 8.1 Rama

- [ ] `feature/docker-ci`.

### 8.2 Dockerizar API y web

- [ ] `apps/api/Dockerfile` (imagen de Node que instala dependencias y ejecuta `npm start`).
- [ ] `apps/web/Dockerfile` en dos etapas: compila con Vite y sirve los archivos con Nginx.
- [ ] `.dockerignore` en cada app (excluye `node_modules` y `.env`).
- [ ] Agregar los servicios `api` y `web` a `docker-compose.yml`, con la API apuntando a la base por el nombre del servicio (`DB_HOST=db`).
- [ ] `docker compose up --build` levanta los tres servicios y todo funciona.

> Pídeme los Dockerfiles cuando llegues aquí y los armamos juntos.

### 8.3 GitHub Actions

- [ ] Crea `.github/workflows/ci.yml` (y borra el `.gitkeep` de esa carpeta):

```yaml
name: CI

on:
  pull_request:
    branches: [develop, main]
  push:
    branches: [develop, main]

jobs:
  api:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: apps/api
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: apps/api/package-lock.json
      - run: npm ci
      - run: npm audit --audit-level=high
        continue-on-error: true

  web:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: apps/web
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: apps/web/package-lock.json
      - run: npm ci
      - run: npm run build
```

- [ ] Sube la rama, abre el Pull Request y confirma que aparecen las verificaciones (✔ verde).
- [ ] Si hay fallos, entra a la pestaña **Actions** de GitHub, abre el trabajo que falló y lee el error.
- [ ] (Opcional) Activa **Dependabot** en Settings > Security para recibir avisos de dependencias.
- [ ] (Opcional) Agrega el badge del CI en el README.

```bash
git add .
git commit -m "ci: Dockerfiles, compose completo y GitHub Actions"
git push -u origin feature/docker-ci
```

- [ ] Pull Request y merge.

### 8.4 Copias de seguridad (sirve para el criterio de viabilidad)

Git Bash:

```bash
docker compose exec -T db pg_dump -U capacitaciones capacitaciones_db > backup.sql
```

- [ ] Haz una copia de prueba y guárdala **fuera del repositorio** (agrega `backup*.sql` al `.gitignore`).

---

# ETAPA 9: Documentación, informe final y exposición

**Objetivo:** cerrar bien la evaluación final (semana 8, 50 % de la nota).

### 9.1 Antes de entregar

- [ ] `develop` está estable. Crea un Pull Request de `develop` a `main` para la **versión final**.
- [ ] Crea una etiqueta de versión: `git tag v1.0.0` y `git push origin v1.0.0`.
- [ ] README final: cómo ejecutarlo, capturas de pantalla, integrantes y enlaces.
- [ ] Verifica con un compañero: clona el repo en limpio, sigue el README y comprueba que funciona.

### 9.2 Informe final

- [ ] Todo lo del informe de avance, **actualizado**.
- [ ] Arquitectura (diagrama de React, API y base de datos).
- [ ] Modelo de datos y reglas de negocio.
- [ ] Seguridad aplicada (lista de la Etapa 7) y control de errores.
- [ ] Resultados de las pruebas (tabla de casos de la Etapa 7).
- [ ] Capturas de cada pantalla importante.
- [ ] Prototipos, manuales o formatos en **anexos**.
- [ ] Reflexión sobre el proceso y los aprendizajes.
- [ ] Mejoras futuras (por ejemplo: despliegue en la nube, notificaciones por correo, integración con sistemas institucionales).

### 9.3 Pitch de 5 a 7 minutos

| Minutos   | Contenido                                                                      |
| --------- | ------------------------------------------------------------------------------ |
| 0:00-0:45 | Problema: el control de capacitaciones docentes en CERTUS                      |
| 0:45-1:30 | Solución propuesta y a quién beneficia                                         |
| 1:30-4:30 | **Demo en vivo:** login, asignar, avanzar progreso, constancia con QR, reporte |
| 4:30-5:30 | Tecnología y seguridad (en 3 ideas, sin entrar en código)                      |
| 5:30-6:30 | Viabilidad, sostenibilidad y próximos pasos                                    |
| 6:30-7:00 | Cierre y preguntas                                                             |

- [ ] Ensayo completo con cronómetro, repartiendo quién habla en cada parte.
- [ ] Plan B: video corto de la demo por si falla internet o Docker.

### 9.4 Proyectos destacados

- [ ] Si el docente elige los mejores, prepara tu repositorio y una carpeta con el informe y los anexos para compartir con CERTUS.

---

## Problemas comunes

| Síntoma                                                  | Causa probable                                        | Solución                                                                                               |
| -------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `GH007: Your push would publish a private email address` | Tu correo personal está en los commits                | Usa el correo `noreply` de GitHub y repite el commit con `git commit --amend --reset-author --no-edit` |
| `mkdir -p` o `touch` no funcionan                        | Estás en PowerShell                                   | Cambia a Git Bash o usa la versión PowerShell indicada                                                 |
| El puerto 5432 está ocupado                              | Hay otro PostgreSQL instalado                         | Cambia `POSTGRES_PORT` en `.env` (por ejemplo a 5433) y ejecuta `docker compose up -d`                 |
| `password authentication failed`                         | Cambiaste la clave en `.env` después de crear la base | `docker compose down -v` y `docker compose up -d` (borra los datos)                                    |
| `ECONNREFUSED`                                           | La base no está encendida o `DB_HOST` está mal        | `docker compose ps` y revisa `.env`                                                                    |
| Error de CORS en el navegador                            | Puerto del frontend distinto o proxy mal puesto       | Usa el puerto 5173 y revisa el `proxy` en `vite.config.js`                                             |
| `docker` no se reconoce                                  | Docker Desktop cerrado                                | Ábrelo y espera a que termine de iniciar                                                               |
| La API no lee el `.env`                                  | Ejecutas `npm run dev` desde otra carpeta             | Hazlo desde `apps/api`                                                                                 |
| Aviso `LF will be replaced by CRLF`                      | Windows convierte saltos de línea                     | Es normal; no hace falta hacer nada                                                                    |
| `git push` rechazado por la regla                        | Intentas subir directo a `main` o `develop`           | Trabaja en una rama `feature/...` y abre un Pull Request                                               |

---

_Última actualización: octubre de 2026. Marca tu avance y haz commit de este archivo cada vez que completes una etapa._
