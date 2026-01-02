import React, { useState } from "react";
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

const LearnPage = () => {
    const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

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
                            <TabsTrigger value="crisis" className="rounded-lg px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm">
                                <AlertCircle className="mr-2 h-4 w-4" /> Crisis & Help
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
                                                onClick={() => toast.success("Urge session started. Take a deep breath.")}
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
                                {[
                                    {
                                        title: "5-4-3-2-1 Grounding",
                                        subtitle: "Connect with the present moment",
                                        description: "5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you can taste.",
                                        icon: Wind,
                                        color: "indigo"
                                    },
                                    {
                                        title: "Box Breathing",
                                        subtitle: "Regulate your nervous system",
                                        description: "Inhale for 4, hold for 4, exhale for 4, hold for 4. Repeat 3 times.",
                                        icon: Shield,
                                        color: "teal"
                                    },
                                    {
                                        title: "Urge Surfing",
                                        subtitle: "Ride the wave of an urge",
                                        description: "Visualize the urge as a wave. It rises, peaks, and eventually must fall.",
                                        icon: Zap,
                                        color: "amber"
                                    },
                                    {
                                        title: "Self-Soothing",
                                        subtitle: "Nurture your senses",
                                        description: "A soft blanket, a warm tea, or your favorite scent can calm the amygdala.",
                                        icon: Heart,
                                        color: "rose"
                                    }
                                ].map((tool, i) => (
                                    <Card key={i} className="group hover:shadow-xl transition-all duration-300 border-healing-100">
                                        <CardHeader className="flex flex-row items-start space-x-4">
                                            <div className={`bg-${tool.color}-100 p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                                                <tool.icon className={`h-6 w-6 text-${tool.color}-600`} />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl">{tool.title}</CardTitle>
                                                <CardDescription>{tool.subtitle}</CardDescription>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-gray-700 leading-relaxed">{tool.description}</p>
                                        </CardContent>
                                        <CardFooter className="flex justify-between items-center text-sm font-medium">
                                            <Button
                                                variant="ghost"
                                                className="text-healing-600 hover:text-healing-700 hover:bg-healing-50 p-0 h-auto"
                                                onClick={() => toast.info(`Starting ${tool.title} exercise...`)}
                                            >
                                                Practice now
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                className="text-muted-foreground p-0 h-auto"
                                                onClick={() => toast.info(`Loading audio guide for ${tool.title}...`)}
                                            >
                                                Listen to guide
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
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
                                            {item.content}
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
                                    <div key={i} className={`${item.color} p-8 rounded-3xl border border-white/50 shadow-sm space-y-4`}>
                                        <Badge className="bg-white text-gray-900 border-none shadow-sm">{item.type}</Badge>
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
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="crisis" className="space-y-8">
                            <Card className="border-red-100 bg-red-50/50">
                                <CardHeader className="text-center">
                                    <div className="mx-auto bg-red-100 p-3 rounded-full w-fit mb-4">
                                        <AlertCircle className="h-8 w-8 text-red-600" />
                                    </div>
                                    <CardTitle className="text-3xl text-red-900">If things feel heavy...</CardTitle>
                                    <CardDescription className="text-red-800 text-lg">You never have to carry this alone. Please reach out to someone who can hold space for you.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm space-y-4">
                                            <h4 className="font-bold text-gray-900 text-xl">India-specific Helplines</h4>
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                                                    <div>
                                                        <p className="font-bold text-red-900">Vandrevala Foundation</p>
                                                        <p className="text-sm text-red-700">24/7 Support</p>
                                                    </div>
                                                    <Button variant="outline" className="text-red-700 border-red-200 hover:bg-red-100">9999 666 555</Button>
                                                </div>
                                                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                                                    <div>
                                                        <p className="font-bold text-red-900">iCall (TISS)</p>
                                                        <p className="text-sm text-red-700">Mon-Sat, 8am-10pm</p>
                                                    </div>
                                                    <Button variant="outline" className="text-red-700 border-red-200 hover:bg-red-100">9152987821</Button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm space-y-4">
                                            <h4 className="font-bold text-gray-900 text-xl">When to get extra help?</h4>
                                            <ul className="space-y-3">
                                                {[
                                                    "Frequent thoughts of self-harm",
                                                    "Dizziness, fainting or heart palpitations",
                                                    "Unable to stop behaviors on your own",
                                                    "Feeling completely hopeless or 'stuck'",
                                                    "Rapid weight changes or severe fatigue"
                                                ].map((sign, i) => (
                                                    <li key={i} className="flex items-start space-x-2 text-sm text-gray-700">
                                                        <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                                                        <span>{sign}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="text-center p-8 bg-white rounded-2xl border border-red-100 shadow-sm">
                                        <h4 className="font-bold text-xl mb-2">Need more long-term support?</h4>
                                        <p className="text-muted-foreground mb-6">We have a curated list of specialized therapist and treatment centers.</p>
                                        <Button className="bg-red-600 hover:bg-red-700 h-12 px-8 rounded-full">Explore Full Resources</Button>
                                    </div>
                                </CardContent>
                            </Card>
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
                            <Badge className="bg-healing-600">Level 1: Explorer</Badge>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">Modules Completed</span>
                                    <span className="text-muted-foreground">3 / 8</span>
                                </div>
                                <Progress value={37.5} className="h-2" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                                <div className="bg-white p-4 rounded-xl border border-healing-100 flex items-center space-x-3">
                                    <div className="bg-emerald-100 p-2 rounded-lg"><CheckCircle2 className="h-4 w-4 text-emerald-600" /></div>
                                    <span className="text-sm font-medium">Read Foundation</span>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-healing-100 flex items-center space-x-3">
                                    <div className="bg-emerald-100 p-2 rounded-lg"><CheckCircle2 className="h-4 w-4 text-emerald-600" /></div>
                                    <span className="text-sm font-medium">Tested 5-4-3-2-1</span>
                                </div>
                                <div className="bg-white/50 p-4 rounded-xl border border-dashed border-gray-300 flex items-center space-x-3 grayscale opacity-60">
                                    <div className="bg-gray-100 p-2 rounded-lg"><Star className="h-4 w-4 text-gray-400" /></div>
                                    <span className="text-sm font-medium text-gray-400">Complete CBT Module</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </AppLayout>
    );
};

export default LearnPage;
