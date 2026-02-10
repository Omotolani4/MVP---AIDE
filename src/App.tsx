import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppLayout from "@/layouts/AppLayout";
import { TidioWidget, TidioChatButton } from "@/components/TidioWidget";
import { useLocation } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ResetPassword from "./pages/ResetPassword";
import Auth from "./pages/Auth";
import Quiz from "./pages/Quiz";
import QuizStep2 from "./pages/QuizStep2";
import Submission from "./pages/Submission";
import Dashboard from "./pages/Dashboard";
import Assessment from "./pages/Assessment";
import Settings from "./pages/Settings";
import Tasks from "./pages/Tasks";
import Resources from "./pages/Resources";
import Analytics from "./pages/Analytics";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <TidioWidget />
        <AppRoutes />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

const AppRoutes = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth";

  return (
    <>
      {!isAuthPage && <TidioChatButton />}
      <BrowserRouter>
        <Routes>
          {/* ===== PUBLIC / NO LAYOUT ===== */}
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Quiz flow (no sidebar/topbar) */}
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/quiz-step2" element={<QuizStep2 />} />
          <Route path="/submission" element={<Submission />} />

          {/* ===== APP LAYOUT (LOCKED) ===== */}
          <Route
            element={<AppLayout />}
          >
            <Route
              path="/dashboard"
              element={<Dashboard showQuizPrompt={true} />}
            />
            <Route
              path="/dashboard-full"
              element={<Dashboard showQuizPrompt={false} />}
            />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/analytics" element={<Analytics />} />
          </Route>

          {/* ===== FALLBACK ===== */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
