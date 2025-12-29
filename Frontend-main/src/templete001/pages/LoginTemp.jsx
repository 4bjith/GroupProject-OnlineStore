import { useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import useAuthStore from '../../AuthStore';
import { toast } from 'react-toastify';
import api from '../../api/axiosClient';

const Login = () => {
    
    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    

    const handleLogin =async (e) => {
        e.preventDefault();
        // Mock API call
        if (email && password) {
            // Simulate success
            const login = await api.post('/login/user',{
                email, password
            })
            console.log(login.data)
            toast.success("Welcome back!");
            navigate(-1);
        } else {
            toast.error("Please fill in all fields");
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>
                    <p className="text-gray-500 mt-2">Sign in to your account to continue</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
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
                        Sign In
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Don't have an account? <Link to={`/register`} className="text-blue-600 font-bold hover:underline">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
