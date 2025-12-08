import { MdKeyboardArrowRight } from "react-icons/md";


function Dashboard() {
    return (
        <div>
            <div className="w-full h-screen grid grid-cols-12 grid-rows-12 gap-3 ">
                <div className="col-span-2 row-span-12 bg-gray-100  relative">
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
                <div className="col-span-10 row-span-12  bg-amber-200">sdfg</div>
            </div>
        </div>
    )
}

export default Dashboard