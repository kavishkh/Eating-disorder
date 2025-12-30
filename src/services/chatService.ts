import { chatAPI } from "@/utils/api";

// Define message types
export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  content: string;
  timestamp: Date;
  type?: 'text' | 'video' | 'audio';
  video?: {
    title: string;
    videoId: string;
    platform: string;
  };
  audio?: {
    title: string;
    src: string;
  };
  followUp?: string;
  multiModal?: {
    type: 'exercise' | 'audio' | 'writing' | 'video';
    label: string;
    id: string;
  }[];
}

// Define chat session interface
export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  date: Date;
}

export const getChatGPTResponse = async (
  userMessage: string,
  chatId: string,
  conversationHistory: ChatMessage[] = []
): Promise<{
  reply: string;
  type?: 'text' | 'video' | 'audio';
  video?: any;
  audio?: any;
  followUp?: string;
  multiModal?: any[];
}> => {
  console.log("Requesting AI response from backend...");

  // Add natural typing delay (Step 8: 1200ms)
  await new Promise(resolve => setTimeout(resolve, 1200));

  try {
    const response = await chatAPI.getReply(userMessage, chatId);
    return {
      reply: response.reply || response.text,
      type: response.type,
      video: response.video,
      audio: response.audio,
      followUp: response.followUp,
      multiModal: response.multiModal
    };
  } catch (error) {
    console.error("Error getting AI response:", error);
    // Fallback if backend fails (though ideally shouldn't happen)
    return {
      reply: "I'm having trouble connecting right now. I'm still here with you—could you try sending that again?",
      type: 'text'
    };
  }
};

// Start a new chat session
export const initializeNewChat = async (): Promise<string> => {
  try {
    const response = await chatAPI.createChat();
    return response.chatId;
  } catch (error) {
    console.error("Error initializing new chat:", error);
    throw error;
  }
};

// Save chat message to user's account
export const saveChatMessage = async (userId: string, message: ChatMessage, chatId: string): Promise<void> => {
  try {
    await chatAPI.saveMessage(message.content, message.sender === "user", chatId);
  } catch (error) {
    console.error("Error saving chat message:", error);
    throw error;
  }
};

// Get chat sessions for a user
export const getUserChatSessions = async (): Promise<any[]> => {
  try {
    return await chatAPI.getSessions();
  } catch (error) {
    console.error("Error getting chat sessions:", error);
    return [];
  }
};

// Get chat history for a specific session
export const getChatMessages = async (chatId: string): Promise<ChatMessage[]> => {
  try {
    const messages = await chatAPI.getMessages(chatId);
    return messages.map((msg: any) => ({
      id: msg._id || msg.id,
      sender: msg.isUser ? "user" : "ai",
      content: msg.content,
      timestamp: new Date(msg.timestamp),
      type: msg.type,
      video: msg.video,
      audio: msg.audio,
      followUp: msg.followUp,
      multiModal: msg.multiModal
    }));
  } catch (error) {
    console.error("Error getting chat history:", error);
    return [];
  }
};

export const deleteChatSession = async (chatId: string): Promise<boolean> => {
  try {
    await chatAPI.clearHistory(chatId);
    return true;
  } catch (error) {
    console.error("Error deleting chat session:", error);
    return false;
  }
};