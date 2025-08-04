"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
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
    <div className="pt-16 pb-5 px-3 text-black h-full">
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-3 mt-3 h-full">
        <div className="h-full">
          <Map className="h-full" />
        </div>

        <div className="space-y-4 h-full">
          <MapLayers className="h-full" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
