import express from 'express';
import MoodEntry from '../models/MoodEntry.js';
import Goal from '../models/Goal.js';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Calculate and update user progress metrics
router.get('/', authMiddleware, async (req, res) => {
    try {
        // Get mood entries
        const moodEntries = await MoodEntry.find({ userId: req.userId }).sort({ date: -1 });

        // Get goals
        const goals = await Goal.find({ userId: req.userId });
        const completedGoals = goals.filter(g => g.completed).length;

        // Calculate streak
        let streakDays = 0;
        if (moodEntries.length > 0) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const sortedEntries = [...moodEntries].sort((a, b) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            );

            let currentDate = new Date(sortedEntries[0].date);
            currentDate.setHours(0, 0, 0, 0);

            const isToday = currentDate.getTime() === today.getTime();
            if (isToday) {
                streakDays = 1;

                // Check for consecutive previous days
                let previousDate = new Date(today);

                for (let i = 1; i < sortedEntries.length; i++) {
                    previousDate.setDate(previousDate.getDate() - 1);
                    const entryDate = new Date(sortedEntries[i].date);
                    entryDate.setHours(0, 0, 0, 0);

                    if (entryDate.getTime() === previousDate.getTime()) {
                        streakDays++;
                    } else {
                        break;
                    }
                }
            }
        }

        const progressMetrics = {
            completedGoals,
            totalGoals: goals.length,
            streakDays,
            lastActiveDate: new Date().toISOString()
        };

        // Update user document
        await User.findByIdAndUpdate(req.userId, {
            lastActivity: new Date().toISOString(),
            moodEntries: moodEntries.length,
            progressMetrics
        });

        res.json(progressMetrics);
    } catch (error) {
        console.error('Get progress error:', error);
        res.status(500).json({ error: 'Failed to get progress metrics' });
    }
});

export default router;
