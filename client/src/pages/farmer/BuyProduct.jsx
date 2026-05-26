import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useTranslation } from "react-i18next";

const API = import.meta.env.VITE_API_BASE_URL;

export default function BuyProduct() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [type, setType] = useState("seed");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API}/retailer/all-products`);
        const data = await res.json();
        if (res.ok && data.products) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleQuantityChange = (productId, delta) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p._id !== productId) return p;
        const avail = p.quantity || 0;
        const nextQty = Math.max(1, Math.min(avail, (p._selectedQty || 1) + delta));
        return { ...p, _selectedQty: nextQty, _computedTotal: nextQty * (p.price || 0) };
      })
    );
  };

  const handleSetQty = (productId, value) => {
    const intVal = Number(value) || 0;
    setProducts((prev) =>
      prev.map((p) => {
        if (p._id !== productId) return p;
        const avail = p.quantity || 0;
        const nextQty = Math.max(1, Math.min(avail, intVal));
        return { ...p, _selectedQty: nextQty, _computedTotal: nextQty * (p.price || 0) };
      })
    );
  };

  const handleBuy = async (product) => {
    const qty = product._selectedQty || 1;
    if (qty <= 0) return;
    try {
      const res = await fetch(`${API}/farmer/buy-product`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ productId: product.productId, quantity: qty }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || t("buyProduct.purchaseFailed"));

      // prefer the server-saved purchase.productId when available
      const purchase = data.purchase || null;
      const purchasedProductId = purchase?.productId || product.productId || "-";

      // generate simple receipt in new window and trigger print
      const receiptWindow = window.open("", "_blank");
      const receiptHtml = `
        <html>
        <head><title>Receipt</title></head>
        <body>
          <h2>Agrichain - Purchase Receipt</h2>
          <p><strong>Order ID:</strong> ${purchase?._id || "-"}</p>
          <p><strong>Product ID:</strong> ${purchasedProductId}</p>
          <p><strong>Buyer:</strong> ${localStorage.getItem("user_name") || "Farmer"}</p>
          <p><strong>Retailer:</strong> ${product.retailer?.name || "-"}</p>
          <p><strong>Organization:</strong> ${product.retailer?.organization?.organizationName || "-"}</p>
          <p><strong>Product:</strong> ${product.productName} (${product.productType})</p>
          <p><strong>Unit Price:</strong> ${product.price || 0}</p>
          <p><strong>Quantity:</strong> ${qty}</p>
          <p><strong>Total:</strong> ${qty * (product.price || 0)}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          <hr/>
          <p>Thank you for your purchase.</p>
        </body>
        </html>
      `;
      receiptWindow.document.write(receiptHtml);
      receiptWindow.document.close();
      receiptWindow.focus();
      // give a moment for render then print
      setTimeout(() => {
        try { receiptWindow.print(); } catch (e) { /* ignore */ }
      }, 500);

      // After purchase navigate to My Purchases
      navigate("/farmer/my-purchases");
      // also open retailer orders in a new tab (helps retailer view update)
      try { window.open(window.location.origin + "/retailer/orders", "_blank"); } catch (e) { }
    } catch (err) {
      console.error(err);
      alert(err.message || t("form.networkError"));
    }
  };

  const filtered = products.filter((p) => p.productType === type && (p.quantity || 0) > 0);

  if (loading) return <div>{t("buyCrops.loading")}</div>;

  return (
    <div className="min-h-screen bg-[#f8fad9] flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 px-6">
        <h2 className="text-3xl font-bold mb-6">{t("farmerDashboard.buyInputs")}</h2>

        <div className="mb-6">
          <label className="mr-2 font-semibold">{t("buyProduct.selectType")}:</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="p-2 border rounded">
            <option value="seed">{t("buyProduct.seed")}</option>
            <option value="fertilizer">{t("buyProduct.fertilizer")}</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <p>{t("buyProduct.noProducts")}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((p) => (
              <div key={p._id} className="bg-white p-4 rounded-xl shadow">
                <div className="flex items-center gap-4">
                  {p.retailer?.shop_image ? (
                    <img src={p.image} alt="shop" className="w-20 h-20 object-cover rounded" />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">{t("cropDisplay.noPhoto")}</div>
                  )}
                  <div>
                    <h3 className="font-semibold">{p.productName}</h3>
                    <p className="text-sm">{t("buyProduct.retailer")}: {p.retailer?.name || "-"}</p>
                    <p className="text-sm">{t("buyProduct.organization")}: {p.retailer?.organization?.organizationName || "-"}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p>{t("buyProduct.unitPrice")}: <strong>{p.price || 0}</strong></p>
                    <p>{t("buyProduct.available")}: {p.quantity || 0}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleQuantityChange(p._id, -1)} className="px-3 py-1 bg-gray-200 rounded">-</button>
                    <input type="number" min="1" max={p.quantity || 0} value={p._selectedQty || 1} onChange={(e) => handleSetQty(p._id, e.target.value)} className="w-16 text-center border rounded p-1" />
                    <button onClick={() => handleQuantityChange(p._id, 1)} className="px-3 py-1 bg-gray-200 rounded">+</button>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div>{t("buyProduct.total")}: <strong>{(p._selectedQty || 1) * (p.price || 0)}</strong></div>
                  <button onClick={() => handleBuy(p)} className="px-4 py-2 bg-green-600 text-white rounded">{t("buyCrops.buyNow")}</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}