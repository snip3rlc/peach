
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
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

const queryClient = new QueryClient();

const App = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding') === 'true';

  return (
    <QueryClientProvider client={queryClient}>
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
                <>
                  <Dashboard />
                  <BottomNav />
                </>
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
                  <History />
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
                  <Profile />
                  <BottomNav />
                </>
              } />
              <Route path="/referral" element={
                <>
                  <Referral />
                  <BottomNav />
                </>
              } />
              <Route path="/tests" element={
                <>
                  <Tests />
                  <BottomNav />
                </>
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
    </QueryClientProvider>
  );
};

export default App;
