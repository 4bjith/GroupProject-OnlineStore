import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiShoppingBag, FiUser, FiSearch, FiLogOut } from 'react-icons/fi';
import useCartStore from '../../Zustand/cartStore';
import useAuthStore from '../../AuthStore';
import { BASE_URL } from '../../api/urls';

const Navbar = ({ store }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const cartCount = useCartStore((state) => state.getItemCount());
    const { isAuthenticated, user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const storeSlug = store?.slug ? `/${store.slug}` : '';
    const storeName = store?.name || 'StoreTemplate';
    const storeLogo = store?.logo;

    return (
        <nav className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100 backdrop-blur-md bg-opacity-90">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to={`${storeSlug}`} className="shrink-0 flex items-center gap-2">
                        {storeLogo ? (
                            <img
                                src={storeLogo.startsWith('http') ? storeLogo : `${BASE_URL}${storeLogo}`}
                                alt={storeName}
                                className="h-10 w-auto object-contain"
                            />
                        ) : (
                            <div className="bg-slate-900 text-white p-1.5 rounded-lg font-bold text-xl">
                                {storeName.substring(0, 2).toUpperCase()}
                            </div>
                        )}
                        <span className="font-bold text-xl tracking-tight text-slate-900">{storeName}</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to={`${storeSlug}`} className="text-slate-600 hover:text-slate-900 font-medium transition-colors">Home</Link>
                        <Link to={`${storeSlug}/store-products`} className="text-slate-600 hover:text-slate-900 font-medium transition-colors">Shop</Link>
                        {/* <Link to="/categories" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">Categories</Link> */}
                    </div>

                    {/* Right Icons */}
                    <div className="hidden md:flex items-center space-x-6">
                        <div className="relative group">
                            <FiSearch className="text-xl text-slate-600 cursor-pointer hover:text-slate-900 transition-colors" />
                            {/* Small hover search input could go here */}
                        </div>

                        <Link to={`${storeSlug}/cart`} className="relative text-slate-600 hover:text-slate-900 transition-colors">
                            <FiShoppingBag className="text-xl" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-slate-900 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        <div className="relative group">
                            <button className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium">
                                <FiUser className="text-xl" />
                                <span className="text-sm">{user?.name || 'Account'}</span>
                            </button>
                            {/* Dropdown */}
                            <div className="absolute right-0 top-full pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                                    <div className="p-3 border-b border-gray-50">
                                        <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                                    </div>
                                    <Link to={`${storeSlug}/account`} className="block w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-gray-50 items-center gap-2">
                                        <FiUser /> My Account
                                    </Link>
                                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2">
                                        <FiLogOut /> Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <Link to="/cart" className="relative text-slate-600">
                            <FiShoppingBag className="text-xl" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-slate-900 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 hover:text-slate-900">
                            {isOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile View */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
                    <div className="px-4 py-6 space-y-4">
                        <Link to={`${storeSlug}`} onClick={() => setIsOpen(false)} className="block text-slate-600 font-medium text-lg">Home</Link>
                        <Link to={`${storeSlug}/store-products`} onClick={() => setIsOpen(false)} className="block text-slate-600 font-medium text-lg">Shop</Link>
                        <hr className="border-gray-100" />
                        <>
                            <div className="flex items-center gap-3 py-2">
                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500"><FiUser /></div>
                                <div>
                                    <p className="font-bold text-slate-900">{user?.name}</p>
                                    <p className="text-xs text-slate-500">{user?.email}</p>
                                </div>
                            </div>
                            <Link to={`${storeSlug}/account`} onClick={() => setIsOpen(false)} className="block w-full text-left py-2 text-slate-600 font-medium flex items-center gap-2">
                                <FiUser /> My Account
                            </Link>
                            <button onClick={() => { handleLogout(); setIsOpen(false) }} className="w-full text-left py-2 text-red-600 font-medium flex items-center gap-2">
                                <FiLogOut /> Logout
                            </button>
                        </>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
