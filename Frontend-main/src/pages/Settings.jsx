import { useState } from "react";
import { FcSettings } from "react-icons/fc";
import { BiBell, BiGlobe, BiMoon, BiLock, BiFace, BiSupport, BiTrash, BiCheck, BiX } from "react-icons/bi";
import { BsCreditCard, BsFileText, BsClockHistory, BsShieldLock, BsPhone } from "react-icons/bs";
import { RiLogoutBoxRLine } from "react-icons/ri";
import authStore from "../AuthStore";
import Profile from "../components/Profile";

/* ================= ICONS & MENU DATA ================= */
const MENU_ITEMS = [
  { key: "edit-profile", label: "Edit Profile", icon: null }, // Special handling in UI if needed
  { key: "language", label: "Language", icon: <BiGlobe /> },
  { key: "notification", label: "Notification", icon: <BiBell /> },
  { key: "payments", label: "Payments", icon: <BsCreditCard /> },
  { key: "taxes", label: "Taxes", icon: <BsFileText /> },
  { key: "transactions", label: "Transactions", icon: <BsClockHistory /> },
  { key: "password", label: "Password", icon: <BiLock /> },
  { key: "access", label: "Access", icon: <BsShieldLock /> },
  { key: "sessions", label: "Sessions", icon: <BsPhone /> },
];

function Settings() {
  const logout = authStore((state) => state.logout);
  const [activeTab, setActiveTab] = useState("edit-profile");

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'edit-profile':
        return <Profile />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 bg-white rounded-xl border border-gray-100 p-8 shadow-sm">
            <span className="text-4xl mb-4">🚧</span>
            <p className="text-lg font-medium">Content for {activeTab} coming soon</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] font-sans">
      <div className="max-w-7xl mx-auto pt-4 md:pt-10 px-4 md:px-6 flex flex-col md:flex-row gap-6 md:gap-12">

        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="flex items-center gap-2 mb-4 md:mb-8">
            <div className="h-8 w-2 bg-indigo-900 rounded-r-md hidden md:block"></div>
            <h1 className="text-2xl font-bold text-gray-800 md:hidden">Settings</h1>
          </div>

          {/* Scrollable Horizontal Menu on Mobile, Vertical on Desktop */}
          <nav className="flex overflow-x-auto md:flex-col gap-2 pb-4 md:pb-0 scrollbar-hide">
            {MENU_ITEMS.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`flex-shrink-0 whitespace-nowrap px-4 py-2 md:py-3 rounded-lg font-medium transition-all text-sm md:text-base text-left flex items-center gap-3 ${activeTab === item.key
                    ? "bg-indigo-50 text-indigo-900 font-bold border-b-2 md:border-b-0 md:border-l-4 border-indigo-900"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  }`}
              >
                {item.icon && <span className="text-xl">{item.icon}</span>}
                {item.label}
              </button>
            ))}
          </nav>

          <button
            className="w-full text-left px-4 py-3 text-red-600 font-bold mt-4 md:mt-10 hover:bg-red-50 rounded-lg transition hidden md:flex items-center gap-2"
            onClick={logout}
          >
            <RiLogoutBoxRLine /> Delete account
          </button>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 w-full min-w-0">
          {renderActiveTabContent()}
        </main>

        {/* Right Side Widget (Desktop Only) */}
        <div className="hidden xl:block w-80 space-y-6 flex-shrink-0">
          {/* Completion Widget */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold mb-4">Complete your profile</h3>
            <div className="flex justify-center mb-6">
              <div className="relative w-24 h-24 rounded-full border-8 border-gray-100 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-700">90%</span>
                <div className="absolute top-0 left-0 w-full h-full rounded-full border-8 border-t-amber-600 border-r-amber-600 border-b-transparent border-l-transparent transform -rotate-45"></div>
              </div>
            </div>
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3 text-gray-800 font-medium">
                <BiCheck className="text-xl text-gray-900" />
                <span>Setup account <span className="text-gray-400 font-normal ml-auto">20%</span></span>
              </div>
              <div className="flex items-center gap-3 text-gray-800 font-medium">
                <BiCheck className="text-xl text-gray-900" />
                <span>Upload your photo <span className="text-gray-400 font-normal ml-auto">10%</span></span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <BiX className="text-xl" />
                <span>Personal Info <span className="text-gray-300 font-normal ml-auto">10%</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Logout Button (Bottom) */}
      <div className="md:hidden p-6 pb-20">
        <button
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 font-bold bg-white border border-gray-100 shadow-sm rounded-xl hover:bg-red-50 transition"
          onClick={logout}
        >
          <RiLogoutBoxRLine /> Logout
        </button>
      </div>
    </div>
  );
}

export default Settings;
