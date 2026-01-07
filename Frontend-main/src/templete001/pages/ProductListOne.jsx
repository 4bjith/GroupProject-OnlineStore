import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products as mockProducts, categories as mockCategories } from '../data/mockData';
import ProductCard from '../ProductCard';
import { FiSearch, FiFilter } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axiosClient';
import useShopStore from '../../Zustand/shopStore';

const ProductListOne = () => {
    const store = useShopStore((state) => state.store);
    const StoreId = store?._id;
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
    const [sortOption, setSortOption] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    // Fetch Products
    const { data: apiProducts, isLoading: isProductsLoading } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const response = await api.get('/product', { params: { storeId: StoreId, limit: 100 } });
            return response.data.data;
        }
    });

    // Fetch Categories
    const { data: apiCategories, isLoading: isCategoriesLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await api.get('/category', { params: { storeId: StoreId } });
            return response.data;
        }
    });

    const products = apiProducts?.length ? apiProducts : mockProducts;
    const categories = apiCategories?.length ? apiCategories : mockCategories;

    // Filter Logic
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Search (using title for API, name for mock)
        if (searchTerm) {
            result = result.filter(p => (p.title || p.name).toLowerCase().includes(searchTerm.toLowerCase()));
        }

        // Category
        if (selectedCategory !== 'All') {
            result = result.filter(p => (p.category === selectedCategory || p.categoryId === selectedCategory)); // Adjust comparison if needed
        }

        // Sort
        if (sortOption === 'newest') {
            result.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
        } else if (sortOption === 'oldest') {
            result.sort((a, b) => new Date(a.createdAt || a.date) - new Date(b.createdAt || b.date));
        } else if (sortOption === 'price-low') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortOption === 'price-high') {
            result.sort((a, b) => b.price - a.price);
        }

        return result;
    }, [searchTerm, selectedCategory, sortOption, products]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">All Products</h1>

            {/* CONTROLS BAR */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 sticky top-20 z-30">
                {/* Search */}
                <div className="relative w-full md:w-96">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Filters */}
                <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <div className="flex items-center gap-2">
                        <FiFilter className="text-gray-400" />
                        <select
                            value={selectedCategory}
                            onChange={(e) => {
                                setSelectedCategory(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 outline-none text-sm font-medium"
                        >
                            <option value="All">All Categories</option>
                            {categories.map((c, i) => <option key={c.id || c._id || i} value={c.name || c.catname}>{c.name || c.catname}</option>)}
                        </select>
                    </div>

                    <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 outline-none text-sm font-medium"
                    >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                    </select>
                </div>
            </div>

            {/* PRODUCT GRID */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 min-h-[400px]">
                {paginatedProducts.length > 0 ? (
                    paginatedProducts.map(product => (
                        <ProductCard key={product._id || product.id} product={product} />
                    ))
                ) : (
                    <div className="col-span-full flex justify-center items-center text-gray-500">
                        {isProductsLoading ? "Loading products..." : "No products found."}
                    </div>
                )}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-12 gap-2">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100"
                    >
                        Prev
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`w-10 h-10 rounded-lg font-bold flex items-center justify-center ${currentPage === i + 1
                                ? 'bg-slate-900 text-white'
                                : 'bg-white border border-gray-200 text-slate-700 hover:bg-gray-50'
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductListOne;
