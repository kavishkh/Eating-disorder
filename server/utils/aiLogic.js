/*
AI role:
“I am a calm, supportive recovery companion.
I do not judge.
I do not assume positivity.
I help users slow down, feel safe, and resist disordered eating urges.”
*/

import { responses } from './responses.js';
import { knowledgeBase, videoLibrary } from './knowledgeBase.js';
import { audioLibrary } from './audioLibrary.js';
import { getSession } from './sessionStore.js';

// --- LAYER 1: INTENT DETECTION ---
export function detectIntent(message) {
    const text = message.toLowerCase();

    if (text.includes("video") || text.includes("watch")) return "video";
    if (text.includes("audio") || text.includes("music") || text.includes("sound") || text.includes("listen") || text.includes("play")) return "audio";
    if (text.includes("how") || text.includes("what") || text.includes("tip") || text.includes("advice") || text.includes("help me with")) return "search";

    // Check if user is answering a video clarification request
    if (text.includes("calm") || text.includes("breathing") || text.includes("anger") || text.includes("anxiety")) return "video_answer_calm";
    if (text.includes("food") || text.includes("eat") || text.includes("struggle")) return "video_answer_food";
    if (text.includes("motivation") || text.includes("recovery")) return "video_answer_motivation";

    // Prevent "not so good" from triggering gratitude intent
    const isNegative = text.includes("not good") || text.includes("not so good") || text.includes("don't feel good");

    if (!isNegative && (text.includes("thank") || text.includes("thanks") || text.includes("okay") || text.includes("good"))) {
        return "gratitude";
    }

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
    const crisisKeywords = [
        "kill myself", "end everything", "suicide", "disappear",
        "can't do this anymore", "want to die", "hurt myself",
        "can't go on", "maybe i should kill myself", "hurt myself now",
        "i want to disappear", "i want to die"
    ];
    if (crisisKeywords.some(k => text.includes(k))) return { type: "crisis", level: "high" };

    // 2. Emotion mapping with intensity
    const emotions = [
        { type: "anger", keywords: ["angry", "mad", "irritated", "frustrated", "hate", "pissed"] },
        { type: "binge_urge", keywords: ["binge", "urge", "overeat", "stuff myself", "can't stop eating"] },
        { type: "guilt", keywords: ["guilty", "shame", "disgust", "regret"] },
        { type: "anxiety", keywords: ["anxious", "panic", "scared", "fear", "overwhelmed", "nervous"] },
        { type: "sadness", keywords: ["sad", "bad", "empty", "down", "depressed", "lonely", "not good", "not so good"] }
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
function getSmartFollowUp(emotion, intent, lastSuggestion, lastFollowUp = null) {
    const followUps = {
        video: [
            "Did that video help distract you even a little?",
            "What did you think of that video?",
            "I hope that video felt like a gentle break. How's your head now?"
        ],
        search: [
            "Does that advice feel doable, or should we try something else?",
            "I'm here to dive deeper if any of that was confusing.",
            "Want to try one of those steps together?"
        ],
        anxiety: [
            "Should we try a 1-minute grounding exercise together?",
            "Would focusing on your breath help right now?",
            "Do you need a distraction, or do you want to keep talking?"
        ],
        binge_urge: [
            "Do you want to try a short distraction task right now?",
            "I'm right here with you. What do you need most this second?",
            "Should we count to 60 together while the urge passes?"
        ],
        sadness: [
            "I'm listening. Do you want to share more, or would you prefer a distraction?",
            "How can I best support you in this heavy moment?",
            "Remember, you don't have to carry this alone. What's one small kind thing you could do for yourself?"
        ],
        default: [
            "How are you feeling about that?",
            "I'm here for whatever is on your mind.",
            "What feels like the next right step for you?"
        ]
    };

    let pool = followUps[intent] || followUps[emotion.type] || followUps.default;
    // Prevent immediate repetition of follow-up
    if (lastFollowUp) pool = pool.filter(f => f !== lastFollowUp);

    return pool[Math.floor(Math.random() * pool.length)];
}

// Helper: Get a response from the library based on emotion and level (Validate -> Guide)
function getReplyForEmotion(emotion, level, lastReply = null) {
    const emotionResponses = responses[emotion] || responses['neutral'];
    let pool;

    if (typeof emotionResponses === 'object' && !Array.isArray(emotionResponses)) {
        pool = emotionResponses[level] || emotionResponses['medium'];
    } else {
        pool = emotionResponses;
    }

    // Loop prevention: remove the last sent reply from the pool if possible
    let available = pool;
    if (lastReply && pool.length > 1) {
        available = pool.filter(r => r !== lastReply);
    }

    let reply = available[Math.floor(Math.random() * available.length)];

    // Add tiny steps if emotion is strong (Step-by-Step Micro Help) (GUIDE)
    if (level === 'high' && (emotion === 'anxiety' || emotion === 'anger' || emotion === 'binge_urge')) {
        reply += "\n\nLet's try these tiny steps right now:\n1. Pause and breathe for 10 seconds\n2. Sip some water\n3. Take one more breath. We're in this together.";
    }
    return reply;
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

    // Safety Override (Crisis Mode Lock)
    if (context.crisisActive || emotion === 'crisis') {
        const resetKeywords = ["i am safe", "i felt better", "i called", "i spoke to someone", "thank you i am okay now"];
        if (context.crisisActive && resetKeywords.some(k => message.toLowerCase().includes(k))) {
            context.crisisActive = false;
            return {
                type: "text",
                text: "I'm so glad to hear you're feeling a bit safer and that you've reached out. I'm still here for you. How else can I support you right now?",
                emotion: "neutral",
                level: "medium"
            };
        }

        context.crisisActive = true;
        context.lastQuestionAsked = null;
        return {
            type: "text",
            text: responses.crisis[0],
            emotion: "crisis",
            level: "high",
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

    // --- DETECT "READY TO LISTEN" INTENT ---
    const isReadyToListen = (text) => {
        text = text.toLowerCase();
        return (
            text.includes("ready") ||
            text.includes("yes") ||
            text.includes("ok") ||
            text.includes("play")
        );
    };

    // --- AUDIO FLOW (Mindful Listening Fix) ---
    // Handle the confirmation step
    if (isReadyToListen(message) && context.pendingAudio) {
        const audioData = context.pendingAudio;
        context.pendingAudio = null; // Clear it after delivery
        return {
            type: "audio",
            text: "Alright. You can start listening whenever you’re ready. For the best experience, please use earphones or headphones.",
            emotion,
            level,
            audio: audioData,
            followUp: "Take your time. How are you feeling after the audio?"
        };
    }

    // Handle initial request
    if (intent === 'audio') {
        let category = 'meditation';
        if (emotion === 'binge_urge' || emotion === 'anxiety') category = 'breathing';
        else if (emotion === 'neutral') category = 'music';
        else if (emotion === 'sadness') category = 'nature';

        let list = audioLibrary[category];

        // Safety Guard (STEP 8: No thunder for panic users)
        if (emotion === 'anxiety' || emotion === 'crisis') {
            list = list.filter(a => !a.title.toLowerCase().includes('heavy rain') && !a.title.toLowerCase().includes('thunder'));
        }

        const selectedAudio = list[Math.floor(Math.random() * list.length)];

        // STORE "PENDING AUDIO" (STEP 2)
        context.pendingAudio = {
            title: selectedAudio.title,
            src: selectedAudio.src
        };

        return {
            type: "text",
            text: `I’ve picked out some ${category} sounds for you. Let me know when you’re ready to listen. For the best experience, please use earphones or headphones.`,
            emotion,
            level,
            followUp: "Shall I play it for you now?"
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
    // Only trigger full closure if the user isn't ALSO expressing negative emotions
    if (intent === 'gratitude' && emotion === 'neutral') {
        const reply = "You're very welcome. I'm glad I could be here for you. Is there anything else you'd like to share or try?";
        context.lastReply = reply;
        context.lastFollowUp = null;
        return {
            type: "text",
            text: reply,
            emotion: "neutral",
            level: "medium"
        };
    } else if (intent === 'gratitude' && emotion !== 'neutral') {
        // User said "Thanks, but it's hard" - acknowledge gratitude then provide support
        const SupportReply = getReplyForEmotion(emotion, level, context.lastReply);
        const text = `You're very welcome. I'm glad you're sharing this with me.\n\n${SupportReply}`;
        const followUp = getSmartFollowUp(emotionObj, "support", context.lastSuggestion, context.lastFollowUp);

        context.lastReply = SupportReply;
        context.lastFollowUp = followUp;

        return {
            type: "text",
            text: text,
            emotion: emotion,
            level: level,
            followUp: followUp
        };
    }

    // --- DEFAULT SUPPORT ---
    context.lastQuestionAsked = null;
    const reply = getReplyForEmotion(emotion, level, context.lastReply);
    const followUp = getSmartFollowUp(emotionObj, intent, context.lastSuggestion, context.lastFollowUp);

    context.lastReply = reply;
    context.lastFollowUp = followUp;

    return {
        type: "text",
        text: reply,
        emotion: emotion,
        level: level,
        followUp: followUp,
        multiModal: emotion === 'neutral' ? [] : [
            { type: "audio", label: "Play calming audio", id: "calm_audio" },
            { type: "writing", label: "Write how you feel", id: "journal" }
        ]
    };
}
