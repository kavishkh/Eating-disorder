
import React from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ProgressCardProps {
  title: string;
  description: string;
  percentage: number;
  className?: string;
}

const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  description,
  percentage,
  className,
}) => {
  return (
    <div className={cn("card", className)}>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">{percentage}% complete</span>
          <span className="text-xs text-gray-500 font-medium">
            {percentage < 100 ? "In progress" : "Completed"}
          </span>
        </div>
        <Progress value={percentage} className="h-2" />
      </div>
    </div>
  );
};

export default ProgressCard;
