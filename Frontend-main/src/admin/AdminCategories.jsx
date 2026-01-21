import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiTag, FiPackage, FiPercent, FiCalendar, FiSearch,
    FiX, FiFilter, FiShoppingBag, FiUser, FiInfo, FiChevronRight,
    FiClock, FiCheckCircle, FiAlertCircle
} from "react-icons/fi";
import api from "../api/axiosClient";
import authStore from "../AuthStore";

export default function AdminCategories() {
    const token = authStore(state => state.token);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStore, setSelectedStore] = useState("all");
    const [selectedCat, setSelectedCat] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: adminCategories, isLoading, error } = useQuery({
        queryKey: ['admin-categories'],
        queryFn: async () => {
            const res = await api.get("/admin-categories", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return res.data;
        },
        enabled: !!token
    });

    // Derive unique stores for filtering
    const stores = useMemo(() => {
        if (!adminCategories) return [];
        const uniqueStores = [...new Set(adminCategories.map(cat => cat.store))];
        return uniqueStores.sort();
    }, [adminCategories]);

    const filteredCategories = useMemo(() => {
        if (!adminCategories) return [];
        return adminCategories.filter(cat => {
            const matchesSearch = cat.catname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cat.store.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cat.owner.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStore = selectedStore === "all" || cat.store === selectedStore;
            return matchesSearch && matchesStore;
        });
    }, [adminCategories, searchTerm, selectedStore]);

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
            <FiAlertCircle size={16} />
            <div className="font-bold">Error loading admin categories: {error.message}</div>
        </div>
    );

    const openDetails = (cat) => {
        setSelectedCat(cat);
        setIsModalOpen(true);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
                <div className="space-y-1">
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        Global <span className="text-indigo-600">Categories</span>
                    </h1>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Monitoring all user created sectors</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Store Filter */}
                    <div className="relative group">
                        <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[12px]" />
                        <select
                            className="pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all appearance-none cursor-pointer"
                            value={selectedStore}
                            onChange={(e) => setSelectedStore(e.target.value)}
                        >
                            <option value="all">All Stores</option>
                            {stores.map(store => (
                                <option key={store} value={store}>{store}</option>
                            ))}
                        </select>
                    </div>

                    {/* Search */}
                    <div className="relative group min-w-[240px]">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[12px] group-focus-within:text-indigo-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Find sector, store or owner..."
                            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Admin Grid View - Compact Design */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredCategories.map((cat, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        key={cat._id}
                        className="bg-white border border-slate-100 rounded-[24px] p-4 group hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-100 transition-all relative overflow-hidden flex flex-col"
                    >
                        {/* Status Accents */}
                        <div className="absolute top-0 right-0 p-3">
                            <div className={`w-1.5 h-1.5 rounded-full ${cat.offerCount > 0 ? 'bg-indigo-500 animate-pulse' : 'bg-slate-200'}`} />
                        </div>

                        {/* Category Identity */}
                        <div className="flex items-start gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100 group-hover:border-indigo-100 transition-all shrink-0">
                                {cat.catimage ? (
                                    <img src={cat.catimage.startsWith('http') ? cat.catimage : `http://localhost:3000/${cat.catimage}`} className="w-full h-full object-cover" alt="" />
                                ) : (
                                    <FiTag className="text-slate-300" size={16} />
                                )}
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-[13px] font-black text-slate-800 truncate leading-none mb-1 group-hover:text-indigo-600 transition-colors">{cat.catname}</h3>
                                <div className="flex items-center gap-1.5">
                                    <FiShoppingBag size={10} className="text-slate-400 shrink-0" />
                                    <span className="text-[10px] font-bold text-slate-400 truncate">{cat.store}</span>
                                </div>
                            </div>
                        </div>

                        {/* Details Stack */}
                        <div className="space-y-2 mt-auto">
                            <div className="flex items-center justify-between text-[11px] font-bold bg-slate-50/50 p-2 rounded-xl">
                                <div className="flex items-center gap-1.5 text-slate-500">
                                    <FiUser size={12} className="text-indigo-400" />
                                    <span>Owner</span>
                                </div>
                                <span className="text-slate-800">{cat.owner}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-slate-50/50 p-2 rounded-xl text-center">
                                    <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Products</div>
                                    <div className="flex items-center justify-center gap-1.5 text-[12px] font-black text-slate-800">
                                        <FiPackage size={10} className="text-slate-400" />
                                        {cat.productCount}
                                    </div>
                                </div>
                                <div className="bg-slate-50/50 p-2 rounded-xl text-center">
                                    <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Offers</div>
                                    <div className="flex items-center justify-center gap-1.5 text-[12px] font-black text-indigo-600">
                                        <FiPercent size={10} />
                                        {cat.offerCount}
                                    </div>
                                </div>
                            </div>

                            {/* Action Area */}
                            <button
                                onClick={() => openDetails(cat)}
                                className="w-full py-2 bg-slate-50 group-hover:bg-indigo-600 group-hover:text-white rounded-xl text-[10px] font-black flex items-center justify-center gap-2 transition-all uppercase tracking-widest shadow-sm"
                            >
                                <FiInfo size={12} /> Full Analysis
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Empty State */}
            {filteredCategories.length === 0 && (
                <div className="py-24 text-center bg-slate-50/30 rounded-[40px] border-2 border-dashed border-slate-100">
                    <FiTag size={32} className="mx-auto mb-4 text-slate-200" />
                    <h3 className="text-lg font-black text-slate-800">No category matches</h3>
                    <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Adjust your filters to see results</p>
                </div>
            )}

            {/* Details Modal */}
            <AnimatePresence>
                {isModalOpen && selectedCat && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-[95%] sm:max-w-2xl bg-white rounded-[24px] sm:rounded-[32px] shadow-2xl overflow-hidden p-1 sm:p-2"
                        >
                            <div className="bg-slate-50/50 rounded-[20px] sm:rounded-[26px] overflow-hidden flex flex-col md:flex-row max-h-[80vh] sm:max-h-none overflow-y-auto sm:overflow-visible">
                                {/* Left: Cat & Owner Info */}
                                <div className="md:w-2/5 p-4 sm:p-6 space-y-4 sm:space-y-6">
                                    <div className="flex items-center gap-3 md:block">
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-white p-1 border border-slate-100 shadow-xl overflow-hidden md:mb-4 shrink-0">
                                            {selectedCat.catimage ? (
                                                <img src={selectedCat.catimage.startsWith('http') ? selectedCat.catimage : `http://localhost:3000/${selectedCat.catimage}`} className="w-full h-full object-cover rounded-lg sm:rounded-xl" alt="" />
                                            ) : (
                                                <FiTag className="text-slate-100 w-full h-full p-2 sm:p-3" />
                                            )}
                                        </div>
                                        <div>
                                            <h2 className="text-sm sm:text-lg lg:text-xl font-black text-slate-900 leading-tight mb-0.5 sm:mb-1">{selectedCat.catname}</h2>
                                            <div className="flex items-center gap-2 text-indigo-600 font-black text-[8px] sm:text-[10px] uppercase tracking-widest bg-indigo-50 w-fit px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-indigo-100">
                                                Sector Analysis
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-2 sm:space-y-4">
                                        <InfoBlock
                                            icon={<FiShoppingBag size={10} className="text-indigo-500" />}
                                            label="Associated Store"
                                            value={selectedCat.store}
                                        />
                                        <InfoBlock
                                            icon={<FiUser size={10} className="text-emerald-500" />}
                                            label="Store Administrator"
                                            value={selectedCat.owner}
                                        />
                                        <div className="p-2.5 sm:p-3 bg-white rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm">
                                            <div className="text-[8px] sm:text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                                                <FiPackage size={10} className="text-rose-400" /> Inventory Volume
                                            </div>
                                            <div className="text-[11px] sm:text-[14px] font-black text-slate-800">{selectedCat.productCount} Total Products</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Active Offers */}
                                <div className="md:w-3/5 p-4 sm:p-6 md:border-l border-slate-100 bg-white flex flex-col min-h-0">
                                    <div className="flex items-center justify-between mb-3 sm:mb-4 pb-2 border-b border-slate-50">
                                        <h4 className="text-[9px] sm:text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                                            <FiPercent size={12} className="text-indigo-600" /> Strategic Offers
                                        </h4>
                                        <span className="text-[8px] sm:text-[10px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md border border-indigo-100">
                                            {selectedCat.offerCount} Active
                                        </span>
                                    </div>

                                    <div className="space-y-2 sm:space-y-3 max-h-[180px] sm:max-h-[300px] overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
                                        {selectedCat.offers.map((offer, oidx) => (
                                            <div key={oidx} className="group/offer p-3 sm:p-4 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100 hover:border-indigo-100 transition-all">
                                                <div className="flex items-center justify-between mb-2 sm:mb-3">
                                                    <div className="font-black text-[10px] sm:text-[12px] text-slate-800 group-hover/offer:text-indigo-600 transition-colors truncate pr-2">{offer.title}</div>
                                                    <div className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-emerald-500 text-white rounded-md sm:rounded-lg text-[8px] sm:text-[10px] font-black shadow-lg shadow-emerald-500/20 shrink-0">
                                                        -{offer.discountPercentage}%
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                                    <div className="space-y-0.5 sm:space-y-1">
                                                        <div className="text-[7px] sm:text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                                            <FiCalendar size={8} /> Created
                                                        </div>
                                                        <div className="text-[9px] sm:text-[10px] font-bold text-slate-700">{new Date(offer.createdAt).toLocaleDateString()}</div>
                                                    </div>
                                                    <div className="space-y-0.5 sm:space-y-1">
                                                        <div className="text-[7px] sm:text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                                            <FiClock size={8} /> Expiry
                                                        </div>
                                                        <div className="text-[9px] sm:text-[10px] font-bold text-slate-700">{new Date(offer.endDate).toLocaleDateString()}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {selectedCat.offerCount === 0 && (
                                            <div className="py-8 sm:py-12 text-center text-slate-400">
                                                <FiAlertCircle size={20} className="mx-auto mb-2 opacity-20" />
                                                <div className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest">No Active Promotions</div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4 sm:mt-8 flex justify-end">
                                        <button
                                            onClick={() => setIsModalOpen(false)}
                                            className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-2.5 bg-slate-900 text-white text-[9px] sm:text-[10px] font-black rounded-lg sm:rounded-xl hover:bg-black transition-all shadow-xl shadow-slate-900/10 tracking-[0.2em] uppercase"
                                        >
                                            Dismiss Analysis
                                        </button>
                                    </div>
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
        <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                {icon} {label}
            </div>
            <div className="text-[11px] font-black text-slate-800 truncate" title={value}>{value}</div>
        </div>
    );
}
