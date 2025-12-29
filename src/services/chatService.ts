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

// Main function - generates intelligent, mood-aware responses via Backend
export const getChatGPTResponse = async (
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): Promise<string> => {
  console.log("Requesting AI response from backend...");

  // Add natural typing delay (Step 8: 1200ms)
  await new Promise(resolve => setTimeout(resolve, 1200));

  try {
    const response = await chatAPI.getReply(userMessage);
    return response.reply;
  } catch (error) {
    console.error("Error getting AI response:", error);
    // Fallback if backend fails (though ideally shouldn't happen)
    return "I'm having trouble connecting right now. I'm still here with you—could you try sending that again?";
  }
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