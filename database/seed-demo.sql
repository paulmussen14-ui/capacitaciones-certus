-- Datos de DEMOSTRACIÓN: asigna capacitaciones a los docentes de prueba con distinto avance.
-- Sirve para ver el ranking de métricas y probar la regla de eliminar.
-- Requisitos: haber corrido schema.sql, seed.sql y `npm run seed:usuarios`.
-- Cuando hagas la Etapa 4 (asignación real), borra estas filas: DELETE FROM inscripciones;

INSERT INTO inscripciones (usuario_id, capacitacion_id, estado, progreso, completada_en)
SELECT u.id, c.id, v.estado, v.progreso,
       CASE WHEN v.estado = 'completada' THEN NOW() END
FROM (VALUES
  ('docente1', 'Metodologías activas en el aula',  'completada', 100),
  ('docente1', 'Uso de la plataforma virtual',     'completada', 100),
  ('docente1', 'Evaluación por competencias',      'en_curso',    70),
  ('docente2', 'Metodologías activas en el aula',  'completada', 100),
  ('docente2', 'Uso de la plataforma virtual',     'en_curso',    55),
  ('docente2', 'Seguridad de la información',      'pendiente',    0),
  ('docente3', 'Metodologías activas en el aula',  'en_curso',    30),
  ('docente3', 'Evaluación por competencias',      'pendiente',    0)
) AS v(prefijo, titulo, estado, progreso)
JOIN usuarios u       ON u.correo LIKE v.prefijo || '@%'
JOIN capacitaciones c ON c.titulo = v.titulo
ON CONFLICT (usuario_id, capacitacion_id) DO NOTHING;
