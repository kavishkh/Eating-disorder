import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Pages
import WelcomePage from "./pages/WelcomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import AIChatPage from "./pages/AIChatPage";
import MoodTrackerPage from "./pages/MoodTrackerPage";
import EducationalHub from "./pages/EducationalHub";
import CrisisResourcesPage from "./pages/CrisisResourcesPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

// Educational Hub Subpages
import UnderstandingED from "./pages/EducationalHub/UnderstandingED";
import NutritionBasics from "./pages/EducationalHub/NutritionBasics";
import CopingStrategies from "./pages/EducationalHub/CopingStrategies";
import BodyImage from "./pages/EducationalHub/BodyImage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/onboarding" element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/chat" element={
              <ProtectedRoute>
                <AIChatPage />
              </ProtectedRoute>
            } />
            <Route path="/mood" element={
              <ProtectedRoute>
                <MoodTrackerPage />
              </ProtectedRoute>
            } />
            <Route 
              path="/learn" 
              element={
                <ProtectedRoute>
                  <EducationalHub />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="understanding" replace />} /> 
              <Route path="understanding" element={<UnderstandingED />} />
              <Route path="nutrition" element={<NutritionBasics />} />
              <Route path="coping" element={<CopingStrategies />} />
              <Route path="body-image" element={<BodyImage />} />
            </Route>
            <Route path="/crisis-resources" element={<CrisisResourcesPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
