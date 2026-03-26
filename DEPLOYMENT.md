# Stray Shield Deployment Guide

Complete guide for deploying the Stray Shield application to production environments with security, performance, and reliability best practices.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Frontend Deployment](#frontend-deployment)
4. [Backend Deployment](#backend-deployment)
5. [Database Deployment](#database-deployment)
6. [Environment Configuration](#environment-configuration)
7. [Domain & SSL Setup](#domain--ssl-setup)
8. [Monitoring & Logging](#monitoring--logging)
9. [Performance Optimization](#performance-optimization)
10. [Security Hardening](#security-hardening)
11. [Post-Deployment Tasks](#post-deployment-tasks)
12. [Troubleshooting](#troubleshooting)
13. [Scaling Strategy](#scaling-strategy)
14. [Disaster Recovery](#disaster-recovery)

---

## Prerequisites

### Required Accounts

- [x] GitHub account (source code)
- [x] Vercel account (frontend hosting)
- [x] Railway/Render account (backend hosting)
- [x] Domain registrar account (custom domain)
- [x] SSL certificate provider (optional, usually free)

### Required Tools

```bash
# Verify installations
node --version          # v18+ recommended
npm --version          # v9+
git --version          # v2.30+
psql --version         # PostgreSQL client (optional)
```

### Development Environment

```bash
# Clone repository
git clone https://github.com/shravyaks275/stray-shield-web.git
cd stray-shield-web

# Install dependencies
npm install
cd server && npm install && cd ..

# Verify everything works locally
npm run dev              # Terminal 1
cd server && npm run dev # Terminal 2
```

---

## Pre-Deployment Checklist

### Code Quality

- [ ] All tests passing
- [ ] No console.log() in production code
- [ ] No hardcoded credentials or API keys
- [ ] Code review completed
- [ ] Dependencies updated (`npm audit` passes)
- [ ] No security vulnerabilities
- [ ] Error handling implemented
- [ ] Logging configured

### Configuration

- [ ] Environment variables documented
- [ ] .env.example created with all required variables
- [ ] Database schema finalized
- [ ] API endpoints tested
- [ ] CORS configured correctly
- [ ] Rate limiting configured
- [ ] Database backups tested

### Security

- [ ] JWT_SECRET changed to production value
- [ ] Database password is strong (32+ characters)
- [ ] HTTPS enabled everywhere
- [ ] CORS restricted to frontend domain
- [ ] SQL injection prevention verified
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented
- [ ] Security headers configured

### Performance

- [ ] Frontend bundle optimized (<500KB gzipped)
- [ ] Images optimized and compressed
- [ ] Database indexes created
- [ ] Caching configured
- [ ] CDN configured (if applicable)
- [ ] Load testing completed
- [ ] Response times acceptable (<200ms)

### Documentation

- [ ] README.md updated
- [ ] DEPLOYMENT.md complete
- [ ] API documentation up-to-date
- [ ] Environment variables documented
- [ ] Runbooks created for common tasks
- [ ] Incident response plan ready

### Testing

- [ ] Manual testing completed
- [ ] Cross-browser testing done
- [ ] Mobile responsive verified
- [ ] Load testing performed
- [ ] Staging environment tested
- [ ] Rollback procedure tested

---

## Frontend Deployment

### Option 1: Vercel (GitHub Integration)

#### Step 1: Push Code to GitHub

```bash
# Ensure all changes are committed
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

#### Step 2: Connect to Vercel

1. Go to https://vercel.com
2. Click "New Project"
3. Select "Import Git Repository"
4. Choose your GitHub repository
5. Click "Import"

#### Step 3: Configure Project Settings

**Project Name:**
```
stray-shield-web
```

**Framework Preset:**
```
Next.js
```

**Root Directory:**
```
./
```

**Build Command:**
```
npm run build
```

**Install Command:**
```
npm install
```

**Output Directory:**
```
.next
```

#### Step 4: Set Environment Variables

Click "Environment Variables" and add:

```env
NEXT_PUBLIC_API_URL=https://api.strayhield.com
NEXT_PUBLIC_APP_NAME=Stray Shield
NEXT_PUBLIC_VERSION=1.0.0
NEXT_PUBLIC_GA_ID=UA-XXXXX-X (optional)
```

#### Step 5: Deploy

1. Click "Deploy"
2. Wait for deployment to complete (usually 2-5 minutes)
3. Verify production URL works
4. Test all features

**Deployment URL:**
```
https://stray-shield-web.vercel.app
```

#### Step 6: Enable Auto-Deployments

**Configure automatic deployments on push:**

1. Go to Project Settings
2. Click "Git"
3. Enable "Deploy on push to main"

**Set up preview deployments:**

1. Every pull request gets a preview URL
2. Share URL for team testing
3. Automatic deletion after merge

### Option 2: Vercel (CLI Deployment)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Set environment variables
vercel env add NEXT_PUBLIC_API_URL
vercel env add NEXT_PUBLIC_APP_NAME

# Check deployment status
vercel list
```

### Option 3: Traditional Hosting (AWS, GCP, Azure)

#### Build for Production

```bash
# Build Next.js application
npm run build

# Test production build locally
npm run build
npm start

# Visit http://localhost:3000
```

#### Deploy to AWS S3 + CloudFront

```bash
# Export static site
npm run export

# Upload to S3
aws s3 sync out/ s3://your-bucket-name

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

#### Deploy to Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create Heroku app
heroku create stray-shield-web

# Set environment variables
heroku config:set NEXT_PUBLIC_API_URL=https://stray-shield-api.herokuapp.com

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

---

## Backend Deployment

### Option 1: Railway (Recommended)

#### Step 1: Connect GitHub Repository

1. Go to https://railway.app
2. Click "New Project"
3. Click "Deploy from GitHub"
4. Authorize Railway with GitHub
5. Select your repository

#### Step 2: Configure Application

```yaml
# railway.toml (if needed)
[build]
builder = "nixpacks"

[deploy]
startCommand = "npm start"
healthcheckPath = "/api/health"
healthcheckTimeout = 30
```

#### Step 3: Add Environment Variables

Go to Project Settings → Environment and add:

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=your-very-long-secure-random-key-32-chars-minimum
JWT_EXPIRY=86400
CORS_ORIGIN=https://yourdomain.com
LOG_LEVEL=info
DATABASE_TYPE=postgres
```

#### Step 4: Add PostgreSQL Database

1. Click "Add Service"
2. Select "PostgreSQL"
3. Click "Add"
4. Copy `DATABASE_URL` from newly created service
5. Paste into environment variables

#### Step 5: Deploy

1. Click "Deploy"
2. Wait for deployment to complete
3. Check logs for any errors
4. Test API endpoints

**Production API URL:**
```
https://stray-shield-api.railway.app
```

### Option 2: Render

#### Step 1: Create Web Service

1. Go to https://render.com
2. Click "New"
3. Select "Web Service"
4. Connect GitHub account
5. Select repository

#### Step 2: Configure Build Settings

**Name:**
```
stray-shield-api
```

**Environment:**
```
Node
```

**Build Command:**
```
cd server && npm install
```

**Start Command:**
```
cd server && npm start
```

#### Step 3: Add PostgreSQL Database

1. Click "New"
2. Select "PostgreSQL"
3. Set database name: `stray_shield`
4. Note connection string
5. Add to environment variables

#### Step 4: Set Environment Variables

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=your-very-long-secure-random-key-32-chars-minimum
CORS_ORIGIN=https://yourdomain.com
LOG_LEVEL=info
DATABASE_URL=postgresql://user:password@hostname:5432/stray_shield
```

#### Step 5: Deploy

1. Click "Create Web Service"
2. Wait for deployment
3. Monitor logs
4. Test endpoints

### Option 3: Heroku

```bash
# Create Heroku app
heroku create stray-shield-api

# Add Heroku Postgres
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret-key-here
heroku config:set CORS_ORIGIN=https://yourdomain.com

# Deploy from Git
git push heroku main

# View logs
heroku logs --tail

# Get app URL
heroku apps:info stray-shield-api
```

### Option 4: DigitalOcean App Platform

```bash
# Create app.yaml in root directory
# Deploy via DigitalOcean dashboard
# Connect GitHub repo and deploy
```

---

## Database Deployment

### PostgreSQL on Railway/Render

**Automatic setup** (created when adding PostgreSQL service)

**Connection details automatically added:**
```env
DATABASE_URL=postgresql://user:password@host:port/database
```

### PostgreSQL on AWS RDS

#### Step 1: Create RDS Instance

```bash
# Using AWS CLI
aws rds create-db-instance \
  --db-instance-identifier stray-shield-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username postgres \
  --master-user-password 'YourSecurePassword123!' \
  --allocated-storage 20
```

#### Step 2: Configure Security Group

```bash
# Allow connections from backend server
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxx \
  --protocol tcp \
  --port 5432 \
  --cidr 10.0.0.0/8
```

#### Step 3: Create Database

```bash
# Connect to RDS
psql -h your-rds-endpoint.amazonaws.com \
     -U postgres \
     -d postgres

# Create database
CREATE DATABASE stray_shield;

# Create user
CREATE USER stray_user WITH PASSWORD 'SecurePassword123!';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE stray_shield TO stray_user;
```

#### Step 4: Update Connection String

```env
DATABASE_URL=postgresql://stray_user:SecurePassword123!@your-rds-endpoint.amazonaws.com:5432/stray_shield
```

### Initialize Database

```bash
# Connect to production database
psql $DATABASE_URL

# Create schema
\i schema.sql

# Verify tables
\dt

# Exit
\q
```

---

## Environment Configuration

### Frontend Environment Variables (.env.production)

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.strayhield.com
NEXT_PUBLIC_API_TIMEOUT=30000

# Application Info
NEXT_PUBLIC_APP_NAME=Stray Shield
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_ENVIRONMENT=production

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=UA-XXXXX-X
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_ERROR_TRACKING=true
```

### Backend Environment Variables (.env production)

```env
# Server Configuration
NODE_ENV=production
PORT=3000
LOG_LEVEL=info

# Security
JWT_SECRET=your-very-long-secure-random-key-at-least-32-chars
JWT_EXPIRY=86400

# CORS
CORS_ORIGIN=https://yourdomain.com
CORS_CREDENTIALS=true

# Database
DATABASE_TYPE=postgres
DATABASE_URL=postgresql://user:password@host:5432/stray_shield
DB_POOL_MIN=5
DB_POOL_MAX=20
DB_IDLE_TIMEOUT=10000
DB_CONNECTION_TIMEOUT=2000

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Cloud Storage (Optional)
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
AWS_BUCKET_NAME=stray-shield-uploads
AWS_REGION=us-east-1

# Monitoring
SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
```

### Secure Environment Variable Management

**Best Practices:**

```bash
# 1. Never commit .env files
echo ".env" >> .gitignore
echo ".env.production" >> .gitignore

# 2. Use hosting provider's environment variable manager
# Railway: Project Settings → Variables
# Render: Environment tab
# Heroku: heroku config:set KEY=value

# 3. Rotate secrets regularly
# Update JWT_SECRET quarterly
# Rotate database passwords semi-annually

# 4. Use secret management services
# AWS Secrets Manager
# HashiCorp Vault
# 1Password Business
```

---

## Domain & SSL Setup

### Configure Custom Domain

#### For Vercel

1. Go to Project Settings → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., `app.strayhield.com`)
4. Add DNS records:
   ```
   Type: CNAME
   Name: app
   Value: cname.vercel-dns.com
   ```
5. Wait for verification (usually 5-30 minutes)

#### For Railway/Render

1. Go to Project Settings → Custom Domain
2. Enter domain name
3. Add DNS record pointing to service
4. SSL certificate auto-generated (Let's Encrypt)

#### For Self-Hosted

```bash
# Update DNS records at registrar
# A record pointing to server IP
# Or CNAME record pointing to hosting provider

# Verify DNS propagation
dig yourdomain.com
nslookup yourdomain.com
```

### SSL/TLS Certificate Setup

#### Automatic (Vercel, Railway, Render)

- SSL certificates automatically generated
- Auto-renewed before expiration
- HTTPS enforced by default

#### Manual (Self-Hosted)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Auto-renew
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Check renewal
sudo certbot renew --dry-run
```

#### Certificate Configuration (Nginx Example)

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## Monitoring & Logging

### Frontend Monitoring (Vercel)

**Built-in Analytics:**
```
Project Settings → Analytics
- Page views
- Response times
- Error rates
- Audience insights
```

**Custom Monitoring with Sentry:**

```bash
# Install Sentry SDK
npm install @sentry/nextjs

# Configure in next.config.js
const withSentry = require('@sentry/nextjs/withSentry');

module.exports = withSentry({
  // ... your Next.js config
});
```

**Set environment variable:**
```env
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
```

### Backend Monitoring

#### Sentry Error Tracking

```bash
# Install Sentry
npm install @sentry/node

# Configure in server/index.js
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

#### Application Performance Monitoring (APM)

**Using New Relic:**

```bash
# Install New Relic
npm install newrelic

# Create newrelic.js
cp node_modules/newrelic/newrelic.js ./

# Set environment variables
NEW_RELIC_APP_NAME=Stray Shield API
NEW_RELIC_LICENSE_KEY=your-license-key
```

#### Logging Configuration

```javascript
// server/logger.js
const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = {
  info: (message, data) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] INFO: ${message} ${JSON.stringify(data || '')}`;
    console.log(logEntry);
    fs.appendFileSync(path.join(logDir, 'app.log'), logEntry + '\n');
  },
  
  error: (message, error) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ERROR: ${message} ${error.message}`;
    console.error(logEntry);
    fs.appendFileSync(path.join(logDir, 'error.log'), logEntry + '\n');
  },
  
  warn: (message, data) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] WARN: ${message} ${JSON.stringify(data || '')}`;
    console.warn(logEntry);
    fs.appendFileSync(path.join(logDir, 'app.log'), logEntry + '\n');
  }
};

module.exports = logger;
```

### Database Monitoring

**PostgreSQL Query Monitoring:**

```sql
-- Enable query logging
ALTER SYSTEM SET log_statement = 'all';
ALTER SYSTEM SET log_min_duration_statement = 1000;

-- Reload configuration
SELECT pg_reload_conf();

-- Check logs
tail -f /var/log/postgresql/postgresql.log
```

**Railway/Render Database Monitoring:**

- Built-in dashboards showing query times
- Connection count monitoring
- Disk usage alerts

---

## Performance Optimization

### Frontend Optimization

#### Image Optimization

```javascript
// Use Next.js Image component
import Image from 'next/image';

export default function DogCard({ dog }) {
  return (
    <Image
      src={dog.imageUrl}
      alt={dog.name}
      width={300}
      height={300}
      priority={false}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}
```

#### Code Splitting

```javascript
import dynamic from 'next/dynamic';

const AdoptionDashboard = dynamic(
  () => import('@/components/AdoptionDashboard'),
  { loading: () => <p>Loading...</p> }
);
```

#### Caching Strategy

```javascript
// next.config.js
module.exports = {
  headers: async () => {
    return [
      {
        source: '/api/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-cache' },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};
```

#### Bundle Analysis

```bash
# Install bundle analyzer
npm install --save-dev @next/bundle-analyzer

# Check bundle size
ANALYZE=true npm run build
```

### Backend Optimization

#### Response Caching

```javascript
// Cache API responses
const cacheMiddleware = (req, res, next) => {
  res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
  next();
};

app.get('/api/reports', cacheMiddleware, (req, res) => {
  // handler
});
```

#### Database Query Optimization

```sql
-- Add indexes
CREATE INDEX idx_reports_status_created ON reports(status, created_at DESC);
CREATE INDEX idx_users_email ON users(email);

-- Analyze query plans
EXPLAIN ANALYZE SELECT * FROM reports WHERE status = 'pending';
```

#### Compression

```javascript
// Enable gzip compression
const compression = require('compression');
app.use(compression());
```

### CDN Configuration

**Vercel CDN** (automatic for frontend)
- Global edge network
- Automatic cache invalidation
- DDoS protection included

**AWS CloudFront** (if self-hosted)

```bash
# Create CloudFront distribution
aws cloudfront create-distribution \
  --origin-domain-name your-bucket.s3.amazonaws.com \
  --default-root-object index.html
```

---

## Security Hardening

### HTTPS/SSL Enforcement

```javascript
// Redirect HTTP to HTTPS
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  } else {
    next();
  }
});
```

### Security Headers

```javascript
// Add security headers
app.use((req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // HSTS - Force HTTPS for 1 year
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  // Content Security Policy
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  
  // Disable referrer
  res.setHeader('Referrer-Policy', 'no-referrer');
  
  next();
});
```

### CORS Security

```javascript
const cors = require('cors');

const corsOptions = {
  origin: process.env.CORS_ORIGIN, // https://yourdomain.com
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));
```

### Rate Limiting

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later'
});

// Apply to all requests
app.use(limiter);

// Apply stricter limit to auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 attempts per 15 minutes
  skipSuccessfulRequests: true
});

app.post('/api/auth/login', authLimiter, (req, res) => {
  // handler
});
```

### Input Validation & Sanitization

```javascript
const { body, validationResult } = require('express-validator');

app.post('/api/reports/create', [
  body('location').trim().notEmpty().isLength({ min: 5, max: 255 }),
  body('description').trim().notEmpty().isLength({ min: 10, max: 1000 }),
  body('contactEmail').isEmail().normalizeEmail(),
  body('latitude').isDecimal(),
  body('longitude').isDecimal(),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Process validated data
});
```

### SQL Injection Prevention

```javascript
// Good ✅ - Using parameterized queries
db.query('SELECT * FROM users WHERE email = $1', [email]);

// Bad ❌ - String interpolation
db.query(`SELECT * FROM users WHERE email = '${email}'`);
```

### XSS Prevention

```javascript
// Sanitize output
const sanitizeHtml = require('sanitize-html');

const clean = sanitizeHtml(userInput, {
  allowedTags: ['b', 'i', 'em', 'strong'],
  allowedAttributes: {}
});
```

---

## Post-Deployment Tasks

### Immediate Tasks (First Hour)

- [ ] Test production URLs in browser
- [ ] Verify SSL certificate is valid
- [ ] Test authentication flow
- [ ] Create test report
- [ ] Check all API endpoints
- [ ] Monitor error logs
- [ ] Test mobile responsiveness
- [ ] Verify database connectivity

### Day 1 Tasks

- [ ] Monitor application performance
- [ ] Review error tracking (Sentry)
- [ ] Check analytics dashboard
- [ ] Test backup procedures
- [ ] Monitor server resources
- [ ] Update status page
- [ ] Notify stakeholders
- [ ] Document deployment

### Week 1 Tasks

- [ ] Collect user feedback
- [ ] Analyze usage metrics
- [ ] Review slow queries
- [ ] Optimize based on findings
- [ ] Set up monitoring alerts
- [ ] Create runbooks
- [ ] Schedule team training
- [ ] Plan next improvements

### Ongoing Tasks

- [ ] Monitor application daily
- [ ] Review logs weekly
- [ ] Backup database daily
- [ ] Update dependencies monthly
- [ ] Security audit quarterly
- [ ] Performance review monthly
- [ ] Capacity planning

---

## Troubleshooting

### Frontend Issues

**Issue: Build Fails**

```bash
# Clear cache
rm -rf .next

# Reinstall dependencies
npm install

# Try building again
npm run build

# Check for TypeScript errors
npm run type-check
```

**Issue: Blank Page / 404**

```bash
# Verify NEXT_PUBLIC_API_URL is correct
# Check browser console for errors
# Verify backend is running
# Check CORS settings
```

**Issue: Slow Performance**

```bash
# Run Lighthouse audit
# Analyze bundle: ANALYZE=true npm run build
# Check Network tab in DevTools
# Optimize images
# Enable caching headers
```

### Backend Issues

**Issue: 502 Bad Gateway**

```bash
# Check if application crashed
# Review error logs
# Check database connection
# Verify environment variables
# Check resource limits (memory, CPU)

# Railway/Render logs
# Check deployment logs tab
# Monitor resource usage
```

**Issue: Database Connection Timeout**

```bash
# Verify DATABASE_URL is correct
# Check database is running
# Verify security group rules
# Check connection pool settings
# Increase timeout value

# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

**Issue: High Memory Usage**

```bash
# Check for memory leaks
# Review error logs for repeated errors
# Monitor response times
# Increase server memory
# Restart application

# Verify with command
ps aux | grep node
```

**Issue: Authentication Failing**

```bash
# Verify JWT_SECRET matches frontend
# Check token expiration
# Verify email/password combination
# Check database has user data
# Review auth logs
```

### Database Issues

**Issue: Out of Disk Space**

```bash
# Check disk usage
df -h

# Vacuum database
psql $DATABASE_URL -c "VACUUM FULL ANALYZE;"

# Delete old backups
rm old_backups/*.sql.gz

# Archive old data if needed
# Increase storage quota
```

**Issue: Slow Queries**

```bash
# Enable slow query logging
# Analyze query plans
# Add missing indexes
# Optimize queries
# Check table statistics

psql $DATABASE_URL -c "ANALYZE users; ANALYZE reports;"
```

---

## Scaling Strategy

### Phase 1: MVP (Current - 100-1000 users)

**Infrastructure:**
- Single frontend instance (Vercel)
- Single backend instance
- Single PostgreSQL instance

**Metrics to monitor:**
- Response time: <200ms
- Error rate: <0.1%
- Uptime: 99.5%
- Database queries: <100ms

**Cost:** ~$50-100/month

### Phase 2: Growth (1000-10000 users)

**Infrastructure:**
- Multiple backend instances (load balanced)
- PostgreSQL read replicas
- Redis caching layer
- CDN for static assets

**Improvements:**
- Add caching for API responses
- Database read replicas
- Background job processing
- Image optimization

**Cost:** ~$200-500/month

### Phase 3: Enterprise (10000+ users)

**Infrastructure:**
- Kubernetes for orchestration
- Multi-region deployment
- Database sharding
- Message queue (RabbitMQ/Kafka)
- Elasticsearch for search

**Improvements:**
- Auto-scaling
- Advanced monitoring
- Disaster recovery
- Multi-region failover

**Cost:** $1000+/month

### Load Testing

```bash
# Install Apache Bench
brew install httpd

# Test API performance
ab -n 1000 -c 10 https://api.strayhield.com/api/health

# Results:
# - Requests per second
# - Average response time
# - Failed requests

# Results interpretation:
# - Should handle 100+ req/sec
# - Average response <200ms
# - <1% failed requests
```

---

## Disaster Recovery

### Backup Strategy

**Daily backups:**
```bash
# PostgreSQL automated backup
# Kept for 30 days
# Stored in multiple locations

# Local: Railway/Render automatic backups
# Cloud: AWS S3 backup
# Offsite: Encrypted backup service
```

**Backup verification:**
```bash
# Weekly restoration tests
# Test to staging environment
# Verify data integrity
# Document recovery time
```

### Failover Procedure

**Database failure:**

1. Detect failure (automated alerts)
2. Promote read replica to primary (if available)
3. Update connection string
4. Verify data integrity
5. Resume operations

**Backend failure:**

1. Application crashes
2. PaaS provider (Railway/Render) auto-restarts
3. If persistent, deploy to new instance
4. Update load balancer
5. Route traffic to healthy instance

**Frontend failure:**

1. Vercel maintains multiple edge instances
2. Automatic failover to healthy instance
3. Manual rebuild if needed:
   ```bash
   vercel --prod
   ```

### Recovery Time Objectives (RTO)

| Component | RTO | Notes |
|-----------|-----|-------|
| Frontend | 5 min | Vercel auto-recovery |
| Backend | 10 min | PaaS auto-restart |
| Database | 1 hour | Restore from backup |
| Full system | 2 hours | Complete recovery |

### Incident Response

**Detection:**
```
- Automated alerts via email/SMS
- Error rate > 1%
- Response time > 5 seconds
- Database unavailable
```

**Response:**
```
1. Acknowledge incident
2. Investigate logs
3. Implement fix or rollback
4. Verify recovery
5. Document incident
6. Post-mortem analysis
```

**Communication:**
```
- Update status page immediately
- Notify stakeholders
- Send root cause analysis
- Schedule team review
```

---

## Monitoring Dashboard

### Key Metrics to Track

**Frontend:**
- Page load time
- Error rate
- User engagement
- Conversion rate
- Mobile vs desktop split

**Backend:**
- Request latency (p50, p95, p99)
- Error rate by endpoint
- Database query time
- Memory usage
- CPU usage

**Database:**
- Query count
- Slow queries (>1s)
- Connection count
- Disk usage
- Cache hit ratio

**Business:**
- Active users
- Reports created
- Adoptions matched
- NGO response time

### Sample Monitoring Query

```sql
-- Daily metrics report
SELECT 
  DATE(created_at) as date,
  COUNT(*) as reports_created,
  COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
  AVG(EXTRACT(EPOCH FROM (updated_at - created_at))::int) as avg_resolution_time_seconds
FROM reports
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

---

## Rollback Procedure

### Frontend Rollback (Vercel)

```bash
# View deployment history
vercel --prod list

# Rollback to previous version
vercel rollback

# Or redeploy specific commit
git checkout <commit-hash>
git push origin main
```

### Backend Rollback

```bash
# Railway: Revert to previous deployment
# Render: Redeploy from previous build

# Or via git
git revert <commit-hash>
git push origin main
```

### Database Rollback

```bash
# Restore from backup
psql $DATABASE_URL < backup_before_change.sql

# Or point-in-time recovery (if supported)
# AWS RDS: Use Restore to Point in Time
# Railway: Use automated backups
```

---

## Production Checklist

### Deployment Day

- [ ] Code review completed
- [ ] Tests passing
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] Backups verified
- [ ] Monitoring configured
- [ ] Status page updated
- [ ] Team on standby

### Week Before

- [ ] Prepare deployment plan
- [ ] Test in staging
- [ ] Brief team on changes
- [ ] Plan communication
- [ ] Prepare rollback plan
- [ ] Get stakeholder approval

### Post-Deployment Week

- [ ] Monitor closely
- [ ] Be ready to rollback
- [ ] Collect user feedback
- [ ] Review error logs
- [ ] Document lessons learned
- [ ] Plan optimizations

---

## Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| Page load time | <2s | - |
| API response time | <200ms | - |
| Error rate | <0.5% | - |
| Availability | 99.9% | - |
| Database uptime | 99.95% | - |

---

## Cost Estimation (Monthly)

| Service | Cost | Notes |
|---------|------|-------|
| Vercel (Frontend) | $20 | Pro plan |
| Railway (Backend) | $50-100 | Based on usage |
| PostgreSQL | $30-50 | Depends on size |
| Domain | $10-15 | Annual cost |
| **Total** | **$110-185** | Estimated |

---

## Additional Resources

### Documentation
- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://railway.app/docs)
- [Render Docs](https://render.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

### Tools
- [StatusPage.io](https://www.statuspage.io) - Status pages
- [Sentry](https://sentry.io) - Error tracking
- [New Relic](https://newrelic.com) - APM
- [DataDog](https://www.datadoghq.com) - Monitoring

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-03-26 | Initial deployment guide |
| 0.9.0 | 2026-03-20 | Beta deployment guide |

---

**Last Updated**: 2026-03-26  
**Maintained by**: Stray Shield Team  
**Status**: Production Ready ✅

For issues or questions, visit the [GitHub repository](https://github.com/shravyaks275/stray-shield-web)


---
