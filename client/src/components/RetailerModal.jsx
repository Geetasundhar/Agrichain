import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function RetailerModal({ isOpen, onClose }) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Modal Content */}
        <div
          className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md mx-4 z-60"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{t("retailerModal.title")}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <p className="text-gray-600 mb-6 text-center">
            {t("retailerModal.subtitle")}
          </p>

          <div className="space-y-4">
            {/* Signup Button */}
            <Link
              to="/retailer/signup"
              onClick={onClose}
              className="block w-full bg-[#132a13] hover:bg-[#31572c] text-[#ecf39e] font-bold py-3 px-4 rounded-lg text-center transition"
            >
              {t("retailerModal.signupBtn")}
            </Link>

            {/* Login Button */}
            <Link
              to="/retailer/login"
              onClick={onClose}
              className="block w-full bg-[#4f772d] hover:bg-[#31572c] text-[#ecf39e] font-bold py-3 px-4 rounded-lg text-center transition"
            >
              {t("retailerModal.loginBtn")}
            </Link>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-4 rounded-lg text-center transition"
            >
              {t("retailerModal.closeBtn")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}