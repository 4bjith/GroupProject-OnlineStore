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

function Dashboard() {
    const [open, setOpen] = useState(false);

    const menuItems = [
        { name: 'Dashboard', icon: <MdDashboard size={20} /> },
        { name: 'Orders', icon: <MdShoppingCart size={20} /> },
        { name: 'Products', icon: <MdInventory size={20} /> },
        { name: 'Categories', icon: <MdCategory size={20} /> },
        { name: 'Sales', icon: <MdAttachMoney size={20} /> },
        { name: 'Offers', icon: <MdLocalOffer size={20} /> },
        { name: 'Online stores', icon: <MdStore size={20} />, action: true },
    ];

    return (
        <div className="bg-gray-50 h-screen overflow-hidden flex">

            {/* Mobile sidebar overlay/backdrop */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setOpen(false)}
                ></div>
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
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-sm">L</div>
                        <span>LOGO</span>
                    </div>
                    {/* Close button for mobile */}
                    <button className="md:hidden text-slate-400 hover:text-white transition-colors" onClick={() => setOpen(false)}>
                        <MdClose size={24} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition-all duration-200 group"
                        >
                            <span className="text-slate-400 group-hover:text-blue-500 transition-colors">{item.icon}</span>
                            <span className="font-medium">{item.name}</span>
                            {item.action && (
                                <span className="ml-auto text-slate-500 group-hover:text-white text-lg">+</span>
                            )}
                        </button>
                    ))}
                </nav>

                {/* Footer / Account */}
                <div className="p-4 border-t border-slate-800 space-y-2">
                    <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition-all text-slate-400">
                        <div className="flex items-center gap-3">
                            <MdSettings size={20} />
                            <span className="font-medium">Settings</span>
                        </div>
                        <MdKeyboardArrowRight size={20} />
                    </button>

                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all font-medium">
                        <MdLogout size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 h-full overflow-y-auto w-full relative">

                {/* Mobile Header / Toggle */}
                <div className="md:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b px-4 py-3 flex items-center gap-3 shadow-sm">
                    <button
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors active:scale-95"
                        onClick={() => setOpen(true)}
                    >
                        <MdMenu size={26} />
                    </button>
                    <span className="font-semibold text-gray-800 text-lg">Dashboard</span>
                </div>

                <div className="p-6 md:p-8">

                    {/* Content Placeholder */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-40 flex items-center justify-center text-gray-400">
                            Stat Card 1
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-40 flex items-center justify-center text-gray-400">
                            Stat Card 2
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-40 flex items-center justify-center text-gray-400">
                            Stat Card 3
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}

export default Dashboard;