
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, FileText, Globe, Users, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'website' | 'guide' | 'directory' | 'video';
  url: string;
}

interface ResourceCardProps {
  resource: Resource;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  const getIcon = () => {
    switch (resource.type) {
      case 'website':
        return <Globe className="h-5 w-5" />;
      case 'guide':
        return <FileText className="h-5 w-5" />;
      case 'directory':
        return <Users className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };
  
  const handleOpenResource = () => {
    // In a real app, this would either open the URL or navigate to the resource
    if (resource.url.startsWith('http')) {
      window.open(resource.url, '_blank', 'noopener,noreferrer');
    }
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all">
      <CardContent className="p-0">
        <div className="flex items-center">
          <div className="p-4 bg-primary/10 flex items-center justify-center h-full text-primary">
            {getIcon()}
          </div>
          
          <div className="flex-1 p-4">
            <div className="flex justify-between">
              <div>
                <h3 className="font-medium">{resource.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {resource.description}
                </p>
              </div>
              
              <Button 
                size="sm" 
                variant="ghost"
                className="ml-2"
                onClick={handleOpenResource}
              >
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">Open</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
