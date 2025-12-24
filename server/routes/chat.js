import express from 'express';
import ChatMessage from '../models/ChatMessage.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get chat history for a user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const messages = await ChatMessage.find({ userId: req.userId })
            .sort({ timestamp: 1 })
            .limit(100); // Limit to last 100 messages

        res.json(messages);
    } catch (error) {
        console.error('Get chat history error:', error);
        res.status(500).json({ error: 'Failed to get chat history' });
    }
});

// Save chat message
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { content, isUser } = req.body;

        const message = new ChatMessage({
            userId: req.userId,
            content,
            isUser,
            timestamp: new Date()
        });

        await message.save();

        res.status(201).json(message);
    } catch (error) {
        console.error('Save chat message error:', error);
        res.status(500).json({ error: 'Failed to save chat message' });
    }
});

// Clear chat history
router.delete('/', authMiddleware, async (req, res) => {
    try {
        await ChatMessage.deleteMany({ userId: req.userId });
        res.json({ message: 'Chat history cleared successfully' });
    } catch (error) {
        console.error('Clear chat history error:', error);
        res.status(500).json({ error: 'Failed to clear chat history' });
    }
});

export default router;
