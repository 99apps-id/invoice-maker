-- ========================================================
-- TAGIH DONG - POSTGRESQL DATABASE SCHEMA (MULTI-USER)
-- Location: server/schema.sql
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE (Accounts registered via Google OAuth)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    google_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    picture TEXT,
    role VARCHAR(50) DEFAULT 'user',
    plan VARCHAR(20) NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'paid')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS plan VARCHAR(20) NOT NULL DEFAULT 'free';

-- 2. USER PROFILES TABLE (Multi-business identities per user)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    owner_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(100),
    address TEXT,
    logo_url TEXT,
    tax_id VARCHAR(100),
    website VARCHAR(255),
    bank_name VARCHAR(100),
    bank_account_no VARCHAR(100),
    bank_account_name VARCHAR(255),
    swift_code VARCHAR(50),
    qris_url TEXT,
    default_currency VARCHAR(10) DEFAULT 'IDR',
    business_type VARCHAR(50) DEFAULT 'general',
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. CLIENTS TABLE (Per user client CRM)
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(100),
    address TEXT,
    tax_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. CATALOG ITEMS TABLE (Products/Goods & Services catalog)
CREATE TABLE IF NOT EXISTS catalog_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    unit_price NUMERIC(15, 2) DEFAULT 0,
    unit VARCHAR(50) DEFAULT 'pcs',
    default_tax_rate NUMERIC(5, 2) DEFAULT 11,
    category VARCHAR(20) DEFAULT 'product', -- 'product' or 'service'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. INVOICES TABLE
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    number VARCHAR(100) NOT NULL,
    issue_date VARCHAR(50) NOT NULL,
    due_date VARCHAR(50) NOT NULL,
    po_number VARCHAR(100),
    status VARCHAR(50) DEFAULT 'draft',
    language VARCHAR(10) DEFAULT 'id',
    currency VARCHAR(10) DEFAULT 'IDR',
    issuer_data JSONB NOT NULL,
    client_data JSONB NOT NULL,
    tax_name VARCHAR(50) DEFAULT 'PPN',
    shipping_fee NUMERIC(15, 2) DEFAULT 0,
    notes TEXT,
    payment_terms TEXT,
    theme_config JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. INVOICE ITEMS TABLE
CREATE TABLE IF NOT EXISTS invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    quantity NUMERIC(10, 2) DEFAULT 1,
    unit_price NUMERIC(15, 2) DEFAULT 0,
    unit VARCHAR(50) DEFAULT 'pcs',
    tax_rate NUMERIC(5, 2) DEFAULT 0,
    discount NUMERIC(15, 2) DEFAULT 0,
    discount_type VARCHAR(20) DEFAULT 'percent'
);

-- Indexing for high speed queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_catalog_items_user_id ON catalog_items(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
