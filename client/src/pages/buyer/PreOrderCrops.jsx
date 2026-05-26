import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const API = import.meta.env.VITE_API_BASE_URL;

export default function PreOrderCrops() {
    const navigate = useNavigate();
    const [crops, setCrops] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchPreOrderCrops();
    }, []);

    const fetchPreOrderCrops = async () => {
        try {
            const res = await fetch(`${API}/buyer/preorder-crops`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.status === "success") {
                setCrops(data.crops);
            }
        } catch (err) {
            console.error("Fetch pre-orderable crops error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fad9] flex flex-col">
            <Navbar />

            {/* Back Button */}
            <div className="pt-28 px-6">
                <button
                    onClick={() => navigate("/buyer/dashboard")}
                    className="mb-6 text-[#132a13] font-semibold hover:underline"
                >
                    ← Back to Dashboard
                </button>

                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
                    <h2 className="text-3xl font-bold text-[#132a13]">Pre-Order Crops</h2>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-semibold rounded-full border border-yellow-300">
                        🌱 Still Growing
                    </span>
                </div>

                <p className="text-[#31572c] text-sm mb-8 max-w-xl">
                    Reserve crops that are still being grown by farmers. Your pre-order will be fulfilled once the crop is harvested. Lock in today's price!
                </p>
            </div>

            {/* Crop Cards */}
            <section className="px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 flex-1 pb-10">
                {loading && (
                    <p className="col-span-3 text-center text-lg font-semibold text-[#132a13] pt-10">
                        Loading crops…
                    </p>
                )}

                {!loading && crops.length === 0 && (
                    <p className="col-span-3 text-center text-gray-500 pt-10">
                        No crops available for pre-order right now. Check back soon! 🌾
                    </p>
                )}

                {crops.map((crop) => (
                    <div
                        key={crop._id}
                        onClick={() => navigate(`/buyer/preorder-crop/${crop._id}`)}
                        className="bg-white rounded-2xl shadow hover:shadow-xl transition p-6 flex flex-col cursor-pointer relative overflow-hidden"
                    >
                        {/* Growing Badge */}
                        <span className="absolute top-3 right-3 bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded-full border border-yellow-300 z-10">
                            🌱 Growing
                        </span>

                        {/* Crop Image */}
                        <img
                            src={crop.images?.[0] || "https://via.placeholder.com/400x200?text=Crop"}
                            alt={crop.cropName}
                            className="w-full h-40 object-cover rounded-xl"
                        />

                        {/* Crop Info */}
                        <h3 className="text-xl font-bold text-[#132a13] mt-4">{crop.cropName}</h3>

                        <p className="text-sm text-[#31572c] mt-1">
                            ₹{crop.pricePerKg} / kg
                        </p>

                        <p className="text-sm mt-1 text-gray-600">📍 {crop.location}</p>

                        {/* Expected Harvest */}
                        <HarvestBadge durationNumber={crop.durationNumber} durationPeriod={crop.durationPeriod} createdAt={crop.createdAt} />

                        <div className="mt-auto pt-4">
                            <button
                                onClick={(e) => { e.stopPropagation(); navigate(`/buyer/preorder-crop/${crop._id}`); }}
                                className="w-full py-2 bg-[#31572c] text-[#ecf39e] font-bold rounded-xl hover:bg-[#132a13] transition text-sm"
                            >
                                🌱 Pre-Order Now
                            </button>
                        </div>
                    </div>
                ))}
            </section>

            <Footer />
        </div>
    );
}

/* Harvest Estimate Badge */
function HarvestBadge({ durationNumber, durationPeriod, createdAt }) {
    if (!durationNumber || !durationPeriod || !createdAt) return null;

    const start = new Date(createdAt);
    const periodMs = {
        week: 7 * 24 * 60 * 60 * 1000,
        month: 30 * 24 * 60 * 60 * 1000,
        year: 365 * 24 * 60 * 60 * 1000,
    };
    const harvestDate = new Date(start.getTime() + durationNumber * (periodMs[durationPeriod] || 0));
    const now = new Date();
    const daysLeft = Math.ceil((harvestDate - now) / (1000 * 60 * 60 * 24));

    if (daysLeft <= 0) {
        return <p className="mt-2 text-sm text-green-600 font-semibold">✅ Ready to harvest soon</p>;
    }

    return (
        <p className="mt-2 text-sm text-orange-500 font-semibold">
            ⏳ Harvest in ~{daysLeft} day{daysLeft !== 1 ? "s" : ""}
        </p>
    );
}
