import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    FiShoppingBag, FiUser, FiSearch, FiFilter, FiCheckCircle, FiXCircle,
    FiAlertCircle, FiDollarSign, FiGlobe, FiMoreVertical, FiChevronRight,
    FiChevronDown, FiBuilding, FiTrendingUp, FiEye, FiSettings, FiActivity
} from "react-icons/fi";
import api from "../api/axiosClient";
import authStore from "../AuthStore";

export default function AdminStores() {
    const navigate = useNavigate();
    const token = authStore(state => state.token);
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMerchant, setSelectedMerchant] = useState("all");
    const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'hierarchy'
    const [expandedMerchants, setExpandedMerchants] = useState({});

    // Fetch Stores
    const { data: stores = [], isLoading, error } = useQuery({
        queryKey: ['admin-stores'],
        queryFn: async () => {
            const res = await api.get("/stores", {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        },
        enabled: !!token
    });

    // Fetch Users to get merchant information
    const { data: usersData } = useQuery({
        queryKey: ['admin-users'],
        queryFn: async () => {
            const res = await api.get("/user/all", {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data?.users || [];
        },
        enabled: !!token
    });

    // Toggle Status Mutation
    const toggleStatusMutation = useMutation({
        mutationFn: async ({ id, status }) => {
            const res = await api.put(`/stores/${id}`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-stores']);
        }
    });

    // Group stores by merchant (tenant)
    const storesByMerchant = useMemo(() => {
        if (!stores.length || !usersData) return {};
        
        const merchants = usersData.filter(user => user.role === 'merchant' || user.role === 'admin');
        
        return merchants.reduce((acc, merchant) => {
            const merchantStores = stores.filter(store => 
                store.ownerId === merchant._id || store.ownerId === merchant.id
            );
            if (merchantStores.length > 0) {
                acc[merchant._id || merchant.id] = {
                    merchant,
                    stores: merchantStores,
                    totalRevenue: merchantStores.reduce((sum, s) => sum + (s.revenue || 0), 0),
                    totalProducts: merchantStores.reduce((sum, s) => sum + (s.productCount || 0), 0)
                };
            }
            return acc;
        }, {});
    }, [stores, usersData]);

    // Derive unique merchants for filtering
    const merchants = useMemo(() => {
        if (!usersData) return [];
        return usersData
            .filter(user => user.role === 'merchant' || user.role === 'admin')
            .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }, [usersData]);

    // Filtering
    const filteredStores = useMemo(() => {
        if (!stores.length) return [];
        return stores.filter(store => {
            const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                store.slug.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesMerchant = selectedMerchant === "all" || store.ownerId === selectedMerchant;
            return matchesSearch && matchesMerchant;
        });
    }, [stores, searchTerm, selectedMerchant]);

    const toggleMerchantExpansion = (merchantId) => {
        setExpandedMerchants(prev => ({
            ...prev,
            [merchantId]: !prev[merchantId]
        }));
    };

    const handleStatusToggle = (store) => {
        const newStatus = store.status === 'active' ? 'inactive' : 'active';
        toggleStatusMutation.mutate({
            id: store._id,
            status: newStatus
        });
    };

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-8 w-8 border-3 border-indigo-600 border-t-transparent rounded-full"
            />
            <p className="text-sm font-bold text-slate-400">Loading stores...</p>
        </div>
    );

    if (error) return (
        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-[12px] flex items-center gap-3">
            <FiAlertCircle size={16} />
            <div className="font-bold">Error loading stores: {error.message}</div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
                <div className="space-y-1">
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <FiBuilding className="text-indigo-600" />
                        Store <span className="text-indigo-600">Management</span>
                    </h1>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Tenant-wise store operations</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* View Mode Toggle */}
                    <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`px-4 py-2 text-[11px] font-bold rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Grid View
                        </button>
                        <button
                            onClick={() => setViewMode('hierarchy')}
                            className={`px-4 py-2 text-[11px] font-bold rounded-lg transition-all ${viewMode === 'hierarchy' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Hierarchy
                        </button>
                    </div>

                    {/* Merchant Filter */}
                    <div className="relative group">
                        <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[12px]" />
                        <select
                            className="pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all appearance-none cursor-pointer"
                            value={selectedMerchant}
                            onChange={(e) => setSelectedMerchant(e.target.value)}
                        >
                            <option value="all">All Merchants</option>
                            {merchants.map(merchant => (
                                <option key={merchant._id} value={merchant._id}>{merchant.name || 'Unknown Merchant'}</option>
                            ))}
                        </select>
                    </div>

                    {/* Search */}
                    <div className="relative group min-w-[260px]">
                        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[13px] group-focus-within:text-indigo-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Find store or slug..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[12px] font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Grid View */}
            {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredStores.map((store, idx) => {
                        const merchant = usersData?.find(u => u._id === store.ownerId || u.id === store.ownerId);
                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.04 }}
                                whileHover={{ scale: 1.02, y: -4 }}
                                key={store._id}
                                className="bg-white border border-slate-100 rounded-[24px] p-5 group hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-200 transition-all relative overflow-hidden"
                            >
                                {/* Status Toggle */}
                                <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
                                    <span className={`text-[10px] font-black uppercase tracking-wider ${store.status === 'active' ? 'text-emerald-600' : 'text-slate-400'}`}>
                                        {store.status === 'active' ? 'Active' : 'Inactive'}
                                    </span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleStatusToggle(store);
                                        }}
                                        className={`w-11 h-6 rounded-full p-1 flex items-center transition-all shadow-md ${store.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'
                                            }`}
                                    >
                                        <motion.div
                                            layout
                                            transition={{ type: "spring", stiffness: 700, damping: 30 }}
                                            className={`w-4 h-4 bg-white rounded-full shadow-md ${store.status === 'active' ? 'ml-auto' : ''
                                                }`}
                                        />
                                    </button>
                                </div>

                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 p-1.5 shrink-0 overflow-hidden shadow-sm group-hover:scale-105 group-hover:border-indigo-200 transition-all">
                                        {store.logo ? (
                                            <img
                                                src={store.logo.startsWith('http') ? store.logo : store.logo.startsWith('/uploads') ? `http://localhost:4000${store.logo}` : store.logo}
                                                alt={store.name}
                                                className="w-full h-full object-cover rounded-xl"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                <FiShoppingBag size={22} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="pt-1">
                                        <h3 className="text-sm font-black text-slate-800 leading-tight mb-1.5 group-hover:text-indigo-600 transition-colors">
                                            {store.name}
                                        </h3>
                                        <a
                                            href={store.domain ? `https://${store.domain}` : `http://localhost:3000/${store.slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="text-[10px] font-bold text-indigo-500 font-mono hover:text-indigo-600 hover:underline transition-colors"
                                        >
                                            {store.domain ? store.domain : `/${store.slug}`}
                                        </a>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {/* Merchant Info */}
                                    <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                                        <div className="flex items-center gap-2">
                                            <FiBuilding size={12} className="text-indigo-600" />
                                            <span className="text-[10px] font-bold text-indigo-700">{merchant?.name || 'Unknown Merchant'}</span>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-slate-50 rounded-xl space-y-3 border border-slate-100">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                                                <FiDollarSign size={12} className="text-emerald-500" />
                                                <span>Commission</span>
                                            </div>
                                            <div className="text-[10px] font-black text-slate-700">
                                                {store.commissionRate}%
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                                                <FiGlobe size={12} className="text-blue-500" />
                                                <span>Custom Domain</span>
                                            </div>
                                            <div className="text-[10px] font-black text-slate-700 truncate max-w-[120px]">
                                                {store.domain || "—"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Hierarchy View */}
            {viewMode === 'hierarchy' && (
                <div className="bg-white rounded-[24px] border border-slate-100 overflow-hidden">
                    {Object.keys(storesByMerchant).length === 0 ? (
                        <div className="py-24 text-center bg-slate-50/30 rounded-[40px] border-2 border-dashed border-slate-200">
                            <FiBuilding size={32} className="mx-auto mb-4 text-slate-300" />
                            <h3 className="text-sm font-black text-slate-800">No merchants with stores</h3>
                            <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Stores will appear grouped by merchant</p>
                        </div>
                    ) : (
                        Object.entries(storesByMerchant).map(([merchantId, data], idx) => (
                            <div key={merchantId}>
                                {/* Merchant Header */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="p-5 border-b border-slate-100 hover:bg-slate-50/50 transition-colors cursor-pointer"
                                    onClick={() => toggleMerchantExpansion(merchantId)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 text-lg font-black shrink-0">
                                            {data.merchant.name?.charAt(0) || 'M'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="text-sm font-black text-slate-800">{data.merchant.name || 'Unknown Merchant'}</h4>
                                                <div className="px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded-md text-[9px] font-black uppercase tracking-wider">
                                                    Merchant
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 text-[11px] text-slate-500">
                                                <span className="font-medium">{data.stores.length} Stores</span>
                                                <span className="font-medium">{data.totalProducts} Products</span>
                                                <span className="font-bold text-emerald-600">${data.totalRevenue.toLocaleString()} Revenue</span>
                                            </div>
                                        </div>
                                        <div className={`p-2 rounded-lg transition-colors ${expandedMerchants[merchantId] ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400'}`}>
                                            {expandedMerchants[merchantId] ? <FiChevronDown size={18} /> : <FiChevronRight size={18} />}
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Expanded Stores */}
                                <AnimatePresence>
                                    {expandedMerchants[merchantId] && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="bg-slate-50/50 border-b border-slate-100"
                                        >
                                            <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {data.stores.map((store) => (
                                                    <div
                                                        key={store._id}
                                                        className="bg-white p-4 rounded-xl border border-slate-200 hover:border-indigo-200 hover:shadow-lg transition-all"
                                                    >
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                                                                {store.logo ? (
                                                                    <img src={store.logo.startsWith('http') ? store.logo : `http://localhost:4000${store.logo}`} className="w-full h-full object-cover" alt="" />
                                                                ) : (
                                                                    <FiShoppingBag className="text-slate-400" size={16} />
                                                                )}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <h5 className="text-sm font-black text-slate-800 truncate">{store.name}</h5>
                                                                <p className="text-[10px] text-slate-400">{store.slug}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <span className={`w-2 h-2 rounded-full ${store.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                                                <span className="text-[10px] font-bold text-slate-600">{store.status}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors">
                                                                    <FiEye size={14} />
                                                                </button>
                                                                <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors">
                                                                    <FiSettings size={14} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))
                    )}
                </div>
            )}

            {filteredStores.length === 0 && viewMode === 'grid' && (
                <div className="py-24 text-center bg-slate-50/30 rounded-[40px] border-2 border-dashed border-slate-200">
                    <FiShoppingBag size={32} className="mx-auto mb-4 text-slate-300" />
                    <h3 className="text-sm font-black text-slate-800">No stores found</h3>
                    <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Try adjusting your filters</p>
                </div>
            )}
        </div>
    );
}
