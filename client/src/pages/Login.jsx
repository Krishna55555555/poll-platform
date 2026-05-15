import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../services/api";
import pollbabaLogo from "../assets/pollbaba-logo.png";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post("/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (name) => ({
    background: "rgba(255,255,255,0.05)",
    border: focused === name
      ? "1px solid rgba(168,85,247,0.7)"
      : "1px solid rgba(255,255,255,0.08)",
    boxShadow: focused === name ? "0 0 0 3px rgba(168,85,247,0.12)" : "none",
  });

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden"
      style={{ background: "#0a0a12" }}
    >
      {/* Background orbs */}
      <div className="absolute top-[-120px] left-[-80px] w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] rounded-full bg-purple-700 opacity-20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-60px] w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] rounded-full bg-violet-500 opacity-15 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] rounded-full bg-indigo-900 opacity-10 blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[420px]"
      >
        {/* Card */}
        <div
          className="rounded-[24px] sm:rounded-[28px] p-6 sm:p-8 border border-white/[0.08]"
          style={{
            background: "linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
            backdropFilter: "blur(24px)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          {/* Logo + heading */}
          <div className="flex flex-col items-center mb-7">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="mb-5"
            >
              {/* Clickable logo → home */}
              <Link to="/" title="Go to homepage">
                <img
                  src={pollbabaLogo}
                  alt="Poll Baba — Go to home"
                 className="w-40 h-40 sm:w-[240px] sm:h-36 object-contain transition-transform duration-200 hover:scale-105 active:scale-95"
                  style={{ filter: "drop-shadow(0 10px 28px rgba(139,92,246,0.6))" }}
                />
              </Link>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-xl sm:text-2xl font-bold text-white text-center"
              style={{ letterSpacing: "-0.02em" }}
            >
              Welcome back
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.28 }}
              className="text-xs sm:text-sm mt-1.5 text-center"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Sign in to your Poll Baba account
            </motion.p>
          </div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            {/* Email */}
            <div
              className="flex items-center rounded-xl transition-all duration-200"
              style={inputStyle("email")}
            >
              <span className="pl-3.5 sm:pl-4 flex-shrink-0" style={{ color: "rgba(168,85,247,0.7)" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </span>
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused("")}
                className="w-full bg-transparent px-3 py-3 sm:py-3.5 text-sm text-white placeholder-white/30 focus:outline-none min-w-0"
                required
              />
            </div>

            {/* Password */}
            <div
              className="flex items-center rounded-xl transition-all duration-200"
              style={inputStyle("password")}
            >
              <span className="pl-3.5 sm:pl-4 flex-shrink-0" style={{ color: "rgba(168,85,247,0.7)" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused("")}
                className="w-full bg-transparent px-3 py-3 sm:py-3.5 text-sm text-white placeholder-white/30 focus:outline-none min-w-0"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="pr-3.5 sm:pr-4 flex-shrink-0 transition-colors"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                {showPassword ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full py-3 sm:py-3.5 rounded-xl text-sm font-semibold text-white mt-1 transition-all duration-200"
              style={{
                background: loading
                  ? "rgba(139,92,246,0.5)"
                  : "linear-gradient(135deg, #a855f7, #7c3aed)",
                boxShadow: loading ? "none" : "0 8px 24px rgba(139,92,246,0.4)",
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Signing in…
                </span>
              ) : (
                "Sign in"
              )}
            </motion.button>
          </motion.form>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="text-center text-xs mt-5"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            No account yet?{" "}
            <Link
              to="/register"
              className="font-medium transition-colors hover:text-purple-300"
              style={{ color: "rgba(192,132,252,0.9)" }}
            >
              Create one free
            </Link>
          </motion.p>
        </div>

        {/* Branding */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="text-center text-[10px] sm:text-[11px] mt-5 font-medium"
          style={{ color: "rgba(255,255,255,0.15)", letterSpacing: "0.15em", textTransform: "uppercase" }}
        >
          Poll Baba
        </motion.p>
      </motion.div>
    </div>
  );
}

export default Login;