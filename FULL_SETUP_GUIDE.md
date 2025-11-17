# Stray Shield: Complete Setup Guide

This guide covers the entire setup process for running both the frontend and backend with PostgreSQL database integration.

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- Git
- npm or yarn

## Project Structure

\`\`\`
stray-shield/
├── app/                    # Next.js app router (frontend)
├── components/             # Reusable React components
├── config/                 # Configuration files
├── utils/                  # Utility functions (API calls)
├── server/                 # Express.js backend
│   ├── config/            # Database configuration
│   ├── utils/             # Database utilities
│   ├── scripts/           # Migration and seed scripts
│   ├── index.js           # Main server file
│   └── package.json       # Backend dependencies
├── public/                # Static assets
└── README.md             # Main documentation
\`\`\`

## Step-by-Step Setup

### Part 1: Database Setup (PostgreSQL)

#### 1.1 Install PostgreSQL

**On macOS:**
\`\`\`bash
brew install postgresql
brew services start postgresql
\`\`\`

**On Ubuntu/Debian:**
\`\`\`bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
\`\`\`

**On Windows:**
Download and install from: https://www.postgresql.org/download/windows/

#### 1.2 Create Database

\`\`\`bash
# Connect to PostgreSQL
psql -U postgres

# Inside psql:
CREATE DATABASE stray_shield;

# Create a dedicated user (optional but recommended)
CREATE USER stray_user WITH PASSWORD 'your_secure_password';
ALTER USER stray_user CREATEDB;

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE stray_shield TO stray_user;

# Exit psql
\\q
\`\`\`

### Part 2: Backend Setup

#### 2.1 Navigate to Server Directory

\`\`\`bash
cd server
\`\`\`

#### 2.2 Configure Environment Variables

Create a \`.env\` file in the server directory:

\`\`\`bash
cp .env.example .env
\`\`\`

Edit \`.env\` with your database credentials:

\`\`\`
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=stray_shield
DB_USER=postgres
DB_PASSWORD=your_postgres_password
\`\`\`

#### 2.3 Install Dependencies

\`\`\`bash
npm install
\`\`\`

#### 2.4 Run Database Migrations

This will create all required tables and indexes:

\`\`\`bash
npm run migrate
\`\`\`

Expected output:
\`\`\`
Running database migrations...
Migrations completed successfully
\`\`\`

#### 2.5 (Optional) Seed Sample Data

To populate the database with test data:

\`\`\`bash
npm run seed
\`\`\`

This creates:
- One citizen account (citizen@example.com)
- One NGO account (ngo@example.com)
- 3 sample reports with different statuses
- Password for both: password123

#### 2.6 Start Backend Server

\`\`\`bash
npm run dev
\`\`\`

Expected output:
\`\`\`
Stray Shield API running on http://localhost:3001
Connected to PostgreSQL database
\`\`\`

### Part 3: Frontend Setup

#### 3.1 Install Frontend Dependencies

From the root directory:

\`\`\`bash
npm install
\`\`\`

#### 3.2 Configure Environment Variables

Create a \`.env.local\` file in the root directory:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit \`.env.local\`:

\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:3001
\`\`\`

#### 3.3 Start Frontend Development Server

\`\`\`bash
npm run dev
\`\`\`

Expected output:
\`\`\`
▲ Next.js 15.0.0
- Local: http://localhost:3000
\`\`\`

## Running the Application

### Terminal 1: Backend Server

\`\`\`bash
cd server
npm run dev
\`\`\`

Runs on: \`http://localhost:3001\`

### Terminal 2: Frontend Application

\`\`\`bash
# From root directory
npm run dev
\`\`\`

Runs on: \`http://localhost:3000\`

## Testing the Integration

### 1. Test API Health

\`\`\`bash
curl http://localhost:3001/api/health
\`\`\`

Response:
\`\`\`json
{"status":"OK","message":"Stray Shield API is running"}
\`\`\`

### 2. Sign Up as Citizen

Via Frontend:
1. Go to http://localhost:3000/signup
2. Select "citizen" option
3. Fill in email, password, name, phone
4. Click "Sign Up"

Via cURL:
\`\`\`bash
curl -X POST http://localhost:3001/api/auth/signup \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "newcitizen@example.com",
    "password": "password123",
    "name": "Jane Smith",
    "phone": "9876543211",
    "userType": "citizen"
  }'
\`\`\`

### 3. Login and Get Token

\`\`\`bash
curl -X POST http://localhost:3001/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "citizen@example.com",
    "password": "password123",
    "userType": "citizen"
  }'
\`\`\`

Response:
\`\`\`json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "userId": 1,
  "userType": "citizen",
  "message": "Login successful"
}
\`\`\`

### 4. Create a Report (Authenticated)

Replace TOKEN with actual JWT from login response:

\`\`\`bash
curl -X POST http://localhost:3001/api/reports/create \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer TOKEN" \\
  -d '{
    "location": "Gateway of India, Mumbai",
    "latitude": 18.9220,
    "longitude": 72.8347,
    "description": "Brown dog with white spots, looks friendly",
    "contactName": "Jane Smith",
    "contactPhone": "9876543211",
    "contactEmail": "citizen@example.com"
  }'
\`\`\`

### 5. View NGO Dashboard

1. Go to http://localhost:3000/login
2. Select "ngo" option
3. Login with: ngo@example.com / password123
4. You'll be redirected to the dashboard showing all reports

## Database Schema

### Users Table
\`\`\`sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  user_type VARCHAR(50) CHECK (user_type IN ('citizen', 'ngo')),
  organization_name VARCHAR(255),
  registration_number VARCHAR(255),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Reports Table
\`\`\`sql
CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  location VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  description TEXT,
  contact_name VARCHAR(255),
  contact_phone VARCHAR(20),
  contact_email VARCHAR(255),
  image_url TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'rejected')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

## Troubleshooting

### Issue: "ECONNREFUSED" - Cannot connect to PostgreSQL

**Solution:**
\`\`\`bash
# Check if PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list               # macOS

# Start PostgreSQL if not running
sudo systemctl start postgresql   # Linux
brew services start postgresql   # macOS
\`\`\`

### Issue: "database stray_shield does not exist"

**Solution:**
\`\`\`bash
psql -U postgres
CREATE DATABASE stray_shield;
\\q
\`\`\`

### Issue: "relation 'users' does not exist"

**Solution:** Run migrations again:
\`\`\`bash
cd server
npm run migrate
\`\`\`

### Issue: Frontend cannot connect to backend (CORS error)

**Solution:**
1. Ensure backend is running on http://localhost:3001
2. Check \`.env.local\` has: \`NEXT_PUBLIC_API_URL=http://localhost:3001\`
3. Restart frontend: \`npm run dev\`

### Issue: Invalid JWT Token

**Solution:**
1. Clear localStorage: Open DevTools → Application → Storage → Local Storage → Clear All
2. Login again to get a new token

## Deployment

### Backend Deployment (Heroku, Render, Railway, etc.)

1. Set environment variables on hosting platform:
   - DATABASE_URL
   - JWT_SECRET
   - NODE_ENV=production

2. Update database connection in \`server/config/database.js\` to use \`DATABASE_URL\`

3. Deploy backend

### Frontend Deployment (Vercel)

\`\`\`bash
npm install -g vercel
vercel
\`\`\`

During deployment, set:
- NEXT_PUBLIC_API_URL = your_backend_url

## Performance Tips

1. **Database Indexes:** Already included in migration for better query performance
2. **API Caching:** Reports are cached in browser with refresh button
3. **Lazy Loading:** Components load only when needed
4. **Image Optimization:** Use CDN for storing images

## Security Notes

- Always change JWT_SECRET in production
- Use HTTPS in production
- Enable CORS only for trusted domains
- Hash passwords with bcrypt (already implemented)
- Validate all inputs on backend
- Use environment variables for sensitive data

## Getting Help

For issues or questions:
1. Check the troubleshooting section
2. Review the README.md
3. Check server logs for backend errors
4. Use browser DevTools for frontend debugging

---

**Happy coding! Stray Shield is ready to help protect stray dogs!**
