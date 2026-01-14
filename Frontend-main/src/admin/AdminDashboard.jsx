import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import authStore from "../AuthStore";
import api from "../api/axiosClient";
import { useQuery } from "@tanstack/react-query";
import { MdMessage, MdPerson, MdMenu, MdClose } from "react-icons/md";

export default function AdminDashboard() {
    //-----------Navigation items-----------
    const menuItems = [
        { slno: 1, name: 'Dashboard', url: "" },
        { slno: 2, name: 'Earnings', url: "earnings" },
        { slno: 3, name: 'Users management', url: "users" },
        { slno: 4, name: 'Stores management', url: "stores" },
        { slno: 5, name: 'Templates management', url: "templates" },
        { slno: 6, name: 'Products management', url: "products" },
        { slno: 7, name: 'Categories management', url: "categories" },
        { slno: 8, name: 'Orders management', url: "orders" },
        { slno: 9, name: 'Settings', url: "settings" },
        { slno: 10, name: 'Logout', url: "logout" },
    ];

    //-----------State-----------
    const [open, setOpen] = useState(false);
    const token = authStore(state => state.token)
    const removetoken = authStore().removeToken;
    const nav = useNavigate()


    //-----------Function to handle logout-----------
    const handleLogout = () => {
        removetoken();
        nav('/');
    };

    //-----------Function to fetch User Info ------------
    const { data: user, isLoading, error } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const res = await api.get("/getuserdetails", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return res.data
        },
    })

    //-----------Render-----------
    return (
        <div className="flex h-screen w-screen">
            {/* Mobile sidebar overlay/backdrop */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setOpen(false)}
                >
                    <MdMenu size={24} />
                </div>
            )}

            {/* Sidebar */}
            <aside className="w-1/5 bg-slate-800 text-white p-6 flex flex-col gap-6">
                {/* Logo */}
                <div className="flex items-center gap-2 text-xl font-bold">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-sm">
                        L
                    </div>
                    <span>LOGO</span>
                </div>
                {/* Navigation */}
                <nav className="flex flex-col gap-2">
                    {menuItems.map((item) => (
                        <div key={item.slno}>
                            {item.name === "Logout" ? (
                                <button onClick={handleLogout} className="w-full text-left py-2 px-3 font-semibold text-lg text-red-500 hover:bg-slate-700 rounded">
                                    {item.name}
                                </button>
                            ) : (
                                <Link to={item.url}>
                                    <div className={`py-2 px-3 font-semibold text-lg  hover:text-blue-500 rounded hover:bg-slate-700 transition-colors`}>
                                        {item.name}
                                    </div>
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>
            </aside>
            {/* Main Content */}
            <main className="flex-1 bg-slate-200 p-8 overflow-y-auto">
                <div className="w-full flex items-center justify-between mb-8">
                    <div className="w-1/2">
                        <span className="text-xl font-bold text-slate-700">Admin Dashboard</span>
                    </div>

                    <div className="w-1/2 flex items-center justify-end gap-5">
                        {/* -------------Notification---------------- */}
                        <div className="flex w-auto justify-start items-center gap-2 p-1 bg-slate-50 border border-slate-300 rounded-full">
                            <div className="w-7 h-7 bg-slate-300 rounded-full flex items-center justify-center text-sm">
                                <MdMessage size={20} />
                            </div>

                        </div>
                        {/* ------------User Profile---------------- */}
                        <div className="flex w-auto min-w-[120px] justify-start items-center gap-2 px-2 py-1 bg-slate-50 border border-slate-300 rounded-full">
                            <div className="w-7 h-7 bg-slate-300 rounded-full flex items-center justify-center text-sm">
                                <MdPerson size={20} />
                            </div>
                            <span>{user?.user?.name || "User"}</span>
                        </div>
                    </div>
                </div>
                <div className="w-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
