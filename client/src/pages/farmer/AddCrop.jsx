import { useState, useRef, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";


const API = import.meta.env.VITE_API_BASE_URL;



export default function AddCrop() {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    quantity: "",
    price: "",
    durationNumber: "",
    durationPeriod: "month",
    soilType: "",
    seedProductId: "",
    fertilizerProductId: "",
    seedQuantityUsed: "",
    fertilizerQuantityUsed: "",
    image: null,
  });

  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [purchasedProducts, setPurchasedProducts] = useState({ seed: [], fertilizer: [] });
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // Capture user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location: ", error);
          setLocationError("Location access is required to verify your farm boundary.");
        },
        { enableHighAccuracy: true }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  }, []);

  // Load purchased products for dropdowns
  useEffect(() => {
    const loadPurchasedProducts = async () => {
      try {
        const res = await fetch(`${API}/farmer/purchased-products-by-type`, {
          headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        setPurchasedProducts(data);
      } catch (err) {
        console.error("Error loading purchased products:", err);
      }
    };
    loadPurchasedProducts();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Convert image → base64
  const toBase64 = (fileOrDataUrl) =>
    new Promise((resolve, reject) => {
      if (typeof fileOrDataUrl === "string" && fileOrDataUrl.startsWith("data:")) {
        resolve(fileOrDataUrl);
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(fileOrDataUrl);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const startCamera = async () => {
    try {
      if (streamRef.current) {
        console.log("Camera already running");
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      alert(t("form.networkError"));
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);
    const imageData = canvas.toDataURL("image/jpeg");
    setFormData({ ...formData, image: imageData });
    setCapturedImage(imageData);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      alert(t("form.imageRequired"));
      return;
    }

    if (!location) {
      alert(locationError || "Location access is required to verify your farm boundary. Please enable location services.");
      return;
    }

    setLoading(true);

    try {
      const imageBase64 = await toBase64(formData.image);

      const payload = {
        farmerId: localStorage.getItem("userId"),
        name: formData.name,
        type: formData.type,
        quantity: formData.quantity || 0,
        price: formData.price || 0,
        durationNumber: formData.durationNumber,
        durationPeriod: formData.durationPeriod,
        soilType: formData.soilType,
        seedProductId: formData.seedProductId,
        fertilizerProductId: formData.fertilizerProductId,
        seedQuantityUsed: formData.seedQuantityUsed ? Number(formData.seedQuantityUsed) : undefined,
        fertilizerQuantityUsed: formData.fertilizerQuantityUsed ? Number(formData.fertilizerQuantityUsed) : undefined,
        image: imageBase64,
        latitude: location.latitude,
        longitude: location.longitude,
      };

      const res = await fetch(`${API}/farmer/add-crop`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.status === "success") {
        alert("✅ " + t("form.submit"));
        setQrCode(data.crop.qrCode);
        setFormData({
          name: "",
          type: "",
          quantity: "",
          price: "",
          durationNumber: "",
          durationPeriod: "month",
          soilType: "",
          seedProductId: "",
          fertilizerProductId: "",
          seedQuantityUsed: "",
          fertilizerQuantityUsed: "",
          image: null,
        });
        setCapturedImage(null);
        navigate("/farmer/my-crops")
      } else {
        alert(data.message || t("form.networkError"));
      }
    } catch (err) {
      console.error(err);
      alert(t("form.networkError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fad9] flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 px-6">
        {/* Hero */}
        <section className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#132a13] mb-3">
            {t("addCrop.title")}
          </h2>
          <p className="text-[#31572c]">
            {t("addCrop.desc")}
          </p>
        </section>

        {/* Form */}
        <section className="max-w-3xl mx-auto bg-white p-10 rounded-3xl shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t("form.cropName")}
              className="input"
              required
            />

            {/* Seed Product Dropdown */}
            <div>
              <label className="text-sm text-[#31572c] block mb-2">{t("updateCrop.seed")} <span className="text-red-600">*</span></label>
              <select
                name="seedProductId"
                value={formData.seedProductId}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="">-- {t("updateCrop.select")} --</option>
                {purchasedProducts.seed && purchasedProducts.seed.map((p) => (
                  <option key={p.productId} value={p.productId}>
                    {p.productName} ({p.quantity} units, ₹{p.price})
                  </option>
                ))}
              </select>
            </div>

            {/* Seed Quantity Input */}
            {formData.seedProductId && (
              <input
                type="number"
                name="seedQuantityUsed"
                value={formData.seedQuantityUsed}
                onChange={handleChange}
                placeholder="Seed quantity to use"
                className="input"
                min="1"
                required
              />
            )}

            {/* Fertilizer Product Dropdown */}
            <div>
              <label className="text-sm text-[#31572c] block mb-2">{t("updateCrop.fertilizer")} <span className="text-red-600">*</span></label>
              <select
                name="fertilizerProductId"
                value={formData.fertilizerProductId}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="">-- {t("updateCrop.select")} --</option>
                {purchasedProducts.fertilizer && purchasedProducts.fertilizer.map((p) => (
                  <option key={p.productId} value={p.productId}>
                    {p.productName} ({p.quantity} units, ₹{p.price})
                  </option>
                ))}
              </select>
            </div>

            {/* Fertilizer Quantity Input */}
            {formData.fertilizerProductId && (
              <input
                type="number"
                name="fertilizerQuantityUsed"
                value={formData.fertilizerQuantityUsed}
                onChange={handleChange}
                placeholder="Fertilizer quantity to use"
                className="input"
                min="1"
                required
              />
            )}

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="">{t("form.selectType")}</option>
              <option value="cereal">{t("form.cereal")}</option>
              <option value="vegetable">{t("form.vegetable")}</option>
              <option value="fruit">{t("form.fruit")}</option>
              <option value="pulses">{t("form.pulses")}</option>
            </select>

            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder={t("form.quantity")}
              className="input"
            />

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder={t("form.price")}
              className="input"
            />

            {/* Duration Field */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-sm text-[#31572c] block mb-2">{t("updateCrop.durationNumber")}</label>
                <select
                  name="durationNumber"
                  value={formData.durationNumber}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  <option value="">{t("updateCrop.select")}</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="text-sm text-[#31572c] block mb-2">{t("updateCrop.durationPeriod")}</label>
                <select
                  name="durationPeriod"
                  value={formData.durationPeriod}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  <option value="week">{t("updateCrop.week")}</option>
                  <option value="month">{t("updateCrop.month")}</option>
                  <option value="year">{t("updateCrop.year")}</option>
                </select>
              </div>
            </div>

            <select
              name="soilType"
              value={formData.soilType}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="">{t("updateCrop.selectSoil")}</option>
              <option value="clayey">{t("updateCrop.clayey")}</option>
              <option value="sandy">{t("updateCrop.sandy")}</option>
              <option value="loamy">{t("updateCrop.loamy")}</option>
              <option value="silty">{t("updateCrop.silty")}</option>
              <option value="peaty">{t("updateCrop.peaty")}</option>
            </select>

            <div>
              <label className="text-sm text-[#31572c]">{t("updateCrop.captureImage")}</label>
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-44 rounded-xl mb-3 bg-black" />

              <div className="flex gap-3 mb-3">
                <button type="button" onClick={startCamera} className="bg-[#31572c] text-white px-4 py-2 rounded-xl">{t("cropDisplay.openCamera")}</button>
                <button type="button" onClick={capturePhoto} className="bg-[#132a13] text-[#ecf39e] px-4 py-2 rounded-xl">{t("cropDisplay.capture")}</button>
              </div>

              <canvas ref={canvasRef} className="hidden" />

              {capturedImage && (
                <img src={capturedImage} alt="captured" className="w-40 h-40 object-cover rounded-md block mt-2" />
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#132a13] text-[#ecf39e]
                         py-4 rounded-xl font-semibold
                         hover:bg-[#31572c] transition"
            >
              {loading ? "Adding..." : t("form.submit")}
            </button>
          </form>

          {/* QR Code */}
          {qrCode && (
            <div className="mt-10 text-center">
              <img
                src={qrCode}
                alt="QR Code"
                className="mx-auto w-44 border-2 border-green-600 p-3 rounded-xl shadow-lg"
              />
              <a
                href={qrCode}
                download="crop_qr.png"
                className="block mt-4 text-[#132a13] font-semibold"
              >
                {t("cropDisplay.downloadQR")}
              </a>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}