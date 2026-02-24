import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const API = import.meta.env.VITE_API_BASE_URL;

export default function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  try {
    setLoading(true);

    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Login failed");
      return;
    }

    // 🔐 STORE TOKEN + USER (DO NOT CLEAR EVERYTHING)
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    alert("Login successful 🎉");

    // 🌱 CONDITIONAL NAVIGATION
    if (!data.user?.isFarmLocationAdded) {
      navigate("/farmer/geofencing");
    } else {
      navigate("/farmer/dashboard");
    }

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

      <main className="flex-grow flex items-center justify-center px-4 pt-32">
        <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-10">
          <h2 className="text-3xl font-bold text-center text-[#132a13] mb-8">
            {t("login.title")}
          </h2>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>

            <input
              type="email"
              placeholder={t("login.email")}
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder={t("login.password")}
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-[#132a13] text-[#ecf39e]
                         py-4 rounded-xl font-semibold
                         hover:bg-[#31572c] transition-all"
            >
              {loading ? "Please wait..." : t("login.button")}
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
