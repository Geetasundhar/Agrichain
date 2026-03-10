import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const API = "http://localhost:5000";

const AdminRetailers = () => {
    const navigate = useNavigate();
    const [retailers, setRetailers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        fetchRetailers();
    }, []);

    const fetchRetailers = async () => {
        try {
            const res = await fetch(`${API}/admin/retailers`);
            if (res.ok) {
                const data = await res.json();
                setRetailers(data);
            }
        } catch (err) {
            console.error("Failed to fetch retailers:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete retailer "${name}"? This action cannot be undone.`)) {
            return;
        }
        setDeletingId(id);
        try {
            const res = await fetch(`${API}/admin/retailer/${id}`, { method: "DELETE" });
            if (res.ok) {
                setRetailers((prev) => prev.filter((r) => r._id !== id));
            } else {
                alert("Failed to delete retailer");
            }
        } catch (err) {
            console.error("Delete error:", err);
            alert("Failed to delete retailer");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fad9] flex flex-col">
            <Navbar />

            {/* Header */}
            <div className="bg-gradient-to-r from-[#1b4332] to-[#2d6a4f]
                      text-[#b7e4c7] px-4 sm:px-6 py-8 sm:py-10 mt-15">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">
                            <i className="fas fa-store mr-3 opacity-80"></i>
                            All Retailers
                        </h1>
                        <p className="text-[#d8f3dc] mt-1 text-sm">
                            {retailers.length} retailer{retailers.length !== 1 ? "s" : ""} registered
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/admin/dashboard")}
                        className="bg-[#b7e4c7] text-[#1b4332] px-4 py-2 rounded-xl
                       font-medium hover:bg-[#95d5b2] transition text-sm"
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
                            <p>Loading retailers...</p>
                        </div>
                    ) : retailers.length === 0 ? (
                        <div className="p-12 text-center text-[#4f772d]">
                            <i className="fas fa-inbox text-4xl mb-3 opacity-50"></i>
                            <p className="text-lg">No retailers registered yet</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gradient-to-r from-[#1b4332] to-[#2d6a4f] text-white">
                                        <th className="px-6 py-4 font-semibold text-sm">#</th>
                                        <th className="px-6 py-4 font-semibold text-sm">Name</th>
                                        <th className="px-6 py-4 font-semibold text-sm">Email</th>
                                        <th className="px-6 py-4 font-semibold text-sm">Seed License</th>
                                        <th className="px-6 py-4 font-semibold text-sm">Fertilizer License</th>
                                        <th className="px-6 py-4 font-semibold text-sm">Joined</th>
                                        <th className="px-6 py-4 font-semibold text-sm text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {retailers.map((retailer, i) => (
                                        <tr
                                            key={retailer._id}
                                            className="border-b border-gray-100 hover:bg-[#f0f7e0] transition-colors"
                                        >
                                            <td className="px-6 py-4 text-sm text-gray-500">{i + 1}</td>
                                            <td className="px-6 py-4 font-medium text-[#132a13]">{retailer.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{retailer.email}</td>
                                            <td className="px-6 py-4 text-sm">
                                                {retailer.verified_licenses?.seed ? (
                                                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700
                                           px-3 py-1 rounded-full text-xs font-medium">
                                                        <i className="fas fa-check-circle"></i> Verified
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 bg-red-100 text-red-600
                                           px-3 py-1 rounded-full text-xs font-medium">
                                                        <i className="fas fa-times-circle"></i> Not Verified
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {retailer.verified_licenses?.fertilizer ? (
                                                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700
                                           px-3 py-1 rounded-full text-xs font-medium">
                                                        <i className="fas fa-check-circle"></i> Verified
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 bg-red-100 text-red-600
                                           px-3 py-1 rounded-full text-xs font-medium">
                                                        <i className="fas fa-times-circle"></i> Not Verified
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {retailer.createdAt
                                                    ? new Date(retailer.createdAt).toLocaleDateString("en-IN", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                    })
                                                    : "—"}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => handleDelete(retailer._id, retailer.name)}
                                                    disabled={deletingId === retailer._id}
                                                    className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm
                                     font-medium hover:bg-red-600 transition
                                     disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {deletingId === retailer._id ? (
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

export default AdminRetailers;
