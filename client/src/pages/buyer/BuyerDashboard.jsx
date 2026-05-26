import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const API = import.meta.env.VITE_API_BASE_URL;

export default function BuyerDashboard() {
  const navigate = useNavigate();
  const [buyer, setBuyer] = useState(null);

  const token = localStorage.getItem("token");
  const buyerId = localStorage.getItem("buyer_id");

  useEffect(() => {
    if (!token || !buyerId) {
      navigate("/buyer/login");
      return;
    }
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await fetch(`${API}/buyer/profile/${buyerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.status === "success") setBuyer(data.buyer);
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="bg-[#f8fad9] min-h-screen flex flex-col">
      <Navbar />

      {/* 🌾 Welcome Banner */}
      <section className="pt-28 px-6">
        <div className="bg-[#132a13] text-[#ecf39e] rounded-3xl p-8 flex flex-col md:flex-row justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              Welcome, {buyer?.buyer_name}
            </h2>
            <p className="text-sm opacity-90">
              Buy fresh crops directly from farmers 🌾
            </p>
          </div>

          {buyer?.buyer_name ? (
            <div className="w-20 h-20 rounded-full border-4 border-[#ecf39e] mt-4 md:mt-0 bg-[#31572c] text-[#ecf39e] flex items-center justify-center text-3xl font-bold uppercase shadow-lg">
              {buyer.buyer_name.charAt(0)}
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full border-4 border-[#ecf39e] mt-4 md:mt-0 bg-gray-300 flex items-center justify-center text-gray-500">
              ?
            </div>
          )}
        </div>
      </section>

      {/* ⚡ Quick Actions */}
      <section className="px-6 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ActionCard
            title="Buy Crops"
            desc="Explore available crops"
            icon="🛒"
            onClick={() => navigate("/buyer/crops")}
          />
          <ActionCard
            title="Pre-Order Crops"
            desc="Reserve growing crops early"
            icon="🌱"
            onClick={() => navigate("/buyer/preorder-crops")}
          />
          <ActionCard
            title="My Cart"
            desc="Saved crops for purchase"
            icon="🛍️"
            onClick={() => navigate("/buyer/cart")}
          />
          <ActionCard
            title="My Orders"
            desc="Track your orders"
            icon="📋"
            onClick={() => navigate("/buyer/purchases")}
          />
          <ActionCard
            title="My Preorders"
            desc="Preordered crops"
            icon="🛒"
            onClick={() => navigate("/buyer/my-preorders")}
          />
        </div>
      </section>

      {/* 🛒 Crops Preview */}
      {/* <section className="px-6 mt-14 flex-1">
        <h3 className="text-2xl font-bold text-[#132a13] mb-6">
          Available Crops
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8"> */}
      {/* Placeholder cards */}
      {/* {[1, 2, 3].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition p-6"
            >
              <div className="h-40 bg-[#ecf39e] rounded-xl mb-4" />
              <h4 className="font-bold text-[#132a13]">Crop Name</h4>
              <p className="text-sm text-[#31572c] mt-1">
                ₹ Price / kg
              </p>
              <button
                className="mt-4 w-full bg-[#132a13] text-[#ecf39e] py-2 rounded-lg"
                onClick={() => navigate("/buyer/crops")}
              >
                View
              </button>
            </div>
          ))}
        </div>
      </section> */}

      <Footer />
    </div>
  );
}

/* 🔹 Reusable Card */
function ActionCard({ title, desc, icon, highlight, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-8 shadow hover:shadow-xl cursor-pointer transition-all hover:-translate-y-1 ${highlight
        ? "bg-yellow-50 border-2 border-yellow-300 hover:bg-yellow-100"
        : "bg-white"
        }`}
    >
      {icon && <span className="text-3xl mb-3 block">{icon}</span>}
      <h3 className={`text-xl font-bold mb-2 ${highlight ? "text-yellow-700" : "text-[#132a13]"}`}>{title}</h3>
      <p className={`text-sm ${highlight ? "text-yellow-600" : "text-[#31572c]"}`}>{desc}</p>
    </div>
  );
}
