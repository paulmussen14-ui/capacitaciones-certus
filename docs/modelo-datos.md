# Modelo de datos

Base de datos PostgreSQL del sistema de Capacitación Docente (CERTUS). El esquema completo está en `database/schema.sql` y los datos de ejemplo en `database/seed.sql`.

## Diagrama entidad-relación

![Diagrama entidad-relación](modelo-datos.png)

```mermaid
erDiagram
    usuarios ||--o{ inscripciones : "tiene"
    capacitaciones ||--o{ inscripciones : "se asigna en"
    inscripciones ||--o| constancias : "genera"

    usuarios {
        int id PK
        varchar nombres
        varchar apellidos
        varchar correo UK
        varchar password_hash
        varchar rol
        varchar sede
        varchar programa
        boolean activo
        timestamp creado_en
    }
    capacitaciones {
        int id PK
        varchar titulo
        text descripcion
        int duracion_horas
        varchar instructor
        varchar sede
        varchar programa
        date fecha_inicio
        date fecha_fin
        boolean activa
        timestamp creado_en
    }
    inscripciones {
        int id PK
        int usuario_id FK
        int capacitacion_id FK
        varchar estado
        int progreso
        date fecha_limite
        timestamp asignada_en
        timestamp completada_en
        timestamp actualizado_en
    }
    constancias {
        int id PK
        int inscripcion_id FK
        varchar codigo UK
        timestamp emitida_en
    }
```

## Tablas

| Tabla            | Para qué sirve                                                                                                               |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `usuarios`       | Docentes y administradores (gestores), diferenciados por la columna `rol`.                                                   |
| `capacitaciones` | Catálogo de capacitaciones con duración, instructor, sede, programa y fechas.                                                |
| `inscripciones`  | Qué docente tiene asignada qué capacitación, con su estado (`pendiente`, `en_curso`, `completada`) y su progreso de 0 a 100. |
| `constancias`    | Una constancia por inscripción completada, con un código único para verificarla.                                             |

## Reglas que protege la base de datos

| Restricción                            | Regla de negocio                                               |
| -------------------------------------- | -------------------------------------------------------------- |
| `usuarios.correo UNIQUE`               | No hay dos cuentas con el mismo correo.                        |
| `CHECK (rol IN ...)`                   | Solo existen los roles docente y administrador.                |
| `CHECK (estado IN ...)`                | Solo hay tres estados: pendiente, en curso y completada.       |
| `UNIQUE (usuario_id, capacitacion_id)` | No se asigna dos veces la misma capacitación al mismo docente. |
| `constancias.inscripcion_id UNIQUE`    | La constancia se genera una sola vez por inscripción.          |
| `usuarios.activo`                      | Los usuarios se desactivan, no se eliminan.                    |

## Recrear la base en 2 comandos

Con Docker encendido (`docker compose up -d`), desde la raíz del proyecto.

Git Bash:

```bash
docker compose exec -T db psql -U capacitaciones -d capacitaciones_db < database/schema.sql
docker compose exec -T db psql -U capacitaciones -d capacitaciones_db < database/seed.sql
```

PowerShell:

```powershell
Get-Content database\schema.sql -Raw | docker compose exec -T db psql -U capacitaciones -d capacitaciones_db
Get-Content database\seed.sql -Raw | docker compose exec -T db psql -U capacitaciones -d capacitaciones_db
```

Si cambiaste el usuario o la base en tu `.env`, usa esos nombres.

> Los `DROP` del esquema borran los datos existentes. Úsalo solo en desarrollo.
