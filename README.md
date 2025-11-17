# Stray Shield - Complete Civic-Tech Web App

A comprehensive full-stack Next.js application connecting citizens with NGOs to report and manage stray dog sightings in their community. Includes both frontend and Express backend with complete authentication and real-time reporting system.

## Key Features

- **Citizen Reporting**: Easy-to-use form for reporting stray dog sightings with location, photo upload, and contact information
- **NGO Dashboard**: Professional dashboard for NGOs to view, filter, and manage all reports with real-time statistics
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing for both citizens and NGOs
- **Real-time Status Updates**: Track report progress through pending → in_progress → resolved workflow
- **Location Tracking**: GPS coordinates and detailed location descriptions for precise sighting records
- **Statistics Dashboard**: View total, pending, in-progress, and resolved report counts
- **Responsive Design**: Mobile-first design with Tailwind CSS v4 for all devices
- **Protected Routes**: Role-based access control (citizens vs NGOs)

## Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: JavaScript (JSX only, no TypeScript)
- **Styling**: Tailwind CSS v4 with pastel blue color scheme
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect)
- **Authentication**: JWT with localStorage persistence
- **HTTP Client**: Native Fetch API with centralized error handling

### Backend
- **Runtime**: Node.js with Express.js
- **Authentication**: JWT (jsonwebtoken) + bcrypt password hashing
- **Data Storage**: JSON file-based (easily upgradeable to PostgreSQL)
- **Middleware**: CORS, body parser, JWT verification
- **Error Handling**: Comprehensive validation and error responses

## Project Structure

\`\`\`
stray-shield/
├── app/                              # Next.js App Router pages
│   ├── page.jsx                      # Landing page with features
│   ├── login/page.jsx                # Login for citizens/NGOs
│   ├── signup/page.jsx               # Signup with role selection
│   ├── report/page.jsx               # Report submission form
│   ├── dashboard/page.jsx            # NGO dashboard with stats
│   ├── layout.tsx                    # Root layout
│   └── globals.css                   # Global styles with pastel colors
├── components/
│   ├── Navbar.jsx                    # Navigation with auth state
│   ├── ReportForm.jsx                # Report form with validation
│   ├── ReportCard.jsx                # Report display with status buttons
│   ├── ProtectedRoute.jsx            # Auth-protected route wrapper
│   ├── StrayShieldLogo.jsx           # Custom logo component
│   └── ui/                           # shadcn/ui components
├── config/
│   └── paths.js                      # Centralized routing & API endpoints
├── utils/
│   └── api.js                        # API client with helper functions
├── server/                           # Express backend
│   ├── index.js                      # Main server file (15+ endpoints)
│   ├── package.json                  # Backend dependencies
│   ├── .env.example                  # Environment variables template
│   └── data/                         # File-based storage directory
├── public/                           # Static assets
├── BACKEND_SETUP.md                  # Backend setup guide
├── DEPLOYMENT.md                     # Deployment instructions
└── README.md                         # This file
\`\`\`

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Git

### Frontend Setup

1. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Environment Configuration**
   Create `.env.local`:
   \`\`\`
   NEXT_PUBLIC_API_URL=http://localhost:3001
   \`\`\`

3. **Run Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`
   Frontend runs at `http://localhost:3000`

### Backend Setup

1. **Navigate to Backend**
   \`\`\`bash
   cd server
   \`\`\`

2. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Configuration**
   Create `.env`:
   \`\`\`
   PORT=3001
   JWT_SECRET=your-secret-key-change-in-production
   NODE_ENV=development
   \`\`\`

4. **Run Server**
   \`\`\`bash
   npm run dev
   \`\`\`
   Backend runs at `http://localhost:3001`

## Architecture

### Authentication Flow
1. User signs up at `/signup` with email, password, and user type
2. Backend hashes password with bcrypt (10 salt rounds)
3. JWT token generated with 7-day expiration
4. Token stored in localStorage on frontend
5. Token automatically injected in all API requests via `Authorization: Bearer` header
6. Backend validates token on protected routes
7. Logout clears token from localStorage

### Authorization Model
- **Citizens**: Can only view/edit their own reports
- **NGOs**: Can view all reports, update status, and contact citizens
- **Routes**: Protected by role checking in ProtectedRoute component

### API Integration
- Centralized `config/paths.js` defines all endpoints
- `utils/api.js` provides typed helper functions
- Automatic error handling with 401 redirect
- Request/response logging for debugging
- Form validation on frontend + backend

## Color Scheme

Updated to pastel blue theme for trustworthiness and accessibility:
- **Primary Blue**: #3b82f6 - Main actions and highlights
- **Secondary Green**: #22c55e - NGO/success actions
- **Soft Pastels**: Sage greens, light blues for backgrounds
- **Neutral**: Grays for secondary text and borders

## Database Schema

### Users
\`\`\`json
{
  "id": "timestamp",
  "email": "user@example.com",
  "password": "bcrypt-hash",
  "name": "John Doe",
  "phone": "+1234567890",
  "userType": "citizen|ngo",
  "organizationName": "optional for NGO",
  "registrationNumber": "optional for NGO",
  "address": "optional for NGO",
  "createdAt": "ISO timestamp"
}
\`\`\`

### Reports
\`\`\`json
{
  "id": "timestamp",
  "userId": "user-id",
  "location": "Central Park",
  "latitude": 40.7829,
  "longitude": -73.9654,
  "description": "Brown dog with white spots",
  "contactName": "John",
  "contactPhone": "+1234567890",
  "contactEmail": "john@example.com",
  "imageUrl": "url-to-image",
  "status": "pending|in_progress|resolved",
  "createdAt": "ISO timestamp",
  "updatedAt": "ISO timestamp"
}
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user (citizen or NGO)
- `POST /api/auth/login` - Login user with email and password

### Reports
- `POST /api/reports/create` - Create new report (requires auth)
- `GET /api/reports` - Get reports (query: `?status=pending|in_progress|resolved|all`)
- `GET /api/reports/:id` - Get specific report
- `PUT /api/reports/:id` - Update report status (NGO only)
- `DELETE /api/reports/:id` - Delete report (author only)

### User
- `GET /api/users/profile` - Get user profile (requires auth)

Uses Tailwind CSS v4 with custom color tokens:
- **Primary**:  Blue (#0000FF)
- **Background**: White/Dark depending on theme
- **Accent**: Blue for secondary actions

## Key Components

### ProtectedRoute
Wraps components requiring authentication. Verifies token and user type.

\`\`\`jsx
<ProtectedRoute userType="ngo">
  <Dashboard />
</ProtectedRoute>
\`\`\`

### ReportForm
Handles report submission with fields: location, description, image upload, coordinates, and contact info.

\`\`\`jsx
<ReportForm />
\`\`\`

### ReportCard
Displays individual report with status badges and update buttons.

\`\`\`jsx
<ReportCard report={report} onUpdateStatus={handleStatusChange} />
\`\`\`

### API Helper Functions
Centralized functions for all API operations:

\`\`\`jsx
import { createReport, getReports, updateReportStatus } from '@/utils/api';

const report = await createReport(data);
const reports = await getReports('pending');
await updateReportStatus(reportId, 'in_progress');
\`\`\`

## Dashboard Features

### Statistics Cards
- Total reports submitted
- Pending reports awaiting response
- In-progress rescue operations
- Resolved cases

### Report Filtering
Filter reports by status: All, Pending, In Progress, Resolved

### Report Grid
Displays all reports with:
- Report image
- Location and coordinates
- Status badge
- Description
- Contact information
- Status update buttons

### Loading & Error States
- Spinner during data fetching
- Empty state when no reports
- Error alerts with retry option
- Disabled states during updates

## User Workflows

### Citizen Journey
1. Click "Report a Stray" from landing page
2. Sign up as citizen with email and password
3. Fill report form with:
   - Location description
   - GPS coordinates (optional)
   - Description of dog
   - Photo (optional)
   - Contact information
4. Submit report
5. Report visible to all NGOs
6. Receive updates on report status

### NGO Journey
1. Click "Join as NGO" from landing page
2. Sign up with organization details:
   - Organization name
   - Registration number
   - Address
   - Email and password
3. Access NGO Dashboard
4. View all reports with statistics
5. Filter reports by status
6. Update report status as progress is made
7. Contact citizens via provided phone/email

## Security Features

- **Password Hashing**: Bcrypt with 10 salt rounds
- **JWT Authentication**: Stateless token-based auth
- **Authorization**: Role-based access control
- **CORS Protection**: Controlled cross-origin requests
- **Token Validation**: Every protected endpoint verifies JWT
- **Secure Storage**: Token in localStorage (frontend)
- **Input Validation**: Frontend and backend validation
- **HTTPS Ready**: Production deployment uses HTTPS

## Deployment

### Frontend (Vercel)
\`\`\`bash
npm run build
vercel deploy --prod
\`\`\`

### Backend (Railway/Render)
\`\`\`bash
cd server
git push
\`\`\`

See `DEPLOYMENT.md` for detailed deployment instructions.

## Future Enhancements

- Real-time notifications with WebSockets
- Google Maps integration for location visualization
- Cloud image storage (AWS S3/Cloudinary)
- Email notifications to NGOs
- Mobile app (React Native)
- Admin dashboard for platform management
- Advanced analytics and reporting
- Vaccination/rescue history tracking
- Database migration to PostgreSQL
- Rate limiting on API endpoints

## Troubleshooting

### API Connection Issues
- Verify backend is running on `localhost:3001`
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure CORS is enabled in backend

### Authentication Problems
- Clear browser localStorage and login again
- Check JWT_SECRET matches between frontend and backend
- Verify token hasn't expired (7 days)

### Data Not Loading
- Check browser DevTools Network tab
- Verify backend data files exist in `server/data/`
- Check console for error messages

## Contributing

Contributions welcome! Please:
- Use JSX for components
- Implement proper error handling
- Add loading states for async operations
- Test across mobile and desktop
- Follow existing code style

## License

MIT License - Feel free to use for your community projects

## Support

For issues:
1. Check documentation files (README.md, BACKEND_SETUP.md, DEPLOYMENT.md)
2. Review error messages in browser console and server logs
3. Verify environment variables are set correctly
4. Create GitHub issue with reproduction steps

---

**Made with ❤️ for animal welfare communities**

Current Version: 1.0.0
Last Updated: 2025
