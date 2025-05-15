"use client"

import Link from "next/link"
import { Leaf, Menu, X } from "lucide-react"
import { useState } from "react"

const Navbar = () => 
{
    const [menuOpen, setMenuOpen] = useState(false)

    const navLinks = [
        { 
            url: "/", 
            title: "Home", 
        },
        { 
            url: "#problem", 
            title: "Problem" 
        },
        { 
            url: "#solution", 
            title: "Solution" 
        },
        { 
            url: "#features", 
            title: "Key Features" 
        },
        {
            url: "#stakeholders",
            title: "Stakeholders"
        },
        { 
            url: "#footer", 
            title: "Contact" 
        },
        
    ]

    return (
        <nav className="fixed top-0 left-0 w-full bg-white shadow-sm z-50 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2 text-green-700 font-bold text-xl">
                <Leaf className="w-8 h-8" />
                <h2>FarmSawa</h2>
            </div>

            {/* Hamburger Icon (Mobile Only) */}
            <button className="md:hidden text-gray-700" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu"> 
                {
                    menuOpen 
                    ? 
                        <X className="w-6 h-6" /> 
                    :
                        <Menu className="w-6 h-6" />
                }
            </button>

            {/* Desktop navigation links */}
            <div className="hidden md:flex space-x-6 text-gray-700 font-medium">
                {
                    navLinks.map(link => 
                    {
                        return(
                            <Link key={link.url} href={link.url} className="hover:text-green-700 hover:underline transition-colors duration-200">{link.title}</Link>
                        )
                    })
                }
            </div>

            {/* Mobile nav links */}
            {
                menuOpen && 
                <div className="absolute top-[64px] left-0 w-full bg-white shadow-md flex flex-col items-center gap-4 py-4 md:hidden">
                    {
                        navLinks.map(link => 
                        {
                            return(
                                <Link key={link.url} href={link.url} className="hover:text-green-700 hover:underline transition-colors duration-200">{link.title}</Link>
                            )
                        })
                    }
                </div>
            }
        </nav>
    )
}

export default Navbar
