import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const About = () => {
  const { t, i18n } = useTranslation();

  return (
    <>
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="about-hero">
        <div className="hero-content">
          <h1>{t("Agrichain")}</h1>
          <p>{t("tagline")}</p>

          <div className="lang-switch">
            <button onClick={() => i18n.changeLanguage("en")}>English</button>
            <button onClick={() => i18n.changeLanguage("ta")}>தமிழ்</button>
          </div>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section className="about-section">
        <h2>{t("whyTitle")}</h2>
        <p>{t("whyDesc")}</p>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="feature-section">
        <div className="feature-card">
          <span>🌾</span>
          <h3>{t("feature1Title")}</h3>
          <p>{t("feature1Desc")}</p>
        </div>

        <div className="feature-card highlight">
          <span>🔗</span>
          <h3>{t("feature2Title")}</h3>
          <p>{t("feature2Desc")}</p>
        </div>

        <div className="feature-card">
          <span>🛡️</span>
          <h3>{t("feature3Title")}</h3>
          <p>{t("feature3Desc")}</p>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="steps">
        <h2>{t("howTitle")}</h2>

        <div className="step">
          <div className="step-no">1</div>
          <div>
            <h4>{t("step1Title")}</h4>
            <p>{t("step1Desc")}</p>
          </div>
        </div>

        <div className="step">
          <div className="step-no">2</div>
          <div>
            <h4>{t("step2Title")}</h4>
            <p>{t("step2Desc")}</p>
          </div>
        </div>

        <div className="step">
          <div className="step-no">3</div>
          <div>
            <h4>{t("step3Title")}</h4>
            <p>{t("step3Desc")}</p>
          </div>
        </div>
      </section>

      <Footer />

      {/* ===== CSS ===== */}
      <style>{`
        * { box-sizing: border-box; }

        .about-hero {
          background: linear-gradient(135deg,#132a13,#31572c);
          color: #ecf39e;
          padding: 120px 20px 80px;
          text-align: center;
        }

        .hero-content {
          max-width: 900px;
          margin: auto;
        }

        .about-hero h1 {
          font-size: 3rem;
          margin-bottom: 16px;
        }

        .about-hero p {
          font-size: 1.1rem;
          opacity: 0.95;
        }

        .lang-switch {
          margin-top: 24px;
          display: flex;
          justify-content: center;
          gap: 12px;
        }

        .lang-switch button {
          background: #ecf39e;
          color: #132a13;
          border: none;
          padding: 8px 18px;
          border-radius: 20px;
          font-weight: 600;
          cursor: pointer;
        }

        .about-section {
          padding: 70px 20px;
          max-width: 900px;
          margin: auto;
          text-align: center;
        }

        .about-section h2 {
          color: #132a13;
          margin-bottom: 16px;
        }

        .about-section p {
          color: #444;
          line-height: 1.8;
        }

        .feature-section {
          display: grid;
          grid-template-columns: repeat(auto-fit,minmax(260px,1fr));
          gap: 25px;
          padding: 60px 20px;
          background: #f8fad9;
        }

        .feature-card {
          background: white;
          padding: 30px;
          border-radius: 18px;
          text-align: center;
          transition: 0.3s;
        }

        .feature-card span {
          font-size: 2.5rem;
        }

        .feature-card h3 {
          margin: 14px 0;
          color: #132a13;
        }

        .feature-card p {
          font-size: 0.95rem;
          color: #555;
        }

        .feature-card.highlight {
          background: linear-gradient(135deg,#31572c,#4f772d);
          color: #ecf39e;
        }

        .feature-card.highlight h3,
        .feature-card.highlight p {
          color: #ecf39e;
        }

        .steps {
          max-width: 900px;
          margin: auto;
          padding: 70px 20px;
        }

        .steps h2 {
          text-align: center;
          color: #132a13;
          margin-bottom: 40px;
        }

        .step {
          display: flex;
          gap: 20px;
          margin-bottom: 25px;
          align-items: flex-start;
        }

        .step-no {
          min-width: 42px;
          height: 42px;
          background: #31572c;
          color: #ecf39e;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        @media (max-width:768px) {
          .about-hero h1 { font-size: 2.2rem; }
          .step { flex-direction: column; }
        }
      `}</style>
    </>
  );
};

export default About;
