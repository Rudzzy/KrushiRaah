import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export default function WeatherCard() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [selectedCityKey, setSelectedCityKey] = useState("geo");

  // Common Indian cities + a few metros with lat/lon
  const cities = useMemo(() => ({
    geo: { label: t("cities.geo"), lat: null, lon: null },
    bharuch: { label: t("cities.bharuch"), lat: 21.7051, lon: 72.9959 },
    delhi: { label: t("cities.delhi"), lat: 28.6139, lon: 77.2090 },
    mumbai: { label: t("cities.mumbai"), lat: 19.0760, lon: 72.8777 },
    pune: { label: t("cities.pune"), lat: 18.5204, lon: 73.8567 },
    surat: { label: t("cities.surat"), lat: 21.1702, lon: 72.8311 },
    vadodara: { label: t("cities.vadodara"), lat: 22.3072, lon: 73.1812 },
    ahmedabad: { label: t("cities.ahmedabad"), lat: 23.0225, lon: 72.5714 },
    bengaluru: { label: t("cities.bengaluru"), lat: 12.9716, lon: 77.5946 },
    hyderabad: { label: t("cities.hyderabad"), lat: 17.3850, lon: 78.4867 },
    chennai: { label: t("cities.chennai"), lat: 13.0827, lon: 80.2707 },
    kolkata: { label: t("cities.kolkata"), lat: 22.5726, lon: 88.3639 },
    jaipur: { label: t("cities.jaipur"), lat: 26.9124, lon: 75.7873 },
    lucknow: { label: t("cities.lucknow"), lat: 26.8467, lon: 80.9462 }
  }), [t]);

  const Icon = useMemo(() => {
    return ({ desc }) => {
      const d = (desc || "").toLowerCase();
      const is = (k) => d.includes(k);
      const common = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
      if (is("thunder")) return (
        <svg {...common}><path d="M7 17h2l-2 4 5-6h-3l2-4-4 6z" fill="currentColor" stroke="none"/><path d="M17 9a4 4 0 0 0-7.9-1"/><path d="M5 10a5 5 0 1 0 2 9h9a4 4 0 0 0 1-7.9"/></svg>
      );
      if (is("rain") || is("drizzle")) return (
        <svg {...common}><circle cx="8" cy="10" r="4"/><path d="M12 10a4 4 0 1 1 8 0"/><path d="M7 17l-1 2M11 17l-1 2M15 17l-1 2"/></svg>
      );
      if (is("snow")) return (
        <svg {...common}><circle cx="8" cy="10" r="4"/><path d="M12 10a4 4 0 1 1 8 0"/><path d="M8 17v2M6.6 17.6l-1.4 1.4M9.4 17.6l1.4 1.4"/></svg>
      );
      if (is("fog") || is("mist") || is("haze")) return (
        <svg {...common}><circle cx="8" cy="10" r="4"/><path d="M12 10a4 4 0 1 1 8 0"/><path d="M4 16h12M6 19h10"/></svg>
      );
      if (is("cloud")) return (
        <svg {...common}><path d="M9 18H7a4 4 0 1 1 1-7.8A5 5 0 0 1 18 11a3 3 0 0 1-1 7h-2"/></svg>
      );
      return (
        <svg {...common}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M17.7 6.3l1.4-1.4M4.9 19.1l1.4-1.4"/></svg>
      );
    };
  }, []);

  async function fetchByLatLon(latitude, longitude) {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/weather-forecast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat: latitude, lon: longitude })
      });
      const json = await res.json();
      if (json && !json.error) {
        setData(json);
        setError(null);
      } else {
        setError(json?.error || "Unable to load weather");
      }
    } catch (e) {
      setError("Failed to fetch weather");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    // Initial load: use geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (!cancelled) fetchByLatLon(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          setLoading(false);
          setError("Location permission denied");
        }
      );
    } else {
      setLoading(false);
      setError("Geolocation not supported");
    }

    // Fallback after 5s if still loading
    const timeoutId = setTimeout(() => {
      if (!cancelled && loading) {
        setSelectedCityKey("delhi");
        fetchByLatLon(cities.delhi.lat, cities.delhi.lon);
      }
    }, 5000);

    return () => { cancelled = true; clearTimeout(timeoutId); };
  }, []);

  const handleCityChange = async (e) => {
    const key = e.target.value;
    setSelectedCityKey(key);
    if (key === "geo") {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            fetchByLatLon(pos.coords.latitude, pos.coords.longitude);
          },
          () => {
            setError("Location permission denied");
          }
        );
      }
      return;
    }
    const city = cities[key];
    if (!city) return;
    fetchByLatLon(city.lat, city.lon);
  };

  return (
    <div className="hp-weather-card" role="status" aria-live="polite">
      {loading && (
        <div className="hp-wc-inner ">
          <div className="hp-wc-icon" aria-hidden>⏳</div>
          <div className="hp-wc-text">
            <div className="hp-wc-temp">--°C</div>
            <div className="hp-wc-desc">Loading…</div>
          </div>
          <select className="hp-wc-select" value={selectedCityKey} onChange={handleCityChange} aria-label="Select city">
            {Object.entries(cities).map(([key, c]) => (
              <option key={key} value={key}>{c.label}</option>
            ))}
          </select>
        </div>
      )}
      {!loading && error && (
        <div className="hp-wc-inner">
          <div className="hp-wc-icon" aria-hidden>⚠️</div>
          <div className="hp-wc-text">
            <div className="hp-wc-temp">N/A</div>
            <div className="hp-wc-desc">{error}</div>
          </div>
          <select className="hp-wc-select" value={selectedCityKey} onChange={handleCityChange} aria-label="Select city">
            {Object.entries(cities).map(([key, c]) => (
              <option key={key} value={key}>{c.label}</option>
            ))}
          </select>
        </div>
      )}
      {!loading && !error && data && (
        <div className="hp-wc-inner" title={data.weather}>
          <div className="hp-wc-icon" aria-hidden>
            <Icon desc={data.weather} />
          </div>
          <div className="hp-wc-text">
            <div className="hp-wc-temp">{Math.round(data.temperature)}°C</div>
            <div className="hp-wc-desc">
              {data.weather}
              {data.location ? <span className="hp-wc-loc"> • {data.location}</span> : null}
            </div>
          </div>
          <select className="hp-wc-select" value={selectedCityKey} onChange={handleCityChange} aria-label="Select city">
            {Object.entries(cities).map(([key, c]) => (
              <option key={key} value={key}>{c.label}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}


