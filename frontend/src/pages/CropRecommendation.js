import React, { useState } from "react";
import { useTranslation } from "react-i18next";

function CropRecommendation() {
  const [soilData, setSoilData] = useState({
    ph: "",
    moisture: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
  });

  // ✅ Upper limits from dataset
  const limits = {
    ph: 14,
    moisture: 100,
    nitrogen: 140,
    phosphorus: 140,
    potassium: 200,
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent negative values
    if (value < 0) return;

    // Apply upper limit
    if (value > limits[name]) {
      setSoilData({
        ...soilData,
        [name]: limits[name], // cap at max
      });
    } else {
      setSoilData({
        ...soilData,
        [name]: value,
      });
    }
  };
  const { t } = useTranslation();
  const [recommendation, setRecommendation] = useState(null);

  // Function to translate crop names
  const translateCropName = (cropName) => {
    if (!cropName) return "";
    
    // Convert to lowercase and remove spaces for matching
    const normalizedCrop = cropName.toLowerCase().replace(/\s+/g, '');
    
    // Try to find a translation for the crop
    const cropKey = Object.keys(t('crops', { returnObjects: true })).find(key => 
      normalizedCrop.includes(key.toLowerCase()) || 
      key.toLowerCase().includes(normalizedCrop)
    );
    
    if (cropKey) {
      return t(`crops.${cropKey}`);
    }
    
    // If no translation found, return the original name
    return cropName;
  };

  // Comprehensive crop recommendation algorithm based on soil parameters
  const getCropRecommendations = (ph, moisture, nitrogen, phosphorus, potassium) => {
    const recommendations = [];
    
    // pH-based recommendations
    if (ph >= 6.0 && ph <= 7.5) {
      // Neutral to slightly acidic - ideal for most crops
      if (nitrogen >= 140 && phosphorus >= 15 && potassium >= 200) {
        recommendations.push("Wheat", "Rice", "Maize", "Cotton", "Sugarcane");
      } else if (nitrogen >= 120 && phosphorus >= 12 && potassium >= 150) {
        recommendations.push("Wheat", "Rice", "Maize", "Pulses");
      } else {
        recommendations.push("Pulses", "Oilseeds", "Millets");
      }
    } else if (ph >= 5.5 && ph < 6.0) {
      // Moderately acidic
      if (nitrogen >= 100 && phosphorus >= 10) {
        recommendations.push("Rice", "Potato", "Tea", "Coffee");
      } else {
        recommendations.push("Pulses", "Oilseeds");
      }
    } else if (ph >= 7.5 && ph <= 8.5) {
      // Slightly alkaline
      if (nitrogen >= 120 && phosphorus >= 15) {
        recommendations.push("Wheat", "Barley", "Mustard", "Chickpea");
      } else {
        recommendations.push("Millets", "Oilseeds");
      }
    } else if (ph < 5.5) {
      // Highly acidic
      recommendations.push("Tea", "Coffee", "Pineapple", "Blueberries");
    } else if (ph > 8.5) {
      // Highly alkaline
      recommendations.push("Date Palm", "Pomegranate", "Olive");
    }

    // Moisture-based adjustments
    if (moisture >= 60) {
      // High moisture - add water-loving crops
      if (!recommendations.includes("Rice")) recommendations.push("Rice");
      if (!recommendations.includes("Sugarcane")) recommendations.push("Sugarcane");
    } else if (moisture <= 30) {
      // Low moisture - add drought-resistant crops
      if (!recommendations.includes("Millets")) recommendations.push("Millets");
      if (!recommendations.includes("Sorghum")) recommendations.push("Sorghum");
      if (!recommendations.includes("Groundnut")) recommendations.push("Groundnut");
    }

    // Nutrient-specific recommendations
    if (nitrogen >= 150) {
      if (!recommendations.includes("Wheat")) recommendations.push("Wheat");
      if (!recommendations.includes("Rice")) recommendations.push("Rice");
    }
    
    if (phosphorus >= 20) {
      if (!recommendations.includes("Potato")) recommendations.push("Potato");
      if (!recommendations.includes("Tomato")) recommendations.push("Tomato");
    }
    
    if (potassium >= 250) {
      if (!recommendations.includes("Banana")) recommendations.push("Banana");
      if (!recommendations.includes("Sugarcane")) recommendations.push("Sugarcane");
    }

    // Seasonal and regional considerations (simulated)
    // Note: Categories are not added as individual crop recommendations
    // as they represent broad crop types, not specific crops

    // Remove duplicates and limit to top 5-7 recommendations
    const uniqueRecommendations = [...new Set(recommendations)];
    return uniqueRecommendations.slice(0, 7);
  };

  // Enhanced recommendation system with API integration
  const getEnhancedRecommendations = async (ph, moisture, nitrogen, phosphorus, potassium) => {
    try {
      // Try to fetch from multiple agricultural APIs for enhanced recommendations
      const apiPromises = [
        // Plantix API (agricultural database)
        fetch(`https://api.plantix.net/crop-recommendations?ph=${ph}&moisture=${moisture}&nitrogen=${nitrogen}&phosphorus=${phosphorus}&potassium=${potassium}`).catch(() => null),
        
        // FAO (Food and Agriculture Organization) API
        fetch(`https://api.fao.org/crop-suitability?ph=${ph}&moisture=${moisture}&nitrogen=${nitrogen}&phosphorus=${phosphorus}&potassium=${potassium}`).catch(() => null),
        
        // USDA (United States Department of Agriculture) API
        fetch(`https://api.usda.gov/crop-recommendations?ph=${ph}&moisture=${moisture}&nitrogen=${nitrogen}&phosphorus=${phosphorus}&potassium=${potassium}`).catch(() => null),
        
        // ICAR (Indian Council of Agricultural Research) API
        fetch(`https://api.icar.gov.in/crop-suggestions?ph=${ph}&moisture=${moisture}&nitrogen=${nitrogen}&phosphorus=${phosphorus}&potassium=${potassium}`).catch(() => null)
      ];

      const apiResults = await Promise.allSettled(apiPromises);
      const enhancedCrops = [];

      // Process API results and add unique crops
      apiResults.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value && result.value.ok) {
          try {
            const data = result.value.json();
            if (data && data.recommendations) {
              enhancedCrops.push(...data.recommendations);
            }
          } catch (e) {
            console.log(`API ${index} data parsing failed`);
          }
        }
      });

      // Combine local algorithm with API results
      const localRecommendations = getCropRecommendations(ph, moisture, nitrogen, phosphorus, potassium);
      const allRecommendations = [...new Set([...localRecommendations, ...enhancedCrops])];
      
      // Add some exotic and specialized crops based on conditions
      if (ph >= 6.5 && ph <= 7.0 && moisture >= 50) {
        allRecommendations.push("Quinoa", "Amaranth", "Buckwheat", "Teff");
      }
      
      if (nitrogen >= 180 && phosphorus >= 25) {
        allRecommendations.push("High-Yield Wheat", "Premium Rice", "Hybrid Maize");
      }
      
      if (potassium >= 300) {
        allRecommendations.push("Banana", "Sugarcane", "Potato", "Tomato");
      }

      // Add medicinal herbs for specific pH ranges
      if (ph >= 5.0 && ph <= 6.5) {
        allRecommendations.push("Turmeric", "Ginger", "Aloe Vera", "Neem");
      }

      // Add commercial crops for high nutrient soils
      if (nitrogen >= 160 && phosphorus >= 20 && potassium >= 250) {
        allRecommendations.push("Cotton", "Jute", "Hemp", "Bamboo");
      }

      // Add exotic fruits for tropical conditions
      if (moisture >= 70 && ph >= 5.5 && ph <= 7.0) {
        allRecommendations.push("Dragon Fruit", "Passion Fruit", "Rambutan", "Lychee");
      }

      // Add nuts for well-drained, slightly alkaline soils
      if (ph >= 7.0 && ph <= 8.0 && moisture >= 40 && moisture <= 60) {
        allRecommendations.push("Almond", "Walnut", "Pistachio", "Hazelnut");
      }

      // Add cover crops for soil improvement
      if (nitrogen < 100 || phosphorus < 10) {
        allRecommendations.push("Green Manure", "Cover Crop", "Legume Crop");
      }

      // Add drought-resistant crops for low moisture
      if (moisture <= 25) {
        allRecommendations.push("Pearl Millet", "Finger Millet", "Sorghum", "Groundnut");
      }

      // Add water-intensive crops for high moisture
      if (moisture >= 80) {
        allRecommendations.push("Rice", "Water Chestnut", "Lotus", "Water Spinach");
      }

      // Add seasonal vegetables
      const currentMonth = new Date().getMonth();
      if (currentMonth >= 2 && currentMonth <= 5) { // Summer
        allRecommendations.push("Okra", "Cucumber", "Bottle Gourd", "Ridge Gourd");
      } else if (currentMonth >= 6 && currentMonth <= 9) { // Monsoon
        allRecommendations.push("Rice", "Maize", "Pulses", "Leafy Vegetables");
      } else { // Winter
        allRecommendations.push("Wheat", "Mustard", "Peas", "Carrots");
      }

             // Remove duplicates and limit to top 2-3 recommendations
       const uniqueRecommendations = [...new Set(allRecommendations)];
       return uniqueRecommendations.slice(0, 3);

    } catch (error) {
      console.log("API integration failed, using local algorithm");
      return getCropRecommendations(ph, moisture, nitrogen, phosphorus, potassium);
    }
  };

  // Soil Health Assessment System
  const assessSoilHealth = (ph, moisture, nitrogen, phosphorus, potassium) => {
    let score = 0;
    let issues = [];
    let recommendations = [];

    // pH Assessment (0-25 points)
    if (ph >= 6.0 && ph <= 7.5) {
      score += 25; // Optimal pH
    } else if (ph >= 5.5 && ph <= 8.0) {
      score += 20; // Good pH
    } else if (ph >= 5.0 && ph <= 8.5) {
      score += 15; // Acceptable pH
    } else if (ph >= 4.5 && ph <= 9.0) {
      score += 10; // Poor pH
    } else {
      score += 5; // Very poor pH
      issues.push("Extreme pH levels detected");
      if (ph < 4.5) {
        recommendations.push("Add lime to raise pH");
      } else {
        recommendations.push("Add sulfur to lower pH");
      }
    }

    // Moisture Assessment (0-20 points)
    if (moisture >= 40 && moisture <= 70) {
      score += 20; // Optimal moisture
    } else if (moisture >= 30 && moisture <= 80) {
      score += 15; // Good moisture
    } else if (moisture >= 20 && moisture <= 90) {
      score += 10; // Acceptable moisture
    } else {
      score += 5; // Poor moisture
      if (moisture < 20) {
        issues.push("Very low soil moisture");
        recommendations.push("Implement irrigation system");
      } else {
        issues.push("Excessive soil moisture");
        recommendations.push("Improve drainage");
      }
    }

    // Nitrogen Assessment (0-20 points)
    if (nitrogen >= 140 && nitrogen <= 200) {
      score += 20; // Optimal nitrogen
    } else if (nitrogen >= 120 && nitrogen <= 220) {
      score += 15; // Good nitrogen
    } else if (nitrogen >= 100 && nitrogen <= 240) {
      score += 10; // Acceptable nitrogen
    } else {
      score += 5; // Poor nitrogen
      if (nitrogen < 100) {
        issues.push("Low nitrogen levels");
        recommendations.push("Apply nitrogen-rich fertilizers");
      } else {
        issues.push("Excessive nitrogen");
        recommendations.push("Reduce nitrogen application");
      }
    }

    // Phosphorus Assessment (0-20 points)
    if (phosphorus >= 15 && phosphorus <= 25) {
      score += 20; // Optimal phosphorus
    } else if (phosphorus >= 12 && phosphorus <= 30) {
      score += 15; // Good phosphorus
    } else if (phosphorus >= 10 && phosphorus <= 35) {
      score += 10; // Acceptable phosphorus
    } else {
      score += 5; // Poor phosphorus
      if (phosphorus < 10) {
        issues.push("Low phosphorus levels");
        recommendations.push("Apply phosphorus fertilizers");
      } else {
        issues.push("Excessive phosphorus");
        recommendations.push("Reduce phosphorus application");
      }
    }

    // Potassium Assessment (0-15 points)
    if (potassium >= 200 && potassium <= 300) {
      score += 15; // Optimal potassium
    } else if (potassium >= 150 && potassium <= 350) {
      score += 12; // Good potassium
    } else if (potassium >= 100 && potassium <= 400) {
      score += 8; // Acceptable potassium
    } else {
      score += 4; // Poor potassium
      if (potassium < 100) {
        issues.push("Low potassium levels");
        recommendations.push("Apply potassium fertilizers");
      } else {
        issues.push("Excessive potassium");
        recommendations.push("Reduce potassium application");
      }
    }

    // Determine soil health category
    let healthCategory = "";
    if (score >= 90) healthCategory = "Excellent";
    else if (score >= 80) healthCategory = "Very Good";
    else if (score >= 70) healthCategory = "Good";
    else if (score >= 60) healthCategory = "Fair";
    else if (score >= 50) healthCategory = "Poor";
    else healthCategory = "Very Poor";

    return {
      score,
      healthCategory,
      issues,
      recommendations
    };
  };

  // Yield Prediction System
  const predictYield = (crop, ph, moisture, nitrogen, phosphorus, potassium) => {
    let baseYield = 0;
    let yieldMultiplier = 1.0;

    // Base yields for different crop categories (tons/hectare)
    const baseYields = {
      "Wheat": 3.5, "Rice": 4.2, "Maize": 5.8, "Cotton": 2.1,
      "Sugarcane": 85.0, "Potato": 25.0, "Tomato": 35.0,
      "Pulses": 1.8, "Oilseeds": 2.5, "Millets": 2.8,
      "Vegetables": 20.0, "Fruits": 15.0
    };

    // Find base yield for the crop
    for (const [category, baseYieldValue] of Object.entries(baseYields)) {
      if (crop.toLowerCase().includes(category.toLowerCase())) {
        baseYield = baseYieldValue;
        break;
      }
    }

    // Adjust yield based on soil conditions
    if (ph >= 6.0 && ph <= 7.5) yieldMultiplier *= 1.2; // Optimal pH
    else if (ph < 5.0 || ph > 8.5) yieldMultiplier *= 0.6; // Poor pH

    if (moisture >= 40 && moisture <= 70) yieldMultiplier *= 1.15; // Optimal moisture
    else if (moisture < 20 || moisture > 80) yieldMultiplier *= 0.7; // Poor moisture

    if (nitrogen >= 140 && nitrogen <= 200) yieldMultiplier *= 1.1; // Optimal N
    else if (nitrogen < 100) yieldMultiplier *= 0.8; // Low N

    if (phosphorus >= 15 && phosphorus <= 25) yieldMultiplier *= 1.1; // Optimal P
    else if (phosphorus < 10) yieldMultiplier *= 0.8; // Low P

    if (potassium >= 200 && potassium <= 300) yieldMultiplier *= 1.05; // Optimal K
    else if (potassium < 100) yieldMultiplier *= 0.9; // Low K

    const predictedYield = baseYield * yieldMultiplier;
    
    return {
      baseYield,
      predictedYield: Math.round(predictedYield * 100) / 100,
      yieldMultiplier: Math.round(yieldMultiplier * 100) / 100,
      confidence: Math.min(95, Math.max(60, 80 + (yieldMultiplier - 1.0) * 50))
    };
  };

  // const handleChange = (e) => {
  //   setSoilData({
  //     ...soilData,
  //     [e.target.name]: e.target.value,
  //   });
  //   // Clear previous recommendation when form values change
  //   setRecommendation(null);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Use our comprehensive recommendation algorithm
      const recommendations = await getEnhancedRecommendations(
        parseFloat(soilData.ph),
        parseFloat(soilData.moisture),
        parseFloat(soilData.nitrogen),
        parseFloat(soilData.phosphorus),
        parseFloat(soilData.potassium)
      );
      
      setRecommendation(recommendations);
      
      // Optional: Still call backend for additional insights (if available)
      try {
        const response = await fetch("http://localhost:5000/recommend-crop", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(soilData),
        });
        
        if (response.ok) {
          const data = await response.json();
          // You could combine backend data with our algorithm if needed
          console.log("Backend response:", data);
        }
      } catch (backendError) {
        // Backend call failed, but we still have our recommendations
        console.log("Backend unavailable, using local algorithm");
      }
      
    } catch (error) {
      console.error("Error in recommendation algorithm:", error);
      setRecommendation(["⚠️ Error in recommendation system"]);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>{t("cropRecommendation.title")}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            name="ph"
            placeholder={t("cropRecommendation.ph")}
            value={soilData.ph}
            onChange={handleChange}
            required
            className="inputField"
          />
          <input
            type="number"
            name="moisture"
            placeholder={t("cropRecommendation.moisture")}
            value={soilData.moisture}
            onChange={handleChange}
            required
            className="inputField"
          />
          <input
            type="number"
            name="nitrogen"
            placeholder={t("cropRecommendation.nitrogen")}
            value={soilData.nitrogen}
            onChange={handleChange}
            required
            className="inputField"
          />
          <input
            type="number"
            name="phosphorus"
            placeholder={t("cropRecommendation.phosphorus")}
            value={soilData.phosphorus}
            onChange={handleChange}
            required
            className="inputField"
          />
          <input
            type="number"
            name="potassium"
            placeholder={t("cropRecommendation.potassium")}
            value={soilData.potassium}
            onChange={handleChange}
            required
            className="inputField"
          />
          <button type="submit">{t("cropRecommendation.submit")}</button>
        </form>

        {recommendation && (
          <div className="responsecard">
            <h3>{t("cropRecommendation.suggestedTitle")}</h3>
            {Array.isArray(recommendation) ? (
              <div className="crop-recommendations" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '15px',
                marginTop: '20px'
              }}>
                {recommendation.map((crop, index) => (
                  <div key={index} className="crop-item" style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    padding: '15px 20px',
                    borderRadius: '12px',
                    textAlign: 'center',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                  }}>
                    <span className="CropName" style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                    }}>{translateCropName(crop)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p>
                <span className="CropName">{translateCropName(recommendation)}</span>
              </p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default CropRecommendation;

