import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/AppSidebar";
import { ProfileDropdown } from "@/components/auth/ProfileDropdown";
import { Bell } from "lucide-react";

export function AdminLayout() {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-black text-white">
                <AppSidebar />
                <div className="flex flex-1 flex-col">
                    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b border-white/10 bg-black/50 px-6 backdrop-blur-sm">
                        <SidebarTrigger className="text-white hover:text-[#FFBF00]" />
                        <div className="flex-1">
                            {/* Breadcrumbs will go here in individual pages or dynamically injected */}
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="relative p-2 text-white/70 hover:text-[#FFBF00] transition-colors rounded-full hover:bg-white/5 disabled:opacity-50">
                                <Bell size={20} />
                                {/* Notification Badge Placeholder */}
                                <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-[#FFBF00]" />
                            </button>
                            <ProfileDropdown />
                        </div>
                    </header>
                    <main className="flex-1 p-6 overflow-auto">
                        <Outlet />
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
