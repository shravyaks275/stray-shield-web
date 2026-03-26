# Stray Shield Database Setup Guide

Complete guide for setting up, configuring, and managing the PostgreSQL database for the Stray Shield application.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [PostgreSQL Installation](#postgresql-installation)
3. [Database Creation](#database-creation)
4. [Environment Configuration](#environment-configuration)
5. [Database Schema](#database-schema)
6. [Database Indexes](#database-indexes)
7. [Migrations & Setup](#migrations--setup)
8. [Sample Data & Queries](#sample-data--queries)
9. [Backup & Restore](#backup--restore)
10. [Performance Optimization](#performance-optimization)
11. [Monitoring & Maintenance](#monitoring--maintenance)
12. [Troubleshooting](#troubleshooting)
13. [Security Best Practices](#security-best-practices)

---

## Prerequisites

Before setting up the database, ensure you have:

- PostgreSQL 12 or higher
- Node.js 16 or higher
- npm v7 or higher
- Administrative access to PostgreSQL
- At least 500MB free disk space

**Check PostgreSQL Version:**
```bash
psql --version
```

---

## PostgreSQL Installation

### macOS (Homebrew)

```bash
# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Verify installation
psql --version
```

**Add to PATH (if needed):**
```bash
echo 'export PATH="/usr/local/opt/postgresql@15/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Ubuntu/Debian (Linux)

```bash
# Update package manager
sudo apt-get update

# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql

# Enable auto-start on boot
sudo systemctl enable postgresql

# Verify installation
psql --version
```

### Windows

1. Download installer from https://www.postgresql.org/download/windows/
2. Run installer and follow setup wizard
3. Choose installation directory (e.g., C:\Program Files\PostgreSQL\15)
4. Set superuser password (remember this!)
5. Choose port (default: 5432)
6. Select locale (default: English)
7. Complete installation
8. PostgreSQL will start automatically

**Add to PATH (Windows):**
```
C:\Program Files\PostgreSQL\15\bin
```

**Verify installation:**
```bash
psql --version
```

---

## Database Creation

### Step 1: Connect to PostgreSQL

```bash
# macOS/Linux
psql -U postgres

# Windows (use pgAdmin or command line)
psql -U postgres
```

### Step 2: Create Database

```sql
-- Create the stray_shield database
CREATE DATABASE stray_shield;

-- Verify creation
\l
```

### Step 3: Create Dedicated User (Recommended)

```sql
-- Create user with secure password
CREATE USER stray_user WITH PASSWORD 'your_secure_password_here';

-- Grant creation privileges
ALTER USER stray_user CREATEDB;

-- Grant all privileges on database
GRANT ALL PRIVILEGES ON DATABASE stray_shield TO stray_user;

-- Connect to database
\c stray_shield

-- Grant schema privileges
GRANT ALL PRIVILEGES ON SCHEMA public TO stray_user;

-- Verify user creation
\du
```

### Step 4: Exit psql

```sql
-- Exit psql
\q
```

### Step 5: Verify Connection

```bash
# Connect with new user
psql -U stray_user -d stray_shield -h localhost

# Should show: stray_shield=>
```

---

## Environment Configuration

### Step 1: Create .env File

Navigate to the server directory:

```bash
cd server
cp .env.example .env
```

### Step 2: Configure Database Variables

Edit `server/.env`:

```env
# Database Configuration
DATABASE_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=stray_shield
DB_USER=stray_user
DB_PASSWORD=your_secure_password_here

# Connection Pool Settings
DB_POOL_MIN=5
DB_POOL_MAX=20
DB_IDLE_TIMEOUT=10000
DB_CONNECTION_TIMEOUT=2000

# Server Configuration
PORT=3001
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRY=86400

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=debug
```

### Step 3: Test Connection

```bash
# Test connection string
psql -U stray_user -d stray_shield -h localhost -c "SELECT 1"

# Should output:
#  ?column?
# ----------
#         1
```

---

## Database Schema

### Complete Database Schema

The database consists of two main tables:

#### Users Table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  user_type VARCHAR(50) NOT NULL CHECK (user_type IN ('citizen', 'ngo')),
  organization_name VARCHAR(255),
  registration_number VARCHAR(255),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  website VARCHAR(255),
  verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Users Table Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique user ID |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User's email address |
| password | VARCHAR(255) | NOT NULL | Hashed password |
| name | VARCHAR(255) | NOT NULL | User's full name |
| phone | VARCHAR(20) | - | Contact phone number |
| user_type | VARCHAR(50) | NOT NULL, CHECK | 'citizen' or 'ngo' |
| organization_name | VARCHAR(255) | - | NGO name (NGO only) |
| registration_number | VARCHAR(255) | - | NGO registration number |
| address | TEXT | - | User/NGO address |
| city | VARCHAR(100) | - | City name |
| state | VARCHAR(100) | - | State/Province |
| country | VARCHAR(100) | - | Country name |
| website | VARCHAR(255) | - | NGO website URL |
| verified | BOOLEAN | DEFAULT false | Email verification status |
| verified_at | TIMESTAMP | - | Email verification timestamp |
| is_active | BOOLEAN | DEFAULT true | Account active status |
| last_login | TIMESTAMP | - | Last login timestamp |
| created_at | TIMESTAMP | DEFAULT NOW() | Account creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last profile update |

#### Reports Table

```sql
CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  location VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  description TEXT,
  contact_name VARCHAR(255),
  contact_phone VARCHAR(20),
  contact_email VARCHAR(255),
  image_url TEXT,
  image_urls TEXT[],
  ai_health_status VARCHAR(50),
  ai_classification TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'rejected')),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  assigned_to INT REFERENCES users(id) ON DELETE SET NULL,
  notes TEXT,
  resolution_notes TEXT,
  resolution_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Reports Table Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique report ID |
| user_id | INT | FOREIGN KEY, NOT NULL | Citizen who reported |
| location | VARCHAR(255) | NOT NULL | Sighting location |
| latitude | DECIMAL(10, 8) | - | GPS latitude |
| longitude | DECIMAL(11, 8) | - | GPS longitude |
| description | TEXT | - | Dog description |
| contact_name | VARCHAR(255) | - | Reporter's name |
| contact_phone | VARCHAR(20) | - | Reporter's phone |
| contact_email | VARCHAR(255) | - | Reporter's email |
| image_url | TEXT | - | Single image URL (legacy) |
| image_urls | TEXT[] | - | Multiple image URLs |
| ai_health_status | VARCHAR(50) | - | AI assessment (healthy/sick/injured) |
| ai_classification | TEXT | - | AI classification details |
| status | VARCHAR(50) | DEFAULT 'pending' | Report status |
| priority | VARCHAR(20) | DEFAULT 'medium' | Priority level |
| assigned_to | INT | FOREIGN KEY | Assigned NGO user ID |
| notes | TEXT | - | Internal NGO notes |
| resolution_notes | TEXT | - | How issue was resolved |
| resolution_date | TIMESTAMP | - | When report was resolved |
| created_at | TIMESTAMP | DEFAULT NOW() | Report creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update time |

---

## Database Indexes

### Create Indexes for Performance

Indexes significantly improve query performance on frequently searched columns:

```sql
-- Connect to database
\c stray_shield

-- Users table indexes
CREATE INDEX idx_users_email ON users(email);
-- Why: Email lookups during login

CREATE INDEX idx_users_user_type ON users(user_type);
-- Why: Filtering by user type

CREATE INDEX idx_users_created_at ON users(created_at DESC);
-- Why: Recent user queries

CREATE INDEX idx_users_is_active ON users(is_active);
-- Why: Finding active users

-- Reports table indexes
CREATE INDEX idx_reports_user_id ON reports(user_id);
-- Why: Getting user's reports

CREATE INDEX idx_reports_status ON reports(status);
-- Why: Filtering by status (pending, in_progress, resolved)

CREATE INDEX idx_reports_assigned_to ON reports(assigned_to);
-- Why: NGO assignments

CREATE INDEX idx_reports_created_at ON reports(created_at DESC);
-- Why: Recent reports queries

CREATE INDEX idx_reports_priority ON reports(priority);
-- Why: Priority-based filtering

-- Composite indexes for common queries
CREATE INDEX idx_reports_status_created ON reports(status, created_at DESC);
-- Why: Get recent pending reports

CREATE INDEX idx_reports_assigned_status ON reports(assigned_to, status);
-- Why: NGO's reports by status

-- Verify indexes
\d users
\d reports
```

### Index Maintenance

```sql
-- Analyze table statistics (monthly)
ANALYZE users;
ANALYZE reports;

-- Reindex tables (quarterly)
REINDEX TABLE users;
REINDEX TABLE reports;

-- Check index sizes
SELECT schemaname, tablename, indexname, pg_size_pretty(pg_relation_size(indexrelid)) 
FROM pg_indexes 
WHERE schemaname = 'public';
```

---

## Migrations & Setup

### Step 1: Run Backend Setup

```bash
cd server
npm install
```

### Step 2: Create Schema (Manual Method)

If automatic migrations aren't available:

```bash
psql -U stray_user -d stray_shield -h localhost < schema.sql
```

Or run SQL commands directly:

```bash
psql -U stray_user -d stray_shield -h localhost

-- Paste the Users and Reports CREATE TABLE statements above
-- Press Ctrl+D to exit
```

### Step 3: Verify Schema Creation

```bash
psql -U stray_user -d stray_shield -h localhost

-- List tables
\dt

-- Should show:
#            List of relations
# Schema |  Name   | Type  |  Owner
# --------+---------+-------+-----------
# public | reports | table | stray_user
# public | users   | table | stray_user

-- Describe tables
\d users
\d reports
```

### Step 4: Seed Sample Data (Optional)

```bash
# From server directory
npm run seed

# Or manually insert test data
psql -U stray_user -d stray_shield -h localhost
```

**Manual Sample Data:**

```sql
-- Insert sample citizen
INSERT INTO users (email, password, name, phone, user_type, is_active, created_at, updated_at)
VALUES (
  'citizen@example.com',
  '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890', -- bcrypt hash
  'John Citizen',
  '1234567890',
  'citizen',
  true,
  NOW(),
  NOW()
);

-- Insert sample NGO
INSERT INTO users (email, password, name, phone, user_type, organization_name, registration_number, is_active, created_at, updated_at)
VALUES (
  'ngo@example.com',
  '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890',
  'Animal Care NGO',
  '9876543210',
  'ngo',
  'Animal Care NGO',
  'NGO123456',
  true,
  NOW(),
  NOW()
);

-- Insert sample report
INSERT INTO reports (user_id, location, latitude, longitude, description, contact_name, contact_phone, contact_email, status, priority, created_at, updated_at)
VALUES (
  1,
  'Central Park, New York',
  '40.7829',
  '-73.9654',
  'Brown dog with white spots, looks injured',
  'John Citizen',
  '1234567890',
  'citizen@example.com',
  'pending',
  'high',
  NOW(),
  NOW()
);

-- Verify data
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM reports;
```

---

## Sample Data & Queries

### Common Query Examples

#### User Queries

**Get all users:**
```sql
SELECT * FROM users ORDER BY created_at DESC;
```

**Get all citizens:**
```sql
SELECT * FROM users WHERE user_type = 'citizen' ORDER BY created_at DESC;
```

**Get all NGOs:**
```sql
SELECT * FROM users WHERE user_type = 'ngo' ORDER BY created_at DESC;
```

**Get active users:**
```sql
SELECT * FROM users WHERE is_active = true ORDER BY created_at DESC;
```

**Get user by email:**
```sql
SELECT * FROM users WHERE email = 'citizen@example.com';
```

**Get recently verified users:**
```sql
SELECT * FROM users 
WHERE verified = true 
ORDER BY verified_at DESC 
LIMIT 10;
```

**Get users who haven't logged in recently:**
```sql
SELECT * FROM users 
WHERE last_login < NOW() - INTERVAL '30 days' 
OR last_login IS NULL;
```

#### Report Queries

**Get all pending reports:**
```sql
SELECT * FROM reports 
WHERE status = 'pending' 
ORDER BY priority DESC, created_at DESC;
```

**Get reports created in last 7 days:**
```sql
SELECT * FROM reports 
WHERE created_at >= NOW() - INTERVAL '7 days' 
ORDER BY created_at DESC;
```

**Get high-priority reports:**
```sql
SELECT * FROM reports 
WHERE priority = 'high' 
ORDER BY created_at DESC;
```

**Get reports by specific citizen:**
```sql
SELECT r.* FROM reports r
JOIN users u ON r.user_id = u.id
WHERE u.email = 'citizen@example.com'
ORDER BY r.created_at DESC;
```

**Get all reports for specific NGO:**
```sql
SELECT r.* FROM reports r
WHERE r.assigned_to = 2
ORDER BY r.priority DESC, r.created_at DESC;
```

**Get report status breakdown:**
```sql
SELECT 
  status, 
  COUNT(*) as count,
  AVG(EXTRACT(DAY FROM (NOW() - created_at))) as avg_days_old
FROM reports
GROUP BY status
ORDER BY count DESC;
```

**Get unassigned high-priority reports:**
```sql
SELECT * FROM reports 
WHERE status = 'pending' 
AND priority = 'high'
AND assigned_to IS NULL
ORDER BY created_at ASC;
```

**Get reports with AI classification:**
```sql
SELECT * FROM reports 
WHERE ai_health_status IS NOT NULL
ORDER BY created_at DESC;
```

**Get reports by AI health status:**
```sql
SELECT 
  ai_health_status, 
  COUNT(*) as count
FROM reports
WHERE ai_health_status IS NOT NULL
GROUP BY ai_health_status;
```

**Get reports resolved in last 30 days:**
```sql
SELECT * FROM reports 
WHERE status = 'resolved' 
AND resolution_date >= NOW() - INTERVAL '30 days'
ORDER BY resolution_date DESC;
```

#### Advanced Queries

**Get report statistics per NGO:**
```sql
SELECT 
  u.name,
  COUNT(*) as total_assigned,
  SUM(CASE WHEN r.status = 'resolved' THEN 1 ELSE 0 END) as resolved,
  SUM(CASE WHEN r.status = 'pending' THEN 1 ELSE 0 END) as pending,
  AVG(EXTRACT(DAY FROM (NOW() - r.created_at))) as avg_days_to_resolve
FROM reports r
JOIN users u ON r.assigned_to = u.id
WHERE u.user_type = 'ngo'
GROUP BY u.name
ORDER BY total_assigned DESC;
```

**Get top performing NGOs:**
```sql
SELECT 
  u.name,
  COUNT(*) as resolved_reports,
  ROUND(100.0 * COUNT(*)::numeric / 
    (SELECT COUNT(*) FROM reports WHERE status = 'resolved'), 2) as percentage
FROM reports r
JOIN users u ON r.assigned_to = u.id
WHERE r.status = 'resolved'
GROUP BY u.name
ORDER BY resolved_reports DESC
LIMIT 10;
```

**Get report density by location:**
```sql
SELECT 
  location,
  COUNT(*) as report_count,
  AVG(CAST(latitude AS DECIMAL(10, 8))) as avg_lat,
  AVG(CAST(longitude AS DECIMAL(11, 8))) as avg_long
FROM reports
GROUP BY location
ORDER BY report_count DESC;
```

---

## Backup & Restore

### Automated Daily Backup

#### macOS/Linux

**Create backup script:**

```bash
#!/bin/bash
# File: backup_database.sh

BACKUP_DIR="$HOME/stray-shield-backups"
DB_NAME="stray_shield"
DB_USER="stray_user"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Create backup
pg_dump -U "$DB_USER" "$DB_NAME" > "$BACKUP_DIR/backup_$TIMESTAMP.sql"

# Compress backup
gzip "$BACKUP_DIR/backup_$TIMESTAMP.sql"

# Keep only last 30 days
find "$BACKUP_DIR" -name "backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: backup_$TIMESTAMP.sql.gz"
```

**Make script executable:**

```bash
chmod +x backup_database.sh
```

**Schedule with cron (macOS/Linux):**

```bash
# Edit crontab
crontab -e

# Add this line to backup daily at 2 AM
0 2 * * * /path/to/backup_database.sh >> /var/log/stray-shield-backup.log 2>&1
```

**Verify cron jobs:**

```bash
crontab -l
```

#### Windows

**Create backup script (backup.bat):**

```batch
@echo off
setlocal enabledelayedexpansion

REM Database details
set DB_NAME=stray_shield
set DB_USER=stray_user
set BACKUP_DIR=C:\Backups\StrayShield
set PGBIN=C:\Program Files\PostgreSQL\15\bin

REM Create backup directory if it doesn't exist
if not exist %BACKUP_DIR% mkdir %BACKUP_DIR%

REM Generate timestamp
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c%%a%%b)
for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a%%b)
set TIMESTAMP=%mydate%_%mytime%

REM Create backup
"%PGBIN%\pg_dump.exe" -U %DB_USER% %DB_NAME% > %BACKUP_DIR%\backup_%TIMESTAMP%.sql

echo Backup completed: backup_%TIMESTAMP%.sql
```

**Schedule with Task Scheduler:**
1. Open Task Scheduler
2. Create Basic Task
3. Name: "Stray Shield Database Backup"
4. Set trigger: Daily at 2:00 AM
5. Set action: Run backup.bat

### Manual Backup

```bash
# Full database backup
pg_dump -U stray_user stray_shield > backup.sql

# Compressed backup
pg_dump -U stray_user stray_shield | gzip > backup.sql.gz

# Custom format (faster restore)
pg_dump -U stray_user -Fc stray_shield > backup.dump

# Backup specific table
pg_dump -U stray_user -t reports stray_shield > reports_backup.sql

# Backup with verbose output
pg_dump -U stray_user -v stray_shield > backup.sql
```

### Restore Database

```bash
# Restore from SQL file
psql -U stray_user stray_shield < backup.sql

# Restore from compressed file
gunzip -c backup.sql.gz | psql -U stray_user stray_shield

# Restore from custom format
pg_restore -U stray_user -d stray_shield backup.dump

# Restore specific table
psql -U stray_user stray_shield < reports_backup.sql

# Restore with progress indicator
pg_restore -U stray_user -d stray_shield -v backup.dump
```

### Backup Verification

```bash
# Test restore to temporary database
createdb -U stray_user stray_shield_test

# Restore to test database
psql -U stray_user stray_shield_test < backup.sql

# Verify data
psql -U stray_user stray_shield_test -c "SELECT COUNT(*) FROM users; SELECT COUNT(*) FROM reports;"

# Drop test database
dropdb -U stray_user stray_shield_test
```

### Backup Storage Strategy

```bash
# Keep backups in multiple locations
# 1. Local backup directory
# 2. External hard drive
# 3. Cloud storage (AWS S3, Google Drive, etc.)

# Example: Upload to AWS S3
aws s3 cp backup_$(date +%Y%m%d).sql.gz s3://my-backup-bucket/stray-shield/

# Example: Upload to Google Drive (using rclone)
rclone copy backup_$(date +%Y%m%d).sql.gz remote:backups/stray-shield/
```

---

## Performance Optimization

### Query Optimization

**Enable query analysis:**

```sql
-- Show query execution plan
EXPLAIN ANALYZE SELECT * FROM reports WHERE status = 'pending';

-- Expected output shows:
-- Seq Scan vs Index Scan
-- Rows estimated vs actual
-- Execution time
```

**Optimize slow queries:**

```sql
-- Find slow queries (if pgBadger installed)
pgbadger -o report.html /var/log/postgresql/postgresql.log

-- Monitor long-running queries
SELECT pid, query, query_start, state 
FROM pg_stat_activity 
WHERE state != 'idle' 
AND query_start < NOW() - INTERVAL '5 minutes';

-- Kill long-running query
SELECT pg_terminate_backend(pid);
```

### Table Maintenance

```sql
-- Vacuum (reclaim disk space)
VACUUM users;
VACUUM reports;

-- Analyze (update statistics)
ANALYZE users;
ANALYZE reports;

-- Full maintenance (rarely needed)
VACUUM FULL ANALYZE users;
VACUUM FULL ANALYZE reports;
```

### Database Statistics

```sql
-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check index sizes
SELECT 
  schemaname,
  tablename,
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) AS size
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY pg_relation_size(indexrelid) DESC;

-- Database size
SELECT pg_size_pretty(pg_database_size('stray_shield'));

-- Connection count
SELECT count(*) FROM pg_stat_activity WHERE datname = 'stray_shield';
```

### Connection Pool Configuration

**Optimal settings in `.env`:**

```env
# Development
DB_POOL_MIN=2
DB_POOL_MAX=10

# Production
DB_POOL_MIN=5
DB_POOL_MAX=20

# High-traffic production
DB_POOL_MIN=10
DB_POOL_MAX=50
```

---

## Monitoring & Maintenance

### Monitor Database Activity

```sql
-- Show current connections
SELECT * FROM pg_stat_activity WHERE datname = 'stray_shield';

-- Show table statistics
SELECT * FROM pg_stat_user_tables WHERE schemaname = 'public';

-- Show index statistics
SELECT * FROM pg_stat_user_indexes WHERE schemaname = 'public';

-- Show long transactions
SELECT 
  pid,
  usename,
  query_start,
  state,
  query
FROM pg_stat_activity
WHERE state != 'idle'
AND query_start < NOW() - INTERVAL '10 minutes';
```

### Health Check Script

```bash
#!/bin/bash
# File: health_check.sh

DB_HOST="localhost"
DB_NAME="stray_shield"
DB_USER="stray_user"

echo "=== Stray Shield Database Health Check ==="
echo "Time: $(date)"
echo ""

# Check connection
echo "1. Connection Status:"
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "SELECT 'Connected' as status;"

# Check table sizes
echo ""
echo "2. Table Sizes:"
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size(tablename::regclass)) as size,
  (SELECT count(*) FROM users) as user_count,
  (SELECT count(*) FROM reports) as report_count
FROM pg_tables
WHERE schemaname = 'public';
"

# Check index usage
echo ""
echo "3. Index Usage:"
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "
SELECT 
  indexname,
  idx_scan as scans,
  idx_tup_read as tuples_read,
  idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
"

# Check database size
echo ""
echo "4. Database Size:"
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "SELECT pg_size_pretty(pg_database_size('$DB_NAME')) as size;"

# Check connections
echo ""
echo "5. Active Connections:"
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "SELECT count(*) as active_connections FROM pg_stat_activity WHERE datname = '$DB_NAME';"

echo ""
echo "=== Health Check Complete ==="
```

### Maintenance Schedule

| Task | Frequency | Command |
|------|-----------|---------|
| VACUUM | Daily | `VACUUM users; VACUUM reports;` |
| ANALYZE | Daily | `ANALYZE users; ANALYZE reports;` |
| FULL VACUUM | Monthly | `VACUUM FULL ANALYZE;` |
| Index Rebuild | Quarterly | `REINDEX TABLE users; REINDEX TABLE reports;` |
| Backup | Daily | `pg_dump ... > backup.sql` |
| Health Check | Daily | Run health_check.sh |

---

## Troubleshooting

### Issue: Connection Refused

**Error Message:**
```
psql: could not connect to server: Connection refused
```

**Solution:**

```bash
# Check if PostgreSQL is running
# macOS
brew services list | grep postgres

# Linux
sudo systemctl status postgresql

# Windows
# Check Services (services.msc) or use PgAdmin

# Start PostgreSQL
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Windows
# Start PostgreSQL service in Services
```

### Issue: Database Does Not Exist

**Error Message:**
```
psql: error: FATAL:  database "stray_shield" does not exist
```

**Solution:**

```bash
# Connect to default postgres database
psql -U postgres

# Create database
CREATE DATABASE stray_shield;

# Create user and grant privileges
CREATE USER stray_user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE stray_shield TO stray_user;

# Connect to new database
\c stray_shield

# Grant schema privileges
GRANT ALL PRIVILEGES ON SCHEMA public TO stray_user;
```

### Issue: Permission Denied

**Error Message:**
```
ERROR:  permission denied for schema public
```

**Solution:**

```bash
# Connect as superuser
psql -U postgres -d stray_shield

# Grant schema privileges
GRANT ALL PRIVILEGES ON SCHEMA public TO stray_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO stray_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO stray_user;
```

### Issue: Disk Space Full

**Error Message:**
```
ERROR:  could not extend file
```

**Solution:**

```bash
# Check disk usage
df -h

# Clean old backups
rm -f ~/stray-shield-backups/backup_*.sql.gz

# Vacuum to reclaim space
psql -U stray_user -d stray_shield -c "VACUUM FULL;"

# Check table sizes
psql -U stray_user -d stray_shield -c "
SELECT tablename, pg_size_pretty(pg_total_relation_size(tablename::regclass))
FROM pg_tables WHERE schemaname = 'public';
"
```

### Issue: Slow Queries

**Error Message:**
```
Query taking >5 seconds
```

**Solution:**

```sql
-- Enable slow query logging
ALTER SYSTEM SET log_min_duration_statement = 1000; -- Log queries >1s

-- Reload configuration
SELECT pg_reload_conf();

-- Check query plans
EXPLAIN ANALYZE SELECT * FROM reports WHERE status = 'pending';

-- Add missing indexes
CREATE INDEX idx_reports_status ON reports(status);
```

### Issue: Max Connections Reached

**Error Message:**
```
FATAL:  remaining connection slots are reserved
```

**Solution:**

```bash
# Check current connections
psql -U postgres -c "SELECT count(*) FROM pg_stat_activity;"

# Kill idle connections
psql -U postgres -c "
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE state = 'idle' 
AND state_change < NOW() - INTERVAL '10 minutes';
"

# Increase max connections in postgresql.conf
# max_connections = 200

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### Issue: Corrupted Indexes

**Error Message:**
```
ERROR:  invalid page in block X of relation
```

**Solution:**

```sql
-- Reindex specific table
REINDEX TABLE reports;

-- Reindex all indexes
REINDEX DATABASE stray_shield;

-- Vacuum after reindex
VACUUM ANALYZE;
```

---

## Security Best Practices

### User Authentication

```sql
-- Create role with limited privileges
CREATE ROLE app_user WITH LOGIN PASSWORD 'secure_password';

-- Grant only necessary privileges
GRANT CONNECT ON DATABASE stray_shield TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO app_user;
```

### Password Security

```sql
-- Change user password
ALTER USER stray_user WITH PASSWORD 'new_secure_password_here';

-- Use strong passwords (20+ characters with mixed case, numbers, symbols)
-- Example: Tr0p!c@lBlue#Stray2026
```

### Encryption

```bash
# Enable SSL connections
# Edit postgresql.conf
ssl = on
ssl_cert_file = 'server.crt'
ssl_key_file = 'server.key'

# Force SSL for specific user
# Edit pg_hba.conf
hostssl stray_shield stray_user 127.0.0.1/32 md5
```

### Audit Logging

```sql
-- Enable query logging
ALTER SYSTEM SET log_statement = 'all';

-- Log slow queries
ALTER SYSTEM SET log_min_duration_statement = 1000;

-- Reload configuration
SELECT pg_reload_conf();

-- Check logs
tail -f /var/log/postgresql/postgresql.log
```

### Access Control

```bash
# Restrict pg_hba.conf
# Edit /etc/postgresql/15/main/pg_hba.conf

# Allow local connections only
local   stray_shield    stray_user                              md5

# Allow from localhost only
host    stray_shield    stray_user    127.0.0.1/32            md5
host    stray_shield    stray_user    ::1/128                 md5

# Reload configuration
sudo systemctl reload postgresql
```

### Backup Security

```bash
# Encrypt backups
gpg --symmetric backup.sql

# Decrypt backup
gpg -d backup.sql.gpg > backup.sql

# Store backups securely
chmod 600 backup.sql.gz
chown postgres:postgres backup.sql.gz
```

---

## Production Checklist

- [ ] PostgreSQL 12+ installed
- [ ] Database created with strong password
- [ ] Dedicated user created with limited privileges
- [ ] SSL/TLS enabled for connections
- [ ] Regular backups configured (daily)
- [ ] Backup encryption enabled
- [ ] Monitoring and alerting set up
- [ ] Database indexes created and optimized
- [ ] Query logging enabled
- [ ] Connection pool configured
- [ ] Maintenance tasks scheduled
- [ ] Disaster recovery plan documented
- [ ] Access control restricted
- [ ] Firewall rules configured
- [ ] Documentation maintained

---

## Additional Resources

### PostgreSQL Documentation
- **Main Documentation**: https://www.postgresql.org/docs/15/
- **Index Types**: https://www.postgresql.org/docs/15/sql-createindex.html
- **Query Performance**: https://www.postgresql.org/docs/15/using-explain.html
- **Backup & Recovery**: https://www.postgresql.org/docs/15/backup.html

### Tools & Utilities
- **pgAdmin**: GUI tool for PostgreSQL management
- **DBeaver**: Universal database tool
- **pgBadger**: PostgreSQL log analyzer
- **pgBackRest**: Advanced backup tool

### External Resources
- **Database Design**: https://www.postgresql.org/docs/15/ddl.html
- **Security**: https://www.postgresql.org/docs/15/sql-grant.html
- **Performance Tuning**: https://wiki.postgresql.org/wiki/Performance_Optimization

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-03-26 | Complete database setup guide |
| 0.9.0 | 2026-03-20 | Beta release |

---


**Last Updated**: 2026-03-26  
**Maintained by**: Stray Shield Team  
**Status**: Production Ready ✅



---

