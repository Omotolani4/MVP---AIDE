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
  const [isSigningUp, setIsSigningUp] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const leftControls = useAnimation();
  const rightControls = useAnimation();

  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  /** AUTH STATE LISTENER - set up BEFORE checking session */
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        // Check if user has a profile (existing user) or not (new user)
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", session.user.id)
          .single();

        // Small delay to ensure session is fully established
        setTimeout(() => {
          if (!profile || isSigningUp) {
            // New user - go to quiz flow
            navigate("/quiz-step2");
          } else {
            // Existing user - go to dashboard
            navigate("/dashboard");
          }
        }, 100);
      }
    });

    // Check existing session AFTER listener is set up
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        navigate("/dashboard");
      }
    };
    checkSession();

    return () => subscription.unsubscribe();
  }, [navigate, isSigningUp]);

  /** AUTO-SCALING */
  useEffect(() => {
    const resize = () => {
      const baseWidth = 1440;
      const baseHeight = 900;

      const scaleX = window.innerWidth / baseWidth;
      const scaleY = window.innerHeight / baseHeight;
      const finalScale = Math.min(scaleX, scaleY) * 1.1;

      document.documentElement.style.setProperty(
        "--auth-scale",
        String(finalScale)
      );
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /** LOAD REMEMBERED EMAIL */
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setSignInEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  /** FADE-IN OBSERVER */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === leftRef.current)
              leftControls.start("visible");
            if (entry.target === rightRef.current)
              rightControls.start("visible");
          }
        });
      },
      { threshold: 0.2 }
    );

    if (leftRef.current) observer.observe(leftRef.current);
    if (rightRef.current) observer.observe(rightRef.current);

    return () => observer.disconnect();
  }, [leftControls, rightControls]);

  /** SIGN UP */
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setIsSigningUp(true);

    try {
      const nameParts = fullName.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const { error } = await supabase.auth.signUp({
        email: signUpEmail,
        password: signUpPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
          data: { first_name: firstName, last_name: lastName },
        },
      });

      if (error) throw error;

      toast({ title: "Account created successfully!" });
    } catch (error: any) {
      setIsSigningUp(false);
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  /** SIGN IN */
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: signInEmail,
        password: signInPassword,
      });

      if (error) throw error;

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", signInEmail);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

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

  /** GOOGLE SIGN IN */
  const handleGoogle = async () => {
    setLoading(true);
    try {
      const { error } = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${window.location.origin}/auth`,
      });

      if (error) throw error;
    } catch (error: any) {
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
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.1 },
    },
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

      {/* LEFT PANEL */}
      <motion.div
        ref={leftRef}
        variants={sectionVariants}
        initial="hidden"
        animate={leftControls}
        className="w-[40%] flex flex-col items-center justify-start pt-48 p-12 bg-white"
      >
        <div
          className="w-full max-w-sm flex flex-col items-center text-center"
          style={{
            transform: "scale(var(--auth-scale))",
            transformOrigin: "top center",
          }}
        >
          <motion.h1
            variants={fadeItem}
            custom={0}
            className="text-[#DF1516] font-extrabold text-[48px] whitespace-nowrap font-montserrat"
          >
            Hello, Friend!
          </motion.h1>

          <motion.p
            variants={fadeItem}
            custom={1}
            className="text-gray-700 text-[22px] mt-4 max-w-[350px]"
            style={{ lineHeight: 1.4 }}
          >
            Sign in to continue your personalized journey with{" "}
            <span className="font-bold text-black">AIDE</span>—where mindset
            mastery meets business growth.
          </motion.p>

          <motion.form
            variants={fadeItem}
            custom={2}
            onSubmit={handleSignIn}
            className="space-y-6 w-full mt-8"
          >
            <Input
              type="email"
              placeholder="Your Email"
              className="h-[80px] text-[22px] px-6 placeholder:text-[22px] border border-[#DF1516] rounded-none"
              value={signInEmail}
              onChange={(e) => setSignInEmail(e.target.value)}
            />

            <div className="flex border border-[#DF1516] rounded-none">
              <Input
                type="password"
                placeholder="Password"
                className="h-[80px] flex-1 text-[22px] px-6 placeholder:text-[22px] border-none"
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
              />
              <Button
                type="submit"
                className="w-[160px] h-[80px] bg-[#DF1516] text-white font-bold text-[22px] rounded-none hover:bg-[#c01314]"
              >
                {loading ? "..." : "SIGN IN"}
              </Button>
            </div>

            <div className="flex justify-between mt-2 text-[18px] text-gray-800">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-6 h-6 accent-[#DF1516]"
                />
                Remember Me
              </label>

              <button
                type="button"
                onClick={() => navigate("/reset-password")}
                className="hover:text-[#DF1516] font-medium"
              >
                Forgot Password
              </button>
            </div>
          </motion.form>
        </div>
      </motion.div>

      {/* RIGHT PANEL */}
      <motion.div
        ref={rightRef}
        variants={sectionVariants}
        initial="hidden"
        animate={rightControls}
        className="w-[60%] bg-[#DF1516] flex flex-col items-center justify-start pt-48 p-16"
      >
        <div
          className="w-full max-w-xl text-center"
          style={{
            transform: "scale(var(--auth-scale))",
            transformOrigin: "top center",
          }}
        >
          <motion.h2
            variants={fadeItem}
            custom={0}
            className="text-white font-extrabold text-[55px] whitespace-nowrap font-montserrat"
          >
            Create an Account
          </motion.h2>

          <button
            onClick={handleGoogle}
            className="flex w-[80%] mx-auto mt-8 mb-6 rounded-none overflow-hidden"
          >
            <div className="bg-white w-[80px] h-[80px] flex items-center justify-center">
              <FcGoogle size={42} />
            </div>
            <span className="flex-1 h-[80px] bg-white text-[#DF1516] flex items-center justify-center text-[23px] font-bold">
              Continue With Google
            </span>
          </button>

          <p className="text-white text-[23px] mt-4 mb-6">
            or use your Email for registration
          </p>

          <motion.form
            variants={fadeItem}
            custom={1}
            onSubmit={handleSignUp}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-6">
              <Input
                type="text"
                placeholder="Full Name"
                className="h-[80px] text-[22px] px-6 rounded-none placeholder:text-[22px]"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <Input
                type="email"
                placeholder="Your Email"
                className="h-[80px] text-[22px] px-6 rounded-none placeholder:text-[22px]"
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
              />
            </div>

            <Input
              type="password"
              placeholder="Password"
              className="h-[80px] text-[22px] px-6 rounded-none placeholder:text-[22px]"
              value={signUpPassword}
              onChange={(e) => setSignUpPassword(e.target.value)}
            />

            <Button
              type="submit"
              className="w-full h-[80px] text-[23px] font-bold bg-white text-[#DF1516] rounded-none hover:bg-gray-100 mt-6"
            >
              {loading ? "..." : "SIGN UP"}
            </Button>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
}
