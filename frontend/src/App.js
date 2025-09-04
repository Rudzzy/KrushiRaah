
/*----------------------------------------------------------2nd code ----------------------------------------------*/
import React from "react";
import { useLocation } from "react-router-dom";

import { Routes, Route, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./App.css";
import CropRecommendation from "./pages/CropRecommendation";
import DiseaseDetection from "./pages/DiseaseDetection";
import WeatherForecast from "./pages/WeatherForecast";
import CropRotation from "./pages/CropRotation";
import ProfitabilityDashboard from "./pages/ProfitabilityDashboard";
import FertilizerRecommendation from "./pages/FertilizerRecommendation";
import MarketPrices from "./pages/MarketPrices";
import { ChatProvider } from "./context/ChatContext";
import Chatbot from "./components/Chatbot";
import FullChatPage from "./pages/FullChatPage";
import HomePage from "./pages/HomePage";
import logo from "./assets/logo.jpg";
import LanguageDropdown from "./components/LanguageDropdown";
import "./i18n";

function App() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div>
      {/* Navbar - hidden on homepage to allow full-bleed slides */}
      {location.pathname !== "/" && (
      <nav className="navbar">
  {/* Left: Logo */}
  <div className="nav-left">
    <Link to="/">
      <img src={logo} alt="AI Crop Advisor Logo" className="navbar-logo" />
    </Link>
  </div>

  {/* Right: Dropdown + Language */}
<div className="nav-right">
  {/* Services Dropdown */}
  <div className="dropdown">
    <button className="dropdown-toggle">{t("services")} ▾</button>
    <div className="dropdown-menu">
      <Link to="/crop-recomendation">{t("crop")}</Link>
      <Link to="/disease-detection">{t("disease")}</Link>
      <Link to="/weather-forecast">{t("weather")}</Link>
      <Link to="/crop-rotation">{t("rotation")}</Link>
      <Link to="/fertilizer">{t("fertilizer")}</Link>
      <Link to="/profitability">{t("profit")}</Link>
      <Link to="/chat">{t("chatbot")}</Link>
      <Link to="/market-prices">{t("marketprices")}</Link>
    </div>
  </div>

  {/* 🌐 Language Dropdown */}
  <LanguageDropdown />
</div>
</nav>
      )}


      {/* Routes (placeholders for now) */}
      <ChatProvider>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/crop-recomendation" element={<CropRecommendation />} />
        <Route path="/disease-detection" element={<DiseaseDetection />} />
        <Route path="/weather-forecast" element={<WeatherForecast />} />
        <Route path="/crop-rotation" element={<CropRotation />} />
        <Route path="/fertilizer" element={<FertilizerRecommendation />} />
        <Route path="/profitability" element={<ProfitabilityDashboard />} />
        <Route path="/market-prices" element={<MarketPrices />} />
        {/* <Route path="/chatbot" element={<VoiceChatBot />} /> */}
        <Route path="/chat" element={<FullChatPage />} />
      </Routes>
      <Chatbot />
      </ChatProvider>
    </div>
  );
}

export default App;
