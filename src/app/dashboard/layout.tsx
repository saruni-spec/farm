"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/superbase/client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/ui/app-sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/account/login");
      }
    };

    checkSession();

    // Useful if the user logs out from another tab or the session expires
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/account/login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return (
    <SidebarProvider>
      <AppSidebar onLayerToggle={() => {}} />
      <div className="flex flex-col h-screen w-full">
        <SidebarTrigger className="md:hidden" />
        {children}
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
