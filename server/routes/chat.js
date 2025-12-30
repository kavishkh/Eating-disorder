
import express from 'express';
import ChatMessage from '../models/ChatMessage.js';
import Chat from '../models/Chat.js';
import { authMiddleware } from '../middleware/auth.js';
import { detectEmotion, generateReply } from '../utils/aiLogic.js';

const router = express.Router();

// Get all chats for a user
router.get('/sessions', authMiddleware, async (req, res) => {
    try {
        const chats = await Chat.find({ userId: req.userId })
            .sort({ updatedAt: -1 });
        res.json(chats);
    } catch (error) {
        console.error('Get chats error:', error);
        res.status(500).json({ error: 'Failed to get chat sessions' });
    }
});

// Create a new chat session
router.post('/create', authMiddleware, async (req, res) => {
    try {
        const chat = new Chat({
            userId: req.userId,
            title: 'New Conversation'
        });
        await chat.save();
        res.status(201).json({ chatId: chat._id });
    } catch (error) {
        console.error('Create chat error:', error);
        res.status(500).json({ error: 'Failed to create chat' });
    }
});

// Get messages for a specific chat
router.get('/:chatId', authMiddleware, async (req, res) => {
    try {
        const { chatId } = req.params;
        const messages = await ChatMessage.find({
            userId: req.userId,
            chatId: chatId
        }).sort({ timestamp: 1 });

        res.json(messages);
    } catch (error) {
        console.error('Get chat messages error:', error);
        res.status(500).json({ error: 'Failed to get chat messages' });
    }
});

// Save chat message
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { content, isUser, chatId } = req.body;

        if (!chatId) {
            return res.status(400).json({ error: 'Chat ID is required' });
        }

        let emotion = null;
        if (isUser) {
            const emotionObj = detectEmotion(content);
            emotion = emotionObj.type;
        }

        const message = new ChatMessage({
            userId: req.userId,
            chatId,
            content,
            isUser,
            timestamp: new Date(),
            emotion
        });

        await message.save();

        // Update chat's last message and update timestamp
        await Chat.findByIdAndUpdate(chatId, {
            lastMessage: content,
            updatedAt: new Date()
        });

        res.status(201).json(message);
    } catch (error) {
        console.error('Save chat message error:', error);
        res.status(500).json({ error: 'Failed to save chat message' });
    }
});

// Generate AI Reply
router.post('/reply', authMiddleware, async (req, res) => {
    try {
        const { message, chatId } = req.body;

        if (!chatId) {
            return res.status(400).json({ error: 'Chat ID is required' });
        }

        const { text, emotion, type, video, followUp, multiModal } = generateReply(message, req.userId);

        // Save AI response
        const aiMessage = new ChatMessage({
            userId: req.userId,
            chatId,
            content: text,
            isUser: false,
            timestamp: new Date(),
            emotion: null,
            type: type || 'text',
            video: video || null,
            followUp: followUp || null,
            multiModal: multiModal || []
        });

        await aiMessage.save();

        // Update chat session
        await Chat.findByIdAndUpdate(chatId, {
            lastMessage: text,
            updatedAt: new Date()
        });

        res.json({
            reply: text,
            type: type || 'text',
            video: video || null,
            followUp: followUp || null,
            multiModal: multiModal || []
        });
    } catch (error) {
        console.error('Generate AI reply error:', error);
        res.status(500).json({ error: 'Failed to generate reply' });
    }
});

// Clear chat history (or delete a specific chat)
router.delete('/:chatId', authMiddleware, async (req, res) => {
    try {
        const { chatId } = req.params;
        await ChatMessage.deleteMany({ userId: req.userId, chatId: chatId });
        await Chat.findByIdAndDelete(chatId);
        res.json({ message: 'Chat session deleted successfully' });
    } catch (error) {
        console.error('Delete chat error:', error);
        res.status(500).json({ error: 'Failed to delete chat session' });
    }
});

export default router;
