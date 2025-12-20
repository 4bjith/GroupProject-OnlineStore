// import { useState } from "react";
// import { FcSettings } from "react-icons/fc";
// import { RiArrowDropDownLine } from "react-icons/ri";
// import Profile from "../components/Profile";

// function Settings() {

//     const [open, setOpen] = useState("personalisation");
    
//     return (
//         <div className="w-full h-full ">
//             <div className="flex items-center ">
//                 <h1 className="text-5xl font-bold p-10">Settings</h1>
//                 <FcSettings className="text-8xl absolute right-20 top-16" />
//             </div>
          
//              <div className="flex w-full transition-all ">
//                 <div className="w-[25%] flex flex-col gap-3 relative m-3">
//                     <div className=" hover:bg-gray-200 hover:rounded-lg p-2 flex justify-between">
//                         <button onClick={()=>setOpen("personalisation")} className="relative text-xl font-semibold  transition-transform duration-300 hover:translate-x-2"> 
//                             personalisation
//                             <RiArrowDropDownLine className="absolute left-55 top-0 text-3xl  transition-transform duration-300 hover:translate-x-1 md:rotate-270" />
//                         </button>
//                     </div>
//                     <div className="  hover:bg-gray-200 hover:rounded-lg p-2 flex justify-between">
//                         <button onClick={()=>setOpen("notifications")} className="relative text-xl font-semibold  transition-transform duration-300 hover:translate-x-2 ">
//                             notifications
//                             <RiArrowDropDownLine className="absolute left-55 top-0 text-3xl  transition-transform duration-300 hover:translate-x-1 md:rotate-270" />
//                         </button>
//                     </div>
//                     <div className=" hover:bg-gray-200 hover:rounded-lg p-2 flex justify-between">
//                         <button onClick={()=>setOpen("privacy")} className="relative text-xl font-semibold  transition-transform duration-300 hover:translate-x-2 ">
//                             privacy
//                             <RiArrowDropDownLine className="absolute left-55 top-0 text-3xl  transition-transform duration-300 hover:translate-x-1 md:rotate-270" />
//                         </button>
//                     </div>
//                     <div className="  hover:bg-gray-200 hover:rounded-lg p-2 flex justify-between">
//                         <button onClick={()=>setOpen("help")} className="relative text-xl font-semibold  transition-transform duration-300 hover:translate-x-2 ">
//                             help
//                             <RiArrowDropDownLine className="absolute left-55 top-0 text-3xl  transition-transform duration-300 hover:translate-x-1 md:rotate-270" />
//                         </button>
//                     </div>
//                     <div className="  hover:bg-gray-200 hover:rounded-lg p-2 flex justify-between">
//                         <button onClick={()=>setOpen("about")} className="relative text-xl font-semibold  transition-transform duration-300 hover:translate-x-2 ">
//                             about
//                             <RiArrowDropDownLine className="absolute left-55 top-0 text-3xl  transition-transform duration-300 hover:translate-x-1 md:rotate-270" />
//                         </button>
//                     </div>
//                     <div className="  hover:bg-gray-200 hover:rounded-lg p-2 flex justify-between">
//                         <button onClick={()=>setOpen("logout")} className="relative text-xl font-semibold  transition-transform duration-300 hover:translate-x-2 ">
//                             logout
//                             <RiArrowDropDownLine className="absolute left-55 top-0 text-3xl  transition-transform duration-300 hover:translate-x-1 md:rotate-270" />
//                         </button>
//                     </div>
//                 </div>
//                 <div className="w-[75%]">
//                     {open==="personalisation" && <div className="w-full h-full m-5 "><Profile/></div>}
//                     {open==="notifications" && <div className="w-full h-full m-2"><p>notifications</p></div>}
//                     {open==="privacy" && <div className="w-full h-full m-2"><p>privacy</p></div>}
//                     {open==="help" && <div className="w-full h-full m-2"><p>help</p></div>}
//                     {open==="about" && <div className="w-full h-full m-2"><p>about</p></div>}
//                     {open==="logout" && <div className="w-full h-full m-2"><p>logout</p></div>}
//                 </div>
//             </div>
            
//            </div>
       
//     );
// }

// export default Settings;








import { useState } from "react";
import { FcSettings } from "react-icons/fc";
import { RiArrowDropDownLine } from "react-icons/ri";
import Profile from "../components/Profile";

const MENU = [
  { key: "personalisation", label: "Personalisation" },
  { key: "notifications", label: "Notifications" },
  { key: "privacy", label: "Privacy" },
  { key: "help", label: "Help" },
  { key: "about", label: "About" },
  { key: "logout", label: "Logout" },
];

function Settings() {
  const [active, setActive] = useState("personalisation");
  const [mobileOpen, setMobileOpen] = useState(null);
  const [personalTab, setPersonalTab] = useState("profile");

  /* 🔹 SINGLE CONTENT RENDERER */
  const renderContent = (key) => {
    switch (key) {
      case "personalisation":
        return (
          <div className="space-y-4">
            <div className="flex gap-4 border-b pb-2">
              {["profile", "statement", "account"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setPersonalTab(tab)}
                  className={`capitalize font-medium pb-1 ${
                    personalTab === tab
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500"
                  }`}
                >
                  {tab.replace("-", " ")}
                </button>
              ))}
            </div>

            <div className="mt-4">
              {personalTab === "profile" && <Profile />}
              {personalTab === "statement" && <p>Statement Content</p>}
              {personalTab === "account" && <p>Account Details</p>}
            </div>
          </div>
        );

      case "notifications":
        return <p>Notification Settings</p>;
      case "privacy":
        return <p>Privacy Settings</p>;
      case "help":
        return <p>Help & Support</p>;
      case "about":
        return <p>About Application</p>;
      case "logout":
        return <p className="text-red-500">Logout Section</p>;
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="flex items-center justify-between p-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <FcSettings className="text-5xl" />
      </div>

      {/* ================= DESKTOP ================= */}
      <div className="hidden md:flex w-full">
        {/* SIDEBAR */}
        <aside className="w-[25%] bg-white shadow-sm p-4 space-y-2">
          {MENU.map((item) => (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              className={`w-full flex justify-between items-center px-4 py-3 rounded-lg font-medium transition ${
                active === item.key
                  ? "bg-blue-50 text-blue-600"
                  : "hover:bg-gray-100"
              }`}
            >
              {item.label}
              <RiArrowDropDownLine className="text-2xl rotate--90deg " />
            </button>
          ))}
        </aside>

        {/* CONTENT */}
        <main className="w-[75%] p-6">
          <div className="bg-white rounded-xl shadow p-6 min-h-[300px]">
            {renderContent(active)}
          </div>
        </main>
      </div>

      {/* ================= MOBILE ================= */}
      <div className="md:hidden p-4 space-y-3">
        {MENU.map((item) => (
          <div
            key={item.key}
            className="bg-white rounded-lg shadow"
          >
            <button
              onClick={() =>
                setMobileOpen(
                  mobileOpen === item.key ? null : item.key
                )
              }
              className="w-full flex justify-between items-center px-4 py-3 font-semibold"
            >
              {item.label}
              <RiArrowDropDownLine
                className={`text-2xl transition-transform ${
                  mobileOpen === item.key ? "rotate-180" : ""
                }`}
              />
            </button>

            {mobileOpen === item.key && (
              <div className="px-4 pb-4 text-sm text-gray-600 border-t">
                {renderContent(item.key)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Settings;
