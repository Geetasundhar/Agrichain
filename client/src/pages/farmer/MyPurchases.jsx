import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const API = import.meta.env.VITE_API_BASE_URL;

export default function MyPurchases() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await fetch(`${API}/farmer/my-purchases`, {
          headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        if (res.ok && data.purchases) {
          setPurchases(data.purchases);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div>Loading...</div>;
  return (
    <div className="min-h-screen bg-[#f8fad9] flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 px-6">
        <h2 className="text-3xl font-bold mb-6">My Purchases</h2>
        {purchases.length === 0 ? (
          <p>No purchases made yet.</p>
        ) : (
          <ul className="space-y-4">
            {purchases.map((p) => (
              <li key={p._id} className="bg-white p-4 rounded-xl shadow">
                <p>Product: {p.product?.productName}</p>
                <p>Type: {p.product?.productType}</p>
                <p>Quantity: {p.quantity}</p>
                <p>Retailer: {p.retailer?.name || p.retailer || "-"}</p>
                <p>Date: {new Date(p.createdAt).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </div>
  );
}
