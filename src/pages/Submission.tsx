import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import LockedCanvas from "@/components/LockedCanvas";
import { useNavigate } from "react-router-dom";
import aideLogo from "@/assets/aide-logo.png";
import supportWoman from "@/assets/support-woman.jpg";
import { SupportModal } from "@/components/SupportModal";
import { motion } from "framer-motion";

export default function Submission() {
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [scale, setScale] = useState(1);
  const navigate = useNavigate();

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

  const handleStartJourney = () => {
    const quizCompletions = parseInt(
      localStorage.getItem("quizCompletions") || "0"
    );
    localStorage.setItem(
      "quizCompletions",
      (quizCompletions + 1).toString()
    );

    const activities = JSON.parse(localStorage.getItem("activities") || "[]");
    activities.push({
      id: `quiz-${Date.now()}`,
      type: "quiz",
      title: "Assessment Module",
      timestamp: Date.now(),
    });
    localStorage.setItem("activities", JSON.stringify(activities));

    const notifications = JSON.parse(
      localStorage.getItem("notifications") || "[]"
    );
    notifications.push({
      id: `notif-quiz-${Date.now()}`,
      message: "📝 Completed assessment module",
      timestamp: Date.now(),
      type: "quiz",
      read: false,
    });
    localStorage.setItem(
      "notifications",
      JSON.stringify(notifications)
    );

    navigate("/dashboard");
  };

  return (
    <LockedCanvas>
      {/* AUTO-SCALE WRAPPER */}
      <div
        style={{ transform: `scale(${scale})` }}
        className="w-full h-full origin-center transition-transform duration-300"
      >
        {/* LOGO */}
        <img
          src={aideLogo}
          alt="AIDE Logo"
          className="absolute top-[19px] left-[26px] w-[167px] h-[132px]"
        />

        {/* MAIN CENTER */}
        <div className="flex items-center justify-center h-full w-full">
          <div
            className="
              relative
              w-[80%]
              max-w-[1200px]
              min-h-[70vh]
              bg-white
              rounded-[17px]
              shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25),_0px_4px_4px_rgba(0,0,0,0.25)]
              flex
              flex-col
              items-center
              justify-center
              gap-16
              py-16
            "
          >
            {/* COMPLETED CARD */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="
                w-[90%]
                bg-[#F3C17E]
                shadow-md
                flex
                flex-col
                items-center
                justify-center
                gap-6
                py-14
              "
            >
              <h1 className="text-[3.2rem] font-normal text-center leading-none">
                🎉 Quiz Completed!
              </h1>

              <p className="text-[1.4rem] font-medium text-center">
                Thank you for completing the assessment
              </p>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="w-[65%] max-w-[650px]"
            >
              <Button
                onClick={handleStartJourney}
                className="
                  w-full
                  h-[104px]
                  rounded-[17px]
                  bg-[#DF1516]
                  hover:bg-[#c01314]
                  text-[1.4rem]
                  font-medium
                "
              >
                Start Your Journey
              </Button>
            </motion.div>
          </div>
        </div>

        {/* SUPPORT */}
        <div
          onClick={() => setShowSupportModal(true)}
          className="
            absolute
            left-[26px]
            bottom-[37px]
            flex
            items-center
            gap-3
            cursor-pointer
            hover:opacity-80
            transition-opacity
          "
        >
          <img
            src={supportWoman}
            alt="Support"
            className="w-[46px] h-[52px] rounded-full object-cover"
          />
          <span className="text-[1.4rem] font-normal">
            Support
          </span>
        </div>

        <SupportModal
          open={showSupportModal}
          onOpenChange={setShowSupportModal}
        />
      </div>
    </LockedCanvas>
  );
}
