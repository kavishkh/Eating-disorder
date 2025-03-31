
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import EducationCard from "@/components/EducationCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface EducationalContent {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  duration: string;
  category: string;
  videoUrl?: string;
  content?: string;
}

const educationalContent: EducationalContent[] = [
  {
    id: "1",
    title: "Understanding Eating Disorders",
    description: "Learn about different types of eating disorders and their impacts on physical and mental health.",
    imageUrl: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    duration: "8 min",
    category: "basics",
    content: "Eating disorders are complex mental health conditions characterized by disturbed eating behaviors and distressing thoughts and emotions related to food, eating, and body image. They can affect people of all genders, ages, racial and ethnic backgrounds, and socioeconomic statuses. Common types include Anorexia Nervosa, Bulimia Nervosa, Binge Eating Disorder, and Other Specified Feeding or Eating Disorders (OSFED)."
  },
  {
    id: "2",
    title: "Nutritional Rehabilitation",
    description: "Essential information about restoring balanced nutrition during recovery.",
    imageUrl: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
    duration: "12 min",
    category: "nutrition",
    content: "Nutritional rehabilitation is a critical component of eating disorder recovery. It involves gradually reestablishing regular eating patterns, correcting nutritional deficiencies, and developing a healthier relationship with food. This process typically begins with structured meal plans and eventually transitions to more intuitive and flexible eating as recovery progresses."
  },
  {
    id: "3",
    title: "Body Image in Recovery",
    description: "Strategies for improving body image and self-acceptance during the recovery process.",
    imageUrl: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1",
    duration: "10 min",
    category: "psychology",
    content: "Body image disturbance is a core feature of many eating disorders. Recovery involves working through these distortions and developing a more positive and accepting relationship with your body. This includes challenging negative thoughts, reducing body checking behaviors, practicing self-compassion, and recognizing your body's functionality rather than focusing solely on appearance."
  },
  {
    id: "4",
    title: "Mindfulness Techniques",
    description: "Learn mindfulness practices that can help manage difficult emotions during recovery.",
    imageUrl: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    duration: "15 min",
    category: "coping",
    content: "Mindfulness involves paying attention to the present moment without judgment. In eating disorder recovery, mindfulness techniques can help you become more aware of hunger and fullness cues, manage difficult emotions without turning to disordered eating behaviors, reduce anxiety around meals, and increase overall emotional regulation."
  },
  {
    id: "5",
    title: "Relapse Prevention Strategies",
    description: "Tools and techniques to prevent relapse and maintain recovery long-term.",
    imageUrl: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1",
    duration: "12 min",
    category: "coping",
    content: "Relapse prevention is an essential part of long-term recovery. It involves identifying personal triggers, developing effective coping strategies, recognizing early warning signs, and creating a detailed plan for maintaining recovery even during challenging times. Remember that lapses may occur during recovery, but they don't mean failure—they're opportunities for learning and growth."
  },
  {
    id: "6",
    title: "Family Support in Recovery",
    description: "How family members can provide effective support during the recovery process.",
    imageUrl: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
    duration: "9 min",
    category: "support",
    content: "Family support can significantly impact eating disorder recovery. Education about eating disorders helps family members understand the condition better. Open communication, avoiding food and weight-related comments, supporting treatment adherence, and addressing family dynamics are all important aspects of creating a supportive home environment for recovery."
  }
];

const Education = () => {
  const [userName, setUserName] = useState("User");
  const [selectedContent, setSelectedContent] = useState<EducationalContent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("all");
  
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
  
  const filteredContent = currentCategory === "all" 
    ? educationalContent 
    : educationalContent.filter(content => content.category === currentCategory);
  
  const handleContentSelect = (content: EducationalContent) => {
    setSelectedContent(content);
    setIsDialogOpen(true);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar userName={userName} />
      
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <h1 className="text-2xl font-bold mb-6">Educational Resources</h1>
        
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="all" onClick={() => setCurrentCategory("all")}>All</TabsTrigger>
            <TabsTrigger value="basics" onClick={() => setCurrentCategory("basics")}>Basics</TabsTrigger>
            <TabsTrigger value="nutrition" onClick={() => setCurrentCategory("nutrition")}>Nutrition</TabsTrigger>
            <TabsTrigger value="psychology" onClick={() => setCurrentCategory("psychology")}>Psychology</TabsTrigger>
            <TabsTrigger value="coping" onClick={() => setCurrentCategory("coping")}>Coping Skills</TabsTrigger>
            <TabsTrigger value="support" onClick={() => setCurrentCategory("support")}>Support</TabsTrigger>
          </TabsList>
          
          <TabsContent value={currentCategory} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContent.map((content) => (
                <EducationCard
                  key={content.id}
                  title={content.title}
                  description={content.description}
                  imageUrl={content.imageUrl}
                  duration={content.duration}
                  onClick={() => handleContentSelect(content)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          {selectedContent && (
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedContent.title}</DialogTitle>
                <DialogDescription className="text-gray-500">
                  {selectedContent.duration} • {selectedContent.category.charAt(0).toUpperCase() + selectedContent.category.slice(1)}
                </DialogDescription>
              </DialogHeader>
              
              <div>
                <img 
                  src={selectedContent.imageUrl} 
                  alt={selectedContent.title} 
                  className="w-full h-72 object-cover mb-6 rounded-md"
                />
                
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    {selectedContent.content}
                  </p>
                  
                  <div className="flex justify-center mt-6">
                    <p className="text-sm text-gray-500">
                      Note: In a complete application, this would include full educational content or an embedded video.
                    </p>
                  </div>
                </div>
              </div>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </div>
  );
};

export default Education;
