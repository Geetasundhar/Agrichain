import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { useTranslation } from "react-i18next";
import { jsPDF } from "jspdf";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const StorageReport = () => {
  const { t } = useTranslation();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const [chartType, setChartType] = useState("bar");
  const [currentData, setCurrentData] = useState([]);

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
      
      // Handle empty data gracefully
      if (json.status === "empty" || !json.data || json.data.length === 0) {
        setCurrentData([]);
        return;
      }

      const normalized = json.data.map(item => ({
        crop: item.crop || "Unknown",
        quantity: item.quantity || 0
      }));

      setCurrentData(normalized);
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------- CHART ---------- */
  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
        chartInstance.current.destroy();
    }

    const labels = currentData.length > 0 ? currentData.map(i => i.crop) : ["No Data"];
    const quantities = currentData.length > 0 ? currentData.map(i => i.quantity) : [0];

    const backgroundColors = [
      "rgba(255, 99, 132, 0.7)", "rgba(54, 162, 235, 0.7)", "rgba(255, 206, 86, 0.7)",
      "rgba(75, 192, 192, 0.7)", "rgba(153, 102, 255, 0.7)", "rgba(255, 159, 64, 0.7)",
      "rgba(199, 199, 199, 0.7)", "rgba(83, 102, 255, 0.7)", "rgba(40, 159, 64, 0.7)",
      "rgba(210, 199, 99, 0.7)"
    ];

    const borderColors = [
      "rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)",
      "rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)", "rgba(255, 159, 64, 1)",
      "rgba(199, 199, 199, 1)", "rgba(83, 102, 255, 1)", "rgba(40, 159, 64, 1)",
      "rgba(210, 199, 99, 1)"
    ];

    const applyBgColors = quantities.map((_, i) => backgroundColors[i % backgroundColors.length]);
    const applyBorderColors = quantities.map((_, i) => borderColors[i % borderColors.length]);

    const bgPlugin = {
      id: 'customCanvasBackgroundColor',
      beforeDraw: (chart, args, options) => {
        const {ctx} = chart;
        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = options.color || '#ffffff';
        ctx.fillRect(0, 0, chart.width, chart.height);
        ctx.restore();
      }
    };

    chartInstance.current = new Chart(chartRef.current, {
      type: chartType,
      data: {
        labels,
        datasets: [
          {
            label: "Stored Quantity (kg)",
            data: quantities,
            backgroundColor: applyBgColors,
            borderColor: applyBorderColors,
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
            text: t("storageReport.chartTitle") || "Storage Report"
          },
          customCanvasBackgroundColor: {
            color: '#ffffff',
          }
        }
      },
      plugins: [bgPlugin]
    });
  }, [chartType, currentData, t]);

  /* ---------- HANDLERS ---------- */
  const downloadPDF = async () => {
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString();
    doc.setFontSize(18);
    doc.text(`AgriChain Storage Report - ${today}`, 14, 20);

    doc.setFontSize(12);
    let y = 35;
    doc.text("Detailed Storage Information:", 14, y);
    y += 10;
    
    if (currentData.length > 0) {
      currentData.forEach((i, idx) => {
        doc.text(`${idx + 1}. Crop: ${i.crop}  |  Quantity: ${i.quantity} kg`, 14, y);
        y += 8;
      });
    } else {
      doc.text("No data available.", 14, y);
      y += 8;
    }

    // We will render to an offscreen canvas to capture all 3 chart types
    const hiddenCanvas = document.createElement("canvas");
    hiddenCanvas.width = 800;
    hiddenCanvas.height = 400;
    hiddenCanvas.style.display = 'none';
    document.body.appendChild(hiddenCanvas);

    const labels = currentData.length > 0 ? currentData.map(i => i.crop) : ["No Data"];
    const quantities = currentData.length > 0 ? currentData.map(i => i.quantity) : [0];
    
    const backgroundColors = [
      "rgba(255, 99, 132, 0.7)", "rgba(54, 162, 235, 0.7)", "rgba(255, 206, 86, 0.7)", 
      "rgba(75, 192, 192, 0.7)", "rgba(153, 102, 255, 0.7)", "rgba(255, 159, 64, 0.7)", 
      "rgba(199, 199, 199, 0.7)", "rgba(83, 102, 255, 0.7)", "rgba(40, 159, 64, 0.7)", "rgba(210, 199, 99, 0.7)"
    ];
    const borderColors = [
      "rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)", 
      "rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)", "rgba(255, 159, 64, 1)", 
      "rgba(199, 199, 199, 1)", "rgba(83, 102, 255, 1)", "rgba(40, 159, 64, 1)", "rgba(210, 199, 99, 1)"
    ];
    
    const applyBgColors = quantities.map((_, i) => backgroundColors[i % backgroundColors.length]);
    const applyBorderColors = quantities.map((_, i) => borderColors[i % borderColors.length]);

    const bgPlugin = {
      id: 'customCanvasBackgroundColor',
      beforeDraw: (chart, args, options) => {
        const {ctx} = chart;
        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, chart.width, chart.height);
        ctx.restore();
      }
    };

    const types = ['bar', 'pie', 'line'];
    let startY = y + 10;

    for (const type of types) {
      if (startY > 200) {
        doc.addPage();
        startY = 20;
      }
      
      const tempChart = new Chart(hiddenCanvas, {
        type: type,
        data: {
          labels,
          datasets: [{
            label: "Stored Quantity (kg)",
            data: quantities,
            backgroundColor: applyBgColors,
            borderColor: applyBorderColors,
            borderWidth: 2,
            tension: 0.3
          }]
        },
        options: {
          responsive: false,
          animation: false,
          plugins: {
            title: { display: true, text: `${type.toUpperCase()} CHART` },
            customCanvasBackgroundColor: { color: '#ffffff' }
          }
        },
        plugins: [bgPlugin]
      });

      const imgData = hiddenCanvas.toDataURL("image/png");
      doc.addImage(imgData, 'PNG', 14, startY, 180, 90);
      startY += 100;

      tempChart.destroy();
    }

    document.body.removeChild(hiddenCanvas);

    doc.save(`Storage_Report.pdf`);
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
          margin-top: 60px; /* Included margin for fixed navbar */
        }
        .sr-container {
          padding: 2rem 1rem;
          background: #f2f6f4;
          min-height: 100vh;
          text-align: center;
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
        <h2>{t("storageReport.title") || "Storage Report"}</h2>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="sr-container">
        <p>{t("storageReport.desc") || "Monitor your crop storage quantities."}</p>

        <div className="chart-box">
          <canvas ref={chartRef}></canvas>
        </div>

        <div>
          <button className="btn" onClick={() => setChartType("bar")}>{t("storageReport.bar") || "Bar"}</button>
          <button className="btn" onClick={() => setChartType("pie")}>{t("storageReport.pie") || "Pie"}</button>
          <button className="btn" onClick={() => setChartType("line")}>{t("storageReport.line") || "Line"}</button>
          <button className="btn" onClick={downloadPDF}>{t("storageReport.downloadPDF") || "Download PDF"}</button>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default StorageReport;