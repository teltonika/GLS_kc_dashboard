# Database Documentation

## Overview

This dashboard uses **Supabase** (PostgreSQL) as the database.

## Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Note down:
   - Project URL: `https://[project-id].supabase.co`
   - Anon Key: `eyJ...`
   - Service Role Key: `eyJ...` (for sync scripts)

### 2. Run Schema

Go to Supabase SQL Editor and run:

```sql
-- Run schema.sql first
-- Then run sample_data.sql for test data
```

### 3. Configure Environment

Create `.env` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Tables

### `projects`
Multi-tenant support for multiple clients/PBX systems.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR | Project name |
| pbx_ip | VARCHAR | PBX IP address |
| pbx_port | INTEGER | API port (default 8088) |
| api_username | VARCHAR | PBX API username |
| is_active | BOOLEAN | Active status |

### `agents`
Agent/extension information.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| project_id | UUID | FK to projects |
| extension | VARCHAR | Extension number |
| name | VARCHAR | Agent name |
| department | VARCHAR | Department |

### `cdr_records`
Call Detail Records from PBX.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| project_id | UUID | FK to projects |
| call_id | VARCHAR | Unique call ID from PBX |
| time_start | TIMESTAMP | Call start time |
| extension | VARCHAR | Agent extension |
| caller_number | VARCHAR | From number |
| callee_number | VARCHAR | To number |
| call_duration | INTEGER | Total duration (seconds) |
| talk_duration | INTEGER | Talk time (seconds) |
| call_status | VARCHAR | ANSWERED, NO ANSWER, BUSY, FAILED |
| call_type | VARCHAR | Inbound, Outbound, Internal |
| did_number | VARCHAR | DID number |
| source | VARCHAR | 'push' or 'sync' |

### `admin_users`
Dashboard users with authentication.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| email | VARCHAR | Login email |
| password_hash | VARCHAR | Bcrypt hash |
| role | VARCHAR | admin, manager, viewer |
| totp_secret | VARCHAR | 2FA secret |

### `audit_log`
GDPR compliance - track all actions.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| admin_id | UUID | Who did it |
| action | VARCHAR | What they did |
| details | JSONB | Extra info |
| ip_address | VARCHAR | From where |

## Row Level Security (RLS)

RLS is enabled on all tables. Policies:

- **anon**: Read-only access to `cdr_records` (for testing)
- **authenticated**: Read access to own project data
- **service_role**: Full access (for sync scripts)

## Indexes

Performance indexes on:
- `cdr_records(project_id, time_start)` - Main query pattern
- `cdr_records(extension)` - Agent filtering
- `cdr_records(call_type)` - Type filtering
- `cdr_records(call_status)` - Status filtering

## Backup

Supabase provides automatic daily backups on paid plans.

For manual backup:
```bash
pg_dump -h db.[project-id].supabase.co -U postgres -d postgres > backup.sql
```
