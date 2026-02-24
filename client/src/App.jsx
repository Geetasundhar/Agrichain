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
import GeoFencing from "./pages/farmer/GeoFencing.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/farmer/login" element={<FarmerLogin />} />
      <Route path="/farmer/signup" element={<FarmerSignup />} />
      <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
      <Route path="/farmer/add-crop" element={<AddCrop />} />
      <Route path="/farmer/my-crops" element={<MyCrops />} />
      <Route path="/farmer/crops/:id" element={<CropDisplay />} />
      <Route path="/farmer/update-crop/:id" element={<UpdateCrop />} />
      <Route path="/farmer/profile" element={<FarmerProfile />} />
      <Route path="/farmer/storage-report" element={<StorageReport />} />
      <Route path="/about" element={<About />} />
      <Route path="/buyer/signup" element={<BuyerSignup />} />
      <Route path="/buyer/login" element={<BuyerLogin />} />
      <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
      <Route path="/buyer/crops" element={<BuyerCrops />} />
      <Route path="/farmer/geofencing" element={<GeoFencing />} />
    </Routes>
  );
}

export default App;