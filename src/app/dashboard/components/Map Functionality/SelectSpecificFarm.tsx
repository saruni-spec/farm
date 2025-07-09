"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { feature } from "@/types/geometry";

const SelectSpecificFarm = ({ geoData }: { geoData: feature[] }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !geoData) return;
    if (geoData.length === 0) return;

    // Defensive: safely create pane
    let pane = map.getPane("specificFarmPane");
    if (!pane) {
      map.createPane("specificFarmPane");
      pane = map.getPane("specificFarmPane");
    }

    if (pane) pane.style.zIndex = "450";

    const layers: L.Layer[] = [];

    geoData.forEach((feature) => {
      feature["type"] = "Feature";
      const layer = L.geoJSON(feature, {
        pane: "specificFarmPane",

        style: {
          color: "#FFA500",
          weight: 3,
          fillColor: "#FFA500",
          fillOpacity: 0.5,
        },
      }).addTo(map);
      layers.push(layer);
    });

    const group = L.featureGroup(layers);
    map.fitBounds(group.getBounds(), {
      animate: false,
      padding: [10, 10],
    });

    return () => layers.forEach((layer) => map.removeLayer(layer));
  }, [geoData, map]);

  return null;
};

export default SelectSpecificFarm;
