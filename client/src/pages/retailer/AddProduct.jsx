import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const API = import.meta.env.VITE_API_BASE_URL;

export default function AddProduct() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    productType: "seed",
    productName: "",
    quantity: "",
    price: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      if (!file) return resolve(null);
      if (typeof file === "string" && file.startsWith("data:")) {
        resolve(file);
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const imageBase64 = await toBase64(formData.image);
      const payload = {
        productType: formData.productType,
        productName: formData.productName,
        quantity: Number(formData.quantity) || 0,
        price: Number(formData.price) || 0,
        image: imageBase64,
      };
      const res = await fetch(`${API}/retailer/product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        alert(t("addProduct.success") + (data.product.productId || ""));
        setFormData({ productType: "seed", productName: "", quantity: "", price: "", image: null });
        navigate("/retailer/products");
      } else {
        alert(data.message || t("addProduct.failed"));
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
        <section className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#132a13]">
            {t("addProduct.title")}
          </h2>
        </section>
        <section className="max-w-xl mx-auto bg-white p-8 rounded-3xl shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <label className="block">
              <span className="text-[#132a13]">{t("addProduct.type")}</span>
              <select
                name="productType"
                value={formData.productType}
                onChange={handleChange}
                className="input w-full"
                required
              >
                <option value="seed">{t("buyProduct.seed")}</option>
                <option value="fertilizer">{t("buyProduct.fertilizer")}</option>
              </select>
            </label>
            <input
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              placeholder={t("form.cropName")}
              className="input w/full"
              required
            />
            <input
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              placeholder={t("addProduct.quantity")}
              className="input w-full"
              required
            />
            <input
              name="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              placeholder={t("form.price")}
              className="input w-full"
              required
            />
            <input
              name="image"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="w-full"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-[#132a13] text-[#ecf39e] py-2 px-4 rounded-lg"
            >
              {loading ? t("cropDisplay.loading") : t("addProduct.title")}
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
}