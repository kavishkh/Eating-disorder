
import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertTriangle,
  Phone,
  MessageSquare,
  ExternalLink,
  Heart,
  Users,
  Info,
  BookOpen,
  ArrowLeft,
  Globe,
  MapPin
} from "lucide-react";

const CrisisResourcesPage = () => {
  const { currentUser } = useAuth();

  return (
    <div className="app-container min-h-screen bg-gradient-to-b from-healing-50 to-white">
      <div className="container mx-auto max-w-5xl py-8 px-4">
        {/* Header with back link */}
        <div className="mb-8">
          {currentUser ? (
            <Link to="/dashboard" className="flex items-center text-healing-700 hover:text-healing-900 mb-4 transition-colors">
              <ArrowLeft className="mr-1 h-4 w-4" />
              <span>Back to Dashboard</span>
            </Link>
          ) : (
            <Link to="/" className="flex items-center text-healing-700 hover:text-healing-900 mb-4 transition-colors">
              <ArrowLeft className="mr-1 h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          )}

          <div className="flex items-start space-x-4">
            <div className="rounded-2xl bg-red-50 p-3 shadow-sm">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-healing-900">Crisis & Safety Resources</h1>
              <p className="text-gray-600 mt-1 max-w-2xl">
                If you're experiencing thoughts of self-harm, suicidal ideation, or a mental health emergency,
                please reach out for immediate support. You are not alone.
              </p>
            </div>
          </div>
        </div>

        {/* Emergency disclaimer */}
        <Card className="mb-8 border-red-200 bg-red-50/50 backdrop-blur-sm border-2">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-4">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-red-800">In Immediate Danger?</h3>
                <p className="text-red-700 mt-1 leading-relaxed">
                  If you are in immediate danger or experiencing a life-threatening emergency,
                  please call your local emergency services right away.
                  <br />
                  <span className="font-bold">India: Dial 112</span> | <span className="font-bold">US: Dial 911</span> | <span className="font-bold">UK: Dial 999/111</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Indian National Helplines (Priority) */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4 px-1">
            <MapPin className="h-5 w-5 text-healing-600" />
            <h2 className="text-xl font-bold text-healing-900">India: National 24/7 Helplines</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-healing-200 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold text-healing-800 flex items-center justify-between">
                  Tele-MANAS
                  <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase tracking-wider">Govt Approved</span>
                </CardTitle>
                <CardDescription className="text-xs">National Tele-Mental Health Helpline</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">Free, confidential 24/7 counselling for stress, anxiety, and crisis support.</p>
                <div className="flex flex-col gap-2">
                  <Button variant="default" className="bg-healing-600 hover:bg-healing-700 w-full justify-start h-11" asChild>
                    <a href="tel:14416">
                      <Phone className="mr-3 h-4 w-4" />
                      Dial 14416
                    </a>
                  </Button>
                  <Button variant="outline" className="border-healing-200 w-full justify-start h-11" asChild>
                    <a href="tel:18008914416">
                      <Phone className="mr-3 h-4 w-4" />
                      1800-891-4416
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-healing-200 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold text-healing-800 flex items-center justify-between">
                  KIRAN Helpline
                  <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase tracking-wider">24x7 Toll-Free</span>
                </CardTitle>
                <CardDescription className="text-xs">Mental Health Rehabilitation Helpline</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">Emotional support for anxiety, depression, and suicidal thoughts across multiple languages.</p>
                <Button variant="default" className="bg-healing-600 hover:bg-healing-700 w-full justify-start h-11" asChild>
                  <a href="tel:18005990019">
                    <Phone className="mr-3 h-4 w-4" />
                    1800-599-0019
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-healing-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold text-healing-800">AASRA</CardTitle>
                <CardDescription className="text-xs">Suicide Prevention & Counselling</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">Professional, confidential support for people in emotional distress or despair.</p>
                <Button variant="outline" className="border-healing-200 w-full justify-start h-11" asChild>
                  <a href="tel:+912227546669">
                    <Phone className="mr-3 h-4 w-4" />
                    +91-22-27546669
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-healing-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold text-healing-800">Vandrevala Foundation</CardTitle>
                <CardDescription className="text-xs">24/7 Crisis Intervention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">Empathetic listening and emotional support for anyone in mental health crisis.</p>
                <Button variant="outline" className="border-healing-200 w-full justify-start h-11" asChild>
                  <a href="tel:+919999666555">
                    <Phone className="mr-3 h-4 w-4" />
                    +91-9999-666-555
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Global Support (International) */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4 px-1">
            <Globe className="h-5 w-5 text-healing-600" />
            <h2 className="text-xl font-bold text-healing-900">International Support Hotlines</h2>
          </div>
          <Card className="border-healing-200">
            <CardContent className="grid gap-6 md:grid-cols-2 pt-6">
              <div className="space-y-2">
                <h3 className="font-bold text-healing-800">US: 988 Suicide & Crisis Lifeline</h3>
                <p className="text-sm text-gray-600">Call or text 988 anytime in the US and Canada for free support.</p>
                <div className="flex gap-2 pt-1">
                  <Button variant="ghost" size="sm" className="h-8 text-healing-700 bg-healing-50" asChild>
                    <a href="tel:988">Call 988</a>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 text-healing-700 bg-healing-50" asChild>
                    <a href="https://988lifeline.org/" target="_blank" rel="noopener noreferrer">Website</a>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-healing-800">UK: Samaritans</h3>
                <p className="text-sm text-gray-600">24/7 free listening service for anyone in the UK or Ireland.</p>
                <div className="flex gap-2 pt-1">
                  <Button variant="ghost" size="sm" className="h-8 text-healing-700 bg-healing-50" asChild>
                    <a href="tel:116123">Call 116 123</a>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 text-healing-700 bg-healing-50" asChild>
                    <a href="https://www.samaritans.org/" target="_blank" rel="noopener noreferrer">Website</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Specialized Resources */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4 px-1">
            <BookOpen className="h-5 w-5 text-healing-600" />
            <h2 className="text-xl font-bold text-healing-900">Specialized Support</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-healing-100 bg-healing-50/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-healing-800 flex items-center gap-2">
                  <Heart className="h-4 w-4" /> Live Love Laugh (India)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-600 mb-3">Lists verified mental health helplines across multiple Indian languages.</p>
                <Button variant="link" className="p-0 h-auto text-healing-600 text-xs" asChild>
                  <a href="https://www.thelivelovelaughfoundation.org/" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-1 h-3 w-3" /> Visit Knowledge Hub
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-healing-100 bg-healing-50/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-healing-800 flex items-center gap-2">
                  <Users className="h-4 w-4" /> NEDA (Eating Disorders)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-600 mb-3">Support, resources, and treatment options specifically for eating disorders.</p>
                <Button variant="link" className="p-0 h-auto text-healing-600 text-xs" asChild>
                  <a href="https://www.nationaleatingdisorders.org/" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-1 h-3 w-3" /> Visit NEDA
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Important note */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-healing-100 text-center max-w-3xl mx-auto">
          <Info className="h-6 w-6 text-healing-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-healing-800 mb-2">A Note on Professional Care</h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Recovery Journey is a supportive companion, but it is not a replacement for clinical treatment.
            We strongly encourage you to work with a therapist or doctor specialized in eating disorders.
            If you're in crisis, please use the helplines above—they are staffed by trained professionals who want to help.
          </p>
          {!currentUser && (
            <Button asChild className="bg-healing-600 hover:bg-healing-700 rounded-full px-8">
              <Link to="/">Return Home</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CrisisResourcesPage;
