import React, { useState, useRef, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useTranslation } from "react-i18next";
import Webcam from "react-webcam";

ChartJS.register(ArcElement, Tooltip, Legend);

function DiseaseDetection() {
  const { t } = useTranslation();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [predictions, setPrediction] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [useCamera, setUseCamera] = useState(false);
  const webcamRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreviewUrl(selectedFile ? URL.createObjectURL(selectedFile) : null);
  };

  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        const capturedFile = new File([blob], "captured.jpg", { type: "image/jpeg" });
        setFile(capturedFile);
        setPreviewUrl(imageSrc);
      });
  };

  useEffect(() => {
    if (file) {
      console.log("📦 Image source:", useCamera ? "Live Camera" : "File Upload");
    }
  }, [file]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload or capture an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/detect-disease", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.predictions) {
        setPrediction(data.predictions);
      } else {
        setPrediction([{ disease: "No prediction received", confidence: 0 }]);
      }
    } catch (error) {
      console.error("Error detecting disease:", error);
      setPrediction("⚠️ Error connecting to backend");
    }
  };

  const handleWheelZoom = (e) => {
    e.preventDefault();
    const newScale = e.deltaY < 0 ? zoomScale + 0.1 : zoomScale - 0.1;
    setZoomScale(Math.max(1, Math.min(newScale, 5)));
  };

  // Prepare data for Pie Chart
  const chartData = predictions
    ? {
        labels: predictions.map((p) => p.disease),
        datasets: [
          {
            label: "Prediction Confidence",
            data: predictions.map((p) => p.confidence),
            backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
            borderColor: "#fff",
            borderWidth: 2,
          },
        ],
      }
    : null;
  return (
    <div className="container">
      <div className="card">
        <h2>{t("diseaseDetection.title")}</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "10px" }}>
            <label className="UseCamera">
              <input
                type="checkbox"
                checked={useCamera}
                onChange={() => {
                  setUseCamera(!useCamera);
                  setFile(null);
                  setPreviewUrl(null);
                }}
              />
              {t("diseaseDetection.useCamera")}
            </label>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
            <div>
              {useCamera ? (
                <div>
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width={200}
                    videoConstraints={{ facingMode: "environment" }}
                  />
                  <button type="button" onClick={capturePhoto} style={{ marginTop: "10px" }}>
                    {t("diseaseDetection.capture")}
                  </button>
                </div>
              ) : (
                <div className="custom-file-upload">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    id="file-input"
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="file-input" className="file-input-label">
                    {t("chooseFile")}
                  </label>
                  <span className="file-status">
                    {file ? file.name : t("noFileChosen")}
                  </span>
                </div>
              )}
            </div>

            {previewUrl && (
              <div>
                <h4 className="preview">📸 {t("preview")}:</h4>
                <img
                  src={previewUrl}
                  alt="Selected crop"
                  className="preview-image"
                  style={{
                    maxWidth: "200px",
                    height: "auto",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    cursor: "zoom-in",
                  }}
                  onClick={() => {
                    setIsZoomed(true);
                    setZoomScale(1);
                  }}
                />
              </div>
            )}
          </div>

          <button type="submit" style={{ marginTop: "20px" }}>
            {t("diseaseDetection.uploadDetect")}
          </button>
        </form>

        {predictions && (
          <div className="card">
            <h3>{t("predictions")}</h3>
            <ul>
              {predictions.map((p, index) => (
                <li key={index}>
                  {p.disease} - {p.confidence}%
                </li>
              ))}
            </ul>

            <h3>{t("confidence_title")}</h3>
            {chartData && (
              <div style={{ width: "250px", height: "250px", margin: "0 auto" }}>
                <Pie data={chartData} options={{ maintainAspectRatio: false }} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* 🔍 Fullscreen Zoom Overlay */}
      {isZoomed && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.85)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <button
            onClick={() => setIsZoomed(false)}
            style={{
              alignSelf: "flex-end",
              margin: "20px",
              padding: "10px 15px",
              backgroundColor: "#27ae60",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              zIndex: 10000,
            }}
          >
            {t("diseaseDetection.exit")}
          </button>

          <div
            style={{
              flex: 1,
              overflow: "auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "20px",
            }}
            onWheel={handleWheelZoom}
          >
            <img
              src={previewUrl}
              alt="Zoomed crop"
              style={{
                transform: `scale(${zoomScale})`,
                transition: "transform 0.2s ease",
                maxWidth: "unset",
                maxHeight: "unset",
                width: "auto",
                height: "auto",
                borderRadius: "12px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default DiseaseDetection;
