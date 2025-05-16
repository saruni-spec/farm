import { RefreshCcw } from "lucide-react";

const MapLayers = () => 
{
    const overlayOptions = ["Crop Stress (NDVI)", "Soil Moisture", "Soil Carbon"]
    return (
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Map Layers</h2>

            {/* Base Map */}
            <div>
                <label className="block text-sm font-medium mb-2">Base Map</label>
                <select className="w-full rounded-md border-gray-300 shadow-sm">
                    <option value="satellite">Satellite</option>
                    <option value="topo">Topographic</option>
                    <option value="terrain">Terrain</option>
                    <option value="street">Street Map</option>
                </select>
            </div>

            {/* Overlays */}
            <div>
                <label className="block text-sm font-medium mb-2">Overlay</label>
                <div className="space-y-2">
                {
                    overlayOptions.map(layer => 
                    {
                        return(
                            <div key={layer} className="flex items-center">
                                <input type="radio" name="overlay" value={layer.toLowerCase().replace(/ /g, "-")} className="h-4 w-4 text-blue-600 border-gray-300"/>
                                <label className="ml-2 text-sm text-gray-700">{layer}</label>
                            </div>
                        )
                    })
                }
                </div>
            </div>

            {/* Date Range */}
            <div>
                <label className="block text-sm font-medium mb-2">Date Range</label>
                <div className="flex gap-2">
                    <input type="date" className="w-full rounded-md border-gray-300" />
                    <input type="date" className="w-full rounded-md border-gray-300" />
                </div>
            </div>

            {/* Update Button */}
            <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 mt-2">
                <RefreshCcw size={18}/>
                Update Map
            </button>
        </div>
    );
};

export default MapLayers;
