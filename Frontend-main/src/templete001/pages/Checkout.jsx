import { useNavigate, useOutletContext } from 'react-router-dom';
import useCartStore from '../../Zustand/cartStore';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../api/urls';

const Checkout = () => {
    const { store } = useOutletContext();
    const navigate = useNavigate();
    const { items, getTotalPrice, clearCart } = useCartStore();
    const total = getTotalPrice();
    const storeSlug = store?.slug ? `/${store.slug}` : '';

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would normally process payment and create order via API.
        // For template:
        clearCart();
        navigate(`${storeSlug}/order-complete`);
        toast.success("Order placed successfully!");
    };
    console.log(items);
    if (items.length === 0) {
        navigate(`${storeSlug}/cart`);
        return null;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* FORM */}
                <div>
                    <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-900">Contact Information</h2>
                            <input required type="email" placeholder="Email Address" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-900">Shipping Address</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <input required type="text" placeholder="First Name" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
                                <input required type="text" placeholder="Last Name" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <input required type="text" placeholder="Address" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
                            <div className="grid grid-cols-2 gap-4">
                                <input required type="text" placeholder="City" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
                                <input required type="text" placeholder="Postal Code" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-900">Payment</h2>
                            <div className="p-4 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 text-sm">
                                Payment gateway mock (Stripe/PayPal integration would go here).
                            </div>
                        </div>
                    </form>
                </div>

                {/* SUMMARY */}
                <div className="bg-gray-50 p-6 rounded-2xl h-fit border border-gray-100 sticky top-24">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h3>
                    <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                        {items.map(item => (
                            <div key={item.id} className="flex gap-4">
                                <div className="w-16 h-16 bg-white rounded-lg overflow-hidden border border-gray-200 relative">
                                    <img src={item.image ? (item.image.startsWith('http') ? item.image : `${BASE_URL}/${item.image}`) : item.image} className="w-full h-full object-cover" />
                                    <span className="absolute top-0 right-0 bg-gray-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-bl-lg">
                                        {item.quantity}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{item.name}</h4>
                                    <p className="text-xs text-gray-500">${item.price}</p>
                                </div>
                                <p className="font-bold text-sm text-slate-900">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-200 pt-4 space-y-2">
                        <div className="flex justify-between font-bold text-xl text-slate-900">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>

                    <button form="checkout-form" type="submit" className="w-full mt-6 bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-500 transition-colors shadow-lg">
                        Pay & Place Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
