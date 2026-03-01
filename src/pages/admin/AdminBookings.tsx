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
import { Calendar as CalendarIcon, Clock, Loader2, MoreHorizontal, CheckCircle, XCircle, CalendarClock } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
    isToday,
    isThisWeek,
    isThisMonth,
    isWithinInterval,
    startOfDay,
    endOfDay,
    format,
} from "date-fns";
import { cn } from "@/lib/utils";

export function AdminBookings() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>("All Statuses");
    const [sessionTypeFilter, setSessionTypeFilter] = useState<string>("All Sessions");
    const [dateFilter, setDateFilter] = useState<"All" | "Today" | "This Week" | "This Month" | "Custom">("All");
    const [customDateRange, setCustomDateRange] = useState<{ start: Date | undefined; end: Date | undefined }>({ start: undefined, end: undefined });
    const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

    const fetchBookings = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select(`
                    *,
                    tours (
                        *,
                        properties (
                            title,
                            price
                        )
                    ),
                    profiles (
                        full_name,
                        email
                    )
                `)
                .order('scheduled_for', { ascending: false });

            if (error) throw error;
            setBookings(data || []);
        } catch (error: any) {
            console.error("Error fetching bookings:", error);
            toast.error("Failed to load bookings");
        } finally {
            setIsLoading(false);
        }
    };

    const updateBookingStatus = async (id: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('bookings')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;

            toast.success(`Booking marked as ${newStatus}`);
            setBookings(bookings.map(book => book.id === id ? { ...book, status: newStatus } : book));
        } catch (error: any) {
            console.error("Error updating booking:", error);
            toast.error("Failed to update booking status");
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const filteredBookings = bookings.filter(booking => {
        // Status Filter
        if (statusFilter !== "All Statuses" && booking.status !== statusFilter) {
            return false;
        }

        // Session Type Filter (Currently mocked, all maps to 'Tour' or generic)
        if (sessionTypeFilter !== "All Sessions") {
            // Placeholder: Assume all current DB entries are 'Property Tour' for now
            if (sessionTypeFilter === 'Property Tour' && booking.tours) {
                // Return true, it's a property tour
            } else {
                return false;
            }
        }

        // Date Filter
        if (dateFilter !== "All" && booking.scheduled_for) {
            const bookingDate = new Date(booking.scheduled_for);

            if (dateFilter === "Today" && !isToday(bookingDate)) return false;
            if (dateFilter === "This Week" && !isThisWeek(bookingDate)) return false;
            if (dateFilter === "This Month" && !isThisMonth(bookingDate)) return false;

            if (dateFilter === "Custom" && customDateRange.start && customDateRange.end) {
                const start = startOfDay(customDateRange.start);
                const end = endOfDay(customDateRange.end);

                // Only filter if valid dates are provided
                if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
                    if (!isWithinInterval(bookingDate, { start, end })) {
                        return false;
                    }
                }
            }
        }

        return true;
    });

    // Helper functions to handle both single objects and arrays from Supabase joins
    const getProfile = (b: any) => Array.isArray(b.profiles) ? b.profiles[0] : b.profiles;
    const getTour = (b: any) => Array.isArray(b.tours) ? b.tours[0] : b.tours;
    const getProperty = (t: any) => t ? (Array.isArray(t.properties) ? t.properties[0] : t.properties) : null;

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Tour Bookings</h1>
                    <p className="text-white/60">Review and manage upcoming property tours.</p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    {/* Date Presets */}
                    <div className="flex items-center bg-black border border-white/10 rounded-md p-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`h-8 ${dateFilter === 'Today' ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white'}`}
                            onClick={() => setDateFilter(dateFilter === 'Today' ? 'All' : 'Today')}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            Today
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`h-8 ${dateFilter === 'This Week' ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white'}`}
                            onClick={() => setDateFilter(dateFilter === 'This Week' ? 'All' : 'This Week')}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            This Week
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`h-8 ${dateFilter === 'This Month' ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white'}`}
                            onClick={() => setDateFilter(dateFilter === 'This Month' ? 'All' : 'This Month')}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            This Month
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`h-8 ${dateFilter === 'Custom' ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white'}`}
                            onClick={() => setDateFilter(dateFilter === 'Custom' ? 'All' : 'Custom')}
                        >
                            Custom Range
                        </Button>
                    </div>

                    {dateFilter === 'Custom' && (
                        <div className="flex items-center gap-2">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-[140px] justify-start text-left font-normal bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white",
                                            !customDateRange.start && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {customDateRange.start ? format(customDateRange.start, "MMM d, yyyy") : <span>Start date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 bg-black border-white/10" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={customDateRange.start}
                                        onSelect={(date) => setCustomDateRange({ ...customDateRange, start: date })}
                                        initialFocus
                                        className="text-white"
                                    />
                                </PopoverContent>
                            </Popover>
                            <span className="text-white/50">to</span>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-[140px] justify-start text-left font-normal bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white",
                                            !customDateRange.end && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {customDateRange.end ? format(customDateRange.end, "MMM d, yyyy") : <span>End date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 bg-black border-white/10" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={customDateRange.end}
                                        onSelect={(date) => setCustomDateRange({ ...customDateRange, end: date })}
                                        initialFocus
                                        className="text-white"
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    )}

                    <Select value={sessionTypeFilter} onValueChange={setSessionTypeFilter}>
                        <SelectTrigger className="w-[160px] bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="All Sessions" />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-white/10 text-white">
                            <SelectItem value="All Sessions">All Sessions</SelectItem>
                            <SelectItem value="Property Tour">Property Tour</SelectItem>
                            <SelectItem value="Initial Consultation">Initial Consultation</SelectItem>
                            <SelectItem value="Demo">Demo</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-white/10 text-white">
                            <SelectItem value="All Statuses">All Statuses</SelectItem>
                            <SelectItem value="Scheduled">Scheduled</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                            <SelectItem value="Rescheduled">Rescheduled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="rounded-md border border-white/10">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/10 hover:bg-transparent">
                            <TableHead className="text-white/70">
                                Lead/Client
                            </TableHead>
                            <TableHead className="text-white/70">
                                Property
                            </TableHead>
                            <TableHead className="text-white/70">
                                Price
                            </TableHead>
                            <TableHead className="text-white/70">
                                Date & Time
                            </TableHead>
                            <TableHead className="text-white/70">
                                Status
                            </TableHead>
                            <TableHead className="text-right text-white/70">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-white/50" />
                                </TableCell>
                            </TableRow>
                        ) : filteredBookings.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-white/50">
                                    No bookings found matching your filters.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredBookings.map((booking) => {
                                const profile = getProfile(booking);
                                const tour = getTour(booking);
                                const property = getProperty(tour);

                                return (
                                    <TableRow
                                        key={booking.id}
                                        className="border-white/10 hover:bg-white/5 cursor-pointer"
                                        onClick={() => setSelectedBooking(booking)}
                                    >
                                        <TableCell className="font-medium text-white">
                                            <div>{profile?.full_name || 'Unknown'}</div>
                                            <div className="text-xs text-white/50">{profile?.email}</div>
                                        </TableCell>
                                        <TableCell className="text-white/70">
                                            {property?.title || 'Unknown Property'}
                                        </TableCell>
                                        <TableCell className="text-white/70 font-medium">
                                            {property?.price ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(property.price) : 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-white/70">
                                                <CalendarIcon className="h-4 w-4 text-[#FFBF00]" />
                                                <span>
                                                    {booking.scheduled_for ? new Date(booking.scheduled_for).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                                                </span>
                                                <Clock className="h-4 w-4 ml-2 text-[#FFBF00]" />
                                                <span>
                                                    {booking.scheduled_for ? new Date(booking.scheduled_for).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : 'N/A'}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`
                    ${booking.status === 'Scheduled' ? 'border-[#FFBF00]/50 text-[#FFBF00]' :
                                                    booking.status === 'Completed' ? 'border-green-500/50 text-green-400' :
                                                        'border-red-500/50 text-red-400'}
                  `}>
                                                {booking.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-black border-white/10 text-white">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>

                                                    {booking.status !== 'Completed' && (
                                                        <DropdownMenuItem
                                                            className="hover:bg-white/10 cursor-pointer text-green-400 hover:text-green-300 focus:bg-white/10 focus:text-green-300"
                                                            onClick={() => updateBookingStatus(booking.id, 'Completed')}
                                                        >
                                                            <CheckCircle className="mr-2 h-4 w-4" />
                                                            Mark Completed
                                                        </DropdownMenuItem>
                                                    )}

                                                    {booking.status !== 'Rescheduled' && booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
                                                        <DropdownMenuItem
                                                            className="hover:bg-white/10 cursor-pointer text-white/70 hover:text-white focus:bg-white/10 focus:text-white"
                                                            onClick={() => updateBookingStatus(booking.id, 'Rescheduled')}
                                                        >
                                                            <CalendarClock className="mr-2 h-4 w-4" />
                                                            Reschedule
                                                        </DropdownMenuItem>
                                                    )}

                                                    <DropdownMenuSeparator className="bg-white/10" />

                                                    {booking.status !== 'Cancelled' && (
                                                        <DropdownMenuItem
                                                            className="text-red-400 hover:text-red-300 hover:bg-red-400/10 cursor-pointer focus:bg-red-400/10 focus:text-red-300"
                                                            onClick={() => updateBookingStatus(booking.id, 'Cancelled')}
                                                        >
                                                            <XCircle className="mr-2 h-4 w-4" />
                                                            Cancel Booking
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
            {/* Booking Details Modal */}
            <Dialog open={!!selectedBooking} onOpenChange={(open: boolean) => !open && setSelectedBooking(null)}>
                <DialogContent className="bg-black border border-white/10 text-white sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Booking Details</DialogTitle>
                        <DialogDescription className="text-white/60">
                            Information regarding the selected booking and the associated client.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedBooking && (() => {
                        const profile = getProfile(selectedBooking);
                        const tour = getTour(selectedBooking);
                        const property = getProperty(tour);

                        return (
                            <div className="grid gap-6 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-white/50 text-xs uppercase tracking-wider">Client Name</Label>
                                        <div className="text-white mt-1 font-medium">{profile?.full_name || 'Unknown'}</div>
                                        <div className="text-white/60 text-sm mt-0.5">{profile?.email}</div>
                                    </div>
                                    <div>
                                        <Label className="text-white/50 text-xs uppercase tracking-wider">Status</Label>
                                        <div className="mt-1">
                                            <Badge variant="outline" className={`
                                            ${selectedBooking.status === 'Scheduled' ? 'border-[#FFBF00]/50 text-[#FFBF00]' :
                                                    selectedBooking.status === 'Completed' ? 'border-green-500/50 text-green-400' :
                                                        'border-red-500/50 text-red-400'}
                                        `}>
                                                {selectedBooking.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/5 rounded-md p-4 border border-white/10 space-y-4">
                                    <div>
                                        <Label className="text-white/50 text-xs uppercase tracking-wider">Session Details</Label>
                                        <div className="mt-1 flex flex-col gap-2">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-white/70">Type:</span>
                                                <span className="text-white font-medium">Property Tour</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-white/70">Property:</span>
                                                <span className="text-white font-medium text-right max-w-[200px] truncate" title={property?.title}>
                                                    {property?.title || 'Unknown Property'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-white/70">Price:</span>
                                                <span className="text-white font-medium">
                                                    {property?.price ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(property.price) : 'N/A'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-white/70">Duration:</span>
                                                <span className="text-white font-medium">{tour?.duration_minutes || 30} Minutes</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-white/50 text-xs uppercase tracking-wider">Date & Time</Label>
                                    <div className="mt-2 flex items-center justify-between bg-white/5 p-3 rounded-md border border-white/10">
                                        <div className="flex items-center gap-2">
                                            <CalendarIcon className="h-4 w-4 text-[#FFBF00]" />
                                            <span className="text-white text-sm">
                                                {selectedBooking.scheduled_for ? new Date(selectedBooking.scheduled_for).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-[#FFBF00]" />
                                            <span className="text-white text-sm">
                                                {selectedBooking.scheduled_for ? new Date(selectedBooking.scheduled_for).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {selectedBooking.cancellation_reason && (
                                    <div>
                                        <Label className="text-white/50 text-xs uppercase tracking-wider">Cancellation Reason</Label>
                                        <div className="text-red-400 mt-1 bg-red-500/10 p-3 rounded-md border border-red-500/20 text-sm">
                                            {selectedBooking.cancellation_reason}
                                        </div>
                                    </div>
                                )}

                            </div>
                        );
                    })()}
                </DialogContent>
            </Dialog>
        </div>
    );
}
