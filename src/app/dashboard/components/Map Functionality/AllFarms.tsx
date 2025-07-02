/* eslint-disable @typescript-eslint/no-explicit-any */

import { GeoJSON } from "react-leaflet";
import type { FeatureCollection, Feature, Geometry } from "geojson";

interface Farm {
  id: string;
  name: string;
  geometry: Geometry | string;
}

interface AllFarmsDisplayProps {
  farms: Farm[];
  onFarmClick?: (farm: Farm) => void;
  setSelectedFarm?: (farm: Farm) => void;
}

const AllFarmsDisplay: React.FC<AllFarmsDisplayProps> = ({
  farms,
  onFarmClick,
  setSelectedFarm,
}) => {
  // Generate different colors for each farm
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FECA57",
    "#FF9FF3",
    "#54A0FF",
    "#5F27CD",
    "#00D2D3",
    "#FF9F43",
    "#686DE0",
    "#4B7BEC",
    "#A3CB38",
    "#FDA7DF",
    "#D63031",
    "#74B9FF",
    "#0984E3",
    "#6C5CE7",
    "#FDCB6E",
    "#E17055",
  ];

  const getColor = (index: number) => {
    return colors[index % colors.length];
  };

  const createFeatureCollection = (): FeatureCollection => {
    return {
      type: "FeatureCollection",
      features: farms.map((farm, index) => {
        // ✨ FIX: Ensure the geometry is a valid object before creating the feature
        const geometry =
          typeof farm.geometry === "string"
            ? JSON.parse(farm.geometry)
            : farm.geometry;

        return {
          type: "Feature",
          geometry: geometry,
          properties: {
            farmId: farm.id,
            farmName: farm.name,
            color: getColor(index),
            fillColor: getColor(index),
            fillOpacity: 0.3,
            weight: 2,
            opacity: 0.8,
          },
        };
      }),
    };
  };

  const onEachFeature = (feature: Feature, layer: any) => {
    // Add popup with farm name
    if (feature.properties?.farmName) {
      layer.bindPopup(`<strong>${feature.properties.farmName}</strong>`);
    }

    // Add click handler if provided
    if (onFarmClick) {
      layer.on("click", () => {
        const farm = farms.find((f) => f.id === feature.properties?.farmId);
        if (farm) {
          onFarmClick(farm);
        }
        if (setSelectedFarm && farm) setSelectedFarm(farm);
      });
    }
  };

  const style = (feature: any) => {
    return {
      color: feature.properties?.color || "#3388ff",
      fillColor: feature.properties?.fillColor || "#3388ff",
      fillOpacity: feature.properties?.fillOpacity || 0.3,
      weight: feature.properties?.weight || 2,
      opacity: feature.properties?.opacity || 0.8,
    };
  };

  if (!farms || farms.length === 0) {
    return null;
  }

  return (
    <GeoJSON
      key={farms.map((f) => f.id).join("-")}
      data={createFeatureCollection()}
      style={style}
      onEachFeature={onEachFeature}
    />
  );
};

export default AllFarmsDisplay;
