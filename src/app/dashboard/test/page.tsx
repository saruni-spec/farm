"use client"
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import MapLeaflet from './MapLeaflet'

import { counties, constituencies} from "kenya"
import { number } from 'zod'

const Map = () => 
{
    const [allCounties, setAllCounties] = useState([])
    const [allConstituencies, setAllConstituencies] = useState([])
    const [allWards, setAllWards] = useState([])

    const [selectedCounty, setSelectedCounty] =useState("")
    const [selectedConstituency, setSelectedConstituency] = useState("")
    const [selectedWard, setSelectedWard] = useState("")

    //Position coordinates to be updated when the locations are selected. Defaulting it to Nairobi county
    const [lat, setLat] = useState<number>()
    const [long, setLong] = useState<number>()

    useEffect(()=>
    {
        const totalCounties = counties.filter(county => county.name !== "DIASPORA")
        const sortedCounties = totalCounties.sort((a, b) => parseInt(a.code) - parseInt(b.code))
        setAllCounties(sortedCounties)
    }, [])

    useEffect(()=>
    {
        const sortedConstituencies = constituencies.sort((a, b) => parseInt(a.code) - parseInt(b.code))
        setAllConstituencies(sortedConstituencies)
    }, [])

    //Styling for the individual dropdowns
    const dropdownClasses = "flex flex-col w-full"

    //Styling for the select input fields 
    const selectClasses = "mt-1 p-2 border rounded-md disabled:cursor-not-allowed"

    //Styling for the results at the bottom of the page
    const resultsClasses="flex-1 flex flex-col items-center justify-center" 

    return ( 
        <div className='p-3'>
            <div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 rounded-md py-2 px-4 shadow-md">
                <Plus size={16} />Add your farm
            </Button>
            </div>
            <div className='flex flex-col-reverse lg:flex-row justify-around mt-2 gap-4'>
                <MapLeaflet lat={lat} long={long}/>
                <div className='flex-1/3 space-y-4'>
                    <div className={dropdownClasses}>
                        <select name='county' className={selectClasses} onChange={e =>
                            {
                                const countyCode=e.target.value
                                setSelectedCounty(countyCode)

                                // Reset selections
                                setSelectedConstituency("")
                                setSelectedWard("")      
                                setAllWards([])      

                                //Finding the county in the object array
                                const county=allCounties.find(c => c.code === countyCode)

                                //Getting the center of the county
                                const countyCenter=county.center

                                //Setting the map position based on the center
                                const { lat, lon } = countyCenter

                                setLat(lat)
                                setLong(lon)

                                //Setting the constituencies for that county in the dropdown
                                if(county && county.constituencies)
                                {
                                    // Get constituency names in the selected county
                                    const countyConstituencyNames = county.constituencies.map(c => c.name.toLowerCase())

                                    // Filter from all constituencies by matching name
                                    const filtered = constituencies.filter(c => countyConstituencyNames.includes(c.name.toLowerCase())).sort((a, b) => parseInt(a.code) - parseInt(b.code))

                                    setAllConstituencies(filtered)
                                }
                                else
                                {
                                    setAllConstituencies([])
                                }
                            }
                        }>
                            <option value={""}>Select County</option>
                            {
                                allCounties.map(county =>
                                {
                                    return(
                                        <option key={county.code} value={county.code}>{county.name.charAt(0)+ county.name.slice(1).toLowerCase()}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className={dropdownClasses}>
                        <select name='constituency' className={selectClasses} onChange={e =>
                            {
                                const constituencyCode=e.target.value
                                setSelectedConstituency(constituencyCode)

                                //Clearing the selected ward when the constituency changes
                                setSelectedWard("")

                                //Finding the constituency in the constituencies array
                                const constituency=allConstituencies.find(c => c.code === constituencyCode)

                                //Getting the constituency's center
                                const constituencyCenter=constituency.center

                                //Setting the map position based on the center
                                const { lat, lon } = constituencyCenter

                                setLat(lat)
                                setLong(lon)
                                
                                if(constituency && constituency.wards)
                                {
                                    setAllWards(constituency.wards)
                                }
                                else
                                {
                                    setAllWards([])
                                }
                            }
                        } disabled={!selectedCounty}>
                            <option value={""}>Select Constituency</option>
                            {
                                allConstituencies.map(constituency =>
                                {
                                    return(
                                        <option key={constituency.code} value={constituency.code}>{constituency.name.charAt(0)+ constituency.name.slice(1).toLowerCase()}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className={dropdownClasses}>
                        <select name='ward' className={selectClasses} onChange={e => 
                            {
                                const wardCode=e.target.value
                                setSelectedWard(wardCode)

                                //Finding the ward from the list of wards
                                const ward=allWards.find(w => w.code === wardCode)

                                //Extracting the ward's coordinates
                                const wardCenter = ward.center

                                //Setting the map position based on the center
                                const { lat, lon } = wardCenter

                                setLat(lat)
                                setLong(lon)
                            }
                        } disabled={!selectedConstituency}>
                            <option value={""}>Select Ward</option>
                            {
                                allWards.map(ward =>
                                {
                                    return(
                                        <option key={ward.code} value={ward.code}>{ward.name.charAt(0).toUpperCase() + ward.name.slice(1).toLowerCase()}</option>
                                    )
                                }
                                )
                            }
                        </select>
                    </div>
                </div>
            </div>

            <h2 className='text-2xl font-bold mt-2'>Results</h2>
            <div className="flex justify-between gap-12">
                <div className={resultsClasses}>
                    <h3 className="font-semibold text-gray-700 mb-2">Soil Moisture</h3>
                    <p className="text-blue-600 text-2xl font-bold mb-2">34.78 cm<sup>3</sup></p>
                    <p className="text-xs text-gray-600 text-center">Meaning: Average moisture</p>
                </div>
                <div className={resultsClasses}>
                    <h3 className="font-semibold text-gray-700 mb-2">Crop Stress</h3>
                    <p className="text-red-600 text-2xl font-bold mb-2">0.98</p>
                    <p className="text-xs text-gray-600 text-center">Meaning: High Risk of stress</p>
                </div>
                <div className={resultsClasses}>
                    <h3 className="font-semibold text-gray-700 mb-2">Soil Organic Carbon</h3>
                    <p className="text-purple-600 text-2xl font-bold mb-2">24 g/kg</p>
                    <p className="text-xs text-gray-600 text-center">Meaning: Average soil carbon experienced</p>
                </div>
                <div className={resultsClasses}>
                    <h3 className="font-semibold text-gray-700 mb-2">Crop Yield</h3>
                    <p className="text-green-600 text-2xl font-bold mb-2">200 kg/ha</p>
                    <p className="text-xs text-gray-600 text-center">Meaning: Good yield</p>
                </div>
            </div>
        </div>
     )
}
 
export default Map