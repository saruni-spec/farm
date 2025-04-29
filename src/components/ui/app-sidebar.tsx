"use client"

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar"
import { Map, Sprout, CloudSun, ClipboardList, ArrowDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AppSidebar = () => 
{
    const pathName=usePathname()

    const data = [
        {
            title: "Farm Map",
            url : "/dashboard/map",
            icon: <Map /> 
        },
        {
            title: "Planting",
            url: "/dashboard/planting",
            icon: <Sprout />
        }
    ]
    return ( 
        <Sidebar>
            <SidebarHeader>
                <h1 className="font-bold text-center text-xl md:text-2xl">Farm Sawa</h1>
            </SidebarHeader>
            <SidebarContent>
                {
                    data.map(link =>
                    {
                        const isActive=pathName.startsWith(link.url)
                        
                        return(
                            <Link key={link.url} href={link.url} className={`flex items-center gap-3 p-2  ${isActive ? "bg-blue-500 text-white" : "text-gray-800 hover:bg-gray-300"}`}>{link.icon} <span className="text-sm">{link.title}</span> <ArrowDown size={16}className="ml-auto"/></Link>
                        )
                    }
                    )
                }
            </SidebarContent>
            <SidebarFooter>
                <p>Developed by <Link href={"https://statsspeak.co.ke/"} target="_blank" className="text-blue-500 hover:underline">Statsspeak</Link></p>
            </SidebarFooter>
        </Sidebar>
     );
}
 
export default AppSidebar;