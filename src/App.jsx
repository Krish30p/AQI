import React, { useState, useEffect } from "react";
import {
  Wind,
  MapPin,
  Droplets,
  Eye,
  AlertCircle,
  Thermometer,
  TrendingUp,
  Search,
  Loader,
} from "lucide-react";

export default function AQIHomePage() {
  const [searchCity, setSearchCity] = useState("");
  const [currentCity, setCurrentCity] = useState("Bhopal");
  const [aqiData, setAqiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAQICategory = (aqi) => {
    if (aqi <= 50)
      return {
        label: "Good",
        color: "bg-green-500",
        gradient: "from-green-400 to-green-600",
        textColor: "text-green-600",
      };
    if (aqi <= 100)
      return {
        label: "Moderate",
        color: "bg-yellow-500",
        gradient: "from-yellow-400 to-yellow-600",
        textColor: "text-yellow-600",
      };
    if (aqi <= 150)
      return {
        label: "Unhealthy for Sensitive",
        color: "bg-orange-500",
        gradient: "from-orange-400 to-orange-600",
        textColor: "text-orange-600",
      };
    if (aqi <= 200)
      return {
        label: "Unhealthy",
        color: "bg-red-500",
        gradient: "from-red-400 to-red-600",
        textColor: "text-red-600",
      };
    if (aqi <= 300)
      return {
        label: "Very Unhealthy",
        color: "bg-purple-500",
        gradient: "from-purple-400 to-purple-600",
        textColor: "text-purple-600",
      };
    return {
      label: "Hazardous",
      color: "bg-rose-900",
      gradient: "from-rose-800 to-rose-900",
      textColor: "text-rose-900",
    };
  };

  const calculateAQI = (data) => {
    if (!data) return 0;

    // 1) Prefer API's own overall AQI if present
    if (typeof data.overall_aqi === "number") {
      return Math.round(data.overall_aqi);
    }

    // 2) Else take maximum of individual pollutant AQIs if present
    const pollutantKeys = ["PM2.5", "PM10", "O3", "NO2", "SO2", "CO"];
    const aqiValues = pollutantKeys.map((key) => data[key]?.aqi ?? 0);
    const maxAQI = Math.max(...aqiValues);
    if (maxAQI > 0) return Math.round(maxAQI);

    // 3) Fallback – approximate from PM2.5 concentration
    const pm25 = data["PM2.5"]?.concentration || 0;

    // Simple AQI estimation based on PM2.5
    let aqi;
    if (pm25 <= 12) aqi = (50 / 12) * pm25;
    else if (pm25 <= 35.4)
      aqi = 50 + ((100 - 50) / (35.4 - 12.1)) * (pm25 - 12.1);
    else if (pm25 <= 55.4)
      aqi = 100 + ((150 - 100) / (55.4 - 35.5)) * (pm25 - 35.5);
    else if (pm25 <= 150.4)
      aqi = 150 + ((200 - 150) / (150.4 - 55.5)) * (pm25 - 55.5);
    else if (pm25 <= 250.4)
      aqi = 200 + ((300 - 200) / (250.4 - 150.5)) * (pm25 - 150.5);
    else aqi = 300 + ((500 - 300) / (500.4 - 250.5)) * (pm25 - 250.5);

    return Math.round(Math.max(aqi, 0));
  };

  const getPollutantCategory = (concentration, pollutant) => {
    // Simplified categories based on typical thresholds
    if (pollutant === "PM2") {
      if (concentration <= 12) return "Good";
      if (concentration <= 35.4) return "Moderate";
      if (concentration <= 55.4) return "Unhealthy for Sensitive";
      return "Unhealthy";
    }
    if (pollutant === "PM10") {
      if (concentration <= 54) return "Good";
      if (concentration <= 154) return "Moderate";
      return "Unhealthy for Sensitive";
    }
    return "Moderate";
  };

  const getHealthRecommendation = (aqi) => {
    if (aqi <= 50)
      return "Air quality is good. It's a great day for outdoor activities!";
    if (aqi <= 100)
      return "Air quality is acceptable. Sensitive individuals should consider reducing prolonged outdoor activities.";
    if (aqi <= 150)
      return "Members of sensitive groups may experience health effects. The general public is less likely to be affected.";
    if (aqi <= 200)
      return "Everyone may begin to experience health effects. Members of sensitive groups may experience more serious effects.";
    if (aqi <= 300)
      return "Health alert: everyone may experience more serious health effects. Avoid outdoor activities.";
    return "Health warnings of emergency conditions. Everyone should avoid all outdoor activities.";
  };

  const fetchAQI = async (city) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `https://api.api-ninjas.com/v1/airquality?city=${city}`,
        {
          headers: { "X-Api-Key": import.meta.env.VITE_API_NINJA_KEY },
        }
      );

      if (!res.ok) throw new Error("City not found or API error");

      const data = await res.json();
      setAqiData(data);
      setCurrentCity(city);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAQI("Bhopal");
  }, []);

  const handleSearch = () => {
    if (searchCity.trim()) {
      fetchAQI(searchCity.trim());
      setSearchCity("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const currentAQI = aqiData ? calculateAQI(aqiData) : 0;
  const category = getAQICategory(currentAQI);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 py-5 px-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-5 text-center">
        <h1 className="text-5xl font-bold text-gray-100 mb-5 flex items-center justify-center gap-3">
          <Wind className="w-12 h-12 text-blue-400" />
          Air Quality Index
        </h1>
        <p className="text-gray-300 text-lg">
          Real-time air quality data for cities worldwide
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-12 relative">
        <input
          type="text"
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search for a city..."
          className="w-full px-6 py-4 pr-14 rounded-2xl shadow-xl text-lg focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all bg-gray-800 text-gray-100 placeholder-gray-400"
          disabled={loading}
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-colors disabled:opacity-50"
        >
          {loading ? (
            <Loader className="w-6 h-6 animate-spin" />
          ) : (
            <Search className="w-6 h-6" />
          )}
        </button>
      </div>

      {error && (
        <div className="max-w-2xl mx-auto mb-8 bg-red-900 border border-red-700 text-red-100 px-6 py-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-6 h-6 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {aqiData && !loading && (
        <>
          {/* Main AQI Display Card */}
          <div className="max-w-4xl mx-auto mb-12">
            <div
              className={`bg-gradient-to-br ${category.gradient} rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>

              {/* Location */}
              <div className="relative flex items-center gap-2 mb-8">
                <MapPin className="w-6 h-6" />
                <span className="text-xl font-semibold">{currentCity}</span>
              </div>

              {/* Main AQI Number */}
              <div className="relative text-center mb-8">
                <div className="text-8xl font-bold mb-4">{currentAQI}</div>
                <div className="text-2xl font-semibold uppercase tracking-wider">
                  {category.label}
                </div>
              </div>

              {/* Health Recommendation */}
              <div className="relative bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-2 text-gray-100">
                      Health Recommendation
                    </h3>
                    <p className="text-gray-200 leading-relaxed">
                      {getHealthRecommendation(currentAQI)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pollutants Overview */}
          <div className="max-w-6xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-100 mb-6 flex items-center gap-3">
              <Thermometer className="w-8 h-8 text-blue-400" />
              Pollutants Breakdown
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(aqiData).map(([pollutant, data]) => {
                if (!data || typeof data !== "object" || !data.concentration)
                  return null;
                const categoryLabel = getPollutantCategory(
                  data.concentration,
                  pollutant
                );
                return (
                  <div
                    key={pollutant}
                    className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-100">
                        {pollutant}
                      </h3>
                      <Wind className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="text-4xl font-bold text-blue-400 mb-2">
                      {data.concentration.toFixed(1)}
                      <span className="text-lg text-gray-400 ml-2">μg/m³</span>
                    </div>
                    <div className="text-gray-400 text-sm">{categoryLabel}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Additional Info */}
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 mb-3 gap-6">
            <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700">
              <h3 className="text-xl font-bold text-gray-100 mb-3 flex items-center gap-2">
                <Eye className="w-6 h-6 text-blue-400" />
                About AQI
              </h3>
              <p className="text-gray-300 leading-relaxed">
                The Air Quality Index (AQI) is calculated based on major air
                pollutants. Lower values indicate better air quality, while
                higher values indicate worse conditions.
              </p>
            </div>
            <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700">
              <h3 className="text-xl font-bold text-gray-100 mb-3 flex items-center gap-2">
                <Droplets className="w-6 h-6 text-blue-400" />
                Stay Protected
              </h3>
              <p className="text-gray-300  leading-relaxed">
                Monitor air quality regularly and adjust outdoor activities
                accordingly. Consider wearing masks during high pollution days.
              </p>
            </div>
            
          </div><h1 className="text-gray-300 text-right pr-9  ">
              Made by{" "}
              <a
                href="https://github.com/Krish30p"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:underline"
              >
                Krishna
              </a>
            </h1>
        </>
      )}
    </div>
  );
}
