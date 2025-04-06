
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { LessonCard } from '@/components/learn/LessonCard';
import { ResourceCard } from '@/components/learn/ResourceCard';
import { Search } from 'lucide-react';
import { Lesson, Resource } from '@/types';

const Learn = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('lessons');
  
  // Sample lessons data
  const lessons: Lesson[] = [
    {
      id: 'lesson1',
      title: 'Understanding Eating Disorders',
      description: 'Learn about the different types of eating disorders and their impacts.',
      duration: '15 min',
      progress: 0,
      category: 'Educational',
      completed: false,
      thumbnail: '📚',
    },
    {
      id: 'lesson2',
      title: 'Nutrition Fundamentals',
      description: 'Basic nutritional information to support recovery.',
      duration: '20 min',
      progress: 0,
      category: 'Nutrition',
      completed: false,
      thumbnail: '🥗',
    },
    {
      id: 'lesson3',
      title: 'Body Image and Self-Esteem',
      description: 'Tools for improving your relationship with your body.',
      duration: '25 min',
      progress: 0,
      category: 'Mental Health',
      completed: false,
      thumbnail: '💪',
    },
    {
      id: 'lesson4',
      title: 'Mindful Eating Practices',
      description: 'Techniques for developing a healthier relationship with food.',
      duration: '18 min',
      progress: 0,
      category: 'Mindfulness',
      completed: false,
      thumbnail: '🧘',
    },
  ];
  
  // Sample resources data
  const resources: Resource[] = [
    {
      id: 'res1',
      title: 'National Eating Disorders Association',
      description: 'Support resources and helpline information.',
      category: 'Support',
      url: 'https://www.nationaleatingdisorders.org/',
      icon: '🏥',
    },
    {
      id: 'res2',
      title: 'Recovery Meal Planning Guide',
      description: 'Downloadable guide for nutritional planning.',
      category: 'Nutrition',
      url: 'https://example.com/guide',
      icon: '📋',
    },
    {
      id: 'res3',
      title: 'Therapist Directory',
      description: 'Find specialized eating disorder professionals.',
      category: 'Professional Help',
      url: 'https://example.com/directory',
      icon: '👩‍⚕️',
    },
    {
      id: 'res4',
      title: 'Recovery Stories: Hope and Healing',
      description: 'Watch inspiring stories from others in recovery.',
      category: 'Inspiration',
      url: 'https://example.com/video',
      icon: '📹',
    },
  ];
  
  // Filter content based on search query
  const filteredLessons = lessons.filter(
    (lesson) => lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                lesson.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredResources = resources.filter(
    (resource) => resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  resource.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Learn</h1>
      
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search lessons and resources..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="lessons">
          <Card>
            <CardHeader>
              <CardTitle>Educational Lessons</CardTitle>
              <CardDescription>
                Learn about eating disorders, recovery, and wellbeing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredLessons.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No lessons found matching your search.
                </p>
              ) : (
                filteredLessons.map((lesson) => (
                  <LessonCard key={lesson.id} lesson={lesson} />
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle>Helpful Resources</CardTitle>
              <CardDescription>
                External resources for continued support
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredResources.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No resources found matching your search.
                </p>
              ) : (
                filteredResources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Learn;
