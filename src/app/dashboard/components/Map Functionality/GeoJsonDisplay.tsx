import { useMap } from "react-leaflet"
import { useEffect } from "react"
import L from "leaflet"
import { GeoJSON } from "react-leaflet"
import type { FeatureCollection } from "geojson"

const GeoJsonDisplay = ({ geoData }: { geoData: FeatureCollection }) => 
{
    const map = useMap()

    useEffect(() => 
    {
        if (geoData) 
        {
            const layer = L.geoJSON(geoData)
            map.fitBounds(layer.getBounds())
        }
    }, [geoData, map])

    return (
        <GeoJSON key={JSON.stringify(geoData)} data={geoData} style={{ color: "#FFA500", weight: 2, fillOpacity: 0.4 }} />
    )
}

export default GeoJsonDisplay