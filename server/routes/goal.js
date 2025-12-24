import express from 'express';
import Goal from '../models/Goal.js';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all goals for a user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const goals = await Goal.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json(goals);
    } catch (error) {
        console.error('Get goals error:', error);
        res.status(500).json({ error: 'Failed to get goals' });
    }
});

// Create goal
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { text } = req.body;

        const goal = new Goal({
            userId: req.userId,
            text,
            completed: false
        });

        await goal.save();

        // Update user's total goals count
        const totalGoals = await Goal.countDocuments({ userId: req.userId });
        const completedGoals = await Goal.countDocuments({ userId: req.userId, completed: true });

        await User.findByIdAndUpdate(req.userId, {
            'progressMetrics.totalGoals': totalGoals,
            'progressMetrics.completedGoals': completedGoals,
            lastActivity: new Date().toISOString()
        });

        res.status(201).json(goal);
    } catch (error) {
        console.error('Create goal error:', error);
        res.status(500).json({ error: 'Failed to create goal' });
    }
});

// Update goal (toggle completion)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { completed, text } = req.body;

        const updates = {};
        if (text !== undefined) updates.text = text;
        if (completed !== undefined) {
            updates.completed = completed;
            updates.completedAt = completed ? new Date().toISOString() : null;
        }

        const goal = await Goal.findOneAndUpdate(
            { _id: id, userId: req.userId },
            updates,
            { new: true }
        );

        if (!goal) {
            return res.status(404).json({ error: 'Goal not found' });
        }

        // Update user's completed goals count
        const completedGoals = await Goal.countDocuments({ userId: req.userId, completed: true });
        await User.findByIdAndUpdate(req.userId, {
            'progressMetrics.completedGoals': completedGoals,
            lastActivity: new Date().toISOString()
        });

        res.json(goal);
    } catch (error) {
        console.error('Update goal error:', error);
        res.status(500).json({ error: 'Failed to update goal' });
    }
});

// Delete goal
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        const goal = await Goal.findOneAndDelete({ _id: id, userId: req.userId });

        if (!goal) {
            return res.status(404).json({ error: 'Goal not found' });
        }

        // Update user's goals count
        const totalGoals = await Goal.countDocuments({ userId: req.userId });
        const completedGoals = await Goal.countDocuments({ userId: req.userId, completed: true });

        await User.findByIdAndUpdate(req.userId, {
            'progressMetrics.totalGoals': totalGoals,
            'progressMetrics.completedGoals': completedGoals
        });

        res.json({ message: 'Goal deleted successfully' });
    } catch (error) {
        console.error('Delete goal error:', error);
        res.status(500).json({ error: 'Failed to delete goal' });
    }
});

export default router;
