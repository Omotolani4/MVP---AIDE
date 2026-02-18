import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Settings } from "lucide-react";
import aideLogo from "@/assets/aide-logo.png";
import { motion } from "framer-motion";
import { SupportModal } from "@/components/SupportModal";
import supportWoman from "@/assets/support-woman.jpg";

export default function QuizStep2() {
  const navigate = useNavigate();

  const [aideStage, setAideStage] = useState("");
  const [improvement, setImprovement] = useState("");
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [scale, setScale] = useState(1);

  // 🔹 Auto-scale based on viewport height
  useEffect(() => {
    const calculateScale = () => {
      const h = window.innerHeight;

      if (h < 720) return setScale(0.88);
      if (h < 800) return setScale(0.92);
      if (h < 900) return setScale(0.96);

      setScale(1);
    };

    calculateScale();
    window.addEventListener("resize", calculateScale);
    return () => window.removeEventListener("resize", calculateScale);
  }, []);

  const handleSubmit = () => {
    if (!aideStage || !improvement.trim()) {
      toast.error("Please answer all questions");
      return;
    }
    navigate("/quiz");
  };

  return (
    <div className="flex h-screen font-['Poppins'] overflow-hidden">
      {/* ONBOARDING SIDEBAR */}
      <div className="hidden md:flex flex-col justify-between bg-white w-[300px] p-8 rounded-r-[40px] shadow-xl">
        {/* LOGO */}
        <div
          className="flex flex-col items-center text-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={aideLogo} alt="AIDE Logo" className="h-16 mb-4" />
          <p className="text-[12px] text-gray-700 font-medium leading-tight">
            Where mindset mastery <br /> meets business growth
          </p>
        </div>

        {/* SUPPORT */}
        <div
          className="flex items-center gap-3 justify-center cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => setShowSupportModal(true)}
        >
          <img
            src={supportWoman}
            alt="Support"
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="text-sm font-semibold text-gray-800">
            Support
          </span>
        </div>
      </div>

      <SupportModal
        open={showSupportModal}
        onOpenChange={setShowSupportModal}
      />

      {/* MAIN AREA */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ transform: `scale(${scale})` }}
        className="flex-1 bg-primary relative flex justify-center items-center p-6 origin-center transition-transform duration-300"
      >
        {/* SETTINGS */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/settings")}
          className="absolute top-6 right-6 w-14 h-14 text-white hover:text-white/80"
        >
          <Settings className="w-8 h-8" strokeWidth={2.2} />
        </Button>

        {/* CONTENT */}
        <div className="w-full max-w-[900px] flex flex-col gap-6">
          {/* TITLE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-3xl shadow-lg w-full"
          >
            <h1 className="text-3xl font-bold text-center mb-2">
              AIDE Onboarding Quiz
            </h1>
            <p className="text-base text-muted-foreground text-center">
              Answer the question so we can personalize your roadmap.
            </p>

            <p className="text-center text-sm text-gray-500 mt-2 font-medium">
              Step <span className="text-primary font-bold">2</span> of 2
            </p>
          </motion.div>

          {/* QUESTIONS */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="bg-white p-8 shadow-lg w-full flex flex-col justify-between"
          >
            <div className="flex flex-col gap-8">
              {/* Q1 */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Which of the AIDE stages do you feel you need to strengthen most?
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      id: "Awareness",
                      label:
                        "Awareness — I need clarity on what's really holding me back",
                    },
                    {
                      id: "Intention",
                      label: "Intention — I need stronger goals and focus",
                    },
                    {
                      id: "Decisiveness",
                      label:
                        "Decisiveness — I need to stop hesitating and make moves",
                    },
                    {
                      id: "Execution",
                      label:
                        "Execution — I need consistency and follow-through",
                    },
                  ].map((stage) => (
                    <Button
                      key={stage.id}
                      onClick={() => setAideStage(stage.id)}
                      className={cn(
                        "h-auto px-6 py-4 text-sm rounded-[2px] border border-[#ff000033] whitespace-normal leading-snug",
                        aideStage === stage.id
                          ? "bg-secondary text-foreground"
                          : "bg-white text-foreground hover:bg-[#F3C17E]"
                      )}
                    >
                      {stage.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Q2 */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  What’s one thing you’d like to improve in your business or life right now?
                </h3>

                <Textarea
                  value={improvement}
                  onChange={(e) => setImprovement(e.target.value)}
                  placeholder="Write here..."
                  className="w-full px-1 bg-transparent border-0 border-b-[1.5px] border-[#ff000033] focus-visible:ring-0 rounded-none resize-none"
                />
              </div>
            </div>

            {/* NEXT */}
            <div className="flex justify-end pt-5">
              <button
                onClick={handleSubmit}
                className="text-primary text-lg font-bold hover:underline transition-all hover:scale-[1.03]"
              >
                NEXT &gt;&gt;
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
