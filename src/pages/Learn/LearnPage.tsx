import React, { useState, useEffect } from "react";
import AppLayout from "../../components/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    BookOpen,
    Brain,
    Heart,
    Leaf,
    AlertCircle,
    PlayCircle,
    Star,
    Zap,
    CheckCircle2,
    Info,
    ArrowRight,
    Wind,
    Shield,
    Lightbulb,
    X
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { authAPI } from "@/utils/api";
import { copingTools } from "@/data/copingTools";

const LearnPage = () => {
    const { currentUser, updateUserProfile } = useAuth();
    const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [currentModuleId, setCurrentModuleId] = useState<string | null>(null);
    const [currentModuleTitle, setCurrentModuleTitle] = useState<string>("");

    const [activePractice, setActivePractice] = useState<string | null>(null);
    const [selectedSense, setSelectedSense] = useState<string | null>(null);
    const [audioToPlay, setAudioToPlay] = useState<string | null>(null);

    // Urge Surfing Timer State
    const [isTimerOpen, setIsTimerOpen] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    const totalModules = 10; // Increased count to include Urge Surfing
    const completedModules = currentUser?.completedModules || [];
    const progressPercent = Math.round((completedModules.length / totalModules) * 100);

    // Timer Logic
    useEffect(() => {
        if (!isTimerRunning) return;

        if (timeLeft === 0) {
            setIsTimerRunning(false);
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [isTimerRunning, timeLeft]);

    const startUrgeSurfing = () => {
        setIsTimerOpen(true);
        setTimeLeft(300);
        setIsTimerRunning(true);
        setActivePractice(null); // Close other practices if open
    };

    const startPractice = (type: string) => {
        if (type === "urge") {
            startUrgeSurfing();
        } else {
            setActivePractice(type);
            setSelectedSense(null); // Reset sense selection when starting a practice
        }
    };

    const playGuide = (src: string) => {
        setAudioToPlay(src === audioToPlay ? null : src);
    };

    const handleModuleComplete = (moduleId: string, title: string) => {
        if (completedModules.includes(moduleId)) {
            toast.info("You've already explored this module. Feel free to review it again!");
            return;
        }
        setCurrentModuleId(moduleId);
        setCurrentModuleTitle(title);
        setShowFeedback(true);
    };

    const handleFeedback = async (satisfied: boolean) => {
        setShowFeedback(false);

        if (!satisfied || !currentModuleId) {
            toast.info("No problem. Take your time, only take what helps you.");
            return;
        }

        await confirmHelpful(currentModuleId);
    };

    const isCompleted = (moduleId: string) => completedModules.includes(moduleId);

    const confirmHelpful = async (moduleId: string) => {
        if (completedModules.includes(moduleId)) return;

        try {
            const data = await authAPI.updateProgress(moduleId);
            if (data.success || data.message === "Already counted") {
                await updateUserProfile({
                    completedModules: data.completedModules,
                    progressLevel: data.progressLevel
                });
                toast.success(`Progress updated! You've found something helpful.`, {
                    description: "“Small consistency over perfection.”"
                });
            }
        } catch (error) {
            console.error("Failed to update progress:", error);
            toast.error("Couldn't save progress. Are you online?");
        }
    };

    const getLevelName = (level: number) => {
        if (level < 3) return "Level 1: Explorer";
        if (level < 7) return "Level 2: Navigator";
        if (level < 12) return "Level 3: Guardian";
        return "Level 4: Guide";
    };

    return (
        <AppLayout>
            <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
                <header className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-healing-100 text-healing-700 hover:bg-healing-100 px-3 py-1 uppercase tracking-wider text-[10px] font-bold">
                            Explore Gently
                        </Badge>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-healing-900 leading-tight">
                        A Safe Space to <span className="text-gradient-healing">Understand</span> & Heal
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl">
                        Bite-sized modules designed to help you understand your mind, rebuild your relationship with food, and find things that might help you today.
                    </p>
                    <p className="text-sm text-healing-600 font-medium italic">
                        “You don’t need to read everything. Start slow. Take only what helps you right now.”
                    </p>
                </header>

                <Tabs defaultValue="start-here" className="w-full">
                    <ScrollArea className="w-full whitespace-nowrap rounded-xl pb-3">
                        <TabsList className="inline-flex w-max h-12 items-center justify-start rounded-xl bg-healing-50 p-1 text-muted-foreground shadow-inner">
                            <TabsTrigger value="start-here" className="rounded-lg px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-healing-700 data-[state=active]:shadow-sm">
                                <Star className="mr-2 h-4 w-4" /> Start Here
                            </TabsTrigger>
                            <TabsTrigger value="understanding" className="rounded-lg px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-healing-700 data-[state=active]:shadow-sm">
                                <BookOpen className="mr-2 h-4 w-4" /> Understand EDs
                            </TabsTrigger>
                            <TabsTrigger value="emotions" className="rounded-lg px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-healing-700 data-[state=active]:shadow-sm">
                                <Brain className="mr-2 h-4 w-4" /> Emotions
                            </TabsTrigger>
                            <TabsTrigger value="coping" className="rounded-lg px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-healing-700 data-[state=active]:shadow-sm">
                                <Wind className="mr-2 h-4 w-4" /> Things that help
                            </TabsTrigger>
                            <TabsTrigger value="food" className="rounded-lg px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-healing-700 data-[state=active]:shadow-sm">
                                <Leaf className="mr-2 h-4 w-4" /> Food & Recovery
                            </TabsTrigger>
                            <TabsTrigger value="thoughts" className="rounded-lg px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-healing-700 data-[state=active]:shadow-sm">
                                <Lightbulb className="mr-2 h-4 w-4" /> Thought Patterns
                            </TabsTrigger>
                            <TabsTrigger value="media" className="rounded-lg px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-healing-700 data-[state=active]:shadow-sm">
                                <PlayCircle className="mr-2 h-4 w-4" /> Media Library
                            </TabsTrigger>

                        </TabsList>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>

                    <div className="mt-8">
                        <TabsContent value="start-here" className="space-y-6 focus-visible:outline-none">
                            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="border-none bg-gradient-to-br from-healing-500 to-healing-600 text-white shadow-xl overflow-hidden relative group">
                                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                        <Star size={120} />
                                    </div>
                                    <CardHeader>
                                        <CardTitle className="text-2xl">Welcome to Your Recovery Toolkit</CardTitle>
                                        <CardDescription className="text-healing-50">You are not alone on this journey.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <p className="opacity-90 leading-relaxed">
                                            Recovery isn't a straight line, and that's okay. This hub is a gentle space for you to find clarity at your own pace. You are safe here.
                                        </p>
                                        <div className="flex flex-col space-y-2 pt-2">
                                            <div className="flex items-center space-x-2">
                                                <CheckCircle2 className="h-5 w-5 text-healing-100" />
                                                <span>Compassionate guidance</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <CheckCircle2 className="h-5 w-5 text-healing-100" />
                                                <span>No pressure, no judgment</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <CheckCircle2 className="h-5 w-5 text-healing-100" />
                                                <span>Small steps for daily life</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button variant="secondary" className="w-full bg-white text-healing-600 hover:bg-healing-50 font-semibold">
                                            Explore Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </CardFooter>
                                </Card>

                                <div className="space-y-6">
                                    <div className="p-6 rounded-2xl bg-white border border-healing-100 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-start space-x-4">
                                            <div className="bg-healing-100 p-3 rounded-xl">
                                                <Zap className="h-6 w-6 text-healing-600" />
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="font-bold text-healing-900 text-lg">Daily Reflection</h3>
                                                <p className="text-muted-foreground">"What I learned today" - Small wins lead to big changes.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 rounded-2xl bg-white border border-healing-100 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-start space-x-4">
                                            <div className="bg-healing-100 p-3 rounded-xl">
                                                <Shield className="h-6 w-6 text-healing-600" />
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="font-bold text-healing-900 text-lg">Safety First</h3>
                                                <p className="text-muted-foreground">Always reach out if things feel overwhelming. We're here.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl flex items-start space-x-4">
                                        <Info className="h-6 w-6 text-amber-600 mt-1" />
                                        <div className="space-y-1 text-sm">
                                            <h4 className="font-bold text-amber-900">A Gentle Reminder</h4>
                                            <p className="text-amber-800 leading-relaxed">
                                                These tools are here to support you, but they aren't a replacement for professional care. It's okay to ask for help from a doctor or therapist when you're ready.
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-center text-muted-foreground italic">
                                        Feel free to skip any section that feels like "too much" today. Your peace of mind comes first.
                                    </p>
                                    {!isCompleted('intro-foundation') && (
                                        <Button
                                            variant="outline"
                                            className="w-full border-healing-200 text-healing-600 hover:bg-healing-50"
                                            onClick={() => handleModuleComplete('intro-foundation', 'Welcome Foundation')}
                                        >
                                            Mark this introduction as helpful
                                        </Button>
                                    )}
                                    {isCompleted('intro-foundation') && (
                                        <div className="flex items-center justify-center space-x-2 text-healing-600 font-medium bg-healing-50 p-3 rounded-xl border border-healing-100">
                                            <CheckCircle2 className="h-4 w-4" />
                                            <span className="text-sm">Found this helpful</span>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </TabsContent>

                        <TabsContent value="understanding" className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    {
                                        title: "What are eating disorders?",
                                        content: [
                                            "They are complex mental health experiences, not a weakness or a choice.",
                                            "They often start as a way to handle difficult feelings or life stress.",
                                            "They involve a difficult relationship with food, body, or self-image.",
                                            "They can affect anyone, and your experience is valid no matter your size.",
                                            "They are fundamentally about trying to feel safe or in control."
                                        ],
                                        icon: BookOpen,
                                        color: "bg-blue-50 text-blue-600"
                                    },
                                    {
                                        title: "Why do they happen?",
                                        content: [
                                            "They are 'coping mechanisms' that the brain learned to survive.",
                                            "Biology: Your brain chemistry and genetics play a part.",
                                            "Emotions: They act as a shield against pain, stress, or anxiety.",
                                            "Environment: Cultural pressure and life events can be triggers.",
                                            "It's never your fault. You are simply unlearning a difficult pattern."
                                        ],
                                        icon: Brain,
                                        color: "bg-purple-50 text-purple-600"
                                    },
                                    {
                                        title: "Common Myths vs Facts",
                                        content: [
                                            "Myth: You have to be underweight to have an ED.",
                                            "Fact: EDs exist in all body sizes; weight is not an indicator.",
                                            "Myth: EDs are just about vanity or dieting.",
                                            "Fact: They are complex clinical conditions with deep emotional roots.",
                                            "Myth: EDs are only for young girls.",
                                            "Fact: People of all ages, genders, and backgrounds are affected."
                                        ],
                                        icon: Lightbulb,
                                        color: "bg-amber-50 text-amber-600"
                                    }
                                ].map((item, i) => (
                                    <Card key={i} className="border-healing-100 hover:border-healing-200 transition-all shadow-sm">
                                        <CardHeader>
                                            <div className={`${item.color} w-12 h-12 rounded-xl flex items-center justify-center mb-2`}>
                                                <item.icon size={24} />
                                            </div>
                                            <CardTitle className="text-xl">{item.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="space-y-3">
                                                {item.content.map((point, j) => (
                                                    <li key={j} className="flex items-start space-x-2 text-sm text-gray-700 leading-relaxed">
                                                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-healing-400 shrink-0" />
                                                        <span>{point}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="mt-6 pt-4 border-t border-gray-100">
                                                {isCompleted(`understanding-${i}`) ? (
                                                    <div className="flex items-center space-x-2 text-healing-600 text-xs font-semibold">
                                                        <CheckCircle2 className="h-3 w-3" />
                                                        <span>Helpful tool added</span>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 text-[11px] text-healing-600 hover:text-healing-700 hover:bg-healing-50 p-0"
                                                        onClick={() => handleModuleComplete(`understanding-${i}`, item.title)}
                                                    >
                                                        Did this feel helpful for you?
                                                    </Button>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            <div className="bg-healing-900 rounded-3xl p-8 text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                                    <Star size={160} />
                                </div>
                                <div className="relative z-10 max-w-2xl">
                                    <h3 className="text-3xl font-bold mb-4">Recovery is ALWAYS Possible</h3>
                                    <p className="text-healing-100 text-lg leading-relaxed mb-6">
                                        No matter how long you've struggled or how 'broken' you might feel, your brain and body have an incredible capacity to heal. Thousands of people have found freedom, and you can too.
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                                            <p className="font-bold text-white mb-1">It's a process</p>
                                            <p className="text-sm text-healing-100">Small consistency over perfection.</p>
                                        </div>
                                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                                            <p className="font-bold text-white mb-1">Help is available</p>
                                            <p className="text-sm text-healing-100">You don't have to do this alone.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="emotions" className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Card className="border-none shadow-lg bg-white overflow-hidden">
                                    <div className="h-2 bg-rose-500" />
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <div className="bg-rose-50 p-2 rounded-lg mr-3">
                                                <Zap className="text-rose-600 h-5 w-5" />
                                            </div>
                                            Mind Connections
                                        </CardTitle>
                                        <CardDescription>Tracing back the "Why" behind the urges.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <p className="text-sm text-muted-foreground italic px-2">
                                            “Oh… that’s why I feel like this.” - Understanding the root helps quiet the noise.
                                        </p>
                                        <div className="space-y-4">
                                            {[
                                                { label: "Stress & Overwhelm", desc: "When life feels too loud, ED thoughts offer a way to 'tune out'." },
                                                { label: "Guilt & Shame", desc: "A difficult moment can trigger a cycle of self-blame." },
                                                { label: "Social Comparison", desc: "The urge to compare is often a search for belonging." },
                                                { label: "Lack of Control", desc: "Focusing on food feels safer than facing a chaotic world." }
                                            ].map((trigger, i) => (
                                                <div key={i} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                                                    <p className="font-bold text-gray-900">{trigger.label}</p>
                                                    <p className="text-sm text-gray-600">{trigger.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-6">
                                            {isCompleted('emotions-connections') ? (
                                                <div className="flex items-center justify-center space-x-2 text-rose-600 font-medium bg-rose-50 p-3 rounded-xl">
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    <span className="text-sm">Added to your toolkit</span>
                                                </div>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    className="w-full border-rose-200 text-rose-600 hover:bg-rose-50"
                                                    onClick={() => handleModuleComplete('emotions-connections', 'Mind Connections')}
                                                >
                                                    Did this provide clarity?
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                <div className="space-y-6">
                                    <Card className="border-none shadow-lg bg-healing-50">
                                        <CardHeader>
                                            <CardTitle className="text-healing-800">Urge vs. Action</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="bg-white p-6 rounded-2xl border border-healing-100 text-center space-y-3">
                                                <p className="text-2xl font-bold text-healing-700 italic">“An urge is a feeling — not a command.”</p>
                                                <p className="text-muted-foreground italic">— A vital reminder for recovery</p>
                                            </div>
                                            <div className="space-y-3 pt-4">
                                                <h4 className="font-bold text-healing-900">Why urges feel 'out of control':</h4>
                                                <p className="text-sm text-gray-700 leading-relaxed">
                                                    Your brain has developed a 'habit loop'. When you feel an emotion, it automatically suggests the ED behavior as a solution. It feels urgent, but it's just your brain's old survival mechanism firing.
                                                </p>
                                                <p className="text-sm text-gray-700 leading-relaxed">
                                                    You can feel the urge, acknowledge it, and still choose to wait. The urge always passes, even if you do nothing.
                                                </p>
                                            </div>
                                        </CardContent>
                                        <CardFooter>
                                            <Button
                                                className="w-full bg-healing-600 hover:bg-healing-700"
                                                onClick={startUrgeSurfing}
                                            >
                                                Open Urge Surf Timer
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="coping" className="space-y-8">
                            <header className="text-center max-w-2xl mx-auto space-y-2">
                                <h2 className="text-3xl font-bold text-healing-900">Things that might help</h2>
                                <p className="text-muted-foreground">Short, gentle ways to help you find your breath in difficult moments.</p>
                            </header>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {copingTools.map((tool) => {
                                    const ToolIcon = { Wind, Shield, Zap, Heart }[tool.icon] || Wind;
                                    const colorMap: Record<string, string> = {
                                        'grounding-54321': 'indigo',
                                        'box-breathing': 'teal',
                                        'urge-surfing': 'amber',
                                        'self-soothing': 'rose'
                                    };
                                    const color = colorMap[tool.id] || 'healing';

                                    return (
                                        <Card key={tool.id} id={`tool-${tool.id}`} className="group hover:shadow-xl transition-all duration-300 border-healing-100 flex flex-col">
                                            <CardHeader className="flex flex-row items-start space-x-4">
                                                <div className={`bg-${color}-100 p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                                                    <ToolIcon className={`h-6 w-6 text-${color}-600`} />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <CardTitle className="text-xl">{tool.title}</CardTitle>
                                                            <CardDescription>{tool.description}</CardDescription>
                                                        </div>
                                                        {isCompleted(tool.id) && (
                                                            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-100">
                                                                <CheckCircle2 className="h-3 w-3 mr-1" /> Helpful
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="flex-1">
                                                {/* Practice UI - Embedded inside card or as a separate section below */}
                                                {activePractice === tool.practiceType && (
                                                    <div className="mt-2 p-4 bg-healing-50 rounded-xl border border-healing-100 animate-in fade-in zoom-in-95 duration-300 relative">
                                                        <button
                                                            onClick={() => setActivePractice(null)}
                                                            className="absolute top-2 right-2 text-healing-400 hover:text-healing-600"
                                                        >
                                                            <X size={14} />
                                                        </button>

                                                        {activePractice === "grounding" && (
                                                            <div className="space-y-3">
                                                                <h4 className="font-bold text-healing-900 border-b border-healing-200 pb-1">5-4-3-2-1 Grounding</h4>
                                                                <p className="text-sm text-gray-700">Look around and name:</p>
                                                                <ul className="text-sm space-y-1 text-gray-600 pl-2">
                                                                    <li>• 5 things you can see</li>
                                                                    <li>• 4 things you can touch</li>
                                                                    <li>• 3 things you hear</li>
                                                                    <li>• 2 things you smell</li>
                                                                    <li>• 1 thing you taste</li>
                                                                </ul>
                                                                <p className="text-[10px] text-healing-600 font-medium italic">You don’t need to rush.</p>
                                                            </div>
                                                        )}

                                                        {activePractice === "breathing" && (
                                                            <div className="space-y-3">
                                                                <h4 className="font-bold text-healing-900 border-b border-healing-200 pb-1">Box Breathing</h4>
                                                                <div className="bg-white/50 p-3 rounded-lg text-center space-y-1">
                                                                    <p className="text-lg font-bold text-healing-700">Inhale 4 • Hold 4</p>
                                                                    <p className="text-lg font-bold text-healing-700">Exhale 4 • Hold 4</p>
                                                                </div>
                                                                <p className="text-sm text-gray-700 text-center italic">Repeat slowly 3 times.</p>
                                                            </div>
                                                        )}

                                                        {activePractice === "soothing" && (
                                                            <div className="space-y-3">
                                                                <h4 className="font-bold text-healing-900 border-b border-healing-200 pb-1">Self-Soothing</h4>
                                                                <p className="text-sm text-gray-700">Choose one sense to focus on:</p>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {['Warmth', 'Scent', 'Texture', 'Sound'].map(s => (
                                                                        <Badge
                                                                            key={s}
                                                                            variant={selectedSense === s ? "default" : "outline"}
                                                                            className={`cursor-pointer transition-all ${selectedSense === s ? 'bg-rose-500 text-white border-rose-500' : 'bg-white hover:bg-rose-50 hover:border-rose-200'}`}
                                                                            onClick={() => setSelectedSense(s)}
                                                                        >
                                                                            {s}
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                                {selectedSense ? (
                                                                    <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-500">
                                                                        <p className="text-sm text-gray-800 font-medium">Focusing on {selectedSense.toLowerCase()}...</p>
                                                                        <p className="text-xs text-gray-600 leading-relaxed italic">
                                                                            {selectedSense === 'Warmth' && "Notice the temperature of your tea, a blanket, or your own hands."}
                                                                            {selectedSense === 'Scent' && "Find a calming smell nearby—perhaps a candle, lotion, or fresh air."}
                                                                            {selectedSense === 'Texture' && "Feel the fabric of your clothes or the surface of a nearby object."}
                                                                            {selectedSense === 'Sound' && "Listen closely to the hum of the room or distant sounds outside."}
                                                                        </p>
                                                                        <p className="text-[11px] text-rose-600 font-bold">Stay with this sensation for a minute. Let it anchor you.</p>
                                                                    </div>
                                                                ) : (
                                                                    <p className="text-sm text-gray-600 leading-relaxed">Select a sense to begin the practice.</p>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {audioToPlay === tool.audio && (
                                                    <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 animate-in slide-in-from-top-2 duration-300">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Audio Guide</span>
                                                            <button onClick={() => setAudioToPlay(null)}><X size={14} className="text-slate-400" /></button>
                                                        </div>
                                                        <audio
                                                            controls
                                                            src={tool.audio}
                                                            className="w-full h-8"
                                                            autoPlay={false}
                                                        />
                                                    </div>
                                                )}
                                            </CardContent>
                                            <CardFooter className="flex flex-col space-y-3 pt-4 border-t border-gray-50 mt-auto">
                                                <div className="flex justify-between items-center w-full text-sm font-medium">
                                                    <div className="flex space-x-4">
                                                        <Button
                                                            variant="ghost"
                                                            className="text-healing-600 hover:text-healing-700 hover:bg-healing-50 p-0 h-auto"
                                                            onClick={() => startPractice(tool.practiceType)}
                                                        >
                                                            Practice now
                                                        </Button>
                                                        {!isCompleted(tool.id) && (
                                                            <Button
                                                                variant="ghost"
                                                                className="text-muted-foreground hover:text-healing-600 p-0 h-auto"
                                                                onClick={() => handleModuleComplete(tool.id, tool.title)}
                                                            >
                                                                Mark as helpful
                                                            </Button>
                                                        )}
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        className={`p-0 h-auto ${audioToPlay === tool.audio ? 'text-healing-600 font-bold' : 'text-muted-foreground'}`}
                                                        onClick={() => playGuide(tool.audio)}
                                                    >
                                                        {audioToPlay === tool.audio ? 'Playing guide...' : 'Listen to guide'}
                                                    </Button>
                                                </div>
                                            </CardFooter>
                                        </Card>
                                    );
                                })}
                            </div>

                            <div className="bg-slate-900 text-white rounded-3xl p-8 text-center flex flex-col items-center justify-center space-y-4">
                                <h3 className="text-xl font-bold">Distraction vs. Suppression</h3>
                                <p className="max-w-xl text-slate-300">
                                    Suppression is fighting the thought (making it stronger). Distraction is acknowledging the thought and gently shifting focus elsewhere for 15-20 minutes.
                                </p>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {['Coloring', 'Walking', 'Puzzles', 'Music', 'Reading', 'Call a friend'].map(item => (
                                        <Badge key={item} variant="secondary" className="bg-slate-800 text-slate-200 border-slate-700">
                                            {item}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="food" className="space-y-8">
                            <div className="bg-healing-50 border border-healing-100 p-6 rounded-3xl flex items-center space-x-4 mb-8">
                                <div className="bg-healing-600 p-2 rounded-full text-white">
                                    <Shield size={20} />
                                </div>
                                <p className="text-healing-800 font-medium italic">
                                    "This section focuses on rebuilding your relationship with food, without restriction, diet plans, or weight talk."
                                </p>
                            </div>

                            <Accordion type="single" collapsible className="w-full space-y-4">
                                {[
                                    {
                                        title: "Why fear foods exist",
                                        content: "Fear foods aren't 'bad' — they are foods your brain has tagged as dangerous due to the ED. Over time, your brain has created an alarm system for these foods. Understanding that it's just a misfiring alarm, not a real danger, is the first step."
                                    },
                                    {
                                        title: "Food avoidance vs. Safety foods",
                                        content: "EDs thrive on narrowing your world. Avoidance keeps us in a cycle of fear. Safety foods provide temporary comfort but maintain the ED's power. Recovery is about slowly expanding your 'safe zone' to include all foods."
                                    },
                                    {
                                        title: "Why forcing food often backfires",
                                        content: "Recovery isn't about brute force. It's about 'gentle exposure'. If you force yourself too fast, the anxiety can lead to a 'rebound' behavior. We aim for steps that feel challenging but possible (the 'stretch zone')."
                                    },
                                    {
                                        title: "Gentle exposure explained",
                                        content: "Take small steps: 1. Look at the food. 2. Be near it. 3. Try one bite. 4. Try more next time. It's not about the quantity today; it's about reducing the fear response for tomorrow."
                                    }
                                ].map((item, i) => (
                                    <AccordionItem key={i} value={`item-${i}`} className="border rounded-2xl px-6 bg-white overflow-hidden border-healing-100">
                                        <AccordionTrigger className="text-lg font-bold text-healing-900 hover:no-underline py-6">
                                            {item.title}
                                        </AccordionTrigger>
                                        <AccordionContent className="pb-6 text-gray-700 text-base leading-relaxed">
                                            <div className="space-y-4">
                                                {item.content}
                                                <div className="pt-2">
                                                    {isCompleted(`food-${i}`) ? (
                                                        <div className="flex items-center space-x-2 text-healing-600 text-xs font-semibold">
                                                            <CheckCircle2 className="h-3 w-3" />
                                                            <span>Reflected on this</span>
                                                        </div>
                                                    ) : (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 text-[11px] text-healing-600 hover:text-healing-700 hover:bg-healing-50 p-0"
                                                            onClick={() => handleModuleComplete(`food-${i}`, item.title)}
                                                        >
                                                            Did this provide a new perspective?
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-rose-50 border border-rose-100 p-8 rounded-3xl space-y-4">
                                    <h4 className="text-xl font-bold text-rose-900 flex items-center">
                                        <Shield className="mr-2 text-rose-600" /> A Safe Approach
                                    </h4>
                                    <p className="text-sm text-rose-800 italic">To keep your recovery safe, we avoid:</p>
                                    <ul className="space-y-2 text-rose-800">
                                        <li>• Calorie counting or tracking</li>
                                        <li>• Weight metrics or body talk</li>
                                        <li>• Labeling foods as 'good' or 'bad'</li>
                                        <li>• Restrictive or rigid meal plans</li>
                                    </ul>
                                </div>
                                <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-3xl space-y-4">
                                    <h4 className="text-xl font-bold text-emerald-900 flex items-center">
                                        <Heart className="mr-2 text-emerald-600" /> Gently Expanding
                                    </h4>
                                    <p className="text-sm text-emerald-800 italic">Instead, we focus on:</p>
                                    <ul className="space-y-2 text-emerald-800">
                                        <li>• Feeling satisfied and nourished</li>
                                        <li>• Treating all food with neutrality</li>
                                        <li>• Listening to your inner wisdom</li>
                                        <li>• Discovering foods you actually enjoy</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="text-center pt-4">
                                <Button variant="ghost" className="text-healing-600 italic" onClick={() => (window.location.href = '/chat')}>
                                    Want to talk through a difficult food moment? Ask the AI coach →
                                </Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="thoughts" className="space-y-8">
                            <header className="space-y-2">
                                <h2 className="text-3xl font-bold text-healing-900">Softening the Voice</h2>
                                <p className="text-muted-foreground">Learning to recognize the 'ED loops' and meeting them with kindness.</p>
                            </header>

                            <div className="space-y-6">
                                {[
                                    {
                                        type: "All-or-nothing Thinking",
                                        thought: "I ate one cookie, I've ruined the whole day, I might as well give up.",
                                        reframe: "One snack doesn't define a day. My body is resilient, and the next moment is a fresh start.",
                                        color: "bg-orange-50"
                                    },
                                    {
                                        type: "The 'I Failed' Trap",
                                        thought: "I had a setback. I'm back at square one and I'll never recover.",
                                        reframe: "Setbacks are a part of learning. You don't lose the progress you made just because of one difficult day.",
                                        color: "bg-blue-50"
                                    },
                                    {
                                        type: "Food Guilt",
                                        thought: "I shouldn't have eaten that. I'm a bad person for liking it.",
                                        reframe: "Food has no moral value. Eating a certain food doesn't make me 'bad'. It's just fuel and pleasure.",
                                        color: "bg-purple-50"
                                    }
                                ].map((item, i) => (
                                    <div key={i} className={`${item.color} p-8 rounded-3xl border border-white/50 shadow-sm space-y-4 relative group`}>
                                        <div className="flex justify-between items-center">
                                            <Badge className="bg-white text-gray-900 border-none shadow-sm">{item.type}</Badge>
                                            {isCompleted(`thoughts-${i}`) ? (
                                                <div className="flex items-center space-x-1 text-healing-700 text-xs font-bold bg-white/60 px-2 py-1 rounded-lg">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    <span>Reframing expert</span>
                                                </div>
                                            ) : (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 text-[10px] text-healing-600 hover:bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => handleModuleComplete(`thoughts-${i}`, item.type)}
                                                >
                                                    Was this reframe helpful?
                                                </Button>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">The ED Thought:</p>
                                                <p className="text-lg text-gray-700 italic">"{item.thought}"</p>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-sm font-bold text-healing-600 uppercase tracking-wider">The Recovery Reframe:</p>
                                                <p className="text-lg font-bold text-healing-900 leading-tight">"{item.reframe}"</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Card className="bg-healing-900 text-white border-none rounded-3xl overflow-hidden text-center p-8">
                                <CardHeader>
                                    <CardTitle className="text-2xl">The Golden Rule of Recovery</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xl text-healing-100 font-medium italic">"Treat yourself with the same kindness you would show a best friend going through this."</p>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="media" className="space-y-8">
                            <header className="space-y-2">
                                <h2 className="text-3xl font-bold text-healing-900 font-outfit">Media Library</h2>
                                <p className="text-muted-foreground">A curated collection of videos to help you understand, ground, and heal.</p>
                            </header>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[
                                    { title: "5-Minute Meditation Anywhere", id: "inpok4MKVLM", category: "Meditation", duration: "5 min" },
                                    { title: "10-Minute Anxiety Relief", id: "O-6f5wQXSu8", category: "Meditation", duration: "10 min" },
                                    { title: "Daily Calm Mindfulness", id: "syx3a1_LeFo", category: "Mindfulness", duration: "10 min" },
                                    { title: "Mindful Eating Guide", id: "gcIxWIDuKZQ", category: "Mindfulness", duration: "12 min" },
                                    { title: "Meditation for ED Recovery", id: "-UVIdPUSh-M", category: "Recovery", duration: "7 min" },
                                    { title: "Recovery Path Explained", id: "tEz2a97MASQ", category: "Recovery", duration: "15 min" },
                                    { title: "What is an Eating Disorder?", id: "3Bax8ijH038", category: "Understanding", duration: "8 min" },
                                    { title: "Anorexia Nervosa Explained", id: "eMVyZ6Ax-74", category: "Understanding", duration: "10 min" },
                                    { title: "Bulimia Nervosa Overview", id: "Kt1p2gLug60", category: "Understanding", duration: "10 min" },
                                    { title: "Binge Eating Overview", id: "YPgRc0uzx5E", category: "Understanding", duration: "12 min" },
                                    { title: "Signs & Symptoms", id: "MsSXh1BxLjE", category: "Understanding", duration: "9 min" },
                                    { title: "Coping with Anxiety", id: "Cv2DJ9riXb4", category: "Coping", duration: "6 min" },
                                    { title: "Stress Relief Techniques", id: "PcKyBMGYWO4", category: "Coping", duration: "8 min" },
                                    { title: "Emotional Regulation", id: "cPoqxmaEhL4", category: "Coping", duration: "10 min" },
                                    { title: "Difficult Emotions", id: "aexBCHZxjvw", category: "Coping", duration: "7 min" },
                                    { title: "Grounding for Triggers", id: "HjF1AeTeN20", category: "Coping", duration: "5 min" }
                                ].map((media, i) => (
                                    <Card key={i} id={`video-${media.id}`} className={`group overflow-hidden transition-all duration-500 shadow-sm hover:shadow-md ${playingVideoId === media.id ? 'border-healing-500 ring-2 ring-healing-200' : 'border-healing-100'}`}>
                                        <div className="aspect-video bg-healing-100 relative overflow-hidden">
                                            {playingVideoId === media.id ? (
                                                <div className="w-full h-full relative">
                                                    <iframe
                                                        className="w-full h-full"
                                                        src={`https://www.youtube.com/embed/${media.id}?autoplay=1&rel=0`}
                                                        title={media.title}
                                                        frameBorder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    ></iframe>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setPlayingVideoId(null);
                                                        }}
                                                        className="absolute -top-1 -right-1 bg-white p-1 rounded-full shadow-lg text-healing-600 hover:text-healing-800 border border-healing-100 transition-colors z-20"
                                                        title="Close Video"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div
                                                    className="w-full h-full cursor-pointer"
                                                    onClick={() => setPlayingVideoId(media.id)}
                                                >
                                                    <img
                                                        src={`https://img.youtube.com/vi/${media.id}/mqdefault.jpg`}
                                                        alt={media.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                                        <div className="bg-white/90 p-3 rounded-full shadow-lg transform group-hover:scale-110 transition-transform">
                                                            <PlayCircle className="h-8 w-8 text-healing-600" />
                                                        </div>
                                                    </div>
                                                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                                                        {media.duration}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <CardHeader className="p-4 space-y-1">
                                            <div className="flex justify-between items-center">
                                                <Badge variant="secondary" className="text-[9px] uppercase tracking-wider bg-healing-50 text-healing-700 border-none">
                                                    {media.category}
                                                </Badge>
                                            </div>
                                            <CardTitle className={`text-base leading-tight transition-colors ${playingVideoId === media.id ? 'text-healing-700 font-bold' : 'group-hover:text-healing-700'}`}>{media.title}</CardTitle>
                                        </CardHeader>
                                        <CardFooter className="px-4 pb-4 pt-0">
                                            {playingVideoId === media.id ? (
                                                <Button
                                                    variant="secondary"
                                                    className="w-full h-8 text-xs bg-healing-50 text-healing-700 hover:bg-healing-100 justify-between p-0 px-3 font-semibold"
                                                    onClick={() => setPlayingVideoId(null)}
                                                >
                                                    Close Player <X size={14} />
                                                </Button>
                                            ) : (
                                                <div className="flex w-full gap-2">
                                                    <Button
                                                        variant="default"
                                                        className="flex-1 h-8 text-xs bg-healing-600 hover:bg-healing-700 text-white justify-between p-0 px-3"
                                                        onClick={() => setPlayingVideoId(media.id)}
                                                    >
                                                        Watch Here <PlayCircle size={14} />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0 text-muted-foreground hover:text-healing-700 hover:bg-healing-50"
                                                        onClick={() => window.open(`https://www.youtube.com/watch?v=${media.id}`, "_blank")}
                                                        title="Open in YouTube"
                                                    >
                                                        <ArrowRight size={14} />
                                                    </Button>
                                                </div>
                                            )}
                                            {!isCompleted(`video-${media.id}`) ? (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="w-full mt-2 h-7 text-[10px] text-healing-600 hover:bg-healing-50 border border-dashed border-healing-100"
                                                    onClick={() => handleModuleComplete(`video-${media.id}`, media.title)}
                                                >
                                                    Found this video helpful?
                                                </Button>
                                            ) : (
                                                <div className="w-full mt-2 flex items-center justify-center space-x-1 text-healing-600 text-[10px] font-bold bg-healing-50 py-1 rounded">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    <span>Added to progress</span>
                                                </div>
                                            )}
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>


                    </div>
                </Tabs>

                {/* Optional Progress Section */}
                <section className="pt-12 border-t border-border">
                    <Card className="bg-healing-50/50 border-healing-100 shadow-sm overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div className="space-y-1">
                                <CardTitle className="text-xl">Your Progress</CardTitle>
                                <CardDescription>Small wins built over time</CardDescription>
                            </div>
                            <Badge className="bg-healing-600">{getLevelName(currentUser?.progressLevel || 0)}</Badge>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">Modules Completed</span>
                                    <span className="text-muted-foreground">{completedModules.length} / {totalModules}</span>
                                </div>
                                <Progress value={progressPercent} className="h-2" />
                            </div>

                            <p className="text-xs text-muted-foreground italic text-center">
                                “Progress looks different for everyone. You don’t need to complete everything. Your pace is the perfect pace.”
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                                {completedModules.length > 0 ? (
                                    completedModules.slice(0, 6).map((moduleId, idx) => (
                                        <div key={idx} className="bg-white p-4 rounded-xl border border-healing-100 flex items-center space-x-3 animate-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: `${idx * 100}ms` }}>
                                            <div className="bg-emerald-100 p-2 rounded-lg"><CheckCircle2 className="h-4 w-4 text-emerald-600" /></div>
                                            <span className="text-sm font-medium truncate">{moduleId.replace(/-/g, ' ')}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-8 text-center border-2 border-dashed border-gray-200 rounded-2xl">
                                        <p className="text-muted-foreground">Start exploring modules to see your progress here.</p>
                                    </div>
                                )}
                                {completedModules.length < totalModules && completedModules.length > 0 && (
                                    <div className="bg-white/50 p-4 rounded-xl border border-dashed border-gray-300 flex items-center space-x-3 grayscale opacity-60">
                                        <div className="bg-gray-100 p-2 rounded-lg"><Star className="h-4 w-4 text-gray-400" /></div>
                                        <span className="text-sm font-medium text-gray-400">Keep exploring...</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Feedback Modal Overlay */}
                {
                    showFeedback && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-healing-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                            <Card className="w-full max-w-md border-none shadow-2xl animate-in zoom-in-95 duration-300">
                                <CardHeader className="text-center space-y-2">
                                    <div className="mx-auto bg-healing-100 p-3 rounded-2xl w-fit">
                                        <Heart className="h-8 w-8 text-healing-600 fill-healing-600" />
                                    </div>
                                    <CardTitle className="text-2xl font-bold text-healing-900">Module: {currentModuleTitle}</CardTitle>
                                    <CardDescription className="text-healing-600 italic">“You’re doing great just by being here.”</CardDescription>
                                </CardHeader>
                                <CardContent className="text-center py-6">
                                    <p className="text-lg text-gray-700 leading-relaxed">
                                        Did this feel helpful for you?
                                    </p>
                                </CardContent>
                                <CardFooter className="flex flex-col space-y-3">
                                    <Button
                                        className="w-full bg-healing-600 hover:bg-healing-700 text-white h-12 text-lg font-semibold"
                                        onClick={() => handleFeedback(true)}
                                    >
                                        Yes, it helped <CheckCircle2 className="ml-2 h-5 w-5" />
                                    </Button>
                                    <div className="grid grid-cols-2 gap-3 w-full">
                                        <Button
                                            variant="ghost"
                                            className="text-muted-foreground hover:text-healing-700 hover:bg-healing-50"
                                            onClick={() => handleFeedback(false)}
                                        >
                                            Not really
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="text-muted-foreground hover:text-healing-700 hover:bg-healing-50"
                                            onClick={() => setShowFeedback(false)}
                                        >
                                            Try again later
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        </div>
                    )
                }

                {/* Urge Surfing Timer Overlay */}
                {
                    isTimerOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-500">
                            <Card className="w-full max-w-lg border-none shadow-2xl bg-white/95 overflow-hidden">
                                <div className="h-1.5 w-full bg-healing-100">
                                    <div
                                        className="h-full bg-healing-500 transition-all duration-1000 ease-linear"
                                        style={{ width: `${(timeLeft / 300) * 100}%` }}
                                    />
                                </div>
                                <CardHeader className="text-center pt-8">
                                    <div className="mx-auto bg-healing-50 p-4 rounded-full w-fit mb-2">
                                        <Wind className={`h-8 w-8 text-healing-600 ${isTimerRunning ? 'animate-pulse' : ''}`} />
                                    </div>
                                    <CardTitle className="text-3xl font-bold text-healing-900">Urge Surfing</CardTitle>
                                    <div className="py-4">
                                        <h1 className="text-6xl font-mono font-bold text-healing-600 tracking-tighter">
                                            {Math.floor(timeLeft / 60)}:
                                            {(timeLeft % 60).toString().padStart(2, "0")}
                                        </h1>
                                    </div>
                                </CardHeader>
                                <CardContent className="text-center space-y-6 pb-8">
                                    <div className="space-y-2">
                                        <p className="text-xl text-gray-800 font-medium">
                                            You don’t need to do anything right now.
                                        </p>
                                        <p className="text-gray-600">
                                            Just stay here and breathe. Waiting is enough.
                                        </p>
                                    </div>

                                    <div className="bg-healing-50/50 p-6 rounded-2xl border border-healing-100">
                                        <p className="text-healing-800 italic animate-in fade-in slide-in-from-bottom-2 duration-1000">
                                            Notice the urge without fighting it. <br />
                                            Like a wave, it will rise and fall.
                                        </p>
                                    </div>

                                    <div className="text-sm text-muted-foreground space-y-1">
                                        <p>Inhale slowly for 4 seconds…</p>
                                        <p>Exhale gently for 6 seconds…</p>
                                    </div>

                                    {timeLeft === 0 && !isTimerRunning && (
                                        <div className="pt-4 space-y-4 animate-in zoom-in-95 duration-500">
                                            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                                <p className="text-emerald-800 font-bold">
                                                    You stayed with the urge. That matters.
                                                </p>
                                            </div>

                                            <div className="space-y-3">
                                                <p className="font-medium text-gray-900">Did waiting help even a little?</p>
                                                <div className="flex gap-3">
                                                    <Button
                                                        className="flex-1 bg-healing-600 hover:bg-healing-700 text-white"
                                                        onClick={() => {
                                                            confirmHelpful('urge-surfing');
                                                            setIsTimerOpen(false);
                                                        }}
                                                    >
                                                        Yes, it helped
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="flex-1"
                                                        onClick={() => {
                                                            toast.info("Thank you for trying. Every minute counts.");
                                                            setIsTimerOpen(false);
                                                        }}
                                                    >
                                                        Not really
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter className="bg-gray-50/50 border-t flex justify-center py-4">
                                    <Button
                                        variant="ghost"
                                        className="text-muted-foreground"
                                        onClick={() => {
                                            setIsTimerRunning(false);
                                            setIsTimerOpen(false);
                                        }}
                                    >
                                        {timeLeft === 0 ? "Close" : "I'll come back later"}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    )}
            </div>
        </AppLayout>
    );
};

export default LearnPage;
