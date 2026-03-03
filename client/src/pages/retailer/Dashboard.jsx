import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useTranslation } from "react-i18next";

const API = import.meta.env.VITE_API_BASE_URL;

export function Dashboard({ cards }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [retailer, setRetailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(() => [
    { label: t("retailerDashboard.totalProducts"), value: "0", icon: "fas fa-box" },
    { label: t("retailerDashboard.totalOrders"), value: "0", icon: "fas fa-shopping-cart" },
    { label: t("retailerDashboard.totalRevenue"), value: "₹0", icon: "fas fa-rupee-sign" },
  ]);

  useEffect(() => {
    // Check if retailer is logged in
    const retailerData = localStorage.getItem("retailer");
    if (!retailerData) {
      navigate("/retailer/login");
      return;
    }
    setRetailer(JSON.parse(retailerData));

    // fetch stats
    const fetchStats = async () => {
      try {
        const [prodRes, orderRes] = await Promise.all([
          fetch(`${API}/retailer/products`, {
            headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
          }),
          fetch(`${API}/retailer/purchases`, {
            headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
          }),
        ]);
        const prodData = await prodRes.json();
        const orderData = await orderRes.json();
        const totalProducts = prodData.products ? prodData.products.length : 0;
        const totalOrders = orderData.purchases ? orderData.purchases.length : 0;
        let revenue = 0;
        if (orderData.purchases) {
          revenue = orderData.purchases.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
        }
        setStats([
          { label: t("retailerDashboard.totalProducts"), value: totalProducts, icon: "fas fa-box" },
          { label: t("retailerDashboard.totalOrders"), value: totalOrders, icon: "fas fa-shopping-cart" },
          { label: t("retailerDashboard.totalRevenue"), value: `₹${revenue}`, icon: "fas fa-rupee-sign" },
        ]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();

    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("retailer");
    navigate("/");
  };

  if (loading) {
    return <div>{t("buyCrops.loading")}</div>;
  }

  return (
    <div className="min-h-screen bg-[#f8fad9]">
      <Navbar />

      {/* ===== Header ===== */}
      <div className="bg-gradient-to-r from-[#132a13] to-[#31572c] text-[#ecf39e] px-4 sm:px-6 py-10 sm:py-12 mt-15">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center sm:items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              {t("retailerDashboard.title")}
            </h1>
            <p className="text-[#dbeccd] mt-1 text-sm sm:text-base">
              {t("retailerDashboard.welcomeBack")}, {retailer?.name}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {retailer?.shop_image && (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-[#ecf39e] overflow-hidden">
                <img
                  src={retailer.shop_image.startsWith("data:") ? retailer.shop_image : `data:image/jpeg;base64,${retailer.shop_image}`}
                  alt="Shop"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <button
              onClick={handleLogout}
              className="bg-[#ecf39e] hover:bg-[#94c668] text-[#132a13] font-bold py-2 px-4 rounded-lg transition"
            >
              {t("retailerDashboard.logout")}
            </button>
          </div>
        </div>
      </div>

      {/* ===== Stats ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 sm:-mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-md p-5 sm:p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 sm:p-4 bg-[#ecf39e] rounded-xl text-[#132a13] text-xl sm:text-2xl">
                  <i className={s.icon}></i>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#132a13]">
                    {s.value}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4f772d]">
                    {s.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== License Details ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 sm:mt-10">
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300">
          <h3 className="text-lg font-semibold text-[#132a13] mb-4">
            {t("retailerDashboard.licenseStatus")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 bg-[#f8fad9] rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#ecf39e] rounded-lg">
                  <i className="fas fa-seedling text-[#132a13]"></i>
                </div>
                <span className="text-[#4f772d] font-medium">{t("retailerDashboard.seedLicense")}:</span>
              </div>
              <span
                className={`font-bold ${retailer?.verified_licenses?.seed
                    ? "text-[#71a940]"
                    : "text-gray-400"
                  }`}
              >
                {retailer?.verified_licenses?.seed ? (
                  <>
                    <i className="fas fa-check-circle mr-1"></i> {t("retailerDashboard.verified")}
                  </>
                ) : (
                  <>
                    <i className="fas fa-times-circle mr-1"></i> {t("retailerDashboard.notVerified")}
                  </>
                )}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-[#f8fad9] rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#ecf39e] rounded-lg">
                  <i className="fas fa-flask text-[#132a13]"></i>
                </div>
                <span className="text-[#4f772d] font-medium">{t("retailerDashboard.fertilizerLicense")}:</span>
              </div>
              <span
                className={`font-bold ${retailer?.verified_licenses?.fertilizer
                    ? "text-[#71a940]"
                    : "text-gray-400"
                  }`}
              >
                {retailer?.verified_licenses?.fertilizer ? (
                  <>
                    <i className="fas fa-check-circle mr-1"></i> {t("retailerDashboard.verified")}
                  </>
                ) : (
                  <>
                    <i className="fas fa-times-circle mr-1"></i> {t("retailerDashboard.notVerified")}
                  </>
                )}
              </span>
            </div>
          </div>
          {retailer?.licenses && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl">
              <h4 className="text-sm font-semibold text-[#132a13] mb-2">{t("retailerDashboard.licenseObj")}:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                {retailer.licenses.seed && (
                  <p className="text-[#4f772d]">
                    <span className="font-medium">{t("buyProduct.seed")}:</span> {retailer.licenses.seed}
                  </p>
                )}
                {retailer.licenses.fertilizer && (
                  <p className="text-[#4f772d]">
                    <span className="font-medium">{t("buyProduct.fertilizer")}:</span> {retailer.licenses.fertilizer}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===== Action Cards ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {cards.map((card, i) => (
          <div
            key={i}
            className="group bg-white rounded-3xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
          >
            <div className="p-6 sm:p-8">
              <div className="text-3xl sm:text-4xl text-[#4f772d] mb-4 group-hover:scale-110 transition">
                <i className={card.icon}></i>
              </div>
              <h3 className="font-semibold text-base sm:text-lg mb-2 text-[#132a13]">
                {card.title}
              </h3>
              <p className="text-sm text-[#31572c]">
                {card.desc}
              </p>
            </div>
            <button
              onClick={() => navigate(card.link)}
              className="block w-full text-center bg-[#132a13] text-[#ecf39e] py-3 font-medium group-hover:bg-[#31572c] transition"
            >
              {t("farmerDashboard.open")}
            </button>
          </div>
        ))}
      </section>

      <Footer />
    </div>
  );
}

export default function DashboardWrapper() {
  const { t } = useTranslation();
  const cards = [
    {
      title: t("retailerDashboard.viewProducts"),
      desc: t("retailerDashboard.viewProductsDesc"),
      icon: "fas fa-eye",
      link: "/retailer/products",
    },
    {
      title: t("retailerDashboard.addProducts"),
      desc: t("retailerDashboard.addProductsDesc"),
      icon: "fas fa-plus",
      link: "/retailer/add-product",
    },
    {
      title: t("retailerDashboard.viewOrders"),
      desc: t("retailerDashboard.viewOrdersDesc"),
      icon: "fas fa-list",
      link: "/retailer/orders",
    },
    {
      title: t("retailerDashboard.reports"),
      desc: t("retailerDashboard.reportsDesc"),
      icon: "fas fa-chart-bar",
      link: "/retailer/reports",
    },
  ];

  return <Dashboard cards={cards} />;
}