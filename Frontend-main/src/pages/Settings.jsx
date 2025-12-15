import { useState } from "react";
import { FcSettings } from "react-icons/fc";
import { RiArrowDropDownLine } from "react-icons/ri";
import Profile from "../components/Profile";

function Settings() {

    const [open, setOpen] = useState("personalisation");
    
    return (
        <div className="w-full h-full ">
            <div className="flex items-center ">
                <h1 className="text-5xl font-bold p-10">Settings</h1>
                <FcSettings className="text-8xl absolute right-20 top-16" />
            </div>
          
             <div className="flex w-full transition-all ">
                <div className="w-[25%] flex flex-col gap-3 relative m-3">
                    <div className=" hover:bg-gray-200 hover:rounded-lg p-2 flex justify-between">
                        <button onClick={()=>setOpen("personalisation")} className="relative text-xl font-semibold  transition-transform duration-300 hover:translate-x-2"> 
                            personalisation
                            <RiArrowDropDownLine className="absolute left-55 top-0 text-3xl  transition-transform duration-300 hover:translate-x-1 md:rotate-270" />
                        </button>
                    </div>
                    <div className="  hover:bg-gray-200 hover:rounded-lg p-2 flex justify-between">
                        <button onClick={()=>setOpen("notifications")} className="relative text-xl font-semibold  transition-transform duration-300 hover:translate-x-2 ">
                            notifications
                            <RiArrowDropDownLine className="absolute left-55 top-0 text-3xl  transition-transform duration-300 hover:translate-x-1 md:rotate-270" />
                        </button>
                    </div>
                    <div className=" hover:bg-gray-200 hover:rounded-lg p-2 flex justify-between">
                        <button onClick={()=>setOpen("privacy")} className="relative text-xl font-semibold  transition-transform duration-300 hover:translate-x-2 ">
                            privacy
                            <RiArrowDropDownLine className="absolute left-55 top-0 text-3xl  transition-transform duration-300 hover:translate-x-1 md:rotate-270" />
                        </button>
                    </div>
                    <div className="  hover:bg-gray-200 hover:rounded-lg p-2 flex justify-between">
                        <button onClick={()=>setOpen("help")} className="relative text-xl font-semibold  transition-transform duration-300 hover:translate-x-2 ">
                            help
                            <RiArrowDropDownLine className="absolute left-55 top-0 text-3xl  transition-transform duration-300 hover:translate-x-1 md:rotate-270" />
                        </button>
                    </div>
                    <div className="  hover:bg-gray-200 hover:rounded-lg p-2 flex justify-between">
                        <button onClick={()=>setOpen("about")} className="relative text-xl font-semibold  transition-transform duration-300 hover:translate-x-2 ">
                            about
                            <RiArrowDropDownLine className="absolute left-55 top-0 text-3xl  transition-transform duration-300 hover:translate-x-1 md:rotate-270" />
                        </button>
                    </div>
                    <div className="  hover:bg-gray-200 hover:rounded-lg p-2 flex justify-between">
                        <button onClick={()=>setOpen("logout")} className="relative text-xl font-semibold  transition-transform duration-300 hover:translate-x-2 ">
                            logout
                            <RiArrowDropDownLine className="absolute left-55 top-0 text-3xl  transition-transform duration-300 hover:translate-x-1 md:rotate-270" />
                        </button>
                    </div>
                </div>
                <div className="w-[75%]">
                    {open==="personalisation" && <div className="w-full h-full m-5 "><Profile/></div>}
                    {open==="notifications" && <div className="w-full h-full m-2"><p>notifications</p></div>}
                    {open==="privacy" && <div className="w-full h-full m-2"><p>privacy</p></div>}
                    {open==="help" && <div className="w-full h-full m-2"><p>help</p></div>}
                    {open==="about" && <div className="w-full h-full m-2"><p>about</p></div>}
                    {open==="logout" && <div className="w-full h-full m-2"><p>logout</p></div>}
                </div>
            </div>
            
           </div>
       
    );
}

export default Settings;
