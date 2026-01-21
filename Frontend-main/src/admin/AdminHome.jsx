import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axiosClient";
import authStore from "../AuthStore";
import { motion } from "framer-motion";
import {
    FiUsers, FiShoppingBag, FiDollarSign, FiActivity, FiArrowUp, FiArrowDown
} from "react-icons/fi";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminHome() {
    const token = authStore(state => state.token);
    const user = authStore(state => state.user); // Assuming user object is in authStore, otherwise fetch it.

    // We need the ownerId. If we are superadmin, we might not have a specific ownerId context unless we are viewing a specific store.
    // However, the dashboard seems to be global for the admin.
    // The previous implementation fetched '/user/all' and '/stores'.
    // The sales controller requires 'ownerId'. If this is a Super Admin dashboard for ALL stores,
    // we might need a new endpoint or pass the admin's ID if they own everything,
    // OR the user wants us to use the aggregation for 'ownerId' which implies this dashboard is for a specific owner.
    // Assuming the logged in user IS the owner/admin.
    const ownerId = user?._id || user?.id; // Fallback

    const { data: userData, isLoading: isLoadingUsers } = useQuery({
        queryKey: ["admin-users"],
        queryFn: async () => (await api.get("/user/all", { headers: { Authorization: `Bearer ${token}` } })).data,
        enabled: !!token
    });

    const { data: storeData, isLoading: isLoadingStores } = useQuery({
        queryKey: ["admin-stores-count"],
        queryFn: async () => (await api.get("/stores")).data,
    });

    // Fetch Dashboard Stats (Requires ownerId)
    // If we are super admin seeing ALL data, this endpoint might need adjustment or we use a different one.
    // For now, I will assume we use the user's ID.
    const { data: dashboardStats, isLoading: isLoadingDashboardStats } = useQuery({
        queryKey: ["dashboard-stats", ownerId],
        queryFn: async () => {
            if (!ownerId) return null;
            const res = await api.get("/dashboard/stats", { params: { ownerId } });
            return res.data.stats;
        },
        enabled: !!ownerId
    });

    const [period, setPeriod] = useState('1year');

    // Fetch Chart Data
    const { data: chartResponse, isLoading: isLoadingChart } = useQuery({
        queryKey: ["sales-chart", ownerId, period],
        queryFn: async () => {
            if (!ownerId) return { chartData: [] };
            const res = await api.get("/sales/chart", { params: { ownerId, period } });
            return res.data;
        },
        enabled: !!ownerId
    });

    // Calculate Stats
    const stats = useMemo(() => {
        const activeCustomers = userData?.users?.filter(u => u.role === "customer").length || 0;
        const totalStores = storeData?.length || 0;

        // Use real stats if available, else fallback or 0
        const realEarnings = dashboardStats?.totalSales || 0;
        const realOrders = dashboardStats?.totalOrders || 0;

        return [
            {
                label: "Total Revenue",
                value: `$${realEarnings.toLocaleString()}`,
                icon: <FiDollarSign size={24} />,
                change: "+12.5%",
                isPositive: true,
                color: "bg-indigo-500"
            },
            {
                label: "Active Customers",
                value: activeCustomers,
                icon: <FiUsers size={24} />,
                change: "+4.3%",
                isPositive: true,
                color: "bg-blue-500"
            },
            {
                label: "Total Stores",
                value: totalStores,
                icon: <FiShoppingBag size={24} />,
                change: "-2.1%",
                isPositive: false,
                color: "bg-emerald-500"
            },
            {
                label: "Total Orders",
                value: realOrders,
                icon: <FiActivity size={24} />,
                change: "+1.2%",
                isPositive: true,
                color: "bg-amber-500"
            },
        ];
    }, [userData, storeData, dashboardStats]);

    // Chart Data Transformation
    const chartData = useMemo(() => {
        return chartResponse?.chartData || [];
    }, [chartResponse]);

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                    Dashboard <span className="text-indigo-600">Overview</span>
                </h1>
                <p className="text-slate-500 font-medium">Welcome back, here's what's happening with your platform today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={stat.label}
                        className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all group"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${stat.color} shadow-indigo-500/20`}>
                                {stat.icon}
                            </div>
                            {/* Placeholder Trend - In real app, calculate diff from previous period */}
                            <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full ${stat.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                {stat.isPositive ? <FiArrowUp /> : <FiArrowDown />}
                                {stat.change}
                            </div>
                        </div>
                        <div>
                            <div className="text-[13px] font-bold text-slate-400 mb-1">{stat.label}</div>
                            <div className="text-3xl font-black text-slate-800 tracking-tight">{stat.value}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">Revenue Analytics</h3>
                            <p className="text-sm text-slate-400 font-medium mt-1">Earnings overview</p>
                        </div>
                        {/* Period selector */}
                        <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
                            {['7days', '30days', '1year'].map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPeriod(p)}
                                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${period === p
                                            ? 'bg-white text-indigo-600 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                >
                                    {p === '7days' ? 'Week' : p === '30days' ? 'Month' : 'Year'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ stroke: '#6366f1', strokeWidth: 2 }}
                                    formatter={(value) => [`$${value}`, "Revenue"]}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right Column / Recent Activity Placeholder */}
                <div className="bg-indigo-900 p-8 rounded-[32px] text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-[80px] opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                    <h3 className="text-xl font-bold mb-6 relative z-10">Quick Actions</h3>

                    <div className="space-y-4 relative z-10">
                        <button className="w-full py-4 px-6 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-between transition-all group border border-white/5">
                            <span className="font-bold text-sm">Create New Template</span>
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FiShoppingBag size={14} />
                            </div>
                        </button>
                        <button className="w-full py-4 px-6 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-between transition-all group border border-white/5">
                            <span className="font-bold text-sm">Review Pending Stores</span>
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FiActivity size={14} />
                            </div>
                        </button>
                        <button className="w-full py-4 px-6 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-between transition-all group border border-white/5">
                            <span className="font-bold text-sm">Manage Users</span>
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FiUsers size={14} />
                            </div>
                        </button>
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/10 relative z-10">
                        <div className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-2">System Status</div>
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                            <span className="font-bold text-sm">All Services Online</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
