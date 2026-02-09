import { PageLayout } from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [firstName, setFirstName] = useState("");
  const [successTask, setSuccessTask] = useState<string | null>(null);
  const navigate = useNavigate();

  /* ---------------- USER PROFILE & TASKS LOADING ---------------- */
  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return navigate("/auth");

      const { data: profile } = await supabase
        .from("profiles")
        .select("first_name")
        .eq("id", user.id)
        .single();

      if (profile?.first_name) setFirstName(profile.first_name);

      // Load tasks state from database
      const { data: savedTasks } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id);

      if (savedTasks?.length) {
        setTasks(prev =>
          prev.map(t => {
            const dbTask = savedTasks.find(d => d.id === t.id);
            if (dbTask && dbTask.completed && !prev.find(p => p.id === t.id)?.completed) {
              // If task was just completed, show success animation
              setSuccessTask(t.id);
              setTimeout(() => setSuccessTask(null), 1600);
            }
            return dbTask ? { ...t, completed: dbTask.completed } : t;
          })
        );
      }
    };

    load();
  }, [navigate]);

  /* ---------------- COMPLETE TASK ---------------- */
  const completeTask = async (task: Task) => {
    if (task.completed) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Save task state
    await supabase.from("tasks").upsert({
      id: task.id,
      user_id: user.id,
      title: task.title,
      completed: true,
      completed_at: new Date().toISOString(),
    });

    // Create notification
    await supabase.from("notifications").insert({
      user_id: user.id,
      title: "Task Completed 🎉",
      message: `You completed: ${task.title}`,
      type: "task",
      read: false,
    });

    setTasks(prev =>
      prev.map(t => (t.id === task.id ? { ...t, completed: true } : t))
    );

    setSuccessTask(task.id);
    toast.success("Task completed!");
    setTimeout(() => setSuccessTask(null), 1600);
  };

  /* ---------------- TASK CLICK ACTIONS ---------------- */
  const handleTaskClick = async (task: Task) => {
    if (task.id === "1") {
      navigate("/resources");
      return;
    }

    // Placeholder for Google Tasks integration
    window.open("https://tasks.google.com", "_blank");

    // For now: manual confirmation
    setTimeout(() => completeTask(task), 800);
  };

  /* ---------------- START TASKS BUTTON ---------------- */
  const startFirstTask = () => {
    handleTaskClick(tasks[0]);
  };

  return (
    <PageLayout>
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
      >
        <h1 className="text-3xl md:text-4xl font-normal">
          Complete Your AIDE Tasks,{" "}
          <span className="text-primary">{firstName || "Friend"}!</span>
        </h1>
        <p className="mt-3 text-lg">
          Each step brings you closer to clarity, confidence, and execution.
        </p>
      </motion.div>

      {/* TASKS */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-lg p-6 md:p-8"
      >
        <div className="space-y-6">
          {tasks.map(task => (
            <motion.div
              key={task.id}
              whileHover={{ scale: 1.01 }}
              className="flex items-start gap-4 cursor-pointer"
              onClick={() => handleTaskClick(task)}
            >
              <Checkbox checked={task.completed} className="mt-1 h-6 w-6" />
              <div className="flex-1">
                <h3 className={`text-xl ${task.completed && "line-through opacity-60"}`}>
                  {task.title}
                </h3>
                <p className={`text-muted-foreground ${task.completed && "line-through opacity-60"}`}>
                  {task.description}
                </p>
              </div>

              <AnimatePresence>
                {successTask === task.id && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="text-green-600 font-bold"
                  >
                    ✔
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            onClick={startFirstTask}
            className="bg-primary px-8 py-3 text-lg rounded-2xl"
          >
            Start Tasks
          </Button>
        </div>
      </motion.div>

      {/* QUICK TIPS */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-2 border-secondary p-6 md:p-8"
      >
        <h3 className="text-2xl font-bold text-white">Quick Tips</h3>
        <ul className="mt-4 text-lg text-white space-y-2">
          <li>• Start your day with clarity.</li>
          <li>• Break goals into smaller steps.</li>
          <li>• Review wins weekly.</li>
        </ul>
      </motion.div>
    </PageLayout>
  );
}
