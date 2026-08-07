import React, { useState, useRef, useEffect } from "react";
import axios from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import useApp from "../hooks/useApp";
import useAuth from "../hooks/useAuth";

// ── OTP digit input ────────────────────────────────────────────────
function OtpInput({ otp, setOtp, error }) {
  const inputRefs = useRef([]);

  const handleChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const digits = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6)
      .split("");
    const next = Array(6).fill("");
    digits.forEach((d, i) => {
      next[i] = d;
    });
    setOtp(next);
    const focusIdx = Math.min(digits.length, 5);
    inputRefs.current[focusIdx]?.focus();
  };

  return (
    <div>
      <div className="flex gap-2 justify-center" onPaste={handlePaste}>
        {otp.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => (inputRefs.current[idx] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all duration-200
                            bg-gray-50 dark:bg-gray-800/60 text-gray-900 dark:text-white
                            ${digit ? "border-brand-500 ring-2 ring-brand-500/20" : error ? "border-red-400" : "border-gray-200 dark:border-gray-700"}
                            focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20`}
          />
        ))}
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-2 text-center font-medium">
          {error}
        </p>
      )}
    </div>
  );
}

// ── Main Auth Page ─────────────────────────────────────────────────
export default function Auth() {
  const { setToast } = useApp();
  const { auth, setAuth, loggedIn, setLoggedIn } = useAuth();
  console.log(auth.accessToken);

  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn.status) navigate("/profile");
  }, [loggedIn.status, navigate]);

  // ── View state: 'login' | 'register' | 'otp'
  const [view, setView] = useState("login");

  // ── Form fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [emailOrUsername, setEmailOrUsername] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  const cardRef = useRef(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      const timer = setTimeout(() => {
        cardRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [view]);

  // ── Resend OTP countdown
  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setTimeout(() => setResendTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [resendTimer]);

  // ── Validate register / login form
  const validateRegisterForm = () => {
    const errs = {};
    if (!username.trim()) errs.username = "Username is required";
    if (!email.trim()) {
      errs.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = "Please enter a valid email address";
    }
    if (!password) {
      errs.password = "Password is required";
    } else if (password.length < 6) {
      errs.password = "Password must be at least 6 characters";
    }
    if (password !== confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateLoginForm = () => {
    const errs = {};
    if (!emailOrUsername.trim()) {
      errs.email = "Email or Username is required";
    } else if (
      !/\S+@\S+\.\S+/.test(emailOrUsername) &&
      emailOrUsername.includes("@")
    ) {
      errs.email = "Please enter a valid email address";
    }
    if (!password) errs.password = "Password is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Step 1: Send OTP (register) or Sign in (login)
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (view === "login") {
      if (!validateLoginForm()) return;
      setLoading(true);
      try {
        // POST /api/auth/login
        // 1. Construct the payload object dynamically
        const isEmail = emailOrUsername.includes("@");

        const payload = {
          [isEmail ? "email" : "username"]: emailOrUsername,
          password: password,
        };

        // 2. Pass the object directly into axios.post
        const res = await axios.post("/auth/login", payload);
        // console.log(res.data.user);
        // Login successful
        console.log("logged in !");

        setAuth({
          user: res.data.user,
          accessToken: res.data.accessToken,
        });
        setLoggedIn({
          status: true,
          user: res.data.user,
        });
        setToast({
          message: `Logged in successfully as ${res.data.user.username}`,
          type: "success",
        });

        // navigate to home page after successful login
        navigate("/");
      } catch {
        setErrors({ general: "Incorrect email or password." });
      } finally {
        setLoading(false);
      }
      return;
    }

    // Register: validate then request OTP
    if (!validateRegisterForm()) return;
    setLoading(true);
    try {
      // Registers user in DB and sends OTP to the provided email
      await fetch("api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      }).then((res) => {
        if (!res.ok) throw new Error();
      });
      setOtp(Array(6).fill(""));
      setErrors({});
      setResendTimer(60);
      setView("otp");
    } catch {
      setErrors({ general: "Failed to send OTP. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      setErrors({ otp: "Please enter the complete 6-digit OTP" });
      return;
    }
    setLoading(true);
    try {
      // 1. Verify the OTP
      await axios.post("/auth/verify-otp", { email, otp: code });
      // 2. OTP is valid → finish registering by logging the user in
      const loginRes = await axios.post("/auth/login", { email, password });
      setAuth({
        user: loginRes.data.user,
        accessToken: loginRes.data.accessToken,
      });
      setLoggedIn({ status: true, user: loginRes.data.user });
      setToast({
        message: `Welcome, ${loginRes.data.user.username}!`,
        type: "success",
      });
      navigate("/profile");
    } catch {
      setErrors({ otp: "Invalid or expired OTP. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // ── Resend OTP
  const handleResend = async () => {
    if (resendTimer > 0 || resendLoading) return;
    setResendLoading(true);
    try {
      // Re-hitting /api/auth/register resends the OTP to the same email
      await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      }).then((res) => {
        if (!res.ok) throw new Error();
      });
      setOtp(Array(6).fill(""));
      setErrors({});
      setResendTimer(60);
    } catch {
      setErrors({ otp: "Could not resend OTP. Please try again." });
    } finally {
      setResendLoading(false);
    }
  };

  const switchToRegister = () => {
    setView("register");
    setErrors({});
  };
  const switchToLogin = () => {
    setView("login");
    setErrors({});
  };
  const backToRegister = () => {
    setView("register");
    setErrors({});
  };

  // ── Shared input classes
  const inputCls = (field) =>
    `w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border ${
      errors[field] ? "border-red-500" : "border-gray-200 dark:border-gray-800"
    } focus:ring-2 focus:ring-brand-500 outline-none text-sm text-gray-900 dark:text-white transition`;

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4 sm:px-6">
      <div
        ref={cardRef}
        className="max-w-5xl w-full bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-gray-200 dark:border-gray-800"
      >
        {/* ── Left Art Panel ── */}
        <div className="hidden md:flex md:w-1/2 bg-gray-900 relative items-center justify-center p-12 overflow-hidden min-h-[500px]">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&fit=crop&q=80"
              alt="Elegance Model"
              className="w-full h-full object-cover opacity-60 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/60 to-transparent" />
          </div>
          <div className="relative z-10 text-white flex flex-col justify-between h-full max-w-sm">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-wider mb-2">
                ABC
              </h2>
              <p className="text-[10px] tracking-[0.4em] text-gray-400">
                PREMIUM FASHION
              </p>
            </div>
            <div className="my-16">
              <h3 className="font-display text-4xl font-light leading-tight mb-4">
                Experience <br />
                <span className="font-bold">Effortless Elegance</span>
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed font-light">
                Sign in to check your order details, manage saved fits, and
                access tailored offers.
              </p>
            </div>
            <p className="text-xs text-gray-500">
              © 2026 ABC Store. Crafted with pride.
            </p>
          </div>
        </div>

        {/* ── Right Form Panel ── */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center bg-white dark:bg-gray-900">
          <div className="max-w-md w-full mx-auto">
            <AnimatePresence mode="wait">
              {/* ════ LOGIN ════ */}
              {view === "login" && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="mb-8">
                    <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white">
                      Welcome Back
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Please sign in to your account.
                    </p>
                  </div>

                  {errors.general && (
                    <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                      {errors.general}
                    </div>
                  )}

                  <form onSubmit={handleFormSubmit} className="space-y-5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                        Email Address / Username
                      </label>
                      <input
                        type="text"
                        value={emailOrUsername}
                        onChange={(e) => setEmailOrUsername(e.target.value)}
                        className={inputCls("email")}
                        placeholder="yourname@domain.com"
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500 mt-1 font-medium">
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Password
                        </label>
                      </div>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={inputCls("password")}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        className="text-xs text-brand-600 dark:text-brand-400 underline"
                      >
                        Forgot Password?
                      </button>
                      {errors.password && (
                        <p className="text-xs text-red-500 mt-1 font-medium">
                          {errors.password}
                        </p>
                      )}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-xl text-sm tracking-wider shadow-lg hover:bg-gray-800 dark:hover:bg-gray-50 transition flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <i className="fas fa-spinner animate-spin" />{" "}
                          Processing...
                        </>
                      ) : (
                        "SIGN IN"
                      )}
                    </motion.button>
                  </form>

                  <div className="mt-8 text-center border-t border-gray-100 dark:border-gray-800 pt-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      New to ABC store?{" "}
                      <button
                        type="button"
                        onClick={switchToRegister}
                        className="text-brand-600 dark:text-brand-400 font-bold hover:underline cursor-pointer"
                      >
                        Register Now
                      </button>
                    </p>
                  </div>
                </motion.div>
              )}

              {/* ════ REGISTER ════ */}
              {view === "register" && (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="mb-8">
                    <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white">
                      Create Account
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Join us to access exclusive premium collections.
                    </p>
                  </div>

                  {errors.general && (
                    <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                      {errors.general}
                    </div>
                  )}

                  <form onSubmit={handleFormSubmit} className="space-y-5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={inputCls("username")}
                        placeholder="Choose a username"
                      />
                      {errors.username && (
                        <p className="text-xs text-red-500 mt-1 font-medium">
                          {errors.username}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputCls("email")}
                        placeholder="yourname@domain.com"
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500 mt-1 font-medium">
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={inputCls("password")}
                        placeholder="Min. 6 characters"
                      />
                      {errors.password && (
                        <p className="text-xs text-red-500 mt-1 font-medium">
                          {errors.password}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={inputCls("confirmPassword")}
                        placeholder="Re-enter password"
                      />
                      {errors.confirmPassword && (
                        <p className="text-xs text-red-500 mt-1 font-medium">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-xl text-sm tracking-wider shadow-lg hover:bg-gray-800 dark:hover:bg-gray-50 transition flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <i className="fas fa-spinner animate-spin" /> Sending
                          OTP...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-envelope mr-1" /> CONTINUE WITH
                          OTP
                        </>
                      )}
                    </motion.button>
                  </form>

                  <div className="mt-8 text-center border-t border-gray-100 dark:border-gray-800 pt-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={switchToLogin}
                        className="text-brand-600 dark:text-brand-400 font-bold hover:underline cursor-pointer"
                      >
                        Sign In
                      </button>
                    </p>
                  </div>
                </motion.div>
              )}

              {/* ════ OTP VERIFICATION ════ */}
              {view === "otp" && (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Back button */}
                  <button
                    type="button"
                    onClick={backToRegister}
                    className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition"
                  >
                    <i className="fas fa-arrow-left text-[10px]" />
                    Back to Registration
                  </button>

                  {/* Icon + heading */}
                  <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 mb-4">
                      <i className="fas fa-envelope-open-text text-2xl text-brand-600 dark:text-brand-400" />
                    </div>
                    <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white">
                      Verify Your Email
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                      We&apos;ve sent a 6-digit code to <br />
                      <span className="font-semibold text-gray-800 dark:text-gray-200">
                        {email}
                      </span>
                    </p>
                  </div>

                  {errors.general && (
                    <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm text-center">
                      {errors.general}
                    </div>
                  )}

                  <form onSubmit={handleOtpSubmit} className="space-y-6">
                    <OtpInput otp={otp} setOtp={setOtp} error={errors.otp} />

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading || otp.join("").length < 6}
                      className="w-full py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-xl text-sm tracking-wider shadow-lg hover:bg-gray-800 dark:hover:bg-gray-50 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <i className="fas fa-spinner animate-spin" />{" "}
                          Verifying...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-check-circle" /> VERIFY & CREATE
                          ACCOUNT
                        </>
                      )}
                    </motion.button>
                  </form>

                  {/* Resend OTP */}
                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Didn&apos;t receive the code?{" "}
                      {resendTimer > 0 ? (
                        <span className="text-gray-400 dark:text-gray-500">
                          Resend in{" "}
                          <span className="font-semibold text-gray-700 dark:text-gray-300 tabular-nums">
                            {resendTimer}s
                          </span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResend}
                          disabled={resendLoading}
                          className="text-brand-600 dark:text-brand-400 font-bold hover:underline cursor-pointer disabled:opacity-50"
                        >
                          {resendLoading ? "Sending..." : "Resend OTP"}
                        </button>
                      )}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-600 mt-2">
                      Check your spam folder if you don&apos;t see it.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
