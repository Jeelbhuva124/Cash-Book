import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Shield, CheckCircle, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { userAPI } from "../api/api.jsx";
import { useToast } from "../context/ToastContext";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";

export default function SignIn() {
  const [formData, setFormData] = useState({ email: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState("credentials"); // "credentials" | "otp"
  const [otpValues, setOtpValues] = useState(["", "", "", ""]);
  const [otpTimer, setOtpTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval = null;
    if (step === "otp" && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, otpTimer]);

  const handleOtpChange = (value, index) => {
    if (value && isNaN(value)) return;
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value.substring(value.length - 1);
    setOtpValues(newOtpValues);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = "";
      setOtpValues(newOtpValues);
      
      if (index > 0) {
        const prevInput = document.getElementById(`otp-${index - 1}`);
        if (prevInput) prevInput.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    } else if (e.key === "ArrowRight" && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (pasteData.length === 4 && /^\d+$/.test(pasteData)) {
      const newOtpValues = pasteData.split("");
      setOtpValues(newOtpValues);
      const lastInput = document.getElementById("otp-3");
      if (lastInput) lastInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await userAPI.login({
        email_id: formData.email
      });

      if (response.success) {
        if (response.otpRequired) {
          addToast("Verification code sent to your email! ✉️", "success");
          setStep("otp");
          setOtpValues(["", "", "", ""]);
          setOtpTimer(60);
          setCanResend(false);
        } else {
          const username = response.user?.username || "User";
          addToast(`Welcome back, ${username}! 👋`, "success");
          localStorage.setItem("user", JSON.stringify(response.user));
          if (response.user?.firebaseToken) {
            localStorage.setItem("token", response.user.firebaseToken);
          }
          navigate("/dashboard");
        }
      } else {
        addToast(response.message || "Authentication failed.", "error");
      }
    } catch (err) {
      console.error("Login Error:", err);
      const errMsg = err.response?.data?.message || err.message || "Unable to connect to the backend server.";
      addToast(errMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpCode = otpValues.join("");
    if (otpCode.length !== 4) {
      addToast("Please enter all 4 digits of the OTP code.", "error");
      return;
    }
    setIsLoading(true);
    try {
      const response = await userAPI.verifyOtp({
        email_id: formData.email,
        otp: otpCode
      });

      if (response.success) {
        const username = response.user?.username || "User";
        addToast(`Welcome back, ${username}! 👋`, "success");
        localStorage.setItem("user", JSON.stringify(response.user));
        if (response.user?.firebaseToken) {
          localStorage.setItem("token", response.user.firebaseToken);
        }
        navigate("/dashboard");
      } else {
        addToast(response.message || "Invalid verification code.", "error");
      }
    } catch (err) {
      console.error("OTP Verification Error:", err);
      const errMsg = err.response?.data?.message || err.message || "Verification failed.";
      addToast(errMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    setIsLoading(true);
    try {
      const response = await userAPI.login({
        email_id: formData.email
      });
      if (response.success && response.otpRequired) {
        addToast("A new verification code has been sent! ✉️", "success");
        setOtpValues(["", "", "", ""]);
        setOtpTimer(60);
        setCanResend(false);
      } else {
        addToast(response.message || "Failed to resend verification code.", "error");
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Failed to resend verification code.";
      addToast(errMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const response = await userAPI.googleAuth({ idToken });

      if (response.success) {
        const username = response.user?.username || result.user.displayName || "User";
        addToast(`Welcome, ${username}! 🎉`, "success");
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("token", response.user.firebaseToken);
        navigate("/dashboard");
      } else {
        addToast(response.message || "Google Authentication failed.", "error");
      }
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      const errMsg = err.response?.data?.message || err.message || "Google Authentication failed.";
      addToast(errMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex w-full min-h-screen bg-background">

      {/* ── LEFT PANEL: Navy Branding Side (Daily Chalan Split Layout) ── */}
      <div className="hidden lg:flex w-1/2 bg-brand text-white flex-col justify-between p-16 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]" />

        {/* Top Header */}
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 w-fit">
            <img src="/logo.png" alt="Logo" className="w-14 h-14 object-contain" />
            <div>
              <p className="text-lg font-bold tracking-tight text-white">Daily Chalan</p>
              <p className="text-[10px] text-white/50 -mt-0.5">Smart Finance Tracker</p>
            </div>
          </Link>

          <div className="flex items-center gap-2 mt-8 text-xs font-semibold tracking-wide text-white/60 uppercase border border-white/10 rounded-full px-3 py-1.5 bg-card/5 w-fit">
            <Shield className="w-3.5 h-3.5 text-primary" />
            <span>Bank-Grade Encryption</span>
          </div>
        </div>

        {/* Mid Heading */}
        <div className="relative z-10 space-y-6 my-auto">
          <h1 className="text-4xl xl:text-5xl font-black leading-tight text-white">
            Track and manage<br />
            your finances on the go.
          </h1>
          <p className="text-white/60 text-sm leading-relaxed max-w-md">
            Join thousands of users tracking daily kitchen expenses, business cash flows, family budgets, and outstanding credits in one simple app.
          </p>

          <div className="space-y-3 pt-4">
            {[
              "Digital ledger with cloud sync",
              "Interactive credit/debit logs",
              "Clean PDF & Excel report downloads"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-white/80">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Social Proof */}
        <div className="relative z-10 border-t border-white/10 pt-8 mt-12">
          <div className="text-xs text-white/40 leading-tight">
            © 2026 Daily Chalan Ledger Systems. All rights reserved.
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL: Auth Card Form ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 xl:p-24 bg-card relative">
        <div className="w-full max-w-[420px] space-y-8">

          {/* Mobile Header Logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain" />
            <span className="text-xl font-bold text-foreground">Daily Chalan</span>
          </div>

          <AnimatePresence mode="wait">
            {step === "credentials" ? (
              <motion.div
                key="credentials"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
                className="space-y-6"
              >
                {/* Form Headers */}
                <div className="space-y-2">
                  <div className="text-xs font-bold tracking-widest uppercase text-primary">Welcome Back</div>
                  <h2 className="text-3xl font-extrabold text-foreground">Login to Daily Chalan</h2>
                  <p className="text-muted-foreground text-sm">
                    Enter your email to receive an OTP code.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Username/Email Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold tracking-wider text-muted-foreground uppercase ml-0.5">Email Address</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                        <Mail className="h-4.5 w-4.5" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="name@company.com"
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-border bg-muted/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:bg-card transition-all text-sm font-medium"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-primary-foreground bg-primary hover:opacity-95 transition-all font-semibold text-sm shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
                  >
                    {isLoading ? (
                      <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Bypass Google Sign In */}
                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-border"></div>
                  <span className="flex-shrink-0 mx-4 text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Or continue with</span>
                  <div className="flex-grow border-t border-border"></div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl border border-border hover:bg-background transition-colors font-semibold text-xs uppercase tracking-wider text-foreground disabled:opacity-75"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <div className="text-center pt-4">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-primary font-bold hover:underline">
                      Register Account
                    </Link>
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
                className="space-y-6"
              >
                <div className="absolute top-6 left-6 md:top-8 md:left-8">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("credentials");
                      setOtpValues(["", "", "", ""]);
                    }}
                    className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors cursor-pointer w-fit py-1.5 px-3 rounded-lg hover:bg-muted/50"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Login</span>
                  </button>
                </div>

                {/* Form Headers */}
                <div className="space-y-2">
                  <div className="text-xs font-bold tracking-widest uppercase text-primary">Security Verification</div>
                  <h2 className="text-3xl font-extrabold text-foreground">Verify OTP</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    We have sent a 4-digit verification code to <br/>
                    <span className="font-semibold text-foreground break-all">{formData.email}</span>.
                  </p>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  {/* 4 Digit Inputs */}
                  <div className="flex justify-center gap-4 my-4">
                    {otpValues.map((value, idx) => (
                      <motion.input
                        key={idx}
                        id={`otp-${idx}`}
                        type="text"
                        maxLength={1}
                        value={value}
                        onChange={(e) => handleOtpChange(e.target.value, idx)}
                        onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                        onPaste={handleOtpPaste}
                        whileFocus={{ scale: 1.05, y: -2 }}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="w-14 h-16 text-center text-2xl font-bold rounded-2xl border border-border bg-muted/50 text-foreground focus:outline-none focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10 transition-all shadow-sm focus:shadow-md"
                      />
                    ))}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-primary-foreground bg-primary hover:opacity-95 transition-all font-semibold text-sm shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
                  >
                    {isLoading ? (
                      <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    ) : (
                      <>
                        Verify & Access Dashboard
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Resend section */}
                <div className="text-center pt-4 border-t border-border">
                  {canResend ? (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground font-medium">Didn't receive the email?</p>
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="text-sm font-bold text-primary hover:underline cursor-pointer"
                      >
                        Resend Verification Code
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground font-medium">
                      Resend code in <span className="font-bold text-foreground">{Math.floor(otpTimer / 60)}:{(otpTimer % 60).toString().padStart(2, '0')}</span>
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
