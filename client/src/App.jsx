import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

import FarmerSignup from "./pages/farmer/Signup";
import FarmerLogin from "./pages/farmer/Login";
import FarmerDashboard from "./pages/farmer/FarmerDashboard";
import AddCrop from "./pages/farmer/AddCrop";
import MyCrops from "./pages/farmer/CropManagement.jsx";
import CropDisplay from "./pages/farmer/CropDisplay.jsx";
import FarmerProfile from "./pages/farmer/FarmerProfile";
import UpdateCrop from "./pages/farmer/UpdateCrop";
import About from "./pages/About.jsx";
import StorageReport from "./pages/farmer/StorageReport.jsx";
import BuyerSignup from "./pages/buyer/buyersignup.jsx";
import BuyerLogin from "./pages/buyer/BuyerLogin.jsx";
import BuyerDashboard from "./pages/buyer/BuyerDashboard.jsx";
import BuyerCrops from "./pages/buyer/BuyCrops.jsx";
import BuySpecificCrop from "./pages/buyer/BuySpecificCrop.jsx";
import BuyerCart from "./pages/buyer/BuyerCart.jsx";
import BuyerPurchases from "./pages/buyer/BuyerPurchases.jsx";
import PreOrderCrops from "./pages/buyer/PreOrderCrops.jsx";
import PreOrderSpecificCrop from "./pages/buyer/PreOrderSpecificCrop.jsx";
import MyPreOrders from "./pages/buyer/MyPreOrders.jsx";
import GeoFencing from "./pages/farmer/Geofencing.jsx";
import MyPurchases from "./pages/farmer/MyPurchases.jsx";
import BuyProduct from "./pages/farmer/BuyProduct.jsx";
import RetailerSignup from "./pages/retailer/Signup";
import RetailerLogin from "./pages/retailer/Login";
import RetailerDashboard from "./pages/retailer/Dashboard";
import AddProduct from "./pages/retailer/AddProduct";
import Products from "./pages/retailer/Products";
import Orders from "./pages/retailer/Orders";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/farmer/login" element={<FarmerLogin />} />
      <Route path="/farmer/signup" element={<FarmerSignup />} />
      <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
      <Route path="/farmer/add-crop" element={<AddCrop />} />
      <Route path="/farmer/my-crops" element={<MyCrops />} />
      <Route path="/farmer/buy-product" element={<BuyProduct />} />
      <Route path="/farmer/my-purchases" element={<MyPurchases />} />
      <Route path="/farmer/crops/:id" element={<CropDisplay />} />
      <Route path="/farmer/update-crop/:id" element={<UpdateCrop />} />
      <Route path="/farmer/profile" element={<FarmerProfile />} />
      <Route path="/farmer/storage-report" element={<StorageReport />} />
      <Route path="/about" element={<About />} />
      <Route path="/buyer/signup" element={<BuyerSignup />} />
      <Route path="/buyer/login" element={<BuyerLogin />} />
      <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
      <Route path="/buyer/crops" element={<BuyerCrops />} />
      <Route path="/buyer/crop/:id" element={<BuySpecificCrop />} />
      <Route path="/buyer/cart" element={<BuyerCart />} />
      <Route path="/buyer/purchases" element={<BuyerPurchases />} />
      <Route path="/buyer/preorder-crops" element={<PreOrderCrops />} />
      <Route path="/buyer/preorder-crop/:id" element={<PreOrderSpecificCrop />} />
      <Route path="/buyer/my-preorders" element={<MyPreOrders />} />
      <Route path="/retailer/signup" element={<RetailerSignup />} />
      <Route path="/retailer/login" element={<RetailerLogin />} />
      <Route path="/retailer/dashboard" element={<RetailerDashboard />} />
      <Route path="/retailer/add-product" element={<AddProduct />} />
      <Route path="/retailer/products" element={<Products />} />
      <Route path="/retailer/orders" element={<Orders />} />
      {/* reports page can be added later */}
      <Route path="/farmer/geofencing" element={<GeoFencing />} />
    </Routes>
  );
}

export default App;