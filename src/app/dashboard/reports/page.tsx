import { Checkbox } from "@/components/ui/checkbox";

const Reports = () => 
{
    return (
        <div className="flex items-center justify-center md:p-6">
            <div className="w-full max-w-xl rounded-lg p-4 md:p-0">
                <h1 className="text-center font-bold text-2xl md:text-3xl mb-6 text-gray-800">Generate Reports</h1>
        
                <form className="space-y-6">
                    {/* Duration Selection */}
                    <div>
                        <h2 className="text-lg font-semibold mb-2 text-gray-700">Choose Duration</h2>
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:p-4 mb-6 w-full">
                            <input type="time" name="time" required className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 Focus:ring-blue-400"/>
                            <input type="date" name="date" required className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                            <input type="month" name="month" required className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                            <input type="year" name="year" required placeholder="Year"
                            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                        </div>
                    </div>
        
                    {/* Options to Include */}
                    <div>
                        <h2 className="text-lg font-semibold mb-2 text-gray-700">What to Include</h2>
                        <div className="flex flex-col gap-3 mb-6">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                <Checkbox id="includeboundary" className="accent-blue-500 cursor-pointer"/> 
                                <label htmlFor="includeboundary" className="text-sm cursor-pointer">Farm boundary</label>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                <Checkbox id="includeplantingactivities" className="accent-blue-500 cursor-pointer"/>
                                <label htmlFor="includeplantingactivities" className="text-sm cursor-pointer">Planting Activities</label>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                <Checkbox id="includecurrentweather" className="accent-blue-500 cursor-pointer"/>
                                <label htmlFor="includecurrentweather" className="text-sm cursor-pointer">Current Weather Statistics</label>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                <Checkbox id="includecroparea" className="accent-blue-500 cursor-pointer"/>
                                <label htmlFor="includecroparea" className="text-sm cursor-pointer">Crop Area Boundary</label>
                            </div>
                        </div>
                    </div>
        
                    {/* Format and Submit */}
                    <div>
                        <h2 className="text-lg font-semibold mb-2 text-gray-700">Format</h2>
                        <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                            <select name="format" className="border border-gray-300 rounded px-5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-1/6">
                                <option value="pdf">PDF</option>
                                <option value="csv">CSV</option>
                                <option value="xlsx">Excel</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition mx-auto">Generate Report</button>
                    </div>
                </form>
            </div>
        </div>
    );
  };
  
export default Reports;
  