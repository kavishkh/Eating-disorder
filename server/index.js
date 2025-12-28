// MUST BE FIRST - Load environment variables before anything else
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '.env');
console.log(`🔍 Checking for .env at: ${envPath}`);

if (fs.existsSync(envPath)) {
    const result = dotenv.config({ path: envPath });
    if (result.error) {
        console.error('❌ Error parsing .env file:', result.error);
    } else {
        console.log('✅ .env file found and parsed');
    }
} else {
    console.error('❌ .env file NOT FOUND at the expected path!');
}

// Verify JWT_SECRET is loaded
console.log('====== ENVIRONMENT CHECK ======');
console.log('JWT_SECRET =', process.env.JWT_SECRET ? '✅ LOADED' : '❌ UNDEFINED');
console.log('MONGODB_URI =', process.env.MONGODB_URI ? '✅ LOADED' : '❌ UNDEFINED (using fallback)');
console.log('================================');

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import moodRoutes from './routes/mood.js';
import goalRoutes from './routes/goal.js';
import chatRoutes from './routes/chat.js';
import progressRoutes from './routes/progress.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://Kavishkhanna:kavishkhanna12@cluster0.mhogpcx.mongodb.net/eating-disorder?retryWrites=true&w=majority';
console.log('Attempting to connect with URI:', MONGODB_URI.replace(/:([^:@]+)@/, ':****@'));

mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// Health check route
app.get('/', (req, res) => {
    res.json({
        message: 'Eating Disorder Recovery API',
        status: 'running',
        timestamp: new Date().toISOString()
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/progress', progressRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
