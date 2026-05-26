import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useTranslation } from "react-i18next";

const API = import.meta.env.VITE_API_BASE_URL;

export default function Sales() {
  const { t } = useTranslation();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await fetch(`${API}/farmer/sales`, {
          headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        
        const data = await res.json();
        
        if (res.ok && data.sales) {
          setSales(data.sales);
        } else {
          setError(data.message || "Failed to fetch sales");
        }
      } catch (err) {
        console.error(err);
        setError("Network error fetching sales");
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  if (loading) return <div className="min-h-screen bg-[#f8fad9] flex items-center justify-center text-xl text-[#31572c] font-semibold">{t("buyCrops.loading") || "Loading..."}</div>;

  return (
    <div className="min-h-screen bg-[#f8fad9] flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 px-6 max-w-7xl mx-auto w-full">
        <h2 className="text-3xl font-bold mb-6 text-[#132a13]">{t("farmerSales.title") || "My Sales"}</h2>
        
        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
            </div>
        )}

        {sales.length === 0 && !error ? (
          <div className="bg-white p-8 rounded-xl shadow-md text-center text-lg text-[#4f772d]">
              {t("farmerSales.noSales") || "No sales recorded yet."}
          </div>
        ) : (
          <ul className="space-y-6">
            {sales.map((sale) => {
              const crop = sale.crop || {};
              const buyer = sale.buyer || {};
              
              return (
                <li key={sale._id} className="bg-white p-6 rounded-2xl shadow-md flex flex-col sm:flex-row gap-6 items-start sm:items-center border border-[#ecf39e]">
                  
                  {crop.images && crop.images[0] ? (
                    <img src={crop.images[0]} alt={crop.cropName} className="w-full sm:w-32 h-32 object-cover rounded-xl shadow-sm border border-gray-100" />
                  ) : (
                    <div className="w-full sm:w-32 h-32 bg-green-50 rounded-xl flex items-center justify-center text-green-600 border border-green-200">
                        <i className="fas fa-leaf text-3xl"></i>
                    </div>
                  )}
                  
                  <div className="flex-1 w-full flex flex-col sm:flex-row justify-between gap-4">
                    <div className="space-y-2">
                        <div className="flex justify-between sm:block">
                            <h3 className="font-bold text-xl text-[#132a13]">{crop.cropName || "-"}</h3>
                            <span className="text-xs font-semibold px-2 py-1 bg-[#ecf39e] text-[#31572c] rounded-md sm:hidden">
                                {crop.cropType || "-"}
                            </span>
                        </div>
                        
                        <div className="text-sm text-[#4f772d] flex items-center gap-2">
                            <i className="fas fa-calendar-alt opacity-70"></i>
                            {new Date(sale.createdAt).toLocaleString()}
                        </div>
                        
                        <div className="mt-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <p className="text-sm mb-1"><span className="font-semibold text-gray-700">{t("farmerSales.buyerName") || "Buyer"}:</span> {buyer.buyer_name || "-"}</p>
                            {buyer.business_name && <p className="text-sm mb-1"><span className="font-semibold text-gray-700">{t("farmerSales.businessName") || "Business"}:</span> {buyer.business_name}</p>}
                            <p className="text-sm"><span className="font-semibold text-gray-700">{t("farmerSales.contact") || "Contact"}:</span> {buyer.phone || "-"} {buyer.email ? `(${buyer.email})` : ""}</p>
                        </div>
                    </div>
                    
                    <div className="bg-[#f8fad9] p-4 rounded-xl border border-[#dbeccd] min-w-[200px] flex flex-col justify-center">
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-600 text-sm">{t("farmerSales.quantitySold") || "Sold"}:</span>
                            <span className="font-bold text-[#132a13]">{sale.quantityKg} kg</span>
                        </div>
                        <div className="flex justify-between mb-2 pb-2 border-b border-[#dbeccd]">
                            <span className="text-gray-600 text-sm">Price/kg:</span>
                            <span className="font-medium">₹{crop.pricePerKg || (sale.totalPrice / sale.quantityKg)}</span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                            <span className="text-sm text-[#31572c] font-semibold">{t("farmerSales.totalPrice") || "Total Received"}:</span>
                            <span className="text-xl font-bold font-mono text-green-700">₹{sale.totalPrice}</span>
                        </div>
                    </div>
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
