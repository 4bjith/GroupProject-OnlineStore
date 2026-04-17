import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiPackage, FiShoppingBag, FiSearch, FiFilter, FiCheckCircle, FiXCircle,
    FiAlertCircle, FiDollarSign, FiTag, FiLayers, FiInfo, FiEdit2, FiX, FiSave, FiEye
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
    const [isEditMode, setIsEditMode] = useState(false);
    const [editForm, setEditForm] = useState({});

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

    // Update Product Mutation
    const updateProductMutation = useMutation({
        mutationFn: async ({ id, data }) => {
            const res = await api.put(`/products/${id}`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-products']);
            setIsEditMode(false);
            setIsModalOpen(false);
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
        setEditForm({
            title: product.title,
            price: product.price,
            stock: product.stock,
            description: product.description,
            category: product.category,
            stockKeepingUnit: product.stockKeepingUnit
        });
        setIsEditMode(false);
        setIsModalOpen(true);
    };

    const handleEditSave = () => {
        updateProductMutation.mutate({
            id: selectedProduct._id,
            data: editForm
        });
    };

    const handleInputChange = (e) => {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value
        });
    };

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-8 w-8 border-3 border-indigo-600 border-t-transparent rounded-full"
            />
            <p className="text-sm font-bold text-slate-400">Loading products...</p>
        </div>
    );

    if (error) return (
        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-[12px] flex items-center gap-3">
            <FiAlertCircle size={16} />
            <div className="font-bold">Error loading products: {error.message}</div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
            {/* Header Section */}
            <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-3xl p-8 border border-slate-100 shadow-xl shadow-indigo-500/5">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <FiPackage className="text-white" size={24} />
                            </div>
                            Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Inventory</span>
                        </h1>
                        <p className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.2em]">Total: {products.length} products across {stores.length} stores</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Store Filter */}
                        <div className="relative group">
                            <FiFilter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[13px] group-focus-within:text-indigo-600 transition-colors" />
                            <select
                                className="pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-[12px] font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all appearance-none cursor-pointer shadow-sm"
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
                        <div className="relative group min-w-[280px]">
                            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[13px] group-focus-within:text-indigo-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Find product, category or store..."
                                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-[12px] font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
                <div className="col-span-full py-24 text-center bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-[40px] border-2 border-dashed border-slate-200">
                    <FiPackage size={48} className="mx-auto mb-4 text-slate-300" />
                    <h3 className="text-lg font-black text-slate-800">No products found</h3>
                    <p className="text-[12px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Try adjusting your filters</p>
                </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ scale: 1.03, y: -6 }}
                        key={product._id}
                        className="bg-white border border-slate-100 rounded-[28px] p-5 group hover:shadow-2xl hover:shadow-indigo-500/15 hover:border-indigo-300 transition-all relative overflow-hidden flex flex-col cursor-pointer"
                        onClick={() => openDetails(product)}
                    >
                        {/* Status Toggle */}
                        <div className="absolute top-4 right-4 z-50" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => handleStatusToggle(product)}
                                className={`w-11 h-6 rounded-full p-0.5 flex items-center transition-all shadow-lg border border-white/20 backdrop-blur-sm ${product.status === 'active' ? 'bg-emerald-500' : 'bg-slate-900/40'
                                    }`}
                                title={product.status === 'active' ? "Deactivate Product" : "Activate Product"}
                            >
                                <motion.div
                                    layout
                                    transition={{ type: "spring", stiffness: 700, damping: 30 }}
                                    className={`w-5 h-5 bg-white rounded-full shadow-md ${product.status === 'active' ? 'ml-auto' : ''
                                        }`}
                                />
                            </button>
                        </div>

                        {/* Product Image */}
                        <div className="aspect-square rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/30 relative overflow-hidden mb-4 border border-slate-100 group-hover:border-indigo-200 transition-all">
                            {product.images && product.images.length > 0 ? (
                                <img
                                    src={product.images[0].startsWith('http') ? product.images[0] : product.images[0].startsWith('/uploads') ? `http://localhost:4000${product.images[0]}` : product.images[0]}
                                    alt={product.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <FiPackage size={32} />
                                </div>
                            )}
                            {/* Price Badge */}
                            <div className="absolute bottom-3 left-3 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 backdrop-blur-md rounded-xl text-[12px] font-black text-white shadow-xl shadow-indigo-500/30">
                                ${product.price}
                            </div>
                            {/* Category Badge */}
                            <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[10px] font-black text-indigo-600 border border-indigo-100 shadow-sm">
                                {product.category}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="space-y-3 flex-1 flex flex-col">
                            <div>
                                <h3 className="text-[15px] font-black text-slate-800 leading-tight mb-2 truncate group-hover:text-indigo-600 transition-colors" title={product.title}>{product.title}</h3>
                                <div className="flex items-center gap-2 text-slate-400">
                                    <FiShoppingBag size={12} className="text-indigo-500" />
                                    <span className="text-[12px] font-bold truncate">{product.storeId?.name || "Unknown Store"}</span>
                                </div>
                            </div>

                            {/* Stock Indicator */}
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                <span className="text-[11px] font-bold text-slate-500">
                                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                </span>
                            </div>

                            <button
                                onClick={(e) => { e.stopPropagation(); openDetails(product); }}
                                className="mt-auto w-full py-3 bg-gradient-to-r from-slate-50 to-indigo-50 group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:text-white rounded-xl text-[11px] font-black flex items-center justify-center gap-2 transition-all uppercase tracking-widest shadow-sm hover:shadow-lg border border-slate-200 group-hover:border-transparent"
                            >
                                <FiInfo size={14} /> View Details
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
                            className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                                        <FiPackage className="text-white" size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-black text-white">Product Details</h2>
                                        <p className="text-[11px] font-bold text-indigo-200 uppercase tracking-widest">
                                            {isEditMode ? 'Edit Mode' : 'View Mode'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setIsEditMode(!isEditMode)}
                                        className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all"
                                        title={isEditMode ? "Switch to View" : "Switch to Edit"}
                                    >
                                        {isEditMode ? <FiEye size={20} /> : <FiEdit2 size={20} />}
                                    </button>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all"
                                    >
                                        <FiX size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                                {/* Product Image */}
                                <div className="flex items-start gap-6">
                                    <div className="w-28 h-28 rounded-2xl bg-slate-50 border border-slate-200 p-2 shrink-0 overflow-hidden shadow-lg">
                                        {selectedProduct.images?.[0] ? (
                                            <img src={selectedProduct.images[0].startsWith('http') ? selectedProduct.images[0] : selectedProduct.images[0].startsWith('/uploads') ? `http://localhost:4000${selectedProduct.images[0]}` : selectedProduct.images[0]} className="w-full h-full object-cover rounded-xl" alt="" />
                                        ) : (
                                            <FiPackage className="w-full h-full p-6 text-slate-300" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        {isEditMode ? (
                                            <input
                                                type="text"
                                                name="title"
                                                value={editForm.title}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all"
                                            />
                                        ) : (
                                            <h3 className="text-xl font-black text-slate-900 leading-tight mb-2">{selectedProduct.title}</h3>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[11px] font-black border border-indigo-100 uppercase tracking-wider">{selectedProduct.category}</span>
                                            <span className={`px-3 py-1 rounded-full text-[11px] font-black border uppercase tracking-wider ${selectedProduct.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                                {selectedProduct.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Product Info Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                            <FiDollarSign size={12} className="text-emerald-500" /> Price
                                        </div>
                                        {isEditMode ? (
                                            <input
                                                type="number"
                                                name="price"
                                                value={editForm.price}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all"
                                            />
                                        ) : (
                                            <div className="text-lg font-black text-slate-800">${selectedProduct.price}</div>
                                        )}
                                    </div>
                                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                            <FiLayers size={12} className="text-blue-500" /> Stock
                                        </div>
                                        {isEditMode ? (
                                            <input
                                                type="number"
                                                name="stock"
                                                value={editForm.stock}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all"
                                            />
                                        ) : (
                                            <div className="text-lg font-black text-slate-800">{selectedProduct.stock}</div>
                                        )}
                                    </div>
                                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                            <FiShoppingBag size={12} className="text-purple-500" /> Store
                                        </div>
                                        <div className="text-sm font-black text-slate-800 truncate" title={selectedProduct.storeId?.name}>{selectedProduct.storeId?.name || "—"}</div>
                                    </div>
                                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                            <FiInfo size={12} className="text-amber-500" /> SKU
                                        </div>
                                        {isEditMode ? (
                                            <input
                                                type="text"
                                                name="stockKeepingUnit"
                                                value={editForm.stockKeepingUnit}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all"
                                            />
                                        ) : (
                                            <div className="text-sm font-black text-slate-800 truncate" title={selectedProduct.stockKeepingUnit}>{selectedProduct.stockKeepingUnit || "—"}</div>
                                        )}
                                    </div>
                                </div>

                                {/* Category */}
                                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                        <FiTag size={12} className="text-indigo-500" /> Category
                                    </div>
                                    {isEditMode ? (
                                        <input
                                            type="text"
                                            name="category"
                                            value={editForm.category}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all"
                                        />
                                    ) : (
                                        <div className="text-sm font-bold text-slate-800">{selectedProduct.category}</div>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                                        <FiInfo size={12} className="text-slate-500" /> Description
                                    </div>
                                    {isEditMode ? (
                                        <textarea
                                            name="description"
                                            value={editForm.description}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all resize-none"
                                        />
                                    ) : (
                                        <p className="text-sm font-medium text-slate-600 leading-relaxed max-h-[120px] overflow-y-auto">
                                            {selectedProduct.description}
                                        </p>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                                    {isEditMode ? (
                                        <>
                                            <button
                                                onClick={handleEditSave}
                                                disabled={updateProductMutation.isPending}
                                                className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-[12px] font-black uppercase tracking-wider hover:from-indigo-700 hover:to-purple-700 transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2"
                                            >
                                                <FiSave size={16} /> {updateProductMutation.isPending ? 'Saving...' : 'Save Changes'}
                                            </button>
                                            <button
                                                onClick={() => setIsEditMode(false)}
                                                className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl text-[12px] font-black uppercase tracking-wider hover:bg-slate-200 transition-all"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => setIsModalOpen(false)}
                                            className="w-full py-3 bg-slate-900 text-white rounded-xl text-[12px] font-black uppercase tracking-wider hover:bg-black transition-all shadow-xl shadow-slate-900/20"
                                        >
                                            Close Details
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

