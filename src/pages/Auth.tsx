import { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
import aideLogo from "@/assets/aide-logo.png";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
  const [fullName, setFullName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const leftControls = useAnimation();
  const rightControls = useAnimation();

  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  /* ============================
     AUTH STATE (SINGLE SOURCE)
     ============================ */
  useEffect(() => {
    let mounted = true;

    const handleSession = async (session: any) => {
      if (!session?.user || !mounted) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("onboarding_complete")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      if (data.onboarding_complete) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/quiz-step2", { replace: true });
      }
    };

    supabase.auth.getSession().then(({ data }) => {
      handleSession(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  /* ============================
     AUTO SCALE
     ============================ */
  useEffect(() => {
    const resize = () => {
      const baseWidth = 1440;
      const baseHeight = 900;
      const scale =
        Math.min(
          window.innerWidth / baseWidth,
          window.innerHeight / baseHeight
        ) * 1.05;

      document.documentElement.style.setProperty(
        "--auth-scale",
        String(scale)
      );
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* ============================
     REMEMBER EMAIL
     ============================ */
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setSignInEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  /* ============================
     FADE IN ANIMATION
     ============================ */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (entry.target === leftRef.current)
            leftControls.start("visible");
          if (entry.target === rightRef.current)
            rightControls.start("visible");
        });
      },
      { threshold: 0.2 }
    );

    if (leftRef.current) observer.observe(leftRef.current);
    if (rightRef.current) observer.observe(rightRef.current);

    return () => observer.disconnect();
  }, [leftControls, rightControls]);

  /* ============================
     EMAIL SIGN UP
     ============================ */
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const [first_name, ...rest] = fullName.trim().split(" ");
      const last_name = rest.join(" ");

      const { error } = await supabase.auth.signUp({
        email: signUpEmail,
        password: signUpPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
          data: { first_name, last_name },
        },
      });

      if (error) throw error;

      toast({ title: "Account created successfully" });
    } catch (err: any) {
      toast({
        title: "Sign up failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ============================
     EMAIL SIGN IN
     ============================ */
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: signInEmail,
        password: signInPassword,
      });

      if (error) throw error;

      rememberMe
        ? localStorage.setItem("rememberedEmail", signInEmail)
        : localStorage.removeItem("rememberedEmail");

      toast({ title: "Welcome back!" });
    } catch (err: any) {
      toast({
        title: "Sign in failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ============================
     GOOGLE SIGN IN (SUPABASE)
     ============================ */
  const handleGoogle = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth`,
      },
    });

    if (error) {
      toast({
        title: "Google sign in failed",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 80 },
    visible: { opacity: 1, y: 0, transition: { duration: 1 } },
  };

  return (
    <div className="h-screen w-full flex bg-white overflow-hidden">
      <img
        src={aideLogo}
        alt="AIDE logo"
        onClick={() => navigate("/")}
        className="h-16 absolute top-6 left-8 cursor-pointer z-50"
      />

      {/* LEFT */}
      <motion.div
        ref={leftRef}
        variants={sectionVariants}
        initial="hidden"
        animate={leftControls}
        className="w-[40%] flex items-center justify-center"
      >
        <form
          onSubmit={handleSignIn}
          className="w-full max-w-sm space-y-6"
          style={{ transform: "scale(var(--auth-scale))" }}
        >
          <h1 className="text-4xl font-bold text-[#DF1516]">
            Welcome Back
          </h1>

          <Input
            placeholder="Email"
            value={signInEmail}
            onChange={(e) => setSignInEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={signInPassword}
            onChange={(e) => setSignInPassword(e.target.value)}
          />

          <Button className="w-full" disabled={loading}>
            Sign In
          </Button>
        </form>
      </motion.div>

      {/* RIGHT */}
      <motion.div
        ref={rightRef}
        variants={sectionVariants}
        initial="hidden"
        animate={rightControls}
        className="w-[60%] bg-[#DF1516] flex items-center justify-center"
      >
        <div
          className="w-full max-w-md space-y-6 text-center"
          style={{ transform: "scale(var(--auth-scale))" }}
        >
          <button
            onClick={handleGoogle}
            className="flex w-full bg-white text-[#DF1516] font-bold h-14 items-center justify-center gap-4"
          >
            <FcGoogle size={28} />
            Continue with Google
          </button>

          <form onSubmit={handleSignUp} className="space-y-4">
            <Input
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <Input
              placeholder="Email"
              value={signUpEmail}
              onChange={(e) => setSignUpEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={signUpPassword}
              onChange={(e) => setSignUpPassword(e.target.value)}
            />
            <Button className="w-full bg-white text-[#DF1516]">
              Create Account
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
