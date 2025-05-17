"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import { Position } from "geojson";
import { createFarm } from "@/app/actions/actions";

type drawings = "farm" | "segment";

const DrawControl = ({ mode }: { mode: drawings }) => {
  const map = useMap();
  const drawControlRef = useRef<L.Control.Draw | null>(null);

  useEffect(() => {
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    // Remove existing draw control if any
    if (drawControlRef.current) {
      map.removeControl(drawControlRef.current);
    }

    const drawControl = new L.Control.Draw({
      edit: {
        featureGroup: drawnItems,
      },
      draw: {
        polyline: false,
        rectangle: {},
        polygon: {},
        circle: false,
        marker: false,
        circlemarker: false,
      },
    });

    drawControlRef.current = drawControl;
    map.addControl(drawControl);

    const onDrawCreated = async (e: L.LeafletEvent) => {
      if (mode !== "farm") return;
      const event = e as L.DrawEvents.Created;
      const layer = event.layer as L.Polygon | L.Rectangle;
      drawnItems.addLayer(layer);

      const geojson = layer.toGeoJSON();
      console.log("Drawn shape:", geojson);
      const coordinates = geojson.geometry.coordinates as Position[][];

      await createFarm("Farm", coordinates);
    };

    map.on("draw:created", onDrawCreated);

    return () => {
      if (drawControlRef.current) {
        map.removeControl(drawControlRef.current);
      }
      map.removeLayer(drawnItems);
      map.off("draw:created", onDrawCreated);
    };
  }, [map]);

  return null;
};

export default DrawControl;
