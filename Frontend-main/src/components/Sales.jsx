import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import api from '../api/axiosClient'
import { MdTrendingUp, MdTrendingDown, MdAttachMoney, MdShowChart, MdPieChart, MdClose, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import authStore from '../AuthStore';

const Sales = () => {
    const token = authStore(state => state.token);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [period, setPeriod] = useState('1year');
    const limit = 10;

    // Fetch User Details
    const { data: userData } = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const res = await api.get("/getuserdetails", {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        },
        enabled: !!token,
    });

    const userDetails = userData?.user || {};

    // Fetch Store Sales Data (for KPIs)
    const { data: salesResult } = useQuery({
        queryKey: ["sales", userDetails._id, period],
        queryFn: async () => {
            const res = await api.get(`/sales?ownerId=${userDetails._id}&period=${period}`);
            return res.data;
        },
        enabled: !!userDetails._id,
    });

    // Fetch Monthly Sales Data (for Chart)
    const { data: monthlyResult } = useQuery({
        queryKey: ["monthlySales", userDetails._id, period],
        queryFn: async () => {
            const res = await api.get(`/sales/monthly?ownerId=${userDetails._id}&period=${period}`);
            return res.data;
        },
        enabled: !!userDetails._id,
    });

    // Fetch Top Selling Products (Widget - Top 5)
    const { data: topProductsWidget } = useQuery({
        queryKey: ["topProductsWidget", userDetails._id, period],
        queryFn: async () => {
            const res = await api.get(`/sales/top-products?ownerId=${userDetails._id}&page=1&limit=5&period=${period}`);
            return res.data;
        },
        enabled: !!userDetails._id,
    });

    // Fetch Top Selling Products (Modal - Paginated)
    const { data: topProductsModal, isFetching: isFetchingModal } = useQuery({
        queryKey: ["topProductsModal", userDetails._id, page, limit, period],
        queryFn: async () => {
            const res = await api.get(`/sales/top-products?ownerId=${userDetails._id}&page=${page}&limit=${limit}&period=${period}`);
            return res.data;
        },
        enabled: !!userDetails._id && isModalOpen,
        keepPreviousData: true
    });


    const salesList = salesResult?.salesData || [];
    const monthlySales = monthlyResult?.monthlySales || Array(12).fill(0);
    const maxMonthlySale = Math.max(...monthlySales, 1);

    // Calculate global totals from the list of stores
    const totalRevenue = salesList.reduce((acc, curr) => acc + (curr.totalSales || 0), 0);
    const totalOrders = salesList.reduce((acc, curr) => acc + (curr.orderCount || 0), 0);
    const averageSales = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;

    const topStats = topProductsWidget?.topSellingProducts || [];
    const modalProducts = topProductsModal?.topSellingProducts || [];
    const totalPages = topProductsModal?.totalDocs ? Math.ceil(topProductsModal.totalDocs / limit) : 0;

    const colors = ['bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-orange-500', 'bg-green-500'];

    return (
        <div className="p-6 md:p-8 space-y-8 relative">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sales Analytics</h1>
                    <p className="text-slate-500 text-sm mt-1">Deep dive into your sales performance.</p>
                </div>
                <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="bg-white border border-slate-200 text-slate-700 font-semibold text-sm rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                >
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="1year">This Year</option>
                </select>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
                    <div className="flex items-center gap-3 mb-4 opacity-80">
                        <div className="p-2 bg-white/20 rounded-lg"><MdAttachMoney size={20} /></div>
                        <span className="font-semibold text-sm">Total Revenue</span>
                    </div>
                    <div className="flex items-end justify-between">
                        <h2 className="text-3xl font-bold">${totalRevenue.toLocaleString()}</h2>
                        <span className="flex items-center gap-1 text-xs font-bold bg-white/20 px-2 py-1 rounded-full text-green-300">
                            <MdTrendingUp /> +14.2%
                        </span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4 text-slate-500">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><MdShowChart size={20} /></div>
                        <span className="font-semibold text-sm">Sales Volume</span>
                    </div>
                    <div className="flex items-end justify-between">
                        <h2 className="text-3xl font-bold text-slate-800">{totalOrders}</h2>
                        <span className="flex items-center gap-1 text-xs font-bold bg-green-50 px-2 py-1 rounded-full text-green-600">
                            <MdTrendingUp /> +8.5%
                        </span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4 text-slate-500">
                        <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><MdPieChart size={20} /></div>
                        <span className="font-semibold text-sm">Avg. Order Value</span>
                    </div>
                    <div className="flex items-end justify-between">
                        <h2 className="text-3xl font-bold text-slate-800">${averageSales}</h2>
                        <span className="flex items-center gap-1 text-xs font-bold bg-red-50 px-2 py-1 rounded-full text-red-600">
                            <MdTrendingDown /> -2.1%
                        </span>
                    </div>
                </div>
            </div>

            {/* Visual Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart Area */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-6">Revenue Overview</h3>
                    <div className="h-64 flex items-end justify-between gap-2 md:gap-4 px-2">
                        {monthlySales.map((sales, i) => {
                            const heightPercentage = maxMonthlySale > 0 ? (sales / maxMonthlySale) * 100 : 0;
                            return (
                                <div key={i} className="w-full bg-slate-100 rounded-t-lg relative group h-full flex flex-col justify-end">
                                    <div
                                        style={{ height: `${heightPercentage}%` }}
                                        className="w-full bg-blue-500/80 rounded-t-lg hover:bg-blue-600 transition-all cursor-pointer relative"
                                    >
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                            ${sales.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-slate-400 font-semibold uppercase">
                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                        <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                    </div>
                </div>

                {/* Top Products Widget */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-6">Top Selling Items</h3>
                    <div className="space-y-4">
                        {topStats.length > 0 ? topStats.map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className={`w-2 h-10 ${colors[i % colors.length]} rounded-full`}></div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-slate-700 text-sm truncate w-40" title={item.name}>{item.name || 'Unknown Product'}</h4>
                                    <div className="flex justify-between items-center text-xs text-slate-400 mt-1">
                                        <span>{item.sales} sales</span>
                                        <span className="font-bold text-slate-600">${(item.rev || 0).toLocaleString()}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                                        <div className={`h-full ${colors[i % colors.length]}`} style={{ width: `${Math.min((item.sales / (topStats[0]?.sales || 1)) * 100, 100)}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center text-slate-400 text-sm py-8">No sales data available</div>
                        )}
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full mt-6 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                        View All Products
                    </button>
                </div>
            </div>

            {/* Top Products Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">Top Selling Products</h3>
                                <p className="text-sm text-slate-500 mt-1">Detailed breakdown of your best performing items</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                                <MdClose size={24} />
                            </button>
                        </div>

                        <div className="overflow-auto flex-1 p-6">
                            {isFetchingModal ? (
                                <div className="flex justify-center items-center h-40">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                </div>
                            ) : (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-xs font-bold text-slate-500 uppercase bg-slate-50 border-y border-slate-100">
                                            <th className="px-4 py-3">Product Name</th>
                                            <th className="px-4 py-3 text-right">Price</th>
                                            <th className="px-4 py-3 text-right">Units Sold</th>
                                            <th className="px-4 py-3 text-right">Total Revenue</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
                                        {modalProducts.length > 0 ? modalProducts.map((item, i) => (
                                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-4 py-3 font-medium">
                                                    <div className="flex items-center gap-3">
                                                        {item.image && <img src={item.image} alt={item.name} className="w-8 h-8 rounded object-cover border border-slate-200" />}
                                                        <span>{item.name || 'Unknown Product'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-right text-slate-500">${item.price?.toLocaleString()}</td>
                                                <td className="px-4 py-3 text-right font-semibold">{item.sales}</td>
                                                <td className="px-4 py-3 text-right font-bold text-green-600">${(item.rev || 0).toLocaleString()}</td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="4" className="text-center py-8 text-slate-400">No products found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
                            <span className="text-sm text-slate-500">Page {page} of {totalPages || 1}</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-slate-600"
                                >
                                    <MdChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page >= totalPages}
                                    className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-slate-600"
                                >
                                    <MdChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sales;
