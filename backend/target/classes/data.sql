-- Este archivo se ejecuta automáticamente al iniciar Spring Boot

-- ========================================
-- LIMPIAR Y REINSERTAR PRODUCTOS (OPCIONAL)
-- ========================================
-- Si quieres empezar limpio cada vez, descomenta esta línea:
-- DELETE FROM menu_item;

-- ========================================
-- INSERTAR USUARIOS DE PRUEBA
-- ========================================
INSERT INTO usuario (username, password, rol) 
SELECT * FROM (VALUES 
    ('admin', 'admin123', 'ADMIN')
) AS t(username, password, rol)
WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE usuario.username = t.username);

