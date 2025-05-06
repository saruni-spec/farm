"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import { saveFarm } from "@/app/actions/actions";

const DrawControl = () => {
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
        rectangle: {}, // empty object means enabled with default options
        polygon: {},
        circle: false,
        marker: false,
        circlemarker: false,
      },
    });

    drawControlRef.current = drawControl;
    map.addControl(drawControl);

    // Handler
    const onDrawCreated = (e: L.LeafletEvent) => {
      const event = e as L.DrawEvents.Created;
      const layer = event.layer as L.Polygon | L.Rectangle;
      drawnItems.addLayer(layer);

      const geojson = layer.toGeoJSON();
      console.log("Drawn shape:", geojson);
      const coordinates = geojson.geometry.coordinates;
      saveFarm(coordinates, 1, "Farm");
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
