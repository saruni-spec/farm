import { Flame, Droplet, Sprout, HeartPulse, } from "lucide-react";

const AnalysisCards = () => 
{
     const iconSize=32

    const cropAnalysis = [
        {
            title: "Average crop stress",
            value: "32%",
            progress: 32,
            color: "red",
            icon: (color: string) => <Flame size={iconSize} className={`text-${color}-600`} />,
        },
        {
            title: "Soil Moisture",
            value: "64%",
            progress: 64,
            color: "blue",
            icon: (color: string) => <Droplet size={iconSize} className={`text-${color}-600`} />,
        },
        {
            title: "Soil Carbon",
            value: "2.8%",
            progress: 28,
            color: "green",
            icon: (color: string) => <Sprout size={iconSize} className={`text-${color}-600`} />,
        },
        {
            title: "Field Health",
            value: "78%",
            progress: 78,
            color: "green",
            icon: (color: string) => <HeartPulse size={iconSize} className={`text-${color}-600`} />,
        },
    ]

    return ( 
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {
                cropAnalysis.map(analysis =>
                {
                    return(
                        <div key={analysis.title}  className="bg-white p-6 rounded-lg shadow-md text-left">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-black">{analysis.title}</p>
                                    <p className={`text-2xl font-bold text-blue-500`}>{analysis.value}{" "} </p>
                                </div>
                                <div className={`p-3 rounded-full bg-${analysis.color}-100`}>
                                    {analysis.icon(analysis.color)}
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-2">
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className={`h-2.5 rounded-full bg-${analysis.color}-600`}  style={{ width: `${analysis.progress}%` }}/>
                                </div>
                            </div>
                        </div>
                    )
                }
                )
            }
        </div>
     );
}
 
export default AnalysisCards;