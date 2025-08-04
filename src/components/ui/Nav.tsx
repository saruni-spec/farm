"use client";

import Link from "next/link";
import { Leaf, Menu, X } from "lucide-react";
import { useState } from "react";

interface NavLink {
  url: string;
  title: string;
}

interface NavbarProps {
  title?: string;
  tagline?: string;
  logo?: React.ReactNode;
  navLinks: NavLink[];
  rightContent?: React.ReactNode; // optional right-side content (e.g., dropdown)
  className?: string;
}

const Navbar = ({
  title = "FarmSawa",
  tagline,
  logo = <Leaf />,
  navLinks,
  rightContent,
  className,
}: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className={`${className} fixed top-0 left-0 w-full bg-white shadow-sm z-50 px-6 py-4 flex justify-between items-center ${className}`}
    >
      {/* Logo & title */}
      <div className="flex items-center gap-2">
        {logo && <div className="text-green-700">{logo}</div>}

        {tagline ? (
          <div className="flex flex-col leading-tight">
            <h2 className="text-xl font-bold text-green-700">{title}</h2>
            <span className="text-sm text-gray-500 font-medium">{tagline}</span>
          </div>
        ) : (
          <h2 className="text-xl font-bold text-green-700">{title}</h2>
        )}
      </div>

      {/* Hamburger icon (mobile) */}
      <button
        className="md:hidden text-gray-700"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Desktop links */}
      <div className="hidden md:flex items-center space-x-6 text-gray-700 font-medium">
        {navLinks.map((link) => {
          return (
            <Link
              key={link.url}
              href={link.url}
              className="hover:text-green-700 hover:underline transition-colors duration-200"
            >
              {link.title}
            </Link>
          );
        })}
        {rightContent}
      </div>

      {/* Mobile nav links */}
      {menuOpen && (
        <div className="absolute top-[64px] left-0 w-full bg-white shadow-md flex flex-col items-center gap-4 py-4 md:hidden">
          {navLinks.map((link) => {
            return (
              <Link
                key={link.url}
                href={link.url}
                className="hover:text-green-700 hover:underline transition-colors duration-200"
              >
                {link.title}
              </Link>
            );
          })}
          {rightContent}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
