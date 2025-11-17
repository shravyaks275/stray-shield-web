const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Data storage (file-based for simplicity)
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const usersFile = path.join(dataDir, 'users.json');
const reportsFile = path.join(dataDir, 'reports.json');

// Initialize data files
function initializeData() {
  if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, JSON.stringify([]));
  }
  if (!fs.existsSync(reportsFile)) {
    fs.writeFileSync(reportsFile, JSON.stringify([]));
  }
}

function getUsers() {
  return JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
}

function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

function getReports() {
  return JSON.parse(fs.readFileSync(reportsFile, 'utf-8'));
}

function saveReports(reports) {
  fs.writeFileSync(reportsFile, JSON.stringify(reports, null, 2));
}

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
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, name, phone, userType, organizationName, registrationNumber, address } = req.body;
    const users = getUsers();

    // Check if user exists
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      name,
      phone,
      userType,
      organizationName: userType === 'ngo' ? organizationName : null,
      registrationNumber: userType === 'ngo' ? registrationNumber : null,
      address: userType === 'ngo' ? address : null,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    const token = jwt.sign({ id: newUser.id, email, userType }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      userId: newUser.id,
      userType,
      message: 'Signup successful',
    });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, userType } = req.body;
    const users = getUsers();

    const user = users.find(u => u.email === email && u.userType === userType);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email, userType }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      userId: user.id,
      userType,
      message: 'Login successful',
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

// Report Endpoints
app.post('/api/reports/create', verifyToken, (req, res) => {
  try {
    const { location, latitude, longitude, description, contactName, contactPhone, contactEmail, imageUrl } = req.body;
    const reports = getReports();

    const newReport = {
      id: Date.now().toString(),
      userId: req.user.id,
      location,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      description,
      contactName,
      contactPhone,
      contactEmail,
      imageUrl: imageUrl || null,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    reports.push(newReport);
    saveReports(reports);

    res.json({
      message: 'Report created successfully',
      report: newReport,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create report', error: err.message });
  }
});

app.get('/api/reports', verifyToken, (req, res) => {
  try {
    const { status } = req.query;
    let reports = getReports();

    // Filter by status if provided
    if (status && status !== 'all') {
      reports = reports.filter(r => r.status === status);
    }

    // NGOs see all reports, citizens see only their own
    if (req.user.userType === 'citizen') {
      reports = reports.filter(r => r.userId === req.user.id);
    }

    res.json({
      reports: reports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reports', error: err.message });
  }
});

app.get('/api/reports/:id', verifyToken, (req, res) => {
  try {
    const { id } = req.params;
    const reports = getReports();
    const report = reports.find(r => r.id === id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check authorization
    if (req.user.userType === 'citizen' && report.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json({ report });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch report', error: err.message });
  }
});

app.put('/api/reports/:id', verifyToken, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const reports = getReports();
    const reportIndex = reports.findIndex(r => r.id === id);

    if (reportIndex === -1) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Only NGOs can update report status
    if (req.user.userType !== 'ngo') {
      return res.status(403).json({ message: 'Only NGOs can update reports' });
    }

    reports[reportIndex].status = status;
    reports[reportIndex].updatedAt = new Date().toISOString();
    saveReports(reports);

    res.json({
      message: 'Report updated successfully',
      report: reports[reportIndex],
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update report', error: err.message });
  }
});

app.delete('/api/reports/:id', verifyToken, (req, res) => {
  try {
    const { id } = req.params;
    let reports = getReports();
    const report = reports.find(r => r.id === id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Citizens can only delete their own reports
    if (req.user.userType === 'citizen' && report.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    reports = reports.filter(r => r.id !== id);
    saveReports(reports);

    res.json({ message: 'Report deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete report', error: err.message });
  }
});

// User Profile Endpoint
app.get('/api/users/profile', verifyToken, (req, res) => {
  try {
    const users = getUsers();
    const user = users.find(u => u.id === req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Don't send password
    const { password, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Stray Shield API is running' });
});

// Initialize data and start server
initializeData();
app.listen(PORT, () => {
  console.log(`Stray Shield API running on http://localhost:${PORT}`);
});
