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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return navigate("/auth");

      const { data } = await supabase
        .from("profiles")
        .select("first_name")
        .eq("id", user.id)
        .single();

      if (data?.first_name) setFirstName(data.first_name);
    };

    fetchProfile();
  }, [navigate]);

  // Compute progress for dashboard
  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === id && !task.completed) {
          toast.success(`Task completed: ${task.title}`);
        }

        return task.id === id
          ? { ...task, completed: !task.completed }
          : task;
      })
    );
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
              className="flex items-start gap-4"
            >
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => toggleTask(task.id)}
                className="mt-1 h-6 w-6 border-2 border-foreground"
              />
              <div className="flex-1">
                <h3 className="text-lg md:text-xl font-medium font-montserrat">
                  {task.title}
                </h3>
                <p className="mt-1 text-sm md:text-base font-montserrat text-muted-foreground">
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
