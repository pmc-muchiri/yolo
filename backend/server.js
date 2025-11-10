// ---------------------------
// server.js
// ---------------------------
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const upload = multer();

const productRoute = require('./routes/api/productRoute');

// ---------------------------
// MongoDB Connection (Replica Set)
// ---------------------------
const username = process.env.MONGO_ROOT_USERNAME || process.env.MONGO_INITDB_ROOT_USERNAME;
const password = process.env.MONGO_ROOT_PASSWORD || process.env.MONGO_INITDB_ROOT_PASSWORD;

// Kubernetes DNS: mongo-{0,1,2}.mongo.yolo.svc.cluster.local
const MONGODB_URI = `mongodb://${username}:${password}@mongo-0.mongo.yolo.svc.cluster.local:27017,mongo-1.mongo.yolo.svc.cluster.local:27017,mongo-2.mongo.yolo.svc.cluster.local:27017/yolo?authSource=admin&replicaSet=rs0`;

// Local fallback
const mongodb_url = 'mongodb://localhost/yolomy';
const uri = process.env.MONGODB_URI || MONGODB_URI || mongodb_url;

// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.once('open', () => console.log('Database connected successfully'));
db.on('error', (error) => console.error('Database error:', error));

// ---------------------------
// Express App Setup
// ---------------------------
const app = express();

// Middleware
app.use(express.json());
app.use(upload.array());

// ---------------------------
// CORS Configuration
// ---------------------------
// Allow requests from your frontend IP + domain + local dev
app.use(cors({
  origin: [
    'http://34.35.137.242',            // Frontend LoadBalancer IP
    'http://yolo-app.pmcdevops.com',   // Your Ingress domain
    'http://localhost:3000',            // Local development
    'http://34.35.131.113:5000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());

// ---------------------------
// API Routes
// ---------------------------
app.use('/api/products', productRoute);

// Health check route (optional)
app.get('/', (req, res) => {
  res.send('YOLO Backend is running');
});

// ---------------------------
// Server Start
// ---------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
