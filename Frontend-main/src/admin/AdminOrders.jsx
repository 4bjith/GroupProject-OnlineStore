import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiBox, FiUser, FiCalendar, FiDollarSign, FiSearch, FiFilter,
    FiTruck, FiCheckCircle, FiXCircle, FiClock, FiMoreHorizontal, FiEdit3
} from "react-icons/fi";
import api from "../api/axiosClient";
import authStore from "../AuthStore";

const STATUS_COLORS = {
    "Pending": "bg-amber-50 text-amber-600 border-amber-100",
    "Confirmed": "bg-blue-50 text-blue-600 border-blue-100",
    "Shipped": "bg-indigo-50 text-indigo-600 border-indigo-100",
    "Delivered": "bg-emerald-50 text-emerald-600 border-emerald-100",
    "Cancelled": "bg-rose-50 text-rose-600 border-rose-100"
};

export default function AdminOrders() {
    const token = authStore(state => state.token);
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    // Fetch Orders
    const { data: orderData, isLoading, error } = useQuery({
        queryKey: ['admin-orders'],
        queryFn: async () => {
            const res = await api.get("/orders", {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        },
        enabled: !!token
    });

    const orders = orderData?.orders || [];

    // Update Status Mutation
    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status, paymentStatus }) => {
            const res = await api.put(`/order/${id}`, { status, paymentStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-orders']);
            setIsEditOpen(false);
            setSelectedOrder(null);
        }
    });

    // Filtering
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesSearch = (order._id && order._id.includes(searchTerm)) ||
                (order.userId?.email && order.userId.email.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesStatus = statusFilter === "all" || order.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [orders, searchTerm, statusFilter]);

    const openEdit = (order) => {
        setSelectedOrder(order);
        setIsEditOpen(true);
    };

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full"
            />
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
                <div className="space-y-1">
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        Order <span className="text-indigo-600">Management</span>
                    </h1>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Track & Process Deliveries</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative group">
                        <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[12px]" />
                        <select
                            className="pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all appearance-none cursor-pointer"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    <div className="relative group min-w-[240px]">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[12px] group-focus-within:text-indigo-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Find by Order ID or Email..."
                            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="space-y-3">
                {filteredOrders.map((order, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.02 }}
                        key={order._id}
                        className="bg-white border border-slate-100 rounded-[20px] p-4 hover:shadow-lg hover:shadow-indigo-500/5 transition-all flex flex-col md:flex-row md:items-center gap-4 group"
                    >
                        <div className="flex items-center gap-4 flex-1">
                            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                                <FiBox className="text-slate-400" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[11px] font-black text-slate-800 font-mono">#{order._id.substring(order._id.length - 8)}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${STATUS_COLORS[order.status] || "bg-slate-50 text-slate-500"}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="text-[10px] font-bold text-slate-400 flex items-center gap-2">
                                    <span className="flex items-center gap-1"><FiUser size={10} /> {order.userId?.email || "Unknown User"}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                                    <span className="flex items-center gap-1"><FiCalendar size={10} /> {new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-6 md:w-1/3">
                            <div className="text-right">
                                <div className="text-[13px] font-black text-slate-800">${order.totalAmount}</div>
                                <div className="text-[9px] font-bold text-slate-400">{order.items?.length || 0} Items</div>
                            </div>
                            <button
                                onClick={() => openEdit(order)}
                                className="p-2 bg-slate-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                            >
                                <FiEdit3 size={16} />
                            </button>
                        </div>
                    </motion.div>
                ))}

                {filteredOrders.length === 0 && (
                    <div className="py-20 text-center bg-slate-50/20 rounded-[30px] border-2 border-dashed border-slate-100">
                        <FiBox size={24} className="mx-auto mb-3 text-slate-200" />
                        <h3 className="text-sm font-black text-slate-800">No Orders Found</h3>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {isEditOpen && selectedOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsEditOpen(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-sm bg-white rounded-[32px] shadow-2xl overflow-hidden p-6"
                        >
                            <h2 className="text-lg font-black text-slate-900 mb-6">Update Order Status</h2>

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Status</label>
                                    <select
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all cursor-pointer"
                                        value={selectedOrder.status}
                                        onChange={(e) => updateStatusMutation.mutate({ id: selectedOrder._id, status: e.target.value })}
                                    >
                                        {Object.keys(STATUS_COLORS).map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Status</label>
                                    <select
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all cursor-pointer"
                                        value={selectedOrder.paymentStatus}
                                        onChange={(e) => updateStatusMutation.mutate({ id: selectedOrder._id, paymentStatus: e.target.value })}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Failed">Failed</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsEditOpen(false)}
                                className="w-full mt-6 py-3 bg-slate-900 text-white rounded-xl text-[11px] font-black uppercase tracking-wider hover:bg-black transition-all shadow-xl shadow-slate-900/10"
                            >
                                Done
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
