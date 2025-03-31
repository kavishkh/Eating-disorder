
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to onboarding
    navigate("/onboarding/1");
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Mindful Recovery</h1>
        <p className="text-xl text-gray-600">Redirecting to onboarding...</p>
      </div>
    </div>
  );
};

export default Index;
