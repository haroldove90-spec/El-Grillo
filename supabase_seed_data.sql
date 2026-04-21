/* 
  EL GRILLO - SCRIPT DE POBLAMIENTO DEFINITIVO
  Carga estos datos para ver las métricas y columnas llenas.
*/

-- 1. Clientes
INSERT INTO clients (first_name, last_name, phone, email) VALUES
('Alejandro', 'García', '5512345678', 'ale.garcia@gmail.com'),
('Mariana', 'López', '5523456789', 'mariana.l@outlook.com'),
('Roberto', 'Sánchez', '5534567890', 'rsanchez@yahoo.com'),
('Claudia', 'Mendoza', '5545678901', 'clau.mendoza@gmail.com'),
('Fernando', 'Heredia', '5556789012', 'f.heredia@protonmail.com'),
('Beatriz', 'Ortiz', '5567890123', 'beatriz.o@gmail.com'),
('Santiago', 'Ramírez', '5578901234', 'santi.ram@me.com'),
('Gabriela', 'Torres', '5589012345', 'gaby.torres@gmail.com'),
('Enrique', 'Villarreal', '5590123456', 'enrique.v@outlook.com'),
('Isabel', 'Domínguez', '5501234567', 'isabel.d@gmail.com');

-- 2. Vehículos
INSERT INTO vehicles (client_id, make, model, year, license_plate, color, vin) VALUES
((SELECT id FROM clients WHERE phone = '5512345678'), 'Mazda', 'CX-5', 2021, 'PXD-45-21', 'Rojo Alma', 'MZ123456789'),
((SELECT id FROM clients WHERE phone = '5523456789'), 'Seat', 'Ibiza', 2018, 'GBK-88-18', 'Azul Eléctrico', 'ST101020202'),
((SELECT id FROM clients WHERE phone = '5534567890'), 'Ford', 'F-150', 2015, 'TX-90-TRK', 'Blanco', 'FD888877766'),
((SELECT id FROM clients WHERE phone = '5545678901'), 'Honda', 'Civic', 2020, 'HND-20-Civ', 'Gris Metálico', 'HD333444555'),
((SELECT id FROM clients WHERE phone = '5556789012'), 'Toyota', 'Tacoma', 2019, 'TCM-19-XP', 'Arena', 'TY555666777'),
((SELECT id FROM clients WHERE phone = '5567890123'), 'Volkswagen', 'Golf GTI', 2017, 'GTI-07-VW', 'Blanco', 'VW777666555'),
((SELECT id FROM clients WHERE phone = '5578901234'), 'Nissan', 'Sentra', 2022, 'NSN-22-MX', 'Negro', 'NS222333444'),
((SELECT id FROM clients WHERE phone = '5589012345'), 'BMW', '330i', 2021, 'BMW-33-I', 'Azul Marino', 'BM111222333'),
((SELECT id FROM clients WHERE phone = '5590123456'), 'Jeep', 'Wrangler', 2012, 'JP-4X4-RC', 'Verde Militar', 'JP999000111'),
((SELECT id FROM clients WHERE phone = '5501234567'), 'Kia', 'Rio', 2023, 'KIA-23-RIO', 'Plata', 'KA444555666');

-- 3. Órdenes de Servicio
-- Recepcion
INSERT INTO service_orders (vehicle_id, order_number, status, total_amount, notes, apply_iva) VALUES
((SELECT id FROM vehicles WHERE license_plate = 'PXD-45-21'), 1001, 'Recepcion', 1500.00, 'Falla en alternador - no carga batería. Revisión de diodos.', true),
((SELECT id FROM vehicles WHERE license_plate = 'TCM-19-XP'), 1005, 'Recepcion', 1200.00, 'Cambio de aceite sintético 5W30 y filtro de aceite original.', false),
((SELECT id FROM vehicles WHERE license_plate = 'JP-4X4-RC'), 1009, 'Recepcion', 500.00, 'Lavado detallado de motor con desengrasante biodegradable.', false);

-- Diagnostico
INSERT INTO service_orders (vehicle_id, order_number, status, total_amount, notes, apply_iva) VALUES
((SELECT id FROM vehicles WHERE license_plate = 'GBK-88-18'), 1002, 'Diagnostico', 2450.00, 'Cambio de balatas delanteras y rectificado de discos.', false),
((SELECT id FROM vehicles WHERE license_plate = 'GTI-07-VW'), 1006, 'Diagnostico', 4500.00, 'Ruido metálico en suspensión delantera derecha al girar.', true);

-- En Reparacion
INSERT INTO service_orders (vehicle_id, order_number, status, total_amount, notes, apply_iva) VALUES
((SELECT id FROM vehicles WHERE license_plate = 'TX-90-TRK'), 1003, 'En Reparacion', 8900.00, 'Fuga de refrigerante en A/C. Cambio de mangueras y carga de gas.', true),
((SELECT id FROM vehicles WHERE license_plate = 'NSN-22-MX'), 1007, 'En Reparacion', 12500.00, 'Sobrecalentamiento motor. Rectificado de cabeza y juntas nuevas.', true),
((SELECT id FROM vehicles WHERE license_plate = 'KIA-23-RIO'), 1010, 'En Reparacion', 2800.00, 'Instalación de kit de sensores de reversa y cámara.', true);

-- Listo
INSERT INTO service_orders (vehicle_id, order_number, status, total_amount, notes, apply_iva) VALUES
((SELECT id FROM vehicles WHERE license_plate = 'HND-20-Civ'), 1004, 'Listo', 3200.00, 'Afinación mayor, limpieza de cuerpo de aceleración y cambio de bujías.', true),
((SELECT id FROM vehicles WHERE license_plate = 'BMW-33-I'), 1008, 'Listo', 6800.00, 'Servicio de mantenimiento por kilometraje (Check de 50 puntos).', true);

-- 4. Inventario
INSERT INTO inventory (part_name, sku, quantity, unit_price, reorder_level, category) VALUES
('Aceite Sintético 5W30 (L)', 'OIL-5W30-S', 45, 185.00, 10, 'Lubricantes'),
('Bujía Iridium Ngk Laser', 'BJR-IRD-7', 8, 220.00, 12, 'Encendido'),
('Filtro de Aire Universal MK', 'FLT-AIR-01', 25, 340.00, 5, 'Filtros'),
('Líquido de Frenos Dot4 (500ml)', 'BRK-LIQ-4', 12, 145.00, 10, 'Líquidos'),
('Banda de Accesorios Poly-V', 'BND-ACC-VW', 3, 450.00, 5, 'Transmisión');
