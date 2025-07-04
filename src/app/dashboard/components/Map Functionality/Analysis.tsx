/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import * as L from "leaflet";

declare global {
  interface Window {
    parseGeoraster: any;
    GeoRasterLayer: any;
  }
}

interface CropStressAnalysisProps {
  selectedFarm: any;
  isAnalyzing: boolean;
  onAnalysisComplete: (legendData: LegendData[]) => void;
  onAnalysisError: (error: string) => void;
}

export interface LegendData {
  title: string;
  colors: string[];
  labels: string;
}

const CropStressAnalysis: React.FC<CropStressAnalysisProps> = ({
  selectedFarm,
  isAnalyzing,
  onAnalysisComplete,
  onAnalysisError,
}) => {
  const map = useMap();
  const [layerControl, setLayerControl] = useState<L.Control.Layers | null>(
    null
  );
  const [analysisLayers, setAnalysisLayers] = useState<L.Layer[]>([]);

  useEffect(() => {
    // Load georaster libraries dynamically
    const loadGeoRasterLibs = async () => {
      if (!window.parseGeoraster || !window.GeoRasterLayer) {
        // Load georaster
        const georasterScript = document.createElement("script");
        georasterScript.src = "https://unpkg.com/georaster";
        document.head.appendChild(georasterScript);

        // Load georaster-layer-for-leaflet
        const layerScript = document.createElement("script");
        layerScript.src = "https://unpkg.com/georaster-layer-for-leaflet";
        document.head.appendChild(layerScript);

        // Wait for libraries to load
        await new Promise((resolve) => {
          let checks = 0;
          const checkInterval = setInterval(() => {
            checks++;
            if (window.parseGeoraster && window.GeoRasterLayer) {
              clearInterval(checkInterval);
              resolve(true);
            } else if (checks > 50) {
              // 5 second timeout
              clearInterval(checkInterval);
              resolve(false);
            }
          }, 100);
        });
      }
    };

    loadGeoRasterLibs();
  }, []);

  useEffect(() => {
    if (!isAnalyzing || !selectedFarm?.geometry) return;

    runAnalysis();
  }, [isAnalyzing, selectedFarm]);

  const getBoundsFromGeometry = (geometry: any) => {
    if (!geometry || geometry.type !== "Polygon") return null;

    const coordinates = geometry.coordinates[0]; // First ring of polygon
    let minLng = Infinity,
      minLat = Infinity;
    let maxLng = -Infinity,
      maxLat = -Infinity;

    coordinates.forEach(([lng, lat]: [number, number]) => {
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
    });

    return {
      minx: minLng,
      miny: minLat,
      maxx: maxLng,
      maxy: maxLat,
    };
  };

  const runAnalysis = async () => {
    if (!selectedFarm?.geometry) {
      onAnalysisError("No farm selected");
      return;
    }

    const coords = getBoundsFromGeometry(selectedFarm.geometry);
    if (!coords) {
      onAnalysisError("Invalid farm geometry");
      return;
    }

    try {
      const backendURL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${backendURL}/run-analysis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(coords),
      });

      const data = await response.json();
      if (data.status !== "success") {
        throw new Error(data.error || "Analysis failed");
      }

      // Clear existing analysis layers
      clearAnalysisLayers();

      // Initialize layer control if not exists
      if (!layerControl) {
        const control = L.control.layers(undefined, undefined, {
          collapsed: false,
        });
        control.addTo(map);
        setLayerControl(control);
      }

      const newLayers: L.Layer[] = [];

      // Add raster layers
      const smiLayer = await addRasterLayer(
        `${backendURL}/downloads/soil_moisture.tif`,
        getSMIColorFunction(),
        "Soil Moisture Index (SMI)"
      );
      if (smiLayer) {
        newLayers.push(smiLayer);
        layerControl?.addOverlay(smiLayer, "Soil Moisture Index (SMI)");
      }

      const stressLayer = await addRasterLayer(
        `${backendURL}/downloads/crop_stress.tif`,
        getCropStressColorFunction(),
        "Crop Stress"
      );
      if (stressLayer) {
        newLayers.push(stressLayer);
        layerControl?.addOverlay(stressLayer, "Crop Stress");
      }

      const socLayer = await addRasterLayer(
        `${backendURL}/downloads/soil_organic.tif`,
        getSOCColorFunction(),
        "Soil Organic Carbon"
      );
      if (socLayer) {
        newLayers.push(socLayer);
        layerControl?.addOverlay(socLayer, "Soil Organic Carbon");
      }

      setAnalysisLayers(newLayers);

      // Fit map to farm bounds
      const farmBounds = L.geoJSON(selectedFarm.geometry).getBounds();
      map.fitBounds(farmBounds);

      // Prepare legend data
      const legendData: LegendData[] = [
        {
          title: "Soil Moisture Index",
          colors: ["#ffffbf", "#abd9e9", "#74add1", "#4575b4", "#313695"],
          labels: "Dry → Wet",
        },
        {
          title: "Crop Stress",
          colors: ["#1a9850", "#91cf60", "#fee08b", "#fc8d59", "#d73027"],
          labels: "Low → High Stress",
        },
        {
          title: "Soil Organic Carbon",
          colors: ["#440154", "#3b528b", "#21908d", "#5dc962", "#fde725"],
          labels: "Low → High SOC",
        },
      ];

      onAnalysisComplete(legendData);
    } catch (error: any) {
      console.error("Analysis error:", error);
      onAnalysisError(error.message || "Analysis failed");
    }
  };

  const addRasterLayer = async (
    url: string,
    colorFn: (values: number[]) => string | null,
    name: string
  ) => {
    try {
      if (!window.parseGeoraster || !window.GeoRasterLayer) {
        throw new Error("Georaster libraries not loaded");
      }

      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const georaster = await window.parseGeoraster(arrayBuffer);

      const layer = new window.GeoRasterLayer({
        georaster,
        opacity: 0.7,
        resolution: 64,
        pixelValuesToColorFn: colorFn,
      });

      layer.addTo(map);
      return layer;
    } catch (error) {
      console.error(`Error loading ${name}:`, error);
      return null;
    }
  };

  const clearAnalysisLayers = () => {
    analysisLayers.forEach((layer) => {
      map.removeLayer(layer);
      layerControl?.removeLayer(layer);
    });
    setAnalysisLayers([]);
  };

  // Color functions
  const getSMIColorFunction = () => (values: number[]) => {
    const val = values[0];
    if (val == null || isNaN(val)) return null;

    const v = Math.max(0, Math.min(1, val));

    if (v < 0.1) return "#ffffbf";
    else if (v < 0.25) return "#abd9e9";
    else if (v < 0.5) return "#74add1";
    else if (v < 0.75) return "#4575b4";
    else return "#313695";
  };

  const getCropStressColorFunction = () => (values: number[]) => {
    const val = values[0];
    if (val == null || isNaN(val)) return null;

    const pct = Math.max(0, Math.min(100, val));

    if (pct < 20) return "#1a9850";
    else if (pct < 40) return "#91cf60";
    else if (pct < 60) return "#fee08b";
    else if (pct < 80) return "#fc8d59";
    else return "#d73027";
  };

  const getSOCColorFunction = () => (values: number[]) => {
    const val = values[0];
    if (val === undefined || val === null || isNaN(val)) return null;

    const v = Math.max(0, Math.min(1, val));

    if (v < 0.1) return "#440154";
    else if (v < 0.25) return "#3b528b";
    else if (v < 0.5) return "#21908d";
    else if (v < 0.75) return "#5dc962";
    else return "#fde725";
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAnalysisLayers();
      if (layerControl) {
        map.removeControl(layerControl);
      }
    };
  }, []);

  return null; // This component doesn't render anything visible
};

export default CropStressAnalysis;
