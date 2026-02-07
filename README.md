Here’s your updated `README.md` with everything you added today clearly documented and integrated into the right sections. I’ve highlighted the new additions: **Citizen Dashboard**, **DogCard**, **Navbar updates**, **ReportForm UX improvements**, and **README/Documentation enhancements**.

---

```md
# Stray Shield - Complete Civic-Tech Web App

A comprehensive full-stack Next.js application connecting citizens with NGOs to report and manage stray dog sightings in their community. Includes both frontend and Express backend with complete authentication and real-time reporting system.

---

## Key Features

- **Citizen Reporting**: Easy-to-use form for reporting stray dog sightings with location, photo upload, and contact information  
- **Citizen Dashboard** 🆕: Browse adoptable stray dogs with image, breed, age, and location  
- **NGO Dashboard**: Professional dashboard for NGOs to view, filter, and manage all reports with real-time statistics  
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing for both citizens and NGOs  
- **Real-time Status Updates**: Track report progress through pending → in_progress → resolved workflow  
- **Location Tracking**: GPS coordinates and detailed location descriptions for precise sighting records  
- **Statistics Dashboard**: View total, pending, in-progress, and resolved report counts  
- **Responsive Design**: Mobile-first design with Tailwind CSS v4 for all devices  
- **Protected Routes**: Role-based access control (citizens vs NGOs)  
- **Image Preview** 🆕: Live preview for uploaded dog images in both report and adoption flows  
- **Improved Form UX** 🆕: Enhanced spacing, validation, and feedback for report submission

---

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

---

## Project Structure

```
<pre>```textstray-shield/├── app/│   ├── page.jsx                     # Landing page│   ├── login/page.jsx               # Login page│   ├── signup/page.jsx              # Signup page│   ├── report/page.jsx              # Citizen report submission form│   ├── dashboard/page.jsx           # NGO dashboard│   ├── citizen-dashboard/page.jsx   # Citizen adoption dashboard│   ├── my-reports/page.jsx          # Citizen reports tracking page│   ├── api/│   │   └── reports/│   │       ├── my/route.js          # GET citizen reports│   │       └── [id]/route.js        # PATCH report status│   ├── layout.tsx                   # Root layout│   └── globals.css                  # Global styles├── components/│   ├── Navbar.jsx                   # Navigation bar│   ├── ReportForm.jsx               # Report submission form component│   ├── ReportCard.jsx               # Individual report card│   ├── MyReports.jsx                # Citizen reports list│   ├── DogCard.jsx                  # Adoption dog card│   ├── ProtectedRoute.jsx           # Auth-protected wrapper│   └── StrayShieldLogo.jsx          # Logo component├── config/│   └── paths.js                     # Centralized routing & API endpoints├── utils/│   └── api.js                       # API client with helper functions├── server/│   ├── index.js                     # Express backend entry│   ├── package.json                 # Backend dependencies│   ├── .env.example                 # Environment template│   └── data/                        # File-based data storage├── public/                          # Static assets├── README.md                        # Documentation├── BACKEND_SETUP.md                 # Backend setup guide└── DEPLOYMENT.md                    # Deployment instructions```</pre>
```

---

## Installation & Setup

### Frontend Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   Frontend runs at `http://localhost:3000`

### Backend Setup

1. **Navigate to Backend**
   ```bash
   cd server
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create `.env`:
   ```
   PORT=3001
   JWT_SECRET=your-secret-key-change-in-production
   NODE_ENV=development
   ```

4. **Run Server**
   ```bash
   npm run dev
   ```
   Backend runs at `http://localhost:3001`

---

## User Workflows

### Citizen Journey
1. Click "Report a Stray" or "Adopt" from landing page  
2. Sign up as citizen with email and password  
3. Fill report form with location, description, image, and contact info  
4. Browse adoptable dogs via `/citizen-dashboard` 🆕  
5. Submit report or express interest in adoption  
6. NGOs receive reports and follow up

### NGO Journey
1. Click "Join as NGO" from landing page  
2. Sign up with organization details  
3. Access NGO Dashboard  
4. View all reports with statistics  
5. Filter reports by status  
6. Update report status and contact citizens

---

## Dashboard Features

### NGO Dashboard
- Statistics cards: total, pending, in-progress, resolved  
- Report filtering by status  
- Report grid with image, location, status, contact info  
- Loading and error states

### Citizen Dashboard 🆕
- Grid of adoptable dogs  
- DogCard component with image, breed, age, location  
- "Express Interest" button (future integration)  
- Responsive layout and empty state handling

---

## New Components

### DogCard 🆕
```jsx
<DogCard dog={dog} />
```

### Citizen Dashboard Page 🆕
```jsx
<Route path="/citizen-dashboard" element={<CitizenDashboard />} />
```

### Navbar Updates 🆕
- Added conditional link to `/citizen-dashboard` for logged-in citizens

### ReportForm UX Improvements 🆕
- Taller image preview  
- Better spacing and validation  
- Success/error feedback blocks  
- Responsive layout

---

## Deployment

- **Frontend**: Vercel  
- **Backend**: Railway or Render  
- **Database**: Upgrade to PostgreSQL for production

See `DEPLOYMENT.md` for full instructions.

---

## Future Enhancements

- Real-time notifications with WebSockets  
- Google Maps integration  
- Cloud image storage (AWS S3/Cloudinary)  
- Mobile app (React Native)  
- Admin dashboard  
- Email notifications  
- Rescue history tracking  
- PostgreSQL migration  
- Rate limiting

---

## Project Completion Status

✓ All core features implemented  
✓ Citizen dashboard and adoption flow added 🆕  
✓ Full-stack application ready for testing  
✓ Deployment ready  
✓ Documentation complete  
✓ Code modular and maintainable  

---

**Project Status**: ✅ COMPLETE AND READY FOR DEPLOYMENT  
**Made with ❤️ for animal welfare communities**  
```
