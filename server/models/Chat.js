
import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        default: 'New Conversation'
    },
    lastMessage: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Index for faster queries
chatSchema.index({ userId: 1, updatedAt: -1 });

export default mongoose.model('Chat', chatSchema);
