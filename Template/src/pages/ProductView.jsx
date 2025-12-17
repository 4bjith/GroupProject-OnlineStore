import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../data/mockData';
import useCartStore from '../store/cartStore';
import { FiMinus, FiPlus, FiShoppingCart } from 'react-icons/fi';
import { useState } from 'react';
import { toast } from 'react-toastify';

const ProductView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const product = products.find(p => p.id === parseInt(id));
    const addItem = useCartStore(state => state.addItem);
    const [quantity, setQuantity] = useState(1);

    if (!product) return <div className="p-20 text-center">Product not found.</div>;

    const handleAddToCart = () => {
        addItem({ ...product, quantity }); // Note: cart store usually handles adding quantity, but here we can just add item multiply times or update store logic.
        // Actually my store adds 1, let me update logic or simply call addItem loop.
        // Simplified: Just add item.
        for (let i = 0; i < quantity; i++) addItem(product);
        toast.success(`Added ${quantity} ${product.name} to cart`);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <button onClick={() => navigate(-1)} className="text-gray-500 mb-6 hover:text-black">Back to products</button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Image */}
                <div className="bg-gray-100 rounded-2xl overflow-hidden aspect-square">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>

                {/* Details */}
                <div className="space-y-6">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        {product.category}
                    </span>
                    <h1 className="text-4xl font-extrabold text-slate-900">{product.name}</h1>
                    <p className="text-3xl font-bold text-slate-900">${product.price.toFixed(2)}</p>

                    <p className="text-gray-600 leading-relaxed text-lg">
                        {product.description}
                    </p>

                    <div className="pt-6 border-t border-gray-100">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="p-3 hover:bg-gray-100"
                                >
                                    <FiMinus />
                                </button>
                                <span className="w-12 text-center font-bold">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(q => q + 1)}
                                    className="p-3 hover:bg-gray-100"
                                >
                                    <FiPlus />
                                </button>
                            </div>
                            <span className="text-sm text-gray-500">In Stock</span>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-lg active:scale-95"
                            >
                                <FiShoppingCart /> Add to Cart
                            </button>
                            {/* Wishlist Button could go here */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductView;
