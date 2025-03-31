
import React from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { 
  Bell, 
  User, 
  MessageCircle,
  Book,
  Calendar,
  Video
} from "lucide-react";

interface NavBarProps {
  userName?: string;
}

const NavBar: React.FC<NavBarProps> = ({ userName = "User" }) => {
  const { toast } = useToast();
  
  const handleNotificationClick = () => {
    toast({
      title: "Notifications",
      description: "No new notifications at this time.",
    });
  };

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/dashboard" className="font-semibold text-xl">
          <span className="text-black">Mindful</span>
          <span className="text-gray-500">Recovery</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/dashboard" 
            className="text-gray-700 hover:text-black hover-underline-animation transition-colors"
          >
            Dashboard
          </Link>
          <Link 
            to="/chat" 
            className="text-gray-700 hover:text-black hover-underline-animation transition-colors"
          >
            AI Support
          </Link>
          <Link 
            to="/education" 
            className="text-gray-700 hover:text-black hover-underline-animation transition-colors"
          >
            Education
          </Link>
          <Link 
            to="/progress" 
            className="text-gray-700 hover:text-black hover-underline-animation transition-colors"
          >
            Progress
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleNotificationClick}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Bell size={20} />
          </button>
          <Link to="/profile" className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors">
            <User size={20} />
            <span className="hidden sm:inline text-sm font-medium">{userName}</span>
          </Link>
        </div>
      </div>
      
      {/* Mobile navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
        <div className="flex justify-around py-3">
          <Link to="/dashboard" className="flex flex-col items-center text-xs">
            <Book size={20} className="mb-1" />
            <span>Dashboard</span>
          </Link>
          <Link to="/chat" className="flex flex-col items-center text-xs">
            <MessageCircle size={20} className="mb-1" />
            <span>AI Chat</span>
          </Link>
          <Link to="/education" className="flex flex-col items-center text-xs">
            <Video size={20} className="mb-1" />
            <span>Learn</span>
          </Link>
          <Link to="/progress" className="flex flex-col items-center text-xs">
            <Calendar size={20} className="mb-1" />
            <span>Progress</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
