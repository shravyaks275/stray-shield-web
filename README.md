# Stray Shield - Civic-Tech Web App

A modern Next.js frontend for reporting stray dog sightings and managing community animal welfare initiatives through NGO coordination.

## Features

- **Citizen Reporting**: Easy-to-use form for reporting stray dog sightings with location, description, and images
- **NGO Dashboard**: Comprehensive dashboard for NGOs to manage and track reports
- **User Authentication**: Secure JWT-based authentication for citizens and NGOs
- **Real-time Status Updates**: Track report status from pending to resolved
- **Contact Management**: Direct contact information for report coordination
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 13+ with App Router
- **Language**: JavaScript (JSX only, no TypeScript)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Authentication**: JWT (localStorage)
- **State Management**: React Hooks (useState, useEffect)

## Project Structure

\`\`\`
├── app/
│   ├── page.jsx           # Landing page
│   ├── login/
│   │   └── page.jsx       # Login page
│   ├── signup/
│   │   └── page.jsx       # Signup page
│   ├── report/
│   │   └── page.jsx       # Report form page
│   ├── dashboard/
│   │   └── page.jsx       # NGO dashboard
│   └── layout.tsx         # Root layout
├── components/
│   ├── Navbar.jsx         # Navigation component
│   ├── ReportForm.jsx     # Report submission form
│   ├── ReportCard.jsx     # Report display card
│   └── ProtectedRoute.jsx # Route protection wrapper
├── utils/
│   └── api.js             # Centralized API calls
└── README.md
\`\`\`

## Installation

### Prerequisites
- Node.js 16+ and npm/yarn

### Setup Steps

1. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Environment Configuration**
   Create a \`.env.local\` file:
   \`\`\`
   NEXT_PUBLIC_API_URL=http://localhost:3001
   \`\`\`

3. **Run Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open in Browser**
   Navigate to \`http://localhost:3000\`

## Key Components

### ProtectedRoute
Wraps components that require authentication. Redirects unauthenticated users to login and verifies user type permissions.

\`\`\`jsx
<ProtectedRoute userType="ngo">
  <Dashboard />
</ProtectedRoute>
\`\`\`

### API Utility
Centralized API handler with automatic token injection and error handling.

\`\`\`jsx
import { apiCall } from '@/utils/api';

const data = await apiCall('/api/endpoint', {
  method: 'POST',
  body: JSON.stringify(payload)
});
\`\`\`

## Authentication Flow

1. User signs up at \`/signup\`
2. Backend returns JWT token
3. Token stored in localStorage
4. Included in all subsequent requests via \`Authorization\` header
5. Token validated by backend on protected endpoints
6. User logout clears token from localStorage

## Form Validation

- **Login/Signup**: Email format, password strength (min 8 chars), password match
- **Report Form**: Required fields validation, description length (min 10 chars)
- **NGO Details**: Organization name and registration validation

## Features Implementation

### Citizen Workflow
1. Sign up as citizen
2. Navigate to report page
3. Fill form with location, description, and image
4. Submit report
5. Receive confirmation

### NGO Workflow
1. Sign up as NGO with organization details
2. Access dashboard
3. View all pending reports
4. Update report status (pending → in_progress → resolved)
5. Contact citizens directly via provided contact info

## Styling

Uses Tailwind CSS v4 with custom color tokens:
- **Primary**: Orange (#F97316)
- **Background**: White/Dark depending on theme
- **Accent**: Blue for secondary actions

### CSS Variables
- \`--background\`: Page background
- \`--foreground\`: Primary text
- \`--card\`: Card backgrounds
- \`--border\`: Border colors
- \`--muted\`: Secondary backgrounds
- \`--muted-foreground\`: Secondary text

## Error Handling

- **Network Errors**: User-friendly error messages
- **Validation Errors**: Field-level feedback
- **Auth Errors**: Redirect to login
- **API Errors**: Toast notifications

## Loading States

- Form submission loading indicators
- Dashboard report fetching spinners
- Protected route loading states
- Button disabled states during operations

## API Endpoints (Expected Backend)

- \`POST /api/auth/signup\` - User registration
- \`POST /api/auth/login\` - User login
- \`POST /api/report\` - Submit new report
- \`GET /api/reports\` - Get reports (with status filter)
- \`PUT /api/reports/:id\` - Update report status
- \`POST /api/upload\` - Upload images

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimizations

- Image optimization with next/image
- Code splitting via dynamic imports
- Efficient state management with hooks
- CSS minification via Tailwind
- LocalStorage for token persistence

## Security Considerations

- JWT tokens for authentication
- Secure token storage (localStorage)
- HTTPS in production
- Input validation on frontend
- Route protection for sensitive pages
- CSRF protection via same-origin requests

## Future Enhancements

- Real-time notifications via WebSocket
- Map integration for location visualization
- Photo gallery for reports
- Export reports as PDF
- Admin panel for system management
- Email notifications
- Mobile app version
- Analytics dashboard

## Contributing

Contributions are welcome! Please follow these guidelines:
- Use JSX components for reusability
- Implement proper error handling
- Add loading states for async operations
- Write clear, readable code
- Test across different screen sizes

## License

MIT License - feel free to use for your community projects

## Support

For issues or questions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include steps to reproduce bugs
4. Provide browser and OS information

---

Built with ❤️ for animal welfare communities
\`\`\`
