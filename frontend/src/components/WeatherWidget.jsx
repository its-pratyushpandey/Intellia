import React, { useState, useEffect } from 'react';
import { 
  WiDaySunny, 
  WiCloudy, 
  WiRain, 
  WiSnow, 
  WiThunderstorm,
  WiHumidity,
  WiStrongWind,
  WiBarometer,
  WiThermometer,
  WiSunrise,
  WiSunset
} from 'react-icons/wi';
import { MdLocationOn, MdRefresh } from 'react-icons/md';
import { FiEye, FiDroplet } from 'react-icons/fi';

const WeatherWidget = ({ isMinimized = false }) => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('New York');
  const [error, setError] = useState(null);

  
  // Mock weather data for demonstration
  const mockWeatherData = {
    current: {
      temperature: 72,
      condition: 'sunny',
      description: 'Sunny',
      humidity: 45,
      windSpeed: 8,
      pressure: 1013,
      visibility: 10,
      uvIndex: 6,
      feelsLike: 75,
      sunrise: '06:30',
      sunset: '19:45'
    },
    forecast: [
      { day: 'Today', temp: { high: 75, low: 62 }, condition: 'sunny', precipitation: 0 },
      { day: 'Tomorrow', temp: { high: 73, low: 59 }, condition: 'cloudy', precipitation: 20 },
      { day: 'Wed', temp: { high: 69, low: 55 }, condition: 'rain', precipitation: 80 },
      { day: 'Thu', temp: { high: 71, low: 58 }, condition: 'cloudy', precipitation: 30 },
      { day: 'Fri', temp: { high: 76, low: 63 }, condition: 'sunny', precipitation: 5 }
    ]
  };

  useEffect(() => {
    fetchWeatherData();
  }, [location]);

  const fetchWeatherData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setWeather(mockWeatherData.current);
        setForecast(mockWeatherData.forecast);
        setLoading(false);
        setError(null);
      }, 1000);
    } catch (err) {
      setError('Failed to fetch weather data');
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition) => {
    const iconClass = "w-8 h-8 text-blue-400";
    switch (condition) {
      case 'sunny': return <WiDaySunny className={`${iconClass} text-yellow-400`} />;
      case 'cloudy': return <WiCloudy className={iconClass} />;
      case 'rain': return <WiRain className={`${iconClass} text-blue-500`} />;
      case 'snow': return <WiSnow className={iconClass} />;
      case 'thunderstorm': return <WiThunderstorm className={`${iconClass} text-purple-500`} />;
      default: return <WiDaySunny className={iconClass} />;
    }
  };

  if (loading) {
    return (
      <div className="weather-widget bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 bg-white/20 rounded w-32"></div>
          <div className="h-8 w-8 bg-white/20 rounded-full"></div>
        </div>
        <div className="space-y-3">
          <div className="h-12 bg-white/20 rounded"></div>
          <div className="h-4 bg-white/20 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-widget bg-red-500/20 backdrop-blur-md rounded-2xl p-6 border border-red-500/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Weather Error</h3>
          <button onClick={fetchWeatherData} className="text-white hover:text-red-400">
            <MdRefresh className="w-5 h-5" />
          </button>
        </div>
        <p className="text-red-200">{error}</p>
      </div>
    );
  }

  if (isMinimized) {
    return (
      <div className="weather-widget-mini bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getWeatherIcon(weather.condition)}
            <div>
              <div className="text-white font-bold text-lg">{weather.temperature}°</div>
              <div className="text-gray-300 text-sm">{location}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-white text-sm">{weather.description}</div>
            <div className="text-gray-400 text-xs">H:{forecast[0]?.temp.high}° L:{forecast[0]?.temp.low}°</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="weather-widget bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MdLocationOn className="text-blue-400 w-5 h-5" />
          <h3 className="text-white font-semibold text-lg">{location}</h3>
        </div>
        <button 
          onClick={fetchWeatherData}
          className="text-white hover:text-blue-400 transition-colors p-2 hover:bg-white/10 rounded-full"
        >
          <MdRefresh className="w-5 h-5" />
        </button>
      </div>

      {/* Current Weather */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
            {getWeatherIcon(weather.condition)}
            <div>
              <div className="text-white text-4xl font-bold">{weather.temperature}°F</div>
              <div className="text-gray-300">{weather.description}</div>
            </div>
          </div>
          <div className="text-gray-400 text-sm">
            Feels like {weather.feelsLike}°F
          </div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <WiHumidity className="text-blue-400 w-5 h-5" />
              <span className="text-gray-300 text-sm">Humidity</span>
            </div>
            <div className="text-white font-semibold">{weather.humidity}%</div>
          </div>
          
          <div className="bg-white/5 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <WiStrongWind className="text-green-400 w-5 h-5" />
              <span className="text-gray-300 text-sm">Wind</span>
            </div>
            <div className="text-white font-semibold">{weather.windSpeed} mph</div>
          </div>
          
          <div className="bg-white/5 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <WiBarometer className="text-purple-400 w-5 h-5" />
              <span className="text-gray-300 text-sm">Pressure</span>
            </div>
            <div className="text-white font-semibold">{weather.pressure} hPa</div>
          </div>
          
          <div className="bg-white/5 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <FiEye className="text-yellow-400 w-4 h-4" />
              <span className="text-gray-300 text-sm">Visibility</span>
            </div>
            <div className="text-white font-semibold">{weather.visibility} km</div>
          </div>
        </div>
      </div>

      {/* Sun Times */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <WiSunrise className="text-orange-400 w-6 h-6" />
            <span className="text-gray-300 text-sm">Sunrise</span>
          </div>
          <div className="text-white font-semibold">{weather.sunrise}</div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-600/20 to-red-500/20 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <WiSunset className="text-orange-500 w-6 h-6" />
            <span className="text-gray-300 text-sm">Sunset</span>
          </div>
          <div className="text-white font-semibold">{weather.sunset}</div>
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div>
        <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
          <WiThermometer className="w-5 h-5 text-blue-400" />
          5-Day Forecast
        </h4>
        <div className="space-y-3">
          {forecast.map((day, index) => (
            <div key={index} className="flex items-center justify-between bg-white/5 rounded-xl p-3 hover:bg-white/10 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-8">
                  {getWeatherIcon(day.condition)}
                </div>
                <div>
                  <div className="text-white font-medium">{day.day}</div>
                  <div className="text-gray-400 text-sm flex items-center gap-1">
                    <FiDroplet className="w-3 h-3" />
                    {day.precipitation}%
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-semibold">
                  {day.temp.high}°<span className="text-gray-400 ml-1">{day.temp.low}°</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .weather-widget {
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
        
        .weather-widget:hover {
          transform: translateY(-2px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
};

export default WeatherWidget;
