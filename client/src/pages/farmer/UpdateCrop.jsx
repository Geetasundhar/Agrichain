import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useTranslation } from "react-i18next";

const API = import.meta.env.VITE_API_BASE_URL;

export default function UpdateCrop() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    quantity: "",
    price: "",
    durationNumber: "",
    durationPeriod: "month",
    fertilizer: "",
    soilType: "",
    image: null, // local file or dataURL
    existingImage: null, // url/base64 from server
  });

  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    fetchCrop();
  }, [id]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const fetchCrop = async () => {
    try {
      const res = await fetch(`${API}/farmer/crops/${id}`);
      const data = await res.json();
      if (data.status === "success" && data.crop) {
        const c = data.crop;
        setFormData({
          name: c.cropName || "",
          type: c.cropType || "",
          quantity: c.quantityKg || "",
          price: c.pricePerKg || "",
          durationNumber: c.durationNumber || "",
          durationPeriod: c.durationPeriod || "month",
          fertilizer: c.fertilizer || "",
          soilType: c.soilType || "",
          image: null,
          existingImage: c.images?.[0] || c.qrCode || null,
        });
      } else {
        alert(data.message || "Failed to load crop");
      }
    } catch (err) {
      console.error(err);
      alert(t("form.networkError"));
    }
  };

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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const startCamera = async () => {
    if (streamRef.current) return;
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    streamRef.current = stream;
    videoRef.current.srcObject = stream;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let newImageBase64 = null;
      if (formData.image) {
        newImageBase64 = await toBase64(formData.image);
      }

      const payload = {
        name: formData.name,
        type: formData.type,
        quantity: formData.quantity,
        price: formData.price,
        durationNumber: formData.durationNumber,
        durationPeriod: formData.durationPeriod,
        fertilizer: formData.fertilizer,
        soilType: formData.soilType,
      };

      if (newImageBase64) payload.newImage = newImageBase64;

      const res = await fetch(`${API}/farmer/update-crop/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.status === "success") {
        alert(data.message || "Crop updated");
        navigate("/farmer/my-crops");
      } else {
        alert(data.message || data.error || "Update failed");
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
        <section className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#132a13] mb-3">{"Update Crop"}</h2>
          {/* <p className="text-[#31572c]">{t("updateCrop.desc") || "Edit details and update your crop"}</p> */}
        </section>

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
              required
            />

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder={t("form.price")}
              className="input"
              required
            />

            {/* Duration Field */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-sm text-[#31572c] block mb-2">Duration Number</label>
                <select
                  name="durationNumber"
                  value={formData.durationNumber}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  <option value="">Select</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="text-sm text-[#31572c] block mb-2">Duration Period</label>
                <select
                  name="durationPeriod"
                  value={formData.durationPeriod}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  <option value="week">Week</option>
                  <option value="month">Month</option>
                  <option value="year">Year</option>
                </select>
              </div>
            </div>

            <input
              type="text"
              name="fertilizer"
              value={formData.fertilizer}
              onChange={handleChange}
              placeholder="Fertilizer (e.g., Urea, NPK)"
              className="input"
              required
            />

            <select
              name="soilType"
              value={formData.soilType}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="">Select Soil Type</option>
              <option value="clayey">Clayey</option>
              <option value="sandy">Sandy</option>
              <option value="loamy">Loamy</option>
              <option value="silty">Silty</option>
              <option value="peaty">Peaty</option>
            </select>

            <div>
              <label className="text-sm text-[#31572c]">Existing Image</label>
              {formData.existingImage ? (
                <img src={formData.existingImage} alt="existing" className="w-40 h-40 object-cover rounded-md block mt-2" />
              ) : (
                <p className="text-sm text-[#888]">No image available</p>
              )}
            </div>

            <div>
              <label className="text-sm text-[#31572c]">Capture Image</label>
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-44 rounded-xl mb-3 bg-black" />

              <div className="flex gap-3 mb-3">
                <button type="button" onClick={startCamera} className="bg-[#31572c] text-white px-4 py-2 rounded-xl">Open Camera</button>
                <button type="button" onClick={capturePhoto} className="bg-[#132a13] text-[#ecf39e] px-4 py-2 rounded-xl">Capture</button>
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
              {loading ? "Updating..." : "Update Crop"}
            </button>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}
