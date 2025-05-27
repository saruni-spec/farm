"use client"

import { useState } from 'react'

import AnalysisCards from "./components/Analysis Cards";
import ManagementZones from "./components/Management Zones";
import Map from "./components/Map";
import MapLayers from "./components/Map Layers";

const Dashboard = () => 
{
    //Position coordinates to be updated when the locations are selected. Defaulting it to Nairobi county
    const [lat, setLat] = useState<number>(-1.286389);
    const [long, setLong] = useState<number>(36.817223)

    //State to disable the county, sub-county and ward dropdowns when the field is being segmented
    const [segmenting, setIsSegmenting] = useState(false)

    return ( 
        <div className="py-22 px-3 text-black">
            <AnalysisCards/>
            <div className="flex flex-col lg:flex-row gap-3 mt-3">
                <div className="lg:w-2/3">
                    <Map lat={lat} long={long} segmenting={segmenting} setIsSegmenting={setIsSegmenting}/>
                </div>
                <div className="lg:w-1/3 space-y-4">
                    <MapLayers setLat={setLat} setLong={setLong} segmenting={segmenting} />
                    <ManagementZones/>
                </div>
            </div>
        </div>
     );
}
 
export default Dashboard;