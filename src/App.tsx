import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { createContext, useEffect, useState } from "react";
import BottomNav from "./components/BottomNav";
import Dashboard from "./pages/Dashboard";
import TopicSelect from "./pages/TopicSelect";
import QuestionSelect from "./pages/QuestionSelect";
import RecordAnswer from "./pages/RecordAnswer";
import Feedback from "./pages/Feedback";
import Practice from "./pages/Practice";
import History from "./pages/History";
import Plans from "./pages/Plans";
import Profile from "./pages/Profile";
import Referral from "./pages/Referral";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import SignIn from "./pages/SignIn";
import Tests from "./pages/Tests";
import TestQuestion from "./pages/test/TestQuestion";
import TestResults from "./pages/test/TestResults";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import { supabase } from "./integrations/supabase/client";

const queryClient = new QueryClient();

export const AuthContext = createContext<{
  session: any;
  user: any;
  subscription: any;
  loading: boolean;
  signOut: () => Promise<void>;
}>({
  session: null,
  user: null,
  subscription: null,
  loading: true,
  signOut: async () => {},
});

// Helper function to clean up authentication state
const cleanupAuthState = () => {
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
};

const App = () => {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding') === 'true';
  
  // For demo purposes - setting mock user only if authenticated
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (isAuthenticated) {
      // This is a mock user for demonstration
      const mockUser = {
        id: 'mock-user-id',
        email: 'demo@example.com',
        user_metadata: {
          full_name: 'Demo User'
        },
        created_at: new Date().toISOString()
      };
      
      const mockSession = {
        user: mockUser,
        access_token: 'mock-token'
      };
      
      setSession(mockSession);
      setUser(mockUser);
      
      // Mock subscription data
      setSubscription({
        active: true,
        plan: 'silver',
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });
    }
    
    setLoading(false);
  }, []);

  const signOut = async () => {
    try {
      // Clean up auth state
      cleanupAuthState();
      
      // Attempt global sign out
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) {
        console.error('Error signing out:', error);
      }
      
      // Reset state
      setSession(null);
      setUser(null);
      setSubscription(null);
      
      // Set isAuthenticated to false in localStorage
      localStorage.setItem('isAuthenticated', 'false');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Protected route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (loading) {
      return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }
    
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuthenticated) {
      if (!hasSeenOnboarding) {
        return <Navigate to="/onboarding" />;
      }
      return <Navigate to="/signin" />;
    }
    
    return <>{children}</>;
  };

  // Redirect root based on auth status
  const RootRedirect = () => {
    if (loading) {
      return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }
    
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuthenticated) {
      if (!hasSeenOnboarding) {
        return <Navigate to="/onboarding" replace />;
      }
      return <Navigate to="/signin" replace />;
    }
    
    return <Navigate to="/dashboard" replace />;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ session, user, subscription, loading, signOut }}>
        <BrowserRouter>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <div className="min-h-screen">
              <Routes>
                {/* Root redirect */}
                <Route path="/" element={<RootRedirect />} />
                
                {/* Authentication and onboarding routes */}
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/signin" element={<SignIn />} />
                
                {/* Main app routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                    <BottomNav />
                  </ProtectedRoute>
                } />
                <Route path="/practice" element={
                  <ProtectedRoute>
                    <Practice />
                    <BottomNav />
                  </ProtectedRoute>
                } />
                <Route path="/topics" element={
                  <ProtectedRoute>
                    <TopicSelect />
                    <BottomNav />
                  </ProtectedRoute>
                } />
                <Route path="/questions" element={
                  <ProtectedRoute>
                    <QuestionSelect />
                    <BottomNav />
                  </ProtectedRoute>
                } />
                <Route path="/record-answer" element={
                  <ProtectedRoute>
                    <RecordAnswer />
                    <BottomNav />
                  </ProtectedRoute>
                } />
                <Route path="/feedback" element={
                  <ProtectedRoute>
                    <Feedback />
                    <BottomNav />
                  </ProtectedRoute>
                } />
                <Route path="/history" element={
                  <ProtectedRoute>
                    <History />
                    <BottomNav />
                  </ProtectedRoute>
                } />
                <Route path="/plans" element={
                  <ProtectedRoute>
                    <Plans />
                    <BottomNav />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                    <BottomNav />
                  </ProtectedRoute>
                } />
                <Route path="/referral" element={
                  <ProtectedRoute>
                    <Referral />
                    <BottomNav />
                  </ProtectedRoute>
                } />
                <Route path="/tests" element={
                  <ProtectedRoute>
                    <Tests />
                    <BottomNav />
                  </ProtectedRoute>
                } />
                
                {/* Subscription routes */}
                <Route path="/subscription/success" element={
                  <ProtectedRoute>
                    <SubscriptionSuccess />
                  </ProtectedRoute>
                } />
                
                {/* Test routes */}
                <Route path="/test/:testId" element={
                  <ProtectedRoute>
                    <TestQuestion />
                    <BottomNav />
                  </ProtectedRoute>
                } />
                <Route path="/test/:testId/results" element={
                  <ProtectedRoute>
                    <TestResults />
                    <BottomNav />
                  </ProtectedRoute>
                } />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </TooltipProvider>
        </BrowserRouter>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
