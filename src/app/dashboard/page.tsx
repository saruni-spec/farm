import Link from "next/link";

const Dashboard = () => 
{
    return ( 
        <div className="flex justify-center gap-2">
            <Link href={"/dashboard/weather"} className="text-blue-500 underline">Weather</Link>
            <Link href={"/dashboard/reports"} className="text-blue-500 underline">Reports</Link>
        </div>
     );
}
 
export default Dashboard;