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
    username: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    farm_name: "",
    farm_size: "",
    crop_type: "",
    farm_address: "",
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

      const res = await fetch(`${API}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Signup failed");
        return;
      }

      alert("Signup successful 🎉");
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

            <input name="name" onChange={handleChange}
              placeholder={t("signup.fullName")} className="input" />

            <input name="username" onChange={handleChange}
              placeholder={t("signup.username")} className="input" />

            <input name="email" type="email" onChange={handleChange}
              placeholder={t("signup.email")} className="input" />

            <input name="phone" onChange={handleChange}
              placeholder={t("signup.phone")} className="input" />

            <input name="age" type="number" onChange={handleChange}
              placeholder={t("signup.age")} className="input" />

            <select name="gender" onChange={handleChange} className="input">
              <option value="">{t("signup.gender.select")}</option>
              <option value="Male">{t("signup.gender.male")}</option>
              <option value="Female">{t("signup.gender.female")}</option>
              <option value="Other">{t("signup.gender.other")}</option>
            </select>

            <input name="farm_name" onChange={handleChange}
              placeholder={t("signup.farmName")} className="input" />

            <input name="farm_size" type="number" onChange={handleChange}
              placeholder={t("signup.farmSize")} className="input" />

            <input name="crop_type" onChange={handleChange}
              placeholder={t("signup.cropType")} className="input" />

            <textarea name="farm_address" rows="2" onChange={handleChange}
              placeholder={t("signup.farmAddress")}
              className="input md:col-span-2" />

            <input name="password" type="password" onChange={handleChange}
              placeholder={t("signup.password")} className="input" />

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
