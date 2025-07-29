import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  return (
    <nav className="bg-purple-950 py-3 px-5">
      <div className="flex items-center justify-between">
        {/* Logo or Title */}
        <div className="text-white text-2xl font-semibold">Portfolio Pulse</div>

        {/* Hamburger Menu */}
        <button className="text-white text-2xl md:hidden" onClick={toggleMenu}>
          {isOpen ? "×" : "☰"}
        </button>

        {/* Navigation Links */}
        <ul
          className={`md:flex md:items-center md:space-x-8 space-y-4 md:space-y-0 list-none m-0 p-0 absolute md:relative md:bg-transparent bg-purple-950 md:py-0 py-4 md:px-0 px-5 top-14 right-0 md:top-auto md:right-auto transition-all duration-300 ease-in-out ${
            isOpen ? "block w-full" : "hidden"
          }`}
        >
          <li className="w-full">
            <Link
              to="/"
              className="text-white text-lg font-semibold hover:bg-purple-900 p-2 rounded-lg block w-full text-center"
              onClick={closeMenu}
            >
              Dashboard
            </Link>
          </li>
          <li className="w-full">
            <Link
              to="/asset"
              className="text-white text-lg font-semibold hover:bg-purple-900 p-2 rounded-lg block w-full text-center"
              onClick={closeMenu}
            >
              Asset
            </Link>
          </li>
          <li className="w-full">
            <Link
              to="/transaction"
              className="text-white text-lg font-semibold hover:bg-purple-900 p-2 rounded-lg block w-full text-center"
              onClick={closeMenu}
            >
              Transaction
            </Link>
          </li>
          <li className="w-full">
            <Link
              to="/transrec"
              className="text-white text-lg font-semibold hover:bg-purple-900 p-2 rounded-lg block w-full text-center"
              onClick={closeMenu}
            >
              TransRec
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
