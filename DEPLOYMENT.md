# Stray Shield Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (for frontend)
- Render/Railway account (for backend)
- Node.js 18+ installed locally

## Frontend Deployment (Vercel)

### Option 1: Deploy via GitHub

1. Push your code to GitHub:
\`\`\`bash
git add .
git commit -m "Initial Stray Shield deployment"
git push origin main
\`\`\`

2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click "New Project" and select your repository
4. Configure environment variables:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL (e.g., `https://stray-shield-api.railway.app`)
5. Click "Deploy"

### Option 2: Deploy via CLI

\`\`\`bash
npm install -g vercel
vercel --prod
\`\`\`

## Backend Deployment (Railway/Render)

### Option 1: Deploy on Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Railway will detect the `server/` directory
5. Add environment variables:
   - `JWT_SECRET`: Generate a strong secret key
   - `NODE_ENV`: Set to `production`
   - `PORT`: Leave empty (Railway assigns automatically)
6. Deploy

### Option 2: Deploy on Render

1. Go to [render.com](https://render.com)
2. Create new "Web Service"
3. Connect GitHub repository
4. Configure:
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`
   - Environment: Add `JWT_SECRET` and `NODE_ENV=production`
5. Deploy

## Environment Variables

### Frontend (.env.production)
\`\`\`
NEXT_PUBLIC_API_URL=https://your-backend-url.com
\`\`\`

### Backend (.env)
\`\`\`
PORT=3001
JWT_SECRET=your-very-secure-random-string-min-32-chars
NODE_ENV=production
\`\`\`

Generate JWT_SECRET:
\`\`\`bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
\`\`\`

## Database Migration (For Production)

Currently using file-based storage. For production, migrate to PostgreSQL:

1. Create PostgreSQL database
2. Update \`server/index.js\` to use PostgreSQL client
3. Example with pg:

\`\`\`javascript
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
\`\`\`

## Monitoring & Debugging

### Frontend
- Vercel Dashboard: View logs and analytics
- Browser DevTools: Check network requests and console errors

### Backend
- Railway/Render: View live logs
- Set \`NODE_ENV=development\` temporarily to see verbose logs

## Custom Domain Setup

1. Go to your hosting provider's settings
2. Point domain to:
   - Vercel: Follow their CNAME instructions
   - Railway/Render: Add CNAME record
3. Wait for DNS propagation (5-30 minutes)

## Security Checklist

- [ ] JWT_SECRET is strong (32+ characters)
- [ ] API endpoints validate all inputs
- [ ] CORS is restricted to your frontend domain
- [ ] Database credentials are environment variables
- [ ] HTTPS is enabled on all URLs
- [ ] Sensitive data is not logged
- [ ] Rate limiting is implemented on API

## Troubleshooting Deployment

**API connection fails:**
- Verify \`NEXT_PUBLIC_API_URL\` is correct
- Check CORS settings in backend
- Ensure backend is running

**Authentication issues:**
- Verify \`JWT_SECRET\` matches between frontend and backend
- Clear browser cache and localStorage
- Check token expiration

**Database errors:**
- Verify connection string is correct
- Check database credentials
- Ensure database service is running

## Performance Optimization

### Frontend
- Enable Vercel caching
- Optimize images with Next.js Image component
- Use dynamic imports for code splitting

### Backend
- Add database indexing
- Implement API rate limiting
- Use caching for frequently accessed data
- Consider CDN for static assets

## Backup Strategy

1. Set up automated database backups
2. Store backups in cloud storage (AWS S3, etc.)
3. Test backup restoration regularly
4. Keep sensitive files out of version control

## Contact & Support

For deployment issues, refer to:
- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://railway.app/docs
- Render Docs: https://render.com/docs
