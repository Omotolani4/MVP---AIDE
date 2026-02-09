import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
}

export function TopBar() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const navigate = useNavigate();

  /* ---------------- FETCH NOTIFICATIONS ---------------- */
  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setNotifications(data || []);
    };

    load();

    // Realtime updates
    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", table: "notifications" },
        payload => {
          setNotifications(prev => [payload.new as Notification, ...prev]);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative">
        <Bell className="w-7 h-7" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="absolute right-0 mt-4 w-80 bg-white shadow-xl rounded-xl overflow-hidden z-50"
          >
            <div className="p-4 font-bold border-b">Notifications</div>

            {notifications.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">
                No notifications yet
              </p>
            ) : (
              notifications.slice(0, 5).map(n => (
                <div
                  key={n.id}
                  className="p-4 hover:bg-gray-100 cursor-pointer"
                  onClick={() => navigate("/notifications")}
                >
                  <p className="font-semibold">{n.title}</p>
                  <p className="text-sm text-muted-foreground">{n.message}</p>
                </div>
              ))
            )}

            <button
              className="w-full p-3 text-primary text-sm hover:underline"
              onClick={() => navigate("/notifications")}
            >
              See all notifications
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
