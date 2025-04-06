
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Homepage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero section */}
      <main className="flex-1 container flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md mx-auto">
          <div className="mb-4 animate-float">
            <svg
              viewBox="0 0 24 24"
              className="mx-auto h-24 w-24 text-mindful-primary"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </div>
          
          <h1 className="gradient-heading text-4xl font-bold mb-2">Mindful Model</h1>
          <p className="text-xl mb-6">Support for your healing journey</p>
          
          <p className="text-muted-foreground mb-8">
            A supportive companion using AI and 3D modeling to help with eating disorder recovery.
          </p>
          
          <div className="space-y-4">
            {currentUser ? (
              <Button 
                size="lg" 
                className="w-full" 
                onClick={() => navigate('/dashboard')}
              >
                Continue to Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  size="lg" 
                  className="w-full" 
                  onClick={() => navigate('/register')}
                >
                  Create an Account
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
              </>
            )}
          </div>
        </div>
      </main>
      
      {/* Footer with disclaimer */}
      <footer className="bg-secondary py-4 px-6">
        <div className="container text-center text-xs text-muted-foreground">
          <p className="mb-1">
            <strong>Important Notice:</strong> This app is not a substitute for professional medical advice, diagnosis, or treatment.
          </p>
          <p>
            If you are experiencing a medical emergency, call your local emergency number immediately.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
