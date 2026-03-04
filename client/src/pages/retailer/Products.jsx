import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE_URL;

export default function Products() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API}/retailer/products`, {
          headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        if (res.ok && data.products) {
          // remove any products that accidentally have zero quantity
          setProducts(data.products.filter(p => p.quantity > 0));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div>{t("buyCrops.loading")}</div>;

  return (
    <div className="min-h-screen bg-[#f8fad9] flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 px-6">
        <section className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#132a13]">
            {t("myProducts.title")}
          </h2>
        </section>
        <section className="max-w-4xl mx-auto">
          {products.length === 0 ? (
            <p>{t("myProducts.noProducts")}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((p) => (
                <div key={p._id} className="bg-white p-4 rounded-xl shadow">
                  <h3 className="font-semibold">{p.productName}</h3>
                  <p>{t("myProducts.type")}: {p.productType}</p>
                  <p>{t("myProducts.quantity")}: {p.quantity}</p>
                  <p>{t("myProducts.unitPrice")}: {p.price}</p>
                  <p>{t("myProducts.productId")}: {p.productId}</p>
                  {p.image && <img src={p.image} alt="" className="mt-2 h-20 w-20 object-cover" />}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}