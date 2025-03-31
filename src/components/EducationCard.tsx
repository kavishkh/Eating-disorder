
import React from "react";
import { cn } from "@/lib/utils";

interface EducationCardProps {
  title: string;
  description: string;
  imageUrl: string;
  duration: string;
  onClick?: () => void;
  className?: string;
}

const EducationCard: React.FC<EducationCardProps> = ({
  title,
  description,
  imageUrl,
  duration,
  onClick,
  className,
}) => {
  return (
    <div 
      className={cn(
        "rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-all cursor-pointer", 
        className
      )}
      onClick={onClick}
    >
      <div className="relative h-48">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-2 right-2 bg-black text-white text-xs py-1 px-2 rounded">
          {duration}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
      </div>
    </div>
  );
};

export default EducationCard;
