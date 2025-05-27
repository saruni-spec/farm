"use client"
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react' // Optional: spinning icon
import type { FeatureCollection } from "geojson"

const MapLeaflet = dynamic(() => import('./Map Functionality/Map Leaflet'), { ssr: false })

const Map = ({ lat = -1.286389, long = 36.817223, height = 500, segmenting, setIsSegmenting }: { lat: number; long: number; height?: number, segmenting: boolean, setIsSegmenting: (arg0: boolean) => void  }) => 
{
    const [geoData, setGeoData] = useState<FeatureCollection | undefined>(undefined)
    const [bbox, setBbox] = useState<number[] | null>(null)
    const [error, setError] = useState<string | null>(null)

    const onDrawFinish = (bbox: number[], geoJson: FeatureCollection) => 
    {
        setBbox(bbox)
        setGeoData(geoJson)
    }

    const segmentFarm = () => 
    {
        if(!bbox)
        {
            setError("Please draw a field area first")
            return
        }
        const segmentationURL = process.env.NEXT_PUBLIC_API_BASE_URL

        setIsSegmenting(true)

        fetch(`${segmentationURL}/segment`, 
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bbox }),
        })
        .then(res => res.json())
        .then(data => 
        {
            console.log("Fetched GeoJSON:", data)
            setGeoData(data)
            setError(null)
        })
        .catch(err =>
        {
            console.error("Error fetching segmentation:", err)
            setError("Failed to process area. Please try again.")
        })
        .finally(() => 
        {
            setIsSegmenting(false)
        })
    }

    return (
        <div className="bg-white rounded-lg shadow p-6 relative min-h-[500px]">
            {
                segmenting && 
                (
                    <div className="absolute inset-0 bg-white bg-opacity-80 z-50 flex flex-col items-center justify-center rounded-lg">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
                        <span className="text-sm text-gray-700">Segmenting field area...</span>
                    </div>
                )
            }

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Field Map</h2>
                <Button variant={"save"} onClick={() => segmentFarm()} disabled={segmenting || !bbox}>
                    {
                        segmenting 
                        ? 
                            (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Segmenting...
                                </>
                            ) 
                        : 
                            (
                                "Segment"
                            )
                    }
                </Button>
            </div>

            <MapLeaflet lat={lat} long={long} height={height} geoData={geoData} error={error}  onDrawFinish={onDrawFinish}/>
        </div>
    )
}

export default Map
