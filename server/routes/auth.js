import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateToken, authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = new User({
            email,
            password: hashedPassword,
            name: name || '',
            onboardingCompleted: false
        });

        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                onboardingCompleted: user.onboardingCompleted,
                goals: user.goals,
                disorder: user.disorder,
                registrationDate: user.registrationDate,
                lastActivity: user.lastActivity,
                moodEntries: user.moodEntries,
                progressMetrics: user.progressMetrics
            },
            token
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Update last activity
        user.lastActivity = new Date().toISOString();
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.json({
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                onboardingCompleted: user.onboardingCompleted,
                goals: user.goals,
                disorder: user.disorder,
                registrationDate: user.registrationDate,
                lastActivity: user.lastActivity,
                moodEntries: user.moodEntries,
                progressMetrics: user.progressMetrics
            },
            token
        });
    } catch (err) {
        console.error("LOGIN ERROR 👉", err);
        res.status(500).json({
            message: err.message,
            stack: err.stack
        });
    }
});

// Google Sign-In
router.post('/google', async (req, res) => {
    try {
        const { email, name, googleId } = req.body;

        if (!email || !googleId) {
            return res.status(400).json({ error: 'Email and Google ID are required' });
        }

        // Find or create user
        let user = await User.findOne({ email });

        if (!user) {
            // Create new user with Google account
            user = new User({
                email,
                name: name || '',
                password: await bcrypt.hash(googleId, 10), // Use googleId as password (hashed)
                onboardingCompleted: false,
                googleId: googleId
            });
            await user.save();
        } else {
            // Update existing user's last activity
            user.lastActivity = new Date().toISOString();
            if (!user.googleId) {
                user.googleId = googleId;
            }
            await user.save();
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                onboardingCompleted: user.onboardingCompleted,
                goals: user.goals,
                disorder: user.disorder,
                registrationDate: user.registrationDate,
                lastActivity: user.lastActivity,
                moodEntries: user.moodEntries,
                progressMetrics: user.progressMetrics
            },
            token
        });
    } catch (error) {
        console.error('Google login error:', error);
        res.status(500).json({ error: 'Failed to login with Google' });
    }
});

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            id: user._id,
            email: user.email,
            name: user.name,
            onboardingCompleted: user.onboardingCompleted,
            goals: user.goals,
            disorder: user.disorder,
            registrationDate: user.registrationDate,
            lastActivity: user.lastActivity,
            moodEntries: user.moodEntries,
            progressMetrics: user.progressMetrics
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to get user' });
    }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const updates = req.body;

        // Don't allow password updates through this endpoint
        delete updates.password;
        delete updates.email;

        const user = await User.findByIdAndUpdate(
            req.userId,
            { ...updates, lastActivity: new Date().toISOString() },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            id: user._id,
            email: user.email,
            name: user.name,
            onboardingCompleted: user.onboardingCompleted,
            goals: user.goals,
            disorder: user.disorder,
            registrationDate: user.registrationDate,
            lastActivity: user.lastActivity,
            moodEntries: user.moodEntries,
            progressMetrics: user.progressMetrics
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

export default router;
