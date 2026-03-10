import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const API = "http://localhost:5000";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [counts, setCounts] = useState({ farmers: 0, buyers: 0, retailers: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const res = await fetch(`${API}/admin/counts`);
                if (res.ok) {
                    const data = await res.json();
                    setCounts(data);
                }
            } catch (err) {
                console.error("Failed to fetch counts:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCounts();
    }, []);

    const cards = [
        {
            title: "Farmers",
            count: counts.farmers,
            icon: "fas fa-tractor",
            desc: "View and manage all registered farmers",
            link: "/admin/farmers",
            gradient: "from-[#132a13] to-[#31572c]",
            iconBg: "bg-[#ecf39e]",
            iconColor: "text-[#132a13]",
        },
        {
            title: "Retailers",
            count: counts.retailers,
            icon: "fas fa-store",
            desc: "View and manage all registered retailers",
            link: "/admin/retailers",
            gradient: "from-[#1b4332] to-[#2d6a4f]",
            iconBg: "bg-[#b7e4c7]",
            iconColor: "text-[#1b4332]",
        },
        {
            title: "Buyers",
            count: counts.buyers,
            icon: "fas fa-users",
            desc: "View and manage all registered buyers",
            link: "/admin/buyers",
            gradient: "from-[#3a5a40] to-[#588157]",
            iconBg: "bg-[#dad7cd]",
            iconColor: "text-[#3a5a40]",
        },
    ];

    return (
        <div className="min-h-screen bg-[#f8fad9] flex flex-col">
            <Navbar />

            {/* Header */}
            <div className="bg-gradient-to-r from-[#132a13] to-[#31572c]
                      text-[#ecf39e] px-4 sm:px-6 py-10 sm:py-14 mt-15">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                        <i className="fas fa-shield-alt mr-3 opacity-80"></i>
                        Admin Dashboard
                    </h1>
                    <p className="text-[#dbeccd] mt-3 text-base sm:text-lg max-w-2xl mx-auto">
                        Manage all users across the AgriChain platform
                    </p>
                </div>
            </div>

            {/* Cards */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 sm:-mt-10 flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                    {cards.map((card, i) => (
                        <div
                            key={i}
                            onClick={() => navigate(card.link)}
                            className="group bg-white rounded-3xl shadow-lg
                         hover:shadow-2xl hover:-translate-y-2
                         transition-all duration-300 overflow-hidden
                         cursor-pointer"
                        >
                            {/* Card Top Gradient Strip */}
                            <div className={`h-2 bg-gradient-to-r ${card.gradient}`}></div>

                            <div className="p-6 sm:p-8">
                                {/* Icon */}
                                <div className={`w-16 h-16 ${card.iconBg} rounded-2xl
                                flex items-center justify-center mb-5
                                group-hover:scale-110 transition-transform duration-300`}>
                                    <i className={`${card.icon} text-2xl ${card.iconColor}`}></i>
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-bold text-[#132a13] mb-1">
                                    {card.title}
                                </h3>

                                {/* Count */}
                                <div className="text-4xl font-extrabold text-[#4f772d] mb-3">
                                    {loading ? (
                                        <span className="inline-block w-12 h-10 bg-gray-200 rounded animate-pulse"></span>
                                    ) : (
                                        card.count
                                    )}
                                </div>

                                {/* Description */}
                                <p className="text-sm text-[#31572c] mb-4">
                                    {card.desc}
                                </p>
                            </div>

                            {/* Footer */}
                            <div className={`bg-gradient-to-r ${card.gradient} text-[#ecf39e]
                              py-3 px-6 text-center font-medium
                              group-hover:opacity-90 transition`}>
                                View All <i className="fas fa-arrow-right ml-2"></i>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default AdminDashboard;
