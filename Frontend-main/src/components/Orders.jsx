import React, { useState } from 'react';
import { MdSearch, MdFilterList, MdVisibility, MdMoreVert, MdLocalShipping, MdCheckCircle, MdCancel, MdPending } from 'react-icons/md';

const Orders = () => {
    const [filterStatus, setFilterStatus] = useState('All');

    // Mock Data
    const orders = [
        { id: '#ORD-7752', customer: 'Sarah Connor', date: 'Oct 24, 2025', total: '$450.00', status: 'Pending', items: 3 },
        { id: '#ORD-7751', customer: 'John Wick', date: 'Oct 23, 2025', total: '$1,250.00', status: 'Shipped', items: 1 },
        { id: '#ORD-7750', customer: 'Ellen Ripley', date: 'Oct 22, 2025', total: '$85.50', status: 'Delivered', items: 5 },
        { id: '#ORD-7749', customer: 'Marty McFly', date: 'Oct 21, 2025', total: '$320.00', status: 'Cancelled', items: 2 },
        { id: '#ORD-7748', customer: 'Tony Stark', date: 'Oct 20, 2025', total: '$5,000.00', status: 'Processing', items: 10 },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Processing': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Shipped': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
            case 'Delivered': return 'bg-green-100 text-green-700 border-green-200';
            case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="p-6 md:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Order Management</h1>
                    <p className="text-slate-500 text-sm mt-1">View and update order statuses.</p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-slate-50 transition-colors">
                        <MdFilterList size={18} /> Filter
                    </button>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                        Export Report
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3">
                    <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg"><MdPending size={24} /></div>
                    <div><p className="text-xs text-slate-500 font-bold uppercase">Pending</p><p className="text-lg font-bold text-slate-800">12</p></div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><MdLocalShipping size={24} /></div>
                    <div><p className="text-xs text-slate-500 font-bold uppercase">Processing</p><p className="text-lg font-bold text-slate-800">5</p></div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3">
                    <div className="p-2 bg-green-50 text-green-600 rounded-lg"><MdCheckCircle size={24} /></div>
                    <div><p className="text-xs text-slate-500 font-bold uppercase">Completed</p><p className="text-lg font-bold text-slate-800">1,240</p></div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3">
                    <div className="p-2 bg-red-50 text-red-600 rounded-lg"><MdCancel size={24} /></div>
                    <div><p className="text-xs text-slate-500 font-bold uppercase">Cancelled</p><p className="text-lg font-bold text-slate-800">8</p></div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Search Bar */}
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                    <MdSearch className="text-slate-400 text-xl" />
                    <input
                        type="text"
                        placeholder="Search by Order ID, Customer..."
                        className="bg-transparent outline-none w-full text-sm text-slate-700 placeholder-slate-400 font-medium"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-400">
                            <tr>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Total</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-6 py-4 font-bold text-slate-800">{order.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-slate-700">{order.customer}</span>
                                            <span className="text-xs text-slate-400">{order.items} items</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{order.date}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-slate-800">{order.total}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-blue-500 transition-colors" title="View Details">
                                                <MdVisibility size={18} />
                                            </button>
                                            <button className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors" title="Update Status">
                                                <MdMoreVert size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs font-semibold text-slate-500">
                    <span>Showing 5 of 128 orders</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-slate-200 rounded hover:bg-white transition-colors">Prev</button>
                        <button className="px-3 py-1 border border-slate-200 rounded hover:bg-white transition-colors">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Orders;
