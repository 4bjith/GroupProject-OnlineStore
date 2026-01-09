import React from 'react';
import { MdTrendingUp, MdTrendingDown, MdAttachMoney, MdShowChart, MdPieChart } from 'react-icons/md';

const Sales = () => {
    return (
        <div className="p-6 md:p-8 space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sales Analytics</h1>
                    <p className="text-slate-500 text-sm mt-1">Deep dive into your sales performance.</p>
                </div>
                <select className="bg-white border border-slate-200 text-slate-700 font-semibold text-sm rounded-lg px-3 py-2 outline-none focus:border-blue-500">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>This Year</option>
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
                        <h2 className="text-3xl font-bold">$124,592</h2>
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
                        <h2 className="text-3xl font-bold text-slate-800">1,452</h2>
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
                        <h2 className="text-3xl font-bold text-slate-800">$85.20</h2>
                        <span className="flex items-center gap-1 text-xs font-bold bg-red-50 px-2 py-1 rounded-full text-red-600">
                            <MdTrendingDown /> -2.1%
                        </span>
                    </div>
                </div>
            </div>

            {/* Visual Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart Area (Dummy) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-6">Revenue Overview</h3>
                    <div className="h-64 flex items-end justify-between gap-2 md:gap-4 px-2">
                        {/* Mock Bars */}
                        {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                            <div key={i} className="w-full bg-slate-100 rounded-t-lg relative group h-full flex flex-col justify-end">
                                <div
                                    style={{ height: `${h}%` }}
                                    className="w-full bg-blue-500/80 rounded-t-lg hover:bg-blue-600 transition-all cursor-pointer relative"
                                >
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                        ${h * 100}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-slate-400 font-semibold uppercase">
                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                        <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-6">Top Selling Items</h3>
                    <div className="space-y-4">
                        {[
                            { name: 'Wireless Headphones', sales: 420, rev: '$12.5k', color: 'bg-blue-500' },
                            { name: 'Smart Watch Series 5', sales: 310, rev: '$9.2k', color: 'bg-indigo-500' },
                            { name: 'Mechanical Keyboard', sales: 250, rev: '$5.8k', color: 'bg-purple-500' },
                            { name: 'Ergonomic Chair', sales: 180, rev: '$4.1k', color: 'bg-orange-500' }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className={`w-2 h-10 ${item.color} rounded-full`}></div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-slate-700 text-sm">{item.name}</h4>
                                    <div className="flex justify-between items-center text-xs text-slate-400 mt-1">
                                        <span>{item.sales} sales</span>
                                        <span className="font-bold text-slate-600">{item.rev}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                                        <div className={`h-full ${item.color}`} style={{ width: `${(item.sales / 500) * 100}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                        View All Products
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sales;
