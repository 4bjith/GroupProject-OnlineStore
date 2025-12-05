import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import api from "../api/axiosClient";

function Register() {
  const navigate = useNavigate();

  const nameRef = useRef("");
  const emailRef = useRef("");
  const numberRef = useRef("");
  const passwordRef = useRef("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/register/user", {
        name: nameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
        number: numberRef.current.value,
      });

      console.log("Registered:", response.data);
      alert("Registration successful!");
      navigate("/Login");
    } catch (error) {
      console.error("Error registering:"|| error.message);
      alert(error.message || "Registration failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#111827] text-white flex justify-center items-center p-6">
      {/* Container */}
      <div className="bg-[#1f2937] rounded-xl shadow-lg max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 overflow-hidden">

        {/* LEFT SIDE */}
        <div className="bg-[#0f172a] p-10 flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-4">
            Start your dropshipping <br /> empire today
          </h1>
          <p className="text-gray-300 mb-8">
            Join over 10,000 store owners who trust our platform to build and scale their online business.
          </p>

          <img
            src="/register-pic.jpg" /* put your image in public folder */
            alt="Payment terminal"
            className="rounded-xl shadow-lg"
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="p-10">
          <h2 className="text-2xl font-bold mb-1">Create your account</h2>
          <p className="text-gray-400 mb-6">Get started for free. No credit card required.</p>

          {/* Google Button */}
          <button className="w-full flex items-center justify-center gap-2 border border-gray-600 py-3 rounded-lg hover:bg-gray-700 transition">
            <FcGoogle size={22} />
            Continue with Google
          </button>

          <div className="flex items-center my-5">
            <div className="flex h-px bg-gray-600" />
            <span className="mx-4 text-gray-400">OR</span>
            <div className="flex h-px bg-gray-600" />
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="text-gray-300 text-sm">Full Name</label>
              <input
                ref={nameRef}
                type="text"
                placeholder="Enter your full name"
                className="w-full mt-1 px-4 py-3 bg-[#111827] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-gray-300 text-sm">Email Address</label>
              <input
                ref={emailRef}
                type="email"
                placeholder="you@example.com"
                className="w-full mt-1 px-4 py-3 bg-[#111827] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-gray-300 text-sm">Mobile Number</label>
              <input
                ref={numberRef}
                type="text"
                placeholder="Enter your number"
                className="w-full mt-1 px-4 py-3 bg-[#111827] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-gray-300 text-sm">Password</label>
              <input
                ref={passwordRef}
                type="password"
                placeholder="Enter your password"
                className="w-full mt-1 px-4 py-3 bg-[#111827] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-start gap-2">
              <input type="checkbox" className="mt-1" />
              <p className="text-gray-400 text-sm">
                I agree to the{" "}
                <span className="text-blue-400">Terms of Service</span> and{" "}
                <span className="text-blue-400">Privacy Policy</span>.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#3b82f6] hover:bg-[#2563eb] transition py-3 rounded-lg font-semibold text-white"
            >
              Create My Account
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}

export default Register;
