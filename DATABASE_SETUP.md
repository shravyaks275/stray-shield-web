# Stray Shield Database Setup Guide

## Prerequisites
- PostgreSQL 12 or higher installed
- Node.js and npm installed

## Step 1: Create PostgreSQL Database

\`\`\`bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE stray_shield;

# Exit psql
\q
\`\`\`

## Step 2: Configure Environment Variables

In `server/.env`, add:

\`\`\`
DB_HOST=localhost
DB_PORT=5432
DB_NAME=stray_shield
DB_USER=postgres
DB_PASSWORD=your_postgres_password
JWT_SECRET=your-secret-key-change-in-production
\`\`\`

## Step 3: Install Dependencies

\`\`\`bash
cd server
npm install
\`\`\`

## Step 4: Run Database Migrations

\`\`\`bash
npm run migrate
\`\`\`

This will create the `users` and `reports` tables with proper indexes.

## Step 5: Start the Backend Server

\`\`\`bash
npm run dev
\`\`\`

Server will be running on `http://localhost:3001`

## Database Schema

### Users Table
- `id` (INT, Primary Key, Auto-increment)
- `email` (VARCHAR, Unique)
- `password` (VARCHAR, hashed)
- `name` (VARCHAR)
- `phone` (VARCHAR)
- `user_type` (VARCHAR: 'citizen' or 'ngo')
- `organization_name` (VARCHAR, nullable for citizens)
- `registration_number` (VARCHAR, nullable)
- `address` (TEXT, nullable)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Reports Table
- `id` (INT, Primary Key, Auto-increment)
- `user_id` (INT, Foreign Key → users.id)
- `location` (VARCHAR)
- `latitude` (DECIMAL)
- `longitude` (DECIMAL)
- `description` (TEXT)
- `contact_name` (VARCHAR)
- `contact_phone` (VARCHAR)
- `contact_email` (VARCHAR)
- `image_url` (TEXT)
- `status` (VARCHAR: 'pending', 'in_progress', 'resolved', 'rejected')
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Troubleshooting

### Connection Error: "ECONNREFUSED"
- Ensure PostgreSQL is running: `sudo systemctl start postgresql` (Linux) or start PostgreSQL app (macOS)
- Check DB_HOST, DB_PORT, and credentials in .env

### Migration Error: "Database does not exist"
- Verify you created the database: `CREATE DATABASE stray_shield;`

### Permission Denied
- Ensure the PostgreSQL user has proper permissions
- Run: `ALTER USER postgres WITH PASSWORD 'your_password';`

## Testing the API

Once running, test with cURL:

\`\`\`bash
# Health check
curl http://localhost:3001/api/health

# Signup
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "citizen@example.com",
    "password": "password123",
    "name": "John Doe",
    "phone": "9876543210",
    "userType": "citizen"
  }'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "citizen@example.com",
    "password": "password123",
    "userType": "citizen"
  }'
