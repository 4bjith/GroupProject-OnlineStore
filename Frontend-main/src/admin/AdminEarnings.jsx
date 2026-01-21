import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
    FiDollarSign, FiTrendingUp, FiShoppingBag, FiCreditCard, FiPieChart, FiActivity
} from "react-icons/fi";
import api from "../api/axiosClient";
import authStore from "../AuthStore";

export default function AdminEarnings() {
    const token = authStore(state => state.token);

    // Fetch All Orders
    const { data: orderData, isLoading, error } = useQuery({
        queryKey: ['admin-earnings-orders'],
        queryFn: async () => {
            const res = await api.get("/orders", {
                headers: { Authorization: `Bearer ${token}` },
                params: { limit: 10000 } // Get all for stats
            });
            return res.data;
        },
        enabled: !!token
    });

    const stats = useMemo(() => {
        if (!orderData?.orders) return { totalSales: 0, earnings: 0, orderCount: 0, completedCount: 0 };

        const orders = orderData.orders;

        // Filter for completed/valid sales (e.g., not cancelled)
        // Assuming "purchase" means payment completed or status delivered. 
        // Using paymentStatus == 'Completed' as primary indicator.
        const completedOrders = orders.filter(
            o => o.paymentStatus === 'Completed' || o.status === 'Delivered'
        );

        const totalSales = completedOrders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
        // 5% Commission Logic
        const earnings = totalSales * 0.05;

        return {
            totalSales,
            earnings,
            orderCount: orders.length,
            completedCount: completedOrders.length
        };
    }, [orderData]);

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full"
            />
        </div>
    );

    if (error) return (
        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-[12px] flex items-center gap-3">
            <FiActivity size={16} />
            <div className="font-bold">Error loading earnings: {error.message}</div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
            <div className="space-y-1">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    Financial <span className="text-indigo-600">Overview</span>
                </h1>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Platform Revenue Analysis</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Total Revenue Card */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-[32px] text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                        <FiPieChart size={120} />
                    </div>
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl">
                                <FiDollarSign size={24} />
                            </div>
                            <div className="text-[11px] font-black uppercase tracking-widest text-indigo-100">Platform Earnings (5%)</div>
                        </div>
                        <div>
                            <div className="text-5xl font-black tracking-tighter mb-1">
                                ${stats.earnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <div className="text-[12px] font-medium text-indigo-200">
                                Start earning from every transaction
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-5 bg-white border border-slate-100 rounded-[24px] flex flex-col justify-between hover:shadow-xl hover:shadow-indigo-500/5 transition-all"
                    >
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                            <FiTrendingUp className="text-emerald-500" /> Gross Volume
                        </div>
                        <div>
                            <div className="text-2xl font-black text-slate-900">
                                ${stats.totalSales.toLocaleString()}
                            </div>
                            <div className="text-[10px] font-bold text-slate-400 mt-1">Total Transaction Value</div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="p-5 bg-white border border-slate-100 rounded-[24px] flex flex-col justify-between hover:shadow-xl hover:shadow-indigo-500/5 transition-all"
                    >
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                            <FiShoppingBag className="text-blue-500" /> Volume
                        </div>
                        <div>
                            <div className="text-2xl font-black text-slate-900">
                                {stats.completedCount}
                            </div>
                            <div className="text-[10px] font-bold text-slate-400 mt-1">Completed Orders</div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="col-span-2 p-5 bg-slate-50 border border-slate-100 rounded-[24px] flex items-center justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm">
                                <FiActivity />
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Efficiency</div>
                                <div className="text-sm font-black text-slate-800">
                                    {stats.orderCount > 0 ? ((stats.completedCount / stats.orderCount) * 100).toFixed(1) : 0}% Completion Rate
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xl font-black text-slate-900">{stats.orderCount}</div>
                            <div className="text-[9px] font-bold text-slate-400 uppercase">Total Orders</div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="p-6 bg-white rounded-[32px] border border-slate-100 text-center">
                <div className="text-[11px] font-black text-slate-300 uppercase tracking-widest mb-2">Revenue Model Noted</div>
                <p className="text-sm font-bold text-slate-600 max-w-md mx-auto">
                    Platform takes a <span className="text-indigo-600">5% commission</span> on all completed transactions. This is calculated automatically based on gross volume.
                </p>
            </div>
        </div>
    );
}
