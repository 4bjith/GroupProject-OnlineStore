import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import authStore from "../AuthStore";
import api from "../api/axiosClient";
import { useQuery } from "@tanstack/react-query";
import {
    MdDashboard, MdAttachMoney, MdPeople, MdStore, MdWeb, MdShoppingBag,
    MdCategory, MdShoppingCart, MdSettings, MdLogout, MdMenu, MdNotifications,
    MdBusiness, MdAccountTree, MdSupervisorAccount
} from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const token = authStore(state => state.token);
    const logout = authStore(state => state.logout);

    //-----------Navigation items with hierarchy-----------
    const menuItems = [
        { name: 'Dashboard', url: "", icon: <MdDashboard size={20} />, section: 'overview' },
        { name: 'Hierarchy', url: "hierarchy", icon: <MdAccountTree size={20} />, section: 'overview' },
        { section: 'merchants', label: 'Merchant Management' },
        { name: 'Merchants', url: "merchants", icon: <MdBusiness size={20} />, section: 'merchants', indent: true },
        { name: 'Stores', url: "stores", icon: <MdStore size={20} />, section: 'merchants', indent: true },
        { section: 'inventory', label: 'Inventory Management' },
        { name: 'Products', url: "products", icon: <MdShoppingBag size={20} />, section: 'inventory', indent: true },
        { name: 'Categories', url: "categories", icon: <MdCategory size={20} />, section: 'inventory', indent: true },
        { section: 'operations', label: 'Operations' },
        { name: 'Orders', url: "orders", icon: <MdShoppingCart size={20} />, section: 'operations', indent: true },
        { name: 'Earnings', url: "earnings", icon: <MdAttachMoney size={20} />, section: 'operations', indent: true },
        { section: 'system', label: 'System' },
        { name: 'Users', url: "users", icon: <MdPeople size={20} />, section: 'system', indent: true },
        { name: 'Templates', url: "templates", icon: <MdWeb size={20} />, section: 'system', indent: true },
        { name: 'Settings', url: "settings", icon: <MdSettings size={20} />, section: 'system', indent: true },
    ];

    //-----------Function to handle logout-----------
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    //-----------Function to fetch User Info ------------
    const { data: user } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const res = await api.get("/getuserdetails", {
                headers: { Authorization: `Bearer ${token}` }
            })
            return res.data
        },
        enabled: !!token
    });

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
            {/* Sidebar */}
            <motion.aside
                initial={{ width: 280 }}
                animate={{ width: isSidebarOpen ? 280 : 80 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 100 }}
                className="bg-slate-900 h-full flex flex-col shadow-2xl z-50 relative overflow-hidden"
            >
                {/* Logo Area */}
                <div className="h-20 flex items-center px-6 border-b border-white/5 bg-slate-950/30">
                    <div className="flex items-center gap-3">
                        <div className="w-24 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20 shrink-0">
                            GEN MISE
                        </div>
                        {isSidebarOpen && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-xl font-bold text-white tracking-tight"
                            >
                                Admin<span className="text-indigo-400">Panel</span>
                            </motion.span>
                        )}
                    </div>
                </div>

                {/* Navigation with Hierarchy Sections */}
                <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                    {menuItems.map((item, idx) => {
                        if (item.section && item.label) {
                            // Section Header
                            return (
                                <div key={idx} className="mt-4 mb-2">
                                    {isSidebarOpen && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="px-3 py-2 text-[10px] font-black text-slate-500 uppercase tracking-widest"
                                        >
                                            {item.label}
                                        </motion.div>
                                    )}
                                </div>
                            );
                        }
                        
                        const isActive = location.pathname === `/adm${item.url ? '/' + item.url : ''}`;
                        return (
                            <Link
                                key={item.name}
                                to={item.url}
                                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative overflow-hidden ${item.indent ? 'ml-4' : ''} ${isActive
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <span className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white transition-colors'}`}>
                                    {item.icon}
                                </span>
                                {isSidebarOpen && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="font-medium text-[13px] tracking-wide"
                                    >
                                        {item.name}
                                    </motion.span>
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* Logout Button */}
                <div className="p-3 border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 ${!isSidebarOpen && 'justify-center'
                            }`}
                    >
                        <MdLogout size={20} />
                        {isSidebarOpen && <span className="font-medium text-[13px]">Sign Out</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Header */}
                <header className="h-20 bg-white border-b border-slate-200/60 flex items-center justify-between px-8 z-40">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                        >
                            <MdMenu size={24} />
                        </button>
                        <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                            {menuItems.find(m => location.pathname === `/adm${m.url ? '/' + m.url : ''}`)?.name || 'Dashboard'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                            <MdNotifications size={22} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
                        </button>

                        <div className="h-8 w-[1px] bg-slate-200"></div>

                        <div className="flex items-center gap-3">
                            <div className="text-right hidden md:block">
                                <div className="text-sm font-bold text-slate-800">{user?.user?.name || "Administrator"}</div>
                                <div className="flex items-center gap-2">
                                    <MdSupervisorAccount size={12} className="text-indigo-600" />
                                    <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Super Admin</div>
                                </div>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 text-sm font-bold border-2 border-white">
                                {user?.user?.name?.charAt(0) || "A"}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto bg-slate-50 p-8 scrollbar-thin scrollbar-thumb-slate-200">
                    <div className="max-w-[1600px] mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
