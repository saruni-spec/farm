/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, LayersControl } from "react-leaflet";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
//Geoman styles
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import "@geoman-io/leaflet-geoman-free";
import DrawControl from "./Draw Control";
import MapUpdater from "./Map Updater";
import GeoJsonDisplay from "./GeoJsonDisplay";
import CropStressAnalysis from "./Analysis";
import AllFarmsDisplay from "./AllFarms"; // Import the new component
import type { FeatureCollection } from "geojson";
import type { LegendData } from "./Analysis";

interface MapLeafletProps {
  lat: number;
  long: number;
  height?: number;
  geoData?: FeatureCollection;
  onDrawFinish: (bbox: number[], geoJson: FeatureCollection) => void;
  selectedFarm?: any;
  isAnalyzing?: boolean;
  onAnalysisComplete?: (legendData: LegendData[]) => void;
  onAnalysisError?: (error: string) => void;
  farms?: any[]; // Add farms prop
  showAllFarms?: boolean; // Add showAllFarms prop
  setSelectedFarm?: (farm: any) => void;
}

const MapLeaflet: React.FC<MapLeafletProps> = ({
  lat = -1.286389,
  long = 36.817223,
  height = 350,
  geoData,
  onDrawFinish,
  selectedFarm,
  isAnalyzing = false,
  onAnalysisComplete = () => {},
  onAnalysisError = () => {},
  farms = [],
  showAllFarms = false,
  setSelectedFarm,
}) => {
  const position: [number, number] = [lat, long];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "leaflet/dist/images/marker-icon-2x.png",
      iconUrl: "leaflet/dist/images/marker-icon.png",
      shadowUrl: "leaflet/dist/images/marker-shadow.png",
    });
  }, []);

  if (!mounted) return null;

  return (
    <div
      style={{ height: `${height}px`, width: "100%" }}
      className="relative z-0"
    >
      <MapContainer
        center={position}
        zoom={16}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <MapUpdater lat={lat} long={long} />
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite View (Esri)">
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
          </LayersControl.BaseLayer>
        </LayersControl>

        {/* Only show DrawControl when not showing all farms */}
        {!showAllFarms && <DrawControl onDrawFinish={onDrawFinish} />}

        {/* Show individual farm or drawn area when not showing all farms */}
        {!showAllFarms && geoData && <GeoJsonDisplay geoData={geoData} />}

        {/* Show all farms when showAllFarms is true */}
        {showAllFarms && (
          <AllFarmsDisplay
            farms={farms}
            onFarmClick={(farm) => {
              // Optional: Handle farm click (you can implement this later if needed)
              console.log("Farm clicked:", farm.name);
            }}
            setSelectedFarm={setSelectedFarm}
          />
        )}

        {/* Crop Stress Analysis Component - only when not showing all farms */}
        {!showAllFarms && (
          <CropStressAnalysis
            selectedFarm={selectedFarm}
            isAnalyzing={isAnalyzing}
            onAnalysisComplete={onAnalysisComplete}
            onAnalysisError={onAnalysisError}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default MapLeaflet;
