
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    googleId: {
        type: String,
        default: null
    },
    name: {
        type: String,
        default: ''
    },
    goals: [{
        type: String
    }],
    disorder: {
        type: String,
        default: ''
    },
    registrationDate: {
        type: Date,
        default: Date.now
    },
    onboardingCompleted: {
        type: Boolean,
        default: false
    },
    lastActivity: {
        type: String,
        default: () => new Date().toISOString()
    },
    moodEntries: {
        type: Number,
        default: 0
    },
    progressMetrics: {
        completedGoals: { type: Number, default: 0 },
        totalGoals: { type: Number, default: 0 },
        streakDays: { type: Number, default: 0 },
        lastActiveDate: { type: String, default: () => new Date().toISOString() }
    }
}, {
    timestamps: true
});

export default mongoose.model('User', userSchema);
