import Link from "next/link";

const ManagementZones = () => 
{
    const managementZones = [
        {
        title: "High Stress Zone",
        size: "2.5 acres",
        type: "Critical",
        },
        {
        title: "North Crop Block",
        size: "4.1 acres",
        type: "Stable",
        },
    ];

    return (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
 
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">Management Zones</h2>
                <Link href={"#"} className="text-sm text-blue-600 hover:underline font-medium">Create New Zone</Link>
            </div>

            {
                managementZones.map((zone) => 
                {
                    return(
                        <div key={zone.title} className="border border-gray-200 rounded-md p-4 hover:shadow-sm transition">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-md font-medium text-gray-700">{zone.title}</h3>
                                <span className={`text-xs px-3 py-1 rounded-full font-semibold text-white ${zone.type === "Critical" ? "bg-red-600" : "bg-green-600"}`}>{zone.type} </span>
                            </div>
                            <p className="text-sm text-gray-500">Size: {zone.size}</p>
                        </div>
                    )
                })
            }
        </div>
    );
};

export default ManagementZones;
