import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import { useTranslation } from "react-i18next";

const API = import.meta.env.VITE_API_BASE_URL;

export default function MyPurchases() {
  const { t } = useTranslation();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
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
    fetchPurchases();
  }, []);

  if (loading) return <div>{t("buyCrops.loading")}</div>;
  return (
    <div className="min-h-screen bg-[#f8fad9] flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 px-6">
        <h2 className="text-3xl font-bold mb-6">{t("farmerDashboard.myPurchases")}</h2>
        {purchases.length === 0 ? (
          <p>{t("farmerPurchases.noPurchases")}</p>
        ) : (
          <ul className="space-y-4">
            {purchases.map((p) => {
              const unitPrice = p.totalPrice && p.quantity ? (p.totalPrice / p.quantity) : p.product?.price || 0;
              const productId = p.productId || p.product?.productId || "-";
              return (
                <li key={p._id} className="bg-white p-4 rounded-xl shadow flex gap-4 items-center">
                  {p.retailer?.shop_image ? (
                    <img src={p.retailer.shop_image} alt="shop" className="w-20 h-20 object-cover rounded" />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">{t("cropDisplay.noPhoto")}</div>
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-semibold">{p.product?.productName || "-"}</h3>
                      <div className="text-sm text-gray-600">{new Date(p.createdAt).toLocaleString()}</div>
                    </div>
                    <p className="text-sm">{t("myPurchases.productId")}: {productId}</p>
                    <p className="text-sm">{t("myPurchases.type")}: {p.product?.productType || "-"}</p>
                    <p className="text-sm">{t("myPurchases.retailer")}: {p.retailer?.name || "-"}</p>
                    <p className="text-sm">{t("myPurchases.quantity")}: {p.quantity}</p>
                    <p className="text-sm">{t("myPurchases.unitPrice")}: {unitPrice}</p>
                    <p className="text-sm font-semibold">{t("myPurchases.totalPaid")}: {p.totalPrice || (unitPrice * p.quantity) || 0}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>
      <Footer />
    </div>
  );
}