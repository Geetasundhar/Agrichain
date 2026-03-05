import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import dayjs from "dayjs";

const API = import.meta.env.VITE_API_BASE_URL;

export default function PreOrderSpecificCrop() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [crop, setCrop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantityToBuy, setQuantityToBuy] = useState(1);
    const [submitting, setSubmitting] = useState(false);

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchCropDetails();
    }, [id]);

    const fetchCropDetails = async () => {
        try {
            const res = await fetch(`${API}/buyer/crops/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.status === "success") {
                setCrop(data.crop);
            }
        } catch (err) {
            console.error("Fetch crop details error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = (delta) => {
        if (!crop) return;
        setQuantityToBuy((prev) => Math.max(1, prev + delta));
    };

    const handleSetQty = (e) => {
        const val = Number(e.target.value) || 1;
        setQuantityToBuy(Math.max(1, val));
    };

    const placePreOrder = async (e) => {
        e.preventDefault();
        if (!crop || quantityToBuy <= 0 || submitting) return;
        setSubmitting(true);

        try {
            const res = await fetch(`${API}/buyer/place-preorder`, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ cropId: crop._id, quantityKg: quantityToBuy }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Pre-order failed");

            alert(
                `✅ Pre-order placed successfully!\n\nCrop: ${crop.cropName}\nQty: ${quantityToBuy} kg\nTotal: ₹${quantityToBuy * crop.pricePerKg}\n\nYou will be notified once the crop is harvested. 🌱`
            );
            navigate("/buyer/my-preorders");
        } catch (err) {
            console.error("Pre-order Error:", err);
            alert(err.message || "Failed to place pre-order");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <p className="pt-32 text-center text-xl font-bold">Loading Crop Details…</p>;
    if (!crop) return <p className="pt-32 text-center text-xl font-bold text-red-600">Crop not found</p>;

    /* Harvest estimate */
    const harvestDate = (() => {
        const periodMs = { week: 7, month: 30, year: 365 };
        const days = (crop.durationNumber || 0) * (periodMs[crop.durationPeriod] || 0);
        return dayjs(crop.createdAt).add(days, "day");
    })();
    const daysLeft = harvestDate.diff(dayjs(), "day");

    return (
        <div className="min-h-screen bg-[#f8fad9] flex flex-col">
            <Navbar />

            <main className="flex-grow pt-28 px-6 max-w-6xl mx-auto w-full pb-10">
                {/* Back Button */}
                <button
                    onClick={() => navigate("/buyer/preorder-crops")}
                    className="mb-6 text-[#132a13] font-semibold hover:underline"
                >
                    ← Back to Pre-Order Crops
                </button>

                {/* ⚠️ Still Growing Banner */}
                <div className="bg-yellow-50 border border-yellow-300 rounded-2xl px-6 py-4 mb-8 flex items-start gap-3">
                    <span className="text-2xl">🌱</span>
                    <div>
                        <p className="font-bold text-yellow-800">This crop is still growing</p>
                        <p className="text-yellow-700 text-sm mt-1">
                            Your pre-order will be fulfilled once the crop is harvested.
                            {daysLeft > 0
                                ? ` Estimated harvest: ${harvestDate.format("MMM D, YYYY")} (~${daysLeft} day${daysLeft !== 1 ? "s" : ""} away).`
                                : " Expected to be harvested very soon!"}
                        </p>
                    </div>
                </div>

                {/* 1. Crop Main Section */}
                <div className="bg-white rounded-3xl shadow p-8 mb-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Left: Main Image */}
                        <div className="md:w-1/2">
                            <img
                                src={crop.images?.[0] || "https://via.placeholder.com/400"}
                                alt={crop.cropName}
                                className="w-full h-80 object-cover rounded-2xl shadow-md"
                            />

                            {/* Progress Photos */}
                            {crop.progressPhotos && crop.progressPhotos.length > 0 && (
                                <div className="mt-6">
                                    <h4 className="text-lg font-bold text-[#132a13] mb-3">Growth Timeline 🌱</h4>
                                    <div className="grid grid-cols-4 gap-2">
                                        {crop.progressPhotos.map((photo, index) => (
                                            <div key={index} className="flex flex-col items-center">
                                                <img
                                                    src={photo.imageData}
                                                    alt={`Progress ${index + 1}`}
                                                    className="w-full h-20 object-cover rounded-lg border border-gray-200"
                                                />
                                                <span className="text-xs text-gray-500 mt-1">Week {index + 1}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right: Crop Details */}
                        <div className="md:w-1/2 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-4xl font-extrabold text-[#132a13]">{crop.cropName}</h1>
                                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-bold rounded-full border border-yellow-300">
                                        🌱 Growing
                                    </span>
                                </div>
                                <p className="text-xl text-[#31572c] font-semibold mb-4">
                                    ₹{crop.pricePerKg} / kg{" "}
                                    <span className="text-gray-400 text-sm">(price locked at pre-order)</span>
                                </p>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-[#f8fad9] p-4 rounded-xl">
                                        <p className="text-sm text-gray-500">Crop Type</p>
                                        <p className="font-bold text-[#132a13]">{crop.cropType || "N/A"}</p>
                                    </div>
                                    <div className="bg-[#f8fad9] p-4 rounded-xl">
                                        <p className="text-sm text-gray-500">Soil Type</p>
                                        <p className="font-bold text-[#132a13]">{crop.soilType || "N/A"}</p>
                                    </div>
                                    <div className="bg-[#f8fad9] p-4 rounded-xl">
                                        <p className="text-sm text-gray-500">Duration</p>
                                        <p className="font-bold text-[#132a13]">{crop.durationNumber} {crop.durationPeriod}(s)</p>
                                    </div>
                                    <div className="bg-[#f8fad9] p-4 rounded-xl">
                                        <p className="text-sm text-gray-500">Est. Harvest</p>
                                        <p className="font-bold text-[#132a13]">{harvestDate.format("MMM D, YYYY")}</p>
                                    </div>
                                </div>

                                {/* Farmer Info */}
                                <div className="border border-[#31572c] bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm mb-6">
                                    <div className="w-16 h-16 bg-[#31572c] text-[#ecf39e] rounded-full flex items-center justify-center text-xl font-bold">
                                        {crop.farmerId?.name ? crop.farmerId.name.charAt(0).toUpperCase() : "👨‍🌾"}
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Grown by</p>
                                        <p className="font-bold text-[#132a13] text-lg">{crop.farmerId?.name || "Unknown Farmer"}</p>
                                        <p className="text-sm text-gray-600">📞 {crop.farmerId?.phone || "N/A"} • ✉️ {crop.farmerId?.email || "N/A"}</p>
                                    </div>
                                </div>

                                {/* Quantity Selector */}
                                <div className="bg-[#f8fad9] p-4 rounded-xl mb-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="font-bold text-gray-700">Reserve Quantity (kg):</span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleQuantityChange(-1)}
                                                className="px-3 py-1 bg-white border border-[#31572c] text-[#31572c] font-bold rounded shadow-sm hover:bg-[#ecf39e]"
                                            >-</button>
                                            <input
                                                type="number"
                                                min="1"
                                                value={quantityToBuy}
                                                onChange={handleSetQty}
                                                className="w-16 text-center border-b-2 border-[#31572c] bg-transparent font-bold focus:outline-none"
                                            />
                                            <button
                                                onClick={() => handleQuantityChange(1)}
                                                className="px-3 py-1 bg-[#31572c] text-[#ecf39e] font-bold rounded shadow-sm hover:bg-[#132a13]"
                                            >+</button>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center border-t border-gray-300 pt-3">
                                        <span className="text-lg text-gray-600 font-semibold">Estimated Total:</span>
                                        <span className="text-2xl font-extrabold text-[#31572c]">
                                            ₹{quantityToBuy * crop.pricePerKg}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Pre-Order Button */}
                            <button
                                onClick={placePreOrder}
                                disabled={submitting}
                                className="w-full py-4 bg-yellow-500 hover:bg-yellow-600 text-white font-extrabold text-lg rounded-xl transition shadow-md disabled:opacity-60"
                            >
                                {submitting ? "Placing Pre-Order…" : "🌱 Pre-Order Now"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2. Supply Traceability */}
                <div className="bg-white rounded-3xl shadow p-8 mb-8">
                    <h2 className="text-2xl font-bold text-[#132a13] mb-6 flex items-center gap-2">
                        🔗 Supply Traceability
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Seed Info */}
                        <div className="border-2 border-dashed border-gray-300 p-5 rounded-2xl">
                            <h3 className="text-lg font-bold text-[#31572c] mb-3">🌱 Seed Source</h3>
                            {crop.seedProduct ? (
                                <div className="flex items-start gap-4">
                                    <img src={crop.seedProduct.image || "https://via.placeholder.com/80"} alt="Seed" className="w-20 h-20 rounded-xl object-cover" />
                                    <div>
                                        <p className="font-bold text-gray-800">{crop.seedProduct.productName}</p>
                                        <div className="mt-2 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                                            <p className="text-gray-500 text-xs uppercase mb-1">Bought from Retailer</p>
                                            <p className="font-semibold text-[#132a13]">{crop.seedProduct.retailer?.name || "Unknown Retailer"}</p>
                                            {crop.seedProduct.retailer?.verified_licenses?.seed && (
                                                <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-bold">✓ Verified Seed License</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">No seed data recorded.</p>
                            )}
                        </div>

                        {/* Fertilizer Info */}
                        <div className="border-2 border-dashed border-gray-300 p-5 rounded-2xl">
                            <h3 className="text-lg font-bold text-[#31572c] mb-3">🧪 Fertilizer Source</h3>
                            {crop.fertilizerProduct ? (
                                <div className="flex items-start gap-4">
                                    <img src={crop.fertilizerProduct.image || "https://via.placeholder.com/80"} alt="Fertilizer" className="w-20 h-20 rounded-xl object-cover" />
                                    <div>
                                        <p className="font-bold text-gray-800">{crop.fertilizerProduct.productName}</p>
                                        <div className="mt-2 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                                            <p className="text-gray-500 text-xs uppercase mb-1">Bought from Retailer</p>
                                            <p className="font-semibold text-[#132a13]">{crop.fertilizerProduct.retailer?.name || "Unknown Retailer"}</p>
                                            {crop.fertilizerProduct.retailer?.verified_licenses?.fertilizer && (
                                                <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-bold">✓ Verified Fertilizer License</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">No fertilizer data recorded.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* 3. QR Code */}
                {crop.qrCode && (
                    <div className="bg-[#132a13] rounded-3xl shadow p-8 text-center text-white">
                        <h2 className="text-2xl font-bold mb-2">Proof of Authenticity</h2>
                        <p className="text-[#ecf39e] mb-6 max-w-lg mx-auto">
                            Scan this QR code to verify the origin and details of this crop directly from the blockchain or database.
                        </p>
                        <div className="bg-white p-4 inline-block rounded-2xl mx-auto shadow-2xl">
                            <img src={crop.qrCode} alt="Crop QR Code" className="w-48 h-48 object-contain" />
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
