/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import type { FeatureCollection } from "geojson";
import useDashboardStore from "@/stores/useDashboardStore";

const DrawControl = ({
  onDrawFinish,
}: {
  onDrawFinish: (bbox: number[], geoJson: FeatureCollection) => void;
}) => {
  const { createdSegments: segmentedFarms } = useDashboardStore();
  const map = useMap();
  const drawControlRef = useRef<L.Control.Draw | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);

  useEffect(() => {
    if (!map) return;

    // Create FeatureGroup for drawn layers, add to map once
    if (!drawnItemsRef.current) {
      drawnItemsRef.current = new L.FeatureGroup();
      map.addLayer(drawnItemsRef.current);
    }
    const drawnItems = drawnItemsRef.current;

    // Remove existing draw control if any
    if (drawControlRef.current) {
      map.removeControl(drawControlRef.current);
    }

    // Create draw control with polygon, rectangle, edit, and remove enabled
    const drawControl = new L.Control.Draw({
      edit: {
        featureGroup: drawnItems,
        edit: {},
        remove: true,
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

    // Handle shape creation
    const onDrawCreated = (e: L.DrawEvents.Created) => {
      const layer = e.layer as L.Polygon | L.Rectangle;

      // Add to FeatureGroup (so it can be edited/deleted)
      drawnItems.addLayer(layer);

      if ("disableEdit" in layer) {
        (layer as any).disableEdit();
      }
      // Convert to GeoJSON
      const geoJsonFeature = layer.toGeoJSON();

      // Calculate bounding box
      const coords = geoJsonFeature.geometry.coordinates[0] as [
        number,
        number
      ][];

      let minLng = coords[0][0];
      let minLat = coords[0][1];
      let maxLng = coords[0][0];
      let maxLat = coords[0][1];

      coords.forEach(([lng, lat]) => {
        if (lng < minLng) minLng = lng;
        if (lng > maxLng) maxLng = lng;
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
      });

      const bbox = [minLng, minLat, maxLng, maxLat];

      // Create FeatureCollection
      const geoJsonFeatureCollection: FeatureCollection = {
        type: "FeatureCollection",
        features: [geoJsonFeature],
      };

      // Callback with bbox and geojson
      onDrawFinish(bbox, geoJsonFeatureCollection);
    };

    // Handle edits
    const onDrawEdited = (e: L.DrawEvents.Edited) => {
      const layers = e.layers;
      layers.eachLayer((layer) => {
        if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
          // You can handle updated shapes here if you want
          // For example, send updated shapes to onDrawFinish
          const geoJsonFeature = layer.toGeoJSON();
          const coords = geoJsonFeature.geometry.coordinates[0] as [
            number,
            number
          ][];

          let minLng = coords[0][0];
          let minLat = coords[0][1];
          let maxLng = coords[0][0];
          let maxLat = coords[0][1];

          coords.forEach(([lng, lat]) => {
            if (lng < minLng) minLng = lng;
            if (lng > maxLng) maxLng = lng;
            if (lat < minLat) minLat = lat;
            if (lat > maxLat) maxLat = lat;
          });

          const bbox = [minLng, minLat, maxLng, maxLat];

          const geoJsonFeatureCollection: FeatureCollection = {
            type: "FeatureCollection",
            features: [geoJsonFeature],
          };

          onDrawFinish(bbox, geoJsonFeatureCollection);
        }
      });
    };

    map.on("draw:created", onDrawCreated as L.LeafletEventHandlerFn);
    map.on("draw:edited", onDrawEdited as L.LeafletEventHandlerFn);

    return () => {
      if (drawControlRef.current) {
        map.removeControl(drawControlRef.current);
      }
      if (drawnItemsRef.current) {
        map.removeLayer(drawnItemsRef.current);
        drawnItemsRef.current = null;
      }
      map.off("draw:created", onDrawCreated as L.LeafletEventHandlerFn);
      map.off("draw:edited", onDrawEdited as L.LeafletEventHandlerFn);
    };
  }, [map, onDrawFinish]);

  useEffect(() => {
    if (segmentedFarms && segmentedFarms.length > 0 && drawnItemsRef.current) {
      drawnItemsRef.current.clearLayers();

      const svgElements = map
        .getContainer()
        .querySelectorAll("path.leaflet-interactive");
      svgElements.forEach((el) => el.remove());

      const svgElement = map
        .getContainer()
        .querySelectorAll("leaflet-interactive");
      svgElement.forEach((el) => el.remove());

      document
        .querySelectorAll("leaflet-interactive")
        .forEach((el) => el.remove());
    }
  }, [segmentedFarms]);

  return null;
};

export default DrawControl;
