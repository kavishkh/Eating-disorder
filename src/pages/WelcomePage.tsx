
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";
import { Heart, Shield, Brain } from "lucide-react";

const WelcomePage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard if user is already logged in
    if (currentUser) {
      if (!currentUser.onboardingCompleted) {
        navigate("/onboarding");
      } else {
        navigate("/dashboard");
      }
    }
  }, [currentUser, navigate]);

  return (
    <div className="app-container">
      <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
        <div className="animate-fade-in mb-8 text-healing-800">
          <div className="mb-4 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-1 animate-pulse-gentle rounded-full bg-healing-300 blur-md"></div>
              <Heart className="relative h-20 w-20 text-healing-600" strokeWidth={1.5} />
            </div>
          </div>
          <h1 className="mb-2 text-4xl font-bold tracking-tight text-healing-900 md:text-5xl">
            Recovery Journey
          </h1>
          <p className="text-xl text-healing-700">Your AI companion for healing and growth</p>
        </div>

        <div className="mb-12 max-w-2xl rounded-xl bg-white p-6 shadow-lg md:p-8">
          <p className="mb-6 text-lg text-gray-700">
            Welcome to a supportive space designed to help you navigate your recovery from eating
            disorders. Empathetic, private, and always available when you need support.
          </p>

          <div className="mb-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-lg bg-healing-50 p-4 text-center">
              <div className="mb-3 flex justify-center">
                <Shield className="h-8 w-8 text-healing-600" />
              </div>
              <h3 className="mb-1 font-medium text-healing-800">Safe & Private</h3>
              <p className="text-sm text-gray-600">Your data is secure and your journey is confidential</p>
            </div>

            <div className="rounded-lg bg-healing-50 p-4 text-center">
              <div className="mb-3 flex justify-center">
                <Brain className="h-8 w-8 text-healing-600" />
              </div>
              <h3 className="mb-1 font-medium text-healing-800">AI Support</h3>
              <p className="text-sm text-gray-600">Personalized guidance based on clinical expertise</p>
            </div>

            <div className="rounded-lg bg-healing-50 p-4 text-center">
              <div className="mb-3 flex justify-center">
                <Heart className="h-8 w-8 text-healing-600" />
              </div>
              <h3 className="mb-1 font-medium text-healing-800">Recovery Focused</h3>
              <p className="text-sm text-gray-600">Evidence-based tools for your healing journey</p>
            </div>
          </div>

          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Button className="bg-healing-600 hover:bg-healing-700" asChild size="lg">
              <Link to="/register">Get Started</Link>
            </Button>
            <Button variant="outline" className="border-healing-300 text-healing-800" asChild size="lg">
              <Link to="/login">Log In</Link>
            </Button>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p className="mb-2">
            <strong>Important:</strong> This application is designed as a supportive tool and is not a
            replacement for professional medical or therapeutic treatment.
          </p>
          <Link to="/crisis-resources" className="text-healing-600 hover:underline">
            Access Crisis Resources →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
