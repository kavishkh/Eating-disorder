
import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface GoalCardProps {
  title: string;
  description: string;
  isCompleted: boolean;
  onToggle: () => void;
  className?: string;
}

const GoalCard: React.FC<GoalCardProps> = ({
  title,
  description,
  isCompleted,
  onToggle,
  className,
}) => {
  return (
    <div
      className={cn(
        "border rounded-lg p-4 transition-all",
        isCompleted
          ? "border-black bg-gray-50"
          : "border-gray-200 bg-white hover:border-gray-300",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={onToggle}
          className={cn(
            "w-6 h-6 rounded-full flex-shrink-0 border transition-all flex items-center justify-center mt-1",
            isCompleted
              ? "bg-black border-black text-white"
              : "border-gray-300 hover:border-black"
          )}
        >
          {isCompleted && <Check className="w-4 h-4" />}
        </button>
        <div className={cn(isCompleted && "text-gray-500")}>
          <h3 className="font-medium mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default GoalCard;
