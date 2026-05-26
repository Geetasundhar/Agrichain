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
    password: "",
    shop_image: "",
    licenses: {
      seed: "",
      fertilizer: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [selectedLicenses, setSelectedLicenses] = useState({
    seed: false,
    fertilizer: false,
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "seed" || name === "fertilizer") {
      setFormData({
        ...formData,
        licenses: {
          ...formData.licenses,
          [name]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle license selection
  const handleLicenseChange = (e) => {
    const { name, checked } = e.target;
    setSelectedLicenses({
      ...selectedLicenses,
      [name]: checked,
    });
  };

  // Handle file upload for shop image
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For simplicity, convert to base64 or assume upload endpoint
      // Here, we'll assume it's a URL or handle as string
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({
          ...formData,
          shop_image: reader.result, // base64
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Prepare licenses object
      const licenses = {};
      if (selectedLicenses.seed && formData.licenses.seed) {
        licenses.seed = formData.licenses.seed;
      }
      if (selectedLicenses.fertilizer && formData.licenses.fertilizer) {
        licenses.fertilizer = formData.licenses.fertilizer;
      }

      const submitData = {
        ...formData,
        licenses,
      };

      console.log("📤 Sending formData:", submitData);

      const res = await fetch(`${API}/retailer/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const data = await res.json();
      console.log("📥 Response Status:", res.status);
      console.log("📥 Response Message:", data.message);

      if (res.ok) {
        alert(t("signup.success"));
        navigate("/retailer/login"); // Assuming login page exists
      } else {
        alert(data.message || t("signup.failed"));
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert(t("form.networkError"));
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
            {t("retailerSignup.title")}
          </h2>

          <form className="grid md:grid-cols-2 gap-6">

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t("retailerSignup.name")}
              className="input"
              required
            />

            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t("signup.email")}
              className="input"
              required
            />

            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={t("signup.password")}
              className="input"
              required
            />

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#132a13] mb-2">
                {t("retailerSignup.shopImage")}
              </label>
              <input
                name="shop_image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="input"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#132a13] mb-4">
                {t("retailerDashboard.licenseStatus")}
              </label>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="seed"
                    name="seed"
                    type="checkbox"
                    checked={selectedLicenses.seed}
                    onChange={handleLicenseChange}
                    className="h-4 w-4 text-[#132a13] focus:ring-[#90a955] border-gray-300 rounded"
                  />
                  <label htmlFor="seed" className="ml-2 block text-sm text-[#31572c]">
                    {t("retailerDashboard.seedLicense")}
                  </label>
                </div>
                {selectedLicenses.seed && (
                  <input
                    name="seed"
                    type="text"
                    placeholder={t("form.seedPlaceholder", "Enter Seed License Number")}
                    value={formData.licenses.seed}
                    onChange={handleChange}
                    className="input ml-6"
                  />
                )}

                <div className="flex items-center">
                  <input
                    id="fertilizer"
                    name="fertilizer"
                    type="checkbox"
                    checked={selectedLicenses.fertilizer}
                    onChange={handleLicenseChange}
                    className="h-4 w-4 text-[#132a13] focus:ring-[#90a955] border-gray-300 rounded"
                  />
                  <label htmlFor="fertilizer" className="ml-2 block text-sm text-[#31572c]">
                    {t("retailerDashboard.fertilizerLicense")}
                  </label>
                </div>
                {selectedLicenses.fertilizer && (
                  <input
                    name="fertilizer"
                    type="text"
                    placeholder={t("form.fertilizerPlaceholder", "Enter Fertilizer License Number")}
                    value={formData.licenses.fertilizer}
                    onChange={handleChange}
                    className="input ml-6"
                  />
                )}
              </div>
            </div>

            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="md:col-span-2 bg-[#132a13] text-[#ecf39e]
                         py-4 rounded-xl font-semibold
                         hover:bg-[#31572c] transition-all"
            >
              {loading ? t("login.loading") : t("signup.button")}
            </button>
          </form>

          <p className="text-center text-sm mt-6 text-[#31572c]">
            {t("retailerSignup.alreadyHaveAccount")}
            <span
              onClick={() => navigate("/retailer/login")}
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