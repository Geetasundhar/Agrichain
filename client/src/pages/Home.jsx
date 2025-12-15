import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Use env variable
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export default function Home() {
  const navigate = useNavigate();

  // Example: Navigate to a route defined by env variable
  const handleGetStarted = () => {
    // If you want to navigate to a path on your frontend
    navigate("/signup"); 

    // Or if you want to call an API from env variable
    // fetch(`${apiBaseUrl}/api/some-endpoint`)
    //   .then(res => res.json())
    //   .then(data => console.log(data));
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fad9]">
      <Navbar />

      {/* -------- Hero Section -------- */}
      <main className="pt-18 flex-grow">
        <section className="bg-gradient-to-br from-[#132a13] to-[#31572c] text-[#ecf39e] py-28">
          <div className="max-w-[1250px] mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              Welcome to <span className="text-[#90a955]">AgriChain</span>
            </h1>

            <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-[#e9eedd]">
              A blockchain-powered agriculture ecosystem enabling direct farmer-to-buyer
              trade, transparent pricing, and secure crop insurance settlements.
            </p>

            <button
              onClick={handleGetStarted}
              className="bg-[#ecf39e] text-[#132a13] font-semibold
                         px-10 py-4 rounded-xl shadow-lg
                         hover:bg-[#dbeccd] hover:scale-105
                         transition-all duration-300"
            >
              Get Started
            </button>
          </div>
        </section>

        {/* -------- About Section -------- */}
        <section className="py-20 bg-[#fbfdec]">
          <div className="max-w-[1100px] mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#132a13]">
              Why AgriChain?
            </h2>

            <p className="text-lg text-[#31572c] leading-relaxed max-w-3xl mx-auto">
              AgriChain removes middlemen, ensures fair crop pricing, reduces fraud,
              and speeds up insurance claims using blockchain smart contracts.
              Farmers gain transparency, trust, and direct access to digital markets.
            </p>
          </div>
        </section>

        {/* -------- Features Section -------- */}
        <section className="py-20 bg-[#f8fad9]">
          <div className="max-w-[1250px] mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#132a13] mb-14">
              Platform Features
            </h2>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  title: "Direct Trading",
                  desc: "Farmers sell crops directly to buyers without middlemen exploitation.",
                },
                {
                  title: "Transparent Pricing",
                  desc: "All transactions are recorded on blockchain ensuring complete fairness.",
                },
                {
                  title: "Smart Insurance",
                  desc: "Instant, fraud-free crop insurance payouts using smart contracts.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-2xl shadow-md
                             hover:shadow-xl hover:-translate-y-1
                             transition-all duration-300"
                >
                  <h3 className="text-xl font-bold mb-4 text-[#4f772d]">
                    {item.title}
                  </h3>
                  <p className="text-[#31572c]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
