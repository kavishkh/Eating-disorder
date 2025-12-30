
import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    isUser: {
        type: Boolean,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    emotion: {
        type: String,
        default: null
    },
    type: {
        type: String,
        enum: ['text', 'video'],
        default: 'text'
    },
    video: {
        title: String,
        videoId: String,
        platform: String
    },
    followUp: {
        type: String,
        default: null
    },
    multiModal: [{
        type: {
            type: String,
            enum: ['exercise', 'audio', 'writing', 'video']
        },
        label: String,
        id: String
    }]
}, {
    timestamps: true
});

// Index for faster queries
chatMessageSchema.index({ userId: 1, timestamp: -1 });

export default mongoose.model('ChatMessage', chatMessageSchema);
