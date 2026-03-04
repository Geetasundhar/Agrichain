import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import dayjs from "dayjs";

const API = import.meta.env.VITE_API_BASE_URL;

export default function BuyerPurchases() {
    const navigate = useNavigate();
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPurchases();
    }, []);

    const fetchPurchases = async () => {
        try {
            const res = await fetch(`${API}/buyer/my-purchases`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await res.json();
            if (data.status === "success") {
                setPurchases(data.purchases);
            }
        } catch (err) {
            console.error("Fetch purchases error:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="pt-32 text-center text-xl font-bold">Loading Purchases...</div>;
    }

    return (
        <div className="min-h-screen bg-[#f8fad9] flex flex-col">
            <Navbar />

            <main className="flex-grow pt-28 px-6 max-w-6xl mx-auto w-full pb-10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-[#132a13]">My Purchases 🧾</h2>
                    <button
                        onClick={() => navigate("/buyer/dashboard")}
                        className="text-[#31572c] font-semibold hover:underline"
                    >
                        ← Back to Dashboard
                    </button>
                </div>

                {purchases.length === 0 ? (
                    <div className="bg-white rounded-3xl shadow p-8 text-center text-gray-500">
                        <p className="text-xl">You haven't made any purchases yet.</p>
                        <button
                            onClick={() => navigate("/buyer/crops")}
                            className="mt-6 bg-[#31572c] text-[#ecf39e] py-2 px-6 rounded-xl font-bold hover:bg-[#132a13] transition"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {purchases.map((purchase) => (
                            <div
                                key={purchase._id}
                                className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row gap-6 items-center"
                            >
                                {/* Crop Image */}
                                <div className="w-full md:w-32 h-32 flex-shrink-0">
                                    <img
                                        src={purchase.crop?.images?.[0] || "https://via.placeholder.com/150"}
                                        alt={purchase.crop?.cropName || "Crop"}
                                        className="w-full h-full object-cover rounded-xl"
                                    />
                                </div>

                                {/* Details */}
                                <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                    <div>
                                        <h3 className="text-xl font-bold text-[#132a13]">
                                            {purchase.crop?.cropName || "Unknown Crop"}{" "}
                                            <span className="text-sm font-normal text-gray-500">
                                                ({purchase.crop?.cropType || "N/A"})
                                            </span>
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            <strong>Order ID:</strong> {purchase._id}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <strong>Date:</strong> {dayjs(purchase.createdAt).format("MMM D, YYYY h:mm A")}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-2">
                                            <strong>Farmer:</strong> {purchase.farmer?.name || "Unknown"}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            📍 {purchase.farmer?.location || "N/A"} • 📞 {purchase.farmer?.phone || "N/A"}
                                        </p>
                                    </div>

                                    <div className="bg-[#f8fad9] p-4 rounded-xl flex flex-col justify-center">
                                        <p className="text-sm text-gray-600 flex justify-between">
                                            <span>Quantity:</span>
                                            <strong className="text-[#132a13]">{purchase.quantityKg} kg</strong>
                                        </p>
                                        <p className="text-sm text-gray-600 flex justify-between mt-1">
                                            <span>Rate:</span>
                                            <strong className="text-[#132a13]">₹{purchase.crop?.pricePerKg || 0} / kg</strong>
                                        </p>
                                        <div className="border-t border-[#31572c] mt-2 pt-2 flex justify-between">
                                            <span className="font-bold text-[#31572c]">Total Paid:</span>
                                            <span className="font-extrabold text-xl text-[#132a13]">₹{purchase.totalPrice}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
