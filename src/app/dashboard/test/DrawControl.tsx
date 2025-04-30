"use client"

import { useEffect } from "react"
import { useMap } from "react-leaflet"
import L, { Layer } from "leaflet"
import "leaflet-draw"

const DrawControl = () => 
{
    const map = useMap()

    useEffect(() => 
    {
        const drawnItems = new L.FeatureGroup()
        map.addLayer(drawnItems)

        // Remove existing draw control (avoid duplicates)
        const existingControls = map._controlContainer?.querySelector(".leaflet-draw-toolbar")
        if (existingControls) 
        {
            const drawControl = map._controls?.find((ctrl: unknown) => ctrl instanceof L.Control.Draw)
            if (drawControl) 
            {
                map.removeControl(drawControl)
            }
        }

        const drawControl = new L.Control.Draw(
        {
            edit: 
            {
                featureGroup: drawnItems,
            },
            draw: 
            {
                polyline: false,
                rectangle: true,
                polygon: true,
                circle: false,
                marker: false,
                circlemarker: false,
            },
        })

        map.addControl(drawControl)

        // Typed listener
        const onDrawCreated = (e: L.DrawEvents.Created) => 
        {
            const layer: Layer = e.layer
            drawnItems.addLayer(layer)
            console.log("Drawn shape:", layer.toGeoJSON())
        }

        map.on(L.Draw.Event.CREATED as keyof L.DrawEvents, onDrawCreated)

        return () => 
        {
            map.removeControl(drawControl)
            map.removeLayer(drawnItems)
            map.off(L.Draw.Event.CREATED as keyof L.DrawEvents, onDrawCreated)
        }
    }, [map])

    return null
}

export default DrawControl