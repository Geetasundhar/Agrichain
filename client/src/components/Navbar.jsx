import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    "Home",
    "About",
    "Farmer",
    "Buyer",
    "Admin",
    "Transporter",
    "Insurance",
  ];

  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-[#132a13] shadow-lg">
      <div className="max-w-[1250px] mx-auto flex items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link to="client\public\images\logo.png" className="flex items-center gap-3">
          <img
            src="/images/logo.png"
            alt="AgriChain Logo"
            className="h-11"
          />
          <span className="text-[#ecf39e] font-bold text-2xl">
            AgriChain
          </span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link}
              to={`/${link.toLowerCase()}`}
              className="text-[#ecf39e] font-medium px-3 py-2 rounded-md
                         hover:bg-[#ecf39e] hover:text-[#132a13]
                         transition"
            >
              {link}
            </Link>
          ))}
        </nav>

        {/* Desktop Language Buttons */}
        <div className="hidden md:flex gap-2">
          {["EN", "TA"].map((lang) => (
            <button
              key={lang}
              className="bg-[#4f772d] text-[#ecf39e]
                         px-3 py-1 rounded-md text-sm font-semibold
                         hover:bg-[#31572c] transition"
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Hamburger Icon */}
        <button
          className="md:hidden text-[#ecf39e] text-3xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#132a13] border-t border-[#31572c]">
          <nav className="flex flex-col px-6 py-4 gap-4">
            {links.map((link) => (
              <Link
                key={link}
                to={`/${link.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="text-[#ecf39e] font-medium py-2 rounded-md
                           hover:bg-[#ecf39e] hover:text-[#132a13]
                           transition"
              >
                {link}
              </Link>
            ))}

            {/* Mobile Language Buttons */}
            <div className="flex gap-3 pt-3 border-t border-[#31572c]">
              {["EN", "TA"].map((lang) => (
                <button
                  key={lang}
                  className="bg-[#4f772d] text-[#ecf39e]
                             px-4 py-1 rounded-md text-sm font-semibold
                             hover:bg-[#31572c] transition"
                >
                  {lang}
                </button>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
