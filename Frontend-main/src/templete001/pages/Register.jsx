import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../AuthStore';
import useShopStore from '../../Zustand/shopStore';
import { toast } from 'react-toastify';
import api from '../../api/axiosClient';
const Register = () => {
    const store = useShopStore((state) => state.store);
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [number, setNumber] = useState('');
    const storeSlug = store?.slug ? `/${store.slug}` : '';

    const handleRegister = (e) => {
        e.preventDefault();
        // Mock API call
        
        if (name && email && password && number) {
            api.post("/register/user", { name, email, password ,number}).then((res) => {
                toast.success("Account created successfully!");
                navigate(`${storeSlug}/login`);
            }).catch((err) => {
                toast.error(err.response.data.message);
            });
        } else {
            toast.error("Please fill in all fields");
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Create Account</h1>
                    <p className="text-gray-500 mt-2">Join us to start shopping today</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Number</label>
                        <input
                            type="number"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="1234567890"
                        />
                    </div>  
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="user@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg transform active:scale-95">
                        Create Account
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Already have an account? <Link to={`${storeSlug}/login`} className="text-blue-600 font-bold hover:underline">Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
