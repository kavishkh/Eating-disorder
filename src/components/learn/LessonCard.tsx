
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, PlayCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  category: string;
  completed: boolean;
  thumbnail: string;
}

interface LessonCardProps {
  lesson: Lesson;
}

export const LessonCard: React.FC<LessonCardProps> = ({ lesson }) => {
  const handleStartLesson = () => {
    toast.info(`Opening lesson: ${lesson.title}`);
    // In a real app, this would navigate to the lesson content
  };
  
  return (
    <Card className={`overflow-hidden transition-all hover:shadow-md ${
      lesson.completed ? 'bg-muted/50' : 'bg-background'
    }`}>
      <CardContent className="p-0">
        <div className="flex items-center">
          <div className="p-4 text-3xl bg-secondary flex items-center justify-center h-full">
            {lesson.thumbnail}
          </div>
          
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{lesson.title}</h3>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{lesson.duration}</span>
                </div>
              </div>
              
              <div className="ml-2">
                {lesson.completed ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-5 w-5 mr-1" />
                    <span className="text-xs font-medium">Completed</span>
                  </div>
                ) : (
                  <Button size="sm" variant="ghost" onClick={handleStartLesson}>
                    <PlayCircle className="h-5 w-5 mr-1" />
                    Start
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
