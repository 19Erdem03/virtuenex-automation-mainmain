import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Bell, CheckCircle, Info, Calendar as CalendarIcon, Server, User } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

export function AdminNotifications() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterType, setFilterType] = useState<string>("all");
    const [isMarkingAll, setIsMarkingAll] = useState(false);

    useEffect(() => {
        fetchNotifications();

        // Subscribe to real-time changes
        const subscription = supabase
            .channel('admin_notifications_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'admin_notifications' }, () => {
                fetchNotifications();
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('admin_notifications')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setNotifications(data || []);
        } catch (error: any) {
            console.error('Error fetching notifications:', error);
            toast.error("Failed to load notifications");
        } finally {
            setIsLoading(false);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            const { error } = await supabase
                .from('admin_notifications')
                .update({ is_read: true })
                .eq('id', id);

            if (error) throw error;
            setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (error: any) {
            toast.error("Failed to mark notification as read");
        }
    };

    const markAllAsRead = async () => {
        setIsMarkingAll(true);
        try {
            const { error } = await supabase
                .from('admin_notifications')
                .update({ is_read: true })
                .eq('is_read', false);

            if (error) throw error;
            setNotifications(notifications.map(n => ({ ...n, is_read: true })));
            toast.success("All notifications marked as read");
        } catch (error: any) {
            toast.error("Failed to mark all as read");
        } finally {
            setIsMarkingAll(false);
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

    const filteredNotifications = notifications.filter(n => {
        if (filterType !== 'all' && n.type !== filterType) return false;
        return true;
    });

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
                        <Bell className="h-6 w-6 text-[#FFBF00]" />
                        System Notifications
                        {unreadCount > 0 && (
                            <Badge variant="outline" className="ml-2 border-[#FFBF00]/50 text-[#FFBF00] bg-[#FFBF00]/10">
                                {unreadCount} unread
                            </Badge>
                        )}
                    </h1>
                    <p className="text-white/50 mt-1">
                        View and manage alerts for bookings, clients, and system events.
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between gap-4 bg-white/5 p-4 rounded-lg border border-white/10">
                <div className="flex gap-4 items-center">
                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-[180px] bg-black border-white/10 text-white">
                            <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-white/10 text-white">
                            <SelectItem value="all">All Notifications</SelectItem>
                            <SelectItem value="booking">Bookings</SelectItem>
                            <SelectItem value="client">Clients</SelectItem>
                            <SelectItem value="system">Systems</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {unreadCount > 0 && (
                    <Button
                        variant="outline"
                        onClick={markAllAsRead}
                        disabled={isMarkingAll}
                        className="bg-transparent border-white/10 text-white hover:bg-white/5"
                    >
                        {isMarkingAll ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                        Mark all as read
                    </Button>
                )}
            </div>

            <div className="rounded-md border border-white/10 bg-black overflow-hidden relative">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/10 hover:bg-transparent">
                            <TableHead className="text-white/70 w-[50px]"></TableHead>
                            <TableHead className="text-white/70">Message</TableHead>
                            <TableHead className="text-white/70 w-[150px]">Type</TableHead>
                            <TableHead className="text-white/70 w-[200px]">Date</TableHead>
                            <TableHead className="text-right text-white/70 w-[120px]">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow className="border-white/10 hover:bg-transparent">
                                <TableCell colSpan={5} className="text-center text-white/50 py-8">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-[#FFBF00]" />
                                    Loading notifications...
                                </TableCell>
                            </TableRow>
                        ) : filteredNotifications.length === 0 ? (
                            <TableRow className="border-white/10 hover:bg-transparent">
                                <TableCell colSpan={5} className="text-center text-white/50 py-8">
                                    No notifications found matching your filter.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredNotifications.map((notification) => (
                                <TableRow
                                    key={notification.id}
                                    className={`border-white/10 transition-colors ${notification.is_read ? 'hover:bg-white/5 opacity-70' : 'bg-white/[0.02] hover:bg-white/10'}`}
                                >
                                    <TableCell>
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black border border-white/10">
                                            {getIconForType(notification.type)}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className={`font-medium ${notification.is_read ? 'text-white/70' : 'text-white'}`}>
                                                {notification.title}
                                            </span>
                                            <span className="text-sm text-white/50">
                                                {notification.message}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`capitalize
                                            ${notification.type === 'booking' ? 'border-blue-500/50 text-blue-400' : ''}
                                            ${notification.type === 'client' ? 'border-green-500/50 text-green-400' : ''}
                                            ${notification.type === 'system' ? 'border-[#FFBF00]/50 text-[#FFBF00]' : ''}
                                        `}>
                                            {notification.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-white/70 text-sm">
                                        {format(new Date(notification.created_at), 'MMM dd, yyyy h:mm a')}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {!notification.is_read && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-[#FFBF00] hover:text-[#FFBF00] hover:bg-[#FFBF00]/10"
                                                onClick={() => markAsRead(notification.id)}
                                            >
                                                Mark read
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
