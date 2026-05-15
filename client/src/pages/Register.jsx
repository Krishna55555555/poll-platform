import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../services/api";
import pollbabaLogo from "../assets/pollbaba-logo.png";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
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
      const res = await api.post("/auth/register", formData);
      localStorage.setItem("token", res.data.token);
      toast.success("Account created!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
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
      <div className="absolute top-[-80px] right-[-100px] w-[280px] h-[280px] sm:w-[420px] sm:h-[420px] rounded-full bg-violet-600 opacity-20 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-80px] left-[-80px] w-[260px] h-[260px] sm:w-[380px] sm:h-[380px] rounded-full bg-purple-800 opacity-15 blur-[110px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] rounded-full bg-indigo-900 opacity-10 blur-[150px] pointer-events-none" />

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
              Create your account
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.28 }}
              className="text-xs sm:text-sm mt-1.5 text-center"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Join Poll Baba — it's free
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
            {/* Full Name */}
            <div
              className="flex items-center rounded-xl transition-all duration-200"
              style={inputStyle("name")}
            >
              <span className="pl-3.5 sm:pl-4 flex-shrink-0" style={{ color: "rgba(168,85,247,0.7)" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4"/>
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
              </span>
              <input
                type="text"
                name="name"
                placeholder="Full name"
                value={formData.name}
                onChange={handleChange}
                onFocus={() => setFocused("name")}
                onBlur={() => setFocused("")}
                className="w-full bg-transparent px-3 py-3 sm:py-3.5 text-sm text-white placeholder-white/30 focus:outline-none min-w-0"
                required
              />
            </div>

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
                placeholder="Create a password"
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
                  Creating account…
                </span>
              ) : (
                "Create account"
              )}
            </motion.button>
          </motion.form>

          {/* Terms */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-[10px] sm:text-[11px] mt-4 leading-relaxed"
            style={{ color: "rgba(255,255,255,0.22)" }}
          >
            By registering you agree to our terms of service
          </motion.p>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="text-center text-xs mt-4"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium transition-colors hover:text-purple-300"
              style={{ color: "rgba(192,132,252,0.9)" }}
            >
              Sign in
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

export default Register;