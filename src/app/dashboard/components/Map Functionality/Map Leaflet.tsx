import { useEffect, useState } from "react";
import { MapContainer, TileLayer, LayersControl } from "react-leaflet";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import "@geoman-io/leaflet-geoman-free";
import DrawControl from "./Draw Control";
import MapUpdater from "./Map Updater";
import GeoJsonDisplay from "./GeoJsonDisplay";
import CropStressAnalysis from "./Analysis";
import AllFarmsDisplay from "./AllFarms";
import useDashboardStore from "@/stores/useDashboardStore";
import LegendControl from "./LegendControl";

interface MapLeafletProps {
  height?: number;
}

const MapLeaflet: React.FC<MapLeafletProps> = ({ height = 350 }) => {
  const {
    lat,
    long,
    geoData,
    onDrawFinish,
    selectedFarm,
    isAnalyzing,
    onAnalysisComplete,
    onAnalysisError,
    farms,
    showAllFarms,
    setSelectedFarm,
    showLegend,
  } = useDashboardStore();
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
              setSelectedFarm(farm);
            }}
          />
        )}

        {/* Crop Stress Analysis Component - only when not showing all farms */}
        {!showAllFarms && selectedFarm && (
          <>
            <CropStressAnalysis
              selectedFarm={selectedFarm}
              isAnalyzing={isAnalyzing}
              onAnalysisComplete={onAnalysisComplete}
              onAnalysisError={onAnalysisError}
            />
          </>
        )}
        {showLegend && <LegendControl />}
      </MapContainer>
    </div>
  );
};

export default MapLeaflet;
