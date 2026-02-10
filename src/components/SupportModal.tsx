import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageCircle, Mail, Send, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { openTidioChat } from "./TidioWidget";

interface SupportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SupportModal = ({ open, onOpenChange }: SupportModalProps) => {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.functions.invoke("send-support-email", {
        body: formData,
      });

      if (error) throw error;

      toast.success("Support request sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setShowEmailForm(false);
      onOpenChange(false);
    } catch (error) {
      console.error("Error sending support email:", error);
      toast.error("Failed to send support request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChat = async () => {
    onOpenChange(false);
    await openTidioChat();
  };

  const handleBack = () => {
    setShowEmailForm(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[425px]"
        style={{
          backgroundColor: "#fff",
          borderRadius: "16px",
          padding: "24px",
        }}
      >
        <DialogHeader>
          <DialogTitle
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: "24px",
              fontWeight: 600,
              color: "#000",
              textAlign: "center",
            }}
          >
            {showEmailForm ? "Send Support Request" : "How can we help?"}
          </DialogTitle>
        </DialogHeader>

        {!showEmailForm ? (
          <div className="flex flex-col gap-4 mt-4">
            <Button
              onClick={() => setShowEmailForm(true)}
              className="flex items-center justify-center gap-3 h-14"
              style={{
                backgroundColor: "#DF1516",
                color: "#fff",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: 500,
              }}
            >
              <Mail className="w-5 h-5" />
              Send Email Request
            </Button>

            <Button
              onClick={handleOpenChat}
              variant="outline"
              className="flex items-center justify-center gap-3 h-14"
              style={{
                borderColor: "#DF1516",
                color: "#DF1516",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: 500,
                borderWidth: "2px",
              }}
            >
              <MessageCircle className="w-5 h-5" />
              Chat with AI Assistant
            </Button>
          </div>
        ) : (
          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name" style={{ color: "#333", fontWeight: 500 }}>
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
                style={{ borderRadius: "8px" }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" style={{ color: "#333", fontWeight: 500 }}>
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                style={{ borderRadius: "8px" }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject" style={{ color: "#333", fontWeight: 500 }}>
                Subject
              </Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="What's this about?"
                style={{ borderRadius: "8px" }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" style={{ color: "#333", fontWeight: 500 }}>
                Message
              </Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Describe your issue..."
                rows={4}
                style={{ borderRadius: "8px", resize: "none" }}
              />
            </div>

            <div className="flex gap-3 mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="flex-1 h-12"
                style={{ borderRadius: "10px" }}
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 h-12 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: "#DF1516",
                  color: "#fff",
                  borderRadius: "10px",
                }}
              >
                {isLoading ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
