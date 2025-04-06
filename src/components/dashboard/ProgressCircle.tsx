
import React from 'react';

interface ProgressCircleProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
}

export const ProgressCircle: React.FC<ProgressCircleProps> = ({ 
  progress, 
  size = 80, 
  strokeWidth = 8 
}) => {
  const normalizedProgress = Math.min(100, Math.max(0, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (normalizedProgress / 100) * circumference;
  
  // Determine color based on progress
  const getProgressColor = () => {
    if (normalizedProgress < 25) return "text-mindful-danger";
    if (normalizedProgress < 50) return "text-amber-400";
    if (normalizedProgress < 75) return "text-blue-400";
    return "text-green-400";
  };

  const progressColor = getProgressColor();
  
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted opacity-20"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className={`${progressColor} transition-all duration-500 ease-in-out`}
        />
      </svg>
      
      {/* Percentage text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-medium">{normalizedProgress}%</span>
      </div>
    </div>
  );
};
