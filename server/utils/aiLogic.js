/*
AI role:
“I am a calm, supportive recovery companion.
I do not judge.
I do not assume positivity.
I help users slow down, feel safe, and resist disordered eating urges.”
*/

import responses from './responses.js';

export function detectEmotion(message) {
    const text = message.toLowerCase();

    // Keyword detection per user request
    if (text.includes("binge") || text.includes("overeat")) return "binge_urge";
    if (text.includes("guilty") || text.includes("shame")) return "guilt";
    if (text.includes("sad") || text.includes("empty") || text.includes("not feeling good") || text.includes("feeling down")) return "sadness";
    if (text.includes("anxious") || text.includes("panic")) return "anxiety";
    if (text.includes("kill myself") || text.includes("end everything")) return "crisis";

    return "neutral";
}

export function generateReply(message) {
    const emotion = detectEmotion(message);

    const replyList = responses[emotion] || responses['neutral'];
    const randomIndex = Math.floor(Math.random() * replyList.length);

    return {
        text: replyList[randomIndex],
        emotion: emotion
    };
}
