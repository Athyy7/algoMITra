import React, { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaUserGraduate,
  FaChalkboardTeacher,
} from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";
import { IoClose } from "react-icons/io5";

// Reusable input field
const FormInput = ({
  id,
  label,
  register, // This will now be the complete register call from useForm
  error,
  type = "text",
  icon,
  showPassword,
  togglePassword,
}) => (
  <div className="relative w-full">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
      {icon}
    </div>
    <input
      id={id}
      type={type === "password" && showPassword ? "text" : type}
      placeholder={label}
      {...register} // Spread the register props here
      className={`w-full py-3 pl-12 pr-10 bg-white/10 border-2 border-slate-300/40 rounded-xl text-slate-800 placeholder-slate-500 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition-all duration-300 ${
        error ? "border-red-500" : ""
      }`}
    />
    {type === "password" && (
      <button
        type="button"
        onClick={togglePassword}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
      >
        {showPassword ? <FiEyeOff /> : <FiEye />}
      </button>
    )}
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-xs text-red-600 font-medium"
        >
          {error.message}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("student");
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 1. Get isAuthenticated from context
  const { register: authRegister, login, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    watch, // Import watch to get password value
    formState: { errors },
    reset,
  } = useForm();

  // Watch the password field to compare for confirmation
  const password = watch("password");

  useEffect(() => {
    setIsLogin(location.pathname === "/login");
    setApiError(null); // Clear errors when switching forms
    reset(); // Reset form fields
  }, [location.pathname, reset]);

  // 2. Add useEffect to redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/profile");
    }
  }, [isAuthenticated, navigate]);

  const toggleForm = () => {
    const newPath = isLogin ? "/register" : "/login";
    navigate(newPath);
    // State update will trigger the useEffect above
  };

  const onSubmit = async (formData) => {
    setIsLoading(true);
    setApiError(null);
    let result;

    if (isLogin) {
      result = await login({
        email: formData.email,
        password: formData.password,
      });
    } else {
      // useForm validation handles the password match, but this is a safe fallback.
      if (formData.password !== formData.confirmPassword) {
        setApiError("Passwords don't match, fam. Try again.");
        setIsLoading(false);
        return;
      }
      result = await authRegister({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role,
      });
    }

    setIsLoading(false);
    if (result && result.success) {
      navigate("/profile"); // Redirect to profile on success
    } else if (result) {
      setApiError(result.message);
    } else {
      setApiError("An unexpected error occurred.");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-slate-50 overflow-hidden pt-24 pb-32 font-[Inter] text-[15px] text-slate-900">
      {/* Gradient blobs */}
      <motion.div
        className="absolute top-[-50px] left-[10%] w-[350px] h-[350px] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60"
        animate={{ y: [0, -30, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-[-60px] right-[15%] w-[300px] h-[300px] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50"
        animate={{ y: [0, 30, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      {/* Close button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-10 right-10 text-slate-500 hover:text-slate-900 text-3xl transition z-20"
      >
        <IoClose />
      </button>

      {/* Auth Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={isLogin ? "login" : "register"}
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -40 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 w-full max-w-md p-8 rounded-3xl border border-white/60 bg-white/70 shadow-2xl backdrop-blur-2xl"
          style={{
            boxShadow:
              "0 20px 60px rgba(0, 0, 0, 0.1), inset 0 1px 4px rgba(255,255,255,0.5)",
          }}
        >
          <h2 className="text-3xl font-bold text-center mb-6 tracking-tight text-slate-900">
            {isLogin ? "Welcome back 👋" : "Join the crew 🚀"}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!isLogin && (
              <>
                <FormInput
                  id="name"
                  label="Full Name"
                  register={register("name", { 
                    required: "Full Name is required" 
                  })}
                  error={errors.name}
                  icon={<FaUser />}
                />

                {/* Role Selector */}
                <div>
                  <label className="block text-sm text-slate-600 mb-2">
                    I am a...
                  </label>
                  <div className="flex gap-3">
                    <motion.button
                      type="button"
                      onClick={() => setRole("student")}
                      whileTap={{ scale: 0.97 }}
                      className={`flex-1 py-3 rounded-xl border text-slate-700 text-sm font-medium transition-all ${
                        role === "student"
                          ? "border-slate-700 bg-white shadow-md"
                          : "border-slate-300 hover:border-slate-500"
                      }`}
                    >
                      <FaUserGraduate className="mx-auto text-xl mb-1 text-slate-600" />
                      Student
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={() => setRole("teacher")}
                      whileTap={{ scale: 0.97 }}
                      className={`flex-1 py-3 rounded-xl border text-slate-700 text-sm font-medium transition-all ${
                        role === "teacher"
                          ? "border-slate-700 bg-white shadow-md"
                          : "border-slate-300 hover:border-slate-500"
                      }`}
                    >
                      <FaChalkboardTeacher className="mx-auto text-xl mb-1 text-slate-600" />
                      Teacher
                    </motion.button>
                  </div>
                </div>
              </>
            )}

            <FormInput
              id="email"
              label="Email"
              type="email"
              register={register("email", { 
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@mitwpu\.edu\.in$/i,
                  message: "Must be a valid @mitwpu.edu.in email"
                }
              })}
              error={errors.email}
              icon={<FaEnvelope />}
            />

            <FormInput
              id="password"
              label="Password"
              type="password"
              register={register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" }
              })}
              error={errors.password}
              icon={<FaLock />}
              showPassword={showPassword}
              togglePassword={() => setShowPassword(!showPassword)}
            />

            {!isLogin && (
              <FormInput
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                register={register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords don't match, fam. Try again."
                })}
                error={errors.confirmPassword}
                icon={<FaLock />}
              />
            )}

            {apiError && (
              <p className="text-sm text-center font-medium text-red-600">{apiError}</p>
            )}

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-3 font-semibold text-white bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <CgSpinner className="animate-spin text-2xl mx-auto" />
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </motion.button>
          </form>

          <p className="mt-6 text-sm text-center text-slate-500">
            {isLogin ? "New here?" : "Already have an account?"}
            <button
              onClick={toggleForm}
              className="ml-1 font-semibold text-slate-700 hover:text-slate-900 transition"
            >
              {isLogin ? "Join now" : "Login instead"}
            </button>
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AuthPage;
