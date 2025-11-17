# Stray Shield Backend API Setup

## Installation

1. Navigate to the server directory:
\`\`\`bash
cd server
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create a `.env` file (copy from `.env.example`):
\`\`\`bash
cp .env.example .env
\`\`\`

4. Update `.env` with your configuration:
\`\`\`
PORT=3001
JWT_SECRET=your-very-secret-key
NODE_ENV=development
\`\`\`

## Running the Server

### Development Mode (with auto-reload):
\`\`\`bash
npm run dev
\`\`\`

### Production Mode:
\`\`\`bash
npm start
\`\`\`

The API will be available at `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Reports
- `POST /api/reports/create` - Create a new report (requires auth)
- `GET /api/reports` - Get all reports (citizens see only their own, NGOs see all)
- `GET /api/reports/:id` - Get specific report
- `PUT /api/reports/:id` - Update report status (NGO only)
- `DELETE /api/reports/:id` - Delete report

### User
- `GET /api/users/profile` - Get user profile (requires auth)

### Health
- `GET /api/health` - Health check

## Data Storage

Reports and users are stored in JSON files in the `server/data/` directory for simplicity. For production, migrate to a proper database like PostgreSQL, MongoDB, or Firebase.

## Frontend Configuration

Set the backend URL in your frontend `.env.local`:
\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:3001
\`\`\`

## Testing with cURL

### Signup
\`\`\`bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "citizen@example.com",
    "password": "password123",
    "name": "John Doe",
    "phone": "1234567890",
    "userType": "citizen"
  }'
\`\`\`

### Login
\`\`\`bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "citizen@example.com",
    "password": "password123",
    "userType": "citizen"
  }'
\`\`\`

### Create Report (replace TOKEN with actual JWT)
\`\`\`bash
curl -X POST http://localhost:3001/api/reports/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "location": "Central Park",
    "latitude": "40.7829",
    "longitude": "-73.9654",
    "description": "Brown dog with white spots",
    "contactName": "John",
    "contactPhone": "+1234567890",
    "contactEmail": "john@example.com",
    "imageUrl": ""
  }'
