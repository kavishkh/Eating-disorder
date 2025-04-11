
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div className="flex h-screen w-full items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-healing-300 border-t-healing-600"></div>
    </div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Check if user has completed onboarding
  if (currentUser && !currentUser.onboardingCompleted && window.location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
