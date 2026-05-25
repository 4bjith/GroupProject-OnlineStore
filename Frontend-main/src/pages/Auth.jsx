import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineMail, AiOutlineLock, AiOutlineUser, AiOutlinePhone } from "react-icons/ai";
import { toast } from "react-toastify";
import api from "../api/axiosClient";
import authStore from "../AuthStore";

const Auth = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const addToken = authStore((state) => state.addToken);
    
    const isRegisterPath = location.pathname === "/register";
    const [isLogin, setIsLogin] = useState(!isRegisterPath);
    const [sessionMessage, setSessionMessage] = useState("");
    
    useEffect(() => {
        setIsLogin(location.pathname === "/login");
        
        // Check for session invalidation message
        const message = sessionStorage.getItem('sessionMessage');
        if (message) {
            setSessionMessage(message);
            sessionStorage.removeItem('sessionMessage');
            toast.info(message);
        }
    }, [location.pathname]);

    const toggleAuth = () => {
        const newPath = isLogin ? "/register" : "/login";
        setIsLogin(!isLogin);
        navigate(newPath);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
            {/* Back Link */}
            <button 
                onClick={() => navigate("/")}
                className="absolute top-6 left-6 text-sm font-semibold text-gray-600 hover:text-green-500 transition-colors flex items-center gap-2"
            >
                ← Back to Home
            </button>

            <div className="w-full max-w-md">
                <AnimatePresence mode="wait">
                    {isLogin ? (
                        <motion.div
                            key="login"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <LoginForm onToggle={toggleAuth} addToken={addToken} navigate={navigate} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="register"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <RegisterForm onToggle={toggleAuth} navigate={navigate} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const LoginForm = ({ onToggle, addToken, navigate }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const newErrors = {};
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!formData.email) newErrors.email = "Email is required";
        else if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email format";
        if (!formData.password) newErrors.password = "Password is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const res = await api.post("/login/user", formData);
            const { token, role } = res.data;
            addToken(token, role);
            toast.success("Welcome back!");
            if (role === "admin") navigate("/adm");
            else navigate("/dashboard");
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign In</h1>
                <p className="text-gray-600 text-sm">Welcome back to Gen Mise</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <div className="relative">
                        <AiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => {
                                setFormData({ ...formData, email: e.target.value });
                                if (errors.email) setErrors({ ...errors, email: null });
                            }}
                            placeholder="Enter your email"
                            className={`w-full bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:border-green-400 focus:ring-2 focus:ring-green-100 rounded-lg pl-10 pr-4 py-3 text-sm outline-none transition-all placeholder:text-gray-400 text-gray-900`}
                        />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                    <div className="relative">
                        <AiOutlineLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={(e) => {
                                setFormData({ ...formData, password: e.target.value });
                                if (errors.password) setErrors({ ...errors, password: null });
                            }}
                            placeholder="Enter your password"
                            className={`w-full bg-gray-50 border ${errors.password ? 'border-red-500' : 'border-gray-200'} focus:border-green-400 focus:ring-2 focus:ring-green-100 rounded-lg pl-10 pr-10 py-3 text-sm outline-none transition-all placeholder:text-gray-400 text-gray-900`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-500 transition-colors"
                        >
                            {showPassword ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
                        </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-400 hover:bg-green-500 disabled:opacity-50 text-white font-semibold py-3 rounded-lg text-sm transition-all active:scale-[0.98]"
                >
                    {loading ? "Signing in..." : "Sign In"}
                </button>
            </form>

            <p className="text-gray-600 text-center text-sm mt-6">
                Don't have an account? <button onClick={onToggle} className="text-green-500 font-semibold hover:underline">Create Account</button>
            </p>
        </div>
    );
};

const RegisterForm = ({ onToggle, navigate }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "", email: "", number: "", password: "", confirmPassword: ""
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const newErrors = {};
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/-]).{6,}$/;
        if (!formData.name) newErrors.name = "Full name required";
        if (!formData.email) newErrors.email = "Email required";
        else if (!emailRegex.test(formData.email)) newErrors.email = "Invalid format: name@example.com";
        if (!formData.number) newErrors.number = "Phone required";
        else if (!/^\d{10}$/.test(formData.number)) newErrors.number = "10-digits needed";
        if (!formData.password) newErrors.password = "Password required";
        else if (!passwordRegex.test(formData.password)) newErrors.password = "Must include letter, number, & symbol";
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Mismatch";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            await api.post("/register/user", formData);
            toast.success("Account created successfully!");
            onToggle();
        } catch (error) {
            toast.error(error.response?.data?.message || "Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
                <p className="text-gray-600 text-sm">Join Gen Mise today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                        <div className="relative">
                            <AiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => {
                                    setFormData({ ...formData, name: e.target.value });
                                    if (errors.name) setErrors({ ...errors, name: null });
                                }}
                                placeholder="John Smith"
                                className={`w-full bg-gray-50 border ${errors.name ? 'border-red-500' : 'border-gray-200'} focus:border-green-400 focus:ring-2 focus:ring-green-100 rounded-lg pl-10 pr-4 py-3 text-sm outline-none transition-all placeholder:text-gray-400 text-gray-900`}
                            />
                        </div>
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                        <div className="relative">
                            <AiOutlinePhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={formData.number}
                                onChange={(e) => {
                                    setFormData({ ...formData, number: e.target.value });
                                    if (errors.number) setErrors({ ...errors, number: null });
                                }}
                                placeholder="9876543210"
                                className={`w-full bg-gray-50 border ${errors.number ? 'border-red-500' : 'border-gray-200'} focus:border-green-400 focus:ring-2 focus:ring-green-100 rounded-lg pl-10 pr-4 py-3 text-sm outline-none transition-all placeholder:text-gray-400 text-gray-900`}
                            />
                        </div>
                        {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <div className="relative">
                        <AiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => {
                                setFormData({ ...formData, email: e.target.value });
                                if (errors.email) setErrors({ ...errors, email: null });
                            }}
                            placeholder="name@example.com"
                            className={`w-full bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:border-green-400 focus:ring-2 focus:ring-green-100 rounded-lg pl-10 pr-4 py-3 text-sm outline-none transition-all placeholder:text-gray-400 text-gray-900`}
                        />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                    <div className="relative">
                        <AiOutlineLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={(e) => {
                                setFormData({ ...formData, password: e.target.value });
                                if (errors.password) setErrors({ ...errors, password: null });
                            }}
                            placeholder="Create a password"
                            className={`w-full bg-gray-50 border ${errors.password ? 'border-red-500' : 'border-gray-200'} focus:border-green-400 focus:ring-2 focus:ring-green-100 rounded-lg pl-10 pr-10 py-3 text-sm outline-none transition-all placeholder:text-gray-400 text-gray-900`}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-500 transition-colors">
                            {showPassword ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
                        </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                    <div className="relative">
                        <AiOutlineLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type={showPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={(e) => {
                                setFormData({ ...formData, confirmPassword: e.target.value });
                                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
                            }}
                            placeholder="Confirm your password"
                            className={`w-full bg-gray-50 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'} focus:border-green-400 focus:ring-2 focus:ring-green-100 rounded-lg pl-10 pr-4 py-3 text-sm outline-none transition-all placeholder:text-gray-400 text-gray-900`}
                        />
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-400 hover:bg-green-500 disabled:opacity-50 text-white font-semibold py-3 rounded-lg text-sm transition-all active:scale-[0.98]"
                >
                    {loading ? "Creating account..." : "Create Account"}
                </button>
            </form>

            <p className="text-gray-600 text-center text-sm mt-6">
                Already have an account? <button onClick={onToggle} className="text-green-500 font-semibold hover:underline">Sign In</button>
            </p>
        </div>
    );
};

export default Auth;
