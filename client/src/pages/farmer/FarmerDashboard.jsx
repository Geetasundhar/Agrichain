import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
const API = import.meta.env.VITE_API_BASE_URL;

const FarmerDashboard = () => {
  const [farmerName, setFarmerName] = useState("Farmer");
  const [photo, setPhoto] = useState("/images/farmer-profile.jpg");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("http://localhost:8000/farmer/profile", {
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
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      {/* Header Section */}
      <div className="bg-linear-to-r from-green-700 to-emerald-500 text-white px-6 py-10 mt-18">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Farmer Dashboard</h1>
            <p className="text-green-100 mt-1">
              Welcome back, {farmerName}
            </p>
          </div>

          <div
            onClick={() => (window.location.href = "/farmer/profile")}
            className="w-16 h-16 rounded-full border-2 border-white overflow-hidden cursor-pointer hover:scale-105 transition"
          >
            <img src={photo} alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-6 -mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow p-6 flex items-center gap-4"
            >
              <div className="p-3 bg-green-100 rounded-lg text-green-700 text-xl">
                <i className={s.icon}></i>
              </div>
              <div>
                <h3 className="text-xl font-bold">{s.value}</h3>
                <p className="text-sm text-gray-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Actions */}
      <section className="max-w-7xl mx-auto px-6 mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div
            key={i}
            className="group bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden"
          >
            <div className="p-6">
              <div className="text-3xl text-green-700 mb-4">
                <i className={card.icon}></i>
              </div>
              <h3 className="font-semibold text-lg mb-2">
                {card.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {card.desc}
              </p>
            </div>

            <a
              href={card.link}
              className="block text-center bg-green-700 text-white py-3 group-hover:bg-green-800 transition"
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

/* -------- DATA -------- */

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
    link: "/reports",
  },
];

export default FarmerDashboard;
