import { PageLayout } from "@/components/PageLayout";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface Activity {
  id: string;
  type: "task" | "quiz";
  title: string;
  timestamp: number;
}

export default function Analytics() {
  const [firstName, setFirstName] = useState<string>("");
  const [assessmentCount, setAssessmentCount] = useState(0);
  const [tasksDone, setTasksDone] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [averageProgress, setAverageProgress] = useState(0);
  const [activities, setActivities] = useState<Activity[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("first_name")
        .eq("id", user.id)
        .single();

      if (profile?.first_name) {
        setFirstName(profile.first_name);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Load analytics data from localStorage
  useEffect(() => {
    // Load quiz completions
    const quizCompletions = JSON.parse(localStorage.getItem("quizCompletions") || "0");
    setAssessmentCount(quizCompletions);

    // Load completed tasks
    const completedTasks = JSON.parse(localStorage.getItem("completedTasks") || "[]");
    setTasksDone(Math.min(completedTasks.length, 4));

    // Load activities
    const storedActivities = JSON.parse(localStorage.getItem("activities") || "[]");
    setActivities(storedActivities.sort((a: Activity, b: Activity) => b.timestamp - a.timestamp));

    // Calculate average progress (quiz completion rate + task completion rate) / 2
    const taskProgress = (completedTasks.length / 4) * 100;
    const quizProgress = quizCompletions > 0 ? Math.min(quizCompletions * 20, 100) : 0;
    const avgProgress = Math.round((taskProgress + quizProgress) / 2);
    setAverageProgress(avgProgress);
  }, []);

  // Track session time
  useEffect(() => {
    const startTime = Date.now();
    const sessionKey = `session_${startTime}`;
    localStorage.setItem(sessionKey, "active");

    const interval = setInterval(() => {
      const sessions = Object.keys(localStorage).filter(key => key.startsWith("session_"));
      const totalMinutes = sessions.length * 5; // 5 minutes per session
      const hours = Math.round(totalMinutes / 60);
      setTimeSpent(hours);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Listen for storage changes to update in real-time
  useEffect(() => {
    const handleStorageChange = () => {
      // Update quiz count
      const quizCompletions = JSON.parse(localStorage.getItem("quizCompletions") || "0");
      setAssessmentCount(quizCompletions);

      // Update tasks done
      const completedTasks = JSON.parse(localStorage.getItem("completedTasks") || "[]");
      setTasksDone(Math.min(completedTasks.length, 4));

      // Update activities
      const storedActivities = JSON.parse(localStorage.getItem("activities") || "[]");
      setActivities(storedActivities.sort((a: Activity, b: Activity) => b.timestamp - a.timestamp));

      // Recalculate average progress
      const taskProgress = (completedTasks.length / 4) * 100;
      const quizProgress = quizCompletions > 0 ? Math.min(quizCompletions * 20, 100) : 0;
      const avgProgress = Math.round((taskProgress + quizProgress) / 2);
      setAverageProgress(avgProgress);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "just now";
  };

  return (
    <PageLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white rounded-2xl py-5 px-6 md:px-8 hover-bubble shadow-lg"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-1">
          Performance Analytics
        </h1>
        <p className="text-sm md:text-base text-foreground">
          Track your growth and engagement based on your AIDE activity.
        </p>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
      >
        <div className="bg-white py-4 px-4 md:px-5 hover-bubble shadow-lg">
          <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">
            Assessment Completed
          </h3>
          <p className="text-3xl md:text-5xl font-bold text-foreground">{assessmentCount}</p>
        </div>

        <div className="bg-secondary py-4 px-4 md:px-5 hover-bubble shadow-lg">
          <h3 className="text-xs md:text-sm font-medium text-foreground mb-1">
            Tasks Done
          </h3>
          <p className="text-3xl md:text-5xl font-bold text-foreground">{tasksDone}<span className="text-lg md:text-2xl">/4</span></p>
        </div>

        <div className="bg-secondary py-4 px-4 md:px-5 hover-bubble shadow-lg">
          <h3 className="text-xs md:text-sm font-medium text-foreground mb-1">
            Time Spent
          </h3>
          <p className="text-3xl md:text-5xl font-bold text-foreground">{timeSpent}<span className="text-lg md:text-2xl">hr</span></p>
        </div>

        <div className="bg-white py-4 px-4 md:px-5 hover-bubble shadow-lg">
          <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">
            Average Progress
          </h3>
          <p className="text-3xl md:text-5xl font-bold text-foreground">{averageProgress}<span className="text-lg md:text-2xl">%</span></p>
        </div>
      </motion.div>

      {/* Goal Tracker */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        className="bg-white py-5 px-6 md:px-8 hover-bubble shadow-lg"
      >
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5 md:w-6 md:h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg md:text-xl font-bold text-foreground">Goal Tracker</h3>
        </div>
        <p className="text-sm md:text-base text-foreground mb-4">
          You've achieved {averageProgress}% of your overall progress. Keep up the consistency!
        </p>
        <div className="relative w-full h-5 md:h-6 bg-secondary rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-500" 
            style={{ width: `${averageProgress}%` }}
          />
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
        className="bg-white py-5 px-6 md:px-8 hover-bubble shadow-lg"
      >
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 md:w-6 md:h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h3 className="text-lg md:text-xl font-bold text-foreground">Recent Activity</h3>
        </div>
        {activities.length > 0 ? (
          <ul className="space-y-3 text-sm md:text-base text-foreground">
            {activities.slice(0, 5).map((activity) => (
              <li key={activity.id} className="flex justify-between items-start">
                <span>
                  • {activity.type === "task" ? "✓ Completed task:" : "✓ Completed assessment:"} <strong>"{activity.title}"</strong>
                </span>
                <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">{formatTime(activity.timestamp)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm md:text-base text-muted-foreground italic">
            No activities yet. Start completing tasks or assessments to see your activity here.
          </p>
        )}
      </motion.div>
    </PageLayout>
  );
}
