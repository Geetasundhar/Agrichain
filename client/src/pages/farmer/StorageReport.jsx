import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { jsPDF } from "jspdf";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const StorageReport = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const [chartType, setChartType] = useState("bar");
  const [allData, setAllData] = useState([]);
  const [currentData, setCurrentData] = useState([]);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  /* ---------- i18n (INIT ONCE) ---------- */
  useEffect(() => {
    if (!i18next.isInitialized) {
      i18next.use(LanguageDetector).init({
        fallbackLng: "en",
        resources: {
          en: {
            translation: {
              title: "🏬 Storage Report",
              desc: "Monitor crop storage, available stock, and warehouse conditions.",
              footer: "© 2025 AgriChain. Empowering farmers with technology.",
              selectDate: "Select Date"
            }
          },
          ta: {
            translation: {
              title: "🏬 சேமிப்பு அறிக்கை",
              desc: "பயிர் சேமிப்பு மற்றும் களஞ்சிய நிலைகளை கண்காணிக்கவும்.",
              footer: "© 2025 அக்ரிச்செயின்.",
              selectDate: "தேதியைத் தேர்ந்தெடுக்கவும்"
            }
          }
        }
      });
    }
  }, []);

  /* ---------- FETCH STORAGE DATA ---------- */
  useEffect(() => {
    fetchStorageData();
  }, []);

  const fetchStorageData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/farmer/storage-report", {
        headers: { Authorization: "Bearer " + token }
      });

      const json = await res.json();
      if (json.status !== "success" || !json.data?.length) return;

      // 🔥 Normalize date safely
      const normalized = json.data.map(item => ({
        ...item,
        date: item.date
          ? item.date
          : new Date(item.createdAt || Date.now()).toISOString().split("T")[0]
      }));

      setAllData(normalized);

      const uniqueDates = [...new Set(normalized.map(i => i.date))];
      setDates(uniqueDates);
      setSelectedDate(uniqueDates[0]);

      setCurrentData(normalized.filter(i => i.date === uniqueDates[0]));
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------- CHART ---------- */
  useEffect(() => {
    if (!chartRef.current || currentData.length === 0) return;

    const labels = currentData.map(i => i.crop);
    const quantities = currentData.map(i => i.quantity);

    if (chartInstance.current) chartInstance.current.destroy();

    chartInstance.current = new Chart(chartRef.current, {
      type: chartType,
      data: {
        labels,
        datasets: [
          {
            label: "Stored Quantity (kg)",
            data: quantities,
            backgroundColor: "rgba(79,119,45,0.6)",
            borderColor: "#31572c",
            borderWidth: 2,
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `Storage Report (${selectedDate})`
          }
        }
      }
    });
  }, [chartType, currentData, selectedDate]);

  /* ---------- HANDLERS ---------- */
  const handleDateChange = e => {
    const date = e.target.value;
    setSelectedDate(date);
    setCurrentData(allData.filter(i => i.date === date));
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`AgriChain Storage Report - ${selectedDate}`, 14, 20);

    let y = 35;
    currentData.forEach((i, idx) => {
      doc.text(`${idx + 1}. ${i.crop} - ${i.quantity} kg`, 14, y);
      y += 8;
    });

    doc.save(`Storage_Report_${selectedDate}.pdf`);
  };

  return (
    <>
      <Navbar />

      {/* ===== STYLES ===== */}
      <style>{`
        .sr-header {
          background: linear-gradient(135deg,#132a13,#31572c);
          color: #ecf39e;
          padding: 1.2rem;
          text-align: center;
        }
        .sr-container {
          padding: 2rem 1rem;
          background: #f2f6f4;
          min-height: 100vh;
          text-align: center;
        }
        .sr-select {
          margin-top: 15px;
        }
        select {
          padding: 8px 14px;
          border-radius: 8px;
          border: 1px solid #31572c;
        }
        .chart-box {
          max-width: 900px;
          height: 420px;
          margin: 30px auto;
          background: white;
          padding: 20px;
          border-radius: 20px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.12);
        }
        canvas {
          width: 100% !important;
          height: 100% !important;
        }
        .btn {
          background: #31572c;
          color: #ecf39e;
          border: none;
          margin: 6px;
          padding: 8px 18px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
        }
        .btn:hover { background: #132a13; }
        @media(max-width:600px){
          .chart-box{height:300px;padding:12px;}
          .btn{font-size:0.85rem;padding:6px 12px;}
        }
      `}</style>

      {/* ===== HEADER ===== */}
      <div className="sr-header">
        <h2>{i18next.t("title")}</h2>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="sr-container">
        <p>{i18next.t("desc")}</p>

        {dates.length > 0 && (
          <div className="sr-select">
            <b>{i18next.t("selectDate")}:</b>{" "}
            <select value={selectedDate} onChange={handleDateChange}>
              {dates.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        )}

        <div className="chart-box">
          <canvas ref={chartRef}></canvas>
        </div>

        <div>
          <button className="btn" onClick={() => setChartType("bar")}>Bar</button>
          <button className="btn" onClick={() => setChartType("pie")}>Pie</button>
          <button className="btn" onClick={() => setChartType("line")}>Line</button>
          <button className="btn" onClick={downloadPDF}>Download PDF</button>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default StorageReport;
