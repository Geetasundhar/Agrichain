import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useTranslation } from "react-i18next";

const FarmerDashboard = () => {
  const [farmerName, setFarmerName] = useState("Farmer");
  const [photo, setPhoto] = useState(null); // use null so we can check easily

  const [totalCropsCount, setTotalCropsCount] = useState(0);
  const [totalSalesAmount, setTotalSalesAmount] = useState(0);
  const [points, setPoints] = useState(0);

  const { t } = useTranslation();

  const formatCurrency = (amount) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  const stats = () => [
    { label: t("farmerDashboard.totalCrops"), value: totalCropsCount.toString(), icon: "fas fa-seedling" },
    { label: t("farmerDashboard.totalSales"), value: formatCurrency(totalSalesAmount), icon: "fas fa-rupee-sign" },
    { label: t("farmerDashboard.points") || "Points", value: points.toString(), icon: "fas fa-star text-yellow-500" },
  ];

  const cards = () => [
    {
      title: t("farmerDashboard.cropManagement"),
      desc: t("farmerDashboard.cropManagementDesc"),
      icon: "fas fa-leaf",
      link: "/farmer/my-crops",
    },
    {
      title: t("farmerDashboard.buyInputs"),
      desc: t("farmerDashboard.buyInputsDesc"),
      icon: "fas fa-shopping-cart",
      link: "/farmer/buy-product",
    },
    {
      title: t("farmerDashboard.sales"),
      desc: t("farmerDashboard.salesDesc"),
      icon: "fas fa-store",
      link: "/farmer/sales",
    },
    // {
    //   title: t("farmerDashboard.insurance"),
    //   desc: t("farmerDashboard.insuranceDesc"),
    //   icon: "fas fa-file-contract",
    //   link: "/farmer/insurance",
    // },
    {
      title: t("farmerDashboard.reports"),
      desc: t("farmerDashboard.reportsDesc"),
      icon: "fas fa-chart-bar",
      link: "/farmer/storage-report",
    },
    {
      title: t("farmerDashboard.myPurchases"),
      desc: t("farmerDashboard.myPurchasesDesc"),
      icon: "fas fa-shopping-cart",
      link: "/farmer/my-purchases",
    },
  ];

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const [profileRes, cropsRes, salesRes] = await Promise.all([
          fetch("http://localhost:5000/farmer/profile", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("http://localhost:5000/farmer/my-crops", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("http://localhost:5000/farmer/sales", { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          if (profileData.name) setFarmerName(profileData.name);
          if (profileData.points !== undefined) setPoints(profileData.points);
          if (profileData.photo) {
            setPhoto(
              profileData.photo.startsWith("data:")
                ? profileData.photo
                : `data:image/jpeg;base64,${profileData.photo}`
            );
          } else {
             setPhoto(null);
          }
        }

        if (cropsRes.ok) {
           const cropsData = await cropsRes.json();
           if (cropsData.crops) {
               setTotalCropsCount(cropsData.crops.length);
           }
        }

        if (salesRes.ok) {
            const salesData = await salesRes.json();
            if (salesData.sales) {
                const total = salesData.sales.reduce((sum, sale) => sum + (sale.totalPrice || 0), 0);
                setTotalSalesAmount(total);
            }
        }
      } catch (err) {
        console.error("Dashboard Error:", err);
      }
    };

    loadProfile();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fad9]">
      <Navbar />

      {/* ===== Header ===== */}
      <div className="bg-gradient-to-r from-[#132a13] to-[#31572c]
                    text-[#ecf39e] px-4 sm:px-6 py-10 sm:py-12 mt-15">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row
                      items-center sm:items-center
                      justify-between gap-6">

          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              {t("farmerDashboard.title")}
            </h1>
            <p className="text-[#dbeccd] mt-1 text-sm sm:text-base">
              {t("farmerDashboard.welcomeBack")}, {farmerName}
            </p>
          </div>

          <div
            onClick={() => (window.location.href = "/farmer/profile")}
            className="w-20 h-20 sm:w-16 sm:h-16 rounded-full
                     border-2 border-[#ecf39e] bg-[#ecf39e] text-[#132a13]
                     overflow-hidden cursor-pointer
                     flex items-center justify-center font-bold text-3xl
                     hover:scale-110 transition shrink-0"
          >
            {photo ? (
                <img
                  src={photo}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
            ) : (
                <span>{farmerName ? farmerName.charAt(0).toUpperCase() : "F"}</span>
            )}
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 sm:-mt-10">
        <div className="flex flex-col sm:flex-row justify-center gap-5 sm:gap-8 max-w-4xl mx-auto">
          {stats().map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl shadow-md p-6 sm:p-8
                       hover:shadow-xl hover:-translate-y-1
                       transition-all duration-300 flex-1"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 sm:p-4 bg-[#ecf39e]
                              rounded-xl text-[#132a13] text-xl sm:text-2xl">
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

      {/* ===== Action Cards ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6
                        mt-10 sm:mt-14
                        grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {cards().map((card, i) => (
          <div
            key={i}
            className="group bg-white rounded-3xl shadow-md
                     hover:shadow-2xl hover:-translate-y-2
                     transition-all duration-300 overflow-hidden"
          >
            <div className="p-6 sm:p-8">
              <div className="text-3xl sm:text-4xl text-[#4f772d]
                            mb-4 group-hover:scale-110 transition">
                <i className={card.icon}></i>
              </div>

              <h3 className="font-semibold text-base sm:text-lg
                           mb-2 text-[#132a13]">
                {card.title}
              </h3>

              <p className="text-sm text-[#31572c]">
                {card.desc}
              </p>
            </div>

            <a
              href={card.link}
              className="block text-center bg-[#132a13] text-[#ecf39e]
                       py-3 font-medium
                       group-hover:bg-[#31572c] transition"
            >
              {t("farmerDashboard.open")}
            </a>
          </div>
        ))}
      </section>

      <Footer />
    </div>
  );
}

/* ===== DATA ===== */

export default function FarmerDashboardWrapper() {
  const { t } = useTranslation();

  const stats = [
    { label: t("farmerDashboard.totalCrops"), value: "12", icon: "fas fa-seedling" },
    { label: t("farmerDashboard.totalSales"), value: "₹1.4L", icon: "fas fa-rupee-sign" },
    { label: t("farmerDashboard.insuranceClaims"), value: "3", icon: "fas fa-shield-alt" },
  ];

  const cards = [
    {
      title: t("farmerDashboard.cropManagement"),
      desc: t("farmerDashboard.cropDesc"),
      icon: "fas fa-leaf",
      link: "/farmer/my-crops",
    },
    {
      title: t("farmerDashboard.buyInputs"),
      desc: t("farmerDashboard.buyDesc"),
      icon: "fas fa-shopping-cart",
      link: "/farmer/buy-product",
    },
    {
      title: t("farmerDashboard.sales"),
      desc: t("farmerDashboard.salesDesc"),
      icon: "fas fa-store",
      link: "/sales",
    },
    {
      title: t("farmerDashboard.insurance"),
      desc: t("farmerDashboard.insuranceDesc"),
      icon: "fas fa-file-contract",
      link: "/farmer/insurance",
    },
    {
      title: t("farmerDashboard.reports"),
      desc: t("farmerDashboard.reportsDesc"),
      icon: "fas fa-chart-bar",
      link: "/farmer/storage-report",
    },
    {
      title: t("farmerDashboard.myPurchases"),
      desc: t("farmerDashboard.myPurchasesDesc"),
      icon: "fas fa-shopping-cart",
      link: "/farmer/my-purchases",
    },
  ];

  return <FarmerDashboard />;
}