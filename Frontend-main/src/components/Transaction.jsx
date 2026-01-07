import React, { useState, useMemo } from 'react';
import { useQuery } from "@tanstack/react-query";
import {
    FiSearch,
    FiFilter,
    FiDownload,
    FiArrowUpRight,
    FiArrowDownLeft,
    FiCreditCard,
    FiCalendar,
    FiMoreVertical,
    FiActivity
} from 'react-icons/fi';
import { RiBankLine, RiErrorWarningLine, RiAddCircleLine } from 'react-icons/ri';
import api from '../api/axiosClient';
import authStore from '../AuthStore';
import { Link } from 'react-router-dom';

const Transaction = () => {
    const token = authStore((state) => state.token);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all'); // all, credit, debit

    // Fetch Payment/Bank Details
    const { data: paymentData, isLoading } = useQuery({
        queryKey: ["payment-details"],
        queryFn: async () => {
            try {
                const res = await api.get("/payment", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                return res.data.payment; // Assuming this structure based on AccountDetails
            } catch (err) {
                if (err.response && err.response.status === 404) return null;
                throw err;
            }
        },
        enabled: !!token,
        retry: false
    });

    // Mock Transactions (generated only if bank details exist)
    const transactions = useMemo(() => {
        if (!paymentData?.bank?.accountNumber) return [];

        // Currently returning empty array as there is no real transaction history yet
        return [];
    }, [paymentData]);

    const filteredTransactions = transactions.filter(tx => {
        const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tx.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || tx.type === filterType;
        return matchesSearch && matchesType;
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount);
    };

    const formatDate = (dateString) => {
        const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // --- RENDER LOADING ---
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                <FiActivity className="animate-spin text-4xl mb-3 text-indigo-500" />
                <p>Loading transaction history...</p>
            </div>
        );
    }

    // --- RENDER NO BANK ACCOUNT DETECTED ---
    if (!paymentData || !paymentData.bank || !paymentData.bank.accountNumber) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center animate-fadeIn">
                <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <RiBankLine className="text-4xl text-orange-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">No Bank Account Linked</h2>
                <p className="text-gray-500 max-w-md mb-8">
                    To view your transaction history and receive payouts, please link your bank account in the Payments section.
                </p>
                <Link
                    to="#"
                    onClick={() => {
                        // Assuming this component is part of a tab system where we can switch tabs?
                        // If not, a simple visual cue or just the button is fine. 
                        // Since 'Settings' controls the tabs, we might not be able to switch programmatically easily 
                        // without context, but we can direct them to the UI conceptually.
                        const tabBtn = document.querySelector('button[data-tab="payments"]'); // Hypothetical
                        if (tabBtn) tabBtn.click();
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:bg-indigo-700 transition transform active:scale-95"
                >
                    <RiAddCircleLine className="text-xl" />
                    Link Bank Account
                </Link>
                <div className="mt-8 p-4 bg-blue-50 text-blue-700 rounded-lg text-sm flex items-start gap-3 max-w-lg text-left">
                    <RiErrorWarningLine className="text-lg flex-shrink-0 mt-0.5" />
                    <p>Once you link a valid bank account, your transaction history for payouts and settlements will appear here automatically.</p>
                </div>
            </div>
        );
    }

    // --- RENDER BANK STATEMENT UI ---
    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-10">

            {/* 1. Account Summary Card */}
            <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-white opacity-5 rounded-full transform translate-x-10 -translate-y-10"></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 opacity-90">
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <RiBankLine className="text-2xl" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-indigo-200">Linked Account</p>
                                <p className="text-lg font-bold tracking-wide">{paymentData.bank.bankName}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-3xl md:text-4xl font-bold">{formatCurrency(0.00)}</p>
                            <p className="text-indigo-200 text-sm mt-1">Available Payout Balance</p>
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 min-w-[200px]">
                        <p className="text-xs text-indigo-200 uppercase tracking-widest mb-1">Account Number</p>
                        <p className="font-mono text-xl tracking-widest">•••• {paymentData.bank.accountNumber.slice(-4)}</p>
                        <div className="mt-3 flex items-center gap-2 text-xs text-indigo-300">
                            <span className="w-2 h-2 bg-green-400 rounded-full"></span> Active & Verified
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Controls & Search */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition shadow-sm"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <button
                        onClick={() => setFilterType('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${filterType === 'all' ? 'bg-gray-800 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                        All Transactions
                    </button>
                    <button
                        onClick={() => setFilterType('credit')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap flex items-center gap-2 ${filterType === 'credit' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                        <FiArrowDownLeft /> Incoming
                    </button>
                    <button
                        onClick={() => setFilterType('debit')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap flex items-center gap-2 ${filterType === 'debit' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                        <FiArrowUpRight /> Outgoing
                    </button>
                </div>
            </div>

            {/* 3. Statement List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <FiCalendar className="text-indigo-500" /> Recent Activity
                    </h3>
                    <button className="text-sm text-gray-500 hover:text-indigo-600 font-medium flex items-center gap-1">
                        <FiDownload /> Download Statement
                    </button>
                </div>

                {filteredTransactions.length > 0 ? (
                    <div className="divide-y divide-gray-50">
                        {filteredTransactions.map((tx) => (
                            <div key={tx.id} className="p-4 sm:p-5 hover:bg-gray-50 transition flex items-center gap-4 group cursor-default">
                                {/* Icon */}
                                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${tx.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-50 text-red-500'
                                    }`}>
                                    {tx.type === 'credit' ? <FiArrowDownLeft className="text-xl" /> : <FiArrowUpRight className="text-xl" />}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-gray-900 truncate pr-2">{tx.description}</h4>
                                        <span className={`font-bold whitespace-nowrap ${tx.type === 'credit' ? 'text-green-600' : 'text-gray-900'
                                            }`}>
                                            {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs sm:text-sm text-gray-500">
                                        <div className="flex flex-col sm:flex-row sm:gap-4">
                                            <span>{formatDate(tx.date)}</span>
                                            <span className="hidden sm:inline text-gray-300">|</span>
                                            <span className="truncate max-w-[150px]">{tx.recipient}</span>
                                        </div>
                                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider">
                                            {tx.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center text-gray-400">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiSearch className="text-2xl" />
                        </div>
                        <p>No transactions found matching your criteria.</p>
                    </div>
                )}
            </div>

            <div className="text-center">
                <button className="text-indigo-600 font-semibold text-sm hover:underline">View Older Transactions</button>
            </div>
        </div>
    );
};

export default Transaction;
