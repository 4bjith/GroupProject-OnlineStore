import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiShield, FiUsers, FiShoppingBag, FiChevronRight, FiChevronDown,
    FiMoreVertical, FiActivity, FiDollarSign, FiPackage, FiEye,
    FiSettings, FiLogOut, FiTrendingUp, FiAlertCircle
} from "react-icons/fi";
import api from "../api/axiosClient";
import authStore from "../AuthStore";

export default function AdminHierarchy() {
    const token = authStore(state => state.token);
    const [expandedMerchants, setExpandedMerchants] = useState({});

    // Fetch all users to identify merchants
    const { data: usersData, isLoading: isLoadingUsers } = useQuery({
        queryKey: ['admin-hierarchy-users'],
        queryFn: async () => {
            const res = await api.get("/user/all", {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data?.users || [];
        },
        enabled: !!token
    });

    // Fetch all stores
    const { data: storesData, isLoading: isLoadingStores } = useQuery({
        queryKey: ['admin-hierarchy-stores'],
        queryFn: async () => {
            const res = await api.get("/stores", {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data || [];
        },
        enabled: !!token
    });

    // Build hierarchy: Super Admin -> Merchants -> Stores
    const hierarchy = useMemo(() => {
        if (!usersData || !storesData) return [];

        const merchants = usersData.filter(user => user.role === 'merchant' || user.role === 'admin');
        
        return merchants.map(merchant => {
            const merchantStores = storesData.filter(store => store.ownerId === merchant._id || store.ownerId === merchant.id);
            return {
                ...merchant,
                stores: merchantStores,
                totalProducts: merchantStores.reduce((acc, store) => acc + (store.productCount || 0), 0),
                totalRevenue: merchantStores.reduce((acc, store) => acc + (store.revenue || 0), 0)
            };
        }).sort((a, b) => b.totalRevenue - a.totalRevenue);
    }, [usersData, storesData]);

    const toggleMerchant = (merchantId) => {
        setExpandedMerchants(prev => ({
            ...prev,
            [merchantId]: !prev[merchantId]
        }));
    };

    if (isLoadingUsers || isLoadingStores) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="h-8 w-8 border-3 border-indigo-600 border-t-transparent rounded-full"
                />
                <p className="text-sm font-bold text-slate-400">Loading hierarchy...</p>
            </div>
        );
    }

    const totalMerchants = hierarchy.length;
    const totalStores = storesData?.length || 0;
    const totalRevenue = hierarchy.reduce((acc, m) => acc + m.totalRevenue, 0);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                    Platform <span className="text-indigo-600">Hierarchy</span>
                </h1>
                <p className="text-slate-500 font-medium">View and manage the complete tenant structure</p>
            </div>

            {/* Hierarchy Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-indigo-600 to-purple-600 p-6 rounded-[24px] text-white shadow-xl shadow-indigo-500/20"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                            <FiShield size={24} />
                        </div>
                        <div>
                            <div className="text-[11px] font-bold text-indigo-200 uppercase tracking-widest">Platform Level</div>
                            <div className="text-xl font-black">Super Admin</div>
                        </div>
                    </div>
                    <div className="text-sm font-medium text-indigo-100">You have full control over the entire platform</div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                            <FiUsers size={24} />
                        </div>
                        <div>
                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Active Merchants</div>
                            <div className="text-xl font-black text-slate-800">{totalMerchants}</div>
                        </div>
                    </div>
                    <div className="text-sm font-medium text-slate-500">Managing {totalStores} stores</div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                            <FiDollarSign size={24} />
                        </div>
                        <div>
                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Total Revenue</div>
                            <div className="text-xl font-black text-slate-800">${totalRevenue.toLocaleString()}</div>
                        </div>
                    </div>
                    <div className="text-sm font-medium text-slate-500">Across all merchants</div>
                </motion.div>
            </div>

            {/* Hierarchy Tree */}
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-black text-slate-800">Tenant Structure</h3>
                            <p className="text-sm text-slate-400 font-medium mt-1">Super Admin → Merchants → Stores</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[11px] font-black uppercase tracking-wider border border-indigo-100">
                                {totalMerchants} Merchants
                            </div>
                            <div className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[11px] font-black uppercase tracking-wider border border-emerald-100">
                                {totalStores} Stores
                            </div>
                        </div>
                    </div>
                </div>

                <div className="divide-y divide-slate-100">
                    {hierarchy.length === 0 ? (
                        <div className="p-12 text-center">
                            <FiAlertCircle size={48} className="mx-auto mb-4 text-slate-300" />
                            <h3 className="text-lg font-black text-slate-800">No merchants found</h3>
                            <p className="text-sm text-slate-400 mt-2">Start by inviting merchants to your platform</p>
                        </div>
                    ) : (
                        hierarchy.map((merchant, idx) => (
                            <div key={merchant._id || merchant.id}>
                                {/* Merchant Row */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="p-6 hover:bg-slate-50/50 transition-colors cursor-pointer"
                                    onClick={() => toggleMerchant(merchant._id || merchant.id)}
                                >
                                    <div className="flex items-center gap-6">
                                        {/* Merchant Avatar */}
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 text-lg font-black shrink-0">
                                            {merchant.name?.charAt(0) || 'M'}
                                        </div>

                                        {/* Merchant Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="text-base font-black text-slate-800 truncate">{merchant.name || 'Unknown Merchant'}</h4>
                                                <div className="px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded-md text-[10px] font-black uppercase tracking-wider">
                                                    Merchant
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm">
                                                <div className="flex items-center gap-1.5 text-slate-500">
                                                    <FiShoppingBag size={14} />
                                                    <span className="font-medium">{merchant.stores.length} Stores</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-slate-500">
                                                    <FiPackage size={14} />
                                                    <span className="font-medium">{merchant.totalProducts} Products</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                                                    <FiDollarSign size={14} />
                                                    <span>${merchant.totalRevenue.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-4 shrink-0">
                                            <div className="text-right hidden sm:block">
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                    <span className="text-sm font-bold text-emerald-600">Active</span>
                                                </div>
                                            </div>
                                            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                                <FiSettings size={18} />
                                            </button>
                                            <div className={`p-2 rounded-lg transition-colors ${expandedMerchants[merchant._id || merchant.id] ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:bg-slate-100'}`}>
                                                {expandedMerchants[merchant._id || merchant.id] ? <FiChevronDown size={18} /> : <FiChevronRight size={18} />}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Expanded Stores */}
                                <AnimatePresence>
                                    {expandedMerchants[merchant._id || merchant.id] && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="bg-slate-50/50 border-t border-slate-100"
                                        >
                                            <div className="p-6 pl-20 space-y-4">
                                                {merchant.stores.length === 0 ? (
                                                    <div className="text-center py-8 text-slate-400">
                                                        <FiShoppingBag size={32} className="mx-auto mb-2 opacity-50" />
                                                        <p className="text-sm font-medium">No stores created yet</p>
                                                    </div>
                                                ) : (
                                                    merchant.stores.map((store) => (
                                                        <div
                                                            key={store._id}
                                                            className="bg-white p-4 rounded-xl border border-slate-200 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 transition-all"
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                                                                    {store.logo ? (
                                                                        <img src={store.logo.startsWith('http') ? store.logo : `http://localhost:4000${store.logo}`} className="w-full h-full object-cover" alt="" />
                                                                    ) : (
                                                                        <FiShoppingBag className="text-slate-400" size={18} />
                                                                    )}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <h5 className="text-sm font-black text-slate-800 truncate">{store.name}</h5>
                                                                    <p className="text-[11px] text-slate-400 font-medium">{store.slug}</p>
                                                                </div>
                                                                <div className="flex items-center gap-3 shrink-0">
                                                                    <div className="text-right">
                                                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Commission</div>
                                                                        <div className="text-sm font-bold text-slate-700">{store.commissionRate}%</div>
                                                                    </div>
                                                                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                                                        <FiEye size={16} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
