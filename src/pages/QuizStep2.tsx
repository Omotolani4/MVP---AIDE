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

export default function QuizStep2() {
  const navigate = useNavigate();
  const scale = useOnboardingAutoScale();

  const [aideStage, setAideStage] = useState("");
  const [improvement, setImprovement] = useState("");
  const [showSupportModal, setShowSupportModal] = useState(false);

  const handleSubmit = () => {
    if (!aideStage || !improvement.trim()) {
      toast.error("Please answer all questions");
      return;
    }
    navigate("/submission");
  };

  return (
    <div className="flex h-screen overflow-hidden font-['Poppins']">
      <div className="hidden md:flex flex-col justify-between bg-white w-[300px] p-8 rounded-r-[40px] shadow-xl">
        <img src={aideLogo} className="h-16 mx-auto" />
        <div
          onClick={() => setShowSupportModal(true)}
          className="flex items-center gap-3 cursor-pointer justify-center"
        >
          <img src={supportWoman} className="w-10 h-10 rounded-full" />
          <span>Support</span>
        </div>
      </div>

      <SupportModal open={showSupportModal} onOpenChange={setShowSupportModal} />

      <motion.div className="flex-1 bg-primary flex justify-center items-center p-6">
        <div
          style={{ transform: `scale(${scale})` }}
          className="origin-center transition-transform duration-300 w-full max-w-[900px]"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/settings")}
            className="absolute top-6 right-6 text-white"
          >
            <Settings />
          </Button>

          <div className="bg-white p-8 rounded-3xl shadow-lg mb-6">
            <h1 className="text-3xl font-bold text-center">
              AIDE Onboarding Quiz
            </h1>
            <p className="text-center text-muted-foreground">
              Step <span className="font-bold text-primary">2</span> of 2
            </p>
          </div>

          <div className="bg-white p-8 shadow-lg flex flex-col gap-6">
            {[
              "Awareness",
              "Intention",
              "Decisiveness",
              "Execution",
            ].map((stage) => (
              <Button
                key={stage}
                onClick={() => setAideStage(stage)}
                className={cn(
                  "border border-[#ff000033]",
                  aideStage === stage
                    ? "bg-secondary"
                    : "bg-white hover:bg-[#F3C17E]"
                )}
              >
                {stage}
              </Button>
            ))}

            <Textarea
              value={improvement}
              onChange={(e) => setImprovement(e.target.value)}
              placeholder="Write here..."
            />

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
      </motion.div>
    </div>
  );
}
