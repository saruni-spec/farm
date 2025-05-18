"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Expand,
  Plus,
  Leaf,
  Droplets,
  Wind,
  ThermometerSun,
} from "lucide-react"; // Added more icons for variety
import { Position } from "geojson";
import dynamic from "next/dynamic";
import { useState } from "react"; // Import useState
import AddFarm from "./Map Functionality/AddFarm";
import ReportCard from "./ReportCard";
// We are NOT importing AnalysisCards here as per your clarification.

const MapLeaflet = dynamic(() => import("./Map Functionality/Map Leaflet"), {
  ssr: false,
});

// Define a type for our report data for better structure
interface ReportAspect {
  id: string;
  title: string;
  value: string;
  unit?: string;
  description?: string;
  icon?: React.ReactNode; // Allow any React node as an icon
  colorClass?: string; // For styling, e.g., text-green-600
}

interface FarmReportData {
  farmName: string;
  area?: string; // Example: "50 Hectares"
  generatedDate: string;
  aspects: ReportAspect[];
}

const Map = ({
  lat = -1.286389,
  long = 36.817223,
  height = 500,
}: {
  lat: number;
  long: number;
  height?: number;
}) => {
  const [isAddFarmDialogOpen, setIsAddFarmDialogOpen] = useState(false); // For the "Add Farm" dialog
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [currentReportData, setCurrentReportData] =
    useState<FarmReportData | null>(null);

  const iconSize = 28; // Consistent icon size for report cards

  // Collect a report for the selected segment
  const generateReport = async (
    farmNameInput: string,
    farmGeometry: Position[][]
  ) => {
    console.log(
      "Generating report for:",
      farmNameInput,
      "with geometry:",
      farmGeometry
    );

    const mockReportData: FarmReportData = {
      farmName: farmNameInput || "Selected Area",
      area: `${(Math.random() * 100 + 20).toFixed(1)} Hectares`, // Example dynamic data
      generatedDate: new Date().toLocaleDateString(),
      aspects: [
        {
          id: "crop_stress",
          title: "Crop Stress",
          value: (Math.random() * 0.6 + 0.2).toFixed(2), // Random NDVI between 0.2 and 0.8
          description: "Indicates plant health and density.",
          icon: <Leaf size={iconSize} className="text-green-600" />,
          colorClass: "text-green-700",
        },
        {
          id: "soil_moisture",
          title: "Soil Moisture",
          value: `${(Math.random() * 50 + 5).toFixed(0)}%`, // Random percentage
          description: "Estimated plant water stress level.",
          icon: <Droplets size={iconSize} className="text-blue-600" />,
          colorClass: "text-blue-700",
        },
        {
          id: "soil_carbon",
          title: "Soil Carbon",
          value: `${(Math.random() * 10 + 18).toFixed(1)}`,
          unit: "°C",
          description: "Average temperature of the plant canopy.",
          icon: <ThermometerSun size={iconSize} className="text-orange-600" />,
          colorClass: "text-orange-700",
        },
        {
          id: "field_health",
          title: "Field Health",
          value: `${(Math.random() * 15 + 2).toFixed(1)}`,
          unit: "km/h",
          description: "Affects evapotranspiration and spraying.",
          icon: <Wind size={iconSize} className="text-gray-600" />,
          colorClass: "text-gray-700",
        },
      ],
    };

    setCurrentReportData(mockReportData);
    setIsReportDialogOpen(true);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        {/* Dialog for Adding a Farm */}
        <Dialog
          open={isAddFarmDialogOpen}
          onOpenChange={setIsAddFarmDialogOpen}
        >
          <DialogTrigger asChild>
            <Button
              variant={"save"}
              onClick={() => setIsAddFarmDialogOpen(true)}
            >
              <Plus size={16} />
              Add your farm
            </Button>
          </DialogTrigger>
          <DialogContent className="z-[9999] w-full">
            <DialogHeader>
              <DialogTitle>Add a new farm</DialogTitle>
              <DialogDescription>
                Create a new farm. Click save when you&apos;re done
              </DialogDescription>
            </DialogHeader>
            <AddFarm lat={lat} long={long} />
            <DialogFooter>
              <Button
                variant={"save"}
                onClick={() => {
                  // Add logic to save the farm from AddFarm component if needed
                  setIsAddFarmDialogOpen(false);
                }}
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <button className="p-2 rounded-md hover:bg-gray-100 text-gray-600">
          <Expand />
        </button>
      </div>

      <MapLeaflet
        drawFunction={generateReport}
        lat={lat}
        long={long}
        height={height}
      />

      {/* Analysis Report Dialog */}
      <ReportCard
        isReportDialogOpen={isReportDialogOpen}
        setIsReportDialogOpen={setIsReportDialogOpen}
        currentReportData={currentReportData}
      />
    </div>
  );
};

export default Map;
