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
        <div className="flex items-center justify-center min-h-[300px]">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-5 w-5 border-2 border-indigo-600 border-t-transparent rounded-full"
            />
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
            "Merchant": "bg-violet-50 text-violet-600 border-violet-100",
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
        <div className="max-w-4xl mx-auto px-3 py-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-0.5">
                    <h1 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                        Users <span className="text-indigo-600 opacity-80">Directory</span>
                    </h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total: {users.length}</p>
                </div>

                <div className="relative group min-w-[200px] sm:min-w-[240px]">
                    <FiSearch size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Quick search..."
                        className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[11px] focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all font-bold placeholder:text-slate-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Hyper-Compact Responsive View */}
            <div className="space-y-2">
                <div className="hidden lg:grid grid-cols-12 gap-2 px-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.1em] opacity-40">
                    <div className="col-span-5">Identity</div>
                    <div className="col-span-2 text-center">Role</div>
                    <div className="col-span-2 text-center">Status</div>
                    <div className="col-span-3 text-right">Activity</div>
                </div>

                <div className="space-y-1.5">
                    {filteredUsers.map((user, idx) => (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.02 }}
                            key={user._id || user.email}
                            onClick={() => handleViewDetails(user)}
                            className="bg-white group cursor-pointer border border-slate-100 rounded-xl p-3 lg:p-2.5 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-500/5 transition-all flex lg:grid lg:grid-cols-12 items-center gap-3 lg:gap-2"
                        >
                            <div className="flex-1 lg:col-span-5 flex items-center gap-3">
                                <div className="shrink-0 relative">
                                    <div className="w-9 h-9 lg:w-8 lg:h-8 rounded-lg bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100 group-hover:border-indigo-100 transition-all">
                                        {user.profilePic ? (
                                            <img src={user.profilePic.startsWith('http') ? user.profilePic : `http://localhost:3000${user.profilePic}`} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <FiUser size={14} className="text-slate-300" />
                                        )}
                                    </div>
                                    <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border-2 border-white ${user.lastLogin ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                </div>
                                <div className="min-w-0">
                                    <div className="text-[12px] font-black text-slate-800 group-hover:text-indigo-600 transition-colors truncate">{user.name}</div>
                                    <div className="text-[9px] font-bold text-slate-400 truncate opacity-80">{user.email}</div>
                                    {/* Mobile Only: Inline Badges */}
                                    <div className="flex lg:hidden items-center gap-1 mt-1">
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
                                    <div className="text-[10px] font-black text-slate-700">{formatDate(user.lastLogin)}</div>
                                </div>
                                <div className="p-1.5 bg-slate-50 text-slate-400 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                    <FiChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filteredUsers.length === 0 && (
                    <div className="py-20 text-center bg-slate-50/20 rounded-[30px] border-2 border-dashed border-slate-100">
                        <FiSearch size={20} className="mx-auto mb-3 text-slate-200" />
                        <h3 className="text-xs font-black text-slate-800">No Matches</h3>
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
                            className="relative w-full max-w-sm bg-white rounded-[24px] shadow-2xl overflow-hidden p-1.5"
                        >
                            <div className="bg-slate-50/50 rounded-[20px] overflow-hidden flex flex-col">
                                {/* Compact Header */}
                                <div className="p-6 pb-4 text-center space-y-4">
                                    <div className="mx-auto w-16 h-16 rounded-[20px] bg-white p-1 border border-slate-100 shadow-xl overflow-hidden relative">
                                        {selectedUser.profilePic ? (
                                            <img src={selectedUser.profilePic.startsWith('http') ? selectedUser.profilePic : `http://localhost:3000${selectedUser.profilePic}`} alt="" className="w-full h-full object-cover rounded-[16px]" />
                                        ) : (
                                            <div className="w-full h-full bg-slate-50 flex items-center justify-center text-indigo-300 text-xl font-black">
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
                                <div className="p-6 pt-0 grid grid-cols-2 gap-2">
                                    <InfoBlock
                                        icon={<FiMail size={10} className="text-indigo-500" />}
                                        label="Email"
                                        value={selectedUser.email}
                                    />
                                    <InfoBlock
                                        icon={<FiPhone size={10} className="text-cyan-500" />}
                                        label="Phone"
                                        value={selectedUser.number}
                                    />
                                    <InfoBlock
                                        icon={<FiBriefcase size={10} className="text-violet-500" />}
                                        label="Sector"
                                        value={selectedUser.businessType}
                                    />
                                    <InfoBlock
                                        icon={<FiMapPin size={10} className="text-rose-500" />}
                                        label="Address"
                                        value={selectedUser.address}
                                    />
                                    <InfoBlock
                                        icon={<FiCalendar size={10} className="text-emerald-500" />}
                                        label="Joined"
                                        value={formatDate(selectedUser.createdAt)}
                                    />
                                    <InfoBlock
                                        icon={<FiClock size={10} className="text-amber-500" />}
                                        label="Active"
                                        value={selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleDateString() : "Never"}
                                    />
                                </div>

                                {/* Slim Footer */}
                                <div className="px-6 py-4 flex items-center justify-between">
                                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Admin Control</span>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-5 py-1.5 bg-slate-900 text-white text-[9px] font-black rounded-lg hover:bg-black transition-all shadow-md"
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
        <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm space-y-1">
            <div className="flex items-center gap-1.5">
                {icon}
                <span className="text-[7px] font-black text-slate-300 uppercase tracking-widest">{label}</span>
            </div>
            <div className="text-[10px] font-bold text-slate-700 truncate" title={value}>{value || "—"}</div>
        </div>
    );
}
