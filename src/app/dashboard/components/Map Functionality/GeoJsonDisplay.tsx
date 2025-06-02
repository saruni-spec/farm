'use client'

import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import type { FeatureCollection } from 'geojson'

const GeoJsonDisplay = ({ geoData }: { geoData: FeatureCollection }) => 
{
    const map = useMap()

    useEffect(() => 
    {
        if (!map || !geoData) return

        // Defensive: safely create pane
        let pane = map.getPane('segmentsPane')
        if (!pane) 
        {
            map.createPane('segmentsPane')
            pane = map.getPane('segmentsPane')
        }

        if (pane) pane.style.zIndex = '450'

        const layers: L.Layer[] = []

        geoData.features.forEach(feature => 
        {
            const layer = L.geoJSON(feature, 
            {
                pane: 'segmentsPane',
                style: 
                {
                    color: '#FFA500',
                    weight: 2,
                    fillColor: '#FFA500',
                    fillOpacity: 0.4,
                },
            }).addTo(map)
            layers.push(layer)
        })

        const group = L.featureGroup(layers)
        map.fitBounds(group.getBounds(), 
        {
            animate: false,
            padding: [10, 10],
        })

        return () => layers.forEach(layer => map.removeLayer(layer))

    }, [geoData, map])

    return null
}

export default GeoJsonDisplay