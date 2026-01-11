import React from 'react';
import { Link } from 'react-router-dom';
import {
    MdShoppingCart,
    MdInventory,
    MdCategory,
    MdStore,
    MdAttachMoney,
    MdLocalOffer,
    MdTrendingUp,
    MdPeople
} from 'react-icons/md';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axiosClient';
import authStore from '../AuthStore';

const DashLanding = () => {
    const token = authStore(state => state.token);

    // Fetch User Details first to ensure we have the ownerId
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

    const user = userData?.user;

    // Fetch Dashboard Stats
    const { data: statsData, isLoading } = useQuery({
        queryKey: ['dashboardStats', user?._id],
        queryFn: async () => {
            const res = await api.get(`/dashboard/stats?ownerId=${user?._id}`);
            return res.data;
        },
        enabled: !!user?._id && !!token,
    });

    const stats = [
        {
            label: 'Total Sales',
            value: statsData?.stats?.totalSales ? `$${statsData.stats.totalSales.toLocaleString()}` : '$0',
            icon: <MdAttachMoney size={24} />,
            color: 'bg-green-500',
            trend: ''
        },
        {
            label: 'Total Orders',
            value: statsData?.stats?.totalOrders ? statsData.stats.totalOrders.toLocaleString() : '0',
            icon: <MdShoppingCart size={24} />,
            color: 'bg-blue-500',
            trend: ''
        },
        {
            label: 'Active Products',
            value: statsData?.stats?.activeProducts ? statsData.stats.activeProducts.toLocaleString() : '0',
            icon: <MdInventory size={24} />,
            color: 'bg-purple-500',
            trend: ''
        },
        {
            label: 'Customers',
            value: statsData?.stats?.totalCustomers ? statsData.stats.totalCustomers.toLocaleString() : '0',
            icon: <MdPeople size={24} />,
            color: 'bg-orange-500',
            trend: ''
        },
    ];

    // Navigation cards
    const navItems = [
        { name: 'Products', description: 'Manage your inventory', url: 'products', icon: <MdInventory size={32} />, color: 'text-purple-600', bg: 'bg-purple-50' },
        { name: 'Categories', description: 'Organize your products', url: 'categories', icon: <MdCategory size={32} />, color: 'text-pink-600', bg: 'bg-pink-50' },
        { name: 'Online Stores', description: 'Manage store locations', url: 'stores', icon: <MdStore size={32} />, color: 'text-blue-600', bg: 'bg-blue-50' },
        { name: 'Orders', description: 'Track customer orders', url: 'orders', icon: <MdShoppingCart size={32} />, color: 'text-green-600', bg: 'bg-green-50' },
        { name: 'Sales Only', description: 'View sales analytics', url: 'sales', icon: <MdTrendingUp size={32} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { name: 'Offers', description: 'Manage discounts', url: 'offers', icon: <MdLocalOffer size={32} />, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    ];

    return (
        <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Dashboard Overview</h1>
                <p className="text-slate-500 mt-2">Welcome back! Here's what's happening with your store today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className={`p-4 rounded-xl text-white ${stat.color} shadow-lg shadow-${stat.color.split('-')[1]}-200`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-slate-800">
                                {isLoading ? (
                                    <div className="h-8 w-24 bg-slate-200 animate-pulse rounded"></div>
                                ) : (
                                    stat.value
                                )}
                            </h3>
                            {/* <span className="text-xs font-semibold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">{stat.trend}</span> */}
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions / Navigation Grid */}
            <div>
                <h2 className="text-lg font-bold text-slate-800 mb-4">Quick Navigation</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {navItems.map((item, index) => (
                        <Link
                            to={item.url}
                            key={index}
                            className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 flex items-start gap-4"
                        >
                            <div className={`p-4 rounded-xl ${item.bg} ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                                {item.icon}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{item.name}</h3>
                                <p className="text-slate-500 text-sm mt-1 mb-3">{item.description}</p>
                                <span className={`text-xs font-semibold uppercase tracking-wider ${item.color} flex items-center gap-1`}>
                                    Go to {item.name} <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Activity or Chart Placeholder */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Upgrade your store</h2>
                        <p className="text-slate-300 max-w-md">Unlock premium features, advanced analytics, and unlimited product listings with our Pro plan.</p>
                        <button className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-slate-100 transition-colors shadow-lg">View Plans</button>
                    </div>
                    <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                                <MdTrendingUp size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-300">Revenue Growth</p>
                                <p className="font-bold text-xl">
                                    {/* Placeholder or real growth? For now placeholder */}
                                    +24.5%
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Decorative background circles */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
            </div>
        </div>
    );
};

export default DashLanding;
