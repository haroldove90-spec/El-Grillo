-- Database schema for 'Servicio Automotriz El Grillo'
-- Designed for Supabase (PostgreSQL)

-- ENUMs for State Management
CREATE TYPE service_status AS ENUM (
    'Recepcion', 
    'Diagnostico', 
    'Cotizacion', 
    'Espera de Piezas', 
    'En Reparacion', 
    'Control de Calidad', 
    'Listo'
);

CREATE TYPE item_condition AS ENUM (
    'Green',  -- Bueno
    'Yellow', -- Sugerido
    'Red'     -- Urgente
);

-- 1. STAFF
CREATE TABLE staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    role TEXT NOT NULL, -- e.g., 'Mecánico', 'Administrador', 'Recepcionista'
    phone TEXT,
    email TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CLIENTS
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. VEHICLES
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id),
    make TEXT NOT NULL, -- e.g., Toyota
    model TEXT NOT NULL, -- e.g., Corolla
    year INTEGER NOT NULL,
    vin TEXT UNIQUE,
    license_plate TEXT UNIQUE,
    mileage INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. INVENTORY (Refacciones)
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    part_name TEXT NOT NULL,
    sku TEXT UNIQUE,
    category TEXT NOT NULL,
    quantity INTEGER DEFAULT 0,
    cost_price NUMERIC(10, 2) NOT NULL DEFAULT 0, -- Lo que nos cuesta a nosotros
    unit_price NUMERIC(10, 2) NOT NULL DEFAULT 0, -- Lo que cobramos al cliente
    reorder_level INTEGER DEFAULT 5,
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SERVICE ORDERS
CREATE TABLE service_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number SERIAL UNIQUE,
    vehicle_id UUID REFERENCES vehicles(id),
    client_id UUID REFERENCES clients(id),
    staff_id UUID REFERENCES staff(id),
    status service_status DEFAULT 'Recepcion',
    notes TEXT,
    apply_iva BOOLEAN DEFAULT false,
    subtotal_amount NUMERIC(10, 2) DEFAULT 0,
    total_amount NUMERIC(10, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SERVICE ORDER ITEMS (Parts and Labor)
CREATE TABLE service_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES service_orders(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    cost_price NUMERIC(10, 2) NOT NULL DEFAULT 0, -- Costo de compra (solo para refacciones)
    unit_price NUMERIC(10, 2) NOT NULL DEFAULT 0, -- Precio de venta al cliente
    is_part BOOLEAN DEFAULT true, -- true = Refacción, false = Mano de Obra
    inventory_id UUID REFERENCES inventory(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. INSPECTIONS (El Semáforo de Vida Útil)
-- ... (existing inspections table)

-- 8. RECEPTION INSPECTIONS (Acta de Recepción Legal)
CREATE TABLE IF NOT EXISTS reception_inspections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES service_orders(id) ON DELETE CASCADE,
    fuel_level INTEGER NOT NULL DEFAULT 0, -- 0-100 percentage
    has_stereo BOOLEAN DEFAULT true,
    has_spare_tire BOOLEAN DEFAULT true,
    has_jack BOOLEAN DEFAULT true,
    has_tools BOOLEAN DEFAULT true,
    external_damage_notes TEXT,
    client_signature_url TEXT, -- URL to Supabase Storage or base64
    agreed_to_terms BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TRIGGER for updating 'updated_at' on service_orders
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_service_orders_timestamp
BEFORE UPDATE ON service_orders
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- SEED DATA FOR 'SERVICIO AUTOMOTRIZ EL GRILLO'
-- Realistic Mexican names and automotive data

-- 1. STAFF (Personal del Taller)
INSERT INTO staff (full_name, role, phone, email) VALUES
('Ricardo "El Grillo" Méndez', 'Dueño / Master Mechanic', '5512341234', 'ricardo@elgrillo.com'),
('Santiago Lira', 'Técnico Senior', '5598765432', 'santiago@elgrillo.com'),
('Araceli Gómez', 'Administradora', '5544332211', 'admin@elgrillo.com');

-- 2. CLIENTS (Clientes de México)
INSERT INTO clients (id, first_name, last_name, phone, email) VALUES
('00000000-0000-0000-0000-000000000001', 'Arturo', 'Hernández', '5566778899', 'arturo.h@gmail.com'),
('00000000-0000-0000-0000-000000000002', 'Sofía', 'Ramírez', '5544332211', 'sofia_ram@outlook.com'),
('00000000-0000-0000-0000-000000000003', 'Carlos', 'Villanueva', '5599887766', 'carlos.v@prodigy.net.mx'),
('00000000-0000-0000-0000-000000000004', 'Mónica', 'López', '5511223344', 'moni.l@live.com'),
('00000000-0000-0000-0000-000000000005', 'Javier', 'Torres', '5588776655', 'javi_t@yahoo.com.mx');

-- 3. VEHICLES (Variados)
INSERT INTO vehicles (id, client_id, make, model, year, license_plate) VALUES
('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'Volkswagen', 'Jetta Classico', 2014, 'MX-45-A1'),
('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000002', 'Nissan', 'March', 2021, 'PXZ-204-C'),
('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000003', 'Mazda', '3 Sedan', 2019, 'B-342-GTR'),
('44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000004', 'Seat', 'Ibiza', 2020, 'GRL-1122'),
('55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000005', 'Ford', 'F-150 Lobo', 2016, 'TR-99-ZZ');

-- 4. INVENTORY INITIAL (Refacciones)
INSERT INTO inventory (part_name, sku, category, quantity, unit_price) VALUES
('Aceite Sintético 5W-30', 'OIL-530-S', 'Fluidos', 24, 250.00),
('Balatas Delanteras cerámicas', 'BAL-VW-01', 'Frenos', 10, 850.00),
('Filtro de Aire Jetta', 'FIL-AIR-01', 'Motores', 5, 180.00),
('Bendix para Marcha Nissan', 'BEN-NIS-MAR', 'Sistema Eléctrico', 3, 420.00),
('Gas Refrigerante R134a', 'GAS-R134', 'A/C', 15, 320.00),
('Bujías de Iridio NGK', 'BUJ-NGK-IR', 'Fuel Injection', 20, 195.00),
('Limpiador de Inyectores Boomer', 'CLN-INY-01', 'Fuel Injection', 12, 120.00),
('Bomba de Agua Ford F-150', 'BOM-FOR-150', 'Motores', 2, 1250.00),
('Discos de Freno Delanteros', 'DIS-FRN-UNI', 'Frenos', 4, 1100.00),
('Anticongelante Rosa 50/50', 'ANT-ROS-01', 'Fluidos', 10, 185.00);

-- 5. SERVICE ORDERS (Órdenes de muestra)
INSERT INTO service_orders (vehicle_id, client_id, staff_id, status, notes, total_amount) VALUES
('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000003', (SELECT id FROM staff limit 1), 'Diagnostico', 'Falla en inyectores, el motor se jalonea en baja.', 2500.00),
('44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000004', (SELECT id FROM staff limit 1), 'En Reparacion', 'Carga de gas A/C y cambio de filtro de cabina.', 1800.00),
('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000002', (SELECT id FROM staff offset 1 limit 1), 'Recepcion', 'Revisión de marcha, no enciende en frío.', 0.00),
('55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000005', (SELECT id FROM staff offset 1 limit 1), 'Listo', 'Servicio de mantenimiento mayor.', 5400.00);
