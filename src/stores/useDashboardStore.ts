/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { supabase } from "@/superbase/client";
import { toast } from "react-toastify";
import type { FeatureCollection } from "geojson";
import { LegendData } from "@/app/dashboard/components/MapFunctionality/Analysis";
import { feature } from "@/types/geometry";

// Define the state properties
interface DashboardState {
  lat: number;
  long: number;
  segmenting: boolean;
  saving: boolean;
  farms: feature[];
  selectedFarm: feature | null;
  backendURL: string | undefined;
  geoData?: feature[];
  selectedFarmGeoData?: feature[];
  bbox: number[] | null;
  isAnalyzing: boolean;
  analysisLegend: LegendData[];
  showLegend: boolean;
  createdSegments?: feature[];
  showAllFarms: boolean;
}

// Define the actions on the state
interface DashboardActions {
  setLat: (lat: number) => void;
  setLong: (long: number) => void;
  setIsSegmenting: (segmenting: boolean) => void;
  setSaving: (saving: boolean) => void;
  setFarms: (farms: feature[]) => void;
  setSelectedFarm: (farm: feature | null | undefined) => void;
  getFarms: (router: any) => Promise<void>;
  setBbox: (bbox: number[] | null) => void;
  setGeoData: (geoData?: feature[]) => void;
  setSelectedFarmGeoData: (geoData?: feature[]) => void;
  onDrawFinish: (bbox: number[], geoJson: FeatureCollection) => void;
  runCropStressAnalysis: () => void;
  onAnalysisComplete: (legendData: LegendData[]) => void;
  onAnalysisError: (error: string) => void;
  toggleShowAllFarms: () => void;
  setCreatedSegments: (createdSegments: feature[]) => void;
}

// Combine state and actions
type DashboardStore = DashboardState & DashboardActions;

const useDashboardStore = create<DashboardStore>((set, get) => ({
  // Initial State
  lat: -1.286389,
  long: 36.817223,
  segmenting: false,
  saving: false,
  farms: [] as feature[],
  selectedFarm: null as feature | null,
  backendURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  geoData: undefined,
  selectedFarmGeoData: undefined,
  bbox: null,
  isAnalyzing: false,
  analysisLegend: [],
  showLegend: false,
  showAllFarms: false,
  createdSegments: undefined,

  // Actions
  setLat: (lat) => set({ lat }),
  setLong: (long) => set({ long }),
  setIsSegmenting: (segmenting) => set({ segmenting }),
  setSaving: (saving) => set({ saving }),
  setFarms: (farms) => set({ farms }),
  setCreatedSegments: (createdSegments) =>
    set({ createdSegments: createdSegments }),
  setSelectedFarm: (farm: feature | null | undefined) => {
    if (!farm || !farm.geometry) {
      set({ selectedFarmGeoData: undefined });
      return;
    }
    set({ selectedFarm: farm });
    farm["type"] = "Feature";
    set({ selectedFarmGeoData: [farm] });
  },
  setSelectedFarmGeoData: (geoData?: feature[]) =>
    set({ selectedFarmGeoData: geoData }),
  getFarms: async (router) => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;

      const farmer_id = data?.session?.user.id;

      if (!farmer_id) {
        toast.error("User not authenticated", {
          onClose: () => router.push("/account/login"),
        });
        return;
      }

      const backendURL = get().backendURL;
      const response = await fetch(
        `${backendURL}/api/farms?farmer_id=${farmer_id}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch farms");
      }

      const result = await response.json();
      const farms = result.map((farm: any) => {
        return {
          name: farm.name,
          id: farm.id,
          crop: farm.crop?.name,
          geometry: farm.segment.geometry,
          properties: farm.segment.properties,
        };
      });

      set({ farms });
    } catch (err) {
      console.error("Error fetching farms:", err);
      toast.error("Failed to fetch farms");
    }
  },
  setBbox: (bbox) => set({ bbox }),
  setGeoData: (geoData) => set({ geoData }),
  onDrawFinish: (bbox, geoJson) => {
    set({ bbox, geoData: geoJson.features });
  },
  runCropStressAnalysis: () => {
    const { selectedFarm } = get();

    if (!selectedFarm || !selectedFarm.geometry) {
      toast.error("Please select a farm first");
      return;
    }
    set({ isAnalyzing: true, showLegend: false, analysisLegend: [] });
  },
  onAnalysisComplete: (legendData) => {
    set({
      analysisLegend: legendData,
      showLegend: true,
      isAnalyzing: false,
    });
    toast.success("Crop stress analysis completed successfully");
  },
  onAnalysisError: (error) => {
    set({
      isAnalyzing: false,
      showLegend: false,
      analysisLegend: [],
    });
    toast.error(`Analysis failed: ${error}`);
  },
  toggleShowAllFarms: () => {
    const { showAllFarms } = get();
    set({ showAllFarms: !showAllFarms });
    if (showAllFarms) {
      // When showing all farms, clear current geoData and bbox
      set({
        geoData: undefined,
        bbox: null,
        selectedFarmGeoData: undefined,
        selectedFarm: null,
        createdSegments: undefined,
      });
    }
  },
}));

export default useDashboardStore;
