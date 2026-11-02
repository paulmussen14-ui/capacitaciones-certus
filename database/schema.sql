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
