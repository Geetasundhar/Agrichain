import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const API = import.meta.env.VITE_API_BASE_URL;

export default function BuyCrops() {
  const navigate = useNavigate();
  const [crops, setCrops] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      const res = await fetch(`${API}/buyer/crops`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.status === "success") {
        // Only show crops that are marked as completed AND have qty > 0
        setCrops(data.crops.filter(crop => crop.isCompleted === true && crop.quantityKg > 0));
      }
    } catch (err) {
      console.error("Fetch crops error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fad9] flex flex-col">
      <Navbar />

      {/* 🔙 Back Button */}
      <div className="pt-28 px-6">
        <button
          onClick={() => navigate("/buyer/dashboard")}
          className="mb-6 text-[#132a13] font-semibold hover:underline"
        >
          ← Back to Dashboard
        </button>

        <h2 className="text-3xl font-bold text-[#132a13] mb-6">
          Buy Fresh Crops
        </h2>
      </div>

      {/* 🌾 Crop Cards */}
      <section className="px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 flex-1 pb-10">
        {crops.map((crop) => (
          <div
            key={crop._id}
            onClick={() => navigate(`/buyer/crop/${crop._id}`)}
            className="bg-white rounded-2xl shadow hover:shadow-xl transition p-6 flex flex-col cursor-pointer"
          >
            {/* 🖼 Crop Image */}
            <img
              src={crop.images?.[0]}
              alt={crop.cropName}
              className="w-full h-40 object-cover rounded-xl"
            />

            {/* 📝 Crop Info */}
            <h3 className="text-xl font-bold text-[#132a13] mt-4">
              {crop.cropName}
            </h3>

            <p className="text-sm text-[#31572c] mt-1">
              ₹{crop.pricePerKg} / kg • {crop.quantityKg} kg
            </p>

            <p className="text-sm mt-2 text-gray-600">
              📍 {crop.location}
            </p>

            {/* ⏱ Freshness */}
            <FreshnessBadge days={crop.ageInDays} />
          </div>
        ))}
      </section>

      <Footer />
    </div>
  );
}

/* 🟢 Freshness Badge Component */
function FreshnessBadge({ days }) {
  if (days >= 4) {
    return (
      <p className="mt-3 text-red-600 font-semibold">
        ⚠ Almost Rotten
      </p>
    );
  }

  if (days >= 2) {
    return (
      <p className="mt-3 text-orange-500 font-semibold">
        ⏳ Aging
      </p>
    );
  }

  return (
    <p className="mt-3 text-green-600 font-semibold">
      ✅ Fresh
    </p>
  );
}
