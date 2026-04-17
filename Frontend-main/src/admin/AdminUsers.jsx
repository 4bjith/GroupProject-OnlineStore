import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiUser, FiMail, FiPhone, FiMapPin, FiBriefcase,
    FiCalendar, FiClock, FiSearch, FiX, FiShield, FiChevronRight, FiCopy, FiCheck
} from "react-icons/fi";
import api from "../api/axiosClient";
import authStore from "../AuthStore";

export default function AdminUsers() {
    const token = authStore(state => state.token);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [copiedEmail, setCopiedEmail] = useState(false);

    const { data: usersData, isLoading, error } = useQuery({
        queryKey: ['admin-users'],
        queryFn: async () => {
            const res = await api.get("/user/all", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return res.data;
        },
        enabled: !!token
    });

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-8 w-8 border-3 border-indigo-600 border-t-transparent rounded-full"
            />
            <p className="text-sm font-bold text-slate-400">Loading users...</p>
        </div>
    );

    if (error) return (
        <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-[11px] flex items-center gap-2">
            <FiShield size={14} />
            <div className="font-bold">Error: {error.message}</div>
        </div>
    );

    const users = usersData?.users || [];
    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleViewDetails = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
    };

    const StatusBadge = ({ status }) => {
        const colors = {
            "Active": "bg-emerald-50 text-emerald-600 border-emerald-100",
            "Suspended": "bg-rose-50 text-rose-600 border-rose-100",
            "Pending Verification": "bg-amber-50 text-amber-600 border-amber-100"
        };
        return (
            <span className={`px-1.5 py-0.5 rounded-md text-[8px] font-black border tracking-wider ${colors[status] || "bg-gray-50 text-gray-600 border-gray-100"}`}>
                {status?.toUpperCase() || "UNKNOWN"}
            </span>
        );
    };

    const RoleBadge = ({ role }) => {
        const colors = {
            "admin": "bg-indigo-50 text-indigo-600 border-indigo-100",
            "merchant": "bg-violet-50 text-violet-600 border-violet-100",
            "customer": "bg-slate-50 text-slate-600 border-slate-100"
        };
        return (
            <span className={`px-1.5 py-0.5 rounded-md text-[8px] font-black border tracking-wider ${colors[role] || "bg-gray-50 text-gray-600 border-gray-100"}`}>
                {role?.toUpperCase() || "USER"}
            </span>
        );
    };

    const formatDate = (date) => {
        if (!date) return "Never";
        return new Date(date).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="space-y-1">
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        Users <span className="text-indigo-600">Directory</span>
                    </h1>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Total: {users.length} users</p>
                </div>

                <div className="relative group min-w-[240px] sm:min-w-[280px]">
                    <FiSearch size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[12px] focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all font-bold placeholder:text-slate-300 shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Responsive View */}
            <div className="space-y-3">
                <div className="hidden lg:grid grid-cols-12 gap-3 px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] opacity-50">
                    <div className="col-span-5">Identity</div>
                    <div className="col-span-2 text-center">Role</div>
                    <div className="col-span-2 text-center">Status</div>
                    <div className="col-span-3 text-right">Activity</div>
                </div>

                <div className="space-y-2">
                    {filteredUsers.map((user, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.03 }}
                            whileHover={{ scale: 1.01, y: -2 }}
                            key={user._id || user.email}
                            onClick={() => handleViewDetails(user)}
                            className="bg-white group cursor-pointer border border-slate-100 rounded-2xl p-4 lg:p-3 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/10 transition-all flex lg:grid lg:grid-cols-12 items-center gap-4 lg:gap-3"
                        >
                            <div className="flex-1 lg:col-span-5 flex items-center gap-4">
                                <div className="shrink-0 relative">
                                    <div className="w-11 h-11 lg:w-10 lg:h-10 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100 group-hover:border-indigo-200 group-hover:shadow-md transition-all">
                                        {user.profilePic ? (
                                            <img src={user.profilePic.startsWith('http') ? user.profilePic : `http://localhost:3000${user.profilePic}`} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <FiUser size={16} className="text-slate-300" />
                                        )}
                                    </div>
                                    <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${user.lastLogin ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50' : 'bg-slate-300'}`} />
                                </div>
                                <div className="min-w-0">
                                    <div className="text-[13px] font-black text-slate-800 group-hover:text-indigo-600 transition-colors truncate">{user.name}</div>
                                    <div className="text-[10px] font-bold text-slate-400 truncate opacity-80">{user.email}</div>
                                    {/* Mobile Only: Inline Badges */}
                                    <div className="flex lg:hidden items-center gap-1.5 mt-2">
                                        <RoleBadge role={user.role} />
                                        <StatusBadge status={user.accountStatus} />
                                    </div>
                                </div>
                            </div>

                            {/* Desktop Columns */}
                            <div className="hidden lg:flex lg:col-span-2 justify-center">
                                <RoleBadge role={user.role} />
                            </div>

                            <div className="hidden lg:flex lg:col-span-2 justify-center">
                                <StatusBadge status={user.accountStatus} />
                            </div>

                            <div className="lg:col-span-3 flex items-center justify-end gap-3">
                                <div className="text-right hidden sm:block">
                                    <div className="text-[11px] font-black text-slate-700">{formatDate(user.lastLogin)}</div>
                                </div>
                                <div className="p-2 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                    <FiChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filteredUsers.length === 0 && (
                    <div className="py-24 text-center bg-slate-50/30 rounded-[40px] border-2 border-dashed border-slate-200">
                        <FiSearch size={28} className="mx-auto mb-4 text-slate-300" />
                        <h3 className="text-sm font-black text-slate-800">No users found</h3>
                        <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Try adjusting your search</p>
                    </div>
                )}
            </div>

            {/* Compact Responsive Modal */}
            <AnimatePresence>
                {isModalOpen && selectedUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative w-full max-w-md bg-white rounded-[28px] shadow-2xl overflow-hidden p-2"
                        >
                            <div className="bg-slate-50/50 rounded-[24px] overflow-hidden flex flex-col">
                                {/* Compact Header */}
                                <div className="p-7 pb-5 text-center space-y-4">
                                    <div className="mx-auto w-20 h-20 rounded-[24px] bg-white p-1.5 border border-slate-100 shadow-xl overflow-hidden relative">
                                        {selectedUser.profilePic ? (
                                            <img src={selectedUser.profilePic.startsWith('http') ? selectedUser.profilePic : `http://localhost:3000${selectedUser.profilePic}`} alt="" className="w-full h-full object-cover rounded-[20px]" />
                                        ) : (
                                            <div className="w-full h-full bg-slate-50 flex items-center justify-center text-indigo-300 text-2xl font-black">
                                                {selectedUser.name?.[0]?.toUpperCase()}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center justify-center gap-1.5">
                                            <RoleBadge role={selectedUser.role} />
                                            <StatusBadge status={selectedUser.accountStatus} />
                                        </div>
                                        <h3 className="text-base font-black text-slate-900">{selectedUser.name}</h3>
                                        <div className="flex items-center justify-center gap-2">
                                            <span className="text-[10px] font-bold text-slate-400 truncate max-w-[180px]">{selectedUser.email}</span>
                                            <button
                                                onClick={() => copyToClipboard(selectedUser.email)}
                                                className={`p-1 rounded-md transition-all ${copiedEmail ? 'text-emerald-500' : 'text-slate-300 hover:text-indigo-600'}`}
                                            >
                                                {copiedEmail ? <FiCheck size={10} /> : <FiCopy size={10} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Compact Grid */}
                                <div className="p-7 pt-0 grid grid-cols-2 gap-3">
                                    <InfoBlock
                                        icon={<FiMail size={11} className="text-indigo-500" />}
                                        label="Email"
                                        value={selectedUser.email}
                                    />
                                    <InfoBlock
                                        icon={<FiPhone size={11} className="text-cyan-500" />}
                                        label="Phone"
                                        value={selectedUser.number}
                                    />
                                    <InfoBlock
                                        icon={<FiBriefcase size={11} className="text-violet-500" />}
                                        label="Sector"
                                        value={selectedUser.businessType}
                                    />
                                    <InfoBlock
                                        icon={<FiMapPin size={11} className="text-rose-500" />}
                                        label="Address"
                                        value={selectedUser.address}
                                    />
                                    <InfoBlock
                                        icon={<FiCalendar size={11} className="text-emerald-500" />}
                                        label="Joined"
                                        value={formatDate(selectedUser.createdAt)}
                                    />
                                    <InfoBlock
                                        icon={<FiClock size={11} className="text-amber-500" />}
                                        label="Active"
                                        value={selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleDateString() : "Never"}
                                    />
                                </div>

                                {/* Slim Footer */}
                                <div className="px-7 py-5 flex items-center justify-between">
                                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Admin Control</span>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-6 py-2 bg-slate-900 text-white text-[10px] font-black rounded-xl hover:bg-black transition-all shadow-lg shadow-slate-900/20"
                                    >
                                        CLOSE
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function InfoBlock({ icon, label, value }) {
    return (
        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm space-y-1.5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-1.5">
                {icon}
                <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">{label}</span>
            </div>
            <div className="text-[11px] font-bold text-slate-700 truncate" title={value}>{value || "—"}</div>
        </div>
    );
}
