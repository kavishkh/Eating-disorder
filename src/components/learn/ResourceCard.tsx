
import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'video' | 'article' | 'book' | 'website' | 'directory' | 'guide';
  imageUrl?: string;
  category?: string;
}

interface ResourceCardProps {
  resource: Resource;
  index: number;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, index }) => {
  // Determine icon and color based on resource type
  const getResourceTypeStyles = () => {
    switch (resource.type) {
      case 'video':
        return { icon: '📹', bgColor: 'bg-red-100 dark:bg-red-950/30', textColor: 'text-red-600 dark:text-red-400' };
      case 'article':
        return { icon: '📄', bgColor: 'bg-blue-100 dark:bg-blue-950/30', textColor: 'text-blue-600 dark:text-blue-400' };
      case 'book':
        return { icon: '📚', bgColor: 'bg-amber-100 dark:bg-amber-950/30', textColor: 'text-amber-600 dark:text-amber-400' };
      case 'website':
        return { icon: '🌐', bgColor: 'bg-green-100 dark:bg-green-950/30', textColor: 'text-green-600 dark:text-green-400' };
      case 'directory':
        return { icon: '📂', bgColor: 'bg-purple-100 dark:bg-purple-950/30', textColor: 'text-purple-600 dark:text-purple-400' };
      case 'guide':
        return { icon: '📝', bgColor: 'bg-teal-100 dark:bg-teal-950/30', textColor: 'text-teal-600 dark:text-teal-400' };
      default:
        return { icon: '📝', bgColor: 'bg-gray-100 dark:bg-gray-800', textColor: 'text-gray-600 dark:text-gray-400' };
    }
  };
  
  const { icon, bgColor, textColor } = getResourceTypeStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
    >
      <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
        <div className="relative h-48 bg-muted">
          {resource.imageUrl ? (
            <img 
              src={resource.imageUrl} 
              alt={resource.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-primary/10 to-primary/20">
              <span className="text-4xl opacity-70">{icon}</span>
            </div>
          )}
          <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${bgColor} ${textColor}`}>
            {resource.type}
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2 line-clamp-1">{resource.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{resource.description}</p>
          <a 
            href={resource.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center text-sm font-medium text-primary hover:underline"
          >
            View Resource <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </CardContent>
      </Card>
    </motion.div>
  );
};
