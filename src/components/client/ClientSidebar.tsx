import { Link, useLocation } from "react-router-dom";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LayoutDashboard, CalendarDays, CalendarPlus, Bell, UserCog } from "lucide-react";

interface ClientSidebarProps {
    unreadNotifCount: number;
}

const mainItems = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "My Bookings", url: "/dashboard/bookings", icon: CalendarDays },
    { title: "Book a Session", url: "/dashboard/book", icon: CalendarPlus },
    { title: "Notifications", url: "/dashboard/notifications", icon: Bell },
];

const accountItems = [
    { title: "Profile Settings", url: "/dashboard/settings", icon: UserCog },
];

export function ClientSidebar({ unreadNotifCount }: ClientSidebarProps) {
    const location = useLocation();

    const isActive = (url: string) =>
        url === "/dashboard"
            ? location.pathname === "/dashboard"
            : location.pathname.startsWith(url);

    return (
        <Sidebar className="border-r border-white/10 bg-black text-white">
            <SidebarContent>
                {/* Brand */}
                <div className="px-4 py-5 border-b border-white/10">
                    <span className="text-[#FFBF00] font-bold text-lg tracking-wide">VirtueNex</span>
                </div>

                {/* Main */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-white/40 text-[10px] px-4 pt-4 pb-1 font-mono uppercase tracking-widest">
                        Main
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {mainItems.map((item) => {
                                const active = isActive(item.url);
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={active}
                                            tooltip={item.title}
                                            className={`text-white/70 transition-colors ${active ? "bg-white/10 text-[#FFBF00] font-medium" : "hover:bg-white/5 hover:text-white"}`}
                                        >
                                            <Link to={item.url} className="flex items-center gap-2 w-full">
                                                <item.icon className={`h-4 w-4 shrink-0 ${active ? "text-[#FFBF00]" : "text-white/50"}`} />
                                                <span className="flex-1">{item.title}</span>
                                                {item.title === "Notifications" && unreadNotifCount > 0 && (
                                                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FFBF00] px-1 text-[10px] font-bold text-black">
                                                        {unreadNotifCount > 9 ? "9+" : unreadNotifCount}
                                                    </span>
                                                )}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Account */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-white/40 text-[10px] px-4 pt-4 pb-1 font-mono uppercase tracking-widest">
                        Account
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {accountItems.map((item) => {
                                const active = isActive(item.url);
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={active}
                                            tooltip={item.title}
                                            className={`text-white/70 transition-colors ${active ? "bg-white/10 text-[#FFBF00] font-medium" : "hover:bg-white/5 hover:text-white"}`}
                                        >
                                            <Link to={item.url}>
                                                <item.icon className={`h-4 w-4 shrink-0 ${active ? "text-[#FFBF00]" : "text-white/50"}`} />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
