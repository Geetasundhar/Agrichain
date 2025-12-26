import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useTranslation } from "react-i18next";

const API = import.meta.env.VITE_API_BASE_URL;

export default function AddCrop() {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    quantity: "",
    price: "",
    location: "",
    image: null,
  });

  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);

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
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      alert(t("form.imageRequired"));
      return;
    }

    setLoading(true);

    try {
      const imageBase64 = await toBase64(formData.image);

      const payload = {
        farmerId: localStorage.getItem("userId"),
        name: formData.name,
        type: formData.type,
        quantity: formData.quantity,
        price: formData.price,
        location: formData.location,
        image: imageBase64,
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
        alert("✅ Crop added successfully");
        setQrCode(data.crop.qrCode);
        setFormData({
          name: "",
          type: "",
          quantity: "",
          price: "",
          location: "",
          image: null,
        });
      } else {
        alert(data.error || "Something went wrong");
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

            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder={t("form.location")}
              className="input"
              required
            />

            <input
              type="file"
              name="image"
              onChange={handleChange}
              accept="image/*"
              className="input"
              required
            />

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
                ⬇️ Download QR
              </a>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
