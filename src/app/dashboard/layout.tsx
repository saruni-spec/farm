import React from "react";
import { Leaf } from "lucide-react";
import Navbar from "@/components/ui/Nav";

const Layout = ({ children }: { children: React.ReactNode }) => 
{
    //Custom links for the dashboard
    const dashboardLinks=[
        { 
            url: "/dashboard", 
            title: "Home" 
        },
        { 
            url: "/dashboard/zones", 
            title: "Zones" 
        },
        { 
            url: "/dashboard/map", 
            title: "Map"
        },
    ]
    return (
        <div className="min-h-screen bg-gray-200 relative">
            <Navbar logo={<Leaf className="w-6 h-6"/>} title="FarmSawa Dashboard" tagline="Real-time crop and soil analytics" navLinks={dashboardLinks}/>
            <div className="min-h-screen">
                {children}
            </div>
        </div>
    );
};

export default Layout;
