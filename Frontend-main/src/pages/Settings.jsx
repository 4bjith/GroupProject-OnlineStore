import { useState } from "react";
import { FcSettings } from "react-icons/fc";
import { BiBell, BiGlobe, BiMoon, BiLock, BiFace, BiSupport, BiTrash, BiCheck, BiX, BiEdit, BiCog } from "react-icons/bi";
import { BsCreditCard, BsFileText, BsClockHistory, BsShieldLock, BsPhone } from "react-icons/bs";
import { RiLogoutBoxRLine } from "react-icons/ri";
import authStore from "../AuthStore";
import Profile from "../components/Profile";
import AccountDetails from "../components/AccountDetails";
import Transaction from "../components/Transaction";

/* ================= ICONS & MENU DATA ================= */
const MENU_ITEMS = [
  { key: "edit-profile", label: "Profile", icon: <BiEdit /> },
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
      case 'payments':
        return <AccountDetails />;
      case 'transactions':
        return <Transaction />;
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
          <div className="flex items-center gap-3 mb-4 md:mb-8 px-2">
            <BiCog className="text-3xl text-indigo-900" />
            <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
          </div>

          {/* Scrollable Horizontal Menu on Mobile, Vertical on Desktop */}
          <nav className="flex overflow-x-auto md:flex-col gap-1 pb-4 md:pb-0 scrollbar-hide">
            {MENU_ITEMS.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`flex-shrink-0 whitespace-nowrap px-3 py-2 rounded-lg font-medium transition-all text-sm flex items-center gap-3 ${activeTab === item.key
                  ? "bg-indigo-50 text-indigo-900 font-bold border-b-2 md:border-b-0 md:border-l-4 border-indigo-900"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  }`}
              >
                {item.icon && <span className="text-lg">{item.icon}</span>}
                {item.label}
              </button>
            ))}
            <button
              className="w-full text-[15px] flex text-left px-4 py-3 text-red-600 font-bold  md:mt-10 hover:bg-red-50 rounded-lg transition  md:flex items-center gap-2"
              onClick={logout}
            >
              <RiLogoutBoxRLine /> Logout
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 w-full min-w-0">
          {renderActiveTabContent()}
        </main>
      </div>
    </div>
  );
}

export default Settings;
