-- Agrega imágenes a capacitaciones y fotos de perfil a usuarios SIN borrar datos.
-- Úsala en una base que ya tiene información (el schema.sql completo sí borra todo).
ALTER TABLE capacitaciones ADD COLUMN IF NOT EXISTS imagen_url VARCHAR(255);
ALTER TABLE usuarios       ADD COLUMN IF NOT EXISTS foto_url   VARCHAR(255);
