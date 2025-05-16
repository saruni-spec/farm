import AnalysisCards from "./components/Analysis Cards";
import ManagementZones from "./components/Management Zones";
import Map from "./components/Map";
import MapLayers from "./components/Map Layers";

const Dashboard = () => 
{
    return ( 
        <div className="py-22 px-3 text-black">
            <AnalysisCards/>
            <div className="flex flex-col lg:flex-row gap-3 mt-3">
                <div className="lg:w-2/3">
                    <Map/>
                </div>
                <div className="lg:w-1/3 space-y-4">
                    <MapLayers/>
                    <ManagementZones/>
                </div>
            </div>
        </div>
     );
}
 
export default Dashboard;