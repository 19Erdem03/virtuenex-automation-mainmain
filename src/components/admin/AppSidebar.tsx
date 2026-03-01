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
import {
    LayoutDashboard,
    Server,
    Users,
    CalendarDays,
} from "lucide-react";

const navItems = [
    {
        title: "Dashboard",
        url: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Sessions",
        url: "/admin/deployments",
        icon: Server,
    },
    {
        title: "Clients",
        url: "/admin/clients",
        icon: Users,
    },
    {
        title: "Bookings",
        url: "/admin/bookings",
        icon: CalendarDays,
    },
];

export function AppSidebar() {
    const location = useLocation();

    return (
        <Sidebar className="border-r border-white/10 bg-black text-white">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-white/50 text-xs px-4 py-2 font-mono uppercase tracking-wider mb-2">
                        Admin Panel
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.url || (item.url !== '/admin' && location.pathname.startsWith(item.url));

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild isActive={isActive} tooltip={item.title} className={`text-white/70 transition-colors ${isActive ? 'bg-white/10 text-[#FFBF00] font-medium' : 'hover:bg-white/5 hover:text-white'}`}>
                                            <Link to={item.url}>
                                                <item.icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-[#FFBF00]' : 'text-white/50'}`} />
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
