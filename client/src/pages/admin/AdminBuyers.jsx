import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const API = "http://localhost:5000";

const AdminBuyers = () => {
    const navigate = useNavigate();
    const [buyers, setBuyers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        fetchBuyers();
    }, []);

    const fetchBuyers = async () => {
        try {
            const res = await fetch(`${API}/admin/buyers`);
            if (res.ok) {
                const data = await res.json();
                setBuyers(data);
            }
        } catch (err) {
            console.error("Failed to fetch buyers:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete buyer "${name}"? This action cannot be undone.`)) {
            return;
        }
        setDeletingId(id);
        try {
            const res = await fetch(`${API}/admin/buyer/${id}`, { method: "DELETE" });
            if (res.ok) {
                setBuyers((prev) => prev.filter((b) => b._id !== id));
            } else {
                alert("Failed to delete buyer");
            }
        } catch (err) {
            console.error("Delete error:", err);
            alert("Failed to delete buyer");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fad9] flex flex-col">
            <Navbar />

            {/* Header */}
            <div className="bg-gradient-to-r from-[#3a5a40] to-[#588157]
                      text-[#dad7cd] px-4 sm:px-6 py-8 sm:py-10 mt-15">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">
                            <i className="fas fa-users mr-3 opacity-80"></i>
                            All Buyers
                        </h1>
                        <p className="text-[#d8f3dc] mt-1 text-sm">
                            {buyers.length} buyer{buyers.length !== 1 ? "s" : ""} registered
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/admin/dashboard")}
                        className="bg-[#dad7cd] text-[#3a5a40] px-4 py-2 rounded-xl
                       font-medium hover:bg-[#c5c0b5] transition text-sm"
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
                            <p>Loading buyers...</p>
                        </div>
                    ) : buyers.length === 0 ? (
                        <div className="p-12 text-center text-[#4f772d]">
                            <i className="fas fa-inbox text-4xl mb-3 opacity-50"></i>
                            <p className="text-lg">No buyers registered yet</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gradient-to-r from-[#3a5a40] to-[#588157] text-white">
                                        <th className="px-6 py-4 font-semibold text-sm">#</th>
                                        <th className="px-6 py-4 font-semibold text-sm">Name</th>
                                        <th className="px-6 py-4 font-semibold text-sm">Business Name</th>
                                        <th className="px-6 py-4 font-semibold text-sm">District</th>
                                        <th className="px-6 py-4 font-semibold text-sm">Email</th>
                                        <th className="px-6 py-4 font-semibold text-sm">Phone</th>
                                        <th className="px-6 py-4 font-semibold text-sm">Joined</th>
                                        <th className="px-6 py-4 font-semibold text-sm text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {buyers.map((buyer, i) => (
                                        <tr
                                            key={buyer._id}
                                            className="border-b border-gray-100 hover:bg-[#f0f7e0] transition-colors"
                                        >
                                            <td className="px-6 py-4 text-sm text-gray-500">{i + 1}</td>
                                            <td className="px-6 py-4 font-medium text-[#132a13]">{buyer.buyer_name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{buyer.business_name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{buyer.district}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{buyer.email}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{buyer.phone || "—"}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {buyer.createdAt
                                                    ? new Date(buyer.createdAt).toLocaleDateString("en-IN", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                    })
                                                    : "—"}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => handleDelete(buyer._id, buyer.buyer_name)}
                                                    disabled={deletingId === buyer._id}
                                                    className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm
                                     font-medium hover:bg-red-600 transition
                                     disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {deletingId === buyer._id ? (
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

export default AdminBuyers;
