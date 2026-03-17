import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RoleModal from "../components/RoleModal";

// env variable
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export default function Home() {
  const { t } = useTranslation();   // ✅ correct hook usage
  const navigate = useNavigate();

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [actionType, setActionType] = useState(""); // login | signup

  const handleGetStarted = () => {
    setActionType("signup");
    setShowRoleModal(true);
  };

  const handleRoleSelect = (role) => {
    setShowRoleModal(false);
    navigate(`/${role}/${actionType}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fad9]">
      <Navbar />

      {/* -------- Hero Section -------- */}
      <main className="pt-18 flex-grow">
        <section className="bg-gradient-to-br from-[#132a13] to-[#31572c] text-[#ecf39e] py-28">
          <div className="max-w-[1250px] mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              {t("welcome")}{" "}
              <span className="text-[#90a955]">{t("Agrichain")}</span>
            </h1>

            <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-[#e9eedd]">
              {t("tagline")}
            </p>

            <button
              onClick={handleGetStarted}
              className="bg-[#ecf39e] text-[#132a13] font-semibold
                         px-10 py-4 rounded-xl shadow-lg
                         hover:bg-[#dbeccd] hover:scale-105
                         transition-all duration-300"
            >
              {t("getStarted")}
            </button>
          </div>
        </section>

        {/* -------- About Section -------- */}
       <section className="py-20 bg-[#fbfdec]">
  <div className="max-w-[1100px] mx-auto px-6 text-center">
    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#132a13]">
      {t("whyTitle")}
    </h2>

    <p className="text-lg text-[#31572c] leading-relaxed max-w-3xl mx-auto">
      {t("whyDesc")}
    </p>
  </div>
</section>


       {/* -------- Features Section -------- */}
<section className="py-20 bg-[#f8fad9]">
  <div className="max-w-[1250px] mx-auto px-6">
    <h2 className="text-3xl md:text-4xl font-bold text-center text-[#132a13] mb-14">
      {t("featuresTitle")}
    </h2>

    <div className="grid gap-8 md:grid-cols-3">
      {[
        {
          title: t("feature1Title"),
          desc: t("feature1Desc"),
        },
        {
          title: t("feature2Title"),
          desc: t("feature2Desc"),
        },
        {
          title: t("feature3Title"),
          desc: t("feature3Desc"),
        },
      ].map((item, index) => (
        <div
          key={index}
          className="bg-white p-8 rounded-2xl shadow-md
                     hover:shadow-xl hover:-translate-y-1
                     transition-all duration-300"
        >
          <h3 className="text-xl font-bold mb-4 text-[#4f772d]">
            {item.title}
          </h3>
          <p className="text-[#31572c]">{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>

        {/* -------- How It Works Section -------- */}
<section className="py-24 bg-[#fbfdec]">
  <div className="max-w-[1250px] mx-auto px-6 text-center">
    <h2 className="text-3xl md:text-4xl font-bold text-[#132a13] mb-16">
      {t("howTitle")}
    </h2>

    <div className="grid gap-10 md:grid-cols-3">
      {[
        {
          step: "01",
          title: t("step1Title"),
          desc: t("step1Desc"),
        },
        {
          step: "02",
          title: t("step2Title"),
          desc: t("step2Desc"),
        },
        {
          step: "03",
          title: t("step3Title"),
          desc: t("step3Desc"),
        },
      ].map((item, index) => (
        <div
          key={index}
          className="bg-white p-10 rounded-2xl shadow-lg
                     hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
        >
          <div className="text-5xl font-extrabold text-[#90a955] mb-4">
            {item.step}
          </div>
          <h3 className="text-xl font-bold mb-3 text-[#31572c]">
            {item.title}
          </h3>
          <p className="text-[#4f772d]">{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* -------- Users Section -------- */}
<section className="py-24 bg-[#f8fad9]">
  <div className="max-w-[1250px] mx-auto px-6">
    <h2 className="text-3xl md:text-4xl font-bold text-center text-[#132a13] mb-14">
      {t("usersTitle")}
    </h2>

    <div className="grid gap-8 md:grid-cols-3">
      {[
        {
          title: t("usersFarmerTitle"),
          desc: t("usersFarmerDesc"),
        },
        {
          title: t("usersBuyerTitle"),
          desc: t("usersBuyerDesc"),
        },
        {
          title: t("usersInsurerTitle"),
          desc: t("usersInsurerDesc"),
        },
      ].map((item, index) => (
        <div
          key={index}
          className="bg-white border border-[#dde5b6]
                     p-8 rounded-2xl shadow-md
                     hover:shadow-xl transition-all duration-300 text-center"
        >
          <h3 className="text-2xl font-bold mb-4 text-[#4f772d]">
            {item.title}
          </h3>
          <p className="text-[#31572c]">{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>


{/* -------- Final CTA Section (Redesigned) -------- */}
<section className="py-28 bg-gradient-to-br from-[#132a13] via-[#31572c] to-[#4f772d]">
  <div className="max-w-[1250px] mx-auto px-6">
    <div
      className="grid md:grid-cols-2 gap-12 items-center
                 bg-white/10 backdrop-blur-lg
                 rounded-3xl p-12 shadow-2xl"
    >
      {/* Left Content */}
      <div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#ecf39e] mb-6 leading-tight">
          {t("ctaTitle")} <br />
          <span className="text-[#dde5b6]">
            {t("ctaSubtitle")}
          </span>
        </h2>

        <p className="text-lg text-[#f1f6c7] mb-10 max-w-xl">
          {t("ctaDesc")}
        </p>

        <div className="flex flex-wrap gap-5">
          <button
            onClick={handleGetStarted}
            className="bg-[#ecf39e] text-[#132a13]
                       px-10 py-4 rounded-xl font-semibold
                       shadow-lg hover:scale-105
                       transition-all duration-300"
          >
            {t("getStarted")}
          </button>

          {/* <button
            onClick={() => navigate("/login")}
            className="border-2 border-[#ecf39e] text-[#ecf39e]
                       px-10 py-4 rounded-xl font-semibold
                       hover:bg-[#ecf39e] hover:text-[#132a13]
                       transition-all duration-300"
          >
            {t("buyerLogin.login")}
          </button> */}
        </div>
      </div>

      {/* Right Visual Card */}
      <div className="relative">
        <div
          className="bg-gradient-to-br from-[#ecf39e] to-[#dde5b6]
                     text-[#132a13]
                     rounded-2xl p-10 shadow-xl"
        >
          <h3 className="text-2xl font-bold mb-6">
            {t("whyJoin")}
          </h3>

          <ul className="space-y-4 text-lg">
            <li>🌾 {t("ctaPoint1")}</li>
            <li>🔗 {t("ctaPoint2")}</li>
            <li>🛡️ {t("ctaPoint3")}</li>
            <li>⚡ {t("ctaPoint4")}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</section>

{/* -------- Feedback / Testimonials Section -------- */}
<section className="py-24 bg-[#f8fad9]">
  <div className="max-w-[1250px] mx-auto px-6">
    <h2 className="text-3xl md:text-4xl font-bold text-center text-[#132a13] mb-14">
      {t("feedbackTitle")}
    </h2>

    {/* Testimonials */}
    <div className="grid gap-10 md:grid-cols-3 mb-20">
      {[
        {
          name: "R. Kumar",
          role: t("feedbackRoleFarmer"),
          feedback: t("feedback1"),
        },
        {
          name: "Anita Sharma",
          role: t("feedbackRoleBuyer"),
          feedback: t("feedback2"),
        },
        {
          name: "V. Prakash",
          role: t("feedbackRoleInsurance"),
          feedback: t("feedback3"),
        },
      ].map((item, index) => (
        <div
          key={index}
          className="bg-white p-8 rounded-2xl shadow-md
                     hover:shadow-xl transition-all duration-300"
        >
          <p className="text-[#31572c] text-lg mb-6 leading-relaxed">
            “{item.feedback}”
          </p>

          <div className="border-t pt-4">
            <h4 className="font-bold text-[#132a13]">{item.name}</h4>
            <p className="text-sm text-[#4f772d]">{item.role}</p>
          </div>
        </div>
      ))}
    </div>

    {/* Feedback Form */}
    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-10">
      <h3 className="text-2xl font-bold text-[#132a13] text-center mb-8">
        {t("shareFeedback")}
      </h3>

      <form className="space-y-6">
        <div>
          <label className="block text-[#31572c] font-medium mb-2">
            {t("yourName")}
          </label>
          <input
            type="text"
            placeholder={t("namePlaceholder")}
            className="w-full px-4 py-3 border rounded-xl
                       focus:outline-none focus:ring-2
                       focus:ring-[#90a955]"
          />
        </div>

        <div>
          <label className="block text-[#31572c] font-medium mb-2">
            {t("yourRole")}
          </label>
          <select
            className="w-full px-4 py-3 border rounded-xl
                       focus:outline-none focus:ring-2
                       focus:ring-[#90a955]"
          >
            <option>{t("roleFarmer")}</option>
            <option>{t("roleBuyer")}</option>
            <option>{t("roleInsurance")}</option>
            <option>{t("roleOther")}</option>
          </select>
        </div>

        <div>
          <label className="block text-[#31572c] font-medium mb-2">
            {t("yourFeedback")}
          </label>
          <textarea
            rows="4"
            placeholder={t("feedbackPlaceholder")}
            className="w-full px-4 py-3 border rounded-xl
                       focus:outline-none focus:ring-2
                       focus:ring-[#90a955]"
          />
        </div>

        <div className="text-center pt-4">
          <button
            type="button"
            className="bg-[#132a13] text-[#ecf39e]
                       px-10 py-4 rounded-xl font-semibold
                       shadow-lg hover:bg-[#31572c]
                       transition-all duration-300"
          >
            {t("submitFeedback")}
          </button>
        </div>
      </form>
    </div>
  </div>
</section>


      </main>
      <RoleModal
  isOpen={showRoleModal}
  onClose={() => setShowRoleModal(false)}
  onSelect={handleRoleSelect}
/>


      <Footer />
    </div>
  );
}
