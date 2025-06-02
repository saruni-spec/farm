"use client";
import React, { useEffect, useState } from "react";
import { Leaf, Power } from "lucide-react";
import Navbar from "@/components/ui/Nav";
import { supabase } from "@/superbase/client";
import { useRouter } from "next/navigation";

const Layout = ({ children }: { children: React.ReactNode }) => 
{
  const router = useRouter();
  const [username, setUsername] = useState<string | null>("")
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen)

  //Custom links for the dashboard
  const dashboardLinks = [
    {
      url: "/dashboard",
      title: "Home",
    },
    {
      url: "/dashboard/zones",
      title: "Zones",
    },
    {
      url: "/dashboard/map",
      title: "Map",
    },
  ];

  useEffect(() => 
  {
    const checkSession = async () => 
    {
      const { data: { session }, } = await supabase.auth.getSession();
      setUsername(`${session?.user.user_metadata.first_name} ${session?.user.user_metadata.last_name}`)
      if (!session) 
      {
        router.push("/account/login");
      }
    };

    checkSession();

    // Useful if the user logs out from another tab or the session expires
    const {  data: { subscription }, } = supabase.auth.onAuthStateChange((_event, session) =>
    {
      if (!session) 
      {
        router.push("/account/login");
      }
    });

    return () => subscription.unsubscribe()
  }, [router]);

  const logOut = async () =>
  {
    await supabase.auth.signOut()
    router.push("/account/login")
  }

  //Adding the profile name
  const rightContent = (
    <div className="relative group">
      <button onClick={toggleDropdown} className="text-gray-700 font-medium group-hover:text-green-700">{username}</button>
      {
        dropdownOpen &&
          <div className="absolute right-0 mt-2 bg-white border shadow-md rounded-md py-2 w-40 z-50">
            <button onClick={logOut} className=" w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex flex-row gap-2">
              <Power/>
              Log out
            </button>
          </div>
      }
    </div>
  )
  return (
    <div className="min-h-screen bg-gray-200 relative">
      <Navbar logo={<Leaf className="w-6 h-6" />} title="FarmSawa Dashboard" tagline="Real-time crop and soil analytics" navLinks={dashboardLinks} rightContent={rightContent}/>
      <div className="min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default Layout;
