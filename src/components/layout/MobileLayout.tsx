
import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home, MessageSquare, Lightbulb, Box, User, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';

const MobileLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  
  const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: Flag, label: 'Goals', path: '/goals' },
    { icon: MessageSquare, label: 'Chat', path: '/chat' },
    { icon: Box, label: '3D View', path: '/visualizer' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];
  
  // Emergency help button that stays visible
  const EmergencyHelp = () => (
    <div className="fixed top-4 right-4 z-50">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button 
          variant="destructive"
          size="sm"
          className="rounded-full px-4 shadow-lg animate-pulse-soft frosted-glass"
          onClick={() => {
            navigate('/emergency');
          }}
        >
          Get Help Now
        </Button>
      </motion.div>
    </div>
  );
  
  return (
    <div className="flex flex-col h-screen">
      {/* Safety button */}
      <EmergencyHelp />
      
      {/* Main content area with scroll */}
      <ScrollArea className="flex-1 pb-20">
        <main className="container pt-16 pb-24">
          <Outlet />
        </main>
      </ScrollArea>
      
      {/* Navigation bar */}
      <nav className="fixed bottom-0 left-0 right-0 frosted-glass h-16 px-1 shadow-lg">
        <div className="flex items-center justify-around h-full">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <motion.button
                key={item.path}
                onClick={() => navigate(item.path)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={cn(
                  "flex flex-col items-center justify-center px-2 py-1 rounded-lg transition-all",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className={cn(
                  "relative p-1 rounded-md transition-all duration-200",
                  isActive ? "bg-primary/20" : "hover:bg-primary/10"
                )}>
                  <Icon size={20} className={isActive ? "animate-pulse-soft" : ""} />
                  {isActive && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
                  )}
                </div>
                <span className="text-xs mt-1">{item.label}</span>
              </motion.button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default MobileLayout;
