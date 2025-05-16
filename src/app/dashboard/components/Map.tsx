import { Expand } from "lucide-react";

const Map = () => 
{
    return (
        <div className="bg-white rounded-lg shadow p-6 h-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Field Map</h2>
                <button className="p-2 rounded-md hover:bg-gray-100 text-gray-600">
                    <Expand/>
                </button>
            </div>
            <div id="map-container" className="relative h-[500px] rounded-md bg-gray-200 overflow-hidden">
                {/* You would mount Leaflet here in useEffect if needed */}
                <div id="map" className="absolute inset-0" />
            </div>
        </div>
    );
};

export default Map;
