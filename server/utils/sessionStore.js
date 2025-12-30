
// Simple in-memory session store to track conversation context per user
// In a production app, this would be a database or Redis
const sessions = new Map();

export const getSession = (userId) => {
    if (!sessions.has(userId)) {
        sessions.set(userId, {
            videoPurpose: null,
            lastQuestionAsked: null,
            lastIntent: null,
            lastEmotion: null,
            lastSuggestion: null,
            seenVideos: [],
            pendingAudio: null,
            emotionHistory: [],
            interactionLog: []
        });
    }
    return sessions.get(userId);
};

export const clearSession = (userId) => {
    sessions.delete(userId);
};
