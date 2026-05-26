import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";

const API = import.meta.env.VITE_API_BASE_URL;

export default function CropInfo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVerified, setIsVerified] = useState(null); // null = unknown, true = verified, false = not verified

  useEffect(() => {
    const fetchCropDetails = async () => {
      try {
        const res = await fetch(`${API}/farmer/crops/${id}`);
        const result = await res.json();
        if (result.status === "success" && result.crop) {
          setData(result);

          // Check farmer points to determine verification status
          const farmerPoints = result.crop.farmerId?.points ?? 0;
          const verified = farmerPoints >= 0;
          setIsVerified(verified);

          // Redirect to correct URL based on verification status
          const currentPath = location.pathname;
          const basePath = `/crop-info/${id}`;
          const targetPath = verified ? `${basePath}/verified` : `${basePath}/not-verified`;

          if (!currentPath.endsWith("/verified") && !currentPath.endsWith("/not-verified")) {
            // First visit (base URL) — redirect to correct status URL
            navigate(targetPath, { replace: true });
          } else if (verified && currentPath.endsWith("/not-verified")) {
            // Farmer now has positive points, redirect to verified
            navigate(`${basePath}/verified`, { replace: true });
          } else if (!verified && currentPath.endsWith("/verified")) {
            // Farmer now has negative points, redirect to not-verified
            navigate(`${basePath}/not-verified`, { replace: true });
          }
        } else {
          setError(result.message || "Failed to fetch crop details");
        }
      } catch (err) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchCropDetails();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#f8fad9] text-xl font-bold text-[#31572c]">Loading Details...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-[#f8fad9] text-red-600 font-bold text-xl">{error}</div>;
  }

  if (!data || !data.crop) {
    return <div className="min-h-screen flex items-center justify-center bg-[#f8fad9] text-xl font-bold text-[#132a13]">Crop not found</div>;
  }

  // ❌ If farmer has negative points, show "Not Verified" page
  if (isVerified === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 md:p-16 max-w-xl w-full text-center border-2 border-red-200">
          {/* Warning Icon */}
          <div className="w-28 h-28 mx-auto mb-8 bg-red-100 rounded-full flex items-center justify-center shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-red-700 mb-4">
            ⚠️ Not Verified on Blockchain
          </h1>

          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            This farmer’s crop data is currently <span className="font-bold text-red-600">unavailable</span> because it has <span className="font-bold text-red-600">not been verified on the blockchain network</span>.
          </p>

          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-8">
            <p className="text-sm text-red-700 font-semibold">
              🔒 The farmer must complete blockchain validation steps such as updating crop records, submitting proof, and achieving consensus verification before the data becomes accessible.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Farmer</p>
              <p className="font-bold text-gray-800 text-lg">{data.crop.farmerId?.name || "Unknown"}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Crop</p>
              <p className="font-bold text-gray-800 text-lg capitalize">{data.crop.cropName}</p>
            </div>
            {/* <div className="bg-red-50 rounded-xl p-4 border border-red-200">
              <p className="text-xs text-red-500 font-bold uppercase tracking-wider mb-1">Trust Points</p>
              <p className="font-extrabold text-red-600 text-2xl">{data.crop.farmerId?.points ?? 0}</p>
            </div> */}
          </div>

          <p className="mt-8 text-sm text-gray-400 font-medium">
            Please check back later once the farmer’s data is successfully verified and recorded on the blockchain.
          </p>
        </div>
      </div>
    );
  }

  // ✅ Farmer has positive/zero points — show full crop info
  const { crop, land, feedbacks = [] } = data;

  return (
    <div className="min-h-screen bg-[#f8fad9] flex flex-col font-sans">
      <main className="flex-grow py-12 px-4 md:px-8 max-w-6xl mx-auto w-full">

        {/* Verified Badge */}
        <div className="bg-green-100 border border-green-300 rounded-2xl p-4 mb-6 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="font-extrabold text-green-800 text-lg">✅ Blockchain Verified Farmer</p>
            <p className="text-sm text-green-700 font-medium">This farmer’s crop data is verified and securely recorded on the blockchain.</p>
          </div>
        </div>

        {/* 1. Crop Main Section */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 mb-8 border border-green-100">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left: Main Image & Timeline */}
            <div className="md:w-1/2">
              <img
                src={crop.images?.[0] || "https://via.placeholder.com/400"}
                alt={crop.cropName}
                className="w-full h-80 object-cover rounded-2xl shadow-md"
              />

              {/* Progress Timeline Photos */}
              {crop.progressPhotos && crop.progressPhotos.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-xl font-bold text-[#132a13] mb-4">Growth Timeline 🌱</h4>
                  <div className="grid grid-cols-4 gap-3">
                    {crop.progressPhotos.map((photo, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <img
                          src={photo.imageData}
                          alt={`Progress ${index + 1}`}
                          className="w-full h-24 object-cover rounded-xl shadow-sm border border-green-200"
                        />
                        <span className="text-sm font-semibold text-[#31572c] mt-2">Stage {index + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Crop Details & Farmer */}
            <div className="md:w-1/2 flex flex-col justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-[#132a13] mb-2 drop-shadow-sm capitalize">{crop.cropName}</h1>
                <p className="text-2xl text-[#31572c] font-bold mb-6">
                  ₹{crop.pricePerKg} / kg <span className="text-gray-500 text-lg font-medium ml-2">({crop.quantityKg} kg available)</span>
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-[#f8fad9] p-4 rounded-2xl shadow-sm">
                    <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">Crop Type</p>
                    <p className="font-bold text-[#132a13] text-lg capitalize">{crop.cropType || "N/A"}</p>
                  </div>
                  <div className="bg-[#f8fad9] p-4 rounded-2xl shadow-sm">
                    <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">Soil Type</p>
                    <p className="font-bold text-[#132a13] text-lg capitalize">{crop.soilType || "N/A"}</p>
                  </div>
                  <div className="bg-[#f8fad9] p-4 rounded-2xl shadow-sm">
                    <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">Duration</p>
                    <p className="font-bold text-[#132a13] text-lg">{crop.durationNumber} {crop.durationPeriod}(s)</p>
                  </div>
                  <div className="bg-[#f8fad9] p-4 rounded-2xl shadow-sm">
                    <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">Harvest Date</p>
                    <p className="font-bold text-[#132a13] text-lg">{dayjs(crop.createdAt).format("MMM D, YYYY")}</p>
                  </div>
                </div>

                {/* Farmer Info */}
                <div className="border border-green-200 bg-green-50 p-5 rounded-2xl flex items-center gap-5 shadow-sm">
                  <div className="w-16 h-16 bg-[#31572c] text-[#ecf39e] rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                    {crop.farmerId?.name ? crop.farmerId.name.charAt(0).toUpperCase() : "👨‍🌾"}
                  </div>
                  <div>
                    <p className="text-xs text-green-700 font-bold uppercase tracking-wider mb-1">Grown by</p>
                    <p className="font-extrabold text-[#132a13] text-xl">{crop.farmerId?.name || "Unknown Farmer"}</p>
                    <p className="text-sm text-gray-700 font-medium mt-1">📞 {crop.farmerId?.phone || "N/A"} <span className="mx-2">•</span> ✉️ {crop.farmerId?.email || "N/A"}</p>
                    {(land || crop.farmAddress) && (
                      <p className="text-sm text-blue-700 font-semibold mt-2 flex items-center gap-1">
                        📍 {land?.farmName ? `${land.farmName}, ` : ""}{crop.farmAddress || land?.farmAddress || "Local Farm"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Traceability: Seeds & Fertilizers Retailer Info */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 mb-8 border border-green-100">
          <h2 className="text-3xl font-bold text-[#132a13] mb-8 flex items-center gap-3">
            🔗 Supply Traceability
          </h2>
          <div className="grid md:grid-cols-2 gap-8">

            {/* Seed Info */}
            <div className="border-2 border-dashed border-green-200 p-6 rounded-3xl bg-gray-50 hover:bg-white transition duration-300">
              <h3 className="text-xl font-extrabold text-[#31572c] mb-4 flex items-center gap-2">🌱 Seed Source</h3>
              {crop.seedProduct ? (
                <div className="flex items-start gap-5">
                  <img src={crop.seedProduct.image || "https://via.placeholder.com/80"} alt="Seed" className="w-24 h-24 rounded-2xl object-cover shadow-sm border border-gray-200" />
                  <div>
                    <p className="font-bold text-gray-900 text-lg">{crop.seedProduct.productName}</p>
                    <div className="mt-3 text-sm bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-wide mb-1">Bought from Retailer</p>
                      <p className="font-extrabold text-[#132a13]">{crop.seedProduct.retailer?.business_name || crop.seedProduct.retailer?.retailer_name || "Unknown Retailer"}</p>
                      {crop.seedProduct.retailer?.verified_licenses?.seed && (
                        <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-bold shadow-sm">✓ Verified Seed License</span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic font-medium">No seed data recorded for this crop.</p>
              )}
            </div>

            {/* Fertilizer Info */}
            <div className="border-2 border-dashed border-green-200 p-6 rounded-3xl bg-gray-50 hover:bg-white transition duration-300">
              <h3 className="text-xl font-extrabold text-[#31572c] mb-4 flex items-center gap-2">🧪 Fertilizer Source</h3>
              {crop.fertilizerProduct ? (
                <div className="flex items-start gap-5">
                  <img src={crop.fertilizerProduct.image || "https://via.placeholder.com/80"} alt="Fertilizer" className="w-24 h-24 rounded-2xl object-cover shadow-sm border border-gray-200" />
                  <div>
                    <p className="font-bold text-gray-900 text-lg">{crop.fertilizerProduct.productName}</p>
                    <div className="mt-3 text-sm bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-wide mb-1">Bought from Retailer</p>
                      <p className="font-extrabold text-[#132a13]">{crop.fertilizerProduct.retailer?.business_name || crop.fertilizerProduct.retailer?.retailer_name || "Unknown Retailer"}</p>
                      {crop.fertilizerProduct.retailer?.verified_licenses?.fertilizer && (
                        <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-bold shadow-sm">✓ Verified Fertilizer License</span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic font-medium">No strict fertilizer data recorded.</p>
              )}
            </div>

          </div>
        </div>

        {/* 3. Proof of Authenticity (QR) */}
        {/* {crop.qrCode && (
          <div className="bg-gradient-to-br from-[#132a13] to-[#31572c] rounded-3xl shadow-2xl p-10 mb-8 text-center text-white relative overflow-hidden">
            <h2 className="text-3xl font-extrabold mb-3 relative z-10">Proof of Authenticity</h2>
            <p className="text-[#ecf39e] mb-8 max-w-lg mx-auto text-lg relative z-10 font-medium">Scan this QR code anytime to verify the origin, history, and details of this crop directly from the database.</p>
            <div className="bg-white p-5 inline-block rounded-3xl mx-auto shadow-[0_0_40px_rgba(255,255,255,0.3)] relative z-10 transform hover:scale-105 transition duration-300">
              <img src={crop.qrCode} alt="Crop QR Code" className="w-56 h-56 object-contain" />
            </div>
          </div>
        )} */}

        {/* 4. Feedback Section */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 mb-8 border border-green-100">
          <h2 className="text-3xl font-bold text-[#132a13] mb-8 flex items-center gap-3">
            ⭐ Farm & Crop Feedback
          </h2>

          {/* Pre-existing feedbacks */}
          {feedbacks.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 text-center text-gray-500 italic text-lg shadow-sm">
              No feedback has been left for this crop yet.
            </div>
          ) : (
            <div className="space-y-6">
              {feedbacks.map((fb) => (
                <div key={fb._id} className="p-6 border border-gray-100 bg-[#f8fad9]/50 rounded-3xl flex flex-col md:flex-row gap-6 shadow-sm hover:shadow-md transition duration-300">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-[#31572c] text-[#ecf39e] rounded-full flex items-center justify-center font-bold text-xl shadow-inner">
                        {fb.buyer?.buyer_name ? fb.buyer.buyer_name.charAt(0).toUpperCase() : "B"}
                      </div>
                      <div>
                        <span className="font-extrabold text-gray-900 block text-lg">{fb.buyer?.buyer_name || "Anonymous"}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-yellow-500 text-sm tracking-widest">{"⭐".repeat(fb.rating)}</span>
                          <span className="text-xs font-semibold text-gray-400">{dayjs(fb.createdAt).format("MMM D, YYYY")}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-800 text-lg leading-relaxed bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">{fb.comment}</p>
                  </div>
                  {fb.photo && (
                    <div className="md:w-1/4 shrink-0">
                      <img src={fb.photo} alt="Feedback" className="w-full h-40 object-cover rounded-2xl shadow-sm border border-gray-200 hover:scale-[1.02] transition duration-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
