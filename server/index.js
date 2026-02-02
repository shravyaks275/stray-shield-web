// Mock users (temporary, before DB)
let mockUsers = [
  { id: 1, email: "citizen@example.com", password: "password123", userType: "citizen", name: "John Citizen" },
  { id: 2, email: "ngo@example.com", password: "password123", userType: "ngo", name: "Helping Hands NGO" },
];

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// JWT Middleware
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// Auth Endpoints
// app.post('/api/auth/signup', async (req, res) => {
//   try {
//     const { email, password, name, phone, userType, organizationName, registrationNumber, address } = req.body;

//     const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
//     if (userExists.rows.length > 0) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const result = await pool.query(
//       'INSERT INTO users (email, password, name, phone, user_type, organization_name, registration_number, address) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, email, user_type',
//       [email, hashedPassword, name, phone, userType, organizationName || null, registrationNumber || null, address || null]
//     );

//     const newUser = result.rows[0];
//     const token = jwt.sign({ id: newUser.id, email: newUser.email, userType: newUser.user_type }, JWT_SECRET, { expiresIn: '7d' });

//     res.json({
//       token,
//       userId: newUser.id,
//       userType: newUser.user_type,
//       message: 'Signup successful',
//     });
//   } catch (err) {
//     console.error('[v0] Signup error:', err);
//     res.status(500).json({ message: 'Signup failed', error: err.message });
//   }
// });

// app.post('/api/auth/login', async (req, res) => {
//   try {
//     const { email, password, userType } = req.body;

//     const result = await pool.query('SELECT * FROM users WHERE email = $1 AND user_type = $2', [email, userType]);
//     const user = result.rows[0];

//     if (!user) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const token = jwt.sign({ id: user.id, email: user.email, userType: user.user_type }, JWT_SECRET, { expiresIn: '7d' });

//     res.json({
//       token,
//       userId: user.id,
//       userType: user.user_type,
//       message: 'Login successful',
//     });
//   } catch (err) {
//     console.error('[v0] Login error:', err);
//     res.status(500).json({ message: 'Login failed', error: err.message });
//   }
// });

// signup Endpoints (Mock)
app.post('/api/auth/signup', (req, res) => {
  const { email, password, name, phone, userType } = req.body;

  // Check if user already exists
  const existingUser = mockUsers.find((u) => u.email === email && u.userType === userType);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists (mock)' });
  }

  const newUser = {
    id: mockUsers.length + 1,
    email,
    password, // ⚠️ plain text for now
    name,
    phone,
    userType,
  };

  mockUsers.push(newUser);

  const token = jwt.sign({ id: newUser.id, email: newUser.email, userType: newUser.userType }, JWT_SECRET, {
    expiresIn: '7d',
  });

  res.json({
    token,
    userId: newUser.id,
    userType: newUser.userType,
    message: 'Signup successful (mock)',
  });
});

// Login Endpoints (Mock)
app.post('/api/auth/login', (req, res) => {
  const { email, password, userType } = req.body;

  const user = mockUsers.find(
    (u) => u.email === email && u.password === password && u.userType === userType
  );

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials (mock)' });
  }

  const token = jwt.sign({ id: user.id, email: user.email, userType: user.userType }, JWT_SECRET, {
    expiresIn: '7d',
  });

  res.json({
    token,
    userId: user.id,
    userType: user.userType,
    message: 'Login successful (mock)',
  });
});


// Report Endpoints
// app.post('/api/reports/create', verifyToken, async (req, res) => {
//   try {
//     const { location, latitude, longitude, description, contactName, contactPhone, contactEmail, imageUrl } = req.body;

//     const result = await pool.query(
//       'INSERT INTO reports (user_id, location, latitude, longitude, description, contact_name, contact_phone, contact_email, image_url, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
//       [req.user.id, location, latitude || null, longitude || null, description, contactName, contactPhone, contactEmail, imageUrl || null, 'pending']
//     );

//     res.json({
//       message: 'Report created successfully',
//       report: result.rows[0],
//     });
//   } catch (err) {
//     console.error('[v0] Create report error:', err);
//     res.status(500).json({ message: 'Failed to create report', error: err.message });
//   }
// });

app.post('/api/reports/create', verifyToken, (req, res) => {
  const report = req.body;
  res.json({
    message: "Report created successfully (mock)",
    report: {
      id: Date.now(),
      user_id: req.user.id,
      ...report,
      status: "pending",
    },
  });
});

app.get('/api/reports', verifyToken, async (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM reports';
    const params = [];

    if (req.user.userType === 'citizen') {
      query += ' WHERE user_id = $1';
      params.push(req.user.id);
    }

    if (status && status !== 'all') {
      query += params.length > 0 ? ' AND status = $2' : ' WHERE status = $1';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);

    res.json({
      reports: result.rows,
    });
  } catch (err) {
    console.error('[v0] Fetch reports error:', err);
    res.status(500).json({ message: 'Failed to fetch reports', error: err.message });
  }
});

app.get('/api/reports/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('SELECT * FROM reports WHERE id = $1', [id]);
    const report = result.rows[0];

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    if (req.user.userType === 'citizen' && report.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json({ report });
  } catch (err) {
    console.error('[v0] Fetch report error:', err);
    res.status(500).json({ message: 'Failed to fetch report', error: err.message });
  }
});

app.put('/api/reports/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (req.user.userType !== 'ngo') {
      return res.status(403).json({ message: 'Only NGOs can update reports' });
    }

    const result = await pool.query(
      'UPDATE reports SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json({
      message: 'Report updated successfully',
      report: result.rows[0],
    });
  } catch (err) {
    console.error('[v0] Update report error:', err);
    res.status(500).json({ message: 'Failed to update report', error: err.message });
  }
});

app.delete('/api/reports/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const reportResult = await pool.query('SELECT * FROM reports WHERE id = $1', [id]);
    const report = reportResult.rows[0];

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    if (req.user.userType === 'citizen' && report.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await pool.query('DELETE FROM reports WHERE id = $1', [id]);

    res.json({ message: 'Report deleted successfully' });
  } catch (err) {
    console.error('[v0] Delete report error:', err);
    res.status(500).json({ message: 'Failed to delete report', error: err.message });
  }
});

// User Profile Endpoint
app.get('/api/users/profile', verifyToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, name, phone, user_type, organization_name, registration_number, address, created_at FROM users WHERE id = $1', [req.user.id]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (err) {
    console.error('[v0] Fetch profile error:', err);
    res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Stray Shield API is running' });
});

app.listen(PORT, () => {
  console.log(`Stray Shield API running on http://localhost:${PORT}`);
  console.log('Connected to PostgreSQL database');
});
