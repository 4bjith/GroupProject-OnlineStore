import Navbar from "../components/Navbar";
import img1 from "../assets/images/h2.jpg";
import { IoStorefrontSharp } from "react-icons/io5";
import { MdOutlineMonitor } from "react-icons/md";
import { AiFillWallet } from "react-icons/ai";
import {
  BsFill1CircleFill,
  BsFill2CircleFill,
  BsFill3CircleFill,
} from "react-icons/bs";

import p1 from "../assets/images/p1.jpg";
import p2 from "../assets/images/p2.jpg";
import p3 from "../assets/images/p3.jpg";
import p4 from "../assets/images/p4.jpg";


export default function Home() {
  return (
    <div className="max-w-screen ">
      <Navbar />
      <div className="flex justify-center">
        <div className="w-full md:w-[760px] lg:w-[1000px] xl:w-[1200px] ">
          {/* Hero section  */}
          <div className="grid grid-cols-1 md:grid-cols-2 ">
            <div className="h-[40vh] lg:h-[85vh] flex justify-start items-center pl-5">
              <div className="flex flex-col gap-2.5 items-start w-[90%]">
                <h1 className="text-4xl lg:text-6xl font-bold">
                  Your Online  <span className="text-green-400">Business</span>,
                  Build in Minutes
                </h1>
                <p className="w-[80%] font-mono opacity-50">
                  The all-in-one dropshipping platform to source products, build
                  your brand, and sell online.{" "}
                </p>
                <button className="bg-green-400 rounded-lg px-7 py-2.5 mt-6 text-white outline-1 font-semibold">
                  Create your store
                </button>
              </div>
            </div>
            <div className=" h-[50vh] lg:h-[85vh] flex justify-center items-center">
              <div className="rounded-xl overflow-hidden bg-white h-[80%] lg:h-[70%] w-[80%]  -rotate-3 hover:rotate-0">
                <img src={img1} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
          {/* discreption */}
          <div className="w-full flex flex-col items-center justify-center gap-4">
            <h1 className="text-3xl md:text-4xl font-bold tracking-wider">
              Everything You Need to Succeed
            </h1>
            <p className="opacity-50 w-full md:w-[60%] lg-[40%] text-center">
              From finding winning products to automating your fulfillment, our
              platform is designed for your growth.{" "}
            </p>
            <div className="w-[90%] grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="h-[25vh] flex flex-col items-center justify-start pt-5 rounded-xl outline-1 outline-green-100 gap-3">
                <IoStorefrontSharp className="text-2xl" />
                <h3 className="text-xl font-semibold text-green-700">
                  Easy store builder
                </h3>
                <p className="w-[90%] text-center text-green-800 opacity-50 line-clamp-3">
                  Create a beautiful professional looking online store in minuts
                  with our drag and drop builder, No coding requires
                </p>
              </div>
              <div className="h-[25vh] flex flex-col items-center justify-start pt-5 rounded-xl outline-1 outline-green-100 gap-3">
                <MdOutlineMonitor className="text-2xl" />
                <h3 className="text-xl font-semibold text-green-700">
                  Easy to Moniter
                </h3>
                <p className=" w-[90%] text-center text-green-800 opacity-50">
                  Easy to moniter and analyse store's growth and easly track
                  your revenue
                </p>
              </div>
              <div className="h-[25vh] flex flex-col items-center justify-start pt-5 rounded-xl outline-1 outline-green-100 gap-3">
                <AiFillWallet className="text-2xl" />
                <h3 className="text-xl font-semibold text-green-700">
                  Completly free to use
                </h3>
                <p className="w-[90%] text-center text-green-800 opacity-50 line-clamp-3">
                  We provide our service completly free to create stores and
                  mintaning, Only 2.5% commission for purchase through our
                  gateway
                </p>
              </div>
            </div>
          </div>
          {/* guide */}
          <div className="w-full h-auto flex flex-col items-center justify-center py-12">
            <h1 className="text-3xl font-bold">
              How it Works in 3 Simple Steps
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 mt-10 gap-10 w-[90%] md:w-full">
              {/* Left side images */}
              <div className="grid grid-cols-2 grid-rows-2 gap-5">
                <div className="overflow-hidden rounded-lg">
                  <img src={p1} alt="" className="object-cover w-full h-full" />
                </div>
                <div className="overflow-hidden rounded-lg">
                  <img src={p2} alt="" className="object-cover w-full h-full" />
                </div>
                <div className="overflow-hidden rounded-lg">
                  <img src={p3} alt="" className="object-cover w-full h-full" />
                </div>
                <div className="overflow-hidden rounded-lg">
                  <img src={p4} alt="" className="object-cover w-full h-full" />
                </div>
              </div>

              {/* Right side text */}
              <div className="flex flex-col justify-center gap-8">
                {/* Step 1 */}
                <div className="flex gap-5">
                  <div>
                    <BsFill1CircleFill className="text-3xl text-green-500" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-2xl">Choose Products</h2>
                    <p className="opacity-70">
                      Browse millions of products from our curated list of
                      suppliers and add them to your import list with one click.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-5">
                  <div>
                    <BsFill2CircleFill className="text-3xl text-green-500 " />
                  </div>
                  <div>
                    <h2 className="font-semibold text-2xl">Build Your Site</h2>
                    <p className="opacity-70">
                      Customize your storefront with our intuitive drag-and-drop
                      editor. Choose a theme, add your logo, and you're ready to
                      go.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-5">
                  <div>
                    <BsFill3CircleFill className="text-3xl text-green-500 " />
                  </div>
                  <div>
                    <h2 className="font-semibold text-2xl">Start Selling</h2>
                    <p className="opacity-70">
                      Launch marketing campaigns and start accepting orders.
                      We'll handle inventory and shipping so you can focus on
                      growth.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* CTA Section */}
          <div className="w-full flex justify-center py-20 ">
            <div className="w-[90%] md:w-[80%] lg:w-[70%] bg-gray-50 bg-linear-to-r rounded-3xl py-14 px-6 flex flex-col items-center text-center shadow-lg">
              <h1 className="text-3xl md:text-4xl font-bold text-black">
                Ready to Start Your Dropshipping Journey?
              </h1>

              <p className="text-gray-500 mt-4 md:w-[70%]">
                Join thousands of entrepreneurs and build your own successful
                online business today. No credit card required.
              </p>

              <button className="mt-8 bg-[#44ff00] text-white font-semibold px-8 py-3 rounded-lg hover:bg-[#00b3e6] transition">
                Get Started For Free
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Footer Section */}
      <footer className="w-full bg-gray-900 text-gray-300 py-12 mt-10">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-white">DropShipPro</h2>
            <p className="mt-3 opacity-70">
              Build your dropshipping business in minutes. Powerful tools
              designed for your success.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li className="hover:text-white cursor-pointer">Home</li>
              <li className="hover:text-white cursor-pointer">Features</li>
              <li className="hover:text-white cursor-pointer">Pricing</li>
              <li className="hover:text-white cursor-pointer">Contact</li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Support</h3>
            <ul className="space-y-2">
              <li className="hover:text-white cursor-pointer">Help Center</li>
              <li className="hover:text-white cursor-pointer">FAQs</li>
              <li className="hover:text-white cursor-pointer">Shipping Info</li>
              <li className="hover:text-white cursor-pointer">
                Terms & Policy
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              Stay Updated
            </h3>
            <p className="opacity-70">Get updates on new features and tips.</p>

            <div className="flex items-center mt-4">
              <input
                type="email"
                className="w-full px-4 py-2 rounded-l-lg bg-gray-800 text-gray-200 outline-none"
                placeholder="Enter your email"
              />
              <button className="bg-green-500 px-4 py-2 rounded-r-lg text-white font-semibold hover:bg-green-600">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-5 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} DropShipPro — All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
