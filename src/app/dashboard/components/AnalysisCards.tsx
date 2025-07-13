"use client"
import { useEffect, useState } from "react"
import { Flame, Droplet, Sprout, CloudSun, Sun, CloudRain, CloudSnow } from "lucide-react"
import { toast } from "react-toastify"

const AnalysisCards = () => 
{
    const iconSize = 32

    const [weather, setWeather] = useState<
    {
        temperature: number,
        windspeed: number,
        weathercode: number
    } | null>(null)

    useEffect(() => 
    {
        const fetchWeather = async () => 
        {
            try 
            {
                const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=-1.29&longitude=36.82&current_weather=true")
                const data = await res.json()
                setWeather(data.current_weather)
            } 
            catch (err) 
            {
                toast.error(`Failed to fetch weather: ${err}`)
            }
        }

        fetchWeather()
    }, [])

    // Function to get icon based on weathercode from Open Meteo:
    // https://open-meteo.com/en/docs#latitude=52.52&longitude=13.41&current_weather=true
    // Weather codes summary (common):
    // 0 = Clear sky
    // 1, 2, 3 = Mainly clear, partly cloudy, and overcast
    // 45, 48 = Fog and depositing rime fog
    // 51, 53, 55 = Drizzle
    // 61, 63, 65 = Rain
    // 71, 73, 75 = Snow fall
    // 80, 81, 82 = Rain showers
    // 95 = Thunderstorm

    const getWeatherIcon = (code: number) => 
    {
        if (code === 0) 
        {
            return <Sun size={iconSize} className="text-yellow-500" />
        } 
        else if ([1, 2].includes(code)) 
        {
            return <CloudSun size={iconSize} className="text-yellow-400" />
        } 
        else if (code === 3) 
        {
            return <CloudSun size={iconSize} className="text-gray-500" /> // Overcast
        } 
        else if ([45, 48].includes(code)) 
        {
            return <CloudSun size={iconSize} className="text-gray-400" /> // Fog
        } 
        else if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) 
        {
            return <CloudRain size={iconSize} className="text-blue-500" />
        } 
        else if ([71, 73, 75].includes(code)) 
        {
            return <CloudSnow size={iconSize} className="text-blue-300" />
        } 
        else if (code === 95) 
        {
            return <Flame size={iconSize} className="text-red-500" /> // Thunderstorm
        }
        return <CloudSun size={iconSize} className="text-yellow-500" /> // fallback
    }


    const cropAnalysis = [
        {
            title: "Average crop stress",
            value: "32%",
            progress: 32,
            color: "red",
            icon: (color: string) => <Flame size={iconSize} className={`text-${color}-600`} />,
        },
        {
            title: "Soil Moisture",
            value: "64%",
            progress: 64,
            color: "blue",
            icon: (color: string) => <Droplet size={iconSize} className={`text-${color}-600`} />,
        },
        {
            title: "Soil Carbon",
            value: "2.8%",
            progress: 28,
            color: "green",
            icon: (color: string) => <Sprout size={iconSize} className={`text-${color}-600`} />,
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {
                cropAnalysis.map((analysis) => 
                (
                    <div key={analysis.title} className="bg-white p-6 rounded-lg shadow-md text-left">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-black">{analysis.title}</p>
                                <p className={`text-2xl font-bold text-blue-500`}>{analysis.value}</p>
                                </div>
                                <div className={`p-3 rounded-full bg-${analysis.color}-100`}>
                                {analysis.icon(analysis.color)}
                            </div>
                        </div>
                        <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className={`h-2.5 rounded-full bg-${analysis.color}-600`} style={{ width: `${analysis.progress}%` }}/>
                            </div>
                        </div>
                    </div>
                ))
            }

            {/* Weather Card */}
            <div className="bg-white p-6 rounded-lg shadow-md text-left">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-black">Current Weather</p>
                        {
                            weather 
                            ? 
                                <>
                                    <p className="text-xl font-bold text-blue-500">{weather.temperature}°C</p>
                                    <p className="text-sm text-gray-600">Wind speed: {weather.windspeed} km/h</p>
                                </>
                            
                            : 
                                <p className="text-gray-500 text-sm">Loading...</p>
                        }
                    </div>
                    <div className="p-3 rounded-full bg-yellow-100">
                        {
                            weather 
                            ? 
                                getWeatherIcon(weather.weathercode) 
                            : 
                                <CloudSun size={iconSize} className="text-yellow-500" />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AnalysisCards
