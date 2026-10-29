# Capacitación Docente – CERTUS

Prototipo de aplicación web responsiva para gestionar las capacitaciones de los docentes de CERTUS: seguimiento del progreso, constancias descargables y reportes para el gestor.

## Tecnologías

Node.js + Express · PostgreSQL · React (Vite) · Docker · GitHub Actions

## Requisitos

Node.js LTS, Git y Docker Desktop.

## Cómo ejecutar

1. Copia las variables de entorno y edítalas: `cp .env.example .env` (en PowerShell: `Copy-Item .env.example .env`)
2. Levanta la base de datos: `docker compose up -d`
3. API: `cd apps/api && npm install && npm run dev`
4. Web: `cd apps/web && npm install && npm run dev`
5. Abre http://localhost:5173

> Si ya tienes otro PostgreSQL instalado en tu PC usando el puerto 5432, cambia `POSTGRES_PORT=5433` en tu `.env` (no en `.env.example`) y reinicia la API.

## Estructura

- `apps/api`: backend (Express, organizado en rutas, controladores, servicios y repositorios)
- `apps/web`: frontend (React, con estilos separados por componente)
- `database`: scripts SQL
- `docs`: documentación del proyecto

## Normas de trabajo

- Ramas: `main` (estable) → `develop` → `feature/nombre-de-la-tarea`.
- Todo cambio entra por Pull Request.
- Commits con prefijo: `feat:`, `fix:`, `docs:`, `chore:`.
- El archivo `.env` nunca se sube.

## Integrantes

(Agrega aquí los nombres del equipo)
