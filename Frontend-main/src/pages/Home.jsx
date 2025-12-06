import Navbar from "../components/Navbar"
import img1 from '../assets/images/hero.jpg'
import { IoStorefrontSharp } from "react-icons/io5";
import { MdOutlineMonitor } from "react-icons/md";




export default function Home() {
  return (
    <div className="max-w-screen ">
      <Navbar />
        <div className="flex justify-center">
          <div className="w-full md:w-[760px] lg:w-[1000px] xl:w-[1200px] h-[70vh]">
           {/* Hero section  */}
           <div className="grid grid-cols-1 md:grid-cols-2 ">
              <div className="h-[40vh] lg:h-[60vh] flex justify-start items-center pl-5">
                <div className="flex flex-col gap-2.5 items-start w-[90%]">
                  <h1 className="text-4xl lg:text-6xl font-bold">Your Online <span className="text-green-400">Business</span>, Build in Minutes</h1>
                  <p className="w-[80%] font-mono opacity-50">The all-in-one dropshipping platform to source products, build your brand, and sell online. </p>
                  <button className="bg-green-400 rounded-lg px-7 py-2.5 mt-6 text-white outline-1 font-semibold">Create your store</button>
                </div>
              </div>
              <div className=" h-[50vh] lg:h-[60vh] flex justify-center items-center">
                <div className="rounded-xl overflow-hidden bg-white h-[80%] lg:h-[70%] w-[80%]  -rotate-3 hover:rotate-0">
                  <img src={img1} alt="" className="w-full h-full object-cover" />
                </div>
              </div>
           </div>
            {/* discreption */}
            <div className="w-full flex flex-col items-center justify-center gap-4">
              <h1 className="text-3xl md:text-4xl font-bold tracking-wider">Everything You Need to Succeed</h1>
              <p className="opacity-50 w-full md:w-[60%] lg-[40%] text-center">From finding winning products to automating your fulfillment, our platform is designed for your growth. </p>
              <div className="w-[90%] grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="h-[25vh] flex flex-col items-center justify-center rounded-xl outline-1 outline-green-100 gap-3">
                  <IoStorefrontSharp className="text-2xl"/>
                  <h3 className="text-xl font-semibold text-green-700">Easy store builder</h3>
                  <p className="w-[90%] text-center text-green-800 opacity-50">Create a beautiful professional looking online store in minuts with our drag and drop builder, No coding requires</p>
                </div>
                <div className="h-[25vh] flex flex-col items-center justify-center rounded-xl outline-1 outline-green-100 gap-3">
                  <MdOutlineMonitor className="text-2xl"/>
                  <h3 className="text-xl font-semibold text-green-700">Easy to Moniter</h3>
                  <p className="w-[90%] text-center text-green-800 opacity-50">Easy to moniter and analyse store's growth and easly track your revenue</p>
                </div>
                <div className="h-[25vh] flex flex-col items-center justify-center rounded-xl outline-1 outline-green-100 gap-3">
                   <MdOutlineMonitor className="text-2xl"/>
                  <h3 className="text-xl font-semibold text-green-700">Completly free to use</h3>
                  <p className="w-[90%] text-center text-green-800 opacity-50">We provide our service completly free to create stores and mintaning, Only 2.5% commission for purchase through our gateway</p>
                
                </div>
              </div>
            </div>
        </div>
        </div>
    </div>
  )
}
