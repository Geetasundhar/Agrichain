import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useTranslation } from "react-i18next";

export default function Signup() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#f8fad9] flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-16 px-4 pt-32">
        <div className="bg-white w-full max-w-3xl rounded-3xl shadow-xl p-10">
          <h2 className="text-3xl font-bold text-center text-[#132a13] mb-8">
            {t("signup.title")}
          </h2>

          <form className="grid md:grid-cols-2 gap-6">

            <input
              type="text"
              placeholder={t("signup.fullName")}
              className="input"
            />

            <input
              type="text"
              placeholder={t("signup.username")}
              className="input"
            />

            <input
              type="email"
              placeholder={t("signup.email")}
              className="input"
            />

            <input
              type="text"
              placeholder={t("signup.phone")}
              className="input"
            />

            <input
              type="number"
              placeholder={t("signup.age")}
              className="input"
            />

            <select className="input">
              <option value="">{t("signup.gender.select")}</option>
              <option>{t("signup.gender.male")}</option>
              <option>{t("signup.gender.female")}</option>
              <option>{t("signup.gender.other")}</option>
            </select>

            <input
              type="text"
              placeholder={t("signup.farmName")}
              className="input"
            />

            <input
              type="number"
              placeholder={t("signup.farmSize")}
              className="input"
            />

            <input
              type="text"
              placeholder={t("signup.cropType")}
              className="input"
            />

            <textarea
              rows="2"
              placeholder={t("signup.farmAddress")}
              className="input md:col-span-2"
            />

            <input
              type="password"
              placeholder={t("signup.password")}
              className="input"
            />

            <input
              type="file"
              className="input"
            />

            <button
              type="button"
              className="md:col-span-2 bg-[#132a13] text-[#ecf39e]
                         py-4 rounded-xl font-semibold
                         hover:bg-[#31572c] transition-all"
            >
              {t("signup.button")}
            </button>
          </form>

          <p className="text-center text-sm mt-6 text-[#31572c]">
            {t("signup.haveAccount")}{" "}
            <span
              onClick={() => navigate("/farmer/login")}
              className="text-[#132a13] font-semibold cursor-pointer"
            >
              {t("signup.login")}
            </span>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
