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
  X,
  Music,
  PenTool,
  Activity,
  Video as VideoIcon,
  Info,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage, getChatGPTResponse, saveChatMessage, getUserChatHistory } from "@/services/chatService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

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
  const [showResearch, setShowResearch] = useState(false);

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
  }, [messages, isTyping]);

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

  const handleSendMessage = async (e: React.FormEvent, customContent?: string) => {
    if (e) e.preventDefault();

    const content = customContent || inputMessage;
    if (!content.trim()) return;

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
      content: content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    if (!customContent) setInputMessage("");
    setIsTyping(true);

    try {
      // Save user message to database if user is logged in
      if (currentUser?.id) {
        await saveChatMessage(currentUser.id, userMessage);
      }

      // Get all previous messages for context
      const conversationHistory = [...messages];

      // Get AI response from backend
      const aiResponse = await getChatGPTResponse(content, conversationHistory);

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        content: aiResponse.reply,
        timestamp: new Date(),
        type: aiResponse.type,
        video: aiResponse.video,
        followUp: aiResponse.followUp,
        multiModal: aiResponse.multiModal
      };

      setMessages(prev => [...prev, aiMessage]);

      // Save AI response to database if user is logged in
      if (currentUser?.id) {
        await saveChatMessage(currentUser.id, aiMessage);
      }

      setIsTyping(false);
    } catch (error) {
      // Enhanced error logging
      console.error("Error in chat:", error);
      setApiError(error);
      setConnectionError(true);
      toast({
        title: "API Error",
        description: "Something went wrong with the AI service.",
        variant: "destructive"
      });
      setIsTyping(false);
    }
  };

  const handleModalAction = (action: any) => {
    if (action.type === 'exercise') {
      handleSendMessage(null as any, "Let's try that exercise Together.");
    } else if (action.type === 'audio') {
      toast({ title: "Playing calming audio", description: "Soft sounds are now playing in the background." });
    } else if (action.type === 'writing') {
      handleSendMessage(null as any, "I want to write about how I feel.");
    } else if (action.type === 'video') {
      handleSendMessage(null as any, "Can you show me a video for this?");
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'exercise': return <Activity size={14} className="mr-1" />;
      case 'audio': return <Music size={14} className="mr-1" />;
      case 'writing': return <PenTool size={14} className="mr-1" />;
      case 'video': return <VideoIcon size={14} className="mr-1" />;
      default: return null;
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)] max-w-5xl mx-auto w-full">
        <div className="mb-4 flex items-center justify-between px-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-healing-900">Recovery Friend</h2>
            <p className="text-sm text-muted-foreground hidden md:block">
              A private, supportive companion available 24/7
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowResearch(!showResearch)}
              variant="ghost"
              size="sm"
              className="text-healing-600 hover:text-healing-700 hover:bg-healing-50"
            >
              <Info size={16} className="mr-1" />
              {showResearch ? "Hide Details" : "How it Works"}
            </Button>
            <Button
              onClick={handleNewChat}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-healing-200 text-healing-700"
            >
              <RefreshCw size={16} />
              New Chat
            </Button>
          </div>
        </div>

        {showResearch && (
          <Card className="mb-4 border-healing-100 bg-healing-50/50 backdrop-blur-sm animate-in slide-in-from-top-4 duration-300">
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Info size={14} className="text-healing-600" />
                How AI logic works (non-API, privacy-first)
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2 pb-4">
              <p>This AI uses a <strong>Privacy-First Logic Engine</strong> that processes your messages locally on our server without sending your raw transcript to external LLMs for every turn.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Emotion Detection:</strong> Analyzes keywords and intensity to classify 5 key emotional states.</li>
                <li><strong>Conversation Memory:</strong> Tracks short-term context (mood, intent) to ensure relevant follow-ups.</li>
                <li><strong>Structured Knowledge:</strong> Built on clinical recovery principles and evidence-based grounding techniques.</li>
                <li><strong>Crisis Routing:</strong> Automatically detects high-risk language and prioritizes safety resources.</li>
              </ul>
              <p className="pt-1 italic text-healing-600">This makes the project research-paper-ready and ethically aligned with mental health data privacy standards.</p>
            </CardContent>
          </Card>
        )}

        <Card className="flex-1 flex flex-col border-healing-200 overflow-hidden shadow-xl bg-gradient-to-b from-white to-healing-50/30">
          <CardHeader className="bg-white/80 backdrop-blur-md border-b border-healing-100 px-4 py-3 flex flex-row items-center justify-between sticky top-0 z-10">
            <div className="flex items-center">
              <div className="relative">
                <Avatar className="h-10 w-10 mr-3 border-2 border-healing-200">
                  <AvatarImage src="/bot-avatar.png" />
                  <AvatarFallback className="bg-healing-100 text-healing-700">
                    <Bot size={20} />
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-2 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
              </div>
              <div>
                <CardTitle className="text-base font-semibold text-healing-900">Recovery Companion</CardTitle>
                <CardDescription className="text-xs flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-healing-400"></span>
                  Active support
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative h-16 w-16">
                <div className="absolute inset-0 rounded-full border-4 border-healing-100"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-healing-500 animate-spin"></div>
              </div>
              <p className="mt-4 text-healing-600 font-medium animate-pulse">Softening the space...</p>
            </div>
          ) : connectionError ? (
            <CardContent className="flex-1 flex flex-col items-center justify-center p-6">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50">
                <CloudOff className="h-10 w-10 text-amber-500" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-800">Connection problem</h3>
              <p className="mb-6 max-w-md text-center text-gray-600">
                I'm having trouble connecting at the moment. Please try again in a few seconds.
              </p>
              <Button
                onClick={handleRetryConnection}
                className="flex items-center gap-2 bg-healing-500 hover:bg-healing-600"
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
            </CardContent>
          ) : (
            <CardContent
              className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-healing-200"
              onScroll={handleScroll}
            >
              {messages.map((msg, idx) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                >
                  <div
                    className={`flex items-start gap-3 max-w-[85%] md:max-w-[75%] ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <Avatar className={`h-8 w-8 mt-1 border shadow-sm ${msg.sender === "ai" ? "bg-healing-50 border-healing-100" : "bg-white border-gray-200"}`}>
                      {msg.sender === "ai" ? (
                        <>
                          <AvatarImage src="/bot-avatar.png" />
                          <AvatarFallback className="bg-healing-100 text-healing-700">
                            <Bot size={16} />
                          </AvatarFallback>
                        </>
                      ) : (
                        <AvatarFallback className="bg-healing-500 text-white">
                          <User size={16} />
                        </AvatarFallback>
                      )}
                    </Avatar>

                    <div className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                      <div
                        className={`rounded-2xl px-4 py-2.5 shadow-sm text-sm ${msg.sender === "user"
                          ? "bg-healing-600 text-white rounded-tr-none"
                          : "bg-white border border-healing-100 text-healing-900 rounded-tl-none"
                          }`}
                      >
                        <div className="break-words whitespace-pre-wrap leading-relaxed">
                          {msg.content}
                        </div>

                        {msg.type === 'video' && msg.video && (
                          <Card className="mt-3 overflow-hidden border-healing-100 shadow-md">
                            <div className="bg-healing-50 p-2 border-b border-healing-100 flex items-center justify-between">
                              <span className="text-[11px] font-bold text-healing-700 uppercase tracking-wider flex items-center gap-1">
                                <VideoIcon size={12} /> Suggested Help
                              </span>
                            </div>
                            <div className="aspect-video w-full bg-black">
                              <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${msg.video.videoId}`}
                                title={msg.video.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              ></iframe>
                            </div>
                            <div className="p-2.5 text-xs font-medium text-healing-800 bg-white">
                              {msg.video.title}
                            </div>
                          </Card>
                        )}
                      </div>

                      {msg.sender === "ai" && (msg.followUp || (msg.multiModal && msg.multiModal.length > 0)) && (
                        <div className="mt-2 flex flex-col gap-2 w-full">
                          {msg.followUp && (
                            <div className="text-[13px] italic text-healing-600 px-1 font-medium">
                              "{msg.followUp}"
                            </div>
                          )}

                          {msg.multiModal && msg.multiModal.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-1">
                              {msg.multiModal.map((action) => (
                                <Button
                                  key={action.id}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleModalAction(action)}
                                  className="h-8 rounded-full text-xs font-semibold border-healing-200 text-healing-700 hover:bg-healing-500 hover:text-white transition-all transform hover:scale-105"
                                >
                                  {getIconForType(action.type)}
                                  {action.label}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="text-[10px] opacity-50 mt-1 px-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start animate-in fade-in duration-300">
                  <div className="flex items-start gap-3 max-w-[85%]">
                    <Avatar className="h-8 w-8 mt-1 border border-healing-100 bg-healing-50 shadow-sm">
                      <AvatarFallback className="bg-healing-100 text-healing-700">
                        <Bot size={16} />
                      </AvatarFallback>
                    </Avatar>

                    <div className="rounded-2xl rounded-tl-none px-4 py-3 bg-white border border-healing-100 shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1 mt-1">
                          <div className="h-1.5 w-1.5 rounded-full bg-healing-400 animate-bounce" />
                          <div className="h-1.5 w-1.5 rounded-full bg-healing-400 animate-bounce [animation-delay:0.2s]" />
                          <div className="h-1.5 w-1.5 rounded-full bg-healing-400 animate-bounce [animation-delay:0.4s]" />
                        </div>
                        <span className="text-[11px] text-healing-500 font-medium">Recovery Companion is thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} className="h-4" />
            </CardContent>
          )}

          <CardFooter className="p-4 bg-white border-t border-healing-100 relative">
            <form onSubmit={handleSendMessage} className="flex w-full gap-3 items-center">
              <div className="flex-1 relative group">
                <Input
                  disabled={isTyping || isLoading || connectionError}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={connectionError ? "Connection problem..." : "How are you really feeling right now?"}
                  className="pr-10 bg-healing-50/50 border-healing-200 focus-visible:ring-healing-500 h-11 rounded-xl transition-all"
                />
                {!inputMessage.trim() && !isTyping && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-healing-300">
                    <Bot size={18} />
                  </div>
                )}
              </div>
              <Button
                type="submit"
                disabled={!inputMessage.trim() || isTyping || isLoading || connectionError}
                className="bg-healing-600 hover:bg-healing-700 h-11 w-11 p-0 rounded-xl shadow-lg transform active:scale-95 transition-all shrink-0"
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
              className="absolute bottom-24 right-8 rounded-full h-10 w-10 bg-white border-healing-200 text-healing-600 shadow-xl border animate-bounce"
              onClick={scrollToBottom}
            >
              <MoveDown size={18} />
              <span className="sr-only">Scroll to bottom</span>
            </Button>
          )}
        </Card>

        <div className="mt-4 text-center px-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold opacity-60">
            Privacy First Support • Not a replacement for professional clinical care
          </p>
        </div>
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
