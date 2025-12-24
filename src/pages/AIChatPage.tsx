import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import AppLayout from "../components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  MoveDown,
  RefreshCw,
  CloudOff,
  Bug,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage, getChatGPTResponse, saveChatMessage, getUserChatHistory } from "@/services/chatService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Add this new component for API debugging
const ApiErrorDebug = ({ error, onClose }) => {
  const [expanded, setExpanded] = useState(false);

  if (!error) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <Card className="border-red-300 shadow-lg">
        <CardHeader className="bg-red-50 px-4 py-2 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Bug className="h-4 w-4 text-red-500" />
            <CardTitle className="text-sm text-red-700">API Error Details</CardTitle>
          </div>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-3 text-xs bg-white">
          <div className="font-semibold text-red-600 mb-1">
            {error.name || "Error"}: {error.message || "Unknown error"}
          </div>

          {!expanded ? (
            <Button
              variant="link"
              className="p-0 h-auto text-xs text-blue-600"
              onClick={() => setExpanded(true)}
            >
              Show details
            </Button>
          ) : (
            <div className="mt-2 space-y-2">
              <div>
                <div className="font-medium mb-1">Error Stack:</div>
                <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto max-h-40">
                  {error.stack || "No stack trace available"}
                </pre>
              </div>

              {error.response && (
                <div>
                  <div className="font-medium mb-1">Response:</div>
                  <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto max-h-40">
                    {JSON.stringify(error.response, null, 2)}
                  </pre>
                </div>
              )}

              <Button
                variant="link"
                className="p-0 h-auto text-xs text-blue-600"
                onClick={() => setExpanded(false)}
              >
                Hide details
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-red-50 px-4 py-2 border-t border-red-200">
          <div className="text-xs text-red-700">
            <strong>Fix:</strong> Check API version, model name, and API key permissions
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

const AIChatPage = () => {
  const { currentUser } = useAuth();

  // Chat session management
  const [currentSessionId, setCurrentSessionId] = useState<string>(() => {
    return `session-${Date.now()}`;
  });
  const [chatSessions, setChatSessions] = useState<{ [key: string]: ChatMessage[] }>({});

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-message",
      sender: "ai",
      content: `Hey ${currentUser?.name || "friend"}! 😊\n\nI'm so glad you're here. I know recovery can feel really lonely sometimes, but you're not alone - I'm here for you whenever you need to talk.\n\nWhether you're having a tough day, need help figuring something out, or just want someone to listen - I'm here. No judgment, just support.\n\nSo... how are you doing today? What's on your mind? 💙`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  const [retryingConnection, setRetryingConnection] = useState(false);
  const [showChatHistory, setShowChatHistory] = useState(false);

  // Add these new state variables for error debugging
  const [apiError, setApiError] = useState(null);
  const [debugMode, setDebugMode] = useState(false);

  // Load chat history when component mounts
  useEffect(() => {
    const loadChatHistory = async () => {
      if (currentUser?.id) {
        try {
          setIsLoading(true);
          setConnectionError(false);

          // Check internet connection first
          if (!navigator.onLine) {
            setConnectionError(true);
            setIsLoading(false);
            return;
          }

          const history = await getUserChatHistory(currentUser.id);

          if (history.length > 0) {
            setMessages(history);
          }
        } catch (error) {
          console.error("Error loading chat history:", error);
          setConnectionError(true);
          setApiError(error);
          toast({
            title: "Error",
            description: "Failed to load chat history. Please try refreshing the page.",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    loadChatHistory();

    // Set up online/offline event listeners
    const handleOnline = () => {
      setConnectionError(false);
      toast({
        title: "Back online",
        description: "Your connection has been restored.",
        variant: "default"
      });
    };

    const handleOffline = () => {
      setConnectionError(true);
      toast({
        title: "You're offline",
        description: "Check your internet connection.",
        variant: "destructive"
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [currentUser, toast]);

  // Add Debug Mode toggle (hidden unless Ctrl+Shift+D is pressed)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setDebugMode(prev => !prev);
        toast({
          title: debugMode ? "Debug Mode Disabled" : "Debug Mode Enabled",
          description: debugMode ? "Error details will be hidden" : "Error details will be shown",
        });
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [debugMode, toast]);

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

  // Handle starting a new chat
  const handleNewChat = () => {
    // Save current chat to sessions with timestamp
    if (messages.length > 1) { // More than just welcome message
      const sessionDate = new Date().toISOString();
      setChatSessions(prev => ({
        ...prev,
        [currentSessionId]: messages
      }));

      // Save to localStorage for persistence
      const savedSessions = JSON.parse(localStorage.getItem('chatSessions') || '{}');
      savedSessions[currentSessionId] = {
        messages,
        date: sessionDate
      };
      localStorage.setItem('chatSessions', JSON.stringify(savedSessions));
    }

    // Create new session
    const newSessionId = `session-${Date.now()}`;
    setCurrentSessionId(newSessionId);

    // Reset messages to welcome message
    setMessages([
      {
        id: "welcome-message",
        sender: "ai",
        content: `Hey ${currentUser?.name || "friend"}! 😊\n\nI'm so glad you're here. I know recovery can feel really lonely sometimes, but you're not alone - I'm here for you whenever you need to talk.\n\nWhether you're having a tough day, need help figuring something out, or just want someone to listen - I'm here. No judgment, just support.\n\nSo... how are you doing today? What's on your mind? 💙`,
        timestamp: new Date()
      }
    ]);

    toast({
      title: "New chat started",
      description: "Your previous conversation has been saved",
    });
  };

  // Load a previous chat session
  const loadChatSession = (sessionId: string) => {
    const savedSessions = JSON.parse(localStorage.getItem('chatSessions') || '{}');
    if (savedSessions[sessionId]) {
      setMessages(savedSessions[sessionId].messages);
      setCurrentSessionId(sessionId);
      setShowChatHistory(false);

      toast({
        title: "Chat loaded",
        description: "Previous conversation restored",
      });
    }
  };

  const handleRetryConnection = async () => {
    setRetryingConnection(true);

    // Simulate checking connection
    setTimeout(async () => {
      if (navigator.onLine) {
        setConnectionError(false);
        // Reload chat history if we're back online
        if (currentUser?.id) {
          try {
            const history = await getUserChatHistory(currentUser.id);
            if (history.length > 0) {
              setMessages(history);
            }
            toast({
              title: "Connection restored",
              description: "You can continue chatting now.",
              variant: "default"
            });
          } catch (error) {
            console.error("Error reloading chat history:", error);
            setConnectionError(true);
            setApiError(error);
          }
        }
      } else {
        toast({
          title: "Still offline",
          description: "Please check your internet connection and try again.",
          variant: "destructive"
        });
      }
      setRetryingConnection(false);
    }, 1500);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputMessage.trim()) return;

    // Check connection first
    if (!navigator.onLine || connectionError) {
      toast({
        title: "You're offline",
        description: "Please check your internet connection and try again.",
        variant: "destructive"
      });
      return;
    }

    // Clear previous errors
    setApiError(null);

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      // Save user message to database if user is logged in
      if (currentUser?.id) {
        await saveChatMessage(currentUser.id, userMessage);
      }

      // Get all previous messages for context
      const conversationHistory = [...messages];

      // Get AI response from ChatGPT API
      const responseText = await getChatGPTResponse(userMessage.content, conversationHistory);

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        content: responseText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

      // Save AI response to database if user is logged in
      if (currentUser?.id) {
        await saveChatMessage(currentUser.id, aiMessage);
      }

      setIsTyping(false);
    } catch (error) {
      // Enhanced error logging
      console.error("Error in chat:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
        response: error.response
      });

      // Store the detailed error for inspection
      setApiError(error);
      setConnectionError(true);

      // Show error message
      toast({
        title: "API Error",
        description: "Something went wrong with the AI service. Press Ctrl+Shift+D to view details.",
        variant: "destructive"
      });

      setIsTyping(false);
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)]">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-healing-900">Talk to Your Recovery Friend</h2>
            <p className="text-muted-foreground">
              A caring friend who's here to listen, support you, and help you through tough moments
            </p>
          </div>
          <Button
            onClick={handleNewChat}
            variant="outline"
            className="flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New Chat
          </Button>
        </div>

        <Card className="flex-1 flex flex-col border-healing-200 overflow-hidden">
          <CardHeader className="bg-healing-50 border-b border-healing-100 px-4 py-3">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2 bg-healing-100">
                <AvatarImage src="/bot-avatar.png" />
                <AvatarFallback className="bg-healing-200 text-healing-700">
                  <Bot size={16} />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">Recovery Companion</CardTitle>
                <CardDescription className="text-xs">Your supportive AI assistant</CardDescription>
              </div>
            </div>
          </CardHeader>

          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-pulse text-healing-500">Loading conversation...</div>
            </div>
          ) : connectionError ? (
            <CardContent className="flex-1 flex flex-col items-center justify-center p-6">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                <CloudOff className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-800">Connection problem</h3>
              <p className="mb-6 max-w-md text-center text-gray-600">
                I'm having trouble connecting at the moment. Please try again in a few seconds.
              </p>
              <Button
                onClick={handleRetryConnection}
                className="flex items-center gap-2"
                disabled={retryingConnection}
              >
                {retryingConnection ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Checking connection...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    <span>Retry connection</span>
                  </>
                )}
              </Button>
              {debugMode && apiError && (
                <div className="mt-4 w-full max-w-md">
                  <Alert variant="destructive" className="text-xs">
                    <AlertTitle>API Error: {apiError.name || "Unknown Error"}</AlertTitle>
                    <AlertDescription className="mt-2 break-words">
                      {apiError.message}
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
          ) : (
            <CardContent
              className="flex-1 overflow-y-auto p-4 space-y-4"
              onScroll={handleScroll}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex items-start gap-2 max-w-[80%] ${msg.sender === "user" ? "flex-row-reverse" : ""
                      }`}
                  >
                    <Avatar className={`h-8 w-8 mt-0.5 ${msg.sender === "ai" ? "bg-healing-100" : "bg-accent"
                      }`}>
                      {msg.sender === "ai" ? (
                        <>
                          <AvatarImage src="/bot-avatar.png" />
                          <AvatarFallback className="bg-healing-200 text-healing-700">
                            <Bot size={16} />
                          </AvatarFallback>
                        </>
                      ) : (
                        <>
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-primary/20 text-primary">
                            <User size={16} />
                          </AvatarFallback>
                        </>
                      )}
                    </Avatar>

                    <div
                      className={`rounded-lg px-4 py-2 ${msg.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                        }`}
                    >
                      <div className="text-sm break-words whitespace-pre-wrap">{msg.content}</div>
                      <div className="text-[10px] opacity-70 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-2 max-w-[80%]">
                    <Avatar className="h-8 w-8 mt-0.5 bg-healing-100">
                      <AvatarImage src="/bot-avatar.png" />
                      <AvatarFallback className="bg-healing-200 text-healing-700">
                        <Bot size={16} />
                      </AvatarFallback>
                    </Avatar>

                    <div className="rounded-lg px-4 py-2 bg-muted">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 rounded-full bg-healing-400 animate-bounce" />
                        <div className="h-2 w-2 rounded-full bg-healing-400 animate-bounce [animation-delay:0.2s]" />
                        <div className="h-2 w-2 rounded-full bg-healing-400 animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </CardContent>
          )}

          <CardFooter className="p-3 border-t border-healing-100 bg-healing-50">
            <form onSubmit={handleSendMessage} className="flex w-full gap-2">
              <Input
                disabled={isTyping || isLoading || connectionError}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={connectionError ? "Connection problem..." : "Type your message..."}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={!inputMessage.trim() || isTyping || isLoading || connectionError}
                className="bg-healing-500 hover:bg-healing-600"
              >
                <Send size={18} />
                <span className="sr-only">Send message</span>
              </Button>
            </form>
          </CardFooter>

          {showScrollButton && (
            <Button
              variant="outline"
              size="icon"
              className="absolute bottom-20 right-6 rounded-full h-10 w-10 bg-primary text-primary-foreground opacity-80 hover:opacity-100 shadow-md"
              onClick={scrollToBottom}
            >
              <MoveDown size={18} />
              <span className="sr-only">Scroll to bottom</span>
            </Button>
          )}
        </Card>
      </div>

      {debugMode && apiError && (
        <ApiErrorDebug
          error={apiError}
          onClose={() => setApiError(null)}
        />
      )}
    </AppLayout>
  );
};

export default AIChatPage;
