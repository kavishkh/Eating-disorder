import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, UserPlus, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [animateForm, setAnimateForm] = useState(false);

  const { register, error, currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger animation after component mounts
    setTimeout(() => {
      setAnimateForm(true);
    }, 100);

    // If user is already logged in, redirect appropriately
    if (currentUser) {
      // For existing users, direct them to the dashboard
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  const validatePassword = () => {
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    }
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await register(email, password, name);
      toast({
        title: "Account created",
        description: "Your account has been successfully created",
      });

      console.log("Registration successful, redirecting to onboarding...");

      // For new registrations, always redirect to onboarding
      navigate("/onboarding", { replace: true });
    } catch (err: any) {
      console.error("Registration error:", err);

      // Display more specific error messages based on Firebase error codes
      let errorMessage = "Failed to create account. Please try again.";

      if (err.code === "auth/email-already-in-use") {
        errorMessage = "This email is already in use. Please try another email or log in.";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Invalid email address. Please check and try again.";
      } else if (err.code === "auth/weak-password") {
        errorMessage = "Password is too weak. Please use a stronger password.";
      } else if (err.code === "auth/configuration-not-found") {
        errorMessage = "Authentication service is unavailable. Please try again later.";
      } else if (err.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your connection and try again.";
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };



  return (
    <div className="app-container flex min-h-screen flex-col items-center justify-center p-4">
      <Link to="/" className="absolute left-4 top-4 flex items-center text-healing-700 hover:text-healing-900">
        <ArrowLeft className="mr-1 h-4 w-4" />
        <span>Back</span>
      </Link>

      <div className={`w-full max-w-md transition-all duration-500 transform ${animateForm ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <Card className="border-healing-100 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl text-healing-800">Create an Account</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-600 flex items-start">
                  <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>An unexpected error occurred. Please try again later.</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="input-focus"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-focus"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-focus"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="input-focus"
                />
                {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
              </div>
              <div className="text-xs text-gray-600">
                <p>By creating an account, you agree to our <Link to="#" className="text-healing-600 hover:underline">Terms of Service</Link> and <Link to="#" className="text-healing-600 hover:underline">Privacy Policy</Link>.</p>
              </div>
            </CardContent>
            <CardFooter className="flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-healing-600 hover:bg-healing-700 transition-all duration-300 transform hover:scale-105"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Creating account...</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <UserPlus className="mr-2 h-4 w-4" />
                    <span>Sign Up</span>
                  </div>
                )}
              </Button>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-healing-600 hover:text-healing-800">
                  Log in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
