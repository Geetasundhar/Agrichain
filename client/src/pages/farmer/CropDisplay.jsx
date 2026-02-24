import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

const API = import.meta.env.VITE_API_BASE_URL;

export default function CropDisplay() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  const [weeklyImages, setWeeklyImages] = useState([]);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [periodIndex, setPeriodIndex] = useState(0); // 0-based
  const [canCapture, setCanCapture] = useState(false);
  const [nextCaptureTime, setNextCaptureTime] = useState(null);

  const fetchCrop = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = token && token !== "null" && token !== "undefined" ? { Authorization: `Bearer ${token}` } : {};

      const res = await fetch(`${API}/farmer/crops/${id}`, { headers });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to load crop");
        setLoading(false);
        return;
      }

      setCrop(data.crop);
      setQuantity(data.crop.quantityKg || "");
      setPrice(data.crop.pricePerKg || "");

      // build fixed-length (4) array from progressPhotos by periodIndex
      const progress = Array(4).fill(null);
      if (Array.isArray(data.crop.progressPhotos)) {
        data.crop.progressPhotos.forEach(p => {
          if (typeof p.periodIndex === 'number' && p.imageData) {
            progress[p.periodIndex] = p.imageData;
          }
        });
      }
      setWeeklyImages(progress);
    } catch (err) {
      console.error(err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrop();
  }, [id]);

  const startCamera = async () => {
    if (streamRef.current) return;

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });

    streamRef.current = stream;
    videoRef.current.srcObject = stream;
  };

  /* 📸 Capture image (DOES NOT STOP CAMERA) */
  const capturePhoto = async () => {
    if (!canCapture) {
      if (nextCaptureTime) {
        alert(`You can capture the next photo after ${dayjs(nextCaptureTime).format("MMM D, YYYY HH:mm")}`);
      } else {
        alert("You cannot capture a photo at this time.");
      }
      return;
    }
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL("image/jpeg");

    try {
      const token = localStorage.getItem("token");

      if (!token || token === "null" || token === "undefined") {
        alert("You must be logged in to upload images. Redirecting to login...");
        navigate("/farmer/login");
        return;
      }

      const res = await fetch(`${API}/farmer/update-crop/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          newImage: imageData, // 👈 send captured photo
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to upload image");
        return;
      }

      // 🔁 Update UI instantly with fresh DB data
      setCrop(data.crop);
      const progress = Array(4).fill(null);
      if (Array.isArray(data.crop.progressPhotos)) {
        data.crop.progressPhotos.forEach(p => {
          if (typeof p.periodIndex === 'number' && p.imageData) {
            progress[p.periodIndex] = p.imageData;
          }
        });
      }
      setWeeklyImages(progress);

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  /* ✏️ Update crop quantity and price */
  const handleUpdateCrop = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token || token === "null" || token === "undefined") {
        alert("You must be logged in to update. Redirecting to login...");
        navigate("/farmer/login");
        return;
      }

      const res = await fetch(`${API}/farmer/update-crop/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          quantity: quantity ? Number(quantity) : undefined,
          price: price ? Number(price) : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to update crop");
        return;
      }

      setCrop(data.crop);
      alert("Crop updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  /* 🗑 Delete crop */
  const handleDeleteCrop = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this crop? This action cannot be undone."
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token || token === "null" || token === "undefined") {
        alert("You must be logged in to delete. Redirecting to login...");
        navigate("/farmer/login");
        return;
      }

      const res = await fetch(`${API}/farmer/delete-crop/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to delete crop");
        return;
      }

      alert("Crop deleted successfully");
      navigate("/farmer/my-crops");
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  // Helper: get crop start date (createdAt)
  function getCropStartDate() {
    return crop?.createdAt ? dayjs(crop.createdAt) : null;
  }

  // Helper: get total duration in days
  function getTotalDurationDays() {
    if (!crop) return 0;
    const n = Number(crop.durationNumber);
    const p = crop.durationPeriod;
    if (p === "week") return n * 7;
    if (p === "month") return n * 30;
    if (p === "year") return n * 365;
    return 0;
  }

  // Helper: get period start/end dates
  function getPeriodRanges() {
    const start = getCropStartDate();
    const totalDays = getTotalDurationDays();
    if (!start || !totalDays) return [];
    const periodLength = Math.floor(totalDays / 4);
    return Array.from({ length: 4 }, (_, i) => {
      const periodStart = start.add(i * periodLength, "day");
      const periodEnd = i === 3 ? start.add(totalDays, "day") : start.add((i + 1) * periodLength, "day");
      return { start: periodStart, end: periodEnd };
    });
  }

  // Helper: get current period index (0-3)
  function getCurrentPeriodIndex() {
    const now = dayjs();
    const ranges = getPeriodRanges();
    for (let i = 0; i < ranges.length; i++) {
      if (now.isAfter(ranges[i].start) && now.isBefore(ranges[i].end)) {
        return i;
      }
    }
    // If after all periods, return 3
    if (ranges.length && now.isAfter(ranges[3].end)) return 3;
    return 0;
  }

  // Check if photo for current period is already taken
  function isPhotoTakenForPeriod(idx) {
    return weeklyImages[idx] != null;
  }

  // On crop or images load, update period/capture state
  useEffect(() => {
    if (!crop) return;
    const idx = getCurrentPeriodIndex();
    setPeriodIndex(idx);
    const taken = isPhotoTakenForPeriod(idx);
    setCanCapture(!taken);
    // Set next capture time if already taken
    const ranges = getPeriodRanges();
    if (taken && ranges[idx + 1]) {
      setNextCaptureTime(ranges[idx + 1].start);
    } else if (!taken) {
      // can capture now
      setNextCaptureTime(null);
    } else {
      setNextCaptureTime(null);
    }
  }, [crop, weeklyImages]);

  // notification removed: user requested no popup

  if (loading) return <p className="pt-32 text-center">Loading...</p>;
  if (error) return <p className="pt-32 text-center text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-[#f8fad9] flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 px-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-[#132a13]">
            {crop.cropName}
          </h2>
          <button
            onClick={() => navigate("/farmer/my-crops")}
            className="text-[#31572c] underline"
          >
            ← Back
          </button>
        </div>

        {/* Main Image + QR */}
        <div className="bg-white rounded-3xl shadow p-6 mb-10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-full md:flex-1">
              <img
                src={crop.images?.[0]}
                alt={crop.cropName}
                className="w-full h-80 object-cover rounded-2xl"
              />
            </div>

            <div className="w-full md:w-56 flex-shrink-0 flex flex-col items-center">
              {crop.qrCode ? (
                <>
                  <img
                    src={crop.qrCode}
                    alt="QR Code"
                    className="w-44 h-44 object-contain border-2 border-green-600 p-3 rounded-xl shadow-lg bg-white"
                  />
                  <a
                    href={crop.qrCode}
                    download={`crop_${crop._id}_qr.png`}
                    className="mt-3 text-[#132a13] font-semibold"
                  >
                    ⬇️ Download QR
                  </a>
                </>
              ) : (
                <div className="w-44 h-44 rounded-xl bg-gray-100 flex items-center justify-center text-sm text-gray-500">
                  No QR available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================= ACTION CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* ✏️ Update Card */}
          <div className="group bg-white rounded-3xl shadow-md
                          hover:shadow-2xl hover:-translate-y-2
                          transition-all duration-300 p-6
                          flex flex-col items-center justify-center text-center">
            <h3 className="text-xl font-bold mb-4 text-[#132a13]">
              ✏️ Update Crop
            </h3>

            {/* <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Quantity (kg)"
              className="w-full mb-3 p-3 border rounded-xl"
            />

            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price per kg"
              className="w-full mb-4 p-3 border rounded-xl"
            /> */}

            <button
              onClick={() => navigate(`/farmer/update-crop/${crop._id}`)}
              className="w-full bg-[#132a13] text-[#ecf39e]
                         py-3 rounded-xl font-medium
                         group-hover:bg-[#31572c] transition">
              Update Crop
            </button>
          </div>

          {/* 📸 Camera Card (FIXED) */}
          <div className="group bg-white rounded-3xl shadow-md
                          hover:shadow-2xl hover:-translate-y-2
                          transition-all duration-300 p-6 text-center">
            <h3 className="text-xl font-bold mb-4 text-[#132a13]">
              📸 Upload Progress
            </h3>

            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-44 rounded-xl mb-4 bg-black"
            />

            <div className="flex justify-center gap-4">
              <button
                onClick={startCamera}
                className="bg-[#31572c] text-white px-4 py-2 rounded-xl"
              >
                Open Camera
              </button>
              <button
                onClick={capturePhoto}
                className="bg-[#132a13] text-[#ecf39e] px-4 py-2 rounded-xl"
                disabled={!canCapture}
              >
                Capture
              </button>
            </div>

            {(!canCapture && nextCaptureTime) && (
              <p className="text-red-600 mt-2 text-center">
                You have already captured for this period.<br />
                Next capture available: {dayjs(nextCaptureTime).format("MMM D, YYYY HH:mm")}
              </p>
            )}
            {/* notification removed */}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* 🗑 Delete Card (same colors as update) */}
          <div className="group bg-white rounded-3xl shadow-md
                          hover:shadow-2xl hover:-translate-y-2
                          transition-all duration-300 p-6
                          flex flex-col items-center justify-center text-center">
            <h3 className="text-xl font-bold mb-4 text-[#132a13]">
              🗑 Delete Crop
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              This action cannot be undone.
            </p>

            <button
              onClick={handleDeleteCrop}
              className="w-full bg-[#132a13] text-[#ecf39e]
                         py-3 rounded-xl font-medium
                         group-hover:bg-[#31572c] transition">
              Delete Permanently
            </button>
          </div>
        </div>

        {/* ================= CAPTURED IMAGES GRID ================= */}
        {weeklyImages.length > 0 && (
          <div className="mt-14">
            <h3 className="text-2xl font-bold text-[#132a13] mb-6">
              Growth Timeline 🌱
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Array.from({ length: 4 }, (_, i) => {
                const img = weeklyImages[i];
                return (
                  <div
                    key={i}
                    className="group bg-white rounded-2xl shadow-md
                               hover:shadow-xl hover:-translate-y-1
                               transition-all duration-300 p-2 flex flex-col items-center"
                  >
                    {img ? (
                      <img
                        src={img}
                        className="h-40 w-full object-cover rounded-xl
                                   group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="h-40 w-full rounded-xl bg-gray-100 flex items-center justify-center text-gray-500">
                        No photo yet
                      </div>
                    )}
                    <p className="text-center mt-2 text-sm text-[#31572c]">
                      Progress {i + 1} / 4
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
