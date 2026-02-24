import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useTranslation } from "react-i18next";

const API = import.meta.env.VITE_API_BASE_URL;

export default function Orders() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API}/retailer/purchases`, {
          headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        if (res.ok && data.purchases) {
          setOrders(data.purchases);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-[#f8fad9] flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 px-6">
        <section className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#132a13]">
            {t("orders.title") || "Purchase Orders"}
          </h2>
        </section>
        <section className="max-w-4xl mx-auto">
          {orders.length === 0 ? (
            <p>No orders yet.</p>
          ) : (
            <ul className="space-y-4">
              {orders.map((o) => (
                <li key={o._id} className="bg-white p-4 rounded-xl shadow">
                  <p>Product: {o.product?.productName}</p>
                  <p>Type: {o.product?.productType}</p>
                  <p>Quantity: {o.quantity}</p>
                  <p>Farmer: {o.farmer?.name || o.farmer || "-"}</p>
                  <p>Date: {new Date(o.createdAt).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
