/*
AI role:
“I am a calm, supportive recovery companion.
I do not judge.
I do not assume positivity.
I help users slow down, feel safe, and resist disordered eating urges.”
*/

import { responses } from './responses.js';
import { knowledgeBase, videoLibrary } from './knowledgeBase.js';
import { getSession } from './sessionStore.js';

// --- LAYER 1: INTENT DETECTION ---
export function detectIntent(message) {
    const text = message.toLowerCase();

    if (text.includes("video") || text.includes("watch")) return "video";
    if (text.includes("how") || text.includes("what") || text.includes("tip") || text.includes("advice") || text.includes("help me with")) return "search";

    // Check if user is answering a video clarification request
    if (text.includes("calm") || text.includes("breathing") || text.includes("anger") || text.includes("anxiety")) return "video_answer_calm";
    if (text.includes("food") || text.includes("eat") || text.includes("struggle")) return "video_answer_food";
    if (text.includes("motivation") || text.includes("recovery")) return "video_answer_motivation";

    if (text.includes("thank") || text.includes("thanks") || text.includes("okay") || text.includes("good")) return "gratitude";

    return "support";
}

// Helper: Detect if a video request is too vague
function needsClarification(text) {
    text = text.toLowerCase();
    return (
        text.includes("video") &&
        !text.includes("calm") &&
        !text.includes("food") &&
        !text.includes("anxiety") &&
        !text.includes("motivation")
    );
}

// Helper: Video Rotation & Anti-Repetition
function getUnseenVideo(purpose, seenVideos) {
    const allVideos = videoLibrary[purpose] || videoLibrary['motivation'];
    const unseen = allVideos.filter(v => !seenVideos.includes(v.videoId));

    if (unseen.length === 0) {
        // If all seen, pick a random one but not the last one if possible
        return allVideos[Math.floor(Math.random() * allVideos.length)];
    }

    return unseen[Math.floor(Math.random() * unseen.length)];
}

// --- LAYER 2: EMOTION INTENSITY DETECTION ---
export function detectEmotion(message) {
    const text = message.toLowerCase();

    // 1. Crisis check first (Safety & Crisis Mode)
    const crisisKeywords = ["kill myself", "end everything", "suicide", "disappear", "can't do this anymore", "want to die", "hurt myself"];
    if (crisisKeywords.some(k => text.includes(k))) return { type: "crisis", level: "high" };

    // 2. Emotion mapping with intensity
    const emotions = [
        { type: "anger", keywords: ["angry", "mad", "irritated", "frustrated", "hate", "pissed"] },
        { type: "binge_urge", keywords: ["binge", "urge", "overeat", "stuff myself", "can't stop eating"] },
        { type: "guilt", keywords: ["guilty", "shame", "disgust", "regret"] },
        { type: "anxiety", keywords: ["anxious", "panic", "scared", "fear", "overwhelmed", "nervous"] },
        { type: "sadness", keywords: ["sad", "bad", "empty", "down", "depressed", "lonely"] }
    ];

    for (const e of emotions) {
        if (e.keywords.some(k => text.includes(k))) {
            let level = "medium";
            if (text.includes("very") || text.includes("really") || text.includes("extremely") || text.includes("hate") || text.includes("can't stand")) {
                level = "high";
            } else if (text.includes("bit") || text.includes("little") || text.includes("slightly")) {
                level = "low";
            }
            return { type: e.type, level };
        }
    }

    return { type: "neutral", level: "medium" };
}

// --- LAYER 3: SEARCH ENGINE (KNOWLEDGE ENGINE UPGRADE) ---
function searchKnowledgeBase(question) {
    const text = question.toLowerCase();
    return knowledgeBase.find(entry =>
        entry.keywords.some(k => text.includes(k))
    );
}

// --- LAYER 4: SMART FOLLOW-UP QUESTIONS ---
function getSmartFollowUp(emotion, intent, lastSuggestion) {
    if (intent === 'video') return "Did the video help even a little?";
    if (intent === 'search') return "Does that make sense, or should we try a different approach?";

    if (emotion.type === 'anxiety' || emotion.type === 'anger') {
        return "Should we try a 1-minute grounding exercise together?";
    }

    if (emotion.type === 'binge_urge') {
        return "Do you want to try a short distraction task right now?";
    }

    return "How are you feeling about that?";
}

// --- MAIN BRAIN ---
export function generateReply(message, userId = 'default') {
    const context = getSession(userId);
    const emotionObj = detectEmotion(message);
    const emotion = emotionObj.type;
    const level = emotionObj.level;
    const intent = detectIntent(message);

    // Logging for self-improvement (Self-Improvement Log)
    context.interactionLog.push({
        timestamp: new Date(),
        input: message,
        detectedEmotion: emotionObj,
        detectedIntent: intent
    });

    // Safety Override (Crisis Mode)
    if (emotion === 'crisis') {
        context.lastQuestionAsked = null;
        return {
            type: "text",
            text: responses.crisis[Math.floor(Math.random() * responses.crisis.length)] + "\n\nYou are not alone. Please reach out to: \n- Crisis Text Line: Text HOME to 741741\n- National Suicide Prevention Lifeline: 988",
            emotion,
            level,
            multiModal: [
                { type: "exercise", label: "Try 1-minute grounding", id: "grounding" },
                { type: "audio", label: "Play calming audio", id: "calm_audio" }
            ]
        };
    }

    // Handle intent mapping from previous clarification
    if (intent === "video_answer_calm") context.videoPurpose = "calm";
    if (intent === "video_answer_food") context.videoPurpose = "food";
    if (intent === "video_answer_motivation") context.videoPurpose = "motivation";

    // Update context memory
    context.lastIntent = intent;
    context.lastEmotion = emotion;

    // --- VIDEO FLOW (Video Rotation & Anti-Repetition) ---
    if (intent === 'video' || (context.lastQuestionAsked === "video_clarification" && (intent.startsWith("video_answer") || intent === "support"))) {
        if (needsClarification(message) && context.lastQuestionAsked !== "video_clarification") {
            context.lastQuestionAsked = "video_clarification";
            return {
                type: "text",
                text: "I can suggest better videos if I understand a bit more.\n\nAre you looking for videos to:\n1) Calm down / reduce anger or anxiety\n2) Help with food-related struggles\n3) Motivation for recovery\n4) Something else",
                emotion,
                level
            };
        }

        let purpose = context.videoPurpose;
        if (!purpose) {
            if (message.includes("calm") || emotion === "anger" || emotion === "anxiety") purpose = "calm";
            else if (message.includes("food") || emotion === "binge_urge") purpose = "food";
            else purpose = "motivation";
        }

        const selectedVideo = getUnseenVideo(purpose, context.seenVideos);
        context.seenVideos.push(selectedVideo.videoId);
        context.lastQuestionAsked = null;
        context.videoPurpose = null;
        context.lastSuggestion = "video";

        return {
            type: "video",
            text: `I found this for you. I hope it helps you feel a bit more ${purpose === 'calm' ? 'at peace' : purpose === 'food' ? 'supported' : 'motivated'}.`,
            emotion: emotion,
            level: level,
            video: {
                title: selectedVideo.title,
                videoId: selectedVideo.videoId,
                platform: "youtube"
            },
            followUp: "Did the video help even a little?"
        };
    }

    // --- SEARCH FLOW (Structured Knowledge) ---
    if (intent === 'search') {
        const result = searchKnowledgeBase(message);
        if (result) {
            const { validate, suggest, optional_step } = result.response;
            context.lastQuestionAsked = null;
            context.lastSuggestion = "advice";

            return {
                type: "text",
                text: `${validate}\n\nStep 1: ${suggest}\nStep 2: ${optional_step}\nStep 3: Decide next step (no pressure)`,
                emotion,
                level,
                followUp: "Do you want something shorter or quieter?",
                multiModal: [
                    { type: "writing", label: "Write how you feel", id: "journal" },
                    { type: "exercise", label: "Try 1-minute exercise", id: "box_breathing" }
                ]
            };
        }
    }

    // --- GRATITUDE / CLOSURE ---
    if (intent === 'gratitude') {
        return {
            type: "text",
            text: "You're very welcome. I'm glad I could be here for you. Is there anything else you'd like to share or try?",
            emotion: "neutral",
            level: "medium"
        };
    }

    // --- DEFAULT SUPPORT ---
    context.lastQuestionAsked = null;
    const emotionResponses = responses[emotion] || responses['neutral'];
    // For structured responses if it's an object with levels
    let reply;
    if (typeof emotionResponses === 'object' && !Array.isArray(emotionResponses)) {
        const levelResponses = emotionResponses[level] || emotionResponses['medium'];
        reply = levelResponses[Math.floor(Math.random() * levelResponses.length)];
    } else {
        reply = emotionResponses[Math.floor(Math.random() * emotionResponses.length)];
    }

    // Add tiny steps if emotion is strong (Step-by-Step Micro Help)
    if (level === 'high' && (emotion === 'anxiety' || emotion === 'anger' || emotion === 'binge_urge')) {
        reply += "\n\nLet's try these tiny steps right now:\n1. Pause and breathe for 10 seconds\n2. Sip some water\n3. Take one more breath. We're in this together.";
    }

    return {
        type: "text",
        text: reply,
        emotion: emotion,
        level: level,
        followUp: getSmartFollowUp(emotionObj, intent, context.lastSuggestion),
        multiModal: emotion === 'neutral' ? [] : [
            { type: "audio", label: "Play calming audio", id: "calm_audio" },
            { type: "writing", label: "Write how you feel", id: "journal" }
        ]
    };
}
