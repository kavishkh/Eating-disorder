import express from 'express';
import ChatMessage from '../models/ChatMessage.js';
import { authMiddleware } from '../middleware/auth.js';

import { detectEmotion, generateReply } from '../utils/aiLogic.js';

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

        let emotion = null;
        if (isUser) {
            emotion = detectEmotion(content);
        }

        const message = new ChatMessage({
            userId: req.userId,
            content,
            isUser,
            timestamp: new Date(),
            emotion
        });

        await message.save();

        res.status(201).json(message);
    } catch (error) {
        console.error('Save chat message error:', error);
        res.status(500).json({ error: 'Failed to save chat message' });
    }
});

// Generate AI Reply
router.post('/reply', authMiddleware, async (req, res) => {
    try {
        const { message } = req.body; // User's message

        const { text, emotion } = generateReply(message);

        // Save AI response
        const aiMessage = new ChatMessage({
            userId: req.userId,
            content: text,
            isUser: false,
            timestamp: new Date(),
            // We can optionally store the emotion the AI was responding to, 
            // or leave it null as the AI itself doesn't "have" the emotion.
            // For tracking, it might be useful to know what this reply was regarding.
            // But strict Step 9 implies detecting it on the "message" (User's info).
            emotion: null
        });

        await aiMessage.save();

        res.json({ reply: text });
    } catch (error) {
        console.error('Generate AI reply error:', error);
        res.status(500).json({ error: 'Failed to generate reply' });
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
