import React, { useState } from "react";
import { useTranslation } from "react-i18next";

function FertilizerRecommendation() {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    ph: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://krushiraah.onrender.com/fertilizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error fetching fertilizer recommendation:", error);
      setResult({ error: t("fertilizerPage.error") });
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>{t("fertilizerPage.title")}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            name="ph"
            placeholder={t("fertilizerPage.ph")}
            value={form.ph}
            onChange={handleChange}
            className="inputField"
          />
          <input
            type="number"
            name="nitrogen"
            placeholder={t("fertilizerPage.nitrogen")}
            value={form.nitrogen}
            onChange={handleChange}
            className="inputField"
          />
          <input
            type="number"
            name="phosphorus"
            placeholder={t("fertilizerPage.phosphorus")}
            value={form.phosphorus}
            onChange={handleChange}
            className="inputField"
          />
          <input
            type="number"
            name="potassium"
            placeholder={t("fertilizerPage.potassium")}
            value={form.potassium}
            onChange={handleChange}
            className="inputField"
          />
          <button type="submit">{t("fertilizerPage.submit")}</button>
        </form>

        {result && (
          <div className="responsecard">
            {result.error ? (
              <p>{result.error}</p>
            ) : (
              <>
                <h3>{t("fertilizerPage.resultTitle")}</h3>
                <p><strong>{result.fertilizer}</strong></p>
                <p>{result.note}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default FertilizerRecommendation;
