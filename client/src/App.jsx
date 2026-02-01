import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

import FarmerSignup from "./pages/farmer/Signup";
import FarmerLogin from "./pages/farmer/Login";
import FarmerDashboard from "./pages/farmer/FarmerDashboard";
import AddCrop from "./pages/farmer/AddCrop";
import FarmerProfile from "./pages/farmer/FarmerProfile";
import About from "./pages/About.jsx";
import StorageReport from "./pages/farmer/StorageReport.jsx";
import BuyerSignup from "./pages/buyer/buyersignup.jsx";
import BuyerLogin from "./pages/buyer/BuyerLogin.jsx";
import BuyerDashboard from "./pages/buyer/BuyerDashboard.jsx";
import BuyerCrops from "./pages/buyer/BuyCrops.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/farmer/login" element={<FarmerLogin />} />
      <Route path="/farmer/signup" element={<FarmerSignup />} />
      <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
      <Route path="/farmer/add-crop" element={<AddCrop />} />
      <Route path="/farmer/profile" element={<FarmerProfile />} />
      <Route path="/farmer/storage-report" element={<StorageReport />} />
      <Route path="/about" element={<About />} />
      <Route path="/buyer/signup" element={<BuyerSignup />} />
      <Route path="/buyer/login" element={<BuyerLogin />} />
      <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
      <Route path="/buyer/crops" element={<BuyerCrops />} />
    </Routes>
  );
}

export default App;
