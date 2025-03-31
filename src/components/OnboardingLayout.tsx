
import React from "react";
import { cn } from "@/lib/utils";

interface OnboardingLayoutProps {
  children: React.ReactNode;
  className?: string;
  step: number;
  totalSteps: number;
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  children,
  className,
  step,
  totalSteps,
}) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-white">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">
              Step {step} of {totalSteps}
            </span>
            <span className="text-sm font-medium">
              {Math.round((step / totalSteps) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-black rounded-full h-2 transition-all duration-300 ease-in-out"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>
        <div
          className={cn(
            "bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-100 animate-fade-in",
            className
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default OnboardingLayout;
