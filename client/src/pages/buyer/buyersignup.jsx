import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const API = import.meta.env.VITE_API_BASE_URL;

export default function BuyerSignup() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    buyer_name: "",
    business_name: "",
    district: "",
    phone: "",
    email: "",
    username: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API}/buyer/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Signup failed");
        return;
      }

      alert("Signup successful 🎉");
      navigate("/buyer/login");
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fad9]">
      <Navbar />

      {/* Title */}
      <h2 className="text-center text-4xl font-bold text-[#132a13] pt-32 mb-10">
        AgriChain
      </h2>

      <main className="flex justify-center flex-grow px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white w-full max-w-lg rounded-3xl shadow-xl p-8 space-y-5"
        >
          <Input
            label={t("buyerSignup.name")}
            name="buyer_name"
            value={form.buyer_name}
            onChange={handleChange}
          />

          <Input
            label={t("buyerSignup.business")}
            name="business_name"
            value={form.business_name}
            onChange={handleChange}
          />

          <Input
            label={t("buyerSignup.district")}
            name="district"
            value={form.district}
            onChange={handleChange}
          />

          <Input
            label={t("buyerSignup.phone")}
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />

          <Input
            label={t("buyerSignup.email")}
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />

          <Input
            label={t("buyerSignup.username")}
            name="username"
            value={form.username}
            onChange={handleChange}
          />

          <Input
            label={t("buyerSignup.password")}
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="w-full bg-[#132a13] text-[#ecf39e]
                       py-3 rounded-xl font-bold
                       hover:bg-[#31572c] transition-all"
          >
            {t("buyerSignup.signup")}
          </button>

          <p className="text-center text-sm text-[#31572c]">
            {t("buyerSignup.already")}{" "}
            <span
              className="font-semibold text-[#132a13] cursor-pointer"
              onClick={() => navigate("/buyer/login")}
            >
              {t("buyerSignup.login")}
            </span>
          </p>
        </form>
      </main>

      <Footer />
    </div>
  );
}

/* Reusable Input */
function Input({ label, ...props }) {
  return (
    <input
      {...props}
      placeholder={label}
      className="input"
      required
    />
  );
}
