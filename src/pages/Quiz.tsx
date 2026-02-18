import { useEffect, useState } from "react";
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

export default function Quiz() {
  const navigate = useNavigate();

  const [question1, setQuestion1] = useState("");
  const [question2, setQuestion2] = useState("");
  const [question3, setQuestion3] = useState("");
  const [showSupportModal, setShowSupportModal] = useState(false);

  const [scale, setScale] = useState(1);

  // 🔹 Auto scale based on screen height
  useEffect(() => {
    const calculateScale = () => {
      const height = window.innerHeight;

      if (height < 720) return setScale(0.88);
      if (height < 800) return setScale(0.92);
      if (height < 900) return setScale(0.96);

      setScale(1);
    };

    calculateScale();
    window.addEventListener("resize", calculateScale);

    return () => window.removeEventListener("resize", calculateScale);
  }, []);

  const handleSubmit = () => {
    if (!question1 || !question2 || !question3.trim()) {
      toast.error("Please answer all questions");
      return;
    }

    localStorage.setItem(
      "quizStep1",
      JSON.stringify({ question1, question2, question3 })
    );

    navigate("/submission");
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

      {/* MAIN SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{ transform: `scale(${scale})` }}
        className="flex-1 bg-primary relative flex flex-col justify-center items-center p-6 origin-center transition-transform duration-300"
      >
        {/* SETTINGS */}
        <div className="absolute top-6 right-6 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="w-14 h-14 text-white hover:text-white/80"
            onClick={() => navigate("/settings")}
          >
            <Settings className="w-8 h-8" strokeWidth={2.2} />
          </Button>
        </div>

        {/* CONTENT */}
        <div className="flex flex-col justify-between items-center w-full max-w-[850px] gap-5">
          {/* TITLE */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="bg-white rounded-3xl p-7 w-full shadow-[0_4px_25px_rgba(0,0,0,0.1)]"
          >
            <h1 className="text-3xl font-bold text-center mb-2">
              AIDE Onboarding Quiz
            </h1>
            <p className="text-base text-muted-foreground text-center">
              Answer a few quick questions so we can personalize your roadmap.
            </p>
            <p className="text-center text-sm text-gray-500 mt-2 font-medium">
              Step <span className="text-primary font-bold">1</span> of 2
            </p>
          </motion.div>

          {/* QUESTIONS */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="bg-white p-7 w-full shadow-[0_4px_25px_rgba(0,0,0,0.1)] flex flex-col justify-between"
          >
            <div className="grid gap-6">
              {/* Q1 */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  1. What stage best describes your business?
                </h3>
                <div className="flex flex-wrap gap-4">
                  {["Ideal Stage", "Early Growth", "Scaling"].map((option) => (
                    <Button
                      key={option}
                      onClick={() => setQuestion1(option)}
                      className={cn(
                        "h-11 px-6 rounded-none border-[1.5px] border-[#ff000033]",
                        question1 === option
                          ? "bg-secondary"
                          : "bg-white hover:bg-[#F3C17E]"
                      )}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Q2 */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  2. What's your biggest challenge right now?
                </h3>
                <div className="flex flex-wrap gap-4">
                  {["Focus", "Execution", "Strategy", "Commitment"].map(
                    (option) => (
                      <Button
                        key={option}
                        onClick={() => setQuestion2(option)}
                        className={cn(
                          "h-11 px-6 border-[1.5px] border-[#ff000033]",
                          question2 === option
                            ? "bg-secondary"
                            : "bg-white hover:bg-[#F3C17E]"
                        )}
                      >
                        {option}
                      </Button>
                    )
                  )}
                </div>
              </div>

              {/* Q3 */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  3. What's your main goal for the next 90 days?
                </h3>
                <Textarea
                  value={question3}
                  onChange={(e) => setQuestion3(e.target.value)}
                  placeholder="Write here..."
                  className="w-full px-1 bg-transparent border-0 border-b-[1.5px] border-[#ff000033] focus-visible:ring-0 rounded-none resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end mt-4">
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
