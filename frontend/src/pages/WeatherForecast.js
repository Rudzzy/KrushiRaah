import React, { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

function WeatherForecast() {
  const { t } = useTranslation();
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to map OpenWeatherMap descriptions to our translation keys
  const getWeatherTranslationKey = (weatherDescription) => {
    const description = weatherDescription.toLowerCase();
    
    if (description.includes("light rain") || description.includes("drizzle")) {
      return "lightRain";
    } else if (description.includes("moderate rain")) {
      return "moderateRain";
    } else if (description.includes("heavy rain") || description.includes("rain")) {
      return "heavyRain";
    } else if (description.includes("thunderstorm")) {
      return "thunderstorms";
    } else if (description.includes("clear") || description.includes("sunny")) {
      return "sunny";
    } else if (description.includes("partly cloudy")) {
      return "partlyCloudy";
    } else if (description.includes("cloudy") || description.includes("overcast")) {
      return "cloudy";
    } else if (description.includes("fog") || description.includes("mist")) {
      return "foggy";
    } else if (description.includes("wind")) {
      return "windy";
    } else if (description.includes("snow")) {
      return "snow";
    } else if (description.includes("hail")) {
      return "hail";
    } else {
      return "moderateRain"; // default fallback
    }
  };

  const fetchWeather = async (latitude, longitude) => {
    try {
      setLoading(true);
      const response = await axios.post("https://krushiraah.onrender.com/weather-forecast", {
        lat: latitude,
        lon: longitude,
      });
      setForecast(response.data);
    } catch (error) {
      console.error("Error fetching weather:", error);
      alert("Failed to fetch weather");
    } finally {
      setLoading(false);
    }
  };

  const handleManualFetch = () => {
    if (!lat || !lon) {
      alert("Please enter both latitude and longitude");
      return;
    }
    fetchWeather(lat, lon);
  };

  const handleLocationFetch = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;
        fetchWeather(latitude, longitude);
      },
      (err) => {
        console.error(err);
        alert("Unable to fetch location");
      }
    );
  };

  return (
    <div className="container">
      <div className="card">
        <h2>{t("weatherPage.title")}</h2>
        <p>
          <span className="weather-forecast">{t("weatherPage.blurb")}</span>
        </p>

        {/* Input + buttons */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleManualFetch();
          }}
        >
          <input
            type="text"
            placeholder={t("weatherPage.latitude")}
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            className="inputField"
          />
          <input
            type="text"
            placeholder={t("weatherPage.longitude")}
            value={lon}
            onChange={(e) => setLon(e.target.value)}
            className="inputField"
          />
          <button type="submit">{t("weatherPage.getWeather")}</button>
          <button type="button" onClick={handleLocationFetch}>
            {t("weatherPage.useMyLocation")}
          </button>
        </form>

        {/* Loading indicator */}
        {loading && <p>{t("weatherPage.loading")}</p>}

        {/* Weather results */}
        {forecast && (
          <div className="responsecard">
            <h3>{t("weatherPage.location")} {forecast.location}</h3>
            <p>🌡 <strong>{t("weatherPage.temperature")}:</strong> {forecast.temperature} {t("weatherPage.unitC")}</p>
            <p>💧 <strong>{t("weatherPage.humidity")}:</strong> {forecast.humidity} %</p>
            <p>🌤 <strong>{t("weatherPage.condition")}:</strong> {t(`weatherConditions.${getWeatherTranslationKey(forecast.weather)}`, forecast.weather)}</p>
            <p>💨 <strong>{t("weatherPage.wind")}:</strong> {forecast.wind_speed} {t("weatherPage.unitMs")}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default WeatherForecast;
