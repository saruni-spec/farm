import { Search, HelpCircle, User, SunMoon } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="w-full bg-blue-600 h-14 flex items-center justify-between px-6 text-white">
      {/* Left: Logo */}
      <div className="flex items-center space-x-2 font-semibold text-lg">
        <div className="w-6 h-6 bg-green-400 rounded-full" /> {/* Placeholder for leaf logo */}
        <span>FarmSawa</span>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-md mx-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full px-4 py-1.5 pl-10 rounded-md bg-white text-black focus:outline-none"
          />
          <Search className="absolute left-2.5 top-2.5 text-gray-500 w-4 h-4" />
        </div>
      </div>

      {/* Right: Icons */}
      <div className="flex items-center space-x-6 text-sm font-medium">
        <SunMoon className="w-5 h-5" />
        <Link href="#" className="flex items-center gap-1">
          <User className="w-4 h-4" />
          Account
        </Link>
        <Link href="#" className="flex items-center gap-1">
          <HelpCircle className="w-4 h-4" />
          Help
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
