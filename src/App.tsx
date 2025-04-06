
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AIProvider } from "@/contexts/AIContext";
import { PrivateRoute } from "@/components/auth/PrivateRoute";
import Homepage from "./pages/Homepage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Onboarding from "./pages/onboarding/Onboarding";
import Dashboard from "./pages/dashboard/Dashboard";
import Chat from "./pages/chat/Chat";
import Visualizer from "./pages/visualizer/Visualizer";
import Learn from "./pages/learn/Learn";
import Goals from "./pages/goals/Goals";
import Profile from "./pages/profile/Profile";
import NotFound from "./pages/NotFound";
import MobileLayout from "./components/layout/MobileLayout";

const queryClient = new QueryClient();

const App = () => {
  // Set dark theme by default
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AIProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/onboarding" element={<PrivateRoute><Onboarding /></PrivateRoute>} />
                
                <Route element={<MobileLayout />}>
                  <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                  <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
                  <Route path="/visualizer" element={<PrivateRoute><Visualizer /></PrivateRoute>} />
                  <Route path="/learn" element={<PrivateRoute><Learn /></PrivateRoute>} />
                  <Route path="/goals" element={<PrivateRoute><Goals /></PrivateRoute>} />
                  <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AIProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
