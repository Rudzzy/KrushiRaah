// import React, { useState } from "react";

// function WeatherForecast() {
//   const [location, setLocation] = useState("");
//   const [forecast, setForecast] = useState(null);

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     try {
//       const response = await fetch("http://127.0.0.1:5000/weather-forecast", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ location }),
//       });

//       const data = await response.json();
//       setForecast(data);
//     } catch (error) {
//       console.error("Error fetching forecast:", error);
//     }
//   };

//   return (
//     <div>
//       <h2>🌦 Weather Forecast</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Enter your village/city"
//           value={location}
//           onChange={(e) => setLocation(e.target.value)}
//         />
//         <button type="submit">Get Forecast</button>
//       </form>

//       {forecast && (
//         <div>
//           <h3>Forecast for {location}</h3>
//           <p>Next 6 months: {forecast.forecast}</p>
//           <p>Suggested Crops: {forecast.suggested_crops.join(", ")}</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default WeatherForecast;

//---------------------------------------------------------------------------------Added Global CSS--------------------------------------------------------------

// import React, { useState } from "react";

// function WeatherForecast() {
//     const [location, setLocation] = useState("");
//     const [forecast, setForecast] = useState([]);
    
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await fetch("http://localhost:5000/weather-forecast", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ location }),
//             });
            
//             const data = await response.json();
            
//             // ✅ Force forecast into an array
//             const safeForecast = Array.isArray(data.forecast)
//             ? data.forecast
//             : [
//                 { month: "September", condition: "Moderate Rainfall, good for Rice" },
//                 { month: "October", condition: "Dry & Sunny, Wheat is recommended" },
//                 { month: "November", condition: "Cool Weather, Mustard grows well" },
//             ];
            
//             setForecast(safeForecast);
//         } catch (error) {
//             console.error("Error fetching forecast:", error);
//             setForecast([
//                 { month: "September", condition: "Fallback: Rainy season, Rice grows well" },
//                 { month: "October", condition: "Fallback: Dry weather, Wheat is good" },
//             ]);
//         }
//   };

//   return (
//       <div className="container">
//       <div className="card">
//         <h2>☀️ Weather Forecast</h2>
//         <p>
//           Enter your location to see the next 6 months forecast and crop
//           recommendations.
//         </p>

//         <form onSubmit={handleSubmit}>
//           <input
//             type="text"
//             placeholder="Enter your location"
//             value={location}
//             onChange={(e) => setLocation(e.target.value)}
//             required
//             />
//           <button type="submit">Get Forecast</button>
//         </form>

//         {forecast.length > 0 && (
//             <div className="card">
//             <h3>📅 6-Month Forecast:</h3>
//             <ul>
//               {forecast.map((f, index) => (
//                   <li key={index}>
//                   <strong>{f.month}:</strong> {f.condition}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default WeatherForecast;

//---------------------------------------------------------------------------------Connected to Backend--------------------------------------------------------------

// import React, { useState } from "react";

// function WeatherForecast() {
//   const [location, setLocation] = useState("");
//   const [forecast, setForecast] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch("http://localhost:5000/weather-forecast", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ location }),
//       });

//       const data = await response.json();
//       setForecast(data);
//     } catch (error) {
    //       console.error("Error fetching forecast:", error);
    //       setForecast({ forecast: "⚠️ Error connecting to backend", suggested_crops: [] });
    //     }
    //   };

    //   return (
        //     <div className="container">
        //       <div className="card">
        //         <h2>🌦️ Weather Forecast</h2>
        //         <form onSubmit={handleSubmit}>
//           <input
//             type="text"
//             placeholder="Enter your location"
//             value={location}
//             onChange={(e) => setLocation(e.target.value)}
//           />
//           <button type="submit">Get Forecast</button>
//         </form>

//         {forecast && (
    //           <div className="card">
    //             <h3>📍 Forecast for {location || "your area"}:</h3>
//             <p>{forecast.forecast}</p>
//             <h4>🌱 Suggested Crops:</h4>
//             <ul>
//               {forecast.suggested_crops?.map((crop, i) => (
    //                 <li key={i}>{crop}</li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default WeatherForecast;

//---------------------------------------------------------------------------------Changing According to API--------------------------------------------------------------

// import React, { useState } from "react";
// import axios from "axios";

// function WeatherForecast() {
//   const [lat, setLat] = useState("");
//   const [lon, setLon] = useState("");
//   const [forecast, setForecast] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const fetchWeather = async (latitude, longitude) => {
//     try {
//       setLoading(true);
//       const response = await axios.post("http://127.0.0.1:5000/weather-forecast", {
//         lat: latitude,
//         lon: longitude,
//       });
//       setForecast(response.data);
//     } catch (error) {
//       console.error("Error fetching weather:", error);
//       alert("Failed to fetch weather");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleManualFetch = () => {
//     if (!lat || !lon) {
//       alert("Please enter both latitude and longitude");
//       return;
//     }
//     fetchWeather(lat, lon);
//   };

//   const handleLocationFetch = () => {
//     if (!navigator.geolocation) {
//       alert("Geolocation not supported");
//       return;
//     }
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         const latitude = pos.coords.latitude;
//         const longitude = pos.coords.longitude;
//         fetchWeather(latitude, longitude);
//       },
//       (err) => {
//         console.error(err);
//         alert("Unable to fetch location");
//       }
//     );
//   };

//   return (
//     <div className="page">
//       <h2>🌦 Weather Forecast</h2>

//       <div>
//         <input
//           type="text"
//           placeholder="Latitude"
//           value={lat}
//           onChange={(e) => setLat(e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="Longitude"
//           value={lon}
//           onChange={(e) => setLon(e.target.value)}
//         />
//         <button onClick={handleManualFetch}>Get Weather (Manual)</button>
//         <button onClick={handleLocationFetch}>Use My Location</button>
//       </div>

//       {loading && <p>Loading...</p>}

//       {forecast && (
//         <div className="result">
//           <h3>📍 {forecast.location}</h3>
//           <p>🌡 Temperature: {forecast.temperature} °C</p>
//           <p>💧 Humidity: {forecast.humidity} %</p>
//           <p>🌤 Condition: {forecast.weather}</p>
//           <p>💨 Wind Speed: {forecast.wind_speed} m/s</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default WeatherForecast;

// --------------------------------------------------------------------------------------------Tried API + CSS---------------------------------------------------

// import React, { useState } from "react";

// function WeatherForecast() {
//   const [lat, setLat] = useState("");
//   const [lon, setLon] = useState("");
//   const [forecast, setForecast] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Fetch from backend
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!lat || !lon) {
//       alert("Please enter both latitude and longitude");
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await fetch("http://127.0.0.1:5000/weather-forecast", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ lat, lon }),
//       });

//       const data = await response.json();
//       setForecast(data);
//     } catch (error) {
//       console.error("Error fetching forecast:", error);
//       setForecast({ error: "⚠️ Error connecting to backend" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Auto-detect location using browser GPS
//   const handleDetectLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         async (position) => {
//           setLat(position.coords.latitude);
//           setLon(position.coords.longitude);

//           try {
//             setLoading(true);
//             const response = await fetch("http://127.0.0.1:5000/weather-forecast", {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({
//                 lat: position.coords.latitude,
//                 lon: position.coords.longitude,
//               }),
//             });

//             const data = await response.json();
//             setForecast(data);
//           } catch (error) {
//             console.error("Error fetching forecast:", error);
//             setForecast({ error: "⚠️ Error connecting to backend" });
//           } finally {
//             setLoading(false);
//           }
//         },
//         (error) => {
//           alert("Error getting location: " + error.message);
//         }
//       );
//     } else {
//       alert("Geolocation is not supported by this browser.");
//     }
//   };

//   return (
//     <div className="container">
//       <div className="card">
//         <h2>🌦️ Weather Forecast</h2>
//         <form onSubmit={handleSubmit}>
//           <input
//             type="text"
//             placeholder="Enter latitude"
//             value={lat}
//             onChange={(e) => setLat(e.target.value)}
//           />
//           <input
//             type="text"
//             placeholder="Enter longitude"
//             value={lon}
//             onChange={(e) => setLon(e.target.value)}
//           />
//           <button type="submit">Get Forecast</button>
//         </form>
//         <button onClick={handleDetectLocation}>📍 Use My Location</button>

//         {loading && <p>Loading...</p>}

//         {forecast && (
//           <div className="card">
//             <h3>📍 Location: {forecast.name || "Unknown"}</h3>
//             <p>🌡️ Temperature: {forecast.temp}°C</p>
//             <p>💧 Humidity: {forecast.humidity}%</p>
//             <p>🌥️ Condition: {forecast.description}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default WeatherForecast;

// -------------------------------------------------------------------Success API + CSS -----------------------------------------------------------

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
      const response = await axios.post("http://127.0.0.1:5000/weather-forecast", {
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
