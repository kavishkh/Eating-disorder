import express from 'express';
import MoodEntry from '../models/MoodEntry.js';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all mood entries for a user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const moods = await MoodEntry.find({ userId: req.userId }).sort({ date: -1 });
        res.json(moods);
    } catch (error) {
        console.error('Get moods error:', error);
        res.status(500).json({ error: 'Failed to get mood entries' });
    }
});

// Check if mood recorded today
router.get('/today', authMiddleware, async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const mood = await MoodEntry.findOne({ userId: req.userId, date: today });
        res.json({ hasRecorded: !!mood });
    } catch (error) {
        console.error('Check today mood error:', error);
        res.status(500).json({ error: 'Failed to check today mood' });
    }
});

// Get recent mood entries with default 7 days
router.get('/recent', authMiddleware, async (req, res) => {
    try {
        const days = 7;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const startDateStr = startDate.toISOString().split('T')[0];

        const moods = await MoodEntry.find({
            userId: req.userId,
            date: { $gte: startDateStr }
        }).sort({ date: 1 });

        res.json(moods);
    } catch (error) {
        console.error('Get recent moods error:', error);
        res.status(500).json({ error: 'Failed to get recent mood entries' });
    }
});

// Get recent mood entries (last N days)
router.get('/recent/:days', authMiddleware, async (req, res) => {
    try {
        const days = parseInt(req.params.days) || 7;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const startDateStr = startDate.toISOString().split('T')[0];

        const moods = await MoodEntry.find({
            userId: req.userId,
            date: { $gte: startDateStr }
        }).sort({ date: 1 });

        res.json(moods);
    } catch (error) {
        console.error('Get recent moods error:', error);
        res.status(500).json({ error: 'Failed to get recent mood entries' });
    }
});

// Create mood entry
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { date, mood, note } = req.body;

        const moodEntry = new MoodEntry({
            userId: req.userId,
            date,
            mood,
            note: note || '',
            timestamp: new Date().toISOString()
        });

        await moodEntry.save();

        // Update user's mood entries count
        await User.findByIdAndUpdate(req.userId, {
            $inc: { moodEntries: 1 },
            lastActivity: new Date().toISOString()
        });

        res.status(201).json(moodEntry);
    } catch (error) {
        console.error('Create mood error:', error);
        res.status(500).json({ error: 'Failed to create mood entry' });
    }
});

// Update mood entry
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const mood = await MoodEntry.findOneAndUpdate(
            { _id: id, userId: req.userId },
            updates,
            { new: true }
        );

        if (!mood) {
            return res.status(404).json({ error: 'Mood entry not found' });
        }

        res.json(mood);
    } catch (error) {
        console.error('Update mood error:', error);
        res.status(500).json({ error: 'Failed to update mood entry' });
    }
});

// Delete mood entry
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        const mood = await MoodEntry.findOneAndDelete({ _id: id, userId: req.userId });

        if (!mood) {
            return res.status(404).json({ error: 'Mood entry not found' });
        }

        // Decrement user's mood entries count
        await User.findByIdAndUpdate(req.userId, {
            $inc: { moodEntries: -1 }
        });

        res.json({ message: 'Mood entry deleted successfully' });
    } catch (error) {
        console.error('Delete mood error:', error);
        res.status(500).json({ error: 'Failed to delete mood entry' });
    }
});

export default router;
