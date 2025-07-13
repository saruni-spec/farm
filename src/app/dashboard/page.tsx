"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AnalysisCards from "./components/AnalysisCards";
import ManagementZones from "./components/ManagementZones";
import Map from "./components/Map";
import MapLayers from "./components/MapLayers";
import useDashboardStore from "@/stores/useDashboardStore";

const Dashboard = () => {
  const router = useRouter();
  const getFarms = useDashboardStore((state) => state.getFarms);

  useEffect(() => {
    getFarms(router);
  }, []);

  return (
    <div className="py-22 px-3 text-black">
      <AnalysisCards />
      <div className="flex flex-col lg:flex-row gap-3 mt-3">
        <div className="lg:w-2/3">
          <Map />
        </div>

        <div className="lg:w-1/3 space-y-4">
          <MapLayers />
          <ManagementZones />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
