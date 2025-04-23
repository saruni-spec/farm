import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/ui/app-sidebar";
import Navbar from "@/components/ui/Navbar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => 
{
    return ( 
        <SidebarProvider>
            <AppSidebar/>
            <div className="flex flex-col h-screen w-full">
                <SidebarTrigger className="md:hidden"/>
                {children}
            </div>
        </SidebarProvider>
     );
}
 
export default DashboardLayout;