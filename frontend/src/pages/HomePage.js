import React, { useEffect, useState } from "react";
import ImageSlider from "../components/ImageSlider";
import "./HomePage.css";
import logo from "../assets/logo.jpg";
import { Link } from "react-router-dom";
import LanguageDropdown from "../components/LanguageDropdown";
import { useTranslation } from "react-i18next";
import WeatherCard from "../components/WeatherCard";

const HomePage = () => {
  const { t } = useTranslation();
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    document.body.classList.add("homepage-active");
    return () => {
      document.body.classList.remove("homepage-active");
    };
  }, []);

  return (
    <div className={`homepage-wrapper slide-${slideIndex}`}>
      {/* Decorative background layers */}
      <div className="hp-decor" aria-hidden="true">
        <div className="hp-blob blob-a" />
        <div className="hp-blob blob-b" />
        <div className="hp-blob blob-c" />

        <div className="hp-ring ring-a" />
        <div className="hp-ring ring-b" />

        <div className="hp-beam beam-a" />
        <div className="hp-beam beam-b" />

        <div className="hp-particles">
          {Array.from({ length: 18 }).map((_, i) => (
            <span key={i} className={`hp-particle p-${i + 1}`} />
          ))}
        </div>
      </div>
      {/* Minimal header overlay for homepage */}
      <header className="homepage-header">
        <div className="hp-left">
          <Link to="/">
            <img src={logo} alt="KrushiRaah" className="hp-logo" />
          </Link>
        </div>
        <div className="hp-right">
          <WeatherCard />
          <div className="hp-dropdown">
            <span className="hp-toggle">{t("services")} ▾</span>
            <div className="hp-menu">
              <Link to="/crop-recomendation">{t("crop")}</Link>
              <Link to="/disease-detection">{t("disease")}</Link>
              <Link to="/weather-forecast">{t("weather")}</Link>
              <Link to="/crop-rotation">{t("rotation")}</Link>
              <Link to="/fertilizer">{t("fertilizer")}</Link>
              <Link to="/profitability">{t("profit")}</Link>
              <Link to="/chatbot">{t("chatbot")}</Link>
              <Link to="/market-prices">{t("marketprices")}</Link>
            </div>
          </div>
          <LanguageDropdown />
        </div>
      </header>

      <ImageSlider onSlideChange={setSlideIndex} />

      {/* Scroll cue / hint */}
      <div className="scroll-cue" aria-hidden="true">
        <span className="mouse" />
        <span className="arrow" />
      </div>
    </div>
  );
};

export default HomePage;
