# Stray Shield: Complete Setup Guide

Comprehensive end-to-end guide for setting up the Stray Shield application from scratch, including frontend, backend, database, and deployment.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Project Structure](#project-structure)
4. [Step-by-Step Setup](#step-by-step-setup)
5. [Part 1: Database Setup (PostgreSQL)](#part-1-database-setup-postgresql)
6. [Part 2: Backend Setup](#part-2-backend-setup)
7. [Part 3: Frontend Setup](#part-3-frontend-setup)
8. [Part 4: Running the Application](#part-4-running-the-application)
9. [Integration Testing](#integration-testing)
10. [Environment Variables Quick Reference](#environment-variables-quick-reference)
11. [Development Best Practices](#development-best-practices)
12. [Testing Procedures](#testing-procedures)
13. [Troubleshooting Guide](#troubleshooting-guide)
14. [Performance Optimization](#performance-optimization)
15. [Security Checklist](#security-checklist)
16. [Deployment](#deployment)
17. [Getting Help](#getting-help)

---

## Project Overview

**Stray Shield** is a full-stack civic-tech application connecting citizens with NGOs to report and manage stray dog sightings.

**Tech Stack:**
- **Frontend**: Next.js 15, React 18, Tailwind CSS v4, Framer Motion
- **Backend**: Express.js, Node.js, JWT authentication, bcrypt
- **Database**: PostgreSQL 12+, JSON file-based (development)
- **ML**: TensorFlow.js, MobileNet, KNN classifier

**Deployment:**
- Frontend: Vercel
- Backend: Railway/Render
- Database: PostgreSQL (production) or file-based (development)

---

## Prerequisites

### System Requirements

**Minimum:**
- Node.js v16 or higher
- npm v7 or higher
- Git v2.30 or higher
- 4GB RAM
- 500MB free disk space

**Recommended:**
- Node.js v18 LTS or v20 LTS
- 8GB RAM
- PostgreSQL 12+ (for production)
- VS Code with extensions (ESLint, Prettier, Thunder Client)

### Verify Installations

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check Git version
git --version
```

**Expected output:**
```
v18.16.0  (Node.js)
8.19.4    (npm)
git version 2.40.0 (Git)
```

---

## Project Structure

```
stray-shield/
├── app/                          # Next.js frontend pages
│   ├── page.jsx                 # Landing page
│   ├── login/
│   │   └── page.jsx            # Login page
│   ├── signup/
│   │   └── page.jsx            # Signup page
│   ├── report/
│   │   └── page.jsx            # Report form
│   ├── dashboard/
│   │   └── page.jsx            # NGO dashboard
│   ├── citizen-dashboard/
│   │   └── page.jsx            # Citizen adoption dashboard
│   ├── my-reports/
│   │   └── page.jsx            # My reports page
│   ├── ngo/
│   │   └── adoption/
│   │       └── page.jsx        # NGO adoption management
│   ├── api/                    # Next.js API routes
│   │   └── reports/
│   │       ├── my/
│   │       │   └── route.js
│   │       └── [id]/
│   │           └── route.js
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles
│
├── components/                  # Reusable React components
│   ├── Navbar.jsx
│   ├── ReportForm.jsx
│   ├── ReportCard.jsx
│   ├── DogCard.jsx
│   ├── MyReports.jsx
│   ├── AdoptionDashboard.jsx
│   ├── ProtectedRoute.jsx
│   └── StrayShieldLogo.jsx
│
├── config/                      # Configuration files
│   └── paths.js                # Centralized routing & API endpoints
│
├── utils/                       # Utility functions
│   └── api.js                  # API client with helpers
│
├── server/                      # Express.js backend
│   ├── index.js                # Main server file
│   ├── package.json            # Backend dependencies
│   ├── .env.example            # Environment template
│   └── data/                   # File-based storage
│       ├── users.json
│       ├── reports.json
│       └── dogs.json
│
├── ml/                         # Machine Learning models
│   ├── train.js               # Training script
│   ├── predict.js             # Prediction script
│   └���─ health_model/          # Trained models
│
├── dataset/                    # Training dataset
│   ├── healthy/               # Healthy dog images
│   ├── sick/                  # Sick dog images
│   └── injured/               # Injured dog images
│
├── public/                     # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── .gitignore                 # Git ignore file
├── next.config.js             # Next.js config
├── tailwind.config.js         # Tailwind CSS config
├── package.json               # Frontend dependencies
├── .env.example               # Frontend environment template
├── README.md                  # Project README
├── BACKEND_SETUP.md          # Backend setup guide
├── DATABASE_SETUP.md         # Database setup guide
├── DEPLOYMENT.md             # Deployment guide
├── FULL_SETUP_GUIDE.md      # This file
└── COMPLETION_SUMMARY.md    # Project completion status
```

---

## Step-by-Step Setup

### Initial Setup (5 minutes)

```bash
# 1. Clone the repository
git clone https://github.com/shravyaks275/stray-shield-web.git
cd stray-shield-web

# 2. List contents to verify
ls -la

# 3. Check Git status
git status
```

### Full Setup Flowchart

```
1. Clone Repository
   ↓
2. Install Frontend Dependencies
   ↓
3. Install Backend Dependencies
   ↓
4. Setup PostgreSQL Database (optional)
   ↓
5. Configure Environment Variables
   ↓
6. Run Database Migrations (optional)
   ↓
7. Seed Sample Data (optional)
   ↓
8. Start Backend Server
   ↓
9. Start Frontend Dev Server
   ↓
10. Test Integration
    ↓
11. Done! 🎉
```

---

## Part 1: Database Setup (PostgreSQL)

### Option A: File-Based Storage (Development)

**Default for development** - No setup required!

Data stored in JSON files:
```
server/data/
├── users.json
├── reports.json
└── dogs.json
```

**Advantages:**
- No external dependencies
- Quick to start
- Good for testing

**Disadvantages:**
- Not production-ready
- Limited concurrent access
- No complex queries

**Continue to Part 2** if using file-based storage.

### Option B: PostgreSQL (Production)

#### Step 1: Install PostgreSQL

**macOS (Homebrew):**
```bash
# Install PostgreSQL
brew install postgresql@15

# Start the service
brew services start postgresql@15

# Verify installation
psql --version
```

**Ubuntu/Debian:**
```bash
# Update package manager
sudo apt-get update

# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Start the service
sudo systemctl start postgresql

# Verify installation
psql --version
```

**Windows:**
1. Download installer: https://www.postgresql.org/download/windows/
2. Run installer and follow setup wizard
3. Choose password for postgres user
4. Select port 5432
5. Complete installation

#### Step 2: Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Inside psql prompt:
CREATE DATABASE stray_shield;

# Create user
CREATE USER stray_user WITH PASSWORD 'your_secure_password_here';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE stray_shield TO stray_user;

# Exit psql
\q
```

**Verify connection:**
```bash
psql -U stray_user -d stray_shield -h localhost -c "SELECT 1"
```

#### Step 3: Verify PostgreSQL is Running

```bash
# macOS
brew services list | grep postgres

# Linux
sudo systemctl status postgresql

# Windows (Check Services)
# OR test connection
psql -U postgres -c "\l"
```

**Expected output shows `stray_shield` database listed.**

---

## Part 2: Backend Setup

### Step 1: Navigate to Server Directory

```bash
cd server
```

### Step 2: Install Dependencies

```bash
npm install
```

**Packages installed:**
- `express` - Web framework
- `jsonwebtoken` - JWT authentication
- `bcrypt` - Password hashing
- `cors` - Cross-origin requests
- `dotenv` - Environment variables
- `pg` - PostgreSQL client (optional)

**Verify installation:**
```bash
npm list
```

### Step 3: Create Environment File

```bash
# Copy example file
cp .env.example .env

# Edit with your settings
nano .env  # or use VS Code
```

**Content for `.env` (File-based storage):**
```env
# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRY=86400

# Database Configuration (File-based)
DATABASE_TYPE=file

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=debug
```

**Content for `.env` (PostgreSQL):**
```env
# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRY=86400

# Database Configuration (PostgreSQL)
DATABASE_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=stray_shield
DB_USER=stray_user
DB_PASSWORD=your_secure_password_here

# Connection Pool Settings
DB_POOL_MIN=2
DB_POOL_MAX=10
DB_IDLE_TIMEOUT=30000
DB_CONNECTION_TIMEOUT=2000

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=debug
```

### Step 4: Verify Backend Configuration

```bash
# Test file-based storage
node index.js

# Should show:
# Stray Shield API running on http://localhost:3001
# Connected to file-based storage
```

**Stop with Ctrl+C**

### Step 5: Optional - PostgreSQL Migrations

If using PostgreSQL, create tables:

```bash
# Create schema manually
psql -U stray_user -d stray_shield -h localhost < schema.sql
```

**Or manually create tables:**

```bash
psql -U stray_user -d stray_shield -h localhost
```

**Copy and paste the schema:**

```sql
-- Users table
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reports table
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
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'rejected')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_reports_status ON reports(status);

-- Exit
\q
```

---

## Part 3: Frontend Setup

### Step 1: Navigate to Root Directory

```bash
# From server directory
cd ..

# Verify you're in root
pwd
# Should end with: .../stray-shield-web
```

### Step 2: Install Dependencies

```bash
npm install
```

**Packages installed:**
- `next` - React framework
- `react` & `react-dom` - UI library
- `tailwindcss` - Styling
- `framer-motion` - Animations
- `lucide-react` - Icons

**Verify installation:**
```bash
npm list
```

### Step 3: Create Frontend Environment File

```bash
# Copy example
cp .env.example .env.local

# Edit configuration
nano .env.local
```

**Content:**
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# Application Info
NEXT_PUBLIC_APP_NAME=Stray Shield
NEXT_PUBLIC_VERSION=1.0.0
```

### Step 4: Verify Next.js Installation

```bash
# Check Next.js version
npx next --version

# Should output: 15.0.0+ (or similar)
```

---

## Part 4: Running the Application

### Terminal Setup (3 terminals total)

You'll need 3 terminal windows:
- **Terminal 1**: Backend
- **Terminal 2**: Frontend
- **Terminal 3**: Testing/Git commands

### Terminal 1: Start Backend

```bash
cd server
npm run dev
```

**Expected output:**
```
Stray Shield API running on http://localhost:3001
Connected to file-based storage
Press Ctrl+C to stop
```

**Keep this running!**

### Terminal 2: Start Frontend

```bash
npm run dev
```

**Expected output:**
```
▲ Next.js 15.0.0
- Local: http://localhost:3000
- Environments: .env.local

Ready in 2.5s
```

**Visit: http://localhost:3000**

### Terminal 3: Testing Commands

Now you can test the application:

```bash
# Test API health
curl http://localhost:3001/api/health

# Should return:
# {"status":"OK","message":"Stray Shield API is running"}
```

---

## Integration Testing

### Test Sequence (Complete Flow)

#### 1. Health Check

```bash
curl http://localhost:3001/api/health
```

**Response:**
```json
{
  "status": "OK",
  "message": "Stray Shield API is running"
}
```

#### 2. Sign Up as Citizen

```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testcitizen@example.com",
    "password": "TestPassword123!",
    "name": "Test Citizen",
    "phone": "1234567890",
    "userType": "citizen"
  }'
```

**Response:**
```json
{
  "success": true,
  "userId": 1,
  "userType": "citizen",
  "email": "testcitizen@example.com",
  "message": "User created successfully"
}
```

#### 3. Login as Citizen

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testcitizen@example.com",
    "password": "TestPassword123!",
    "userType": "citizen"
  }'
```

**Response (save token):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1,
  "userType": "citizen",
  "expiresIn": 86400
}
```

#### 4. Create Report (Using Token)

```bash
TOKEN="your-token-from-login-response"

curl -X POST http://localhost:3001/api/reports/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "location": "Central Park, New York",
    "latitude": "40.7829",
    "longitude": "-73.9654",
    "description": "Brown dog with white spots, looks injured",
    "contactName": "Test Citizen",
    "contactPhone": "1234567890",
    "contactEmail": "testcitizen@example.com",
    "imageUrl": ""
  }'
```

**Response:**
```json
{
  "success": true,
  "reportId": 1,
  "message": "Report created successfully"
}
```

#### 5. Sign Up as NGO

```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testngo@example.com",
    "password": "TestPassword123!",
    "name": "Test NGO",
    "phone": "9876543210",
    "userType": "ngo",
    "organizationName": "Test Animal NGO",
    "registrationNumber": "REG123"
  }'
```

#### 6. Login as NGO

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testngo@example.com",
    "password": "TestPassword123!",
    "userType": "ngo"
  }'
```

**Save token for NGO**

#### 7. Get All Reports (as NGO)

```bash
NGO_TOKEN="ngo-token-from-above"

curl -X GET http://localhost:3001/api/reports \
  -H "Authorization: Bearer $NGO_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "reports": [
    {
      "id": 1,
      "userId": 1,
      "location": "Central Park, New York",
      "status": "pending",
      "description": "Brown dog with white spots..."
    }
  ],
  "count": 1
}
```

#### 8. Update Report Status (as NGO)

```bash
curl -X PUT http://localhost:3001/api/reports/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $NGO_TOKEN" \
  -d '{
    "status": "in_progress",
    "notes": "Dog rescue in progress"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Report updated successfully"
}
```

#### 9. Test Frontend in Browser

Visit http://localhost:3000 and:

1. **Sign up** as citizen
2. **Submit a report** with location and description
3. **View my reports** page
4. **Sign up** as NGO in separate browser/incognito
5. **Login** as NGO
6. **View dashboard** with all reports
7. **Update report** status
8. **Browse adoptable dogs** on citizen dashboard

---

## Environment Variables Quick Reference

### Frontend (.env.local)

| Variable | Example | Required |
|----------|---------|----------|
| NEXT_PUBLIC_API_URL | http://localhost:3001 | ✅ |
| NEXT_PUBLIC_APP_NAME | Stray Shield | ⚠️ |
| NEXT_PUBLIC_VERSION | 1.0.0 | ⚠️ |

### Backend (.env - File-based)

| Variable | Example | Required |
|----------|---------|----------|
| PORT | 3001 | ✅ |
| NODE_ENV | development | ✅ |
| JWT_SECRET | any-secret-key | ✅ |
| JWT_EXPIRY | 86400 | ✅ |
| DATABASE_TYPE | file | ✅ |
| CORS_ORIGIN | http://localhost:3000 | ✅ |
| LOG_LEVEL | debug | ⚠️ |

### Backend (.env - PostgreSQL)

| Variable | Example | Required |
|----------|---------|----------|
| PORT | 3001 | ✅ |
| NODE_ENV | development | ✅ |
| JWT_SECRET | any-secret-key | ✅ |
| DATABASE_TYPE | postgres | ✅ |
| DB_HOST | localhost | ✅ |
| DB_PORT | 5432 | ✅ |
| DB_NAME | stray_shield | ✅ |
| DB_USER | stray_user | ✅ |
| DB_PASSWORD | password | ✅ |
| DB_POOL_MIN | 2 | ⚠️ |
| DB_POOL_MAX | 10 | ⚠️ |

---

## Development Best Practices

### Code Organization

**Always use centralized configuration:**

```javascript
// ✅ Good
import { ROUTES, API_ENDPOINTS } from '@/config/paths.js';
const url = API_ENDPOINTS.CREATE_REPORT;

// ❌ Bad
const url = 'http://localhost:3001/api/reports/create';
```

**Always use API helpers:**

```javascript
// ✅ Good
import { createReport } from '@/utils/api.js';
const response = await createReport(reportData);

// ❌ Bad
const response = await fetch('http://localhost:3001/api/reports/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(reportData)
});
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/amazing-feature

# Make changes
# ... edit files ...

# Stage changes
git add .

# Commit with descriptive message
git commit -m "Add amazing feature"

# Push to GitHub
git push origin feature/amazing-feature

# Create Pull Request on GitHub
```

### Code Quality

```bash
# Check for linting issues
npm run lint

# Format code with Prettier
npm run format

# Run tests (if available)
npm test

# Build for production
npm run build
```

### Frontend Development

**Component structure:**

```javascript
// components/DogCard.jsx
'use client'; // Mark as client component

import { useState } from 'react';
import Image from 'next/image';

export default function DogCard({ dog, onInterest }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {/* Component JSX */}
    </div>
  );
}
```

### Backend Development

**Route structure:**

```javascript
// Express routes should be organized
app.post('/api/auth/signup', validateInput, (req, res) => {
  // Handler
});

app.post('/api/auth/login', validateInput, (req, res) => {
  // Handler
});

app.post('/api/reports/create', authenticateToken, validateInput, (req, res) => {
  // Handler
});
```

---

## Testing Procedures

### Manual Testing Checklist

#### Authentication

- [ ] Sign up as citizen with valid email
- [ ] Sign up as citizen with invalid email (should fail)
- [ ] Sign up with duplicate email (should fail)
- [ ] Login with correct credentials
- [ ] Login with wrong password (should fail)
- [ ] Logout successfully
- [ ] Session persists after page refresh
- [ ] Session clears after logout

#### Citizen Features

- [ ] Submit report with all required fields
- [ ] Submit report with missing fields (should fail)
- [ ] Upload single image
- [ ] View "My Reports" page
- [ ] See pending reports listed
- [ ] Browse adoptable dogs
- [ ] See personality match score
- [ ] Click "Express Interest" button

#### NGO Features

- [ ] Login as NGO
- [ ] View dashboard with report statistics
- [ ] See correct count of pending reports
- [ ] Filter reports by status
- [ ] Click on report to see details
- [ ] Update report status
- [ ] Add notes to report
- [ ] See updated status reflected

#### UI/UX

- [ ] Test on desktop (1920x1080)
- [ ] Test on tablet (768x1024)
- [ ] Test on mobile (375x667)
- [ ] Test animations (smooth)
- [ ] Test dark mode (if implemented)
- [ ] Test form validation messages
- [ ] Test error handling
- [ ] Test loading states

### API Testing with Thunder Client

1. **Install Thunder Client** extension in VS Code
2. **Create requests** for each endpoint
3. **Test with different inputs**
4. **Save test collections**
5. **Share with team**

**Example test:**

```
POST http://localhost:3001/api/auth/login

Headers:
Content-Type: application/json

Body:
{
  "email": "citizen@example.com",
  "password": "TestPassword123!",
  "userType": "citizen"
}

Expected:
Status: 200
Body contains: token, userId, userType
```

### Load Testing

```bash
# Install Apache Bench
brew install httpd

# Test API performance
ab -n 100 -c 10 http://localhost:3001/api/health

# Results show:
# - Requests per second
# - Time per request
# - Failed requests
```

---

## Troubleshooting Guide

### Common Issues

#### Issue: "Cannot find module 'express'"

**Error:**
```
Error: Cannot find module 'express'
```

**Solution:**
```bash
cd server
npm install
npm start
```

#### Issue: "Port 3001 already in use"

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3001
```

**Solution:**

```bash
# macOS/Linux
lsof -i :3001 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Or use different port
PORT=3002 npm run dev
```

#### Issue: "JWT_SECRET not set"

**Error:**
```
TypeError: JWT_SECRET is not defined
```

**Solution:**

```bash
# Generate secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Add to .env
JWT_SECRET=your-generated-secret-here
```

#### Issue: "ECONNREFUSED - Cannot connect to API"

**Error:**
```
Error: connect ECONNREFUSED 127.0.0.1:3001
```

**Solution:**

```bash
# Verify backend is running
ps aux | grep node

# Check port is open
lsof -i :3001

# Verify .env.local has correct URL
NEXT_PUBLIC_API_URL=http://localhost:3001

# Restart frontend
npm run dev
```

#### Issue: "CORS error"

**Error:**
```
Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource
```

**Solution:**

Edit `server/.env`:
```env
CORS_ORIGIN=http://localhost:3000
```

Restart backend:
```bash
npm run dev
```

#### Issue: "Token invalid or expired"

**Error:**
```
Invalid or expired token
```

**Solution:**

```bash
# Clear browser storage
# DevTools → Application → Storage → Local Storage → Clear All

# Login again to get new token
# Token expires after 24 hours
```

#### Issue: "Database connection failed"

**Error:**
```
Error: ECONNREFUSED - connection refused
```

**Solution (PostgreSQL):**

```bash
# Check if running
brew services list | grep postgres

# Start PostgreSQL
brew services start postgresql

# Test connection
psql -U postgres -d stray_shield
```

**Solution (File-based):**

```bash
# Create data directory
mkdir -p server/data

# Check permissions
ls -la server/data
```

#### Issue: "git push fails with authentication error"

**Error:**
```
fatal: Authentication failed
```

**Solution:**

```bash
# Add SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to GitHub
cat ~/.ssh/id_ed25519.pub
# Copy to GitHub Settings → SSH Keys

# Or use HTTPS with token
git remote set-url origin https://YOUR_TOKEN@github.com/shravyaks275/stray-shield-web.git
```

---

## Performance Optimization

### Frontend Optimization

#### 1. Image Optimization

```javascript
import Image from 'next/image';

// Use next/image for optimization
<Image 
  src={dog.imageUrl}
  alt="Dog"
  width={300}
  height={300}
  priority={false}
/>
```

#### 2. Code Splitting

```javascript
import dynamic from 'next/dynamic';

const AdoptionDashboard = dynamic(
  () => import('@/components/AdoptionDashboard'),
  { loading: () => <p>Loading...</p> }
);
```

#### 3. Bundle Analysis

```bash
npm install --save-dev @next/bundle-analyzer

# Analyze bundle
ANALYZE=true npm run build
```

### Backend Optimization

#### 1. Database Indexes

```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);
```

#### 2. Response Caching

```javascript
app.get('/api/reports', (req, res) => {
  res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
  // handler
});
```

#### 3. Enable Compression

```javascript
const compression = require('compression');
app.use(compression());
```

### General Tips

- **Monitor response times** in browser DevTools
- **Use Chrome Lighthouse** for performance audit
- **Optimize images** before uploading
- **Minimize dependencies** to reduce bundle size
- **Use CDN** for static assets
- **Enable caching** headers

---

## Security Checklist

### Frontend Security

- [ ] No API credentials hardcoded
- [ ] HTTPS enforced in production
- [ ] Form inputs validated
- [ ] CSRF tokens implemented
- [ ] XSS protection enabled
- [ ] Security headers set

### Backend Security

- [ ] JWT_SECRET is strong (32+ characters)
- [ ] Passwords hashed with bcrypt
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention
- [ ] CORS restricted to frontend domain
- [ ] Rate limiting implemented
- [ ] Error messages don't expose sensitive data
- [ ] Logging configured

### Database Security

- [ ] Strong password for database user
- [ ] Connection restricted to localhost (development)
- [ ] SSL/TLS encryption (production)
- [ ] Regular backups enabled
- [ ] Sensitive data encrypted
- [ ] Access logs enabled

---

## Deployment

### Deploy Frontend to Vercel

```bash
# Push code to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# Go to vercel.com
# Click "New Project"
# Select repository
# Set environment variables
# Click "Deploy"
```

### Deploy Backend to Railway

```bash
# Go to railway.app
# Click "New Project"
# Select "Deploy from GitHub"
# Choose repository
# Set environment variables
# Deploy
```

### Deploy Database

```bash
# Railway/Render automatically provides PostgreSQL
# Or use AWS RDS, DigitalOcean, etc.

# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

---

## Monitoring & Logs

### Frontend Logs (Browser)

```bash
# Open DevTools
# F12 or Cmd+Option+I

# Check Console tab for errors
# Check Network tab for API calls
# Check Application tab for stored data
```

### Backend Logs

```bash
# Terminal shows logs in real-time
# Check for:
# - Incoming requests
# - Errors
# - Warnings
# - Performance issues

# Increase log level in .env
LOG_LEVEL=debug
```

### Database Logs

```bash
# PostgreSQL logs
tail -f /var/log/postgresql/postgresql.log

# Check for:
# - Connection errors
# - Slow queries
# - Authentication issues
```

---

## Additional Resources

### Documentation Files
- **README.md** - Project overview
- **BACKEND_SETUP.md** - Backend-specific setup
- **DATABASE_SETUP.md** - Database-specific setup
- **DEPLOYMENT.md** - Production deployment
- **COMPLETION_SUMMARY.md** - Project status

### External Resources
- **Next.js Docs**: https://nextjs.org/docs
- **Express.js Docs**: https://expressjs.com
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **JWT Guide**: https://jwt.io/introduction
- **React Hooks**: https://react.dev/reference/react/hooks

### Tools
- **VS Code Extensions**:
  - ESLint
  - Prettier
  - Thunder Client
  - PostSQL client
  - GitLens

- **Browser DevTools**:
  - Chrome DevTools (F12)
  - React Developer Tools
  - Redux DevTools

---

## Getting Help

### Debugging Steps

1. **Check console for errors**
   ```bash
   # Browser DevTools → Console tab
   # Terminal output for backend errors
   ```

2. **Verify environment variables**
   ```bash
   # Frontend: .env.local must have NEXT_PUBLIC_API_URL
   # Backend: .env must have DATABASE_TYPE and JWT_SECRET
   ```

3. **Check API connectivity**
   ```bash
   curl http://localhost:3001/api/health
   ```

4. **Review logs**
   ```bash
   # Backend terminal
   # Browser console
   # PostgreSQL logs (if applicable)
   ```

5. **Test with cURL**
   ```bash
   # Test endpoints individually
   curl -X POST http://localhost:3001/api/auth/login
   ```

### Getting Support

1. **Check documentation**
   - Read README.md
   - Check TROUBLESHOOTING section
   - Review this FULL_SETUP_GUIDE.md

2. **Review GitHub Issues**
   - https://github.com/shravyaks275/stray-shield-web/issues
   - Search for similar problems

3. **Create GitHub Issue**
   - Provide detailed error message
   - Include terminal output
   - List steps to reproduce

4. **Contact Maintainers**
   - Project Lead: [@shravyaks275](https://github.com/shravyaks275)
   - Email: [contact info]

### Common Commands Cheatsheet

```bash
# Setup
git clone <repo-url>
cd stray-shield-web
npm install
cd server && npm install && cd ..

# Development
npm run dev                 # Frontend (Terminal 1)
cd server && npm run dev    # Backend (Terminal 2)

# Testing
curl http://localhost:3001/api/health

# Building
npm run build

# Database
psql -U postgres -d stray_shield

# Git
git add .
git commit -m "message"
git push origin main
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-03-26 | Complete end-to-end setup guide |
| 0.9.0 | 2026-03-20 | Beta setup guide |

---

## Project Status

✅ **Setup Guide Complete**  
✅ **All Components Documented**  
✅ **Testing Procedures Included**  
✅ **Troubleshooting Available**  

Ready for development and deployment!

---

**Last Updated**: 2026-03-26  
**Maintained by**: Stray Shield Team  
**Status**: Production Ready ✅

For issues, visit: https://github.com/shravyaks275/stray-shield-web/issues

---

## Quick Start Commands

**For the impatient:**

```bash
# 1. Clone and install
git clone https://github.com/shravyaks275/stray-shield-web.git && cd stray-shield-web
npm install && cd server && npm install && cd ..

# 2. Setup environment
cp .env.example .env.local
cp server/.env.example server/.env

# 3. Run (3 terminals)
# Terminal 1:
cd server && npm run dev

# Terminal 2:
npm run dev

# Terminal 3:
# Visit http://localhost:3000

# 4. Test
curl http://localhost:3001/api/health
```


---
