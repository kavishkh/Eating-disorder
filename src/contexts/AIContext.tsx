
import React, { createContext, useContext, useState, useRef } from 'react';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface AIContextType {
  messages: Message[];
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  isTyping: boolean;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const useAI = () => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};

// Crisis detection keywords
const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'end my life', 'want to die', 
  'self-harm', 'hurt myself', 'harming myself',
  'starving myself', 'not eating', 'purge'
];

// Support responses
const SUPPORT_RESPONSES = [
  "I'm here to support you through recovery, but I'm not a replacement for professional help. Can we discuss some coping strategies that might help in this moment?",
  "That sounds really difficult. Would you like to explore some grounding techniques that might help you get through this moment?",
  "I'm here to listen and support you. Have you spoken with your healthcare provider about what you're experiencing?",
  "It takes courage to share these thoughts. Would you like to talk about some healthier coping mechanisms we could try?",
  "I'm concerned about what you're sharing. Have you considered reaching out to a crisis helpline where trained counselors can provide immediate support?"
];

// Crisis protocol responses
const CRISIS_RESPONSES = [
  "I'm concerned about what you've shared. This sounds like a situation where professional help would be valuable. Would it be okay if I provided you with some crisis resources?",
  "What you're describing sounds serious, and I want to make sure you get the support you need. There are trained professionals available 24/7 who can help. Would you like me to share some contact information?",
  "I think it's important that you speak with a mental health professional about what you're experiencing. There are resources available right now that can help. Would you like me to share them?"
];

// Crisis resources
const CRISIS_RESOURCES = [
  "National Eating Disorders Association Helpline: 1-800-931-2237",
  "Crisis Text Line: Text HOME to 741741",
  "National Suicide Prevention Lifeline: 1-800-273-8255",
  "Remember that you deserve support and that recovery is possible."
];

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello, I'm here to support you on your journey toward a healthier relationship with food and body image. How are you feeling today?",
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const contextRef = useRef<string[]>([]);

  const detectCrisis = (message: string): boolean => {
    const lowerMessage = message.toLowerCase();
    return CRISIS_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
  };

  const getRandomResponse = (responseArray: string[]): string => {
    return responseArray[Math.floor(Math.random() * responseArray.length)];
  };

  const simulateResponse = async (userMessage: string): Promise<string> => {
    // Store context for conversation memory (limited to last 5 messages)
    if (contextRef.current.length >= 5) {
      contextRef.current.shift();
    }
    contextRef.current.push(userMessage);
    
    // Crisis detection
    if (detectCrisis(userMessage)) {
      // Trigger crisis protocol
      const crisisResponse = getRandomResponse(CRISIS_RESPONSES);
      const resources = CRISIS_RESOURCES.join('\n\n');
      return `${crisisResponse}\n\n${resources}`;
    }
    
    // Normal response - would be replaced with actual AI model
    const supportResponse = getRandomResponse(SUPPORT_RESPONSES);
    
    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    return supportResponse;
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    try {
      // Get AI response
      const responseContent = await simulateResponse(content);
      
      // Add AI message
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: responseContent,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast.error('Sorry, I had trouble responding. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  const clearMessages = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: "Hello, I'm here to support you on your journey toward a healthier relationship with food and body image. How are you feeling today?",
        timestamp: new Date()
      }
    ]);
    contextRef.current = [];
  };

  const value = {
    messages,
    sendMessage,
    clearMessages,
    isTyping
  };

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
};
