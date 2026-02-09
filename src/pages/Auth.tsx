import { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
import aideLogo from "@/assets/aide-logo.png";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
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

  /* =========================
     AUTH STATE (FIXED)
     ========================= */
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event !== "SIGNED_IN" || !session?.user) return;

      const { data } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", session.user.id)
        .maybeSingle();

      if (data) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/quiz-step2", { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  /* =========================
     AUTO SCALING (UNCHANGED)
     ========================= */
  useEffect(() => {
    const resize = () => {
      const baseWidth = 1440;
      const baseHeight = 900;
      const scale =
        Math.min(
          window.innerWidth / baseWidth,
          window.innerHeight / baseHeight
        ) * 1.1;

      document.documentElement.style.setProperty(
        "--auth-scale",
        String(scale)
      );
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* =========================
     REMEMBER EMAIL
     ========================= */
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setSignInEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  /* =========================
     FADE IN OBSERVER
     ========================= */
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

  /* =========================
     EMAIL SIGN UP
     ========================= */
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const nameParts = fullName.trim().split(" ");
      const first_name = nameParts[0] || "";
      const last_name = nameParts.slice(1).join(" ");

      const { error } = await supabase.auth.signUp({
        email: signUpEmail,
        password: signUpPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
          data: { first_name, last_name },
        },
      });

      if (error) throw error;

      toast({ title: "Account created successfully!" });
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     EMAIL SIGN IN
     ========================= */
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
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     GOOGLE SIGN IN (SUPABASE)
     ========================= */
  const handleGoogle = async () => {
    setLoading(true);

    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });

    if (error) {
      toast({
        title: "Google Sign In failed",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 80 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.1 } },
  };

  const fadeItem = {
    hidden: { opacity: 0, y: 25 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.25 + i * 0.15, duration: 0.7 },
    }),
  };

  return (
    <div className="h-screen w-full flex relative bg-white overflow-hidden">
      {/* LOGO */}
      <img
        src={aideLogo}
        onClick={() => navigate("/dashboard")}
        className="h-16 absolute top-6 left-8 cursor-pointer z-50"
        alt="AIDE logo"
      />

      {/* LEFT PANEL - Sign Up */}
      <motion.div
        ref={leftRef}
        variants={sectionVariants}
        initial="hidden"
        animate={leftControls}
        className="w-[40%] flex flex-col items-center justify-start pt-48 p-12 bg-white"
      >
        <motion.h2
          custom={0}
          variants={fadeItem}
          initial="hidden"
          animate={leftControls}
          className="text-[55px] font-bold text-[#DF1516] mb-2"
        >
          Create Account
        </motion.h2>
        <motion.p
          custom={1}
          variants={fadeItem}
          initial="hidden"
          animate={leftControls}
          className="text-[21px] text-gray-500 mb-8"
        >
          Start your journey with AIDE
        </motion.p>

        <form onSubmit={handleSignUp} className="w-[80%] space-y-4">
          <Input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="h-[74px] text-[21px] rounded-none border-gray-300"
          />
          <Input
            type="email"
            placeholder="Email"
            value={signUpEmail}
            onChange={(e) => setSignUpEmail(e.target.value)}
            required
            className="h-[74px] text-[21px] rounded-none border-gray-300"
          />
          <Input
            type="password"
            placeholder="Password"
            value={signUpPassword}
            onChange={(e) => setSignUpPassword(e.target.value)}
            required
            className="h-[74px] text-[21px] rounded-none border-gray-300"
          />
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-[74px] text-[23px] font-bold bg-[#DF1516] hover:bg-[#c11213] text-white rounded-none"
          >
            {loading ? "Creating..." : "Sign Up"}
          </Button>
        </form>
      </motion.div>

      {/* RIGHT PANEL - Sign In */}
      <motion.div
        ref={rightRef}
        variants={sectionVariants}
        initial="hidden"
        animate={rightControls}
        className="w-[60%] bg-[#DF1516] flex flex-col items-center justify-start pt-48 p-16"
      >
        <motion.h2
          custom={0}
          variants={fadeItem}
          initial="hidden"
          animate={rightControls}
          className="text-[55px] font-bold text-white mb-2"
        >
          Welcome Back
        </motion.h2>
        <motion.p
          custom={1}
          variants={fadeItem}
          initial="hidden"
          animate={rightControls}
          className="text-[21px] text-white/80 mb-8"
        >
          Sign in to continue
        </motion.p>

        <form onSubmit={handleSignIn} className="w-[80%] space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={signInEmail}
            onChange={(e) => setSignInEmail(e.target.value)}
            required
            className="h-[74px] text-[21px] rounded-none border-white/30 bg-white/10 text-white placeholder:text-white/60"
          />
          <Input
            type="password"
            placeholder="Password"
            value={signInPassword}
            onChange={(e) => setSignInPassword(e.target.value)}
            required
            className="h-[74px] text-[21px] rounded-none border-white/30 bg-white/10 text-white placeholder:text-white/60"
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-white text-[16px] cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-5 h-5"
              />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => navigate("/reset-password")}
              className="text-white/80 hover:text-white text-[16px] underline"
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-[74px] text-[23px] font-bold bg-white text-[#DF1516] hover:bg-gray-100 rounded-none"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center w-[80%] my-6">
          <div className="flex-1 h-px bg-white/30" />
          <span className="px-4 text-white/70 text-[18px]">or</span>
          <div className="flex-1 h-px bg-white/30" />
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogle}
          className="flex w-[80%] mx-auto rounded-none overflow-hidden"
        >
          <div className="bg-white w-[80px] h-[80px] flex items-center justify-center">
            <FcGoogle size={42} />
          </div>
          <span className="flex-1 h-[80px] bg-white text-[#DF1516] flex items-center justify-center text-[23px] font-bold">
            Continue With Google
          </span>
        </button>
      </motion.div>
    </div>
  );
}
