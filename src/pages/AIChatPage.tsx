
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import AppLayout from "../components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Send, 
  Bot, 
  User, 
  Info, 
  RefreshCw,
  MoveDown,
  Smile,
  Frown,
  Meh
} from "lucide-react";

// Define message types
interface Message {
  id: string;
  sender: "user" | "ai";
  content: string;
  timestamp: Date;
}

// Mock AI responses for demo purposes
const mockAIResponses = [
  "I understand that recovery can feel challenging sometimes. What specific struggles are you facing today?",
  "It's completely normal to have mixed feelings about recovery. Your emotions are valid, and it's important to acknowledge them.",
  "That's a great insight! Recognizing your patterns is a significant step in your recovery journey.",
  "Remember that healing isn't linear - there will be ups and downs, but each step forward matters.",
  "What coping strategies have worked for you in the past when you've felt this way?",
  "It sounds like you're making progress, even if it doesn't always feel that way. Small steps add up over time.",
  "I'm here to support you through your journey. What would be most helpful to discuss today?",
  "That must be difficult to navigate. How are you taking care of yourself during this challenging time?",
  "Have you considered talking to your healthcare provider about these feelings?",
  "It's brave of you to share these thoughts. Would it help to explore some mindfulness exercises together?"
];

const AIChatPage = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-message",
      sender: "ai",
      content: `Hi ${currentUser?.name || "there"}! I'm your Recovery Companion, here to support you on your journey. How are you feeling today?`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check if should show scroll button
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const bottomThreshold = 100;
    setShowScrollButton(scrollHeight - scrollTop - clientHeight > bottomThreshold);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: inputMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      const randomResponse = mockAIResponses[Math.floor(Math.random() * mockAIResponses.length)];
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        content: randomResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)]">
        <div className="mb-4">
          <h2 className="text-2xl font-bold tracking-tight text-healing-900">AI Support Chat</h2>
          <p className="text-muted-foreground">
            Chat with your AI companion for support, guidance, and encouragement
          </p>
        </div>

        <Card className="flex-1 flex flex-col border-healing-200 overflow-hidden">
          <CardHeader className="bg-healing-50 border-b border-healing-100 px-4 py-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2 bg-healing-200">
                  <AvatarFallback className="bg-healing-500 text-white">AI</AvatarFallback>
                  <AvatarImage src="/placeholder.svg" />
                </Avatar>
                <div>
                  <CardTitle className="text-sm text-healing-800">Recovery Companion</CardTitle>
                  <CardDescription className="text-xs">AI-powered support</CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-healing-700">
                <Info className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent 
            className="flex-1 overflow-y-auto p-4 space-y-4"
            onScroll={handleScroll}
          >
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`flex items-start max-w-[80%] ${
                    message.sender === "user" 
                      ? "bg-healing-500 text-white rounded-l-lg rounded-tr-lg" 
                      : "bg-gray-100 text-gray-800 rounded-r-lg rounded-tl-lg"
                  } px-4 py-3 shadow-sm`}
                >
                  {message.sender === "ai" && (
                    <Avatar className="h-8 w-8 mr-2 mt-0.5 bg-healing-200 shrink-0">
                      <AvatarFallback className="bg-healing-500 text-white">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    <p className={`text-sm ${message.sender === "user" ? "" : "text-gray-800"}`}>
                      {message.content}
                    </p>
                    <p className={`text-xs mt-1 ${
                      message.sender === "user" ? "text-healing-100" : "text-gray-500"
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {message.sender === "user" && (
                    <Avatar className="h-8 w-8 ml-2 mt-0.5 bg-healing-600 shrink-0">
                      <AvatarFallback className="bg-healing-600 text-white">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                      <AvatarImage src={currentUser?.name ? `https://ui-avatars.com/api/?name=${currentUser.name}&background=9b87f5&color=fff` : ""} />
                    </Avatar>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-r-lg rounded-tl-lg px-4 py-3 shadow-sm max-w-[80%]">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2 bg-healing-200 shrink-0">
                      <AvatarFallback className="bg-healing-500 text-white">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 rounded-full bg-healing-400 animate-pulse"></div>
                      <div className="h-2 w-2 rounded-full bg-healing-400 animate-pulse delay-150"></div>
                      <div className="h-2 w-2 rounded-full bg-healing-400 animate-pulse delay-300"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </CardContent>

          {showScrollButton && (
            <Button
              variant="outline"
              size="icon"
              className="absolute bottom-20 right-8 rounded-full bg-white shadow-md border-healing-200"
              onClick={scrollToBottom}
            >
              <MoveDown className="h-4 w-4" />
            </Button>
          )}
          
          <CardFooter className="bg-white border-t border-healing-100 p-3">
            <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
              <div className="flex space-x-2 mr-2">
                <Button type="button" variant="outline" size="icon" className="rounded-full h-8 w-8">
                  <Smile className="h-4 w-4 text-healing-600" />
                </Button>
              </div>
              
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border-healing-200 focus-visible:ring-healing-500"
              />
              
              <Button 
                type="submit" 
                size="icon" 
                disabled={!inputMessage.trim() || isTyping}
                className="bg-healing-500 hover:bg-healing-600 text-white rounded-full h-9 w-9 p-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AIChatPage;
