
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import ChatMessage from "@/components/ChatMessage";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
}

const aiResponses: Record<string, string[]> = {
  default: [
    "I'm here to support you on your recovery journey. How can I help you today?",
    "Remember that recovery isn't linear, and small steps forward are still progress.",
    "That sounds challenging. Would you like to talk more about coping strategies for this situation?",
    "You're showing great courage by facing these challenges. Let's think about some strategies that might help.",
    "I'm here to listen whenever you need support. Would you like some suggestions for managing this?"
  ],
  anxiety: [
    "When you feel anxious around food, try taking slow deep breaths and remind yourself that it's okay to nourish your body.",
    "Many people experience food anxiety during recovery. Gradual exposure in a supportive environment can help reduce these feelings over time.",
    "Remember that your worth isn't determined by what or how much you eat. You deserve to enjoy food without anxiety."
  ],
  urges: [
    "When you feel the urge to engage in eating disorder behaviors, try the 5-minute delay technique. Often urges will subside after a short period.",
    "Distraction can be helpful when urges are strong - perhaps try calling a friend, going for a walk, or engaging in an activity you enjoy.",
    "Remind yourself why recovery is important to you. What values and goals are you working toward that the eating disorder interferes with?"
  ],
  body: [
    "Body image challenges are a common part of recovery. Remember that your body is much more than its appearance - it allows you to experience life.",
    "Try to focus on what your body can do rather than how it looks. Appreciate the strength, function and resilience it provides.",
    "Consider limiting social media that makes you feel negative about your body, and follow accounts that promote body diversity and acceptance."
  ],
  meals: [
    "Establishing regular meals and snacks is important, even when it feels difficult. Starting with a structured eating plan can be helpful.",
    "It's normal to feel uncomfortable when changing eating patterns. This discomfort is temporary and will decrease with consistency.",
    "Remember that all foods can fit in recovery. Categorizing foods as 'good' or 'bad' often reinforces eating disorder thoughts."
  ]
};

const getRelevantResponse = (message: string): string => {
  message = message.toLowerCase();
  
  if (message.includes("anxious") || message.includes("anxiety") || message.includes("scared")) {
    const responses = aiResponses.anxiety;
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  if (message.includes("urge") || message.includes("want to") || message.includes("feeling like")) {
    const responses = aiResponses.urges;
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  if (message.includes("body") || message.includes("weight") || message.includes("look")) {
    const responses = aiResponses.body;
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  if (message.includes("eat") || message.includes("food") || message.includes("meal") || message.includes("hungry")) {
    const responses = aiResponses.meals;
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  const defaultResponses = aiResponses.default;
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
};

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hi there! I'm your AI recovery assistant. You can share your thoughts, concerns, or questions about your eating disorder recovery journey here. How are you feeling today?",
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [userName, setUserName] = useState("User");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user has completed onboarding
    const storedName = localStorage.getItem("user_name");
    
    if (!storedName) {
      navigate("/onboarding/1");
      return;
    }
    
    setUserName(storedName);
  }, [navigate]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);
    
    // Simulate AI thinking and typing
    setTimeout(() => {
      const aiResponse = getRelevantResponse(inputValue);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar userName={userName} />
      
      <div className="flex-grow flex flex-col container mx-auto px-4 py-6 max-w-3xl">
        <h1 className="text-2xl font-bold mb-6">AI Support Chat</h1>
        
        <div className="bg-white rounded-lg border border-gray-200 flex-grow flex flex-col">
          <div className="flex-grow overflow-y-auto p-4 md:p-6">
            <div className="space-y-4">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  content={message.content}
                  isUser={message.isUser}
                  timestamp={message.timestamp}
                />
              ))}
              
              {isTyping && (
                <div className="flex items-center space-x-2 text-gray-500 text-sm">
                  <div className="flex space-x-1">
                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></span>
                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-pulse delay-100"></span>
                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-pulse delay-200"></span>
                  </div>
                  <span>AI is typing...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-2">
              <Textarea
                placeholder="Type your message here..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-grow resize-none min-h-[80px]"
              />
              <Button className="h-[80px] w-[80px]" onClick={handleSendMessage}>
                <Send className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Note: This is a simulated AI chat. In a real application, this would connect to a properly trained AI model for eating disorder support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
