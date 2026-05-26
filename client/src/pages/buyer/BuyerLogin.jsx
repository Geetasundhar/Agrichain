import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const API = import.meta.env.VITE_API_BASE_URL;

export default function BuyerLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API}/buyer/login`, {
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

      // ✅ Save buyer auth details
      localStorage.setItem("token", data.token);
      localStorage.setItem("buyer_id", data.buyer._id);
      localStorage.setItem("buyer_email", data.buyer.email);
      localStorage.setItem("role", "buyer");

      alert("Login successful ✅");

      // 🚀 Navigate to Buyer Dashboard
      navigate("/buyer/dashboard");

    } catch (error) {
      console.error("Buyer Login Error:", error);
      alert("Server error. Please try again.");
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
            Buyer Login
          </h2>

          <div className="space-y-6">
            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-[#132a13] text-[#ecf39e]
                         py-4 rounded-xl font-semibold
                         hover:bg-[#31572c] transition-all"
            >
              {loading ? "Please wait..." : "Login"}
            </button>
          </div>

          <p className="text-center text-sm mt-6 text-[#31572c]">
            New Buyer?{" "}
            <span
              onClick={() => navigate("/buyer/signup")}
              className="text-[#132a13] font-semibold cursor-pointer"
            >
              Signup here
            </span>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
