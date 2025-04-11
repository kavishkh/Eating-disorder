
import AppLayout from "../components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookOpen,
  Search,
  Play,
  Award,
  Clock,
  Bookmark,
  Heart,
  Brain,
  Utensils,
  Users,
  Sparkles
} from "lucide-react";

// Mock content data
const mockVideos = [
  {
    id: "v1",
    title: "Understanding Eating Disorders",
    description: "An overview of different types of eating disorders and their characteristics.",
    duration: "12:45",
    thumbnail: "https://images.unsplash.com/photo-1505455184862-554165e5f6ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Understanding"
  },
  {
    id: "v2",
    title: "The Science of Recovery",
    description: "How the brain and body heal during the recovery process.",
    duration: "15:20",
    thumbnail: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Science"
  },
  {
    id: "v3",
    title: "Building a Positive Body Image",
    description: "Practical techniques to improve your relationship with your body.",
    duration: "18:05",
    thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Body Image"
  },
  {
    id: "v4",
    title: "Mindful Eating Practice",
    description: "A guided session on developing mindful eating habits.",
    duration: "10:30",
    thumbnail: "https://images.unsplash.com/photo-1574484284002-952d92456975?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Nutrition"
  },
  {
    id: "v5",
    title: "Coping with Triggers",
    description: "Strategies for managing challenging situations and emotional triggers.",
    duration: "14:15",
    thumbnail: "https://images.unsplash.com/photo-1474418397713-003ec72a36a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Coping"
  },
  {
    id: "v6",
    title: "Recovery Stories: Sarah's Journey",
    description: "An inspiring personal account of overcoming an eating disorder.",
    duration: "22:10",
    thumbnail: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Stories"
  }
];

const mockArticles = [
  {
    id: "a1",
    title: "The Role of Self-Compassion in Recovery",
    description: "How being kind to yourself can accelerate healing and growth.",
    readTime: "5 min read",
    category: "Mental Health"
  },
  {
    id: "a2",
    title: "Nutrition Basics for Recovery",
    description: "Understanding nutritional needs during the healing process.",
    readTime: "8 min read",
    category: "Nutrition"
  },
  {
    id: "a3",
    title: "Building a Support System",
    description: "How to create and maintain a network of supporters during recovery.",
    readTime: "6 min read",
    category: "Support"
  },
  {
    id: "a4",
    title: "Challenging Cognitive Distortions",
    description: "Identifying and changing unhelpful thought patterns related to eating and body image.",
    readTime: "7 min read",
    category: "Mental Health"
  }
];

const featuredContent = [
  {
    id: "f1",
    title: "Recovery Fundamentals",
    description: "Essential knowledge and tools to support your healing journey",
    icon: Heart,
    color: "text-pink-500",
    bgColor: "bg-pink-100"
  },
  {
    id: "f2",
    title: "Mindfulness Practices",
    description: "Techniques to stay present and develop self-awareness",
    icon: Brain,
    color: "text-indigo-500",
    bgColor: "bg-indigo-100"
  },
  {
    id: "f3",
    title: "Nutrition Education",
    description: "Understanding balanced nutrition without numbers or diet culture",
    icon: Utensils,
    color: "text-green-500",
    bgColor: "bg-green-100"
  },
  {
    id: "f4",
    title: "Community Support",
    description: "Stories and insights from others on the recovery path",
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-100"
  }
];

const EducationalHub = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-healing-900">Educational Hub</h2>
          <p className="text-muted-foreground">
            Explore evidence-based resources to support your recovery journey
          </p>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search for topics, keywords, or content..."
            className="pl-10 border-healing-200"
          />
        </div>

        {/* Featured content */}
        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center text-healing-800">
            <Sparkles className="mr-2 h-5 w-5 text-healing-600" />
            Featured Content
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {featuredContent.map((content) => {
              const IconComponent = content.icon;
              return (
                <Card key={content.id} className="card-hover border-healing-100">
                  <CardContent className="pt-6">
                    <div className={`rounded-full w-12 h-12 flex items-center justify-center mb-4 ${content.bgColor}`}>
                      <IconComponent className={`h-6 w-6 ${content.color}`} />
                    </div>
                    <h4 className="font-medium text-healing-800 mb-1">{content.title}</h4>
                    <p className="text-sm text-gray-600">{content.description}</p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="link" className="px-0 text-healing-600">
                      Explore Content
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Content tabs */}
        <Tabs defaultValue="videos" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="videos" className="text-sm">Videos</TabsTrigger>
            <TabsTrigger value="articles" className="text-sm">Articles</TabsTrigger>
            <TabsTrigger value="tools" className="text-sm">Tools & Exercises</TabsTrigger>
          </TabsList>
          
          <TabsContent value="videos" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockVideos.map((video) => (
                <Card key={video.id} className="card-hover overflow-hidden border-healing-100">
                  <div className="relative">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="h-40 w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Button className="rounded-full bg-white bg-opacity-80 text-healing-800 hover:bg-white hover:text-healing-600">
                        <Play className="h-6 w-6" />
                      </Button>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <CardContent className="pt-4">
                    <div className="mb-2">
                      <span className="text-xs font-medium bg-healing-100 text-healing-800 px-2 py-0.5 rounded-full">
                        {video.category}
                      </span>
                    </div>
                    <h3 className="font-medium text-healing-800">{video.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{video.description}</p>
                  </CardContent>
                  <CardFooter className="pt-0 flex justify-between">
                    <Button variant="link" className="px-0 text-healing-600">
                      Watch Video
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-500">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="text-center mt-4">
              <Button variant="outline" className="border-healing-200 text-healing-800">
                Load More Videos
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="articles" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {mockArticles.map((article) => (
                <Card key={article.id} className="card-hover border-healing-100">
                  <CardContent className="pt-6">
                    <div className="mb-2">
                      <span className="text-xs font-medium bg-healing-100 text-healing-800 px-2 py-0.5 rounded-full">
                        {article.category}
                      </span>
                      <span className="text-xs text-gray-500 ml-2 flex items-center inline-flex">
                        <Clock className="h-3 w-3 mr-1" />
                        {article.readTime}
                      </span>
                    </div>
                    <h3 className="font-medium text-healing-800">{article.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{article.description}</p>
                  </CardContent>
                  <CardFooter className="pt-0 flex justify-between">
                    <Button variant="link" className="px-0 text-healing-600">
                      Read Article
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-500">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="text-center mt-4">
              <Button variant="outline" className="border-healing-200 text-healing-800">
                Browse All Articles
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="tools" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="card-hover border-healing-100">
                <CardContent className="pt-6">
                  <div className="rounded-full w-12 h-12 flex items-center justify-center mb-4 bg-purple-100">
                    <Brain className="h-6 w-6 text-purple-500" />
                  </div>
                  <h3 className="font-medium text-healing-800">Cognitive Restructuring Worksheet</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Identify and challenge negative thoughts about food and body image.
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button className="w-full bg-healing-500 hover:bg-healing-600">
                    Open Worksheet
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="card-hover border-healing-100">
                <CardContent className="pt-6">
                  <div className="rounded-full w-12 h-12 flex items-center justify-center mb-4 bg-blue-100">
                    <Award className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="font-medium text-healing-800">Recovery Milestones Tracker</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Track and celebrate your progress in recovery, big and small.
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button className="w-full bg-healing-500 hover:bg-healing-600">
                    Open Tracker
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="card-hover border-healing-100">
                <CardContent className="pt-6">
                  <div className="rounded-full w-12 h-12 flex items-center justify-center mb-4 bg-green-100">
                    <Heart className="h-6 w-6 text-green-500" />
                  </div>
                  <h3 className="font-medium text-healing-800">Self-Compassion Meditation</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    A guided audio meditation to develop kindness toward yourself.
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button className="w-full bg-healing-500 hover:bg-healing-600">
                    Begin Meditation
                  </Button>
                </CardFooter>
              </Card>
            </div>
            <div className="text-center mt-4">
              <Button variant="outline" className="border-healing-200 text-healing-800">
                Explore More Tools
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Learning progress */}
        <Card className="border-healing-200">
          <CardHeader>
            <CardTitle className="flex items-center text-healing-800">
              <BookOpen className="mr-2 h-5 w-5 text-healing-600" />
              Your Learning Progress
            </CardTitle>
            <CardDescription>Track your educational journey</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Recovery Fundamentals</h4>
                <p className="text-xs text-muted-foreground">2 of 5 resources completed</p>
              </div>
              <div className="w-1/3 bg-gray-200 rounded-full h-2.5">
                <div className="bg-healing-500 h-2.5 rounded-full" style={{ width: "40%" }}></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Mindful Eating</h4>
                <p className="text-xs text-muted-foreground">1 of 3 resources completed</p>
              </div>
              <div className="w-1/3 bg-gray-200 rounded-full h-2.5">
                <div className="bg-healing-500 h-2.5 rounded-full" style={{ width: "33%" }}></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Body Image</h4>
                <p className="text-xs text-muted-foreground">0 of 4 resources completed</p>
              </div>
              <div className="w-1/3 bg-gray-200 rounded-full h-2.5">
                <div className="bg-healing-500 h-2.5 rounded-full" style={{ width: "0%" }}></div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full border-healing-200 text-healing-700">
              View All Learning Paths
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
};

export default EducationalHub;
