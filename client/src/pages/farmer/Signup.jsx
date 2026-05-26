import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const API = import.meta.env.VITE_API_BASE_URL;

export default function Signup() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle submit
  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      console.log("📤 Sending formData:", formData);

      const res = await fetch(`${API}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("📥 Response Status:", res.status);
      console.log("📥 Response Message:", data.message);
      console.log("📥 Full Response:", JSON.stringify(data, null, 2));
      console.log("📥 Form Data being sent:", JSON.stringify(formData, null, 2));

      if (!res.ok) {
        alert(data.message || "Signup failed");
        return;
      }

      alert("Signup successful 🎉");

      // 🚜 Redirect farmer to geofencing (mandatory step)
      navigate("/farmer/login");

    } catch (error) {
      console.error(error);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

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
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t("signup.fullName")}
              className="input"
            />

            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t("signup.email")}
              className="input"
            />

            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder={t("signup.phone")}
              className="input"
            />

            <input
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              placeholder={t("signup.age")}
              className="input"
            />

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="input"
            >
              <option value="">{t("signup.gender.select")}</option>
              <option value="Male">{t("signup.gender.male")}</option>
              <option value="Female">{t("signup.gender.female")}</option>
              <option value="Other">{t("signup.gender.other")}</option>
            </select>

            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={t("signup.password")}
              className="input"
            />

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="md:col-span-2 bg-[#132a13] text-[#ecf39e]
                         py-4 rounded-xl font-semibold
                         hover:bg-[#31572c] transition-all"
            >
              {loading ? "Please wait..." : t("signup.button")}
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
