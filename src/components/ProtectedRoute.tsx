import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { CloudOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading, isOnline } = useAuth();
  const { toast } = useToast();
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const location = useLocation();

  // Show toast when network status changes
  useEffect(() => {
    if (!isOnline) {
      toast({
        title: "You are offline",
        description: "Limited functionality available. Some features require internet connection.",
        variant: "destructive"
      });
    }
  }, [isOnline, toast]);

  const handleRetry = () => {
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);

    // Simulate checking connection
    setTimeout(() => {
      setIsRetrying(false);
      // Force reload if we're online but still having issues
      if (navigator.onLine) {
        window.location.reload();
      }
    }, 2000);
  };

  console.log("ProtectedRoute rendering with:", {
    currentUser: currentUser ? {
      id: currentUser.id,
      onboardingCompleted: currentUser.onboardingCompleted
    } : null,
    loading,
    isOnline,
    path: location.pathname
  });

  // Show loading spinner during initial authentication
  if (loading) {
    return <div className="flex h-screen w-full items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-healing-300 border-t-healing-600"></div>
    </div>;
  }

  // Offline error screen
  if (!isOnline && location.pathname !== '/onboarding' && !currentUser) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center p-4">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
          <CloudOff className="h-8 w-8 text-amber-600" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-800">You're offline</h1>
        <p className="mb-6 max-w-md text-center text-gray-600">
          Unable to connect to our servers. Please check your internet connection and try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleRetry}
            className="rounded-md bg-healing-600 px-4 py-2 text-white hover:bg-healing-700 flex items-center gap-2"
            disabled={isRetrying}
          >
            {isRetrying ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Checking connection...</span>
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                <span>Retry connection</span>
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  // Public pages
  if (["/", "/login", "/register", "/crisis-resources"].includes(location.pathname)) {
    return <>{children}</>;
  }

  // Not logged in -> Redirect to Login
  if (!currentUser) {
    console.log("No user found, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Onboarding Logic
  // If user is on onboarding page, allow it
  if (location.pathname === '/onboarding') {
    return <>{children}</>;
  }

  // If user hasn't completed onboarding, redirect to onboarding
  if (currentUser.onboardingCompleted === false) {
    console.log("User has not completed onboarding, redirecting to onboarding");
    return <Navigate to="/onboarding" replace />;
  }

  // Authenticated and Onboarded
  return <>{children}</>;
};

export default ProtectedRoute;
