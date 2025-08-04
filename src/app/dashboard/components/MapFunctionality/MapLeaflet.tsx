import { useEffect, useState } from "react";
import { MapContainer, TileLayer, LayersControl } from "react-leaflet";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import "@geoman-io/leaflet-geoman-free";
import DrawControl from "./DrawControl";
import MapUpdater from "./MapUpdater";
import GeoJsonDisplay from "./GeoJsonDisplay";
import CropStressAnalysis from "./Analysis";
import AllFarmsDisplay from "./AllFarms";
import useDashboardStore from "@/stores/useDashboardStore";
import LegendControl from "./LegendControl";
import SelectSpecificFarm from "./SelectSpecificFarm";

interface MapLeafletProps {
  className?: string;
}

const MapLeaflet: React.FC<MapLeafletProps> = ({ className }) => {
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
    selectedFarmGeoData,
    showLegend,
    setAnalysisData,
    createdSegments: segmentedFarms,
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
  const farmsToDisplay = showAllFarms ? farms : segmentedFarms;

  return (
    <div className={`relative z-0 w-full ${className}`}>
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
        {selectedFarmGeoData && (
          <SelectSpecificFarm geoData={selectedFarmGeoData} />
        )}

        {/* Show all farms when showAllFarms is true */}
        {farmsToDisplay && (
          <AllFarmsDisplay
            farms={farmsToDisplay}
            onFarmClick={(farm) => {
              setSelectedFarm(farm);
            }}
          />
        )}

        {/* Crop Stress Analysis Component - only when not showing all farms */}
        {!farmsToDisplay && selectedFarm && (
          <>
            <CropStressAnalysis
              selectedFarm={selectedFarm}
              isAnalyzing={isAnalyzing}
              onAnalysisComplete={onAnalysisComplete}
              onAnalysisError={onAnalysisError}
              setAnalysisData={setAnalysisData}
            />
          </>
        )}
        {showLegend && <LegendControl />}
      </MapContainer>
    </div>
  );
};

export default MapLeaflet;
