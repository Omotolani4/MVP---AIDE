import { PageLayout } from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const RESOURCES = {
  mindset: "/pdfs/mindset-reset-guide.pdf",
  growth: "/pdfs/business-growth-blueprint.pdf",
  execution: "/pdfs/execution-masterclass.pdf",
  leadership: "/pdfs/leadership-influence-playbook.pdf",
};

interface ResourceCardProps {
  title: string;
  description: string;
  file: string;
  variant: "primary" | "secondary";
  delay: number;
}

function ResourceCard({ title, description, file, variant, delay }: ResourceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className={`hover-bubble shadow-lg p-6 flex flex-col justify-between min-h-[180px] ${
        variant === "primary" ? "bg-secondary" : "bg-white"
      }`}
    >
      <div>
        <h3 className="text-lg md:text-xl font-medium font-montserrat">{title}</h3>
        <p className="mt-3 text-sm md:text-base font-montserrat">{description}</p>
      </div>
      <a href={file} download className="mt-4">
        <Button className="bg-primary hover:bg-primary/90 text-white w-full md:w-auto px-6 py-2 rounded-2xl">
          Access Now
        </Button>
      </a>
    </motion.div>
  );
}

export default function Resources() {
  const [firstName, setFirstName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate("/auth");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("first_name")
        .eq("id", user.id)
        .single();

      if (data?.first_name) {
        setFirstName(data.first_name);
      }
    };

    fetchProfile();
  }, [navigate]);

  return (
    <PageLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="hover-bubble bg-white rounded-2xl shadow-lg p-6 md:p-8"
      >
        <h1 className="text-2xl md:text-4xl font-normal" style={{ fontFamily: "Arial" }}>
          Here's Your Resource Library, <span className="text-primary">{firstName || "Name"}!</span>
        </h1>
        <p className="mt-3 text-base md:text-lg font-montserrat">
          Access your personalized materials to enhance your AIDE journey.
        </p>
      </motion.div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <ResourceCard
          title="Mindset Reset Guide"
          description="Download or explore to apply AIDE principles effectively."
          file={RESOURCES.mindset}
          variant="primary"
          delay={0.15}
        />
        <ResourceCard
          title="Business Growth Blueprint"
          description="Download or explore to apply AIDE principles effectively."
          file={RESOURCES.growth}
          variant="secondary"
          delay={0.25}
        />
        <ResourceCard
          title="Execution Masterclass"
          description="Download or explore to apply AIDE principles effectively."
          file={RESOURCES.execution}
          variant="secondary"
          delay={0.35}
        />
        <ResourceCard
          title="Leadership & Influence Playbook"
          description="Develop leadership skills that help you inspire and influence people effectively."
          file={RESOURCES.leadership}
          variant="primary"
          delay={0.45}
        />
      </div>

      {/* Quick Tips */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.55, ease: "easeOut" }}
        className="hover-bubble border-2 border-secondary p-6 md:p-8"
      >
        <h3 className="text-xl md:text-2xl font-bold font-montserrat text-white">
          Quick Tips
        </h3>
        <ul className="mt-4 text-base md:text-lg font-montserrat text-white space-y-2">
          <li>• Start your day with clarity.</li>
          <li>• Break goals into smaller steps.</li>
          <li>• Review wins weekly.</li>
        </ul>
      </motion.div>
    </PageLayout>
  );
}
