import React from "react";
import Link from "next/link";

const Layout = ({ children }: { children: React.ReactNode }) => 
{
    return (
        <div className="min-h-screen bg-gray-200 relative">
            <div className="absolute top-0 left-0">
                <Link href="/" className="inline-block px-7 py-3 text-black font-medium hover:text-green-700 hover:underline bg-[linear-gradient(rgba(0,0,0,0.376),rgba(0,0,0,0.063))]">Home</Link>
            </div>

            <div className="flex items-center justify-center min-h-screen">
                {children}
            </div>
        </div>
    );
};

export default Layout;
