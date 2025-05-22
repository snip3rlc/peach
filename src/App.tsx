
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

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check subscription status if user is logged in
        if (session?.user) {
          setTimeout(() => {
            checkSubscription();
          }, 0);
        } else {
          setSubscription(null);
        }
      }
    );

    // Check initial session
    const initializeAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user ?? null);
        
        // Check subscription status if user is logged in
        if (data.session?.user) {
          await checkSubscription();
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };
    
    initializeAuth();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const checkSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) {
        console.error('Error checking subscription:', error);
        return;
      }
      setSubscription(data);
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };
  
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
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Protected route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (loading) {
      return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }
    
    if (!session) {
      return <Navigate to="/signin" />;
    }
    
    return <>{children}</>;
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
                {/* Authentication and onboarding routes */}
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/signin" element={<SignIn />} />
                
                {/* Main app routes */}
                <Route path="/" element={
                  session ? (
                    <>
                      <Dashboard />
                      <BottomNav />
                    </>
                  ) : (
                    <Navigate to="/signin" />
                  )
                } />
                <Route path="/practice" element={
                  <>
                    <Practice />
                    <BottomNav />
                  </>
                } />
                <Route path="/topics" element={
                  <>
                    <TopicSelect />
                    <BottomNav />
                  </>
                } />
                <Route path="/questions" element={
                  <>
                    <QuestionSelect />
                    <BottomNav />
                  </>
                } />
                <Route path="/record-answer" element={
                  <>
                    <RecordAnswer />
                    <BottomNav />
                  </>
                } />
                <Route path="/feedback" element={
                  <>
                    <Feedback />
                    <BottomNav />
                  </>
                } />
                <Route path="/history" element={
                  <>
                    <ProtectedRoute>
                      <History />
                    </ProtectedRoute>
                    <BottomNav />
                  </>
                } />
                <Route path="/plans" element={
                  <>
                    <Plans />
                    <BottomNav />
                  </>
                } />
                <Route path="/profile" element={
                  <>
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                    <BottomNav />
                  </>
                } />
                <Route path="/referral" element={
                  <>
                    <ProtectedRoute>
                      <Referral />
                    </ProtectedRoute>
                    <BottomNav />
                  </>
                } />
                <Route path="/tests" element={
                  <>
                    <Tests />
                    <BottomNav />
                  </>
                } />
                
                {/* Subscription routes */}
                <Route path="/subscription/success" element={
                  <ProtectedRoute>
                    <SubscriptionSuccess />
                  </ProtectedRoute>
                } />
                
                {/* Test routes */}
                <Route path="/test/:testId" element={
                  <>
                    <TestQuestion />
                    <BottomNav />
                  </>
                } />
                <Route path="/test/:testId/results" element={
                  <>
                    <TestResults />
                    <BottomNav />
                  </>
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
