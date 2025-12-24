import { Link, useOutletContext } from 'react-router-dom';
import useCartStore from '../../Zustand/cartStore';
import { FiTrash2, FiMinus, FiPlus, FiArrowRight } from 'react-icons/fi';
import { BASE_URL } from '../../api/urls';

const Cart = () => {
    const { store } = useOutletContext();
    const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
    const total = getTotalPrice();
    // console.log(items)
    const storeSlug = store?.slug ? `/${store.slug}` : '';

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Your cart is empty</h2>
                <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
                <Link to={`${storeSlug}/store-products`}>
                    <button className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors">
                        Start Shopping
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-6">
                    {items.map((item) => (
                        <div key={item._id || item.id} className="flex gap-4 md:gap-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                <img
                                    src={item.image ? (item.image.startsWith('http') ? item.image : `${BASE_URL}/${item.image}`) : item.image}
                                    alt={item.title || item.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-slate-900 text-lg">{item.title || item.name}</h3>
                                        <button
                                            onClick={() => removeItem(item._id || item.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <FiTrash2 size={20} />
                                        </button>
                                    </div>
                                    <p className="text-gray-500 text-sm">{item.category}</p>
                                </div>

                                <div className="flex justify-between items-end mt-4">
                                    <div className="flex items-center border border-gray-200 rounded-lg">
                                        <button
                                            onClick={() => updateQuantity(item._id || item.id, item.quantity - 1)}
                                            className="p-2 hover:bg-gray-50 text-gray-500"
                                        >
                                            <FiMinus size={14} />
                                        </button>
                                        <span className="w-10 text-center text-sm font-bold">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item._id || item.id, item.quantity + 1)}
                                            className="p-2 hover:bg-gray-50 text-gray-500"
                                        >
                                            <FiPlus size={14} />
                                        </button>
                                    </div>
                                    <span className="font-bold text-lg text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button onClick={clearCart} className="text-red-500 text-sm font-semibold hover:underline">
                        Clear Cart
                    </button>
                </div>

                {/* Summary */}
                <div className="bg-gray-50 p-6 rounded-2xl h-fit border border-gray-100">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h3>

                    <div className="space-y-4 mb-6">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Shipping</span>
                            <span>Calculated at checkout</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Tax</span>
                            <span>$0.00</span>
                        </div>
                        <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-lg text-slate-900">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>

                    <Link to={`${storeSlug}/checkout`} >
                        <button className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-lg">
                            Proceed to Checkout <FiArrowRight />
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Cart;
