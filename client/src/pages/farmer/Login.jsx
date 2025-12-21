import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useTranslation } from "react-i18next";

export default function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#f8fad9] flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4 pt-32">
        <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-10">
          <h2 className="text-3xl font-bold text-center text-[#132a13] mb-8">
            {t("login.title")}
          </h2>

          <form className="space-y-6">
            {/* Email */}
            <input
              type="email"
              placeholder={t("login.email")}
              className="input"
            />

            {/* Password */}
            <input
              type="password"
              placeholder={t("login.password")}
              className="input"
            />

            {/* Login Button */}
            <button
              type="button"
              className="w-full bg-[#132a13] text-[#ecf39e]
                         py-4 rounded-xl font-semibold
                         hover:bg-[#31572c] transition-all"
            >
              {t("login.button")}
            </button>
          </form>

          <p className="text-center text-sm mt-6 text-[#31572c]">
            {t("login.noAccount")}{" "}
            <span
              onClick={() => navigate("/farmer/signup")}
              className="text-[#132a13] font-semibold cursor-pointer"
            >
              {t("login.signup")}
            </span>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
