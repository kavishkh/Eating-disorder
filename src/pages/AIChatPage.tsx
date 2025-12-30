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
  ChevronUp,
  MessageSquare,
  Plus,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  ChatMessage,
  getChatGPTResponse,
  saveChatMessage,
  getUserChatSessions,
  initializeNewChat,
  getChatMessages,
  deleteChatSession
} from "@/services/chatService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { calmAudioLibrary } from "../data/calmAudio";

// Add this Component for Safe Audio Rendering (STEP 4)
function AudioCard({ title, src }: { title: string; src: string }) {
  const { toast } = useToast();

  if (!src) {
    console.error("Audio source missing");
    return null;
  }

  const handleAudioError = (e: any) => {
    console.error("Audio playback error:", e);
    const errorCode = e.target.error ? e.target.error.code : 'unknown';
    toast({
      title: "Audio Connectivity Issue",
      description: `Unable to load "${title}" (Status: ${errorCode}). Try the download link or refresh.`,
      variant: "destructive"
    });
  };

  return (
    <div className="mt-4 p-5 rounded-2xl border-2 border-healing-200 bg-healing-50/50 shadow-sm flex flex-col gap-4 animate-in zoom-in-95 duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-healing-800">
          <div className="bg-healing-200 p-2 rounded-lg">
            <Music size={18} className="text-healing-700" />
          </div>
          <div>
            <p className="text-sm font-bold leading-none">{title}</p>
            <p className="text-[10px] text-healing-600 mt-1 uppercase tracking-wider font-semibold">Healing Audio</p>
          </div>
        </div>
        <a
          href={src}
          download
          className="text-xs text-blue-600 hover:underline flex items-center gap-1"
          title="Test if file is reachable"
        >
          Check File
        </a>
      </div>

      <audio
        controls
        className="w-full h-10 custom-audio"
        onError={handleAudioError}
        preload="metadata"
      >
        <source src={src} type={src.endsWith('.wav') ? 'audio/wav' : 'audio/mpeg'} />
        Your browser does not support the audio element.
      </audio>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
          <p className="text-[10px] text-gray-500 italic">Mindful listening recommended. Focus on your breath.</p>
        </div>
        <p className="text-[10px] text-healing-600 font-semibold px-3.5">🎧 Recommended: Use headphones or earphones for the best experience.</p>
      </div>
    </div>
  );
}

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
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [chatSessions, setChatSessions] = useState<any[]>([]);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
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
    const loadInitialData = async () => {
      if (currentUser?.id) {
        try {
          setIsLoading(true);
          setConnectionError(false);

          if (!navigator.onLine) {
            setConnectionError(true);
            setIsLoading(false);
            return;
          }

          // 1. Get all chat sessions
          const sessions = await getUserChatSessions();
          setChatSessions(sessions);

          if (sessions.length > 0) {
            // 2. Load the most recent session
            const mostRecent = sessions[0];
            setCurrentChatId(mostRecent._id);
            const history = await getChatMessages(mostRecent._id);
            if (history.length > 0) {
              setMessages(history);
            } else {
              setWelcomeMessage();
            }
          } else {
            // 3. If no sessions exist, create one
            await handleNewChat(true); // silent create
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

    loadInitialData();

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

  const setWelcomeMessage = () => {
    setMessages([
      {
        id: "welcome-message",
        sender: "ai",
        content: `Hey ${currentUser?.name || "friend"}! 😊\n\nI'm so glad you're here. I know recovery can feel really lonely sometimes, but you're not alone - I'm here for you whenever you need to talk.\n\nWhether you're having a tough day, need help figuring something out, or just want someone to listen - I'm here. No judgment, just support.\n\nSo... how are you doing today? What's on your mind? 💙`,
        timestamp: new Date()
      }
    ]);
  };

  // Add Debug Mode toggle
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setDebugMode(prev => !prev);
        toast({
          title: debugMode ? "Debug Mode Disabled" : "Debug Mode Enabled",
          description: debugMode ? "Error details will be shown" : "Error details will be hidden",
        });
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [debugMode, toast]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const bottomThreshold = 100;
    setShowScrollButton(scrollHeight - scrollTop - clientHeight > bottomThreshold);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle starting a new chat
  const handleNewChat = async (silent = false) => {
    try {
      setIsTyping(true);
      const chatId = await initializeNewChat();
      setCurrentChatId(chatId);

      // Update local state for sessions list
      const updatedSessions = await getUserChatSessions();
      setChatSessions(updatedSessions);

      setWelcomeMessage();

      if (!silent) {
        toast({
          title: "New chat started",
          description: "A fresh space for your recovery journey.",
        });
      }
      setIsTyping(false);
    } catch (error) {
      console.error("Failed to create new chat", error);
      toast({
        title: "Error",
        description: "Failed to start a new chat session.",
        variant: "destructive"
      });
      setIsTyping(false);
    }
  };

  const selectChatSession = async (chatId: string) => {
    try {
      setIsLoading(true);
      setCurrentChatId(chatId);
      const history = await getChatMessages(chatId);
      if (history.length > 0) {
        setMessages(history);
      } else {
        setWelcomeMessage();
      }
    } catch (error) {
      console.error("Error loading chat session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSession = async (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation(); // Prevent selecting the chat when clicking delete

    if (window.confirm("Are you sure you want to delete this conversation? This cannot be undone.")) {
      try {
        const success = await deleteChatSession(chatId);
        if (success) {
          toast({
            title: "Session deleted",
            description: "The conversation has been removed.",
          });

          // Refresh sessions
          const updatedSessions = await getUserChatSessions();
          setChatSessions(updatedSessions);

          // If current session was deleted, switch to another or start new
          if (currentChatId === chatId) {
            if (updatedSessions.length > 0) {
              selectChatSession(updatedSessions[0]._id);
            } else {
              handleNewChat(true);
            }
          }
        } else {
          toast({
            title: "Delete failed",
            description: "Could not remove the session. Please try again.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error in delete handler:", error);
      }
    }
  };

  const handleRetryConnection = async () => {
    setRetryingConnection(true);
    setTimeout(async () => {
      if (navigator.onLine) {
        setConnectionError(false);
        if (currentUser?.id) {
          // Reload logic
          window.location.reload();
        }
      } else {
        toast({
          title: "Still offline",
          description: "Please check your internet connection.",
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

    if (!currentChatId) {
      console.warn("Chat not ready yet");
      toast({
        title: "Session connecting...",
        description: "Please wait a moment for the chat to initialize.",
      });
      return;
    }

    if (!navigator.onLine || connectionError) {
      toast({
        title: "You're offline",
        description: "Please check your internet connection.",
        variant: "destructive"
      });
      return;
    }

    setApiError(null);

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
      // 1. Save user message to specific chatId
      if (currentUser?.id) {
        await saveChatMessage(currentUser.id, userMessage, currentChatId);
      }

      // 2. Get AI response for this specific chatId
      const aiResponse = await getChatGPTResponse(content, currentChatId, messages);

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        content: aiResponse.reply || (aiResponse as any).text,
        timestamp: new Date(),
        type: aiResponse.type,
        video: aiResponse.video,
        audio: aiResponse.audio, // Added missing audio field
        followUp: aiResponse.followUp,
        multiModal: aiResponse.multiModal
      };

      setMessages(prev => [...prev, aiMessage]);

      // 3. AI response is saved in the backend /reply route already, but we can verify
      setIsTyping(false);
    } catch (error) {
      console.error("Error in chat:", error);
      setApiError(error);
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
      handleSendMessage(null as any, "Let's try that exercise together.");
    } else if (action.type === 'audio') {
      handleSendMessage(null as any, "Can you play some calming audio for me?");
    } else if (action.type === 'writing') {
      handleSendMessage(null as any, "I want to write about how I feel.");
    } else if (action.type === 'video') {
      handleSendMessage(null as any, "Show me a video for this.");
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
      <div className="flex flex-col h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)] max-w-6xl mx-auto w-full">
        {/* Header Area */}
        <div className="mb-4 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="bg-healing-100 p-2 rounded-xl">
              <Bot className="text-healing-600 h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-healing-900">Recovery Friend</h2>
              <p className="text-xs text-muted-foreground hidden md:block">Session-based support, private and safe</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => setShowResearch(!showResearch)}
              variant="ghost"
              size="sm"
              className="text-healing-600 hover:bg-healing-50"
            >
              <Info size={16} className="mr-1" />
              {showResearch ? "Hide Info" : "How it Works"}
            </Button>
            <Button
              onClick={() => handleNewChat()}
              variant="default"
              size="sm"
              className="bg-healing-600 hover:bg-healing-700 flex items-center gap-2"
            >
              <Plus size={16} />
              New Chat
            </Button>
          </div>
        </div>

        {showResearch && (
          <Card className="mb-4 border-healing-100 bg-healing-50/50 backdrop-blur-sm animate-in slide-in-from-top-4">
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-healing-800">
                <Info size={14} /> Security & AI Architecture
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2 pb-4 text-gray-700">
              <p>Your privacy is our priority. This AI uses <strong>Session-Based Isolation</strong>:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Local Processing:</strong> Messages are analyzed on our secure server, not sold to LLM providers.</li>
                <li><strong>Isolated History:</strong> Each chat session is an independent container for your recovery data.</li>
                <li><strong>Clinical Alignment:</strong> Responses follow evidence-based CBT and DBT principles.</li>
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Main Chat Area with Sidebar */}
        <div className="flex-1 flex gap-4 overflow-hidden">
          {/* Sidebar - Desktop Only */}
          <div className="hidden lg:flex flex-col w-64 border border-healing-100 rounded-2xl bg-white overflow-hidden shadow-sm">
            <div className="p-4 border-b border-healing-50 flex items-center justify-between bg-healing-50/30">
              <h3 className="font-bold text-healing-800 text-sm flex items-center gap-2">
                <MessageSquare size={14} /> History
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {chatSessions.length === 0 ? (
                <div className="text-center py-8 text-xs text-gray-400">No sessions yet</div>
              ) : (
                chatSessions.map((session) => (
                  <div
                    key={session._id}
                    className="relative group"
                  >
                    <button
                      onClick={() => selectChatSession(session._id)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex justify-between items-start ${currentChatId === session._id
                        ? "bg-healing-100 text-healing-900 font-bold border border-healing-200"
                        : "text-gray-600 hover:bg-healing-50 hover:text-healing-700"
                        }`}
                    >
                      <div className="truncate flex-1">
                        <div className="truncate pr-6">{session.title || "New Conversation"}</div>
                        <div className="text-[10px] opacity-60 mt-0.5">
                          {new Date(session.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 hover:bg-red-50 ${currentChatId === session._id ? "opacity-100" : ""}`}
                      onClick={(e) => handleDeleteSession(e, session._id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Window */}
          <Card className="flex-1 flex flex-col border-healing-200 overflow-hidden shadow-xl bg-white relative">
            <CardHeader className="bg-healing-50/20 backdrop-blur-md border-b border-healing-100 px-4 py-3 sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-9 w-9 mr-3 border-2 border-healing-100 shadow-sm">
                    <AvatarFallback className="bg-healing-500 text-white">
                      <Bot size={18} />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-sm font-bold text-healing-900">Recovery Companion</CardTitle>
                    <CardDescription className="text-[10px] flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      Always here for you
                    </CardDescription>
                  </div>
                </div>

                {/* Mobile History Trigger (Icon Only) */}
                <Button variant="ghost" size="icon" className="lg:hidden text-healing-600">
                  <MessageSquare size={20} />
                </Button>
              </div>
            </CardHeader>

            {isLoading && messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center bg-healing-50/10">
                <div className="relative h-12 w-12">
                  <div className="absolute inset-0 rounded-full border-4 border-healing-100"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-t-healing-500 animate-spin"></div>
                </div>
                <p className="mt-4 text-xs font-medium text-healing-600">Restoring your safe space...</p>
              </div>
            ) : connectionError ? (
              <CardContent className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <CloudOff className="h-12 w-12 text-amber-400 mb-4" />
                <h3 className="text-lg font-bold text-gray-800">Disconnected</h3>
                <p className="text-sm text-gray-500 mb-6 max-w-xs">I’ve lost the connection. Let’s try to reconnect.</p>
                <Button onClick={handleRetryConnection} disabled={retryingConnection} className="bg-healing-500 rounded-full">
                  {retryingConnection ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                  Retry Now
                </Button>
              </CardContent>
            ) : (
              <CardContent
                className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin overflow-x-hidden"
                onScroll={handleScroll}
              >
                {messages.length === 0 && !isTyping && (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <div className="bg-healing-50 p-6 rounded-full mb-4">
                      <Bot size={40} className="text-healing-400" />
                    </div>
                    <h3 className="text-lg font-bold text-healing-900">Ready when you are</h3>
                    <p className="text-sm text-gray-500">I'm here to listen without judgment.</p>
                  </div>
                )}

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-3 duration-500`}
                  >
                    <div className={`flex items-start max-w-[85%] md:max-w-[80%] gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                      <Avatar className={`h-8 w-8 mt-1 border shadow-sm ${msg.sender === "ai" ? "bg-healing-50" : "bg-healing-600"}`}>
                        {msg.sender === "ai" ? (
                          <AvatarFallback className="text-healing-700"><Bot size={16} /></AvatarFallback>
                        ) : (
                          <AvatarFallback className="text-white"><User size={16} /></AvatarFallback>
                        )}
                      </Avatar>

                      <div className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                        <div className={`rounded-2xl px-4 py-2.5 text-sm shadow-sm leading-relaxed ${msg.sender === "user"
                          ? "bg-healing-600 text-white rounded-tr-none"
                          : "bg-white border border-healing-100 text-healing-950 rounded-tl-none"
                          }`}>
                          <div className="whitespace-pre-wrap break-words">{msg.content}</div>

                          {msg.type === 'video' && msg.video && (
                            <div className="mt-4 rounded-xl overflow-hidden shadow-lg border-2 border-healing-100">
                              <iframe
                                className="w-full aspect-video"
                                src={`https://www.youtube.com/embed/${msg.video.videoId}`}
                                title={msg.video.title}
                                frameBorder="0"
                                allowFullScreen
                              ></iframe>
                              <div className="bg-white p-2 text-[10px] font-bold text-healing-700 bg-healing-50/50">{msg.video.title}</div>
                            </div>
                          )}

                          {msg.type === 'audio' && msg.audio && (
                            <AudioCard title={msg.audio.title} src={msg.audio.src} />
                          )}
                        </div>

                        {msg.sender === "ai" && (msg.followUp || (msg.multiModal && msg.multiModal.length > 0)) && (
                          <div className="mt-2 w-full space-y-2">
                            {msg.followUp && <p className="text-xs italic text-healing-600 font-medium px-1">"{msg.followUp}"</p>}
                            {msg.multiModal && msg.multiModal.length > 0 && (
                              <div className="flex flex-wrap gap-2 py-1">
                                {msg.multiModal.map((action) => (
                                  <Button
                                    key={action.id}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleModalAction(action)}
                                    className="h-7 rounded-full text-[10px] font-bold border-healing-200 text-healing-700 bg-white hover:bg-healing-600 hover:text-white transition-all shadow-sm"
                                  >
                                    {getIconForType(action.type)}
                                    {action.label}
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        <span className="text-[9px] text-gray-400 mt-1 px-1">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start animate-in fade-in">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8 bg-healing-50 border border-healing-100"><AvatarFallback><Bot size={16} /></AvatarFallback></Avatar>
                      <div className="bg-white border border-healing-50 rounded-2xl p-3 shadow-sm flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="h-1 w-1 bg-healing-400 rounded-full animate-bounce"></div>
                          <div className="h-1 w-1 bg-healing-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                          <div className="h-1 w-1 bg-healing-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                        </div>
                        <span className="text-[10px] text-healing-500 font-semibold tracking-tight">Recovery Friend is typing...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} className="h-2" />
              </CardContent>
            )}

            <CardFooter className="p-4 bg-white border-t border-healing-50">
              <form onSubmit={handleSendMessage} className="flex gap-2 w-full">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="How's your recovery going today?"
                  disabled={isTyping || isLoading || connectionError}
                  className="rounded-2xl bg-healing-50/30 border-healing-100 h-11 focus-visible:ring-healing-400 focus-visible:border-none shadow-inner"
                />
                <Button
                  type="submit"
                  disabled={!inputMessage.trim() || isTyping || isLoading}
                  className="bg-healing-600 hover:bg-healing-700 h-11 w-11 p-0 rounded-2xl shadow-lg transition-all active:scale-90"
                >
                  <Send size={18} />
                </Button>
              </form>
            </CardFooter>

            {showScrollButton && (
              <Button
                onClick={scrollToBottom}
                className="absolute bottom-24 right-6 h-10 w-10 rounded-full shadow-2xl bg-white text-healing-600 hover:bg-healing-50 border border-healing-100 animate-bounce"
                variant="outline"
              >
                <MoveDown size={18} />
              </Button>
            )}
          </Card>
        </div>

        <footer className="mt-4 pb-2 text-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Private • Secure • Supportive
          </p>
        </footer>
      </div>

      {debugMode && apiError && (
        <ApiErrorDebug error={apiError} onClose={() => setApiError(null)} />
      )}
    </AppLayout>
  );
};

export default AIChatPage;
