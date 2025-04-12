
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, LogIn } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [animateForm, setAnimateForm] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger animation after component mounts
    setTimeout(() => {
      setAnimateForm(true);
    }, 100);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login(email, password);
      toast({
        title: "Success",
        description: "You have been successfully logged in",
      });
      
      // Add exit animation before navigating
      setAnimateForm(false);
      setTimeout(() => {
        navigate("/dashboard");
      }, 300);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log in. Please check your credentials.",
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
            <CardTitle className="text-center text-2xl text-healing-800">Welcome Back</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="#" className="text-xs text-healing-600 hover:text-healing-800">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-focus"
                />
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
                    <span>Logging in...</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <LogIn className="mr-2 h-4 w-4" />
                    <span>Log In</span>
                  </div>
                )}
              </Button>
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/register" className="font-medium text-healing-600 hover:text-healing-800">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
