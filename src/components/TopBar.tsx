import { Settings, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const TopBar = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const goToNotifications = () => {
    setShowNotifications(false);
    navigate("/notifications");
  };

  return (
    <div
      ref={dropdownRef}
      className="
        fixed
        top-4 md:top-[41px]
        right-4 md:right-[30px]
        z-[999]
        flex
        items-center
        gap-3 md:gap-[20px]
        pointer-events-auto
      "
    >
      {/* SETTINGS */}
      <button
        onClick={() => navigate("/settings")}
        className="w-[42.6px] h-[41px] flex items-center justify-center"
      >
        <Settings
          style={{ width: "42.6px", height: "41px" }}
          strokeWidth={2.4}
          className="text-white"
        />
      </button>

      {/* BELL */}
      <button
        onClick={() => setShowNotifications((prev) => !prev)}
        className="relative w-[44px] h-[44px] flex items-center justify-center"
      >
        <Bell
          style={{ width: "44px", height: "44px" }}
          strokeWidth={2.4}
          className="text-white"
        />

        {/* BADGE */}
        <span
          className="
            absolute
            top-[1px]
            right-[1px]
            w-[30px]
            h-[25px]
            bg-[#DF1516]
            border
            border-[#F3C17E]
            rounded-full
            flex
            items-center
            justify-center
            text-white
            text-[16px]
            font-extrabold
            leading-none
          "
        >
          3
        </span>
      </button>

      {/* 🔔 SLIDE-DOWN NOTIFICATION DROPDOWN */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{
              duration: 0.28,
              ease: [0.22, 1, 0.36, 1], // natural slide ease
            }}
            className="
              absolute
              top-[60px]
              right-0
              w-[320px]
              bg-white
              rounded-[20px]
              shadow-2xl
              border
              z-[1000]
              overflow-hidden
            "
          >
            <div className="px-5 py-4 border-b font-bold text-lg">
              Notifications
            </div>

            <ul className="max-h-[280px] overflow-y-auto">
              <li className="px-5 py-4 hover:bg-gray-50 cursor-pointer">
                🔔 New assessment is available
              </li>
              <li className="px-5 py-4 hover:bg-gray-50 cursor-pointer">
                ✅ Profile updated successfully
              </li>
              <li className="px-5 py-4 hover:bg-gray-50 cursor-pointer">
                📚 New resource added to library
              </li>
            </ul>

            <div className="px-5 py-3 border-t text-center">
              <button
                onClick={goToNotifications}
                className="text-primary font-semibold hover:underline"
              >
                View all notifications
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
