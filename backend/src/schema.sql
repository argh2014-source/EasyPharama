-- EasyPharma Database Schema (PostgreSQL)

-- 1. Pharmacies (Tenants)
CREATE TABLE IF NOT EXISTS pharmacies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    logo_url TEXT,
    currency VARCHAR(10) DEFAULT 'XOF',
    tax_rate DECIMAL(5,2) DEFAULT 18.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users (Admin, Pharmacist, Cashier, Stock Manager, Accountant)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    pharmacy_id INTEGER REFERENCES pharmacies(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'SYSTEM_ADMIN', 'PHARMACY_ADMIN', 'PHARMACIST', 'CASHIER', 'STOCK_MANAGER', 'ACCOUNTANT'
    custom_permissions JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Suppliers
CREATE TABLE IF NOT EXISTS suppliers (
    id SERIAL PRIMARY KEY,
    pharmacy_id INTEGER REFERENCES pharmacies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Medications
CREATE TABLE IF NOT EXISTS medications (
    id SERIAL PRIMARY KEY,
    pharmacy_id INTEGER REFERENCES pharmacies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    dci VARCHAR(255),
    category VARCHAR(100),
    dosage_form VARCHAR(100),
    dosage VARCHAR(100),
    manufacturer VARCHAR(255),
    supplier_id INTEGER REFERENCES suppliers(id) ON DELETE SET NULL,
    barcode VARCHAR(100),
    purchase_price DECIMAL(10,2) NOT NULL,
    selling_price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    min_stock_threshold INTEGER DEFAULT 10,
    location VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Inventory Batches (For Expiration Dates)
CREATE TABLE IF NOT EXISTS inventory_batches (
    id SERIAL PRIMARY KEY,
    medication_id INTEGER REFERENCES medications(id) ON DELETE CASCADE,
    batch_number VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL,
    expiration_date DATE NOT NULL,
    received_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Customers/Patients
CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    pharmacy_id INTEGER REFERENCES pharmacies(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    phone VARCHAR(50),
    address TEXT,
    insurance_id INTEGER, -- Will link later below
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Insurances
CREATE TABLE IF NOT EXISTS insurances (
    id SERIAL PRIMARY KEY,
    pharmacy_id INTEGER REFERENCES pharmacies(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    coverage_rate DECIMAL(5,2) NOT NULL, -- e.g., 80.00 for 80%
    max_coverage DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add Insurance link to Patient
ALTER TABLE patients ADD CONSTRAINT fk_insurance FOREIGN KEY (insurance_id) REFERENCES insurances(id) ON DELETE SET NULL;

-- 8. Sales / POS Transactions
CREATE TABLE IF NOT EXISTS sales (
    id SERIAL PRIMARY KEY,
    pharmacy_id INTEGER REFERENCES pharmacies(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL, -- Cashier
    patient_id INTEGER REFERENCES patients(id) ON DELETE SET NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0,
    payment_method VARCHAR(50) NOT NULL, -- 'CASH', 'MOBILE_MONEY', 'CARD', 'INSURANCE'
    status VARCHAR(50) DEFAULT 'COMPLETED', -- 'COMPLETED', 'CANCELLED'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Sale Items
CREATE TABLE IF NOT EXISTS sale_items (
    id SERIAL PRIMARY KEY,
    sale_id INTEGER REFERENCES sales(id) ON DELETE CASCADE,
    medication_id INTEGER REFERENCES medications(id) ON DELETE NO ACTION,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL
);

-- 10. Prescriptions
CREATE TABLE IF NOT EXISTS prescriptions (
    id SERIAL PRIMARY KEY,
    pharmacy_id INTEGER REFERENCES pharmacies(id) ON DELETE CASCADE,
    patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
    prescribing_doctor VARCHAR(255) NOT NULL,
    prescription_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Prescription Items
CREATE TABLE IF NOT EXISTS prescription_items (
    id SERIAL PRIMARY KEY,
    prescription_id INTEGER REFERENCES prescriptions(id) ON DELETE CASCADE,
    medication_id INTEGER REFERENCES medications(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL,
    instructions TEXT
);
