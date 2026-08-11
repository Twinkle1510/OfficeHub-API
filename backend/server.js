const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const skillRoutes = require('./routes/skillRoutes');
const userRoutes = require('./routes/userRoutes');
const activityRoutes = require('./routes/activityRoutes');
const messageRoutes = require('./routes/messageRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const payrollRoutes = require('./routes/payrollRoutes');
const projectRoutes = require('./routes/projectRoutes');
const assetRoutes = require('./routes/assetRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const policyRoutes = require('./routes/policyRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/users', userRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/policies', policyRoutes);

// Root endpoint for testing
app.get('/', (req, res) => {
  res.send('DevSkills Tracker API is running...');
});

const { MongoMemoryServer } = require('mongodb-memory-server');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
const connectDB = async () => {
  try {
    // 1. If a real MONGO_URI is provided in .env, use that (Best for production/permanent fix)
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('\n======================================================');
      console.log('✅ Connected to MongoDB (Atlas/Local) successfully!');
      console.log('======================================================\n');
    } else {
      // 2. Fallback to MongoMemoryServer with persistent storage
      const dbPath = path.join(__dirname, 'mongo-data');
      if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(dbPath);
      } else {
        // PERMANENT FIX for "kale je hatu e j" error:
        // When server stops abruptly, MongoDB leaves lock files which prevent it from starting again.
        // We delete these lock files before starting.
        const lockFile = path.join(dbPath, 'mongod.lock');
        const wtLockFile = path.join(dbPath, 'WiredTiger.lock');
        if (fs.existsSync(lockFile)) fs.unlinkSync(lockFile);
        if (fs.existsSync(wtLockFile)) fs.unlinkSync(wtLockFile);
      }

      const mongoServer = await MongoMemoryServer.create({
        instance: {
          port: 27018,
          dbPath: dbPath,
          storageEngine: 'wiredTiger'
        }
      });
      
      const uri = mongoServer.getUri();
      
      await mongoose.connect(uri);
      console.log('\n======================================================');
      console.log('✅ Connected to PERSISTENT MongoMemoryServer successfully!');
      console.log(`🔥 Connection String: ${uri}`);
      console.log('======================================================\n');
    }

    // Auto Seed 10 Genuine Sample Records for testing system
    const { seedSampleData } = require('./seedData');
    await seedSampleData();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
};

connectDB();
