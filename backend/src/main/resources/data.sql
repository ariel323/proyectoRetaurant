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

-- ========================================
-- INSERTAR MESAS
-- ========================================
INSERT INTO mesa (numero, estado) 
SELECT * FROM (VALUES 
    (1, 'LIBRE'),
    (2, 'LIBRE'),
    (3, 'LIBRE'),
    (4, 'OCUPADA'),
    (5, 'RESERVADA'),
    (6, 'LIBRE'),
    (7, 'LIBRE'),
    (8, 'LIBRE'),
    (9, 'OCUPADA'),
    (10, 'LIBRE'),
    (11, 'LIBRE'),
    (12, 'RESERVADA'),
    (13, 'LIBRE'),
    (14, 'LIBRE'),
    (15, 'LIBRE'),
    (16, 'OCUPADA'),
    (17, 'LIBRE'),
    (18, 'LIBRE'),
    (19, 'LIBRE'),
    (20, 'RESERVADA'),
    (21, 'LIBRE'),
    (22, 'LIBRE'),
    (23, 'LIBRE'),
    (24, 'LIBRE'),
    (25, 'OCUPADA')
) AS t(numero, estado)
WHERE NOT EXISTS (SELECT 1 FROM mesa WHERE mesa.numero = t.numero);

-- ========================================
-- INSERTAR PRODUCTOS DEL MENÚ
-- ========================================

-- ENTRADAS
INSERT INTO menu_item (nombre, categoria, precio) 
SELECT * FROM (VALUES 
    ('Ensalada César', 'ENTRADAS', 12.50),
    ('Bruschetta Italiana', 'ENTRADAS', 8.75),
    ('Calamares a la Romana', 'ENTRADAS', 15.00),
    ('Tabla de Quesos', 'ENTRADAS', 18.50),
    ('Croquetas de Jamón', 'ENTRADAS', 9.25),
    ('Nachos con Guacamole', 'ENTRADAS', 11.00),
    ('Sopa de Tomate', 'ENTRADAS', 7.50),
    ('Empanadas Argentinas', 'ENTRADAS', 10.75)
) AS t(nombre, categoria, precio)
WHERE NOT EXISTS (SELECT 1 FROM menu_item WHERE menu_item.nombre = t.nombre);

-- PLATOS PRINCIPALES
INSERT INTO menu_item (nombre, categoria, precio) 
SELECT * FROM (VALUES 
    ('Paella Valenciana', 'PLATOS_PRINCIPALES', 28.50),
    ('Bistec a la Parrilla', 'PLATOS_PRINCIPALES', 24.00),
    ('Salmón Grillado', 'PLATOS_PRINCIPALES', 22.75),
    ('Pollo al Curry', 'PLATOS_PRINCIPALES', 19.50),
    ('Lasaña de Carne', 'PLATOS_PRINCIPALES', 16.25),
    ('Risotto de Champiñones', 'PLATOS_PRINCIPALES', 18.00),
    ('Tacos de Carnitas', 'PLATOS_PRINCIPALES', 15.75),
    ('Pizza Margarita', 'PLATOS_PRINCIPALES', 14.50),
    ('Hamburguesa Premium', 'PLATOS_PRINCIPALES', 17.25),
    ('Pescado a la Plancha', 'PLATOS_PRINCIPALES', 21.00),
    ('Pasta Carbonara', 'PLATOS_PRINCIPALES', 16.75),
    ('Parrillada Mixta', 'PLATOS_PRINCIPALES', 32.00)
) AS t(nombre, categoria, precio)
WHERE NOT EXISTS (SELECT 1 FROM menu_item WHERE menu_item.nombre = t.nombre);

-- POSTRES
INSERT INTO menu_item (nombre, categoria, precio) 
SELECT * FROM (VALUES 
    ('Tiramisú', 'POSTRES', 8.50),
    ('Cheesecake de Frutos Rojos', 'POSTRES', 9.25),
    ('Flan de Caramelo', 'POSTRES', 6.75),
    ('Brownie con Helado', 'POSTRES', 8.00),
    ('Mousse de Chocolate', 'POSTRES', 7.50),
    ('Tarta de Manzana', 'POSTRES', 7.25),
    ('Crème Brûlée', 'POSTRES', 9.00),
    ('Helado Artesanal (3 bolas)', 'POSTRES', 6.50)
) AS t(nombre, categoria, precio)
WHERE NOT EXISTS (SELECT 1 FROM menu_item WHERE menu_item.nombre = t.nombre);

-- BEBIDAS
INSERT INTO menu_item (nombre, categoria, precio) 
SELECT * FROM (VALUES 
    ('Coca Cola', 'BEBIDAS', 3.50),
    ('Agua Mineral', 'BEBIDAS', 2.50),
    ('Jugo de Naranja Natural', 'BEBIDAS', 4.25),
    ('Café Espresso', 'BEBIDAS', 2.75),
    ('Cappuccino', 'BEBIDAS', 3.75),
    ('Té Verde', 'BEBIDAS', 3.00),
    ('Limonada', 'BEBIDAS', 3.25),
    ('Cerveza Nacional', 'BEBIDAS', 4.50),
    ('Vino Tinto Copa', 'BEBIDAS', 6.00),
    ('Vino Blanco Copa', 'BEBIDAS', 5.75),
    ('Mojito', 'BEBIDAS', 8.50),
    ('Piña Colada', 'BEBIDAS', 9.00),
    ('Sangría', 'BEBIDAS', 7.25)
) AS t(nombre, categoria, precio)
WHERE NOT EXISTS (SELECT 1 FROM menu_item WHERE menu_item.nombre = t.nombre);

-- DESAYUNOS
INSERT INTO menu_item (nombre, categoria, precio) 
SELECT * FROM (VALUES 
    ('Desayuno Americano', 'DESAYUNOS', 12.00),
    ('Tostadas Francesas', 'DESAYUNOS', 8.50),
    ('Omelette de Queso', 'DESAYUNOS', 9.75),
    ('Pancakes con Miel', 'DESAYUNOS', 10.25),
    ('Croissant con Jamón', 'DESAYUNOS', 7.50),
    ('Yogurt con Granola', 'DESAYUNOS', 6.75),
    ('Bagel con Salmón', 'DESAYUNOS', 11.50)
) AS t(nombre, categoria, precio)
WHERE NOT EXISTS (SELECT 1 FROM menu_item WHERE menu_item.nombre = t.nombre);