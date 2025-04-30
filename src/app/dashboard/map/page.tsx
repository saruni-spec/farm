"use client";
import { useState } from "react";
import {
  Plus,
  Minus,
  Info,
  Maximize2,
  ChevronDown,
  FileText,
  X,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

export default function FarmMapping() {
  const selectedDate = "02/07/2025";
  const [reportsDialogOpen, setReportsDialogOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="flex flex-col h-screen w-full relative">
      {/* Main Map Area with Satellite Imagery */}
      <div className="relative flex-grow overflow-hidden">
        {/* Interactive map instead of background image */}
        <div className="w-full h-full relative">
          <img
            src="/Landing.png"
            alt="Farm Map"
            className="w-full h-full object-cover"
            style={{
              filter: "brightness(1.05) contrast(1.05)",
            }}
          />
          {/* Optional overlay for better visibility of controls */}
        </div>

        {/* Control Panel - Top Left */}
        <div className="absolute top-4 left-4 z-10">
          {/* Container with fixed position for Add Farm Button */}
          <div className="relative">
            {/* Add Farm Button */}
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 rounded-md py-2 px-4 shadow-md"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <Plus size={16} />
              Add your farm
            </Button>

            {/* Info Text - With transition for smooth appearance */}
            <div
              className={`absolute top-full w-50 left-0 mt-3 flex items-center gap-2 bg-white p-3 rounded-md shadow-md transition-all duration-300 ${
                isHovering
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-1 pointer-events-none"
              }`}
            >
              <Info size={16} className="text-blue-600 flex-shrink-0" />
              <span className="text-sm text-gray-700">
                Select an area type then trace it&apos;s outline by clicking on
                each corner.
              </span>
            </div>
          </div>
        </div>

        {/* Control Panel - Top Right */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-3">
          <div className="bg-white p-3 rounded-md shadow-md flex items-center gap-4">
            {/* Date Selector */}
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-blue-600" />
              <div className="relative flex items-center">
                <Input
                  value={selectedDate}
                  className="pr-8 border-gray-200 w-36 h-8 text-sm"
                />
                <ChevronDown
                  size={16}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
                />
              </div>
            </div>

            {/* Layer Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="bg-white hover:bg-gray-50 p-2 rounded-md"
              >
                <img src="/Landing.png" alt="Satellite" className="w-6 h-6" />
              </Button>
              <Button
                variant="outline"
                className="bg-white hover:bg-gray-50 p-2 rounded-md"
              >
                <img src="/Landing.png" alt="Map" className="w-6 h-6" />
              </Button>
            </div>

            {/* Map Labels Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Map Labels</span>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="absolute right-4 top-2/3 transform -translate-y-1/2 z-10 flex flex-col bg-white rounded-md shadow-md overflow-hidden">
          <Button variant="ghost" className="p-2 hover:bg-gray-100">
            <Plus size={20} className="text-gray-700" />
          </Button>
          <div className="h-px bg-gray-200" />
          <Button variant="ghost" className="p-2 hover:bg-gray-100">
            <Minus size={20} className="text-gray-700" />
          </Button>
          <Button
            variant="outline"
            className="bg-white hover:bg-gray-50 p-2 rounded-md shadow-md"
          >
            <Maximize2 size={20} className="text-gray-700" />
          </Button>
        </div>

        {/* Bottom Right Controls */}
        <div className="absolute right-4 bottom-4 z-10 flex flex-col gap-3">
          {/* Fullscreen Button */}

          {/* Generate Report Button */}
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md shadow-md flex items-center gap-2"
            onClick={() => setReportsDialogOpen(true)}
          >
            <FileText size={18} />
            <span className="text-sm font-medium">Generate Report</span>
          </Button>

          {/* Show Popup Toggle */}
        </div>
      </div>

      {/* Results Panel */}
      <div className="bg-white border-t border-gray-200 shadow-md">
        <div className="px-6 py-3 font-semibold text-gray-800 border-b border-gray-100">
          Results
        </div>
        <div className="flex divide-x divide-gray-100">
          <div className="flex-1 p-5 flex flex-col items-center justify-center">
            <h3 className="font-semibold text-gray-700 mb-2">Soil Moisture</h3>
            <div className="text-blue-600 text-2xl font-bold mb-2">
              34.78 cm<sup>3</sup>
            </div>
            <p className="text-xs text-gray-600 text-center">
              Meaning: Average moisture
            </p>
          </div>

          <div className="flex-1 p-5 flex flex-col items-center justify-center">
            <h3 className="font-semibold text-gray-700 mb-2">Crop Stress</h3>
            <div className="text-red-600 text-2xl font-bold mb-2">0.98</div>
            <p className="text-xs text-gray-600 text-center">
              Meaning: High Risk of stress
            </p>
          </div>

          <div className="flex-1 p-5 flex flex-col items-center justify-center">
            <h3 className="font-semibold text-gray-700 mb-2">
              Soil Organic Carbon
            </h3>
            <div className="text-purple-600 text-2xl font-bold mb-2">
              24 g/kg
            </div>
            <p className="text-xs text-gray-600 text-center">
              Meaning: Average soil carbon experienced
            </p>
          </div>

          <div className="flex-1 p-5 flex flex-col items-center justify-center">
            <h3 className="font-semibold text-gray-700 mb-2">Crop Yield</h3>
            <div className="text-green-600 text-2xl font-bold mb-2">
              200 kg/ha
            </div>
            <p className="text-xs text-gray-600 text-center">
              Meaning: Good yield
            </p>
          </div>
        </div>
      </div>

      {/* Reports Dialog */}
      <Dialog open={reportsDialogOpen} onOpenChange={setReportsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-center font-bold text-2xl md:text-3xl mb-6 text-gray-800">
              Generate Reports
            </DialogTitle>
            <DialogClose className="absolute right-4 top-4">
              <X className="h-4 w-4" />
            </DialogClose>
          </DialogHeader>

          <form className="space-y-6">
            {/* Duration Selection */}
            <div>
              <h2 className="text-lg font-semibold mb-3 text-gray-700">
                Choose Duration
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500">Time</label>
                  <input
                    placeholder="HH:MM"
                    type="time"
                    name="time"
                    required
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500">Date</label>
                  <input
                    placeholder="DD/MM/YYYY"
                    type="date"
                    name="date"
                    required
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500">Month</label>
                  <input
                    placeholder="MM/YYYY"
                    type="month"
                    name="month"
                    required
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500">Year</label>
                  <input
                    type="text"
                    name="year"
                    required
                    placeholder="YYYY"
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
            </div>

            {/* Options to Include */}
            <div>
              <h2 className="text-lg font-semibold mb-3 text-gray-700">
                What to Include
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                  <input
                    type="checkbox"
                    id="includeboundary"
                    className="accent-blue-500 cursor-pointer h-4 w-4"
                  />
                  <label
                    htmlFor="includeboundary"
                    className="text-sm cursor-pointer"
                  >
                    Farm boundary
                  </label>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                  <input
                    type="checkbox"
                    id="includeplantingactivities"
                    className="accent-blue-500 cursor-pointer h-4 w-4"
                  />
                  <label
                    htmlFor="includeplantingactivities"
                    className="text-sm cursor-pointer"
                  >
                    Planting Activities
                  </label>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                  <input
                    type="checkbox"
                    id="includecurrentweather"
                    className="accent-blue-500 cursor-pointer h-4 w-4"
                  />
                  <label
                    htmlFor="includecurrentweather"
                    className="text-sm cursor-pointer"
                  >
                    Current Weather Statistics
                  </label>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                  <input
                    type="checkbox"
                    id="includecroparea"
                    className="accent-blue-500 cursor-pointer h-4 w-4"
                  />
                  <label
                    htmlFor="includecroparea"
                    className="text-sm cursor-pointer"
                  >
                    Crop Area Boundary
                  </label>
                </div>
              </div>
            </div>

            {/* Format and Submit */}
            <div>
              <h2 className="text-lg font-semibold mb-3 text-gray-700">
                Format
              </h2>
              <div className="flex items-center gap-4 mb-6">
                <select
                  title="Select format"
                  name="format"
                  className="border border-gray-300 rounded px-5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-1/6"
                >
                  <option value="pdf">PDF</option>
                  <option value="csv">CSV</option>
                  <option value="xlsx">Excel</option>
                </select>
              </div>
            </div>
            <div className="flex justify-center">
              <Button
                type="submit"
                className="bg-blue-600 text-white px-8 py-2 rounded-md hover:bg-blue-700 transition mx-auto"
              >
                Generate Report
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
