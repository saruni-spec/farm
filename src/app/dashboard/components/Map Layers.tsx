"use client"
import { useState, useEffect } from "react";

import { RefreshCcw } from "lucide-react";

import { counties, constituencies} from "kenya";

// Define the types for county, constituency, and ward
interface County {
    name: string;
    code: string;
    center: {
        lat: number;
        lon: number;
    };
    constituencies: { name: string; code: string; }[]; 
}

interface Constituency {
    name: string;
    code: string;
    center: {
        lat: number;
        lon: number;
    };
    wards: { name: string; code: string; center: { lat: number; lon: number; }; }[]; 
}

interface Ward {
    name: string;
    code: string;
    center: {
        lat: number;
        lon: number;
    };
}

//Defining an interface for the setters being received as props
interface MapLayersProps {
  setLat: (lat: number) => void;
  setLong: (lon: number) => void;
}


const MapLayers = ({ setLat, setLong}: MapLayersProps) => 
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

    console.assert(selectedWard)

    const overlayOptions = ["Crop Stress (NDVI)", "Soil Moisture", "Soil Carbon"]

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
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Map Layers</h2>

            {/* Location selectors */}
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

            {/* Overlays */}
            <div>
                <label className="block text-sm font-medium mb-2">Overlay</label>
                <div className="space-y-2">
                {
                    overlayOptions.map(layer => 
                    {
                        return(
                            <div key={layer} className="flex items-center">
                                <input type="radio" name="overlay" value={layer.toLowerCase().replace(/ /g, "-")} className="h-4 w-4 text-blue-600 border-gray-300"/>
                                <label className="ml-2 text-sm text-gray-700">{layer}</label>
                            </div>
                        )
                    })
                }
                </div>
            </div>

            {/* Date Range */}
            <div>
                <label className="block text-sm font-medium mb-2">Date Range</label>
                <div className="flex gap-2">
                    <input type="date" className="w-full rounded-md border-gray-300" />
                    <input type="date" className="w-full rounded-md border-gray-300" />
                </div>
            </div>

            {/* Update Button */}
            <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 mt-2">
                <RefreshCcw size={18}/>
                Update Map
            </button>
        </div>
    );
};

export default MapLayers;
