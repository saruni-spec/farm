import { GeoJSON } from "react-leaflet";
import type { FeatureCollection, Feature } from "geojson";
import { feature } from "@/types/geometry";

interface AllFarmsDisplayProps {
  farms: feature[];
  onFarmClick?: (farm: feature) => void;
  setSelectedFarm?: (farm: feature) => void;
}

const AllFarmsDisplay: React.FC<AllFarmsDisplayProps> = ({
  farms,
  onFarmClick,
}) => {
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
        const geometry = farm.geometry;

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

  const onEachFeature = (feature: Feature, layer: L.Layer) => {
    if (feature.properties?.farmName) {
      layer.bindPopup(`<strong>${feature.properties.farmName}</strong>`);
    }
    if (onFarmClick) {
      layer.on("click", () => {
        const farm = farms.find((f) => f.id === feature.properties?.farmId);
        if (farm) {
          onFarmClick(farm);
        }
      });
    }
  };

  const style = (feature: feature | undefined) => {
    return {
      color: feature?.properties?.color || "#3388ff",
      fillColor: feature?.properties?.fillColor || "#3388ff",
      fillOpacity: feature?.properties?.fillOpacity || 0.3,
      weight: feature?.properties?.weight || 2,
      opacity: feature?.properties?.opacity || 0.8,
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
