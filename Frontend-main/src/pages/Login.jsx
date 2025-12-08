import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosClient";
import authStore from "../AuthStore";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

function Login() {
  const addToken  = authStore((state)=> state.addToken);
  const EmailRef = useRef("");
  const PasswordRef = useRef("");
  const nav = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const Onsubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/login/user", {
        email: EmailRef.current.value,
        password: PasswordRef.current.value,
      });
      addToken(response.data.token);
      // console.log("logged in:", response.data.token);

      if (response.data.token) {
        alert("Logged in successfully");
        nav("/");
      } else {
        alert("Login failed");
      }
    } catch (error) {
      console.error("login error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#111827] flex items-center justify-center p-6">
      {/* Main Wrapper */}
      <div className="bg-[#1f2937] rounded-xl shadow-lg max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 overflow-hidden">

        {/* LEFT SIDE IMAGE */}
        <div className="bg-[#0f172a] flex items-center justify-center p-10">
          <img
            src="/login-pic.jpg"  /* place image inside public/ folder */
            alt="payment"
            className="rounded-2xl shadow-xl"
          />
        </div>

        {/* RIGHT SIDE LOGIN FORM */}
        <div className="p-10 text-white">
          {/* Logo & Heading */}
          <div className="mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="text-blue-400 text-3xl">💧</span> Shopify
            </h2>
          </div>

          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-gray-400 mb-8">
            Log in to manage your online store and continue growing your business.
          </p>

          {/* FORM */}
          <form onSubmit={Onsubmit} className="space-y-5">

            {/* EMAIL */}
            <div>
              <label className="text-sm text-gray-300">Email Address</label>
              <input
                ref={EmailRef}
                type="email"
                placeholder="Enter your email"
                className="w-full mt-1 px-4 py-3 bg-[#111827] border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm text-gray-300">Password</label>
              <div className="relative">
                <input
                  ref={PasswordRef}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full mt-1 px-4 py-3 bg-[#111827] border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  className="absolute right-3 top-4 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible size={22} />
                  ) : (
                    <AiOutlineEye size={22} />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <p className="text-blue-400 text-sm cursor-pointer hover:underline">
              Forgot Password?
            </p>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-[#0b8b08] hover:bg-[#196e04] py-3 rounded-lg text-center font-semibold"
            >
              Log In
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex h-px bg-gray-600"></div>
              <span className="text-gray-400 text-sm">OR</span>
              <div className="flex h-px bg-gray-600"></div>
            </div>

            {/* Google Button */}
            <button
              type="button"
              className="w-full border border-gray-600 py-3 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-700 transition"
            >
              <FcGoogle size={22} />
              Continue with Google
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-gray-400 text-sm text-center mt-6">
            Don’t have an account?{" "}
            <span
              className="text-blue-400 cursor-pointer hover:underline"
              onClick={() => nav("/register")}
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
