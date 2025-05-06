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

// Define the props interface, including the new callback
interface AppSidebarProps {
  // Callback function triggered when a layer checkbox is toggled
  // It receives the layer name and its new checked state (boolean)
  onLayerToggle: (layer: Layer, isChecked: boolean) => void;
  // Optional: You might want to pass the initial/current state of layers
  // managed by the parent component to keep the checkboxes in sync if
  // the sidebar state isn't the single source of truth.
  // currentMapLayers?: { [key in Layer]: boolean };
}

// Accept the new prop
const AppSidebar = ({ onLayerToggle }: AppSidebarProps) => {
  const pathName = usePathname();
  const [showLegend, setShowLegend] = useState(false);

  // We keep a local state for the checkboxes' checked status
  // This state dictates how the checkboxes *look* in the sidebar UI.
  // The parent component will use the onLayerToggle callback to manage
  // the actual state used by the map.
  const [mapLayers, setMapLayers] = useState({
    cropStress: true,
    cropYield: true,
    soilMoisture: true,
    soilOrganicCarbon: true,
  });

  // Toggle function for layer visibility (updates local state AND calls parent callback)
  const handleCheckboxToggle = (layer: Layer) => {
    // Calculate the new state
    const newCheckedState = !mapLayers[layer];

    // Update the local state for the checkbox appearance
    setMapLayers({
      ...mapLayers,
      [layer]: newCheckedState,
    });

    // Call the parent's callback function to report the change
    onLayerToggle(layer, newCheckedState);
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
    // Add other navigation items here
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
            const isCurrentMapLink = link.url.includes("map"); // Check if this is the Map link

            return (
              <div key={link.url}>
                {/* The main navigation link */}
                <Link
                  href={link.url}
                  className={`flex items-center p-2 space-x-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 ${
                    isActive ? "bg-gray-200 dark:bg-gray-700 font-semibold" : ""
                  }`}
                  // Keep the onClick to toggle the submenu visibility when clicking the main map link
                  onClick={() => {
                    // Only toggle legend for the map link when it's active
                    if (isCurrentMapLink && isMapActive) {
                      setShowLegend(!showLegend);
                    } else {
                      // Optionally, if not the map link or not active, just navigate
                      // and assume parent page handles initial legend state
                      setShowLegend(false); // Or set based on parent state
                    }
                  }}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.icon}
                  <span>{link.title}</span>
                  {link.hasSubmenu && (
                    <span className="ml-auto">
                      {/* Show chevron based on legend state for the active map link */}
                      {isCurrentMapLink && isMapActive ? (
                        showLegend ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )
                      ) : (
                        // Keep default chevron for other submenu items if any
                        link.hasSubmenu && <ChevronDown className="h-4 w-4" />
                      )}
                    </span>
                  )}
                </Link>

                {/* Layer Selection Submenu - Only shows for the active Map link */}
                {isCurrentMapLink &&
                  link.hasSubmenu &&
                  showLegend && // Only show if showLegend is true
                  isMapActive && ( // Only show when on the map page path
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

                        {/* Layer toggles - Checkbox and simple text label */}
                        <div className="space-y-2 pl-2">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={mapLayers.cropStress}
                              // Use the new handler which calls the parent callback
                              onCheckedChange={() =>
                                handleCheckboxToggle("cropStress")
                              }
                              id="cropStress"
                            />
                            {/* REMOVED LINK: Label now directly controls the checkbox */}
                            <label
                              htmlFor="cropStress"
                              className="text-sm cursor-pointer flex items-center gap-1 hover:text-gray-800 dark:hover:text-gray-200" // Added hover styles for label
                            >
                              <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                              Crop Stress {/* Plain text */}
                            </label>
                          </div>

                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={mapLayers.cropYield}
                              onCheckedChange={() =>
                                handleCheckboxToggle("cropYield")
                              }
                              id="cropYield"
                            />
                            {/* REMOVED LINK */}
                            <label
                              htmlFor="cropYield"
                              className="text-sm cursor-pointer flex items-center gap-1 hover:text-gray-800 dark:hover:text-gray-200"
                            >
                              <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                              Crop Yield {/* Plain text */}
                            </label>
                          </div>

                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={mapLayers.soilMoisture}
                              onCheckedChange={() =>
                                handleCheckboxToggle("soilMoisture")
                              }
                              id="soilMoisture"
                            />
                            {/* REMOVED LINK */}
                            <label
                              htmlFor="soilMoisture"
                              className="text-sm cursor-pointer flex items-center gap-1 hover:text-gray-800 dark:hover:text-gray-200"
                            >
                              <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                              Soil Moisture {/* Plain text */}
                            </label>
                          </div>

                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={mapLayers.soilOrganicCarbon}
                              onCheckedChange={() =>
                                handleCheckboxToggle("soilOrganicCarbon")
                              }
                              id="soilOrganicCarbon"
                            />
                            {/* REMOVED LINK */}
                            <label
                              htmlFor="soilOrganicCarbon"
                              className="text-sm cursor-pointer flex items-center gap-1 hover:text-gray-800 dark:hover:text-gray-200"
                            >
                              <div className="w-3 h-3 bg-purple-500 rounded-sm"></div>
                              Soil Organic Carbon {/* Plain text */}
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
