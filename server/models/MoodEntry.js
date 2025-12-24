
import mongoose from 'mongoose';

const moodEntrySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: String,
        required: true
    },
    mood: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    note: {
        type: String,
        default: ''
    },
    timestamp: {
        type: String,
        default: () => new Date().toISOString()
    }
}, {
    timestamps: true
});

// Index for faster queries
moodEntrySchema.index({ userId: 1, date: -1 });

export default mongoose.model('MoodEntry', moodEntrySchema);
