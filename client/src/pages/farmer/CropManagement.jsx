import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const API = import.meta.env.VITE_API_BASE_URL;

export default function MyCrops() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  const farmerId = localStorage.getItem("userId");

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      const res = await fetch(`${API}/farmer/my-crops`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setCrops(data.crops || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteCrop = async (cropId) => {
    if (!confirm(t("cropDisplay.confirmDelete"))) return;

    await fetch(`${API}/farmer/delete-crop/${cropId}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    fetchCrops();
  };

  return (
    <div className="min-h-screen bg-[#f8fad9] flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 px-6 max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-[#132a13]">{t("myCrops.title")}</h2>

          {/* {crops.length > 0 && (
            <button
              onClick={() => navigate("/farmer/add-crop")}
              className="bg-[#132a13] text-[#ecf39e] px-6 py-3 rounded-xl font-semibold"
            >
              ➕ Add Crop
            </button>
          )} */}
        </div>

        {/* Loading */}
        {loading && <p>{t("cropDisplay.loading")}</p>}

        {/* Empty State */}
        {/* {!loading && crops.length === 0 && (
          <div className="text-center mt-20">
            <p className="text-xl mb-6 text-[#31572c]">
              You haven’t added any crops yet 🌱
            </p>
            <button
              onClick={() => navigate("/farmer/add-crop")}
              className="bg-[#132a13] text-[#ecf39e] px-8 py-4 rounded-xl font-semibold"
            >
              Add Your First Crop
            </button>
          </div>
        )} */}

        {/* Crops Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">

          <div
            onClick={() => navigate("/farmer/add-crop")}
            className="group cursor-pointer bg-white rounded-3xl shadow-md
               hover:shadow-2xl hover:-translate-y-2
               transition-all duration-300 overflow-hidden
               flex flex-col justify-between"
          >
            <div className="p-8 flex flex-col items-center justify-center text-center">
              <div
                className="w-40 h-40 flex items-center justify-center
                   rounded-full bg-[#ecf39e] text-[#132a13]
                   text-6xl mb-4
                   group-hover:scale-110 transition"
              >
                ➕
              </div>

              <h3 className="font-semibold text-lg text-[#132a13] mb-1">
                {t("myCrops.addNewCrop")}
              </h3>

              <p className="text-sm text-[#31572c]">
                {t("myCrops.addNewCropDesc")}
              </p>
            </div>

            <div
              className="text-center bg-[#132a13] text-[#ecf39e]
                 py-3 font-medium
                 group-hover:bg-[#31572c] transition"
            >
              {t("myCrops.addCrop")}
            </div>
          </div>
          {crops.map((crop) => (
            <div
              key={crop._id}
              className="group bg-white rounded-3xl shadow-md
                 hover:shadow-2xl hover:-translate-y-2
                 transition-all duration-300 overflow-hidden"
            >
              {/* Image */}
              <div className="h-44 overflow-hidden">
                <img
                  src={crop.image}
                  alt={crop.name}
                  className="w-full h-full object-cover
                     group-hover:scale-110 transition duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-semibold text-lg text-[#132a13] mb-1">
                  {crop.name}
                </h3>

                <p className="text-sm text-[#31572c] mb-3">
                  {crop.type} • {crop.location}
                </p>

                <div className="text-sm text-[#4f772d] space-y-1">
                  <p>🌾 {t("form.quantity")}: <b>{crop.quantity} kg</b></p>
                  <p>💰 {t("form.price")}: <b>₹{crop.price}/kg</b></p>
                </div>
              </div>

              {/* Footer Action (Update only) */}
              <button
                onClick={() => navigate(`/farmer/crops/${crop._id}`)}
                className="block w-full text-center bg-[#132a13]
                   text-[#ecf39e] py-3 font-medium
                   group-hover:bg-[#31572c] transition"
              >
                {t("myCrops.manageCrop")}
              </button>
            </div>
          ))}
        </div>


      </main>

      <Footer />
    </div>
  );
}