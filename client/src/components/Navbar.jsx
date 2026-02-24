import { Link } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const links = [
    { key: "nav.home", path: "/" },
    { key: "nav.about", path: "/about" },
    { key: "nav.farmer", path: "/farmer/dashboard" },
    { key: "nav.buyer", path: "/buyer" },
    { key: "nav.admin", path: "/admin" },
    { key: "nav.transporter", path: "/transporter" },
   // { key: "nav.insurance", path: "/insurance" },
  ];

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-[#132a13] shadow-lg">
      <div className="max-w-[1250px] mx-auto flex items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
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
              key={link.key}
              to={link.path}
              className="text-[#ecf39e] font-medium px-3 py-2 rounded-md
                         hover:bg-[#ecf39e] hover:text-[#132a13]
                         transition"
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>

        {/* Desktop Language Buttons */}
        <div className="hidden md:flex gap-2">
          <button
            onClick={() => changeLanguage("en")}
            className={`px-3 py-1 rounded-md text-sm font-semibold transition
              ${i18n.language === "en"
                ? "bg-[#ecf39e] text-[#132a13]"
                : "bg-[#4f772d] text-[#ecf39e] hover:bg-[#31572c]"}`}
          >
            EN
          </button>

          <button
            onClick={() => changeLanguage("ta")}
            className={`px-3 py-1 rounded-md text-sm font-semibold transition
              ${i18n.language === "ta"
                ? "bg-[#ecf39e] text-[#132a13]"
                : "bg-[#4f772d] text-[#ecf39e] hover:bg-[#31572c]"}`}
          >
            TA
          </button>
        </div>

        {/* Hamburger */}
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
                key={link.key}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className="text-[#ecf39e] font-medium py-2 rounded-md
                           hover:bg-[#ecf39e] hover:text-[#132a13]
                           transition"
              >
                {t(link.key)}
              </Link>
            ))}

            {/* Mobile Language Buttons */}
            <div className="flex gap-3 pt-3 border-t border-[#31572c]">
              <button
                onClick={() => changeLanguage("en")}
                className={`px-4 py-1 rounded-md text-sm font-semibold transition
                  ${i18n.language === "en"
                    ? "bg-[#ecf39e] text-[#132a13]"
                    : "bg-[#4f772d] text-[#ecf39e] hover:bg-[#31572c]"}`}
              >
                EN
              </button>

              <button
                onClick={() => changeLanguage("ta")}
                className={`px-4 py-1 rounded-md text-sm font-semibold transition
                  ${i18n.language === "ta"
                    ? "bg-[#ecf39e] text-[#132a13]"
                    : "bg-[#4f772d] text-[#ecf39e] hover:bg-[#31572c]"}`}
              >
                TA
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
