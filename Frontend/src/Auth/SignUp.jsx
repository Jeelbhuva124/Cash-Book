import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Shield, CheckCircle, Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";
import { userAPI } from "../api/api.jsx";
import { useToast } from "../context/ToastContext";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      const response = await userAPI.signup({
        username: formData.name,
        email_id: formData.email,
        password: formData.password
      });

      if (response.success) {
        addToast("Workspace registered successfully! Please login.", "success");
        navigate("/login");
      } else {
        setError(response.message || "Registration failed.");
        addToast(response.message || "Registration failed.", "error");
      }
    } catch (err) {
      console.error("Signup Error:", err);
      const errMsg = err.response?.data?.message || err.message || "Unable to connect to the backend server.";
      setError(errMsg);
      addToast(errMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  return (
    <div className="flex w-full min-h-screen bg-background">

      {/* ── LEFT PANEL: Navy Branding Side (Cash Book Split Layout) ── */}
      <div className="hidden lg:flex w-1/2 bg-muted flex-col justify-between p-16 relative overflow-hidden border-r border-border">

        {/* Top Header */}
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 w-fit">
            <img src="/logo.png" alt="Logo" className="w-14 h-14 object-contain" />
            <div>
              <p className="text-lg font-bold tracking-tight text-foreground">Cash Book</p>
              <p className="text-[10px] text-muted-foreground -mt-0.5">Smart Finance Tracker</p>
            </div>
          </Link>

          <div className="flex items-center gap-2 mt-8 text-xs font-semibold tracking-wide text-muted-foreground uppercase border border-border rounded-full px-3 py-1.5 bg-card w-fit">
            <Shield className="w-3.5 h-3.5 text-primary" />
            <span>Bank-Grade Encryption</span>
          </div>
        </div>

        {/* Mid Heading */}
        <div className="relative z-10 space-y-6 my-auto">
          <h1 className="text-4xl xl:text-5xl font-black leading-tight text-foreground">
            Start tracking<br />
            your finances today.
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
            Join thousands of users tracking daily kitchen expenses, business cash flows, family budgets, and outstanding credits in one simple app.
          </p>

          <div className="space-y-3 pt-4">
            {[
              "Digital ledger with cloud sync",
              "Interactive credit/debit logs",
              "Clean PDF & Excel report downloads"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-foreground">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Social Proof */}
        <div className="relative z-10 border-t border-border pt-8 mt-12">
          <div className="text-xs text-muted-foreground leading-tight">
            © 2026 Cash Book Ledger Systems. All rights reserved.
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL: Auth Card Form ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 xl:p-24 bg-card ">
        <div className="w-full max-w-[420px] space-y-8">

          {/* Mobile Header Logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain" />
            <span className="text-xl font-bold text-foreground">Cash Book</span>
          </div>

          {/* Form Headers */}
          <div className="space-y-2">
            <div className="text-xs font-bold tracking-widest uppercase text-primary">Workspace Registration</div>
            <h2 className="text-3xl font-extrabold text-foreground">Create Account</h2>
            <p className="text-muted-foreground text-sm">
              Initialize your administrative access and configure cash book.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold tracking-wider text-muted-foreground uppercase ml-0.5">Administrator Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <User className="h-4.5 w-4.5" />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="johndoe"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-border bg-muted/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:bg-card transition-all text-sm font-medium"
                />
              </div>
            </div>

            {/* Email Input */}
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
                  placeholder="john@example.com"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-border bg-muted/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:bg-card transition-all text-sm font-medium"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold tracking-wider text-muted-foreground uppercase ml-0.5">Access Key</label>
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

            {/* Confirm Password Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold tracking-wider text-muted-foreground uppercase ml-0.5">Confirm Access Key</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-border bg-muted/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:bg-card transition-all text-sm font-medium tracking-widest"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-muted-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-primary-foreground bg-primary hover:opacity-95 transition-all font-semibold text-sm shadow-sm disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] mt-2"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  Initialize Workspace
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-4 border-t border-border mt-6">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-bold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
