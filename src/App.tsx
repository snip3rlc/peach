
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen pb-16">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/level-select" element={<LevelSelect />} />
            <Route path="/topics" element={<TopicSelect />} />
            <Route path="/questions" element={<QuestionSelect />} />
            <Route path="/template" element={<TemplateSelect />} />
            <Route path="/practice-answer" element={<PracticeAnswer />} />
            <Route path="/record-answer" element={<RecordAnswer />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/history" element={<History />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/referral" element={<Referral />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNav />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
