import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const API = "http://localhost:5000";

const AdminFarmers = () => {
    const navigate = useNavigate();
    const [farmers, setFarmers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        fetchFarmers();
    }, []);

    const fetchFarmers = async () => {
        try {
            const res = await fetch(`${API}/admin/farmers`);
            if (res.ok) {
                const data = await res.json();
                setFarmers(data);
            }
        } catch (err) {
            console.error("Failed to fetch farmers:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete farmer "${name}"? This action cannot be undone.`)) {
            return;
        }
        setDeletingId(id);
        try {
            const res = await fetch(`${API}/admin/farmer/${id}`, { method: "DELETE" });
            if (res.ok) {
                setFarmers((prev) => prev.filter((f) => f._id !== id));
            } else {
                alert("Failed to delete farmer");
            }
        } catch (err) {
            console.error("Delete error:", err);
            alert("Failed to delete farmer");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fad9] flex flex-col">
            <Navbar />

            {/* Header */}
            <div className="bg-gradient-to-r from-[#132a13] to-[#31572c]
                      text-[#ecf39e] px-4 sm:px-6 py-8 sm:py-10 mt-15">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold">
                            <i className="fas fa-tractor mr-3 opacity-80"></i>
                            All Farmers
                        </h1>
                        <p className="text-[#dbeccd] mt-1 text-sm">
                            {farmers.length} farmer{farmers.length !== 1 ? "s" : ""} registered
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/admin/dashboard")}
                        className="bg-[#ecf39e] text-[#132a13] px-4 py-2 rounded-xl
                       font-medium hover:bg-[#d4e157] transition text-sm"
                    >
                        <i className="fas fa-arrow-left mr-2"></i>Back
                    </button>
                </div>
            </div>

            {/* Table */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center text-[#4f772d]">
                            <i className="fas fa-spinner fa-spin text-3xl mb-3"></i>
                            <p>Loading farmers...</p>
                        </div>
                    ) : farmers.length === 0 ? (
                        <div className="p-12 text-center text-[#4f772d]">
                            <i className="fas fa-inbox text-4xl mb-3 opacity-50"></i>
                            <p className="text-lg">No farmers registered yet</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gradient-to-r from-[#132a13] to-[#31572c] text-[#ecf39e]">
                                        <th className="px-6 py-4 font-semibold text-sm">#</th>
                                        <th className="px-6 py-4 font-semibold text-sm">Name</th>
                                        <th className="px-6 py-4 font-semibold text-sm">Email</th>
                                        <th className="px-6 py-4 font-semibold text-sm">Phone</th>
                                        <th className="px-6 py-4 font-semibold text-sm">Gender</th>
                                        <th className="px-6 py-4 font-semibold text-sm">Age</th>
                                        <th className="px-6 py-4 font-semibold text-sm">Joined</th>
                                        <th className="px-6 py-4 font-semibold text-sm text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {farmers.map((farmer, i) => (
                                        <tr
                                            key={farmer._id}
                                            className="border-b border-gray-100 hover:bg-[#f0f7e0] transition-colors"
                                        >
                                            <td className="px-6 py-4 text-sm text-gray-500">{i + 1}</td>
                                            <td className="px-6 py-4 font-medium text-[#132a13]">{farmer.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{farmer.email}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{farmer.phone || "—"}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600 capitalize">{farmer.gender || "—"}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{farmer.age || "—"}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {farmer.createdAt
                                                    ? new Date(farmer.createdAt).toLocaleDateString("en-IN", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                    })
                                                    : "—"}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => handleDelete(farmer._id, farmer.name)}
                                                    disabled={deletingId === farmer._id}
                                                    className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm
                                     font-medium hover:bg-red-600 transition
                                     disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {deletingId === farmer._id ? (
                                                        <i className="fas fa-spinner fa-spin"></i>
                                                    ) : (
                                                        <>
                                                            <i className="fas fa-trash-alt mr-1"></i> Delete
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default AdminFarmers;
