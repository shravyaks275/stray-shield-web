# Stray Shield Backend API Setup

Complete guide for setting up, configuring, and running the Express.js backend server for the Stray Shield application.

---

## Table of Contents

1. [Installation](#installation)
2. [Configuration](#configuration)
3. [Running the Server](#running-the-server)
4. [API Endpoints](#api-endpoints)
5. [Request/Response Examples](#requestresponse-examples)
6. [Error Handling](#error-handling)
7. [Authentication Flow](#authentication-flow)
8. [Database Connection](#database-connection)
9. [Testing with cURL](#testing-with-curl)
10. [Troubleshooting](#troubleshooting)
11. [Performance Optimization](#performance-optimization)
12. [Security Checklist](#security-checklist)

---

## Installation

### Prerequisites

- Node.js v16 or higher
- npm v7 or higher
- PostgreSQL 12+ (optional, for production)

### Step 1: Navigate to Server Directory

```bash
cd server


### Step 2: Install Dependencies

npm install


This will install all required packages:
- `express` - Web framework
- `jsonwebtoken` - JWT authentication
- `bcrypt` - Password hashing
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management
- `pg` - PostgreSQL client (optional)

### Step 3: Create Environment File

cp .env.example .env


### Step 4: Configure Environment Variables

Edit `.env` with your settings:

# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-very-secret-key-change-this-in-production
JWT_EXPIRY=86400

# Database Configuration (File-based by default)
DATABASE_TYPE=file

# Optional: PostgreSQL Configuration
# DATABASE_TYPE=postgres
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=stray_shield
# DB_USER=postgres
# DB_PASSWORD=your_postgres_password

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=debug


---

## Configuration

### Environment Variables Explained

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3001 | Server port |
| `NODE_ENV` | development | Environment (development/production) |
| `JWT_SECRET` | - | Secret key for JWT signing (MUST change!) |
| `JWT_EXPIRY` | 86400 | Token expiry in seconds (24 hours) |
| `DATABASE_TYPE` | file | Storage type (file/postgres) |
| `CORS_ORIGIN` | * | Allowed frontend URL |
| `LOG_LEVEL` | info | Logging level (debug/info/warn/error) |

### Development vs Production

**Development (.env)**

NODE_ENV=development
JWT_SECRET=dev-secret-key-not-secure
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=debug
DATABASE_TYPE=file


**Production (.env)**

NODE_ENV=production
JWT_SECRET=your-very-long-secure-random-key-32-chars-minimum
JWT_EXPIRY=86400
CORS_ORIGIN=https://yourdomain.com
LOG_LEVEL=info
DATABASE_TYPE=postgres
DB_HOST=your-postgres-host
DB_PORT=5432
DB_NAME=stray_shield
DB_USER=postgres_user
DB_PASSWORD=secure_password_here


---

## Running the Server

### Development Mode (with Auto-reload)


npm run dev


This uses `nodemon` for automatic server restart on file changes.

Expected output:

Stray Shield API running on http://localhost:3001
Connected to file-based storage
Press Ctrl+C to stop


### Production Mode


npm start


Runs the server without hot-reload (better performance).

### Background Process (Production)


# Using pm2 (recommended for production)
npm install -g pm2
pm2 start server/index.js --name "stray-shield-api"
pm2 logs stray-shield-api
pm2 save  # Save for auto-restart on reboot


---

## API Endpoints

### Complete Endpoint Reference

#### Authentication Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/signup` | POST | ❌ | Register new user (citizen or NGO) |
| `/api/auth/login` | POST | ❌ | Login user and receive JWT token |

#### Report Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/reports/create` | POST | ✅ | Create a new stray dog report |
| `/api/reports` | GET | ✅ | Get all reports (filtered by role) |
| `/api/reports/:id` | GET | ✅ | Get specific report by ID |
| `/api/reports/:id` | PUT | ✅ | Update report (NGO only) |
| `/api/reports/:id` | DELETE | ✅ | Delete report (owner only) |
| `/api/reports/my` | GET | ✅ | Get citizen's own reports |

#### User Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/users/profile` | GET | ✅ | Get logged-in user's profile |
| `/api/users/profile` | PUT | ✅ | Update user profile |

#### Health & Status

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/health` | GET | ❌ | API health check |
| `/api/status` | GET | ❌ | Detailed API status |

---

## Request/Response Examples

### 1. Authentication Endpoints

#### Signup (Citizen)

**Request:**

curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "citizen@example.com",
    "password": "SecurePassword123!",
    "name": "John Doe",
    "phone": "1234567890",
    "userType": "citizen"
  }'


**Response (201 Created):**

{
  "success": true,
  "userId": 1,
  "userType": "citizen",
  "email": "citizen@example.com",
  "name": "John Doe",
  "message": "User created successfully"
}


#### Signup (NGO)

**Request:**

curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ngo@example.com",
    "password": "SecurePassword123!",
    "name": "Animal Care NGO",
    "phone": "9876543210",
    "userType": "ngo",
    "organizationName": "Animal Care NGO",
    "registrationNumber": "NGO123456"
  }'


**Response (201 Created):**

{
  "success": true,
  "userId": 2,
  "userType": "ngo",
  "email": "ngo@example.com",
  "organizationName": "Animal Care NGO",
  "message": "NGO registered successfully"
}


#### Login

**Request:**

curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "citizen@example.com",
    "password": "SecurePassword123!",
    "userType": "citizen"
  }'


**Response (200 OK):**

{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJUeXBlIjoiY2l0aXplbiIsImlhdCI6MTY0NTEyMzQ1NiwiZXhwIjoxNjQ1MjA5ODU2fQ.abc123xyz",
  "userId": 1,
  "userType": "citizen",
  "expiresIn": 86400,
  "message": "Login successful"
}


---

### 2. Report Endpoints

#### Create Report

**Request:**

curl -X POST http://localhost:3001/api/reports/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "location": "Central Park, New York",
    "latitude": "40.7829",
    "longitude": "-73.9654",
    "description": "Brown dog with white spots, looks injured",
    "contactName": "John Doe",
    "contactPhone": "+1234567890",
    "contactEmail": "citizen@example.com",
    "imageUrl": "https://example.com/dog.jpg"
  }'


**Response (201 Created):**

{
  "success": true,
  "reportId": 1,
  "message": "Report created successfully",
  "report": {
    "id": 1,
    "userId": 1,
    "location": "Central Park, New York",
    "latitude": "40.7829",
    "longitude": "-73.9654",
    "description": "Brown dog with white spots, looks injured",
    "contactName": "John Doe",
    "contactPhone": "+1234567890",
    "contactEmail": "citizen@example.com",
    "imageUrl": "https://example.com/dog.jpg",
    "status": "pending",
    "createdAt": "2026-03-26T10:30:00.000Z",
    "updatedAt": "2026-03-26T10:30:00.000Z"
  }
}


#### Get All Reports (NGO)

**Request:**

curl -X GET http://localhost:3001/api/reports \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."


**Response (200 OK):**

{
  "success": true,
  "reports": [
    {
      "id": 1,
      "userId": 1,
      "location": "Central Park, New York",
      "description": "Brown dog with white spots, looks injured",
      "status": "pending",
      "contactName": "John Doe",
      "contactPhone": "+1234567890",
      "contactEmail": "citizen@example.com",
      "createdAt": "2026-03-26T10:30:00.000Z",
      "updatedAt": "2026-03-26T10:30:00.000Z"
    },
    {
      "id": 2,
      "userId": 1,
      "location": "Times Square, New York",
      "description": "White dog, appears sick",
      "status": "in_progress",
      "contactName": "John Doe",
      "contactPhone": "+1234567890",
      "contactEmail": "citizen@example.com",
      "createdAt": "2026-03-25T15:20:00.000Z",
      "updatedAt": "2026-03-26T09:00:00.000Z"
    }
  ],
  "count": 2
}


#### Get My Reports (Citizen)

**Request:**

curl -X GET http://localhost:3001/api/reports/my \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."


**Response (200 OK):**

{
  "success": true,
  "reports": [
    {
      "id": 1,
      "userId": 1,
      "location": "Central Park, New York",
      "description": "Brown dog with white spots",
      "status": "pending",
      "contactName": "John Doe",
      "contactPhone": "+1234567890",
      "createdAt": "2026-03-26T10:30:00.000Z"
    }
  ],
  "count": 1
}


#### Get Specific Report

**Request:**

curl -X GET http://localhost:3001/api/reports/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."


**Response (200 OK):**

{
  "success": true,
  "report": {
    "id": 1,
    "userId": 1,
    "location": "Central Park, New York",
    "latitude": "40.7829",
    "longitude": "-73.9654",
    "description": "Brown dog with white spots, looks injured",
    "contactName": "John Doe",
    "contactPhone": "+1234567890",
    "contactEmail": "citizen@example.com",
    "imageUrl": "https://example.com/dog.jpg",
    "status": "pending",
    "createdAt": "2026-03-26T10:30:00.000Z",
    "updatedAt": "2026-03-26T10:30:00.000Z"
  }
}


#### Update Report Status (NGO)

**Request:**

curl -X PUT http://localhost:3001/api/reports/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "status": "in_progress",
    "notes": "Dog picked up and taken to veterinary clinic"
  }'


**Response (200 OK):**

{
  "success": true,
  "message": "Report updated successfully",
  "report": {
    "id": 1,
    "status": "in_progress",
    "notes": "Dog picked up and taken to veterinary clinic",
    "updatedAt": "2026-03-26T11:00:00.000Z"
  }
}


#### Delete Report

**Request:**

curl -X DELETE http://localhost:3001/api/reports/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."


**Response (200 OK):**

{
  "success": true,
  "message": "Report deleted successfully"
}


---

### 3. User Endpoints

#### Get User Profile

**Request:**

curl -X GET http://localhost:3001/api/users/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."


**Response (200 OK):**

{
  "success": true,
  "user": {
    "id": 1,
    "email": "citizen@example.com",
    "name": "John Doe",
    "phone": "1234567890",
    "userType": "citizen",
    "createdAt": "2026-03-26T09:00:00.000Z",
    "updatedAt": "2026-03-26T10:30:00.000Z"
  }
}


#### Update User Profile

**Request:**

curl -X PUT http://localhost:3001/api/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "name": "John Smith",
    "phone": "9876543210"
  }'


**Response (200 OK):**

{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "email": "citizen@example.com",
    "name": "John Smith",
    "phone": "9876543210",
    "userType": "citizen"
  }
}


---

### 4. Health & Status Endpoints

#### Health Check

**Request:**

curl http://localhost:3001/api/health


**Response (200 OK):**

{
  "status": "OK",
  "message": "Stray Shield API is running",
  "timestamp": "2026-03-26T10:30:00.000Z"
}


#### Status Information

**Request:**

curl http://localhost:3001/api/status


**Response (200 OK):**

{
  "status": "operational",
  "uptime": 3600,
  "version": "1.0.0",
  "environment": "development",
  "database": "file-based",
  "apiEndpoints": 15,
  "timestamp": "2026-03-26T10:30:00.000Z"
}


---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Successful request |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Missing required fields |
| 401 | Unauthorized | Invalid/missing token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Internal server error |

### Common Error Responses

#### 400 - Bad Request (Missing Fields)

**Response:**

{
  "success": false,
  "error": "Email is required",
  "statusCode": 400
}


#### 400 - Bad Request (Invalid Input)

**Response:**

{
  "success": false,
  "error": "Invalid email format",
  "statusCode": 400
}


#### 401 - Unauthorized (Missing Token)

**Response:**

{
  "success": false,
  "error": "Authorization header missing",
  "statusCode": 401
}


#### 401 - Unauthorized (Invalid Token)

**Response:**

{
  "success": false,
  "error": "Invalid or expired token",
  "statusCode": 401
}


#### 403 - Forbidden (Insufficient Permissions)

**Response:**

{
  "success": false,
  "error": "Only NGOs can update report status",
  "statusCode": 403
}


#### 404 - Not Found

**Response:**

{
  "success": false,
  "error": "Report not found",
  "statusCode": 404
}


#### 409 - Conflict (Email Already Exists)

**Response:**

{
  "success": false,
  "error": "Email already exists",
  "statusCode": 409
}


#### 500 - Server Error

**Response:**

{
  "success": false,
  "error": "Internal server error",
  "details": "Connection to database failed",
  "statusCode": 500
}


---

## Authentication Flow

### JWT Token Authentication

1. **User Sign-up**
   - User provides email, password, name, phone
   - Password hashed with bcrypt (10 salt rounds)
   - User stored in database
   - No token issued yet

2. **User Login**
   - User sends email and password
   - Password verified against stored hash
   - JWT token generated with user info
   - Token expires in 24 hours (86400 seconds)
   - Token sent to client

3. **Token Usage**
   - Client stores token in localStorage
   - Token sent in Authorization header: `Authorization: Bearer {token}`
   - Format: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

4. **Token Validation**
   - Server receives request with token
   - Token signature verified
   - Token expiration checked
   - User ID and type extracted
   - Request processed

5. **Token Expiration**
   - Expired token returns 401 Unauthorized
   - Client clears localStorage
   - User prompted to login again
   - New token issued on successful login

### Token Structure


Header: {
  "alg": "HS256",
  "typ": "JWT"
}

Payload: {
  "userId": 1,
  "userType": "citizen",
  "email": "citizen@example.com",
  "iat": 1645123456,
  "exp": 1645209856
}

Signature: HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  JWT_SECRET
)


### Token Expiration Times

| Environment | Expiry | Purpose |
|-------------|--------|---------|
| Development | 24 hours | Longer for testing |
| Production | 24 hours | Standard duration |
| Long-lived | 30 days | Remember me (future) |
| Refresh | 7 days | Refresh token (future) |

---

## Database Connection

### File-based Storage (Default)

Data stored in JSON files in `server/data/` directory:


server/data/
├── users.json       # All registered users
├── reports.json     # All stray dog reports
└── dogs.json        # Adoptable dogs database


**Advantages:**
- No external dependencies
- Quick to set up
- Good for development/testing

**Disadvantages:**
- Not suitable for production
- No concurrent access protection
- Limited query capabilities

### PostgreSQL Connection (Production)

For production deployments:

1. **Install PostgreSQL**
   
   brew install postgresql      # macOS
   sudo apt-get install postgresql  # Linux
   

2. **Create Database**
   
   psql -U postgres
   CREATE DATABASE stray_shield;
   \q
   

3. **Configure Environment**
   
   DATABASE_TYPE=postgres
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=stray_shield
   DB_USER=postgres
   DB_PASSWORD=your_password
   

4. **Run Migrations**
   
   npm run migrate
   

5. **Seed Sample Data** (Optional)
   
   npm run seed
   

### Connection Pool Configuration

**Default Settings:**

{
  min: 2,              // Minimum connections
  max: 10,             // Maximum connections
  idleTimeoutMillis: 30000,  // Close idle after 30s
  connectionTimeoutMillis: 2000  // Fail if can't connect
}


**Production Settings:**

{
  min: 5,
  max: 20,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 2000
}


---

## Testing with cURL

### Test Sequence (Complete Flow)

**1. Check API Health**

curl http://localhost:3001/api/health


**2. Sign Up as Citizen**

curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testcitizen@example.com",
    "password": "TestPassword123!",
    "name": "Test Citizen",
    "phone": "1234567890",
    "userType": "citizen"
  }'


**3. Login as Citizen**

curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testcitizen@example.com",
    "password": "TestPassword123!",
    "userType": "citizen"
  }'


*Save the token from response*

**4. Create Report** (Replace TOKEN)

TOKEN="your-token-here"

curl -X POST http://localhost:3001/api/reports/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "location": "Test Location",
    "latitude": "40.7128",
    "longitude": "-74.0060",
    "description": "Test stray dog report",
    "contactName": "Test User",
    "contactPhone": "1234567890",
    "contactEmail": "test@example.com",
    "imageUrl": ""
  }'


**5. Get My Reports**

curl -X GET http://localhost:3001/api/reports/my \
  -H "Authorization: Bearer $TOKEN"


**6. Sign Up as NGO**

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


**7. Login as NGO**

curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testngo@example.com",
    "password": "TestPassword123!",
    "userType": "ngo"
  }'


*Save NGO token*

**8. Get All Reports (as NGO)**

NGO_TOKEN="ngo-token-here"

curl -X GET http://localhost:3001/api/reports \
  -H "Authorization: Bearer $NGO_TOKEN"


**9. Update Report Status (as NGO)**

curl -X PUT http://localhost:3001/api/reports/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $NGO_TOKEN" \
  -d '{
    "status": "in_progress",
    "notes": "Dog rescue in progress"
  }'


---

## Troubleshooting

### Issue: "Cannot find module 'express'"

**Solution:**

cd server
npm install


### Issue: "Port 3001 already in use"

**Find and kill the process:**

# macOS/Linux
lsof -i :3001 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F


**Or use a different port:**

PORT=3002 npm run dev


### Issue: "JWT_SECRET not set"

**Solution:**

# Generate a secure secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Add to .env
JWT_SECRET=your-generated-secret-here


### Issue: "ECONNREFUSED - Connection refused"

**Possible causes:**
- Backend not running
- Wrong host/port
- Firewall blocking

**Solution:**

# Check if backend is running
ps aux | grep node

# Check if port is open
netstat -an | grep 3001

# Restart backend
npm run dev


### Issue: "Invalid or expired token"

**Solution:**
- Token may be expired (24 hours)
- Token signature doesn't match JWT_SECRET
- Token format is incorrect

**Fix:**
1. Login again to get fresh token
2. Verify JWT_SECRET matches between frontend and backend
3. Check token format: `Authorization: Bearer {token}`

### Issue: "CORS error - No 'Access-Control-Allow-Origin' header"

**Solution:**
Edit `.env`:

CORS_ORIGIN=http://localhost:3000


Or for production:

CORS_ORIGIN=https://yourdomain.com


### Issue: "Database connection failed"

**For file-based storage:**

# Check if data directory exists
ls -la server/data/

# Create if missing
mkdir -p server/data


**For PostgreSQL:**

# Check if PostgreSQL is running
brew services list | grep postgres

# Start PostgreSQL
brew services start postgresql

# Test connection
psql -U postgres -d stray_shield


---

## Performance Optimization

### Response Time Optimization

1. **Enable Request Compression**
   
   const compression = require('compression');
   app.use(compression());
   

2. **Implement Caching**
   
   // Cache GET requests for 5 minutes
   app.get('/api/reports', (req, res) => {
     res.set('Cache-Control', 'public, max-age=300');
     // ... handler
   });
   

3. **Add Database Indexes**
   
   CREATE INDEX idx_users_email ON users(email);
   CREATE INDEX idx_reports_user_id ON reports(user_id);
   CREATE INDEX idx_reports_status ON reports(status);
   

4. **Use Connection Pooling**
   
   DB_POOL_MIN=5
   DB_POOL_MAX=20
   

### Memory Optimization

1. **Monitor Memory Usage**
   
   node --max-old-space-size=512 server/index.js
   

2. **Enable Garbage Collection Logging**
   
   node --trace-gc server/index.js
   

### Load Testing


# Install Apache Bench
brew install httpd

# Test API performance
ab -n 1000 -c 10 http://localhost:3001/api/health

# Results show:
# - Requests per second
# - Time per request
# - Failed requests


---

## Security Checklist

- [ ] **JWT_SECRET** is 32+ characters
  
  echo -n "$JWT_SECRET" | wc -c
  

- [ ] **Passwords** are hashed with bcrypt
  
  const hashedPassword = await bcrypt.hash(password, 10);
  

- [ ] **All inputs** are validated
  
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }
  

- [ ] **CORS** is restricted to frontend domain
  
  CORS_ORIGIN=https://yourdomain.com
  

- [ ] **HTTPS** is enforced in production
  
  if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
      if (req.header('x-forwarded-proto') !== 'https') {
        res.redirect(`https://${req.header('host')}${req.url}`);
      } else {
        next();
      }
    });
  }
  

- [ ] **Rate limiting** is implemented

  npm install express-rate-limit
 

- [ ] **SQL injection** prevention (parameterized queries)

  // Good ✅
  db.query('SELECT * FROM users WHERE email = $1', [email]);
  
  // Bad ❌
  db.query(`SELECT * FROM users WHERE email = '${email}'`);


- [ ] **Error messages** don't expose sensitive info
 
  // Good ✅
  res.status(500).json({ error: 'Internal server error' });
  
  // Bad ❌
  res.status(500).json({ error: err.message, stack: err.stack });
 

- [ ] **Environment variables** are not logged

  // Don't log sensitive data
  console.log(process.env.JWT_SECRET); // ❌ Never do this
  

- [ ] **Dependencies** are up to date
 
  npm audit
  npm update
 

---

## Frontend Configuration

To connect the frontend to this backend, set the environment variable:

**.env.local (Frontend)**

NEXT_PUBLIC_API_URL=http://localhost:3001


**.env.local (Production)**

NEXT_PUBLIC_API_URL=https://api.strayhield.com


---

## Additional Resources

### Documentation Files
- `README.md` - Project overview
- `DATABASE_SETUP.md` - Database configuration
- `DEPLOYMENT.md` - Production deployment
- `FULL_SETUP_GUIDE.md` - Complete setup guide

### External Resources
- **Express.js Docs**: https://expressjs.com
- **JWT Best Practices**: https://tools.ietf.org/html/rfc7519
- **bcrypt Documentation**: https://github.com/kelektiv/node.bcrypt.js
- **PostgreSQL Manual**: https://www.postgresql.org/docs/
- **OWASP Security**: https://owasp.org/www-project-top-ten/

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-03-26 | Initial release - All endpoints complete |
| 0.9.0 | 2026-03-20 | Beta release - Testing phase |

---

**Last Updated**: 2026-03-26  
**Maintained by**: Stray Shield Team  
**Status**: Production Ready ✅



---
