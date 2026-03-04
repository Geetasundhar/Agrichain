import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import dayjs from "dayjs";

const API = import.meta.env.VITE_API_BASE_URL;

export default function BuySpecificCrop() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [crop, setCrop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isInCart, setIsInCart] = useState(false);
    const [quantityToBuy, setQuantityToBuy] = useState(1);

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (crop) {
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            const exists = cart.find((item) => item._id === crop._id);
            setIsInCart(!!exists);
        }
    }, [crop]);

    useEffect(() => {
        fetchCropDetails();
    }, [id]);

    const fetchCropDetails = async () => {
        try {
            const res = await fetch(`${API}/buyer/crops/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
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

    const getCartFriendlyCrop = () => {
        // Strip heavy base64 strings so we don't exceed the 5MB localStorage quota
        const { progressPhotos, qrCode, seedProduct, fertilizerProduct, ...lightCrop } = crop;
        return {
            ...lightCrop,
            location: crop.farmerId?.location || crop.farmerId?.name || "Unknown Farmer",
            images: crop.images || []
        };
    };

    const toggleCart = (e) => {
        e.preventDefault();
        if (!crop) return;

        let cart = [];
        try {
            cart = JSON.parse(localStorage.getItem("cart")) || [];
        } catch (err) {
            cart = [];
        }

        if (isInCart) {
            // Remove from cart
            const updatedCart = cart.filter((item) => item._id !== crop._id);
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            setIsInCart(false);
            alert("Removed from cart ❌");
        } else {
            // Add to cart
            cart.push({ ...getCartFriendlyCrop(), qty: 1 });
            try {
                localStorage.setItem("cart", JSON.stringify(cart));
                setIsInCart(true);
                alert("Added to cart successfully ✅");
            } catch (storageErr) {
                console.error("Failed to save to localStorage:", storageErr);
                alert("Failed to save to cart. Browser storage might be full.");
            }
        }
    };

    const handleQuantityChange = (delta) => {
        if (!crop) return;
        setQuantityToBuy(prev => {
            const nextQty = prev + delta;
            return Math.max(1, Math.min(crop.quantityKg, nextQty));
        });
    };

    const handleSetQty = (e) => {
        if (!crop) return;
        const val = Number(e.target.value) || 0;
        setQuantityToBuy(Math.max(1, Math.min(crop.quantityKg, val)));
    };

    const buyNow = async (e) => {
        e.preventDefault();
        if (!crop || quantityToBuy <= 0) return;

        try {
            const res = await fetch(`${API}/buyer/buy-crop`, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ cropId: crop._id, buyQuantity: quantityToBuy })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Purchase failed");

            // generate simple receipt in new window and trigger print
            const receiptWindow = window.open("", "_blank");
            const receiptHtml = `
              <html>
              <head><title>Receipt</title></head>
              <body style="font-family: sans-serif; padding: 20px;">
                <h2>Agrichain - Crop Purchase Receipt</h2>
                <p><strong>Order ID:</strong> ${data.purchase?._id || "-"}</p>
                <p><strong>Crop Name:</strong> ${crop.cropName} (${crop.cropType})</p>
                <p><strong>Farmer:</strong> ${crop.farmerId?.name || "Unknown"} - ${crop.farmerId?.phone || ""}</p>
                <p><strong>Unit Price:</strong> ₹${crop.pricePerKg} / kg</p>
                <p><strong>Quantity Bought:</strong> ${quantityToBuy} kg</p>
                <p><strong>Total Amount:</strong> ₹${quantityToBuy * crop.pricePerKg}</p>
                <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
                <hr/>
                <p>Thank you for shopping directly with the farmer. 🌱</p>
              </body>
              </html>
            `;
            receiptWindow.document.write(receiptHtml);
            receiptWindow.document.close();
            receiptWindow.focus();
            setTimeout(() => {
                try { receiptWindow.print(); } catch (e) { }
            }, 500);

            // Navigate to purchases
            navigate("/buyer/purchases");
        } catch (err) {
            console.error("Buy Error:", err);
            alert(err.message || "Failed to buy crop");
        }
    };

    if (loading) return <p className="pt-32 text-center text-xl font-bold">Loading Crop Details...</p>;
    if (!crop) return <p className="pt-32 text-center text-xl font-bold text-red-600">Crop not found</p>;

    return (
        <div className="min-h-screen bg-[#f8fad9] flex flex-col">
            <Navbar />

            <main className="flex-grow pt-28 px-6 max-w-6xl mx-auto w-full pb-10">
                {/* Back Button */}
                <button
                    onClick={() => navigate("/buyer/crops")}
                    className="mb-6 text-[#132a13] font-semibold hover:underline"
                >
                    ← Back to Crops
                </button>

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

                            {/* Progress Timeline Photos */}
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

                        {/* Right: Crop Details & Farmer */}
                        <div className="md:w-1/2 flex flex-col justify-between">
                            <div>
                                <h1 className="text-4xl font-extrabold text-[#132a13] mb-2">{crop.cropName}</h1>
                                <p className="text-xl text-[#31572c] font-semibold mb-4">
                                    ₹{crop.pricePerKg} / kg <span className="text-gray-500 text-sm ml-2">({crop.quantityKg} kg available)</span>
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
                                        <p className="text-sm text-gray-500">Harvest Date</p>
                                        <p className="font-bold text-[#132a13]">{dayjs(crop.createdAt).format("MMM D, YYYY")}</p>
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

                                {/* Purchase Controls */}
                                <div className="bg-[#f8fad9] p-4 rounded-xl mb-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="font-bold text-gray-700">Select Quantity (kg):</span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleQuantityChange(-1)}
                                                className="px-3 py-1 bg-white border border-[#31572c] text-[#31572c] font-bold rounded shadow-sm hover:bg-[#ecf39e]"
                                            >-</button>
                                            <input
                                                type="number"
                                                min="1"
                                                max={crop.quantityKg}
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
                                        <span className="text-lg text-gray-600 font-semibold">Total Price:</span>
                                        <span className="text-2xl font-extrabold text-[#31572c]">
                                            ₹{quantityToBuy * crop.pricePerKg}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 mt-auto">
                                <button
                                    onClick={(e) => toggleCart(e)}
                                    className={`flex-1 py-3 rounded-xl font-bold transition shadow-md ${isInCart
                                        ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                                        : "bg-[#31572c] text-[#ecf39e] hover:bg-[#132a13]"
                                        }`}
                                >
                                    {isInCart ? "❌ Remove from Cart" : "🛒 Add to Cart"}
                                </button>
                                <button
                                    onClick={(e) => buyNow(e)}
                                    className="flex-1 bg-[#132a13] text-white py-3 rounded-xl font-bold hover:opacity-90 transition shadow-md"
                                >
                                    ⚡ Buy Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Traceability: Seeds & Fertilizers Retailer Info */}
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

                {/* 3. Proof of Authenticity (QR) */}
                {crop.qrCode && (
                    <div className="bg-[#132a13] rounded-3xl shadow p-8 text-center text-white">
                        <h2 className="text-2xl font-bold mb-2">Proof of Authenticity</h2>
                        <p className="text-[#ecf39e] mb-6 max-w-lg mx-auto">Scan this QR code to verify the origin and details of this crop directly from the blockchain or database.</p>
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
