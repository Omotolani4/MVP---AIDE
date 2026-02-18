import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Settings } from "lucide-react";
import aideLogo from "@/assets/aide-logo.png";
import { motion } from "framer-motion";
import supportWoman from "@/assets/support-woman.jpg";
import { SupportModal } from "@/components/SupportModal";
import { useOnboardingAutoScale } from "@/hooks/useOnboardingAutoScale";

export default function Quiz() {
  const navigate = useNavigate();
  const scale = useOnboardingAutoScale();

  const [question1, setQuestion1] = useState("");
  const [question2, setQuestion2] = useState("");
  const [question3, setQuestion3] = useState("");
  const [showSupportModal, setShowSupportModal] = useState(false);

  const handleSubmit = () => {
    if (!question1 || !question2 || !question3.trim()) {
      toast.error("Please answer all questions");
      return;
    }

    localStorage.setItem(
      "quizStep1",
      JSON.stringify({ question1, question2, question3 })
    );

    navigate("/quiz-step-2");
  };

  return (
    <div className="flex h-screen font-['Poppins'] overflow-hidden">
      {/* SIDEBAR */}
      <div className="hidden md:flex flex-col justify-between bg-white w-[240px] rounded-r-[40px] p-6 shadow-lg">
        <div className="flex flex-col items-center text-center">
          <img src={aideLogo} alt="AIDE Logo" className="h-14 mb-3" />
          <p className="text-[13px] text-gray-800 font-semibold leading-tight">
            Where mindset mastery <br /> meets business growth
          </p>
        </div>

        <div
          className="flex items-center gap-3 justify-center cursor-pointer hover:opacity-80"
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

      {/* MAIN */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex-1 bg-primary relative flex justify-center items-center p-6"
      >
        <div
          style={{ transform: `scale(${scale})` }}
          className="w-full h-full origin-center transition-transform duration-300 flex justify-center items-center"
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-6 right-6 w-14 h-14 text-white"
            onClick={() => navigate("/settings")}
          >
            <Settings className="w-8 h-8" />
          </Button>

          <div className="w-full max-w-[850px] flex flex-col gap-6">
            <div className="bg-white p-7 rounded-3xl shadow-lg">
              <h1 className="text-3xl font-bold text-center">
                AIDE Onboarding Quiz
              </h1>
              <p className="text-center text-muted-foreground">
                Answer a few quick questions so we can personalize your roadmap.
              </p>
              <p className="text-center text-sm text-gray-500 mt-2">
                Step <span className="text-primary font-bold">1</span> of 2
              </p>
            </div>

            <div className="bg-white p-7 shadow-lg flex flex-col gap-6">
              <div>
                <h3 className="font-semibold mb-3">
                  1. What stage best describes your business?
                </h3>
                <div className="flex gap-4 flex-wrap">
                  {["Ideal Stage", "Early Growth", "Scaling"].map((opt) => (
                    <Button
                      key={opt}
                      onClick={() => setQuestion1(opt)}
                      className={cn(
                        "border border-[#ff000033]",
                        question1 === opt
                          ? "bg-secondary"
                          : "bg-white hover:bg-[#F3C17E]"
                      )}
                    >
                      {opt}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">
                  2. What's your biggest challenge right now?
                </h3>
                <div className="flex gap-4 flex-wrap">
                  {["Focus", "Execution", "Strategy", "Commitment"].map(
                    (opt) => (
                      <Button
                        key={opt}
                        onClick={() => setQuestion2(opt)}
                        className={cn(
                          "border border-[#ff000033]",
                          question2 === opt
                            ? "bg-secondary"
                            : "bg-white hover:bg-[#F3C17E]"
                        )}
                      >
                        {opt}
                      </Button>
                    )
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">
                  3. What's your main goal for the next 90 days?
                </h3>
                <Textarea
                  value={question3}
                  onChange={(e) => setQuestion3(e.target.value)}
                  className="border-b border-[#ff000033] rounded-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSubmit}
                  className="text-primary font-bold"
                >
                  NEXT &gt;&gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
