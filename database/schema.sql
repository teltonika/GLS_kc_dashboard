-- =============================================
-- CALL CENTER DASHBOARD - DATABASE SCHEMA
-- Supabase/PostgreSQL
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROJECTS TABLE
-- For multi-tenant support (multiple clients)
-- =============================================
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    pbx_ip VARCHAR(50),
    pbx_port INTEGER DEFAULT 8088,
    api_username VARCHAR(100),
    api_password_hash VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- AGENTS TABLE
-- Store agent/extension information
-- =============================================
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    extension VARCHAR(10) NOT NULL,
    name VARCHAR(255),
    email VARCHAR(255),
    department VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, extension)
);

-- =============================================
-- CDR RECORDS TABLE
-- Call Detail Records from PBX
-- =============================================
CREATE TABLE cdr_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    call_id VARCHAR(100),
    time_start TIMESTAMP WITH TIME ZONE NOT NULL,
    extension VARCHAR(10),
    caller_number VARCHAR(50),
    callee_number VARCHAR(50),
    call_duration INTEGER DEFAULT 0,        -- Total duration in seconds
    talk_duration INTEGER DEFAULT 0,        -- Actual talk time in seconds
    call_status VARCHAR(20),                -- ANSWERED, NO ANSWER, BUSY, FAILED
    call_type VARCHAR(20),                  -- Inbound, Outbound, Internal
    did_number VARCHAR(50),
    trunk_name VARCHAR(100),
    recording_file VARCHAR(255),
    source VARCHAR(20) DEFAULT 'sync',      -- 'push' or 'sync'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, call_id)
);

-- =============================================
-- ADMIN USERS TABLE
-- Dashboard login users
-- =============================================
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'viewer',      -- admin, manager, viewer
    totp_secret VARCHAR(100),               -- For 2FA
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- AUDIT LOG TABLE
-- Track all sensitive actions (GDPR compliance)
-- =============================================
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    admin_id UUID REFERENCES admin_users(id),
    action VARCHAR(100) NOT NULL,           -- login, logout, view_number, export, etc.
    details JSONB,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX idx_cdr_project_time ON cdr_records(project_id, time_start DESC);
CREATE INDEX idx_cdr_extension ON cdr_records(extension);
CREATE INDEX idx_cdr_call_type ON cdr_records(call_type);
CREATE INDEX idx_cdr_call_status ON cdr_records(call_status);
CREATE INDEX idx_audit_project ON audit_log(project_id, created_at DESC);
CREATE INDEX idx_agents_project ON agents(project_id);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE cdr_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Policy for anonymous read access (for development/testing)
CREATE POLICY "Allow public read access for testing"
ON cdr_records FOR SELECT TO anon USING (true);

-- Policy for authenticated users
CREATE POLICY "Authenticated users can view cdr_records"
ON cdr_records FOR SELECT TO authenticated USING (true);

-- Policy for service role (full access)
CREATE POLICY "Service role full access cdr_records"
ON cdr_records FOR ALL TO service_role USING (true);

-- =============================================
-- UPDATED_AT TRIGGER
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
