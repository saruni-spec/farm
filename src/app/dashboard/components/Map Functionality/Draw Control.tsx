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
            const event = e as L.DrawEvents.Created
            const layer = event.layer as L.Polygon | L.Rectangle
            drawnItems.addLayer(layer)
            console.log("Drawn shape:", layer.toGeoJSON())
        }

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