
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import Dashboard from "./pages/Dashboard";
import LevelSelect from "./pages/LevelSelect";
import TopicSelect from "./pages/TopicSelect";
import QuestionSelect from "./pages/QuestionSelect";
import TemplateSelect from "./pages/TemplateSelect";
import PracticeAnswer from "./pages/PracticeAnswer";
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

const queryClient = new QueryClient();

const App = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding') === 'true';

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
              <Route path="/level-select" element={
                <>
                  <LevelSelect />
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
              <Route path="/template" element={
                <>
                  <TemplateSelect />
                  <BottomNav />
                </>
              } />
              <Route path="/practice-answer" element={
                <>
                  <PracticeAnswer />
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
