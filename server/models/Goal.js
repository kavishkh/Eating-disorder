
import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

// Index for faster queries
goalSchema.index({ userId: 1 });

export default mongoose.model('Goal', goalSchema);
