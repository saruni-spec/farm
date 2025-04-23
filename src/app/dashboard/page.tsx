import Link from "next/link";

const Dashboard = () => 
{
    return ( 
        <>
            <Link href={"/weather"}>Weather</Link>
            <Link href={"/reports"}>Reports</Link>
        </>
     );
}
 
export default Dashboard;