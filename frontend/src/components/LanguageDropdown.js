import React from "react";
import { useTranslation } from "react-i18next";

const LanguageDropdown = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="dropdown">
      <button className="dropdown-toggle">{t("languageDropdown.title")}</button>
      <div className="dropdown-menu">
        <a href="#" onClick={() => changeLanguage("en")}>
          <span className="flag">🇬🇧</span>
          <span className="label">{t("languageDropdown.english")}</span>
        </a>
        <a href="#" onClick={() => changeLanguage("hi")}>
          <span className="flag">🇮🇳</span>
          <span className="label">{t("languageDropdown.hindi")}</span>
        </a>
        <a href="#" onClick={() => changeLanguage("gu")}>
          <span className="flag">🇮🇳</span>
          <span className="label">{t("languageDropdown.gujarati")}</span>
        </a>
      </div>
    </div>
  );
};

export default LanguageDropdown;
