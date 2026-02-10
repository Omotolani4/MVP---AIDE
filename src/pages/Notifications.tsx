import { PageLayout } from "@/components/PageLayout";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  message: string;
  timestamp: number;
  type: "task" | "quiz" | "resource" | "system";
  read: boolean;
}

export default function Notifications() {
  const [firstName, setFirstName] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("first_name")
        .eq("id", user.id)
        .single();

      if (profile?.first_name) {
        setFirstName(profile.first_name);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Load notifications from localStorage
  useEffect(() => {
    const loadNotifications = () => {
      const stored = JSON.parse(localStorage.getItem("notifications") || "[]");
      setNotifications(stored as Notification[]);
      
      // Mark all as read
      const updated = stored.map((n: Notification) => ({ ...n, read: true }));
      localStorage.setItem("notifications", JSON.stringify(updated));
    };

    loadNotifications();

    // Listen for storage changes
    const handleStorageChange = () => {
      loadNotifications();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const deleteNotification = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    localStorage.setItem("notifications", JSON.stringify(updated));
  };

  const clearAll = () => {
    setNotifications([]);
    localStorage.setItem("notifications", JSON.stringify([]));
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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "task":
        return "✓";
      case "quiz":
        return "📝";
      case "resource":
        return "📚";
      default:
        return "🔔";
    }
  };

  return (
    <PageLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white rounded-2xl py-5 px-6 md:px-8 hover-bubble shadow-lg"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-1">
          Notifications
        </h1>
        <p className="text-sm md:text-base text-foreground">
          Stay updated with all your activities and achievements.
        </p>
      </motion.div>

      {/* Notifications List */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
        className="bg-white rounded-2xl py-5 px-6 md:px-8 hover-bubble shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg md:text-xl font-bold text-foreground">
            All Notifications {notifications.length > 0 && `(${notifications.length})`}
          </h2>
          {notifications.length > 0 && (
            <Button
              onClick={clearAll}
              variant="outline"
              size="sm"
              className="text-destructive hover:bg-destructive/10"
            >
              Clear All
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <div className="text-2xl flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm md:text-base font-medium text-foreground">
                    {notification.message}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">
                    {formatTime(notification.timestamp)}
                  </p>
                </div>
                <button
                  onClick={() => deleteNotification(notification.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-destructive hover:bg-destructive/10 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-2">
                🔔 No notifications yet
              </p>
              <p className="text-sm text-muted-foreground">
                Your notifications will appear here as you complete tasks and assessments.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </PageLayout>
  );
}
