/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react' // Optional: spinning icon
import type { FeatureCollection } from "geojson"
import { supabase } from '@/superbase/client'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

const MapLeaflet = dynamic(() => import('./Map Functionality/Map Leaflet'), { ssr: false })

const Map = ({ lat = -1.286389, long = 36.817223, height = 500, segmenting, setIsSegmenting, saving, setSaving, selectedFarm }: { lat: number; long: number; height?: number, segmenting: boolean, setIsSegmenting: (arg0: boolean) => void , saving: boolean, setSaving: (arg0: boolean) => void; selectedFarm: any; }) => 
{
    const backendURL = process.env.NEXT_PUBLIC_API_BASE_URL
    const router = useRouter()
    const [geoData, setGeoData] = useState<FeatureCollection | undefined>(undefined)
    const [bbox, setBbox] = useState<number[] | null>(null)

    const [farmNameModal, setFarmNameModal] = useState<boolean>(false)
    const [farmName, setFarmName] = useState<string | null>(null)

    const getFarmerID = async () =>
    {
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error

        // Getting the ID of the farmer
        const farmer_id = data?.session?.user.id

        return farmer_id
    }

    const onDrawFinish = (bbox: number[], geoJson: FeatureCollection) => 
    {
        setBbox(bbox)
        setGeoData(geoJson)
    }

    useEffect(() => 
    {
        if(!selectedFarm || !selectedFarm.geom)
        {
            setGeoData(undefined)
            return
        }
        
        const featureCollection: FeatureCollection = 
        {
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    geometry: selectedFarm.geom,
                    properties: {}
                }
            ]
        }

        setGeoData(featureCollection)
        
    }, [selectedFarm])

    const segmentFarm = () => 
    {
        if(!bbox)
        {
            toast.error("Please draw a field area first")
            return
        }

        setIsSegmenting(true)

        fetch(`${backendURL}/segment`, 
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
            toast.success("Field area segmented successfully")
        })
        .catch(err =>
        {
            console.error("Error fetching segmentation:", err)
            toast.error("Failed to process area. Please try again.")
        })
        .finally(() => 
        {
            setIsSegmenting(false)
            setBbox(null)
        })
    }

    const saveFarm = async () =>
    {
        if(!bbox)
        {
            toast.error("Please draw a field area first")
            return
        }

        try 
        {
            const farmer_id = await getFarmerID()
            if (!farmer_id) 
            {
                toast.error("User not authenticated",
                    {
                        onClose: () => router.push("/account/login")
                    }
                )
            }

            setSaving(true)

            const response = await fetch(`${backendURL}/api/farm`, 
            {
                method: "POST",
                headers: 
                {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(
                {
                    farmer_id: farmer_id,
                    geometry: geoData?.features[0].geometry,
                    farmName: farmName
                })
            })

            if (!response.ok) 
            {
                const errorMessage = await response.json()
                throw new Error(`Failed to save farm: ${errorMessage.error}`)
            }

            const result = await response.json()
            console.log(result)
            toast.success(result.message)
        } 
        catch (err: any) 
        {
            console.error("Error saving farm:", err)
            toast.error(err.message || "Failed to save farm. Try again later")
        } 
        finally 
        {
            setSaving(false)
            setGeoData(undefined)
            setBbox(null)
        }
    }

    //Saving the selected area without segmenting
    const saveSelectedArea = async () => 
    {
        if (!bbox) 
        {
            toast.error("Please draw a field area first");
            return;
        }

        try 
        {
            const farmer_id = await getFarmerID();
            if (!farmer_id) 
            {
                toast.error("User not authenticated", 
                {
                    onClose: () => router.push("/account/login")
                });
                return;
            }

            setSaving(true)

            const response = await fetch(`${backendURL}/api/selected_area`, 
            {
                method: "POST",
                headers: 
                {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(
                {
                    farmer_id: farmer_id,
                    geometry: geoData?.features[0].geometry
                })
            })

            if (!response.ok) 
            {
                const errorMessage = await response.json()
                throw new Error(`Failed to save selected area: ${errorMessage.error}`)
            }

            const result = await response.json()
            console.log(result)
            toast.success(result.message || "Selected area saved successfully")
        } 
        catch (err: any) 
        {
            toast.error(err.message || "Failed to save selected area. Try again later")
        } 
        finally 
        {
            setSaving(false)
            setGeoData(undefined)
            setBbox(null)
        }
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
                <div className='flex flex-row gap-4'>
                    <Button variant={"landingGreen"} onClick={()=> setFarmNameModal(true)} disabled={!bbox}>Save farm</Button>
                    <Button variant={"save"} onClick={()=> saveSelectedArea()} disabled={segmenting || !bbox}>
                        {
                            saving
                            ?
                                <>
                                    <Loader2 className='w-4 h-4 mr-2 animate-spin'/>
                                    Saving...
                                </>
                            :
                                "Save selected area"
                        }
                    </Button>
                    <Button variant={"save"} onClick={() => segmentFarm()} disabled={segmenting || !bbox}>
                        {
                            segmenting 
                            ? 
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Segmenting...
                                </>
                            : 
                                "Segment farm"
                        }
                    </Button>
                </div>
            </div>

            {
                farmNameModal && 
                (
                    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm" onClick={() => setFarmNameModal(false)}>
                        <form onSubmit={async (e) => 
                        {
                            e.preventDefault()
                            await saveFarm()
                            setFarmNameModal(false)
                        }} className="bg-white rounded-lg shadow-lg p-6 w-80 relative"  onClick={(e) => e.stopPropagation()}>
                            <label className="block mb-2 text-gray-700 font-semibold">Farm Name</label>
                            <input type="text" name="farmName" onChange={e => setFarmName(e.target.value)} placeholder='Enter farm name' required className="mb-4 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-400" />
                            <div className="flex justify-end gap-4">
                                <Button variant={"save"} type="submit" disabled={saving}>
                                    {
                                        saving
                                        ?
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin"/>Saving farm
                                            </>
                                        :
                                            "Save farm"
                                    }
                                </Button>
                                <Button variant={"landingGreen"} type="button" onClick={() => setFarmNameModal(false)} disabled={saving}>Cancel</Button>
                            </div>
                        </form>
                    </div>
                )
            }


            <MapLeaflet lat={lat} long={long} height={height} geoData={geoData} onDrawFinish={onDrawFinish}/>
        </div>
    )
}

export default Map
