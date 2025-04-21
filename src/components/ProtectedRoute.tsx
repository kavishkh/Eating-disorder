
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CloudOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading, isOnline } = useAuth();
  const { toast } = useToast();
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    // Show toast when network status changes
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
    path: window.location.pathname
  });

  if (loading) {
    return <div className="flex h-screen w-full items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-healing-300 border-t-healing-600"></div>
    </div>;
  }

  // Offline error screen
  if (!isOnline && window.location.pathname !== '/onboarding') {
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
          
          {window.location.pathname !== '/onboarding' && currentUser && (
            <Button
              onClick={() => window.location.href = '/onboarding'}
              variant="outline"
              className="rounded-md px-4 py-2"
            >
              Continue to onboarding
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Special handling for onboarding page when offline
  if (!isOnline && window.location.pathname === '/onboarding') {
    // Allow users to continue to onboarding even when offline
    console.log("User is offline but trying to access onboarding, allowing access");
    // We'll show offline warning in the onboarding component, but allow access
  }

  if (!currentUser) {
    console.log("No user found, redirecting to login");
    return <Navigate to="/login" />;
  }

  // Check if user has completed onboarding - be explicit to avoid undefined comparison issues
  // Allow offline users to complete onboarding
  if (currentUser && currentUser.onboardingCompleted === false && window.location.pathname !== "/onboarding") {
    console.log("User has not completed onboarding, redirecting to onboarding");
    return <Navigate to="/onboarding" />;
  }

  console.log("User authenticated, rendering protected content");
  return <>{children}</>;
};

export default ProtectedRoute;
