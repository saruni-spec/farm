"use client"
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

import dynamic from 'next/dynamic'
const MapLeaflet = dynamic(() => import('./Map Leaflet'), { ssr: false })

import { counties, constituencies} from "kenya";
import AddFarm from './Add Farm'

// Define the types for county, constituency, and ward
interface County {
    name: string;
    code: string;
    center: {
        lat: number;
        lon: number;
    };
    constituencies: { name: string; code: string; }[]; // Add the correct type for constituencies
}

interface Constituency {
    name: string;
    code: string;
    center: {
        lat: number;
        lon: number;
    };
    wards: { name: string; code: string; center: { lat: number; lon: number; }; }[]; // Add the correct type for wards
}

interface Ward {
    name: string;
    code: string;
    center: {
        lat: number;
        lon: number;
    };
}

//Creating a result card for the results at the bottom
const ResultCard = (
    {title, value, meaning, color, }: { title: string; value: string; meaning: string; color: string;}) => 
    (
        <div className="flex-1 flex flex-col items-center justify-center">
            <h3 className="text-md lg:text-lg font-semibold text-gray-700 mb-2">{title}</h3>
            <p className={`lg:text-2xl font-bold mb-1 ${color}`}>{value}</p>
            <p className="text-xs text-gray-500">{meaning}</p>
        </div>
    );

const Map = () => 
{
    const [allCounties, setAllCounties] = useState<County[]>([]); 
    const [allConstituencies, setAllConstituencies] = useState<Constituency[]>([]);
    const [allWards, setAllWards] = useState<Ward[]>([]);

    const [loadingCounties, setLoadingCounties] = useState(false);
    const [loadingConstituencies, setLoadingConstituencies] = useState(false);
    const [loadingWards, setLoadingWards] = useState(false);

    const [selectedCounty, setSelectedCounty] =useState("")
    const [selectedConstituency, setSelectedConstituency] = useState("")
    const [selectedWard, setSelectedWard] = useState("")

    console.log(selectedWard)

    //Position coordinates to be updated when the locations are selected. Defaulting it to Nairobi county
    const [lat, setLat] = useState<number>(-1.286389);
    const [long, setLong] = useState<number>(36.817223);

    useEffect(()=>
    {
        setLoadingCounties(true);
        const totalCounties = counties.filter(county => county.name !== "DIASPORA")
        const sortedCounties = totalCounties.sort((a, b) => parseInt(a.code) - parseInt(b.code))
        setAllCounties(sortedCounties)
        setLoadingCounties(false);
    }, [])

    useEffect(()=>
    {
        setLoadingConstituencies(true)
        const sortedConstituencies = constituencies.sort((a, b) => parseInt(a.code) - parseInt(b.code))
        setAllConstituencies(sortedConstituencies)
        setLoadingConstituencies(false)
    }, [])

    const handleCountyChange = (e: React.ChangeEvent<HTMLSelectElement>) => 
    {
        const code = e.target.value;
        setSelectedCounty(code);
        setSelectedConstituency("");
        setSelectedWard("");
        setAllWards([]);

        const county = allCounties.find((c) => c.code === code);
        if (county?.center) 
        {
            setLat(county.center.lat);
            setLong(county.center.lon);
        }

        if (county?.constituencies) 
        {
            const names = county.constituencies.map((c) => c.name.toLowerCase());
            const filtered = constituencies.filter((c) => names.includes(c.name.toLowerCase())).sort((a, b) => parseInt(a.code) - parseInt(b.code));
            setAllConstituencies(filtered);
        } 
        else 
        {
            setAllConstituencies([]);
        }
    };

    const handleConstituencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => 
    {
        const code = e.target.value;
        setSelectedConstituency(code);
        setSelectedWard("");
        setLoadingWards(true);

        const constituency = allConstituencies.find((c) => c.code === code);
        if (constituency?.center) 
        {
            setLat(constituency.center.lat);
            setLong(constituency.center.lon);
        }

        if (constituency?.wards) 
        {
            setAllWards(constituency.wards);
            setLoadingWards(false);
        }
        else 
        {
            setAllWards([]);
        }
    };

    const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => 
    {
        const code = e.target.value;
        setSelectedWard(code);
    
        const ward = allWards.find((w) => w.code === code);
        if (ward?.center) 
        {
          setLat(ward.center.lat);
          setLong(ward.center.lon);
        }
    };

    //Styling for the individual dropdowns
    const dropdownClasses = "flex flex-col w-full"

    //Styling for the select input fields 
    const selectClasses = "mt-1 p-2 border rounded-md disabled:cursor-not-allowed disabled:bg-gray-100"

    return ( 
        <div className='p-3'>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant={'save'}>
                        <Plus size={16} />Add your farm
                    </Button>
                </DialogTrigger>
                <DialogContent className="z-[9999] w-full">
                    <DialogHeader>
                        <DialogTitle>Add a new farm</DialogTitle>
                        <DialogDescription>Create a new farm. Click save when you&apos;re done</DialogDescription>
                    </DialogHeader>
                    <AddFarm lat={lat} long={long}/>
                    <DialogFooter>
                        <Button variant={'save'}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <div className='flex flex-col-reverse lg:flex-row lg:justify-around mt-2 gap-4'>
                <MapLeaflet lat={lat} long={long}/>
                <div className='lg:flex-1/3 space-y-4'>
                    <div className={dropdownClasses}>
                        <select name='county' className={selectClasses} onChange={handleCountyChange}>
                            <option value={""}>Select County</option>
                            {
                                loadingCounties
                                ?
                                    <option>Loading...</option>
                                :
                                    (
                                        allCounties.map(county =>
                                        {
                                            return(
                                                <option key={county.code} value={county.code}>{county.name.charAt(0)+ county.name.slice(1).toLowerCase()}</option>
                                            )
                                        })
                                    )
                            }
                        </select>
                    </div>
                    <div className={dropdownClasses}>
                        <select name='constituency' className={selectClasses} onChange={handleConstituencyChange} disabled={!selectedCounty}>
                            <option value={""}>Select Constituency</option>
                            {
                                loadingConstituencies
                                ?
                                    <option>Loading...</option>
                                :
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
                        <select name='ward' className={selectClasses} onChange={handleWardChange} disabled={!selectedConstituency}>
                            <option value={""}>Select Ward</option>
                            {
                                loadingWards
                                ?
                                    <option>Loading...</option>
                                :
                                    allWards.map(ward =>
                                    {
                                        return(
                                            <option key={ward.code} value={ward.code}>{ward.name.charAt(0).toUpperCase() + ward.name.slice(1).toLowerCase()}</option>
                                        )
                                    })
                            }
                        </select>
                    </div>
                </div>
            </div>

            <h2 className='text-2xl font-bold mt-3 mb-4'>Results</h2>
            <div className="grid grid-cols-2 gap-2 lg:flex lg:justify-between lg:gap-16">
                <ResultCard title='Soil Moisture' value="34.78 cm³" meaning='Average moisture' color='text-blue-600'/>
                <ResultCard title='Crop Stress' value="0.98" meaning='High risk of stress' color='text-red-600'/>
                <ResultCard title='Organic Carbon' value="24 g/kg" meaning='Average soil carbon experienced' color='text-purple-600'/>
                <ResultCard title='Crop Yield' value="200 kg/ha" meaning='Good yield' color='text-green-600'/>
            </div>
        </div>
     )
}
 
export default Map