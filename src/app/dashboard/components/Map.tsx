"use client"

import { Expand } from "lucide-react";

import dynamic from 'next/dynamic'
const MapLeaflet = dynamic(() => import('./Map Functionality/Map Leaflet'), { ssr: false })

const Map = ({ lat = -1.286389, long = 36.817223, height= 500 }: { lat: number; long: number; height?: number }) => 
{

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Field Map</h2>
                <button className="p-2 rounded-md hover:bg-gray-100 text-gray-600">
                    <Expand/>
                </button>
            </div>
            <MapLeaflet lat={lat} long={long} height={height}/>
        </div>
    );
};

export default Map;