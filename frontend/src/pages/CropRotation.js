import React, { useState } from "react";
import { useTranslation } from "react-i18next";

function CropRotation() {
  const { t } = useTranslation();
  const [crop, setCrop] = useState("");
  const [nextCrops, setNextCrops] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/crop-rotation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crop }),
      });

      const data = await response.json();
      setNextCrops(data.next_crops || []);
    } catch (error) {
      console.error("Error fetching crop rotation:", error);
      setNextCrops([t("cropRotationPage.error")]);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>{t("cropRotationPage.title")}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder={t("cropRotationPage.inputPlaceholder")}
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            className="inputField"
          />
          <button type="submit">{t("cropRotationPage.submit")}</button>
        </form>

        {nextCrops.length > 0 && (
          <div className="responsecard">
            <h3>{t("cropRotationPage.resultsTitle")}</h3>
            <ul>
              {nextCrops.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default CropRotation;
