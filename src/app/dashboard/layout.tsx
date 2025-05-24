"use client";
import React, { useEffect } from "react";
import { Leaf } from "lucide-react";
import Navbar from "@/components/ui/Nav";
import { supabase } from "@/superbase/client";
import { useRouter } from "next/navigation";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
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

  // useEffect(() => {
  //   const checkSession = async () => {
  //     const {
  //       data: { session },
  //     } = await supabase.auth.getSession();
  //     if (!session) {
  //       router.push("/account/login");
  //     }
  //   };

  //   checkSession();

  //   // Useful if the user logs out from another tab or the session expires
  //   const {
  //     data: { subscription },
  //   } = supabase.auth.onAuthStateChange((_event, session) => {
  //     if (!session) {
  //       router.push("/account/login");
  //     }
  //   });

  //   return () => {
  //     subscription.unsubscribe();
  //   };
  // }, [router]);
  return (
    <div className="min-h-screen bg-gray-200 relative">
      <Navbar logo={<Leaf className="w-6 h-6" />} title="FarmSawa Dashboard" tagline="Real-time crop and soil analytics" navLinks={dashboardLinks}/>
      <div className="min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default Layout;
