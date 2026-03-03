import { Outlet, useLocation, Link } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ClientSidebar } from "@/components/client/ClientSidebar";
import { ProfileDropdown } from "@/components/auth/ProfileDropdown";
import { Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

const PAGE_TITLES: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/dashboard/bookings": "My Bookings",
    "/dashboard/notifications": "Notifications",
    "/dashboard/settings": "Profile Settings",
};

const NOTIF_SEEN_KEY = "vn_notif_last_seen";

export function ClientLayout() {
    const { user } = useAuth();
    const location = useLocation();
    const [unreadNotifCount, setUnreadNotifCount] = useState(0);

    const pageTitle = PAGE_TITLES[location.pathname] ?? "Dashboard";

    // Reset unread count when user visits notifications page
    useEffect(() => {
        if (location.pathname === "/dashboard/notifications") {
            setUnreadNotifCount(0);
            localStorage.setItem(NOTIF_SEEN_KEY, new Date().toISOString());
        }
    }, [location.pathname]);

    // Real-time booking updates → increment unread count
    useEffect(() => {
        if (!user) return;

        const sub = supabase
            .channel("client_layout_bookings")
            .on(
                "postgres_changes",
                { event: "UPDATE", schema: "public", table: "bookings", filter: `user_id=eq.${user.id}` },
                () => {
                    if (location.pathname !== "/dashboard/notifications") {
                        setUnreadNotifCount((c) => c + 1);
                    }
                }
            )
            .subscribe();

        return () => { sub.unsubscribe(); };
    }, [user, location.pathname]);

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-black text-white">
                <ClientSidebar unreadNotifCount={unreadNotifCount} />
                <div className="flex flex-1 flex-col">
                    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b border-white/10 bg-black/50 px-6 backdrop-blur-sm">
                        <SidebarTrigger className="text-white hover:text-[#FFBF00]" />
                        <div className="flex-1">
                            <h1 className="text-sm font-medium text-white/70">{pageTitle}</h1>
                        </div>
                        <Link to="/dashboard/book">
                            <Button size="sm" className="bg-[#FFBF00] text-black hover:bg-[#FFBF00]/90 font-semibold hidden sm:flex">
                                Request a Meeting
                            </Button>
                        </Link>
                        <Link to="/dashboard/notifications" className="relative p-2 text-white/70 hover:text-[#FFBF00] transition-colors rounded-full hover:bg-black/20 outline-none">
                            <Bell size={20} />
                            {unreadNotifCount > 0 && (
                                <span className="absolute top-1.5 right-2 flex h-2 w-2 rounded-full bg-[#FFBF00]" />
                            )}
                        </Link>
                        <ProfileDropdown />
                    </header>
                    <main className="flex-1 p-6 overflow-auto">
                        <Outlet />
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
