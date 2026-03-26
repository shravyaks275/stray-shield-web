// ================= ORIGINAL CODE =================

// Mock users (temporary, before DB)
let mockUsers = [
  { id: 1, email: "citizen@example.com", password: "1234", userType: "citizen", name: "John Citizen" },
  { id: 2, email: "ngo@example.com", password: "1234", userType: "ngo", name: "Helping Hands NGO" },
];

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = require('./config/database');

// ================= AI ADDITIONS (SAFE) =================
const tf = require('@tensorflow/tfjs');
const mobilenet = require('@tensorflow-models/mobilenet');
const knnClassifier = require('@tensorflow-models/knn-classifier');
const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= JWT =================
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

// ================= AI MODEL =================
let mobilenetModel;
let classifier;

async function loadAIModel() {
  try {
    mobilenetModel = await mobilenet.load();
    classifier = knnClassifier.create();

    const datasetPath = path.join(__dirname, '../ml/health_model/classifier.json');
    const dataset = JSON.parse(fs.readFileSync(datasetPath));

    const tensorObj = {};
    Object.entries(dataset).forEach(([label, data]) => {
      tensorObj[label] = tf.tensor2d(data);
    });

    classifier.setClassifierDataset(tensorObj);

    console.log("✅ AI Model Loaded");
  } catch (err) {
    console.error("❌ AI Load Error:", err);
  }
}

// ================= IMAGE HANDLER =================
async function processImage(imagePath) {
  try {
    const image = await Jimp.read(imagePath);
    image.resize(224, 224);

    const { data, width, height } = image.bitmap;
    const buffer = [];

    for (let i = 0; i < data.length; i += 4) {
      buffer.push(data[i]);
      buffer.push(data[i + 1]);
      buffer.push(data[i + 2]);
    }

    return tf.tensor3d(buffer, [height, width, 3])
      .toFloat()
      .div(255.0)
      .expandDims(0);

  } catch (err) {
    throw new Error("Invalid or unsupported image");
  }
}

// ================= AUTH =================
app.post('/api/auth/signup', (req, res) => {
  const { email, password, name, phone, userType } = req.body;

  const existingUser = mockUsers.find((u) => u.email === email && u.userType === userType);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists (mock)' });
  }

  const newUser = {
    id: mockUsers.length + 1,
    email,
    password,
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

// ================= REPORT =================
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

// ================= 🔥 AI CLASSIFY =================
app.post('/api/classify', async (req, res) => {
  try {
    const { imagePath } = req.body;

    if (!imagePath) {
      return res.status(400).json({ message: "Image path required" });
    }

    const imgTensor = await processImage(imagePath);

    const activation = mobilenetModel.infer(imgTensor, true);
    const result = await classifier.predictClass(activation);

    res.json({
      status: result.label,
      confidence: result.confidences[result.label]
    });

  } catch (err) {
    console.error("❌ Classification Error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// ================= HEALTH =================
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Stray Shield API is running' });
});

// ================= DOGS =================
let dogs = require('./data/dogs.json');

app.get('/api/dogs', verifyToken, (req, res) => {
  res.json(dogs);
});

// ================= SERVER =================
app.listen(PORT, async () => {
  console.log(`Stray Shield API running on http://localhost:${PORT}`);
  console.log('Connected to PostgreSQL database');

  await loadAIModel(); // 🔥 IMPORTANT
});