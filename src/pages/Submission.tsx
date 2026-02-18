import { useState } from "react";
import { Button } from "@/components/ui/button";
import LockedCanvas from "@/components/LockedCanvas";
import { useNavigate } from "react-router-dom";
import aideLogo from "@/assets/aide-logo.png";
import supportWoman from "@/assets/support-woman.jpg";
import { SupportModal } from "@/components/SupportModal";
import { motion } from "framer-motion";
import { useOnboardingAutoScale } from "@/hooks/useOnboardingAutoScale";

export default function Submission() {
  const navigate = useNavigate();
  const scale = useOnboardingAutoScale();
  const [showSupportModal, setShowSupportModal] = useState(false);

  return (
    <LockedCanvas>
      <div
        style={{ transform: `scale(${scale})` }}
        className="w-full h-full origin-center transition-transform duration-300"
      >
        <img
          src={aideLogo}
          className="absolute top-[19px] left-[26px] w-[167px]"
        />

        <div className="flex items-center justify-center h-full">
          <div className="bg-white w-[80%] max-w-[1200px] rounded-[17px] p-16 flex flex-col gap-12 items-center shadow-lg">
            <motion.div className="bg-[#F3C17E] w-[90%] py-12 text-center">
              <h1 className="text-[3rem]">🎉 Quiz Completed!</h1>
              <p className="text-xl mt-2">
                Thank you for completing the assessment
              </p>
            </motion.div>

            <Button
              onClick={() => navigate("/dashboard")}
              className="h-[100px] w-[60%] bg-[#DF1516] text-xl"
            >
              Start Your Journey
            </Button>
          </div>
        </div>

        <div
          onClick={() => setShowSupportModal(true)}
          className="absolute left-[26px] bottom-[37px] flex gap-3 cursor-pointer"
        >
          <img src={supportWoman} className="w-[46px] h-[52px] rounded-full" />
          <span className="text-xl">Support</span>
        </div>

        <SupportModal
          open={showSupportModal}
          onOpenChange={setShowSupportModal}
        />
      </div>
    </LockedCanvas>
  );
}
