import React, { useState } from 'react';
import { Wind, MapPin, Droplets, Eye, AlertCircle, Thermometer, TrendingUp, Search } from 'lucide-react';

export default function AQIHomePage() {
  const [searchCity, setSearchCity] = useState('');
  
  // Sample data for the home page
  const currentAQI = 87;
  const city = "Bhopal";
  
  const getAQICategory = (aqi) => {
    if (aqi <= 50) return { label: 'Good', color: 'bg-green-500', gradient: 'from-green-400 to-green-600' };
    if (aqi <= 100) return { label: 'Moderate', color: 'bg-yellow-500', gradient: 'from-yellow-400 to-yellow-600' };
    if (aqi <= 150) return { label: 'Unhealthy for Sensitive', color: 'bg-orange-500', gradient: 'from-orange-400 to-orange-600' };
    if (aqi <= 200) return { label: 'Unhealthy', color: 'bg-red-500', gradient: 'from-red-400 to-red-600' };
    if (aqi <= 300) return { label: 'Very Unhealthy', color: 'bg-purple-500', gradient: 'from-purple-400 to-purple-600' };
    return { label: 'Hazardous', color: 'bg-rose-900', gradient: 'from-rose-800 to-rose-900' };
  };

  const category = getAQICategory(currentAQI);

  const API_KEY = import.meta.env.VITE_API_NINJA_KEY;

async function getAqi(city) {
  const res = await fetch(`https://api.api-ninjas.com/v1/airquality?city=${city}`, {
    headers: {
      'X-Api-Key': API_KEY
    }
  });

  const data = await res.json();
  return data;
}


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-400 to-cyan-400 p-6 md:p-3">
      <div className="max-w-8xl mx-5">
        
        {/* Header */}
        <div className="text-white mb-6">
          <h1 className="text-3xl md:text-5xl font-bold mb-2">Air Quality</h1>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input 
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              placeholder="Search for a city..."
              className="w-full px-6 py-4 pr-14 rounded-2xl shadow-xl text-lg focus:outline-none focus:ring-4 focus:ring-white/50 transition-all bg-white"
            />
            <button
              onClick={() => console.log('Search:', searchCity)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg"
            >
              <Search size={24} />
            </button>
          </div>
        </div>

        {/* Main AQI Display Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-10 mb-6">
          
          {/* Location */}
          <div className="flex items-center gap-2 text-gray-600 mb-6">
            <MapPin size={22} className="text-blue-500" />
            <span className="text-xl font-medium">{city}</span>
          </div>

          {/* Main AQI Number */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} blur-3xl opacity-30 rounded-full`}></div>
              <div className="relative text-9xl md:text-[12rem] font-black text-gray-800 leading-none">
                {currentAQI}
              </div>
            </div>
            <div className="mt-4">
              <span className={`inline-block px-8 py-3 rounded-full ${category.color} text-white font-bold text-2xl shadow-lg`}>
                {category.label}
              </span>
            </div>
          </div>

          {/* Health Recommendation */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex items-start gap-4">
              <div className="bg-blue-500 rounded-full p-3">
                <AlertCircle className="text-white" size={28} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">Health Recommendation</h3>
                <p className="text-gray-700 leading-relaxed">
                  Air quality is acceptable. Sensitive individuals should consider reducing prolonged outdoor activities.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pollutants Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-purple-100 rounded-lg p-2">
                <Wind size={24} className="text-purple-600" />
              </div>
              <span className="text-gray-600 font-medium">PM2.5</span>
            </div>
            <div className="text-4xl font-bold text-gray-800 mb-1">42.3</div>
            <div className="text-sm text-gray-500">μg/m³</div>
            <div className="mt-2 flex items-center gap-1 text-green-600 text-sm">
              <TrendingUp size={16} />
              <span>Good</span>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-orange-100 rounded-lg p-2">
                <Wind size={24} className="text-orange-600" />
              </div>
              <span className="text-gray-600 font-medium">PM10</span>
            </div>
            <div className="text-4xl font-bold text-gray-800 mb-1">78.5</div>
            <div className="text-sm text-gray-500">μg/m³</div>
            <div className="mt-2 flex items-center gap-1 text-yellow-600 text-sm">
              <TrendingUp size={16} />
              <span>Moderate</span>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-100 rounded-lg p-2">
                <Eye size={24} className="text-blue-600" />
              </div>
              <span className="text-gray-600 font-medium">O₃</span>
            </div>
            <div className="text-4xl font-bold text-gray-800 mb-1">34.2</div>
            <div className="text-sm text-gray-500">μg/m³</div>
            <div className="mt-2 flex items-center gap-1 text-green-600 text-sm">
              <TrendingUp size={16} />
              <span>Good</span>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-red-100 rounded-lg p-2">
                <AlertCircle size={24} className="text-red-600" />
              </div>
              <span className="text-gray-600 font-medium">NO₂</span>
            </div>
            <div className="text-4xl font-bold text-gray-800 mb-1">28.7</div>
            <div className="text-sm text-gray-500">μg/m³</div>
            <div className="mt-2 flex items-center gap-1 text-green-600 text-sm">
              <TrendingUp size={16} />
              <span>Good</span>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-teal-100 rounded-lg p-2">
                <Droplets size={24} className="text-teal-600" />
              </div>
              <span className="text-gray-600 font-medium">SO₂</span>
            </div>
            <div className="text-4xl font-bold text-gray-800 mb-1">12.4</div>
            <div className="text-sm text-gray-500">μg/m³</div>
            <div className="mt-2 flex items-center gap-1 text-green-600 text-sm">
              <TrendingUp size={16} />
              <span>Good</span>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-gray-100 rounded-lg p-2">
                <Wind size={24} className="text-gray-600" />
              </div>
              <span className="text-gray-600 font-medium">CO</span>
            </div>
            <div className="text-4xl font-bold text-gray-800 mb-1">456</div>
            <div className="text-sm text-gray-500">μg/m³</div>
            <div className="mt-2 flex items-center gap-1 text-green-600 text-sm">
              <TrendingUp size={16} />
              <span>Good</span>
            </div>
          </div>
        </div>

        {/* Weather Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-orange-100 rounded-lg p-2">
                <Thermometer size={24} className="text-orange-600" />
              </div>
              <span className="text-gray-600 font-medium">Temperature</span>
            </div>
            <div className="text-5xl font-bold text-gray-800">28°C</div>
            <p className="text-gray-500 text-sm mt-1">Feels like 30°C</p>
          </div>

          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-cyan-100 rounded-lg p-2">
                <Droplets size={24} className="text-cyan-600" />
              </div>
              <span className="text-gray-600 font-medium">Humidity</span>
            </div>
            <div className="text-5xl font-bold text-gray-800">65%</div>
            <p className="text-gray-500 text-sm mt-1">Comfortable level</p>
          </div>
        </div>

      </div>
    </div>
  );
}