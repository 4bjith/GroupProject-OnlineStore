import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../../Zustand/cartStore';
import useShopStore from '../../Zustand/shopStore';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../api/urls';
import api from '../../api/axiosClient';

const Checkout = () => {
    const store = useShopStore((state) => state.store);
    const navigate = useNavigate();
    const { items, getTotalPrice, clearCart } = useCartStore();
    const total = getTotalPrice();
    const storeSlug = store?.slug ? `/${store.slug}` : '';

    const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        postalCode: '',
        country: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const orderItems = items.map(item => ({
                productId: item._id || item.id,
                quantity: item.quantity,
                price: item.price
            }));

            const payload = {
                storeId: store?._id || store?.id,
                email: formData.email,
                items: orderItems,
                shippingAddress: {
                    addressLine1: formData.address,
                    city: formData.city,
                    postalCode: formData.postalCode,
                    country: formData.country
                },
                totalAmount: total,
                paymentMethod: paymentMethod,
                paymentStatus: "Pending",
                shippingPrice: 0
            };

            const res = await api.post("/order", payload);

            if (res.status === 201) {
                clearCart();
                navigate(`${storeSlug}/order-complete`);
                toast.success("Order placed successfully!");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to place order");
        }
    };

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
                            <input
                                required
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email Address"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-900">Shipping Address</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    required
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="First Name"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    required
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Last Name"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <input
                                required
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Address"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    required
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="City"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    required
                                    type="text"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    placeholder="Postal Code"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <input
                                required
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                placeholder="Country"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-900">Payment Method</h2>
                            <div className="space-y-3">
                                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'Cash on Delivery' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-200'}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="Cash on Delivery"
                                        checked={paymentMethod === "Cash on Delivery"}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <span className="ml-3 font-medium text-slate-900">Cash on Delivery</span>
                                </label>

                                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'Credit Card' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-200'}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="Credit Card"
                                        checked={paymentMethod === "Credit Card"}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <span className="ml-3 font-medium text-slate-900">Credit Card</span>
                                </label>
                            </div>

                            {paymentMethod === 'Credit Card' && (
                                <div className="p-4 border border-gray-200 rounded-xl bg-gray-50 space-y-4 animate-fadeIn">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Card Number</label>
                                        <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Expiry</label>
                                            <input type="text" placeholder="MM/YY" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">CVC</label>
                                            <input type="text" placeholder="123" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
                                        </div>
                                    </div>
                                    <button  className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">Pay Now</button>
                                </div>
                            )}
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
                                    <img src={item.images[0] ? (item.images[0].startsWith('http') ? item.images[0] : `${BASE_URL}${item.images[0]}`) : item.images[0]} className="w-full h-full object-cover" />
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
