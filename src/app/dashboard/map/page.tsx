"use client";
import { useState } from "react";
import {
  Plus,
  Minus,
  Layers,
  Info,
  Maximize2,
  Search,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

export default function FarmMapping() {
  const [showPopup, setShowPopup] = useState(true);
  const selectedDate = "02/07/2025";
  const [mapLayers, setMapLayers] = useState({
    cropStress: true,
    cropYield: true,
    soilMoisture: true,
    soilOrganicCarbon: true,
  });

  const toggleLayer = (layer: keyof typeof mapLayers) => {
    setMapLayers({
      ...mapLayers,
      [layer]: !mapLayers[layer],
    });
  };

  return (
    <div className="flex flex-col h-screen w-full relative">
      {/* Main Map Area with Satellite Imagery */}
      <div className="relative flex-grow bg-gray-300 overflow-hidden">
        {/* Placeholder for the map - in a real app, you'd use a mapping library like Leaflet or Mapbox */}
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: "url('/Landing.png')",
            backgroundBlendMode: "overlay",
            backgroundColor: "rgba(150, 150, 150, 0.3)",
          }}
        />

        {/* Add Farm Button */}
        <div className="absolute top-4 left-4 z-10">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2 rounded-md py-2 px-3">
            <Plus size={16} />
            Add your farm
          </Button>
        </div>

        {/* Info Text */}
        <div className="absolute top-4 left-40 z-10 flex items-center gap-2 bg-white p-2 rounded-md shadow-sm">
          <Info size={16} />
          <span className="text-sm text-gray-700">
            Select an area type then trace it&apos;s outline by clicking on each
            corner.
          </span>
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <Button
            variant="outline"
            className="bg-white p-2 rounded-md shadow-sm"
          >
            <img src="/Landing.png" alt="Satellite" className="w-6 h-6" />
          </Button>
          <Button
            variant="outline"
            className="bg-white p-2 rounded-md shadow-sm"
          >
            <img src="/Landing.png" alt="Map" className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">Show Map Labels</span>
            <Switch defaultChecked />
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 flex flex-col bg-white rounded-md shadow-sm">
          <Button variant="ghost" className="p-2">
            <Plus size={20} />
          </Button>
          <div className="h-px bg-gray-200" />
          <Button variant="ghost" className="p-2">
            <Minus size={20} />
          </Button>
        </div>

        {/* Fullscreen Button */}
        <div className="absolute right-4 bottom-40 z-10">
          <Button
            variant="outline"
            className="bg-white p-2 rounded-md shadow-sm"
          >
            <Maximize2 size={20} />
          </Button>
        </div>

        {/* Legend */}
        <div className="absolute left-4 bottom-40 bg-white rounded-md shadow-sm p-2 z-10 w-36">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Legend</span>
            <ChevronDown size={16} />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Crop Stress</span>
              <ChevronDown size={16} className="text-blue-500" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Crop Yield</span>
              <ChevronDown size={16} className="text-blue-500" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Soil Moisture</span>
              <ChevronDown size={16} className="text-blue-500" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Soil Organic Carbon</span>
              <ChevronDown size={16} className="text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="absolute top-0 right-0 h-full w-64 bg-blue-500 text-white z-20 overflow-y-auto">
        <div className="p-4 flex items-center justify-between border-b border-blue-400">
          <div className="flex items-center gap-2">
            <Layers size={20} />
            <span className="font-medium">Layers</span>
          </div>
        </div>

        <div className="p-4 border-b border-blue-400">
          <div className="flex items-center gap-2 mb-3">
            <Layers size={16} />
            <span className="text-sm font-medium">Filter Layers</span>
          </div>

          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm">Select Date:</span>
            </div>
            <div className="relative flex items-center">
              <div className="relative w-full">
                <Input
                  value={selectedDate}
                  className="pr-8 bg-blue-600 text-white border-blue-400 w-full"
                />
                <ChevronDown
                  size={16}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                />
              </div>
              <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                <Search size={16} />
              </div>
            </div>
          </div>

          <div>
            <div className="mb-2">
              <span className="text-sm font-medium">Selected Layers:</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={mapLayers.cropStress}
                  onCheckedChange={() => toggleLayer("cropStress")}
                  id="cropStress"
                />
                <label htmlFor="cropStress" className="text-sm cursor-pointer">
                  Crop Stress
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={mapLayers.cropYield}
                  onCheckedChange={() => toggleLayer("cropYield")}
                  id="cropYield"
                />
                <label htmlFor="cropYield" className="text-sm cursor-pointer">
                  Crop Yield
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={mapLayers.soilMoisture}
                  onCheckedChange={() => toggleLayer("soilMoisture")}
                  id="soilMoisture"
                />
                <label
                  htmlFor="soilMoisture"
                  className="text-sm cursor-pointer"
                >
                  Soil Moisture
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={mapLayers.soilOrganicCarbon}
                  onCheckedChange={() => toggleLayer("soilOrganicCarbon")}
                  id="soilOrganicCarbon"
                />
                <label
                  htmlFor="soilOrganicCarbon"
                  className="text-sm cursor-pointer"
                >
                  Soil Organic Carbon
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 flex items-center justify-between">
          <span className="text-sm">Show Popup</span>
          <Switch checked={showPopup} onCheckedChange={setShowPopup} />
        </div>
      </div>

      {/* Results Panel */}
      <div className="bg-white w-full border-t border-gray-200">
        <div className="px-4 py-2 font-semibold">Results</div>
        <div className="flex divide-x divide-gray-200">
          <div className="flex-1 p-4 flex flex-col items-center justify-center">
            <h3 className="font-semibold">Soil Moisture</h3>
            <div className="text-blue-500 text-2xl font-bold mb-1">
              34.78 cm<sup>3</sup>
            </div>
            <p className="text-xs text-gray-600 text-center">
              Meaning: Average moisture
            </p>
          </div>

          <div className="flex-1 p-4 flex flex-col items-center justify-center">
            <h3 className="font-semibold">Crop Stress</h3>
            <div className="text-red-500 text-2xl font-bold mb-1">0.98</div>
            <p className="text-xs text-gray-600 text-center">
              Meaning: High Risk of stress
            </p>
          </div>

          <div className="flex-1 p-4 flex flex-col items-center justify-center">
            <h3 className="font-semibold">Soil Organic Carbon</h3>
            <div className="text-purple-500 text-2xl font-bold mb-1">
              24 g/kg
            </div>
            <p className="text-xs text-gray-600 text-center">
              Meaning: Average soil carbon experienced
            </p>
          </div>

          <div className="flex-1 p-4 flex flex-col items-center justify-center">
            <h3 className="font-semibold">Crop Yield</h3>
            <div className="text-green-500 text-2xl font-bold mb-1">
              200 kg/ha
            </div>
            <p className="text-xs text-gray-600 text-center">
              Meaning: Good yield
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
