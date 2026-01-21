import { useState } from "react";
import {
    MdKeyboardArrowRight,
    MdMenu,
    MdClose,
    MdDashboard,
    MdShoppingCart,
    MdInventory,
    MdCategory,
    MdAttachMoney,
    MdLocalOffer,
    MdStore,
    MdSettings,
    MdLogout
} from "react-icons/md";
import { Link, Outlet, useNavigate } from "react-router-dom";
import authStore from "../AuthStore";

import logo from "../assets/images/loogo2.png"

function Dashboard() {
    const [open, setOpen] = useState(false);
    const removetoken = authStore().removeToken;
    const nav = useNavigate()

    const menuItems = [
        { name: 'Dashboard', icon: <MdDashboard size={20} /> },
        { name: 'Orders', url: "orders", icon: <MdShoppingCart size={20} /> },
        { name: 'Products', url: "products", icon: <MdInventory size={20} /> },
        { name: 'Categories', url: "categories", icon: <MdCategory size={20} /> },
        { name: 'Sales', url: "sales", icon: <MdAttachMoney size={20} /> },
        { name: 'Offers', url: "offers", icon: <MdLocalOffer size={20} /> },
        { name: 'Online stores', url: "stores", icon: <MdStore size={20} /> },
    ];

    return (
        <div className="bg-gray-50 h-screen overflow-hidden flex">

            {/* Mobile sidebar overlay/backdrop */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Sidebar - Desktop & Mobile Shared Structure */}
            <aside
                className={`
                    fixed md:relative z-50 h-full w-64 bg-slate-900 text-slate-300 flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-xl
                    ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}
            >
                {/* Header */}
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white font-bold text-xl tracking-wide">
                        <img src={logo} alt="" className="h-clamp(10px, 20px, 30px)" />
                    </div>
                    {/* Close button for mobile */}
                    <button className="md:hidden text-slate-400 hover:text-white transition-colors" onClick={() => setOpen(false)}>
                        <MdClose size={24} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                    {menuItems.map((item, index) => (
                        <Link key={index} to={item.url ? item.url : ""} onClick={() => setOpen(false)}>
                            <button
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition-all duration-200 group"
                            >
                                <span className="text-slate-400 group-hover:text-blue-500 transition-colors">{item.icon}</span>
                                <span className="font-medium">{item.name}</span>
                                {item.action && (
                                    <span className="ml-auto text-slate-500 group-hover:text-white text-lg">+</span>
                                )}
                            </button>
                        </Link>
                    ))}
                </nav>

                {/* Footer / Account */}
                <div className="p-4 border-t border-slate-800 space-y-2">
                    <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition-all text-slate-400">
                        <div className="flex items-center gap-3">
                            <MdSettings size={20} />
                            <Link to="settings" className="font-medium">Settings</Link>
                        </div>
                        <MdKeyboardArrowRight size={20} />
                    </button>

                    <button
                        onClick={() => {
                            removetoken()
                            nav('/')
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all font-medium">
                        <MdLogout size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 h-full overflow-y-auto w-full relative">
                {/* Mobile Menu Button */}
                <div className="md:hidden p-4 pb-0">
                    <button
                        onClick={() => setOpen(true)}
                        className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 text-slate-700 active:scale-95 transition-transform"
                    >
                        <MdMenu size={24} />
                    </button>
                </div>
                <Outlet />
            </main>
        </div>
    );
}

export default Dashboard;