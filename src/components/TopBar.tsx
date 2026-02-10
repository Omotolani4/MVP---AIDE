import { Settings, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
  id: string;
  message: string;
  timestamp: number;
  type: "task" | "quiz" | "resource" | "system";
  read: boolean;
}

export const TopBar = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load notifications from localStorage
  useEffect(() => {
    const loadNotifications = () => {
      const stored = JSON.parse(localStorage.getItem("notifications") || "[]");
      setNotifications(stored as Notification[]);
      const unread = stored.filter((n: Notification) => !n.read).length;
      setUnreadCount(unread);
    };

    loadNotifications();

    // Listen for storage changes to update in real-time
    const handleStorageChange = () => {
      loadNotifications();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

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

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    localStorage.setItem("notifications", JSON.stringify(updated));
    setNotifications(updated);
    setUnreadCount(0);
  };

  const goToNotifications = () => {
    markAllAsRead();
    setShowNotifications(false);
    navigate("/notifications");
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "just now";
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
        {unreadCount > 0 && (
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
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
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
              {notifications.length > 0 ? (
                notifications.slice(0, 5).map((notification) => (
                  <li
                    key={notification.id}
                    className={`px-5 py-3 hover:bg-gray-50 cursor-pointer border-b text-sm ${
                      !notification.read ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span>{notification.message}</span>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                      {formatTime(notification.timestamp)}
                    </span>
                  </li>
                ))
              ) : (
                <li className="px-5 py-4 text-center text-muted-foreground">
                  No notifications yet
                </li>
              )}
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
