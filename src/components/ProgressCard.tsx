
import React, { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";

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
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Reset to 0 and animate from there
    setAnimatedPercentage(0);
    
    // Show loading state briefly
    setLoading(true);
    
    // Add a slight delay before starting the animation
    const timer = setTimeout(() => {
      setLoading(false);
      setAnimatedPercentage(percentage);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <motion.div 
      className={cn("card hover:shadow-lg transition-all bg-gradient-to-br from-[#0a0a0a] to-[#090909] border-[#1a1a1a] glow-effect", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.2)" }}
    >
      <h3 className="font-semibold text-lg mb-2 text-blue-300">{title}</h3>
      <p className="text-gray-400 text-sm mb-4">{description}</p>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          {loading ? (
            <motion.div 
              className="flex items-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Loader className="w-4 h-4 text-blue-500 animate-spin" />
              <span className="text-sm text-gray-300">Loading...</span>
            </motion.div>
          ) : (
            <motion.span 
              className="text-sm font-medium text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {animatedPercentage}% complete
            </motion.span>
          )}
          <span className="text-xs text-white font-medium px-3 py-1 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full shadow-sm">
            Not started
          </span>
        </div>
        {loading ? (
          <div className="blue-loader py-3">
            <div></div>
          </div>
        ) : (
          <Progress value={animatedPercentage} className="h-2" />
        )}
      </div>
    </motion.div>
  );
};

export default ProgressCard;
