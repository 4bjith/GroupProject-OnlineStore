import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
    FiUser, FiMail, FiPhone, FiMapPin, FiCamera,
    FiLogOut, FiFileText, FiMessageSquare, FiLayout,
    FiShield, FiSettings, FiEye, FiCreditCard, FiUsers,
    FiRefreshCw, FiChevronRight, FiCheck
} from "react-icons/fi";
import api from "../api/axiosClient";
import authStore from "../AuthStore";
import { useNavigate } from "react-router-dom";

export default function AdminSettings() {
    const token = authStore(state => state.token);
    const logout = authStore(state => state.logout);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [currentTime, setCurrentTime] = useState(new Date());

    // Form states
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        number: "",
        address: "",
        businessType: "",
        businessDescription: ""
    });

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Fetch Admin Details
    const { data: adminData, isLoading: isAdminLoading } = useQuery({
        queryKey: ['admin-details'],
        queryFn: async () => {
            const res = await api.get("/getuserdetails", {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data?.user;
        },
        enabled: !!token
    });

    // Fetch Total Users for "Connected Users"
    const { data: usersData } = useQuery({
        queryKey: ['admin-users-count'],
        queryFn: async () => {
            const res = await api.get("/user/all", {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data?.users;
        },
        enabled: !!token
    });

    useEffect(() => {
        if (adminData) {
            setFormData({
                name: adminData.name || "",
                email: adminData.email || "",
                number: adminData.number || "",
                address: adminData.address || "",
                businessType: adminData.businessType || "",
                businessDescription: adminData.businessDescription || ""
            });
        }
    }, [adminData]);

    const updateProfileMutation = useMutation({
        mutationFn: async (updatedData) => {
            return await api.put("/updateuserdetails", updatedData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-details']);
            alert("Information updated successfully!");
        }
    });

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateProfileMutation.mutate(formData);
    };

    if (isAdminLoading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full"
            />
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 bg-slate-50/30 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-0.5">
                    <h1 className="text-xl font-black text-slate-900 tracking-tight">Settings</h1>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <FiRefreshCw className="animate-spin-slow" /> Data last synced: Just now
                    </div>
                </div>
                <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm">
                    <div className="text-[11px] font-black text-slate-800 uppercase tracking-wider">
                        {currentTime.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        <span className="text-indigo-600 ml-2">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left Sidebar Layout */}
                <div className="lg:col-span-4 space-y-6">
                    {/* User Profile Card */}
                    <div className="bg-white rounded-[24px] border border-slate-100 p-6 text-center space-y-4 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600 opacity-20" />

                        <div className="relative inline-block group">
                            <div className="w-24 h-24 rounded-[30px] bg-slate-50 p-1 border border-slate-100 overflow-hidden shadow-xl ring-4 ring-slate-50/50">
                                {adminData?.profilePic ? (
                                    <img src={`http://localhost:3000${adminData.profilePic}`} className="w-full h-full object-cover rounded-[24px]" alt="" />
                                ) : (
                                    <div className="w-full h-full bg-indigo-50 flex items-center justify-center text-indigo-300 text-3xl font-black">
                                        {adminData?.name?.[0]?.toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <button className="absolute -bottom-1 -right-1 p-2 bg-emerald-500 text-white rounded-xl shadow-lg hover:scale-110 transition-transform border-4 border-white">
                                <FiCamera size={14} />
                            </button>
                        </div>

                        <div className="space-y-1">
                            <h2 className="text-lg font-black text-slate-900 tracking-tight">{adminData?.name}</h2>
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-rose-50 text-rose-500 text-[9px] font-black uppercase tracking-widest border border-rose-100">
                                Global Administrator
                            </div>
                            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest pt-2">
                                Last sync: {adminData?.lastLogin ? new Date(adminData.lastLogin).toLocaleDateString() : 'Today'}
                            </p>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
                        >
                            <FiLogOut size={14} /> Log Out Account
                        </button>
                    </div>

                    {/* Stats & Notifications Card */}
                    <div className="bg-white rounded-[24px] border border-slate-100 p-6 space-y-4 shadow-sm">
                        <button className="w-full flex items-center justify-between p-3 bg-slate-50/50 rounded-xl hover:bg-slate-50 transition-colors group">
                            <div className="flex items-center gap-3">
                                <FiFileText className="text-rose-500" />
                                <span className="text-[11px] font-extrabold text-slate-700 tracking-wide uppercase">Admin Reports</span>
                            </div>
                            <span className="bg-rose-100 text-rose-600 px-2 py-0.5 rounded-md text-[10px] font-black">2</span>
                        </button>
                        <button className="w-full flex items-center justify-between p-3 bg-slate-50/50 rounded-xl hover:bg-slate-50 transition-colors group">
                            <div className="flex items-center gap-3">
                                <FiMessageSquare className="text-emerald-500" />
                                <span className="text-[11px] font-extrabold text-slate-700 tracking-wide uppercase">System Feedbacks</span>
                            </div>
                            <span className="bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-md text-[10px] font-black">7</span>
                        </button>
                    </div>

                    {/* Contact Snippet Card */}
                    <div className="bg-white rounded-[24px] border border-slate-100 p-6 space-y-4 shadow-sm">
                        <SidebarItem icon={<FiMail className="text-indigo-400" />} label={adminData?.email} />
                        <SidebarItem icon={<FiMapPin className="text-rose-400" />} label={adminData?.address || "Location not set"} />
                        <SidebarItem icon={<FiPhone className="text-emerald-400" />} label={adminData?.number} />
                        <SidebarItem icon={<FiShield className="text-amber-400" />} label="Security clearance: Lvl 4" />
                    </div>
                </div>

                {/* Right Main Content area */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Profile Details Form */}
                    <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
                            <h3 className="text-base font-black text-slate-900 tracking-tight uppercase">Identity Configuration</h3>
                            <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Global Profile</div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField
                                    label="Administrative Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter full name"
                                />
                                <InputField
                                    label="Account Email"
                                    name="email"
                                    value={formData.email}
                                    disabled={true} // Email usually read-only
                                    placeholder="admin@system.com"
                                />
                                <InputField
                                    label="Phone Number"
                                    name="number"
                                    value={formData.number}
                                    onChange={handleInputChange}
                                    placeholder="+1 234 567 890"
                                />
                                <InputField
                                    label="Administrative Sector"
                                    name="businessType"
                                    value={formData.businessType}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Retail, Management"
                                />
                            </div>

                            <InputField
                                label="Global Address Path"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Enter full address details"
                            />

                            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <button type="button" className="text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-2">
                                    <FiShield /> Reset Administrative Password
                                </button>
                                <button
                                    type="submit"
                                    disabled={updateProfileMutation.isPending}
                                    className="px-8 py-3 bg-emerald-500 text-white rounded-xl text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all flex items-center gap-2"
                                >
                                    {updateProfileMutation.isPending ? "Updating..." : "Synchronize Information"}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Admin Panel Tools */}
                    <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
                        <div className="mb-8">
                            <h3 className="text-base font-black text-slate-900 tracking-tight uppercase">Administrative Toolbox</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Core system controls</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <ToolItem
                                icon={<FiUsers className="text-indigo-600" />}
                                label="Connected Users"
                                count={usersData?.length || 0}
                            />
                            <ToolItem
                                icon={<FiCreditCard className="text-emerald-500" />}
                                label="Payment Methods"
                            />
                            <ToolItem
                                icon={<FiLayout className="text-rose-500" />}
                                label="Appearance Settings"
                            />
                            <ToolItem
                                icon={<FiShield className="text-amber-500" />}
                                label="Security Audit"
                            />
                            <ToolItem
                                icon={<FiSettings className="text-slate-500" />}
                                label="Core Config"
                            />
                            <ToolItem
                                icon={<FiEye className="text-indigo-400" />}
                                label="Global View Mode"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SidebarItem({ icon, label }) {
    return (
        <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-50 rounded-lg shrink-0">
                {icon}
            </div>
            <span className="text-[10px] font-bold text-slate-600 truncate">{label || "Not Provided"}</span>
        </div>
    );
}

function InputField({ label, name, value, onChange, placeholder, disabled = false }) {
    return (
        <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] ml-1">{label}</label>
            <div className="relative group">
                <input
                    type="text"
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    placeholder={placeholder}
                    className={`w-full bg-slate-50/50 border border-slate-100 rounded-xl px-4 py-2 text-[11px] font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600/50 transition-all ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-100' : ''}`}
                />
            </div>
        </div>
    );
}

function ToolItem({ icon, label, count }) {
    return (
        <button className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-[20px] hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 border border-transparent hover:border-slate-100 transition-all group group-hover:scale-[1.02]">
            <div className="p-3 bg-white rounded-xl shadow-sm text-lg transition-transform group-hover:scale-110">
                {icon}
            </div>
            <div className="text-left">
                <div className="text-[11px] font-black text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors uppercase leading-none mb-1">{label}</div>
                {count !== undefined && (
                    <div className="text-[10px] font-bold text-indigo-400 bg-indigo-50 px-2 py-0.5 rounded-full w-fit">
                        {count} Managed
                    </div>
                )}
            </div>
        </button>
    );
}
