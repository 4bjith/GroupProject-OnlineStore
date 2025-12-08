import { useState } from "react";
import { MdKeyboardArrowRight, MdMenu, MdClose } from "react-icons/md";


function Dashboard() {
    const [open, setOpen] = useState(false);

    return (
        <div>
            {/* mobile sidebar overlay/backdrop */}
            {open && (
                <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setOpen(false)}></div>
            )}

            <div className="w-full h-screen grid md:grid-cols-12 grid-rows-12 gap-3">
                {/* Sidebar - hidden on mobile, shown on md and up */}
                <div className={`hidden md:block md:col-span-2 row-span-12 bg-gray-100 relative`}>
                    {/* close button for mobile */}
                    <button className="md:hidden absolute top-3 right-3 p-2" onClick={() => setOpen(false)}>
                        <MdClose size={22} />
                    </button>

                    <h2 className='text-[1.1rem] font-bold pl-4 mb-6 mt-3'>logo</h2>
                    <div className="pl-4">
                        <button className='w-full py-2 text-[1rem] font-semibold text-start cursor-pointer hover:font-bold'>Dashboard</button>
                        <button className='w-full py-2 text-[1rem] font-semibold text-start cursor-pointer hover:font-bold'>Orders</button>
                        <button className='w-full py-2 text-[1rem] font-semibold text-start cursor-pointer hover:font-bold'>Products</button>
                        <button className='w-full py-2 text-[1rem] font-semibold text-start cursor-pointer hover:font-bold'>Categories</button>
                        <button className='w-full py-2 text-[1rem] font-semibold text-start cursor-pointer hover:font-bold'>Sales</button>
                        <button className='w-full py-2 text-[1rem] font-semibold text-start cursor-pointer hover:font-bold'>Offers</button>
                        <button className='w-full py-2 text-[1rem] font-semibold text-start cursor-pointer hover:font-bold flex justify-between pr-4'>Online stores <span className="text-end">+</span></button>
                    </div>
                    <div className="pl-4 absolute bottom-1 w-[90%]">
                        <button className='w-full py-5 text-[1rem] font-semibold text-start cursor-pointer flex justify-between items-center'>Settings <MdKeyboardArrowRight /></button>
                        <button className='w-full py-3 text-[1rem] font-semibold  text-center cursor-pointer shadow-md rounded-lg  border-2 border-red-400 text-red-700 bg-red-200'>logout</button>
                    </div>
                </div>

                {/* Mobile Sidebar - slide-in overlay */}
                <div className={`${open ? 'fixed inset-y-0 left-0 w-64 z-50 transform translate-x-0'
                           : 'fixed inset-y-0 left-0 w-64 z-50 transform -translate-x-full'} md:hidden bg-gray-100 transition-transform duration-300`}>
                    {/* close button for mobile */}
                    <button className="absolute top-3 right-3 p-2" onClick={() => setOpen(false)}>
                        <MdClose size={22} />
                    </button>

                    <h2 className='text-[1.1rem] font-bold pl-4 mb-6 mt-3'>logo</h2>
                    <div className="pl-4">
                        <button className='w-full py-2 text-[1rem] font-semibold text-start cursor-pointer hover:font-bold'>Dashboard</button>
                        <button className='w-full py-2 text-[1rem] font-semibold text-start cursor-pointer hover:font-bold'>Orders</button>
                        <button className='w-full py-2 text-[1rem] font-semibold text-start cursor-pointer hover:font-bold'>Products</button>
                        <button className='w-full py-2 text-[1rem] font-semibold text-start cursor-pointer hover:font-bold'>Categories</button>
                        <button className='w-full py-2 text-[1rem] font-semibold text-start cursor-pointer hover:font-bold'>Sales</button>
                        <button className='w-full py-2 text-[1rem] font-semibold text-start cursor-pointer hover:font-bold'>Offers</button>
                        <button className='w-full py-2 text-[1rem] font-semibold text-start cursor-pointer hover:font-bold flex justify-between pr-4'>Online stores <span className="text-end">+</span></button>
                    </div>
                    <div className="pl-4 absolute bottom-1 w-[90%]">
                        <button className='w-full py-5 text-[1rem] font-semibold text-start cursor-pointer flex justify-between items-center'>Settings <MdKeyboardArrowRight /></button>
                        <button className='w-full py-3 text-[1rem] font-semibold  text-center cursor-pointer shadow-md rounded-lg  border-2 border-red-400 text-red-700 bg-red-200'>logout</button>
                    </div>
                </div>

                {/* Main content - full width on mobile, col-span-10 on md+ */}
                <div className="col-span-12 md:col-span-10 row-span-12 bg-amber-50 relative">
                    {/* toggle button - top left, visible only on mobile */}
                    <button className="md:hidden absolute top-3 left-3 p-2 bg-white rounded shadow z-10" onClick={() => setOpen(true)}>
                        <MdMenu size={22} />
                    </button>

                    <div className="p-6">sdfg</div>
                </div>

            </div>
        </div>
    )
}

export default Dashboard