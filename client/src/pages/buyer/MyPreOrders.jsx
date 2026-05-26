import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import dayjs from "dayjs";

const API = import.meta.env.VITE_API_BASE_URL;

const STATUS_STYLES = {
    pending: { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-300", label: "⏳ Pending" },
    confirmed: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300", label: "✅ Confirmed" },
    fulfilled: { bg: "bg-green-100", text: "text-green-700", border: "border-green-300", label: "📦 Fulfilled" },
    cancelled: { bg: "bg-red-100", text: "text-red-700", border: "border-red-300", label: "❌ Cancelled" },
};

export default function MyPreOrders() {
    const navigate = useNavigate();
    const [preOrders, setPreOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchPreOrders();
    }, []);

    const fetchPreOrders = async () => {
        try {
            const res = await fetch(`${API}/buyer/my-preorders`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.status === "success") {
                setPreOrders(data.preOrders);
            }
        } catch (err) {
            console.error("Fetch pre-orders error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fad9] flex flex-col">
            <Navbar />

            <div className="pt-28 px-6 flex-1">
                {/* Header */}
                <button
                    onClick={() => navigate("/buyer/dashboard")}
                    className="mb-6 text-[#132a13] font-semibold hover:underline"
                >
                    ← Back to Dashboard
                </button>

                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-8">
                    <h2 className="text-3xl font-bold text-[#132a13]">My Pre-Orders</h2>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-semibold rounded-full border border-yellow-300">
                        🌱 Reserved Crops
                    </span>
                </div>

                {/* Loading */}
                {loading && (
                    <p className="text-center text-lg font-semibold text-[#132a13] pt-10">
                        Loading pre-orders…
                    </p>
                )}

                {/* Empty */}
                {!loading && preOrders.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-5xl mb-4">🌱</p>
                        <p className="text-xl font-bold text-[#132a13] mb-2">No pre-orders yet</p>
                        <p className="text-gray-500 mb-6">Reserve growing crops before they're harvested to lock in prices!</p>
                        <button
                            onClick={() => navigate("/buyer/preorder-crops")}
                            className="px-6 py-3 bg-[#31572c] text-[#ecf39e] font-bold rounded-xl hover:bg-[#132a13] transition"
                        >
                            Browse Pre-Order Crops
                        </button>
                    </div>
                )}

                {/* Pre-Order Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
                    {preOrders.map((order) => {
                        const style = STATUS_STYLES[order.status] || STATUS_STYLES.pending;
                        const cropImage = order.crop?.images?.[0];
                        const harvestDate = (() => {
                            const periodMs = { week: 7, month: 30, year: 365 };
                            const days = (order.crop?.durationNumber || 0) * (periodMs[order.crop?.durationPeriod] || 0);
                            return dayjs(order.createdAt).add(days, "day");
                        })();

                        return (
                            <div key={order._id} className="bg-white rounded-2xl shadow hover:shadow-xl transition p-5 flex flex-col">
                                {/* Image */}
                                <div className="relative">
                                    <img
                                        src={cropImage || "https://via.placeholder.com/400x160?text=Crop"}
                                        alt={order.crop?.cropName || "Crop"}
                                        className="w-full h-36 object-cover rounded-xl"
                                    />
                                    {/* Status Badge */}
                                    <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded-full border ${style.bg} ${style.text} ${style.border}`}>
                                        {style.label}
                                    </span>
                                </div>

                                {/* Info */}
                                <div className="mt-4 flex-1">
                                    <h3 className="text-lg font-bold text-[#132a13]">{order.crop?.cropName || "Unknown Crop"}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{order.crop?.cropType || ""}</p>

                                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                                        <div className="bg-[#f8fad9] p-2 rounded-lg">
                                            <p className="text-gray-500 text-xs">Quantity</p>
                                            <p className="font-bold text-[#132a13]">{order.quantityKg} kg</p>
                                        </div>
                                        <div className="bg-[#f8fad9] p-2 rounded-lg">
                                            <p className="text-gray-500 text-xs">Price/kg</p>
                                            <p className="font-bold text-[#31572c]">₹{order.pricePerKg}</p>
                                        </div>
                                        <div className="bg-[#f8fad9] p-2 rounded-lg col-span-2">
                                            <p className="text-gray-500 text-xs">Total Amount</p>
                                            <p className="font-bold text-[#132a13] text-base">₹{order.totalPrice}</p>
                                        </div>
                                    </div>

                                    <div className="mt-3 text-sm text-gray-600">
                                        👨‍🌾 {order.farmer?.name || "Unknown Farmer"}
                                    </div>

                                    <div className="mt-1 text-xs text-gray-400">
                                        Ordered: {dayjs(order.createdAt).format("MMM D, YYYY")}
                                    </div>

                                    {order.status === "pending" && (
                                        <div className="mt-2 text-xs text-yellow-600 font-medium">
                                            ⏳ Est. harvest: {harvestDate.format("MMM D, YYYY")}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <Footer />
        </div>
    );
}
