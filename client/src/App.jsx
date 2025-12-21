import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

import FarmerSignup from "./pages/farmer/Signup";
import FarmerLogin from "./pages/farmer/Login";
import FarmerDashboard from "./pages/farmer/FarmerDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/farmer/login" element={<FarmerLogin />} />
      <Route path="/farmer/signup" element={<FarmerSignup />} />
      <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
    </Routes>
  );
}

export default App;
