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
    category TEXT NOT NULL, -- e.g., 'Frenos', 'Suspensión', 'Motor'
    quantity INTEGER DEFAULT 0,
    unit_price NUMERIC(10, 2) NOT NULL,
    reorder_level INTEGER DEFAULT 5,
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SERVICE ORDERS
CREATE TABLE service_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number SERIAL UNIQUE,
    vehicle_id UUID REFERENCES vehicles(id),
    client_id UUID REFERENCES clients(id),
    staff_id UUID REFERENCES staff(id), -- Lead mechanic
    status service_status DEFAULT 'Recepcion',
    notes TEXT,
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
    unit_price NUMERIC(10, 2) NOT NULL,
    is_part BOOLEAN DEFAULT true, -- true = Refacción, false = Mano de Obra
    inventory_id UUID REFERENCES inventory(id), -- Null if it's just labor
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. INSPECTIONS (El Semáforo de Vida Útil)
-- This table structure allows for a checklist of items to be evaluated.
CREATE TABLE inspections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES service_orders(id) ON DELETE CASCADE,
    category TEXT NOT NULL, -- e.g., 'Frenos', 'Llantas', 'Fluidos'
    item_name TEXT NOT NULL, -- e.g., 'Pastillas delanteras'
    condition item_condition DEFAULT 'Green',
    mechanic_notes TEXT,
    image_url TEXT,
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
