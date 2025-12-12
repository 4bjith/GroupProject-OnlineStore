import { Link } from "react-router-dom";
import { FiLogIn, FiUserPlus, FiX } from "react-icons/fi";
import { useState } from "react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="w-full flex justify-center">
        <div className="w-full md:w-[760px] lg:w-[1000px] xl:w-[1200px] h-[12vh] flex justify-between items-center px-5 md:px-0">

          {/* Left Side */}
          <div className="flex gap-6 items-center">

            {/* Hamburger Icon */}
            <div
              onClick={() => setIsOpen(!isOpen)}
              className="flex flex-col gap-1 lg:hidden cursor-pointer"
            >
              <span className="w-6 h-[3px] bg-black"></span>
              <span className="w-6 h-[3px] bg-black"></span>
              <span className="w-6 h-[3px] bg-black"></span>
            </div>

            {/* Logo */}
            <h1 className="text-[1.4rem] font-bold mr-7">Logo</h1>

            {/* Desktop Menu */}
            <div className="hidden lg:flex">
              <Navmenu />
            </div>
          </div>

          {/* Right Buttons */}
          <div className="flex gap-5">
            <Link to={"/login"}>
              <div  className="text-[0.8rem] md:text-[1rem] rounded-lg bg-gray-50 shadow-sm flex justify-center items-center gap-2 px-2 lg:px-4 py-2 cursor-pointer">
              <p>Sign in</p>
              <FiLogIn />
            </div>
            </Link>
            <Link to={"/register"}>
              <div className="text-[0.8rem] md:text-[1rem] rounded-lg bg-gray-50 shadow-sm flex justify-center items-center gap-2 px-2 lg:px-4 py-2 cursor-pointer">
              <p>Sign up</p>
              <FiUserPlus />
            </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <Navmenu mobile onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}

export default Navbar;



// -----------------------------
// NAVMENU COMPONENT
// -----------------------------
function Navmenu({ mobile = false, onClose }) {
  return (
    <div
      className={`${
        mobile
          ? "lg:hidden flex flex-col w-full bg-green-50 py-5 px-6 shadow-md absolute top-0 left-0 gap-6 font-semibold"
          : "flex items-center gap-7 font-semibold"
      }`}
    >
      {/* Close Button for Mobile */}
      {mobile && (
        <div className="flex justify-end w-full mb-2">
          <FiX
            className="text-2xl cursor-pointer"
            onClick={onClose}
          />
        </div>
      )}

      <Link to="/" onClick={onClose}>
        <span className="text-[1.2rem] text-gray-800 hover:text-green-800 hover:scale-110 cursor-pointer">
          Home
        </span>
      </Link>

      <Link to="/" onClick={onClose}>
        <span className="text-[1.1rem] text-gray-700 hover:text-green-700 hover:scale-110 cursor-pointer">
          About
        </span>
      </Link>

      <Link to="/" onClick={onClose}>
        <span className="text-[1rem] text-gray-600 hover:text-green-600 hover:scale-110 cursor-pointer">
          Contact
        </span>
      </Link>
    </div>
  );
}
