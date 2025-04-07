
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CardContainer } from '@/components/ui/card-container';
import { Search } from 'lucide-react';
import { ResourceCard } from '@/components/learn/ResourceCard';
import { LessonCard } from '@/components/learn/LessonCard';
import { motion } from 'framer-motion';
import { Resource } from '@/types';

const Learn = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('resources');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Mock data for resources
  const resources: Resource[] = [
    {
      id: '1',
      title: 'Understanding Trauma',
      description: 'A comprehensive guide to understanding the impact of trauma.',
      url: 'https://example.com/trauma',
      type: 'article',
      imageUrl: 'https://via.placeholder.com/150',
    },
    {
      id: '2',
      title: 'Mindfulness Meditation',
      description: 'Learn how to practice mindfulness meditation for stress reduction.',
      url: 'https://example.com/mindfulness',
      type: 'video',
      imageUrl: 'https://via.placeholder.com/150',
    },
  ];

  // Mock data for lessons
  const lessons = [
    {
      id: '1',
      title: 'Introduction to CBT',
      duration: '30 min',
      category: 'Therapy',
      completed: true,
      thumbnail: '🧠',
    },
    {
      id: '2',
      title: 'Building Resilience',
      duration: '45 min',
      category: 'Personal Growth',
      completed: false,
      thumbnail: '💪',
    },
  ];

  // Filtered resources based on search query
  const filteredResources = resources.filter((resource) =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filtered lessons based on search query
  const filteredLessons = lessons.filter((lesson) =>
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lesson.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="container space-y-6"
    >
      <CardContainer variant="frosted">
        <div className="flex items-center">
          <Input
            type="search"
            placeholder="Search resources and lessons..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="flex-1"
          />
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </CardContainer>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="resources" className="w-1/2">Resources</TabsTrigger>
          <TabsTrigger value="lessons" className="w-1/2">Lessons</TabsTrigger>
        </TabsList>
        <TabsContent value="resources" className="space-y-4">
          {filteredResources.length > 0 ? (
            filteredResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))
          ) : (
            <p>No resources found.</p>
          )}
        </TabsContent>
        <TabsContent value="lessons" className="space-y-4">
          {filteredLessons.length > 0 ? (
            filteredLessons.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))
          ) : (
            <p>No lessons found.</p>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Learn;
