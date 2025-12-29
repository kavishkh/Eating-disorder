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

// Layer 1: Sentiment Detection (Mandatory)
const negativeKeywords = [
  "no good", "bad", "sad", "tired",
  "anxious", "depressed", "angry",
  "hopeless", "lonely", "hate", "worthless", "heavy", "pain"
];

const crisisKeywords = [
  "disappear", "want to disappear", "hate myself", "don't want to eat anymore",
  "kill myself", "suicide", "end it all", "hurt myself", "worthless"
];

// Detect user's mood and check for crisis
function analyzeUserMessage(message: string): {
  sentiment: 'negative' | 'positive' | 'neutral' | 'crisis';
  responseType: 'supportive' | 'positive' | 'crisis-safe' | 'neutral';
} {
  const lowerMessage = message.toLowerCase();

  // CRISIS DETECTION FIRST (Priority)
  const isCrisis = crisisKeywords.some(phrase => lowerMessage.includes(phrase));
  if (isCrisis) {
    return { sentiment: 'crisis', responseType: 'crisis-safe' };
  }

  // SENTIMENT DETECTION
  const isNegative = negativeKeywords.some(word => lowerMessage.includes(word));

  if (isNegative) {
    return { sentiment: 'negative', responseType: 'supportive' };
  }

  // Positive detection
  const positiveKeywords = ["great", "amazing", "happy", "better", "proud", "good", "wonderful"];
  const isPositive = positiveKeywords.some(word => lowerMessage.includes(word));

  if (isPositive) {
    return { sentiment: 'positive', responseType: 'positive' };
  }

  return { sentiment: 'neutral', responseType: 'neutral' };
}

// Layer 3: Proper Prompt Engineering (Mocked for current implementation)
// This logic will be used when we transition to a real LLM.
const SYSTEM_PROMPT = `
You are a mental health support assistant for an eating disorder recovery app.
Rules:
- Never celebrate distress
- If the user expresses negative emotions, respond with empathy and support
- Validate feelings before asking questions
- Do not give medical advice
- Use calm, gentle language
- If user feels bad, comfort them first
- If user expresses crisis thoughts, prioritize safety and suggest professional help.
`;

// Handle specific situations including Crisis Safety
function handleSpecificSituations(message: string): string | null {
  const lowerMessage = message.toLowerCase();
  const analysis = analyzeUserMessage(message);

  // Crisis Safety - VERY IMPORTANT
  if (analysis.responseType === 'crisis-safe') {
    return "I'm really worried hearing that, and I want you to know that you don't have to go through this alone. 💙 Your life matters so much. Please reach out to someone who can help right now:\n\n" +
      "• Crisis Text Line: Text HOME to 741741\n" +
      "• Suicide & Crisis Lifeline: Call 988\n\n" +
      "Encourage reaching out to a trusted person. I'm here to listen, but these professionals can provide the immediate safety support you deserve.";
  }

  // Greetings
  if (lowerMessage.match(/^(hi|hello|hey|good morning|good afternoon)/) && !negativeKeywords.some(w => lowerMessage.includes(w))) {
    const greetings = [
      "Hey! I'm so glad you're here. How are you doing today? What's on your mind?",
      "Hi there! It's good to hear from you. How are you feeling right now?",
      "Hello! How's your day going so far? What would you like to talk about?"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  // Diet/weight questions - Validation + Redirection
  if (lowerMessage.includes('diet') || lowerMessage.includes('lose weight') || lowerMessage.includes('weight loss')) {
    return "I hear you're thinking about your body or weight, which can be a heavy weight to carry in recovery. 💙 Diets often promise control but can end up causing more distress. I'm curious, what's feeling hardest for you right now that's bringing up these thoughts?";
  }

  // Negative Sentiment Routing (Layer 2)
  if (analysis.responseType === 'supportive') {
    const supportiveResponses = [
      "I’m really sorry you’re feeling this way. That can be really tough. I’m glad you shared this with me. Do you want to tell me what’s making today feel hard?",
      "I hear how heavy things feel right now. It's completely okay to not be okay. I'm here to listen—what's on your mind?",
      "That sounds incredibly difficult. Thank you for Being honest about how you're feeling. I'm right here with you. What's the biggest thing weighing on you?"
    ];
    return supportiveResponses[Math.floor(Math.random() * supportiveResponses.length)];
  }

  // Positive/Neutral default handled in main function
  return null;
}

// Generate response based on analysis
function getFallbackAIResponse(message: string, analysis: any): string {
  const lowerMessage = message.toLowerCase();

  if (analysis.responseType === 'positive') {
    return `I'm so glad to hear things are feeling a bit better! 🌟 It's wonderful to see these positive moments in your recovery. What do you think helped you get to this good place today?`;
  }

  return "Thank you for sharing that with me. I'm here for you. Could you tell me more about what's going through your mind?";
}

// Main function - generates intelligent, mood-aware responses
export const getChatGPTResponse = async (
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): Promise<string> => {
  console.log("Analyzing sentiment and safety...");

  // Add natural typing delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Check for specific situations, crisis, and sentiment routing
  const routedResponse = handleSpecificSituations(userMessage);
  if (routedResponse) {
    return routedResponse;
  }

  // Fallback for neutral messages
  const analysis = analyzeUserMessage(userMessage);
  return getFallbackAIResponse(userMessage, analysis);
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