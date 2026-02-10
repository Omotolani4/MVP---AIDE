import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";

export default function Settings() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Profile state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [notification, setNotification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Load user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/auth");
          return;
        }

        setEmail(user.email || "");

        // Fetch profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", user.id)
          .single();

        if (profile) {
          setFirstName(profile.first_name || "");
          setLastName(profile.last_name || "");
        }

        // Load notification preference
        const savedNotification = localStorage.getItem("notificationPreference") === "true";
        setNotification(savedNotification);
      } catch (err) {
        console.error("Error loading user data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);

  const handleSaveProfile = async () => {
    setSaveLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Update profile
      const { error } = await supabase
        .from("profiles")
        .update({ first_name: firstName, last_name: lastName })
        .eq("id", user.id);

      if (error) throw error;

      toast({ title: "Profile updated successfully!" });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to update profile";
      toast({
        title: "Update failed",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleNotificationToggle = (checked: boolean) => {
    setNotification(checked);
    localStorage.setItem("notificationPreference", checked.toString());
    
    if (checked && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
    
    toast({
      title: checked ? "Notifications enabled" : "Notifications disabled",
      description: checked ? "You'll receive browser notifications" : "You won't receive browser notifications",
    });
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({ title: "Logged out successfully" });
      navigate("/auth");
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to logout";
      toast({
        title: "Logout failed",
        description: errorMsg,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-primary relative">
        <Sidebar showTasksAndResources />
        <TopBar />
        <main className="flex-1 md:ml-64 pt-28 px-8 md:px-12">
          <p className="text-white">Loading...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-primary relative">
      <Sidebar showTasksAndResources />
      <TopBar />

      {/* MAIN CONTENT */}
      <main className="flex-1 md:ml-64 pt-28 px-8 md:px-12">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl p-8 md:p-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
              Account Settings
            </h1>
            <p className="text-xl text-black/70">
              Manage your profile, preferences, and account information.
            </p>
          </motion.div>

          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-3xl p-8 md:p-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
              Profile Information
            </h2>

            <div className="space-y-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  First Name
                </label>
                <Input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="h-12 text-lg"
                  placeholder="Enter first name"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Last Name
                </label>
                <Input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="h-12 text-lg"
                  placeholder="Enter last name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  disabled
                  className="h-12 text-lg bg-gray-100 cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Email cannot be changed from here
                </p>
              </div>

              {/* Save Button */}
              <Button
                onClick={handleSaveProfile}
                disabled={saveLoading}
                className="bg-primary text-white hover:bg-primary/90 h-12 px-8 font-bold rounded-full text-lg"
              >
                {saveLoading ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </motion.div>

          {/* Notification Preferences */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-3xl p-8 md:p-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
              Notification Preferences
            </h2>

            <div className="space-y-6">
              {/* Browser Notifications Toggle */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div>
                  <h3 className="font-semibold text-foreground text-lg">
                    Browser Notifications
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Receive notifications in your browser when you complete tasks or assessments
                  </p>
                </div>
                <Switch
                  checked={notification}
                  onCheckedChange={handleNotificationToggle}
                  className="ml-4"
                />
              </div>
            </div>
          </motion.div>

          {/* Danger Zone - Logout */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-3xl p-8 md:p-12 border-2 border-red-200"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-red-600">
              Danger Zone
            </h2>
            <p className="text-foreground mb-6">
              Once you logout, you'll need to sign in again to access your account.
            </p>

            <Button
              onClick={handleLogout}
              variant="destructive"
              className="h-12 px-8 font-bold rounded-full text-lg"
            >
              Logout
            </Button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
