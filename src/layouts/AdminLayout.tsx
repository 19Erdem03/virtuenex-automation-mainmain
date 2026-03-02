import { Outlet, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/AppSidebar";
import { ProfileDropdown } from "@/components/auth/ProfileDropdown";
import { Bell, Loader2, Calendar as CalendarIcon, Server, User, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export function AdminLayout() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();

        // Subscribe to real-time changes
        const subscription = supabase
            .channel('admin_notifications_layout')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'admin_notifications' }, () => {
                fetchNotifications();
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const fetchNotifications = async () => {
        try {
            // Get unread count
            const { count, error: countError } = await supabase
                .from('admin_notifications')
                .select('*', { count: 'exact', head: true })
                .eq('is_read', false);

            if (countError) throw countError;
            setUnreadCount(count || 0);

            // Get recent notifications
            const { data, error } = await supabase
                .from('admin_notifications')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(10);

            if (error) throw error;
            setNotifications(data || []);
        } catch (error: any) {
            console.error('Error fetching notifications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const markAsRead = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const { error } = await supabase
                .from('admin_notifications')
                .update({ is_read: true })
                .eq('id', id);

            if (error) throw error;

            // Update local state
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error: any) {
            console.error("Failed to mark notification as read");
        }
    };

    const getIconForType = (type: string) => {
        switch (type) {
            case 'booking':
                return <CalendarIcon className="h-4 w-4 text-blue-400" />;
            case 'client':
                return <User className="h-4 w-4 text-green-400" />;
            case 'system':
                return <Server className="h-4 w-4 text-[#FFBF00]" />;
            default:
                return <Info className="h-4 w-4 text-white/50" />;
        }
    };
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
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="relative p-2 text-white/70 hover:text-[#FFBF00] transition-colors rounded-full hover:bg-white/5 outline-none">
                                        <Bell size={20} />
                                        {unreadCount > 0 && (
                                            <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-[#FFBF00]" />
                                        )}
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-80 bg-[#111] border-white/10 text-white mr-4 p-0" align="end">
                                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                                        <DropdownMenuLabel className="font-semibold px-0">Notifications</DropdownMenuLabel>
                                        <Badge variant="outline" className="border-[#FFBF00]/50 text-[#FFBF00] bg-[#FFBF00]/10">
                                            {unreadCount} New
                                        </Badge>
                                    </div>
                                    <div className="max-h-[300px] overflow-y-auto">
                                        {isLoading ? (
                                            <div className="flex justify-center py-6">
                                                <Loader2 className="h-5 w-5 animate-spin text-[#FFBF00]" />
                                            </div>
                                        ) : notifications.length === 0 ? (
                                            <div className="py-6 text-center text-sm text-white/50">
                                                No notifications
                                            </div>
                                        ) : (
                                            notifications.map(notification => (
                                                <DropdownMenuItem
                                                    key={notification.id}
                                                    className={`focus:bg-white/5 cursor-pointer px-4 py-3 border-b border-white/5 last:border-0 items-start gap-3 rounded-none ${!notification.is_read ? 'bg-white/5' : ''}`}
                                                    onClick={() => navigate('/admin/notifications')}
                                                >
                                                    <div className="mt-0.5 shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-black border border-white/10">
                                                        {getIconForType(notification.type)}
                                                    </div>
                                                    <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                                                        <span className={`text-sm line-clamp-1 ${!notification.is_read ? 'font-semibold text-white' : 'font-medium text-white/70'}`}>{notification.title}</span>
                                                        <span className={`text-xs line-clamp-2 ${!notification.is_read ? 'text-white/80' : 'text-white/50'}`}>{notification.message}</span>
                                                        <div className="flex items-center justify-between mt-1">
                                                            <span className="text-[10px] text-white/40">
                                                                {format(new Date(notification.created_at), 'MMM d, h:mm a')}
                                                            </span>
                                                            {!notification.is_read && (
                                                                <button
                                                                    onClick={(e) => markAsRead(notification.id, e)}
                                                                    className="text-[10px] text-[#FFBF00] hover:underline"
                                                                >
                                                                    Mark read
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </DropdownMenuItem>
                                            ))
                                        )}
                                    </div>
                                    <div className="p-2 border-t border-white/10">
                                        <Button
                                            variant="ghost"
                                            className="w-full text-sm text-white/70 hover:text-white hover:bg-white/5"
                                            onClick={() => navigate('/admin/notifications')}
                                        >
                                            View all activity
                                        </Button>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
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
