import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const API = import.meta.env.VITE_API_BASE_URL;

export default function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    email: "",
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      console.log("📤 Sending login data:", formData);

      const res = await fetch(`${API}/retailer/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("📥 Response Status:", res.status);
      console.log("📥 Response:", data);

      if (res.ok) {
        // Store token and retailer info
        localStorage.setItem("token", data.token);
        localStorage.setItem("retailer", JSON.stringify(data.retailer));
        alert("Login successful!");
        navigate("/retailer/dashboard");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fad9] flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4 pt-32">
        <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-10">
          <h2 className="text-3xl font-bold text-center text-[#132a13] mb-8">
            Retailer Login
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit}>

            <input
              type="email"
              name="email"
              placeholder="Email"
              className="input"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#132a13] text-[#ecf39e]
                         py-4 rounded-xl font-semibold
                         hover:bg-[#31572c] transition-all"
            >
              {loading ? "Please wait..." : "Login"}
            </button>
          </form>

          <p className="text-center text-sm mt-6 text-[#31572c]">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/retailer/signup")}
              className="text-[#132a13] font-semibold cursor-pointer"
            >
              Sign up here
            </span>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}