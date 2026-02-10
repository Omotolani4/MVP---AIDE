import { PageLayout } from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Complete Awareness Journal",
    description: "Reflect on your current mindset and note key insights.",
    completed: false,
  },
  {
    id: "2",
    title: "Set Weekly Intention",
    description: "Define 3 clear goals for the week to stay aligned.",
    completed: false,
  },
  {
    id: "3",
    title: "Make One Decisive Move",
    description: "Take one action that moves you closer to your goal.",
    completed: false,
  },
  {
    id: "4",
    title: "Execute Your Action Plan",
    description: "Put your weekly plan into motion and review results.",
    completed: false,
  },
];

export default function Tasks() {
  const [firstName, setFirstName] = useState("");
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return navigate("/auth");

      setUserId(user.id);

      const { data } = await supabase
        .from("profiles")
        .select("first_name")
        .eq("id", user.id)
        .single();

      if (data?.first_name) setFirstName(data.first_name);

      // Load completed tasks from localStorage
      const completedTasks = JSON.parse(localStorage.getItem("completedTasks") || "[]");
      setTasks(prev => 
        prev.map(task => ({
          ...task,
          completed: completedTasks.includes(task.id)
        }))
      );

      // Check if returning from resources page with a download completed
      const resourceDownloadCompleted = localStorage.getItem("resourceDownloadCompleted");
      if (resourceDownloadCompleted === "true") {
        localStorage.removeItem("resourceDownloadCompleted");
        setTasks(prev =>
          prev.map(task => {
            if (task.id === "1" && !task.completed) {
              toast.success(`Task completed: ${task.title}`);
              // Persist to localStorage
              persistTaskCompletion(user.id, "1", task.title);
              return { ...task, completed: true };
            }
            return task;
          })
        );
      }
    };

    fetchProfile();
  }, [navigate]);

  const persistTaskCompletion = async (uid: string, taskId: string, taskTitle: string) => {
    try {
      // Store in localStorage for Dashboard to read
      const completedTasks = JSON.parse(localStorage.getItem("completedTasks") || "[]");
      if (!completedTasks.includes(taskId)) {
        completedTasks.push(taskId);
        localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
      }

      // Log activity
      const activities = JSON.parse(localStorage.getItem("activities") || "[]");
      activities.push({
        id: `task-${taskId}-${Date.now()}`,
        type: "task",
        title: taskTitle,
        timestamp: Date.now(),
      });
      localStorage.setItem("activities", JSON.stringify(activities));
    } catch (err) {
      console.error("Error persisting task:", err);
    }
  };

  const toggleTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task || !userId) return;

    // Task 1: Open Resources page
    if (id === "1") {
      navigate("/resources");
      return;
    }

    // Tasks 2, 3, 4: Open Google Tasks in new tab
    if (id === "2" || id === "3" || id === "4") {
      const googleTasksWindow = window.open("https://tasks.google.com", "GoogleTasks");
      if (googleTasksWindow) {
        // Mark as completed if window opened successfully
        setTasks(prev =>
          prev.map(t => {
            if (t.id === id && !t.completed) {
              toast.success(`Task completed: ${t.title}`);
              // Persist to database
              persistTaskCompletion(userId, id, t.title);
              return { ...t, completed: true };
            }
            return t;
          })
        );
      } else {
        toast.error("Failed to open Google Tasks. Please check popup blocker settings.");
      }
      return;
    }
  };

  return (
    <PageLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="hover-bubble bg-white rounded-2xl shadow-lg p-6 md:p-8"
      >
        <h1 className="text-2xl md:text-4xl font-normal" style={{ fontFamily: "Arial" }}>
          Complete Your AIDE Tasks, <span className="text-primary">{firstName || "Name"}!</span>
        </h1>
        <p className="mt-3 text-base md:text-lg font-montserrat">
          Each step brings you closer to clarity, confidence, and execution.
        </p>
      </motion.div>

      {/* Tasks Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
        className="hover-bubble bg-white shadow-lg p-6 md:p-8"
      >
        <div className="space-y-6">
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 + index * 0.1 }}
              onClick={() => toggleTask(task.id)}
              className="flex items-start gap-4 cursor-pointer group transition-transform hover:scale-105"
            >
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => toggleTask(task.id)}
                className="mt-1 h-6 w-6 border-2 border-foreground"
              />
              <div className="flex-1">
                <h3 className="text-lg md:text-xl font-medium font-montserrat transition-all duration-200 group-hover:text-xl md:group-hover:text-2xl">
                  {task.title}
                </h3>
                <p className="mt-1 text-sm md:text-base font-montserrat text-muted-foreground transition-all duration-200 group-hover:text-base md:group-hover:text-lg">
                  {task.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-2xl text-lg">
            Start Tasks
          </Button>
        </div>
      </motion.div>

      {/* Quick Tips */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
        className="hover-bubble border-2 border-secondary p-6 md:p-8"
      >
        <h3 className="text-xl md:text-2xl font-bold font-montserrat text-white">
          Quick Tips
        </h3>
        <ul className="mt-4 text-base md:text-lg font-montserrat text-white space-y-2">
          <li>• Start your day with clarity.</li>
          <li>• Break goals into smaller steps.</li>
          <li>• Review wins weekly.</li>
        </ul>
      </motion.div>
    </PageLayout>
  );
}
