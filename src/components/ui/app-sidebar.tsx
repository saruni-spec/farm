"use client";
import { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Map, Sprout, ChevronDown, ChevronUp, Layers } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";

type Layer = "cropStress" | "cropYield" | "soilMoisture" | "soilOrganicCarbon";

const AppSidebar = () => {
  const pathName = usePathname();
  const [showLegend, setShowLegend] = useState(false);

  // Layer state moved from FarmMapping to AppSidebar
  const [mapLayers, setMapLayers] = useState({
    cropStress: true,
    cropYield: true,
    soilMoisture: true,
    soilOrganicCarbon: true,
  });

  // Toggle function for layer visibility
  const toggleLayer = (layer: Layer) => {
    setMapLayers({
      ...mapLayers,
      [layer]: !mapLayers[layer],
    });
  };

  // Navigation data
  const data = [
    {
      title: "Farm Map",
      url: "/dashboard/map",
      icon: <Map className="h-5 w-5" />,
      hasSubmenu: true,
    },
    {
      title: "Planting",
      url: "/dashboard/planting",
      icon: <Sprout className="h-5 w-5" />,
      hasSubmenu: false,
    },
  ];

  const isMapActive = pathName.startsWith("/dashboard/map");

  // Hide legend when navigating away from map
  useEffect(() => {
    if (!isMapActive) {
      setShowLegend(false);
    }
  }, [isMapActive]);

  return (
    <Sidebar>
      <SidebarHeader>Farm Sawa</SidebarHeader>
      <SidebarContent className="flex flex-col">
        <nav className="flex-grow">
          {data.map((link) => {
            const isActive = pathName.startsWith(link.url);
            const isCurrentMapLink = link.url.includes("map");

            return (
              <div key={link.url}>
                <Link
                  href={link.url}
                  className={`flex items-center p-2 space-x-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 ${
                    isActive ? "bg-gray-200 dark:bg-gray-700 font-semibold" : ""
                  }`}
                  onClick={() => {
                    setShowLegend(true);
                  }}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.icon}
                  <span>{link.title}</span>
                  {link.hasSubmenu && (
                    <span className="ml-auto">
                      {isCurrentMapLink && isMapActive ? (
                        showLegend ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )
                      ) : link.hasSubmenu ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : null}
                    </span>
                  )}
                </Link>

                {/* Combined Legend & Layer Selection */}
                {isCurrentMapLink &&
                  link.hasSubmenu &&
                  showLegend &&
                  isMapActive && (
                    <div
                      className={`transition-all duration-300 overflow-hidden ${
                        showLegend
                          ? "max-h-screen opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="pl-6 mt-2 space-y-3 border-l-2 border-gray-200 ml-6">
                        {/* Layer section header */}
                        <div className="flex items-center gap-2 pl-2">
                          <Layers size={16} className="text-gray-600" />
                          <span className="font-medium text-sm">
                            Map Layers
                          </span>
                        </div>

                        {/* Layer toggles */}
                        <div className="space-y-2 pl-2">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={mapLayers.cropStress}
                              onCheckedChange={() => toggleLayer("cropStress")}
                              id="cropStress"
                            />
                            <label
                              htmlFor="cropStress"
                              className="text-sm cursor-pointer flex items-center gap-1"
                            >
                              <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                              <Link
                                href="/dashboard/map/stress"
                                className="hover:underline"
                              >
                                Crop Stress
                              </Link>
                            </label>
                          </div>

                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={mapLayers.cropYield}
                              onCheckedChange={() => toggleLayer("cropYield")}
                              id="cropYield"
                            />
                            <label
                              htmlFor="cropYield"
                              className="text-sm cursor-pointer flex items-center gap-1"
                            >
                              <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                              <Link
                                href="/dashboard/map/yield"
                                className="hover:underline"
                              >
                                Crop Yield
                              </Link>
                            </label>
                          </div>

                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={mapLayers.soilMoisture}
                              onCheckedChange={() =>
                                toggleLayer("soilMoisture")
                              }
                              id="soilMoisture"
                            />
                            <label
                              htmlFor="soilMoisture"
                              className="text-sm cursor-pointer flex items-center gap-1"
                            >
                              <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                              <Link
                                href="/dashboard/map/moisture"
                                className="hover:underline"
                              >
                                Soil Moisture
                              </Link>
                            </label>
                          </div>

                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={mapLayers.soilOrganicCarbon}
                              onCheckedChange={() =>
                                toggleLayer("soilOrganicCarbon")
                              }
                              id="soilOrganicCarbon"
                            />
                            <label
                              htmlFor="soilOrganicCarbon"
                              className="text-sm cursor-pointer flex items-center gap-1"
                            >
                              <div className="w-3 h-3 bg-purple-500 rounded-sm"></div>
                              <Link
                                href="/dashboard/map/soc"
                                className="hover:underline"
                              >
                                Soil Organic Carbon
                              </Link>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            );
          })}
        </nav>
      </SidebarContent>
      <SidebarFooter>
        Developed by{" "}
        <a
          href="https://statsspeak.co.ke"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold hover:underline"
        >
          Statsspeak
        </a>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
