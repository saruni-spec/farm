"use client"

import { useEffect, useRef } from "react"
import { useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet-draw"
import "leaflet-draw/dist/leaflet.draw.css"

const DrawControl = () => 
{
    const map = useMap()
    const drawControlRef = useRef<L.Control.Draw | null>(null)

    useEffect(() => 
    {
        const drawnItems = new L.FeatureGroup()
        map.addLayer(drawnItems)

        // Remove existing draw control if any
        if (drawControlRef.current) 
        {
            map.removeControl(drawControlRef.current)
        }

        const drawControl = new L.Control.Draw({
        edit: 
        {
            featureGroup: drawnItems,
        },
        draw: 
        {
            polyline: false,
            rectangle: {}, // empty object means enabled with default options
            polygon: {},
            circle: false,
            marker: false,
            circlemarker: false,
        },
        })

        drawControlRef.current = drawControl
        map.addControl(drawControl)

        // Handle newlyt created shapes
        const onDrawCreated = (e: L.LeafletEvent) => 
        {
          const event = e as L.DrawEvents.Created;
          const layer = event.layer as L.Polygon | L.Rectangle;
          const geoJson = layer.toGeoJSON();

          // Extract coordinates from GeoJSON
          const coords = geoJson.geometry.coordinates[0]; // Assuming a single polygon

          // Initialize min/max bounds
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
          console.log("Sending bounding box:", bbox);

          // Send to backend
          const segmentationURL = process.env.NEXT_PUBLIC_API_BASE_URL;

          fetch(`${segmentationURL}/segment`, 
          {
            method: "POST",
            headers: 
            {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ bbox }),
          })
          .then((res) => res.json())
          .then((data) => 
          {
            console.log("Backend response:", data);
          })
          .catch((err) => 
          {
            console.error("Failed to send bbox:", err);
          });
        };

        // Handle edits to existing shapes
        const onDrawEdited = (e: L.LeafletEvent) => 
        {
            const event = e as L.DrawEvents.Edited;
            event.layers.eachLayer((layer: L.Layer) => 
            {
                if (layer instanceof L.Polygon || layer instanceof L.Rectangle) 
                {
                    console.log("Edited shape:", layer.toGeoJSON());
                }
            });
        };

        map.on("draw:created", onDrawCreated)
        map.on("draw:edited", onDrawEdited)

        return () => 
        {
            if (drawControlRef.current) 
            {
                map.removeControl(drawControlRef.current)
            }
            map.removeLayer(drawnItems)
            map.off("draw:created", onDrawCreated)
        }
    }, [map])

    return null
}

export default DrawControl