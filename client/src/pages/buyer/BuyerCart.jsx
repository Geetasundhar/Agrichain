import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function BuyerCart() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = async () => {
        const localCart = JSON.parse(localStorage.getItem("cart")) || [];
        if (localCart.length === 0) {
            setCartItems([]);
            return;
        }

        try {
            const API = import.meta.env.VITE_API_BASE_URL;
            const res = await fetch(`${API}/buyer/crops`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            const data = await res.json();

            if (data.status === "success") {
                const liveCrops = data.crops;
                // Filter out crops that no longer exist or have 0 quantity in the live data
                const validCartItems = localCart.filter(item => {
                    const live = liveCrops.find(l => l._id === item._id);
                    return live && live.quantityKg > 0;
                }).map(item => {
                    const live = liveCrops.find(l => l._id === item._id);
                    // Update to match current live price and quantity constraints
                    return {
                        ...item,
                        quantityKg: live.quantityKg,
                        pricePerKg: live.pricePerKg
                    };
                });

                setCartItems(validCartItems);
                localStorage.setItem("cart", JSON.stringify(validCartItems));
            } else {
                setCartItems(localCart);
            }
        } catch (err) {
            console.error("Error verifying cart items:", err);
            setCartItems(localCart);
        }
    };

    const removeFromCart = (e, indexToRemove) => {
        e.stopPropagation(); // prevent navigating to crop detail when clicking remove
        const updated = cartItems.filter((_, idx) => idx !== indexToRemove);
        setCartItems(updated);
        localStorage.setItem("cart", JSON.stringify(updated));
    };

    const proceedToCheckout = () => {
        navigate("/buyer/checkout");
    }

    return (
        <div className="min-h-screen bg-[#f8fad9] flex flex-col">
            <Navbar />

            <main className="flex-grow pt-28 px-6 max-w-6xl mx-auto w-full pb-10">
                <button
                    onClick={() => navigate("/buyer/dashboard")}
                    className="mb-6 text-[#132a13] font-semibold hover:underline"
                >
                    ← Back to Dashboard
                </button>

                <h2 className="text-3xl font-bold text-[#132a13] mb-6">
                    My Cart 🛒
                </h2>

                {cartItems.length === 0 ? (
                    <div className="bg-white rounded-3xl shadow p-8 text-center text-gray-500">
                        <p className="text-xl">Your cart is empty.</p>
                        <button
                            onClick={() => navigate("/buyer/crops")}
                            className="mt-6 bg-[#31572c] text-[#ecf39e] py-2 px-6 rounded-xl font-bold hover:bg-[#132a13] transition"
                        >
                            Browse Crops
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cartItems.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => navigate(`/buyer/crop/${item._id}`)}
                                className="bg-white rounded-2xl shadow hover:shadow-xl transition p-6 flex flex-col cursor-pointer"
                            >
                                {/* 🖼 Crop Image */}
                                <img
                                    src={item.images?.[0] || "https://via.placeholder.com/400"}
                                    alt={item.cropName}
                                    className="w-full h-40 object-cover rounded-xl"
                                />

                                {/* 📝 Crop Info */}
                                <h3 className="text-xl font-bold text-[#132a13] mt-4">
                                    {item.cropName}
                                </h3>

                                <p className="text-sm text-[#31572c] mt-1">
                                    ₹{item.pricePerKg} / kg • {item.quantityKg} kg available
                                </p>

                                <p className="text-sm mt-2 text-gray-600">
                                    📍 {item.location || (item.farmerId?.name || "Unknown Farmer")}
                                </p>

                                {/* Remove Button */}
                                <button
                                    onClick={(e) => removeFromCart(e, index)}
                                    className="mt-6 w-full bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition font-semibold"
                                >
                                    Remove from Cart
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {cartItems.length > 0 && (
                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={proceedToCheckout}
                            className="bg-[#132a13] text-white py-3 px-8 rounded-xl font-bold hover:opacity-90 transition shadow-md"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
