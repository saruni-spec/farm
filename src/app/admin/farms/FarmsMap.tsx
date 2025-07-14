"use client";
import GeoJsonDisplay from "@/app/dashboard/components/MapFunctionality/GeoJsonDisplay";
import MapUpdater from "@/app/dashboard/components/MapFunctionality/MapUpdater";
import useDashboardStore from "@/stores/useDashboardStore";
import { useEffect, useState } from "react";
import { LayersControl, MapContainer, TileLayer } from "react-leaflet";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import "@geoman-io/leaflet-geoman-free";

const FarmsMap = () => {
  const [mounted, setMounted] = useState(false);
  const { lat, long, selectedFarmGeoData } = useDashboardStore();
  const position: [number, number] = [lat, long];

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
      {selectedFarmGeoData && <GeoJsonDisplay geoData={selectedFarmGeoData} />}
    </MapContainer>
  );
};

export default FarmsMap;
