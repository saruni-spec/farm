"use client"

import { SunIcon, Cloud, CloudRain, Sunrise, Sunset, CircleGauge, RefreshCwIcon, LocateFixed, Calendar, MapPin,Moon } from "lucide-react";
import { TbWindsock } from "react-icons/tb";

import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"

const WeatherDashboard = () => 
{
    return (
        <div className="flex items-center justify-center p-4">
            <div className="w-4/5">
                <h1 className="text-center font-bold text-3xl mb-3">Weather Insights</h1>
        
                {/* Search Section */}
                <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-2">
                    <input type="text" disabled value="🌤 Weather" className="bg-gray-100 px-4 py-2 rounded-md text-sm font-semibold w-full md:w-40"/>
                    <input type="search" placeholder="Search city" className="border px-4 py-2 rounded-md w-full md:w-96"/>
                    <LocateFixed size={24} onClick={()=> alert("Location button clicked")}/>
                    <Moon size={24} onClick={()=> alert("Visibility button clicked")}/>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition flex flex-row gap-2 items-center"><RefreshCwIcon size={16}/>Refresh</button>
                </div>

                {/* Today Overview Section */}
                <h2 className="text-xl font-semibold mt-2 mb-4">Today Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                    {/* Main Weather Card */}
                    <div className="bg-white border-2 space-y-4 rounded-md px-6 py-3">
                        <p>
                            <SunIcon size={40}/>
                        </p>
                        <p className="text-2xl font-bold">28°C</p>
                        <p className="text-gray-500">Sunny</p>
                        <hr className="border-2"/>
                        <p className="mt-2 text-md flex flex-row gap-2 items-center"><MapPin size={16}/> Nairobi, Kenya</p>
                        <p className="text-md flex flex-row gap-2 items-center"><Calendar size={16}/> 2025-04-23 12:45 PM</p>
                    </div>

                    {/* Weather Details */}
                    <div className="grid md:grid-cols-2 gap-2">
                        <div className="bg-white p-4 rounded-lg text-sm flex items-center gap-3">
                            <TbWindsock size={28} />
                            <div>
                                <p className="font-semibold">Wind Speed</p>
                                <p className="font-bold">15 km/h</p>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg text-sm flex items-center gap-3">
                            <CloudRain size={28} />
                            <div>
                            <p className="font-semibold">Humidity</p>
                            <p className="font-bold">60%</p>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg text-sm flex items-center gap-3">
                            <CircleGauge size={28} />
                            <div>
                            <p className="font-semibold">Pressure</p>
                            <p className="font-bold">1013 hPa</p>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg text-sm flex items-center gap-3">
                            <Cloud size={28} />
                            <div>
                            <p className="font-semibold">Visibility</p>
                            <p className="font-bold">10 km</p>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg text-sm flex items-center gap-3">
                            <Sunrise size={28} />
                            <div>
                            <p className="font-semibold">Sunrise</p>
                            <p className="font-bold">6:12 AM</p>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg text-sm flex items-center gap-3">
                            <Sunset size={28} />
                            <div>
                            <p className="font-semibold">Sunset</p>
                            <p className="font-bold">6:58 PM</p>
                            </div>
                        </div>
                        </div>

                    {/* Timeline Card */}
                    <div className="bg-white p-4 border-2 rounded-md">
                        <ul className="text-sm space-y-2">
                            <li className="text-center text-gray-400">Hourly forecast coming soon...</li>
                        </ul>
                    </div>

                    {/* Next 5 days section */}
                    <div>
                        <h2 className="text-xl font-semibold mb-3">Next 5 Days</h2>
                        <Tabs defaultValue="all" className="w-full">
                            <TabsList className="flex justify-start gap-2 bg-blue-50 p-2">
                                <TabsTrigger value="all" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white p-4 rounded-md text-sm font-medium transition hover:bg-blue-100">All days</TabsTrigger>
                                <TabsTrigger value="1" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white p-4 rounded-md text-sm font-medium transition hover:bg-blue-100">1st day</TabsTrigger>
                                <TabsTrigger value="2" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white p-4 rounded-md text-sm font-medium transition hover:bg-blue-100">2nd day</TabsTrigger>
                                <TabsTrigger value="3" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white p-4 rounded-md text-sm font-medium transition hover:bg-blue-100">3rd day</TabsTrigger>
                                <TabsTrigger value="4" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white p-4 rounded-md text-sm font-medium transition hover:bg-blue-100">4th day</TabsTrigger>
                                <TabsTrigger value="5" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white p-4 rounded-md text-sm font-medium transition hover:bg-blue-100">5th day</TabsTrigger>
                            </TabsList>
                            
                            {/* Example tab content */}
                            <TabsContent value="all" className="bg-white p-4 ">
                                <p>Weather data for all days will go here.</p>
                            </TabsContent>
                            <TabsContent value="1" className="bg-white p-4">
                                <p>Forecast for day 1</p>
                            </TabsContent>
                            <TabsContent value="2" className="bg-white p-4">
                                <p>Forecast for day 2</p>
                            </TabsContent>
                            <TabsContent value="3" className="bg-white p-4">
                                <p>Forecast for day 3</p>
                            </TabsContent>
                            <TabsContent value="4" className="bg-white p-4 ">
                                <p>Forecast for day 4</p>
                            </TabsContent>
                            <TabsContent value="5" className="bg-white p-4">
                                <p>Forecast for day 5</p>
                            </TabsContent>
                        </Tabs>
                    </div>

                </div>
            </div>
        </div>
    );
  };
  
  export default WeatherDashboard;
  