import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import FarmerSignup from "./pages/farmer/Signup";
import FarmerLogin from "./pages/farmer/Login";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/farmer/login" element={<FarmerLogin />} />
      <Route path="/farmer/signup" element={<FarmerSignup />} />
    </Routes>
  );
}

export default App;
