import React, { useState, useEffect } from 'react';
import { Wind, MapPin, Droplets, Eye, AlertCircle, Thermometer, TrendingUp, Search, Loader } from 'lucide-react';

export default function AQIHomePage() {
  const [searchCity, setSearchCity] = useState('');
  const [currentCity, setCurrentCity] = useState('Bhopal');
  const [aqiData, setAqiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAQICategory = (aqi) => {
    if (aqi <= 50) return { label: 'Good', color: 'bg-green-500', gradient: 'from-green-400 to-green-600', textColor: 'text-green-600' };
    if (aqi <= 100) return { label: 'Moderate', color: 'bg-yellow-500', gradient: 'from-yellow-400 to-yellow-600', textColor: 'text-yellow-600' };
    if (aqi <= 150) return { label: 'Unhealthy for Sensitive', color: 'bg-orange-500', gradient: 'from-orange-400 to-orange-600', textColor: 'text-orange-600' };
    if (aqi <= 200) return { label: 'Unhealthy', color: 'bg-red-500', gradient: 'from-red-400 to-red-600', textColor: 'text-red-600' };
    if (aqi <= 300) return { label: 'Very Unhealthy', color: 'bg-purple-500', gradient: 'from-purple-400 to-purple-600', textColor: 'text-purple-600' };
    return { label: 'Hazardous', color: 'bg-rose-900', gradient: 'from-rose-800 to-rose-900', textColor: 'text-rose-900' };
  };

  const calculateAQI = (data) => {
    // US EPA AQI calculation - simplified
    const pm25 = data.PM2?.concentration || 0;
    const pm10 = data.PM10?.concentration || 0;
    
    // Simple AQI estimation based on PM2.5
    let aqi;
    if (pm25 <= 12) aqi = (50 / 12) * pm25;
    else if (pm25 <= 35.4) aqi = 50 + ((100 - 50) / (35.4 - 12.1)) * (pm25 - 12.1);
    else if (pm25 <= 55.4) aqi = 100 + ((150 - 100) / (55.4 - 35.5)) * (pm25 - 35.5);
    else if (pm25 <= 150.4) aqi = 150 + ((200 - 150) / (150.4 - 55.5)) * (pm25 - 55.5);
    else if (pm25 <= 250.4) aqi = 200 + ((300 - 200) / (250.4 - 150.5)) * (pm25 - 150.5);
    else aqi = 300 + ((500 - 300) / (500.4 - 250.5)) * (pm25 - 250.5);

    return Math.round(Math.max(aqi, 0));
  };

  const getPollutantCategory = (concentration, pollutant) => {
    // Simplified categories based on typical thresholds
    if (pollutant === 'PM2') {
      if (concentration <= 12) return 'Good';
      if (concentration <= 35.4) return 'Moderate';
      if (concentration <= 55.4) return 'Unhealthy for Sensitive';
      return 'Unhealthy';
    }
    if (pollutant === 'PM10') {
      if (concentration <= 54) return 'Good';
      if (concentration <= 154) return 'Moderate';
      return 'Unhealthy for Sensitive';
    }
    return 'Moderate';
  };

  const getHealthRecommendation = (aqi) => {
    if (aqi <= 50) return 'Air quality is good. It\'s a great day for outdoor activities!';
    if (aqi <= 100) return 'Air quality is acceptable. Sensitive individuals should consider reducing prolonged outdoor activities.';
    if (aqi <= 150) return 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.';
    if (aqi <= 200) return 'Everyone may begin to experience health effects. Members of sensitive groups may experience more serious effects.';
    if (aqi <= 300) return 'Health alert: everyone may experience more serious health effects. Avoid outdoor activities.';
    return 'Health warnings of emergency conditions. Everyone should avoid all outdoor activities.';
  };

  const fetchAQI = async (city) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://api.api-ninjas.com/v1/airquality?city=${city}`, {
        headers: { 'X-Api-Key': import.meta.env.VITE_API_NINJA_KEY }
      });
      
      if (!res.ok) throw new Error('City not found or API error');
      
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
    fetchAQI('Bhopal');
  }, []);

  const handleSearch = () => {
    if (searchCity.trim()) {
      fetchAQI(searchCity.trim());
      setSearchCity('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const currentAQI = aqiData ? calculateAQI(aqiData) : 0;
  const category = getAQICategory(currentAQI);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Wind className="w-12 h-12 text-blue-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Air Quality Monitor
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Real-time air quality data for cities worldwide</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative">
          <input
            type="text"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for a city..."
            className="w-full px-6 py-4 pr-14 rounded-2xl shadow-xl text-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all bg-white"
            disabled={loading}
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white p-3 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            {loading ? <Loader className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6" />}
          </button>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {aqiData && !loading && (
          <>
            {/* Main AQI Display Card */}
            <div className={`bg-gradient-to-br ${category.gradient} rounded-3xl shadow-2xl p-8 text-white transform hover:scale-[1.02] transition-all`}>
              <div className="space-y-6">
                {/* Location */}
                <div className="flex items-center gap-2 text-white/90">
                  <MapPin className="w-5 h-5" />
                  <span className="text-xl font-medium">{currentCity}</span>
                </div>

                {/* Main AQI Number */}
                <div className="text-center py-8">
                  <div className="text-8xl font-bold mb-2">{currentAQI}</div>
                  <div className="text-3xl font-semibold tracking-wide">{category.label}</div>
                </div>

                {/* Health Recommendation */}
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-xl mb-2">Health Recommendation</h3>
                      <p className="text-white/90 leading-relaxed">{getHealthRecommendation(currentAQI)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pollutants Overview */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-blue-600" />
                Pollutants Breakdown
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(aqiData).map(([pollutant, data]) => {
                  if (!data || typeof data !== 'object' || !data.concentration) return null;
                  const categoryLabel = getPollutantCategory(data.concentration, pollutant);
                  
                  return (
                    <div key={pollutant} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                      <div className="text-gray-600 text-sm font-medium mb-2">{pollutant}</div>
                      <div className="text-3xl font-bold text-gray-800 mb-1">
                        {data.concentration.toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-500 mb-3">μg/m³</div>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        categoryLabel === 'Good' ? 'bg-green-100 text-green-700' : 
                        categoryLabel === 'Moderate' ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {categoryLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="w-8 h-8" />
                  <h3 className="text-2xl font-bold">About AQI</h3>
                </div>
                <p className="text-blue-50 leading-relaxed">
                  The Air Quality Index (AQI) is calculated based on major air pollutants. 
                  Lower values indicate better air quality, while higher values indicate worse conditions.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <Droplets className="w-8 h-8" />
                  <h3 className="text-2xl font-bold">Stay Protected</h3>
                </div>
                <p className="text-purple-50 leading-relaxed">
                  Monitor air quality regularly and adjust outdoor activities accordingly. 
                  Consider wearing masks during high pollution days.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}