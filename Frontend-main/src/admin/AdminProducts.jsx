import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiPackage, FiShoppingBag, FiSearch, FiFilter, FiCheckCircle, FiXCircle,
    FiAlertCircle, FiDollarSign, FiTag, FiLayers, FiInfo
} from "react-icons/fi";
import api from "../api/axiosClient";
import authStore from "../AuthStore";

export default function AdminProducts() {
    const token = authStore(state => state.token);
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStore, setSelectedStore] = useState("all");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch Products (Across all stores now)
    const { data: productResponse, isLoading, error } = useQuery({
        queryKey: ['admin-products'],
        queryFn: async () => {
            // Passing empty params to get all. Backend modified to allow this.
            // But wait, the backend modification requires `req.query.storeId` to be absent.
            // If I pass nothing, it works.
            const res = await api.get("/product", {
                headers: { Authorization: `Bearer ${token}` },
                params: { limit: 1000 } // Fetch a good chunk
            });
            return res.data;
        },
        enabled: !!token
    });

    const products = productResponse?.data || [];

    // Toggle Status Mutation
    const toggleStatusMutation = useMutation({
        mutationFn: async ({ id, status }) => {
            const res = await api.put(`/products/${id}`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-products']);
        }
    });

    // Derive unique stores
    const stores = useMemo(() => {
        if (!products.length) return [];
        const unique = [...new Set(products
            .filter(p => p.storeId?.name)
            .map(p => p.storeId.name))
        ];
        return unique.sort();
    }, [products]);

    // Filtering
    const filteredProducts = useMemo(() => {
        if (!products.length) return [];
        return products.filter(product => {
            const storeName = product.storeId?.name || "Unknown";
            const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesStore = selectedStore === "all" || storeName === selectedStore;
            return matchesSearch && matchesStore;
        });
    }, [products, searchTerm, selectedStore]);

    const handleStatusToggle = (product) => {
        const newStatus = product.status === 'active' ? 'inactive' : 'active';
        toggleStatusMutation.mutate({
            id: product._id,
            status: newStatus
        });
    };

    const openDetails = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    }

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
            <div className="font-bold">Error loading products: {error.message}</div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
                <div className="space-y-1">
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        Global <span className="text-indigo-600">Inventory</span>
                    </h1>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Monitoring all listed items</p>
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
                            placeholder="Find product, category or store..."
                            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        key={product._id}
                        className="bg-white border border-slate-100 rounded-[24px] p-3 group hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-100 transition-all relative overflow-hidden flex flex-col"
                    >
                        {/* Status Toggle */}
                        {/* Status Toggle */}
                        <div className="absolute top-3 right-3 z-50" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => handleStatusToggle(product)}
                                // disabled={toggleStatusMutation.isPending}
                                className={`w-8 h-4 rounded-full p-0.5 flex items-center transition-all shadow-sm border border-white/20 backdrop-blur-sm ${product.status === 'active' ? 'bg-emerald-500/90' : 'bg-slate-900/40'
                                    }`}
                                title={product.status === 'active' ? "Deactivate Product" : "Activate Product"}
                            >
                                <motion.div
                                    layout
                                    transition={{ type: "spring", stiffness: 700, damping: 30 }}
                                    className={`w-3 h-3 bg-white rounded-full shadow-sm ${product.status === 'active' ? 'ml-auto' : ''
                                        }`}
                                />
                            </button>
                        </div>

                        <div className="aspect-square rounded-2xl bg-slate-50 relative overflow-hidden mb-3 border border-slate-100">
                            {product.images && product.images.length > 0 ? (
                                <img
                                    src={product.images[0].startsWith('http') ? product.images[0] : `http://localhost:3000${product.images[0]}`}
                                    alt={product.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <FiPackage size={24} />
                                </div>
                            )}
                            <div className="absolute bottom-2 left-2 px-2 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[10px] font-black text-slate-800 border border-slate-100/50 shadow-sm">
                                ${product.price}
                            </div>
                        </div>

                        <div className="space-y-2 flex-1 flex flex-col">
                            <div>
                                <h3 className="text-[13px] font-black text-slate-800 leading-tight mb-1 truncate" title={product.title}>{product.title}</h3>
                                <div className="flex items-center gap-1.5 text-slate-400">
                                    <FiShoppingBag size={10} />
                                    <span className="text-[10px] font-bold truncate">{product.storeId?.name || "Unknown Store"}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => openDetails(product)}
                                className="mt-auto w-full py-2 bg-slate-50 group-hover:bg-indigo-600 group-hover:text-white rounded-xl text-[10px] font-black flex items-center justify-center gap-2 transition-all uppercase tracking-widest"
                            >
                                <FiInfo size={12} /> Details
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Details Modal */}
            <AnimatePresence>
                {isModalOpen && selectedProduct && (
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
                            className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden p-2"
                        >
                            <div className="bg-slate-50/50 rounded-[24px] p-6 space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-20 h-20 rounded-2xl bg-white border border-slate-100 p-1 shrink-0 overflow-hidden shadow-md">
                                        {selectedProduct.images?.[0] ? (
                                            <img src={selectedProduct.images[0].startsWith('http') ? selectedProduct.images[0] : `http://localhost:3000${selectedProduct.images[0]}`} className="w-full h-full object-cover rounded-xl" alt="" />
                                        ) : (
                                            <FiPackage className="w-full h-full p-4 text-slate-200" />
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-slate-900 leading-tight mb-1">{selectedProduct.title}</h2>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black border border-indigo-100 uppercase tracking-wider">{selectedProduct.category}</span>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${selectedProduct.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                                {selectedProduct.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <InfoBlock icon={<FiDollarSign />} label="Price" value={`$${selectedProduct.price}`} />
                                    <InfoBlock icon={<FiLayers />} label="Stock" value={selectedProduct.stock} />
                                    <InfoBlock icon={<FiShoppingBag />} label="Store" value={selectedProduct.storeId?.name} />
                                    <InfoBlock icon={<FiInfo />} label="SKU" value={selectedProduct.stockKeepingUnit || "—"} />
                                </div>

                                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                    <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Description</div>
                                    <p className="text-[12px] font-medium text-slate-600 leading-relaxed max-h-[100px] overflow-y-auto">
                                        {selectedProduct.description}
                                    </p>
                                </div>

                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-full py-3 bg-slate-900 text-white rounded-xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-slate-900/10"
                                >
                                    Close Details
                                </button>
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
        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">
                {icon} {label}
            </div>
            <div className="text-[13px] font-black text-slate-800 truncate" title={value}>{value}</div>
        </div>
    );
}
