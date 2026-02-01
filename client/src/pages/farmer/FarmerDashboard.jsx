import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const FarmerDashboard = () => {
  const [farmerName, setFarmerName] = useState("Farmer");
  const [photo, setPhoto] = useState("/images/farmer-profile.jpg");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("http://localhost:5000/farmer/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return;

        const data = await res.json();
        if (data.name) setFarmerName(data.name);
        if (data.photo) {
          setPhoto(
            data.photo.startsWith("data:")
              ? data.photo
              : `data:image/jpeg;base64,${data.photo}`
          );
        }
      } catch (err) {
        console.error(err);
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
            Farmer Dashboard
          </h1>
          <p className="text-[#dbeccd] mt-1 text-sm sm:text-base">
            Welcome back, {farmerName}
          </p>
        </div>

        <div
          onClick={() => (window.location.href = "/farmer/profile")}
          className="w-20 h-20 sm:w-16 sm:h-16 rounded-full
                     border-2 border-[#ecf39e]
                     overflow-hidden cursor-pointer
                     hover:scale-110 transition"
        >
          <img
            src={photo}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>

    {/* ===== Stats ===== */}
    <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 sm:-mt-10">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-md p-5 sm:p-6
                       hover:shadow-xl hover:-translate-y-1
                       transition-all duration-300"
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
      {cards.map((card, i) => (
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
            Open
          </a>
        </div>
      ))}
    </section>

    <Footer />
  </div>
);

};

/* ===== DATA ===== */

const stats = [
  { label: "Total Crops", value: "12", icon: "fas fa-seedling" },
  { label: "Total Sales", value: "₹1.4L", icon: "fas fa-rupee-sign" },
  { label: "Insurance Claims", value: "3", icon: "fas fa-shield-alt" },
];

const cards = [
  {
    title: "Crop Management",
    desc: "Create and manage all your crops easily.",
    icon: "fas fa-leaf",
    link: "/farmer/add-crop",
  },
  {
    title: "Sales",
    desc: "Track orders, buyers, and payments of sales.",
    icon: "fas fa-store",
    link: "/sales",
  },
  {
    title: "Insurance",
    desc: "Apply and monitor insurance claims and finance.",
    icon: "fas fa-file-contract",
    link: "/farmer/insurance",
  },
  {
    title: "Reports",
    desc: "View analytics and farming insights reports.",
    icon: "fas fa-chart-bar",
    link: "/farmer/storage-report",
  },
];

export default FarmerDashboard;
