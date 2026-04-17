import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiShoppingBag, FiUser, FiSearch, FiFilter, FiCheckCircle, FiXCircle,
    FiAlertCircle, FiDollarSign, FiGlobe, FiMoreVertical
} from "react-icons/fi";
import api from "../api/axiosClient";
import authStore from "../AuthStore";

export default function AdminStores() {
    const token = authStore(state => state.token);
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOwner, setSelectedOwner] = useState("all");

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

    // Derive unique owners
    const owners = useMemo(() => {
        if (!stores.length) return [];
        const unique = [...new Set(stores.map(store => store.ownerId))];
        return unique.sort();
    }, [stores]);

    // Filtering
    const filteredStores = useMemo(() => {
        if (!stores.length) return [];
        return stores.filter(store => {
            const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                store.ownerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                store.slug.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesOwner = selectedOwner === "all" || store.ownerId === selectedOwner;
            return matchesSearch && matchesOwner;
        });
    }, [stores, searchTerm, selectedOwner]);

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
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
                <div className="space-y-1">
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        Store <span className="text-indigo-600">Directory</span>
                    </h1>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Total: {stores.length} stores</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Owner Filter */}
                    <div className="relative group">
                        <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[12px]" />
                        <select
                            className="pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all appearance-none cursor-pointer"
                            value={selectedOwner}
                            onChange={(e) => setSelectedOwner(e.target.value)}
                        >
                            <option value="all">All Owners</option>
                            {owners.map(owner => (
                                <option key={owner} value={owner}>Owner: {owner.substring(0, 8)}...</option>
                            ))}
                        </select>
                    </div>

                    {/* Search */}
                    <div className="relative group min-w-[260px]">
                        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[13px] group-focus-within:text-indigo-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Find store, slug or owner..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[12px] font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredStores.map((store, idx) => (
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
                                onClick={() => handleStatusToggle(store)}
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
                                <div className="text-[10px] font-bold text-slate-400 font-mono">
                                    /{store.slug}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="p-4 bg-slate-50 rounded-xl space-y-3 border border-slate-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                                        <FiUser size={12} className="text-indigo-500" />
                                        <span>Owner ID</span>
                                    </div>
                                    <div className="text-[10px] font-black text-slate-700 font-mono" title={store.ownerId}>
                                        {store.ownerId.substring(0, 10)}...
                                    </div>
                                </div>
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
                ))}
            </div>

            {filteredStores.length === 0 && (
                <div className="py-24 text-center bg-slate-50/30 rounded-[40px] border-2 border-dashed border-slate-200">
                    <FiShoppingBag size={32} className="mx-auto mb-4 text-slate-300" />
                    <h3 className="text-sm font-black text-slate-800">No stores found</h3>
                    <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Try adjusting your filters</p>
                </div>
            )}
        </div>
    );
}
