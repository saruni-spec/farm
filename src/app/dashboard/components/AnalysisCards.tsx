"use client";
import { useEffect, useState } from "react";
import {
  Flame,
  Droplet,
  Sprout,
  CloudSun,
  Sun,
  CloudRain,
  CloudSnow,
} from "lucide-react";
import { toast } from "react-toastify";

const AnalysisCards = () => {
  const iconSize = 24; // Reduced from 32

  const [weather, setWeather] = useState<{
    temperature: number;
    windspeed: number;
    weathercode: number;
  } | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=-1.29&longitude=36.82&current_weather=true"
        );
        const data = await res.json();
        setWeather(data.current_weather);
      } catch (err) {
        toast.error(`Failed to fetch weather: ${err}`);
      }
    };

    fetchWeather();
  }, []);

  const getWeatherIcon = (code: number) => {
    if (code === 0) {
      return <Sun size={iconSize} className="text-yellow-500" />;
    } else if ([1, 2].includes(code)) {
      return <CloudSun size={iconSize} className="text-yellow-400" />;
    } else if (code === 3) {
      return <CloudSun size={iconSize} className="text-gray-500" />;
    } else if ([45, 48].includes(code)) {
      return <CloudSun size={iconSize} className="text-gray-400" />;
    } else if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
      return <CloudRain size={iconSize} className="text-blue-500" />;
    } else if ([71, 73, 75].includes(code)) {
      return <CloudSnow size={iconSize} className="text-blue-300" />;
    } else if (code === 95) {
      return <Flame size={iconSize} className="text-red-500" />;
    }
    return <CloudSun size={iconSize} className="text-yellow-500" />;
  };

  const cropAnalysis = [
    {
      title: "Average crop stress",
      value: "32%",
      color: "red",
      icon: <Flame size={iconSize} className="text-red-600" />,
    },
    {
      title: "Soil Moisture",
      value: "64%",
      color: "blue",
      icon: <Droplet size={iconSize} className="text-blue-600" />,
    },
    {
      title: "Soil Carbon",
      value: "2.8%",
      color: "green",
      icon: <Sprout size={iconSize} className="text-green-600" />,
    },
  ];

  return (
    <div className="flex flex-wrap gap-4 justify-between items-center bg-white px-4 py-3 rounded-lg shadow-sm">
      {cropAnalysis.map((analysis) => (
        <div
          key={analysis.title}
          className="flex items-center space-x-3 min-w-0 flex-shrink-0"
        >
          <div
            className={`p-2 rounded-full bg-${analysis.color}-100 flex-shrink-0`}
          >
            {analysis.icon}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-700 truncate">
              {analysis.title}
            </p>
            <p className={`text-lg font-bold text-${analysis.color}-600`}>
              {analysis.value}
            </p>
          </div>
        </div>
      ))}

      {/* Weather Card */}
      <div className="flex items-center space-x-3 min-w-0 flex-shrink-0">
        <div className="p-2 rounded-full bg-yellow-100 flex-shrink-0">
          {weather ? (
            getWeatherIcon(weather.weathercode)
          ) : (
            <CloudSun size={iconSize} className="text-yellow-500" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-700">Current Weather</p>
          {weather ? (
            <>
              <p className="text-lg font-bold text-blue-600">
                {weather.temperature}°C
              </p>
              <p className="text-xs text-gray-500 truncate">
                Wind speed: {weather.windspeed} km/h
              </p>
            </>
          ) : (
            <p className="text-gray-500 text-sm">Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisCards;
