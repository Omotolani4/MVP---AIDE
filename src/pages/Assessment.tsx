import { PageLayout } from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

export default function Assessment() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate("/auth");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("first_name")
        .eq("id", user.id)
        .single();

      if (data?.first_name) setFirstName(data.first_name);
    };

    fetchProfile();

    // Check if user has already completed the quiz
    const quizCount = parseInt(localStorage.getItem("quizCompletions") || "0");
    if (quizCount > 0) {
      setQuizCompleted(true);
    }
  }, [navigate]);

  return (
    <PageLayout>
      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hover-bubble bg-white rounded-2xl shadow-lg p-6 md:p-8 text-center"
      >
        <h1 className="text-2xl md:text-4xl font-normal" style={{ fontFamily: "Arial" }}>
          Your Weekly AIDE Assessment, <span className="text-primary">{firstName || "Name"}!</span>
        </h1>
      </motion.div>

      {/* Main Assessment Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
        className="hover-bubble bg-white shadow-lg p-8 md:p-12 flex flex-col items-center text-center"
      >
        <h2 className="text-2xl md:text-4xl font-normal max-w-lg" style={{ fontFamily: "Arial" }}>
          Ready to take your AIDE Assessment?
        </h2>

        <p className="text-lg md:text-2xl font-montserrat mt-6 max-w-xl">
          This assessment takes less than 5 minutes and helps us personalize your growth experience.
        </p>

        {quizCompleted ? (
          <div className="mt-8 px-10 py-4 rounded-2xl bg-green-100 border-2 border-green-500">
            <p className="text-lg md:text-xl font-semibold text-green-700">
              ✓ Assessment Completed
            </p>
          </div>
        ) : (
          <Button
            onClick={() => navigate("/quiz-step2")}
            className="mt-8 bg-primary hover:bg-primary/90 focus:ring-2 focus:ring-offset-2 focus:ring-primary px-10 py-4 rounded-2xl text-lg md:text-xl"
          >
            Take Assessment
          </Button>
        )}
      </motion.div>

      {/* Quick Tips */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        className="hover-bubble border-2 border-secondary p-6 md:p-8"
      >
        <h3 className="text-xl md:text-2xl font-medium font-montserrat text-white">
          Quick Tips
        </h3>
        <ul className="mt-4 text-base md:text-lg font-light font-montserrat text-white space-y-2">
          <li>• Start your day with clarity.</li>
          <li>• Break goals into smaller steps.</li>
          <li>• Review wins weekly.</li>
        </ul>
      </motion.div>
    </PageLayout>
  );
}
