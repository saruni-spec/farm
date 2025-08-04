/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useRef, useState } from "react"; // Import useRef
import { useMap } from "react-leaflet";
import * as L from "leaflet";
import { feature } from "@/types/geometry";
declare global {
  interface Window {
    parseGeoraster: any;
    GeoRasterLayer: any;
  }
}

interface CropStressAnalysisProps {
  selectedFarm: feature;
  isAnalyzing: boolean;
  onAnalysisComplete: (legendData: LegendData[]) => void;
  onAnalysisError: (error: string) => void;
  setAnalysisData: (analysisData: {
    smi_mean: number;
    soc_mean: number;
    stress_mean: number;
  }) => void;
}

export interface LegendData {
  title: string;
  colors: string[];
  labels: string;
}

const analysis_colors = {
  // Soil Moisture Index (SMI) — Blue scale (dry to wet)
  smi: ["#f7fbff", "#c6dbef", "#6baed6", "#2171b5", "#08306b"],

  // Crop Stress — Red scale (high stress to low stress)
  stress: ["#fff5f0", "#fcbba1", "#fc9272", "#ef3b2c", "#99000d"],

  // Soil Organic Carbon (SOC) — Green scale (low to high SOC)
  soc: ["#f7fcf5", "#c7e9c0", "#74c476", "#238b45", "#00441b"],
};

const CropStressAnalysis: React.FC<CropStressAnalysisProps> = ({
  selectedFarm,
  isAnalyzing,
  onAnalysisComplete,
  onAnalysisError,
  setAnalysisData,
}) => {
  const map = useMap();
  // Use useRef to hold the leaflet control instance
  const layerControlRef = useRef<L.Control.Layers | null>(null);
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

  // const getBoundsFromGeometry = (geometry: any) => {
  //   if (!geometry || geometry.type !== "Polygon") return null;

  //   const coordinates = geometry.coordinates[0];
  //   let minLng = Infinity,
  //     minLat = Infinity;
  //   let maxLng = -Infinity,
  //     maxLat = -Infinity;

  //   coordinates.forEach(([lng, lat]: [number, number]) => {
  //     minLng = Math.min(minLng, lng);
  //     maxLng = Math.max(maxLng, lng);
  //     minLat = Math.min(minLat, lat);
  //     maxLat = Math.max(maxLat, lat);
  //   });

  //   return {
  //     minx: minLng,
  //     miny: minLat,
  //     maxx: maxLng,
  //     maxy: maxLat,
  //   };
  // };

  const runAnalysis = async () => {
    if (!selectedFarm?.geometry) {
      onAnalysisError("No farm selected");
      return;
    }

    // const coords = getBoundsFromGeometry(selectedFarm.geometry);
    // if (!coords) {
    //   onAnalysisError("Invalid farm geometry");
    //   return;
    // }

    const analysisData = {
      farm_id: selectedFarm.id,
      coords: selectedFarm.geometry,
    };

    try {
      const backendURL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${backendURL}/run-analysis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(analysisData),
      });

      const data = await response.json();
      if (data.status !== "success") {
        throw new Error(data.error || "Analysis failed");
      }
      console.log(data);

      const { files } = data;

      clearAnalysisLayers();

      const { smi_mean, soc_mean, stress_mean } = files;

      setAnalysisData({ smi_mean, soc_mean, stress_mean });

      if (!layerControlRef.current) {
        layerControlRef.current = L.control.layers(undefined, undefined, {
          collapsed: false,
        });
        layerControlRef.current.addTo(map);
      }

      const newLayers: L.Layer[] = [];

      // Add raster layers
      const smiLayer = await addRasterLayer(
        `${backendURL}/${files.smi}`,
        getSMIColorFunction(),
        "Soil Moisture Index (SMI)"
      );
      if (smiLayer) {
        newLayers.push(smiLayer);
        // Use the ref's current value. It's guaranteed to be available.
        layerControlRef.current?.addOverlay(
          smiLayer,
          "Soil Moisture Index (SMI)"
        );
      }

      const stressLayer = await addRasterLayer(
        `${backendURL}/${files.stress}`,
        getCropStressColorFunction(),
        "Crop Stress"
      );
      if (stressLayer) {
        newLayers.push(stressLayer);
        layerControlRef.current?.addOverlay(stressLayer, "Crop Stress");
      }

      const socLayer = await addRasterLayer(
        `${backendURL}/${files.soc}`,
        getSOCColorFunction(),
        "Soil Organic Carbon"
      );
      if (socLayer) {
        newLayers.push(socLayer);
        layerControlRef.current?.addOverlay(socLayer, "Soil Organic Carbon");
      }

      setAnalysisLayers(newLayers);

      // Fit map to farm bounds
      const farmBounds = L.geoJSON(selectedFarm.geometry).getBounds();
      map.fitBounds(farmBounds);

      // Prepare legend data
      const legendData: LegendData[] = [
        {
          title: "Soil Moisture Index",
          colors: analysis_colors.smi,
          labels: "Dry → Wet (SMI)",
        },
        {
          title: "Crop Stress",
          colors: analysis_colors.stress,
          labels: "Low → High (C-Stress)",
        },
        {
          title: "Soil Organic Carbon",
          colors: analysis_colors.soc,
          labels: "Low → High (SOC)",
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
        opacity: 0.8,
        resolution: 128,
        pixelValuesToColorFn: colorFn,
      });

      layer.addTo(map);
      return layer;
    } catch (error) {
      console.error(`Error loading ${name}:`, error);
      return null;
    }
  };

  // Color functions
  const getSMIColorFunction = () => (values: number[]) => {
    const val = values[0];
    if (val == null || isNaN(val)) return null;

    const v = Math.max(0, Math.min(1, val));

    if (v < 0.1) return analysis_colors.smi[0];
    else if (v < 0.25) return analysis_colors.smi[1];
    else if (v < 0.5) return analysis_colors.smi[2];
    else if (v < 0.75) return analysis_colors.smi[3];
    else return analysis_colors.smi[4];
  };

  const getCropStressColorFunction = () => (values: number[]) => {
    const val = values[0];
    if (val == null || isNaN(val)) return null;

    const pct = Math.max(0, Math.min(100, val));

    if (pct < 20) return analysis_colors.stress[0];
    else if (pct < 40) return analysis_colors.stress[1];
    else if (pct < 60) return analysis_colors.stress[2];
    else if (pct < 80) return analysis_colors.stress[3];
    else return analysis_colors.stress[4];
  };

  const getSOCColorFunction = () => (values: number[]) => {
    const val = values[0];
    if (val === undefined || val === null || isNaN(val)) return null;

    const v = Math.max(0, Math.min(1, val));

    if (v < 0.1) return analysis_colors.soc[0];
    else if (v < 0.25) return analysis_colors.soc[1];
    else if (v < 0.5) return analysis_colors.soc[2];
    else if (v < 0.75) return analysis_colors.soc[3];
    else return analysis_colors.soc[4];
  };

  const clearAnalysisLayers = () => {
    analysisLayers.forEach((layer) => {
      map.removeLayer(layer);
      // Use the ref to remove the layer from the control
      layerControlRef.current?.removeLayer(layer);
    });
    setAnalysisLayers([]);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAnalysisLayers();
      if (layerControlRef.current) {
        map.removeControl(layerControlRef.current);
      }
    };
  }, []);

  return null;
};

export default CropStressAnalysis;
