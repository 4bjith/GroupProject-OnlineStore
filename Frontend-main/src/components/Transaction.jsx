import React, { useState } from 'react';
import {
    FiSearch,
    FiFilter,
    FiMoreHorizontal,
    FiDownload,
    FiChevronDown,
} from 'react-icons/fi';
import { LuLayoutGrid, LuCircleDollarSign } from "react-icons/lu";

const Transaction = () => {
    // Empty array as per user request (no default entries in DB)
    const [transactions, setTransactions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Status badge styles for later use
    const statusStyles = {
        Completed: "bg-[#f0f9f1] text-[#2d7a43] border border-[#dcfce7]",
        Cancelled: "bg-[#fff7ed] text-[#c2410c] border border-[#ffedd5]",
        Pending: "bg-[#eff6ff] text-[#1d4ed8] border border-[#dbeafe]",
    };

    return (
        <div className="p-4 bg-[#fbfcff] min-h-screen font-sans selection:bg-black selection:text-white">
            {/* Header Section - Forced into one row */}
            <div className="flex flex-row items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-white rounded-xl border border-gray-100 shadow-sm">
                        <LuCircleDollarSign className="text-xl text-gray-800" />
                    </div>
                    <h1 className="text-xl font-bold text-[#111827] tracking-tight hidden sm:block">Recent Transaction</h1>
                </div>

                <div className="flex items-center gap-2 flex-grow justify-end">
                    {/* Search Box - More compact */}
                    <div className="relative group max-w-[200px] flex-grow">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                            <FiSearch className="text-gray-400 text-sm group-focus-within:text-black" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-100 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-200 transition-all shadow-sm placeholder:text-gray-400 font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Category Dropdown - More compact */}
                    <button className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-full text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
                        Category <FiChevronDown className="text-gray-400" />
                    </button>

                    {/* Action Buttons - Scaled down */}
                    <div className="flex items-center gap-1.5 border-l border-gray-100 pl-3 ml-1">
                        <button title="Filter" className="w-8 h-8 flex items-center justify-center bg-white border border-gray-100 rounded-full text-gray-500 hover:bg-gray-50 transition-all active:scale-90">
                            <FiFilter className="text-sm" />
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-[#111827] text-white rounded-full text-xs font-bold hover:bg-black transition-all shadow-sm active:scale-95">
                            <FiDownload className="text-sm" /> <span className="hidden sm:inline">Export</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Table Section - Optimized for width without horizontal scrolling */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
                <div className="w-full">
                    <table className="w-full text-left border-collapse table-auto text-xs">
                        <thead>
                            <tr className="border-b border-gray-50 bg-[#fafbfc]/50">
                                <th className="pl-4 pr-2 py-4 w-10 text-center">
                                    <input type="checkbox" className="w-4 h-4 rounded border-gray-200 text-black cursor-pointer accent-black" />
                                </th>
                                <th className="px-2 py-4 font-bold text-gray-400 uppercase tracking-wider">ID</th>
                                <th className="px-2 py-4 font-bold text-gray-400 uppercase tracking-wider">Product</th>
                                <th className="px-2 py-4 font-bold text-gray-400 uppercase tracking-wider">Store</th>
                                <th className="px-2 py-4 font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Date</th>
                                <th className="px-2 py-4 font-bold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Customer</th>
                                <th className="px-2 py-4 font-bold text-gray-400 uppercase tracking-wider">Price</th>
                                <th className="pr-4 pl-2 py-4 font-bold text-gray-400 uppercase tracking-wider text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-24 text-center bg-white">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <div className="w-14 h-14 bg-[#f8fafc] rounded-2xl flex items-center justify-center border border-gray-50">
                                                <LuLayoutGrid className="text-2xl text-gray-200" />
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="text-sm font-bold text-gray-800">No Transactions found</h3>
                                                <p className="text-[11px] text-gray-400 font-medium leading-relaxed">Orders will appear here automatically.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((tx) => (
                                    <tr key={tx.id} className="group hover:bg-[#fcfdfe] transition-all cursor-pointer">
                                        <td className="pl-4 pr-2 py-3 text-center">
                                            <input type="checkbox" className="w-4 h-4 rounded border-gray-200 text-black cursor-pointer accent-black" />
                                        </td>
                                        <td className="px-2 py-3 font-semibold text-gray-900">{tx.orderId}</td>
                                        <td className="px-2 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-md bg-gray-50 border border-gray-100 flex-shrink-0 hidden sm:block" />
                                                <p className="font-bold text-gray-900 truncate max-w-[80px] sm:max-w-[120px]">{tx.productName}</p>
                                            </div>
                                        </td>
                                        <td className="px-2 py-3 font-medium text-gray-500 italic truncate max-w-[60px] sm:max-w-[100px]">{tx.storeName}</td>
                                        <td className="px-2 py-3 text-gray-400 hidden md:table-cell whitespace-nowrap">{tx.dateTime}</td>
                                        <td className="px-2 py-3 hidden lg:table-cell truncate max-w-[100px]">
                                            <p className="font-bold text-gray-700">{tx.customer}</p>
                                        </td>
                                        <td className="px-2 py-3 font-bold text-gray-900">${tx.price}</td>
                                        <td className="pr-4 pl-2 py-3 text-right">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${statusStyles[tx.status] || ''}`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Transaction;
