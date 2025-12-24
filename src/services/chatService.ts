import { chatAPI } from "@/utils/api";

// Define message types
export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  content: string;
  timestamp: Date;
}

// Define chat session interface
export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  date: Date;
}

// Detect user's mood from their message
function detectUserMood(message: string): {
  mood: string;
  intensity: 'low' | 'medium' | 'high';
  keywords: string[];
} {
  const lowerMessage = message.toLowerCase();

  // Anxiety indicators
  const anxietyWords = ['anxious', 'anxiety', 'panic', 'scared', 'worried', 'nervous', 'afraid', 'stress', 'terrified'];
  const anxietyCount = anxietyWords.filter(word => lowerMessage.includes(word)).length;

  // Sadness indicators
  const sadnessWords = ['sad', 'depressed', 'hopeless', 'alone', 'lonely', 'worthless', 'cry', 'crying', 'empty', 'numb'];
  const sadnessCount = sadnessWords.filter(word => lowerMessage.includes(word)).length;

  // Anger/frustration indicators
  const angerWords = ['angry', 'mad', 'frustrated', 'hate', 'annoyed', 'irritated', 'furious'];
  const angerCount = angerWords.filter(word => lowerMessage.includes(word)).length;

  // Happiness indicators
  const happyWords = ['happy', 'good', 'better', 'proud', 'excited', 'great', 'wonderful', 'amazing'];
  const happyCount = happyWords.filter(word => lowerMessage.includes(word)).length;

  // Overwhelm indicators
  const overwhelmWords = ['overwhelmed', 'too much', 'can\'t handle', 'giving up', 'exhausted', 'tired'];
  const overwhelmCount = overwhelmWords.filter(word => lowerMessage.includes(word)).length;

  // Determine primary mood
  const moodScores = {
    anxious: anxietyCount,
    sad: sadnessCount,
    angry: angerCount,
    happy: happyCount,
    overwhelmed: overwhelmCount
  };

  const primaryMood = Object.entries(moodScores).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  const moodScore = moodScores[primaryMood];

  // Determine intensity
  let intensity: 'low' | 'medium' | 'high' = 'low';
  if (moodScore >= 3) intensity = 'high';
  else if (moodScore >= 2) intensity = 'medium';
  else if (moodScore >= 1) intensity = 'low';

  // If no clear mood, check for neutral/confused
  if (moodScore === 0) {
    return {
      mood: 'neutral',
      intensity: 'low',
      keywords: []
    };
  }

  return {
    mood: primaryMood,
    intensity,
    keywords: Object.entries(moodScores)
      .filter(([_, count]) => count > 0)
      .map(([mood, _]) => mood)
  };
}

// Generate response based on user's mood
function generateMoodBasedResponse(
  userMessage: string,
  moodData: { mood: string; intensity: string; keywords: string[] },
  conversationHistory: ChatMessage[]
): string {
  const { mood, intensity } = moodData;
  const lowerMessage = userMessage.toLowerCase();

  // Check if this is a follow-up to a previous question
  const lastAIMessage = conversationHistory.filter(m => m.sender === 'ai').slice(-1)[0];
  const askedQuestion = lastAIMessage?.content.includes('?');

  // ANXIOUS MOOD RESPONSES
  if (mood === 'anxious') {
    if (intensity === 'high') {
      // High anxiety - immediate calming + question
      const responses = [
        `Okay, I can hear that you're really anxious right now. First, let's get you grounded. Take a slow breath with me - in for 4, hold for 4, out for 4. ${askCalmingQuestion(lowerMessage)}`,
        `I hear you, and I know this anxiety feels overwhelming. You're safe right now, even though it doesn't feel like it. Let's try something: Can you name 5 things you can see around you right now? This will help ground you. ${askCalmingQuestion(lowerMessage)}`,
        `That sounds really intense, and I'm sorry you're feeling this way. Let's pause for a moment. Put your hand on your heart and take three slow breaths. ${askCalmingQuestion(lowerMessage)}`
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    } else if (intensity === 'medium') {
      // Medium anxiety - validate + explore + question
      const responses = [
        `I hear that you're feeling anxious. That's really tough. ${askExploringQuestion('anxiety', lowerMessage)}`,
        `Anxiety can feel so overwhelming. You're not alone in this. ${askExploringQuestion('anxiety', lowerMessage)}`,
        `I can sense the anxiety in what you're sharing. Let's talk through this together. ${askExploringQuestion('anxiety', lowerMessage)}`
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    } else {
      // Low anxiety - acknowledge + question
      const responses = [
        `I notice you're feeling a bit anxious. ${askExploringQuestion('anxiety', lowerMessage)}`,
        `It sounds like there's some anxiety there. ${askExploringQuestion('anxiety', lowerMessage)}`
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }

  // SAD MOOD RESPONSES
  if (mood === 'sad') {
    if (intensity === 'high') {
      // High sadness - deep empathy + question
      const responses = [
        `I'm really sorry you're feeling this way. That sounds so painful, and I want you to know that your feelings are completely valid. ${askSupportiveQuestion('sadness', lowerMessage)}`,
        `I can hear how much you're hurting right now, and I'm here with you. You don't have to go through this alone. ${askSupportiveQuestion('sadness', lowerMessage)}`,
        `This sounds really heavy, and I'm so sorry you're carrying this. ${askSupportiveQuestion('sadness', lowerMessage)}`
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    } else {
      // Medium/low sadness - validate + question
      const responses = [
        `I hear that you're feeling down. ${askSupportiveQuestion('sadness', lowerMessage)}`,
        `That sounds tough. I'm here to listen. ${askSupportiveQuestion('sadness', lowerMessage)}`
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }

  // ANGRY/FRUSTRATED MOOD RESPONSES
  if (mood === 'angry') {
    const responses = [
      `I can hear the frustration in what you're sharing, and that's completely understandable. ${askValidatingQuestion('anger', lowerMessage)}`,
      `It sounds like you're really frustrated right now. Your feelings are valid. ${askValidatingQuestion('anger', lowerMessage)}`,
      `I get that you're angry about this. That makes total sense. ${askValidatingQuestion('anger', lowerMessage)}`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // HAPPY MOOD RESPONSES
  if (mood === 'happy') {
    const responses = [
      `That's wonderful! I'm so happy for you! 🌟 ${askCelebratingQuestion(lowerMessage)}`,
      `This is amazing! I love hearing this! ${askCelebratingQuestion(lowerMessage)}`,
      `I'm so glad you're feeling good! That's fantastic! ${askCelebratingQuestion(lowerMessage)}`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // OVERWHELMED MOOD RESPONSES
  if (mood === 'overwhelmed') {
    const responses = [
      `Okay, I hear you - everything feels like too much right now. Let's break this down together. ${askPrioritizingQuestion(lowerMessage)}`,
      `When everything feels overwhelming, we need to take it one step at a time. ${askPrioritizingQuestion(lowerMessage)}`,
      `I can sense you're feeling really overwhelmed. Let's figure out what we can tackle first. ${askPrioritizingQuestion(lowerMessage)}`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // NEUTRAL/UNCLEAR MOOD - Ask to understand better
  return askUnderstandingQuestion(lowerMessage);
}

// Generate calming questions for anxious users
function askCalmingQuestion(message: string): string {
  if (message.includes('eat') || message.includes('food') || message.includes('meal')) {
    const questions = [
      "What's the smallest, easiest thing you could try eating right now? Even just a few bites?",
      "Is there someone you could call to sit with you while you eat? Sometimes that helps.",
      "What usually helps you feel a bit calmer when you're anxious about eating?"
    ];
    return questions[Math.floor(Math.random() * questions.length)];
  }

  const questions = [
    "What triggered this anxiety? Sometimes naming it helps.",
    "Is there something specific that's making you feel this way right now?",
    "What's one small thing that might help you feel even a tiny bit calmer?",
    "Have you tried any grounding techniques before? What's worked for you in the past?"
  ];
  return questions[Math.floor(Math.random() * questions.length)];
}

// Generate exploring questions for anxiety
function askExploringQuestion(emotion: string, message: string): string {
  if (message.includes('eat') || message.includes('food')) {
    const questions = [
      "What about eating is making you feel anxious right now?",
      "Is it a specific food, or the act of eating itself that feels hard?",
      "What thoughts are coming up for you around food right now?"
    ];
    return questions[Math.floor(Math.random() * questions.length)];
  }

  const questions = [
    "What's going through your mind right now? Can you tell me more?",
    "When did you start feeling this way? Was there a specific trigger?",
    "What's the hardest part about what you're experiencing?",
    "How long have you been feeling like this?"
  ];
  return questions[Math.floor(Math.random() * questions.length)];
}

// Generate supportive questions for sadness
function askSupportiveQuestion(emotion: string, message: string): string {
  const questions = [
    "Do you want to talk about what's making you feel this way?",
    "What's been the hardest part of today for you?",
    "Is there anyone in your life you feel comfortable reaching out to right now?",
    "What do you need most right now - someone to listen, or help figuring out what to do?",
    "Have you been feeling this way for a while, or did something specific happen?"
  ];
  return questions[Math.floor(Math.random() * questions.length)];
}

// Generate validating questions for anger
function askValidatingQuestion(emotion: string, message: string): string {
  const questions = [
    "What happened that made you feel this way?",
    "That sounds really frustrating. Do you want to tell me more about it?",
    "What's making you most angry about this situation?",
    "How long have you been feeling frustrated about this?"
  ];
  return questions[Math.floor(Math.random() * questions.length)];
}

// Generate celebrating questions for happiness
function askCelebratingQuestion(message: string): string {
  const questions = [
    "Tell me more - what made today so good?",
    "What do you think helped you feel this way? Let's remember it!",
    "That's amazing! What was the best part?",
    "I love this! What are you most proud of?",
    "What happened that made you feel so good?"
  ];
  return questions[Math.floor(Math.random() * questions.length)];
}

// Generate prioritizing questions for overwhelm
function askPrioritizingQuestion(message: string): string {
  const questions = [
    "What's the ONE thing that feels most urgent right now?",
    "If you could only tackle one thing today, what would it be?",
    "What's making you feel most overwhelmed - can you name the biggest thing?",
    "Let's start small - what's one tiny step you could take right now?"
  ];
  return questions[Math.floor(Math.random() * questions.length)];
}

// Generate understanding questions for unclear mood
function askUnderstandingQuestion(message: string): string {
  const questions = [
    "How are you feeling about all of this? I want to understand better.",
    "What's on your mind right now? Tell me more.",
    "How has your day been going? What's been happening?",
    "I'm here to listen. What do you need to talk about?",
    "What's the main thing that's bothering you right now?"
  ];
  return questions[Math.floor(Math.random() * questions.length)];
}

// Handle specific situations
function handleSpecificSituations(message: string): string | null {
  const lowerMessage = message.toLowerCase();

  // Greetings
  if (lowerMessage.match(/^(hi|hello|hey|good morning|good afternoon)/)) {
    const greetings = [
      "Hey! I'm so glad you're here. How are you doing today? What's on your mind?",
      "Hi there! It's good to hear from you. How are you feeling right now?",
      "Hello! How's your day going so far? What would you like to talk about?",
      "Hey friend! What's going on with you today?"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  // Diet/weight questions
  if (lowerMessage.includes('diet') || lowerMessage.includes('lose weight') || lowerMessage.includes('weight loss') || lowerMessage.includes('diet plan')) {
    return "Hey, I get that you're thinking about this, but honestly? Diets can be really harmful, especially in recovery. They usually make things worse, not better. What's really going on? What made you start thinking about dieting? I'm here to listen and help you figure out what you actually need right now. 💙";
  }

  // Crisis
  if (lowerMessage.includes('suicide') || lowerMessage.includes('kill myself') || lowerMessage.includes('self-harm') || lowerMessage.includes('hurt myself') || lowerMessage.includes('end it all')) {
    return "I'm really worried about you right now, and I need you to know that you don't have to go through this alone. Please, please reach out for help right now. Text HOME to 741741 (Crisis Text Line) or call 988 (Suicide Prevention Lifeline). These people are trained to help and they care. You matter so much. If you have a therapist or someone you trust, please call them too. Can you promise me you'll reach out to one of these resources? 💙";
  }

  // Thank you
  if (lowerMessage.includes('thank')) {
    return "You're so welcome! I'm always here when you need to talk. How are you feeling now? Is there anything else on your mind?";
  }

  return null;
}

// Main function - generates intelligent, mood-aware responses
export const getChatGPTResponse = async (
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): Promise<string> => {
  console.log("Analyzing message and generating response...");

  // Add natural typing delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Check for specific situations first
  const specificResponse = handleSpecificSituations(userMessage);
  if (specificResponse) {
    return specificResponse;
  }

  // Detect user's mood
  const moodData = detectUserMood(userMessage);
  console.log("Detected mood:", moodData);

  // Generate mood-based response with questions
  const response = generateMoodBasedResponse(userMessage, moodData, conversationHistory);

  return response;
};

// Save chat message to user's account
export const saveChatMessage = async (userId: string, message: ChatMessage): Promise<void> => {
  try {
    await chatAPI.saveMessage(message.content, message.sender === "user");
  } catch (error) {
    console.error("Error saving chat message:", error);
    throw error;
  }
};

// Get chat history for a user
export const getUserChatHistory = async (userId: string): Promise<ChatMessage[]> => {
  try {
    const messages = await chatAPI.getHistory();
    return messages.map((msg: any) => ({
      id: msg._id || msg.id,
      sender: msg.isUser ? "user" : "ai",
      content: msg.content,
      timestamp: new Date(msg.timestamp)
    }));
  } catch (error) {
    console.error("Error getting chat history:", error);
    return [];
  }
};