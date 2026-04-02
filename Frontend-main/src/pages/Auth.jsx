import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineMail, AiOutlineLock, AiOutlineUser, AiOutlinePhone } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import api from "../api/axiosClient";
import authStore from "../AuthStore";

const Auth = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const addToken = authStore((state) => state.addToken);
    
    const isRegisterPath = location.pathname === "/register";
    const [isLogin, setIsLogin] = useState(!isRegisterPath);
    
    useEffect(() => {
        setIsLogin(location.pathname === "/login");
    }, [location.pathname]);

    const toggleAuth = () => {
        const newPath = isLogin ? "/register" : "/login";
        setIsLogin(!isLogin);
        navigate(newPath);
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4 selection:bg-green-500/30 overflow-hidden relative font-sans">
            {/* Soft Green background accents */}
            <div className="absolute top-[-10%] left-[-10%] w-[30%] h-[30%] bg-green-400/5 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-green-600/5 blur-[80px] rounded-full pointer-events-none" />

            {/* Back Link */}
            <button 
                onClick={() => navigate("/")}
                className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-green-500 transition-colors"
            >
                ← Home
            </button>

            <div className="w-full max-w-[850px] min-h-[520px] perspective-1000 relative">
                <AnimatePresence mode="wait">
                    {isLogin ? (
                        <motion.div
                            key="login"
                            initial={{ rotateY: 90, opacity: 0 }}
                            animate={{ rotateY: 0, opacity: 1 }}
                            exit={{ rotateY: -90, opacity: 0 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="w-full h-full preserve-3d"
                        >
                            <LoginForm onToggle={toggleAuth} addToken={addToken} navigate={navigate} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="register"
                            initial={{ rotateY: -90, opacity: 0 }}
                            animate={{ rotateY: 0, opacity: 1 }}
                            exit={{ rotateY: 90, opacity: 0 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="w-full h-full preserve-3d"
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
        <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 rounded-[2rem] overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl">
            <div className="hidden md:flex relative bg-black items-center justify-center p-8">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-30" />
                <div className="relative z-10 text-center">
                    <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">DropShipPro</h2>
                    <p className="text-green-500 text-[9px] uppercase font-bold tracking-widest opacity-80">Management Portal</p>
                </div>
            </div>

            <div className="flex flex-col justify-center p-8 md:p-10 text-white">
                <div className="mb-6">
                    <h1 className="text-xl font-bold text-white mb-1 tracking-tight">Sign In</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-gray-500 ml-1">Email</label>
                        <div className="relative group">
                            <AiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-green-400 transition-colors text-sm" />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => {
                                    setFormData({ ...formData, email: e.target.value });
                                    if (errors.email) setErrors({ ...errors, email: null });
                                }}
                                placeholder="e.g. name@email.com"
                                className={`w-full bg-black/40 border ${errors.email ? 'border-red-500/50' : 'border-white/5'} focus:border-green-500/50 rounded-xl px-10 py-2.5 text-[11px] outline-none transition-all placeholder:text-gray-700 text-white`}
                            />
                        </div>
                        {errors.email && <p className="text-[9px] text-red-500 ml-1 mt-1 font-bold">⚠ {errors.email}</p>}
                    </div>

                    <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-gray-500 ml-1">Password</label>
                        <div className="relative group">
                            <AiOutlineLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-green-400 transition-colors text-sm" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={(e) => {
                                    setFormData({ ...formData, password: e.target.value });
                                    if (errors.password) setErrors({ ...errors, password: null });
                                }}
                                placeholder="Enter secure password"
                                className={`w-full bg-black/40 border ${errors.password ? 'border-red-500/50' : 'border-white/5'} focus:border-green-500/50 rounded-xl px-10 py-2.5 text-[11px] outline-none transition-all placeholder:text-gray-700 text-white`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-green-400 transition-colors"
                            >
                                {showPassword ? <AiOutlineEyeInvisible size={16} /> : <AiOutlineEye size={16} />}
                            </button>
                        </div>
                        {errors.password && <p className="text-[9px] text-red-500 ml-1 mt-1 font-bold">⚠ {errors.password}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-50 text-black font-bold py-2.5 rounded-xl text-xs transition-all active:scale-[0.98] mt-2"
                    >
                        {loading ? "..." : "Unlock Access"}
                    </button>
                </form>

                <p className="text-gray-500 text-center text-[9px] mt-8">
                    Need an empire? <button onClick={onToggle} className="text-green-400 font-bold hover:underline">Get Started</button>
                </p>
            </div>
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
            toast.success("Ready! Now sign in.");
            onToggle();
        } catch (error) {
            toast.error(error.response?.data?.message || "Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 rounded-[2rem] overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl">
            <div className="flex flex-col justify-center p-6 md:p-8 text-white">
                <div className="mb-6">
                    <h1 className="text-xl font-bold text-white mb-1">Create Account</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-gray-500 ml-1">Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => {
                                    setFormData({ ...formData, name: e.target.value });
                                    if (errors.name) setErrors({ ...errors, name: null });
                                }}
                                placeholder="Jane Doe"
                                className={`w-full bg-black/40 border ${errors.name ? 'border-red-500/50' : 'border-white/5'} focus:border-green-500/50 rounded-xl px-3 py-2 text-[11px] outline-none transition-all placeholder:text-gray-700 text-white`}
                            />
                            {errors.name ? (
                                <p className="text-[8px] text-red-500 ml-1 font-bold">⚠ {errors.name}</p>
                            ) : !formData.name && (
                                <p className="text-[8px] text-gray-600 ml-1 italic tracking-tight">e.g. John Smith</p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-gray-500 ml-1">Phone</label>
                            <input
                                type="text"
                                value={formData.number}
                                onChange={(e) => {
                                    setFormData({ ...formData, number: e.target.value });
                                    if (errors.number) setErrors({ ...errors, number: null });
                                }}
                                placeholder="9876543210"
                                className={`w-full bg-black/40 border ${errors.number ? 'border-red-500/50' : 'border-white/5'} focus:border-green-500/50 rounded-xl px-3 py-2 text-[11px] outline-none transition-all placeholder:text-gray-700 text-white`}
                            />
                            {errors.number ? (
                                <p className="text-[8px] text-red-500 ml-1 font-bold">⚠ {errors.number}</p>
                            ) : !formData.number && (
                                <p className="text-[8px] text-gray-600 ml-1 italic tracking-tight">10 digits</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-gray-500 ml-1">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => {
                                setFormData({ ...formData, email: e.target.value });
                                if (errors.email) setErrors({ ...errors, email: null });
                            }}
                            placeholder="user@example.com"
                            className={`w-full bg-black/40 border ${errors.email ? 'border-red-500/50' : 'border-white/5'} focus:border-green-500/50 rounded-xl px-4 py-2 text-[11px] outline-none transition-all placeholder:text-gray-700 text-white`}
                        />
                        {errors.email ? (
                            <p className="text-[8px] text-red-500 ml-1 font-bold">⚠ {errors.email}</p>
                        ) : !formData.email && (
                            <p className="text-[8px] text-gray-600 ml-1 italic tracking-tight">e.g. name@domain.com</p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-gray-500 ml-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={(e) => {
                                    setFormData({ ...formData, password: e.target.value });
                                    if (errors.password) setErrors({ ...errors, password: null });
                                }}
                                className={`w-full bg-black/40 border ${errors.password ? 'border-red-500/50' : 'border-white/5'} focus:border-green-500/50 rounded-xl px-4 py-2 text-[11px] outline-none transition-all text-white`}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">
                                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                            </button>
                        </div>
                        {errors.password ? (
                            <p className="text-[8px] text-red-500 ml-1 font-bold">⚠ {errors.password}</p>
                        ) : !formData.password && (
                            <p className="text-[8px] text-gray-600 ml-1 italic tracking-tight">Need: 6+ chars, letter, num & symbol</p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-gray-500 ml-1">Confirm</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={(e) => {
                                setFormData({ ...formData, confirmPassword: e.target.value });
                                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
                            }}
                            className={`w-full bg-black/40 border ${errors.confirmPassword ? 'border-red-500/50' : 'border-white/5'} focus:border-green-500/50 rounded-xl px-4 py-2 text-[11px] outline-none transition-all text-white`}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-50 text-black font-bold py-2.5 rounded-xl text-xs transition-all mt-2"
                    >
                        {loading ? "..." : "Launch Empire"}
                    </button>
                </form>

                <p className="text-gray-500 text-center text-[9px] mt-6">
                    Back to <button onClick={onToggle} className="text-green-400 font-bold underline">Sign In</button>
                </p>
            </div>

            <div className="hidden md:flex relative bg-black items-center justify-center p-8">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-30" />
                <div className="relative z-10 text-center">
                    <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Scale</h2>
                    <p className="text-green-500 text-[9px] uppercase font-bold tracking-widest opacity-80">Global Business</p>
                </div>
            </div>
        </div>
    );
};

export default Auth;
