"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/ui/app-sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      {/* Callback function for layer toggles */}
      <AppSidebar onLayerToggle={() => {}} />
      <div className="flex flex-col h-screen w-full">
        <SidebarTrigger className="md:hidden" />
        {children}
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
