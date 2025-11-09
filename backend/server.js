const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const upload = multer();

const productRoute = require('./routes/api/productRoute');

// MongoDB replica set connection (Kubernetes)
const username = process.env.MONGO_ROOT_USERNAME || process.env.MONGO_INITDB_ROOT_USERNAME;
const password = process.env.MONGO_ROOT_PASSWORD || process.env.MONGO_INITDB_ROOT_PASSWORD;

// This assumes your StatefulSet is named "mongo" and headless service is "mongo"
const MONGODB_URI = `mongodb://${username}:${password}@mongo-0.mongo.yolo.svc.cluster.local:27017,mongo-1.mongo.yolo.svc.cluster.local:27017,mongo-2.mongo.yolo.svc.cluster.local:27017/yolo?authSource=admin&replicaSet=rs0`;

// Fallback for local dev
const mongodb_url = 'mongodb://localhost/yolomy';
const uri = process.env.MONGODB_URI || MONGODB_URI || mongodb_url;

// Connect
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// ✅ Make sure `db` is defined (fixes your crash)
let db = mongoose.connection;

// Connection logs
db.once('open', () => console.log('✅ Database connected successfully'));
db.on('error', (error) => console.error('❌ Database error:', error));

// Initialize express
const app = express();
app.use(express.json());
app.use(upload.array());
app.use(cors());

// Routes
app.use('/api/products', productRoute);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));