import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const API = import.meta.env.VITE_API_BASE_URL;

export default function BuyProduct() {
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API}/farmer/buy-product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ productId, quantity: Number(quantity) }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Purchase successful");
        setProductId("");
        setQuantity("");
      } else {
        alert(data.message || "Failed to buy product");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fad9] flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 px-6">
        <h2 className="text-3xl font-bold text-[#132a13] mb-6">Buy Product</h2>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 bg-white p-6 rounded-xl shadow">
          <input
            type="text"
            placeholder="Product ID"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="input w-full"
            required
          />
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="input w-full"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#132a13] text-[#ecf39e] py-2 px-4 rounded-lg"
          >
            {loading ? "Buying..." : "Buy"}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
