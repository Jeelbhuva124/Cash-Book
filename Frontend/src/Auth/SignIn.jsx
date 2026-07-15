import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Shield, CheckCircle, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { userAPI } from "../api/api.jsx";
import { useToast } from "../context/ToastContext";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await userAPI.login({
        email_id: formData.email,
        password: formData.password
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
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 xl:p-24 bg-card ">
        <div className="w-full max-w-[420px] space-y-8">

          {/* Mobile Header Logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain" />
            <span className="text-xl font-bold text-foreground">Daily Chalan</span>
          </div>

          {/* Form Headers */}
          <div className="space-y-2">
            <div className="text-xs font-bold tracking-widest uppercase text-primary">Welcome Back</div>
            <h2 className="text-3xl font-extrabold text-foreground">Login to Daily Chalan</h2>
            <p className="text-muted-foreground text-sm">
              Enter your login details to access your books.
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

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-0.5">
                <label className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Access Key</label>
                <Link to="#" className="text-xs font-bold text-primary hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-border bg-muted/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:bg-card transition-all text-sm font-medium tracking-widest"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-muted-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
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
            <span>Google Account</span>
          </button>

          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary font-bold hover:underline">
                Register Workspace
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
