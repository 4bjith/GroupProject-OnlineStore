import { useState, useEffect } from 'react';
import { BiTime, BiFilter, BiSort, BiPlus, BiX, BiShoppingBag, BiCheckCircle, BiTrash } from 'react-icons/bi';
import { RiFireFill } from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axiosClient';
import toast from 'react-hot-toast';

const Offers = () => {
    const queryClient = useQueryClient();
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [showCreateForm, setShowCreateForm] = useState(false);

    // --- FETCH DATA ---

    // 1. Fetch Categories
    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const res = await api.get('/category');
            return res.data;
        }
    });

    // 2. Fetch Active Offers
    const { data: offers = [], isLoading } = useQuery({
        queryKey: ['offers'],
        queryFn: async () => {
            const res = await api.get('/offers');
            return res.data;
        }
    });

    // --- MUTATIONS ---

    // Create Offer
    const createOfferMutation = useMutation({
        mutationFn: async (newOffer) => {
            const res = await api.post('/offers', newOffer);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['offers']);
            queryClient.invalidateQueries(['products']); // Since prices change
            setShowCreateForm(false);
            setNewOffer({ title: "", discountPercentage: "", category: "", endDate: "" });
            toast.success("Offer created & prices updated!");
        },
        onError: (err) => {
            console.error(err);
            toast.error("Failed to create offer");
        }
    });

    // Delete Offer (Revert)
    const deleteOfferMutation = useMutation({
        mutationFn: async (id) => {
            await api.delete(`/offers/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['offers']);
            queryClient.invalidateQueries(['products']);
            toast.success("Offer removed & prices reverted!");
        },
        onError: () => toast.error("Failed to delete offer")
    });


    // --- FORM STATE ---
    const [newOffer, setNewOffer] = useState({
        title: "",
        discountPercentage: "",
        category: "",
        endDate: ""
    });

    const handleCreate = (e) => {
        e.preventDefault();
        if (!newOffer.category) return toast.error("Please select a category");

        createOfferMutation.mutate({
            title: newOffer.title,
            discountPercentage: Number(newOffer.discountPercentage),
            category: newOffer.category,
            endDate: newOffer.endDate // Date string from input usually YYYY-MM-DD
        });
    };

    // Calculate time left helper
    const calculateTimeLeft = (endDate) => {
        const difference = new Date(endDate) - new Date();
        if (difference <= 0) return "Expired";

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);

        if (days > 0) return `${days}d ${hours}h left`;
        return `${hours}h left`;
    };

    // Filter Offers
    const filteredOffers = selectedCategory === "All"
        ? offers
        : offers.filter(o => o.category === selectedCategory);


    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">

            {/* --- HERO SECTION --- */}
            <div className="relative bg-indigo-900 text-white overflow-hidden py-16 md:py-24">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-indigo-900/80 to-transparent"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 flex flex-col justify-center h-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-xl pb-8"
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-yellow-400 text-yellow-900 text-xs font-bold mb-4 uppercase tracking-wider">
                            Special Promotions
                        </span>
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                            Manage Your Sales <br />
                            <span className="text-indigo-300">Boost Revenue</span>
                        </h1>
                        <p className="text-indigo-100 mb-8 text-sm md:text-base max-w-sm">
                            Create targeted offers for specific categories. Prices will update automatically and revert when the offer expires.
                        </p>
                        <div className="flex gap-4">
                            <button onClick={() => setShowCreateForm(true)} className="px-6 py-3 bg-white text-indigo-900 rounded-lg font-bold text-sm hover:bg-indigo-50 transition shadow-lg flex items-center gap-2">
                                <BiPlus size={18} /> Create New Offer
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">

                {/* --- FILTERS & SORTING --- */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                        <button
                            onClick={() => setSelectedCategory("All")}
                            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${selectedCategory === "All"
                                ? 'bg-indigo-900 text-white shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            All
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat._id}
                                onClick={() => setSelectedCategory(cat.name)} // Assuming category object has name
                                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${selectedCategory === cat.name
                                    ? 'bg-indigo-900 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- OFFERS GRID --- */}
                {isLoading ? (
                    <div className="text-center py-20 text-gray-500">Loading offers...</div>
                ) : filteredOffers.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                        <p className="text-gray-500 font-medium">No active offers found.</p>
                        <button onClick={() => setShowCreateForm(true)} className="mt-4 text-indigo-600 font-bold text-sm hover:underline">Create one now</button>
                    </div>
                ) : (
                    <div id="deals-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence mode='popLayout'>
                            {filteredOffers.map((offer) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    key={offer._id}
                                    className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-indigo-100 transition-all duration-300 flex flex-col"
                                >
                                    <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 p-6 relative overflow-hidden flex items-center justify-center text-center">
                                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                                        <div className="relative z-10">
                                            <h3 className="text-3xl font-black text-white">{offer.discountPercentage}% OFF</h3>
                                            <p className="text-white/80 text-xs font-bold uppercase tracking-wider mt-1">On {offer.category}</p>
                                        </div>
                                    </div>

                                    <div className="p-5 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="font-bold text-gray-800 text-lg leading-tight">{offer.title}</h3>
                                            <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${offer.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {offer.isActive ? 'Active' : 'Expired'}
                                            </div>
                                        </div>

                                        <div className="mt-auto space-y-3">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                                                <BiTime className="text-indigo-500" />
                                                <span className="font-medium">{calculateTimeLeft(offer.endDate)}</span>
                                            </div>

                                            <button
                                                onClick={() => deleteOfferMutation.mutate(offer._id)}
                                                className="w-full flex items-center justify-center gap-2 py-2 text-red-600 hover:bg-red-50 rounded-lg transition text-sm font-medium border border-transparent hover:border-red-100"
                                            >
                                                <BiTrash /> End Offer & Revert Prices
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

            </div>

            {/* --- CREATE OFFER MODAL --- */}
            <AnimatePresence>
                {showCreateForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
                        >
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <h2 className="text-lg font-bold text-gray-800">Create Category Offer</h2>
                                <button onClick={() => setShowCreateForm(false)} className="text-gray-400 hover:text-gray-600">
                                    <BiX size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleCreate} className="p-6 space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-700">Offer Title</label>
                                    <input
                                        required
                                        value={newOffer.title}
                                        onChange={e => setNewOffer({ ...newOffer, title: e.target.value })}
                                        type="text"
                                        placeholder="e.g. Monsoon Mega Sale"
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-700">Category</label>
                                        <select
                                            required
                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-indigo-500 outline-none"
                                            value={newOffer.category}
                                            onChange={e => setNewOffer({ ...newOffer, category: e.target.value })}
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(c => (
                                                <option key={c?._id} value={c?.name}>{c?.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-700">Discount Percentage</label>
                                        <div className="relative">
                                            <input
                                                required
                                                type="number"
                                                min="1"
                                                max="100"
                                                value={newOffer.discountPercentage}
                                                onChange={e => setNewOffer({ ...newOffer, discountPercentage: e.target.value })}
                                                placeholder="20"
                                                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-indigo-500 outline-none"
                                            />
                                            <span className="absolute right-3 top-2 text-gray-500 text-sm">%</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-700">Offer Ends On</label>
                                    <input
                                        required
                                        type="datetime-local"
                                        value={newOffer.endDate}
                                        onChange={e => setNewOffer({ ...newOffer, endDate: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-indigo-500 outline-none"
                                    />
                                    <p className="text-[10px] text-gray-500 mt-1">Prices will automatically revert after this date (on next check).</p>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateForm(false)}
                                        className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={createOfferMutation.isPending}
                                        className="flex-1 py-2.5 bg-indigo-900 text-white font-bold rounded-lg hover:bg-indigo-800 transition shadow-lg shadow-indigo-200 text-sm disabled:opacity-50"
                                    >
                                        {createOfferMutation.isPending ? 'creating...' : 'Apply Offer'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
}

export default Offers;
