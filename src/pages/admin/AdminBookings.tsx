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
import { Calendar as CalendarIcon, Clock, Loader2, MoreHorizontal, CheckCircle, XCircle, CalendarClock, Link as LinkIcon, Save } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useSearchParams } from "react-router-dom";
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

    const [searchParams] = useSearchParams();
    const clientIdParam = searchParams.get('clientId');

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [visibleColumns, setVisibleColumns] = useState({
        lead: true,
        dateTime: true,
        link: true,
        status: true,
        actions: true,
    });

    // Edit Modal State
    const [isSavingLink, setIsSavingLink] = useState(false);
    const [editMeetingLink, setEditMeetingLink] = useState("");

    const fetchBookings = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select(`
                    *,
                    profiles (
                        id,
                        full_name,
                        email
                    )
                `)
                .order('scheduled_for', { ascending: false });

            if (error) throw error;
            setBookings(data || []);
        } catch (error: any) {
            console.error("Error fetching bookings:", error);
            toast.error("Failed to load meetings");
        } finally {
            setIsLoading(false);
        }
    };

    const updateBookingStatus = async (id: string, newStatus: "Scheduled" | "Rescheduled" | "Cancelled" | "Completed") => {
        try {
            const { error } = await supabase
                .from('bookings')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;

            toast.success(`Meeting marked as ${newStatus}`);
            setBookings(bookings.map(book => book.id === id ? { ...book, status: newStatus } : book));
        } catch (error: any) {
            console.error("Error updating meeting:", error);
            toast.error("Failed to update status");
        }
    };

    const saveMeetingLink = async () => {
        if (!selectedBooking) return;
        setIsSavingLink(true);
        try {
            const { error } = await supabase
                .from('bookings')
                // @ts-ignore - meeting_link might be a custom field not yet in types
                .update({ meeting_link: editMeetingLink })
                .eq('id', selectedBooking.id);

            if (error) throw error;

            toast.success("Meeting link saved successfully");
            setBookings(bookings.map(book => book.id === selectedBooking.id ? { ...book, meeting_link: editMeetingLink } : book));
            setSelectedBooking({ ...selectedBooking, meeting_link: editMeetingLink });
        } catch (error: any) {
            console.error("Error saving meeting link:", error);
            toast.error("Failed to save meeting link");
        } finally {
            setIsSavingLink(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const openBookingDetails = (booking: any) => {
        setSelectedBooking(booking);
        setEditMeetingLink(booking.meeting_link || "");
    };

    const filteredBookings = bookings.filter(booking => {
        // Status Filter
        if (statusFilter !== "All Statuses" && booking.status !== statusFilter) {
            return false;
        }

        // Session Type Filter
        if (sessionTypeFilter !== "All Sessions") {
            // Simplified for now, mapped filters
            return true;
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

        if (clientIdParam) {
            const profile = Array.isArray(booking.profiles) ? booking.profiles[0] : booking.profiles;
            if (profile?.id !== clientIdParam && booking.profiles?.id !== clientIdParam) {
                return false;
            }
        }

        return true;
    });

    const getProfile = (b: any) => Array.isArray(b.profiles) ? b.profiles[0] : b.profiles;

    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Meetings</h1>
                    <p className="text-white/60">Review and manage upcoming client and lead meetings.</p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="bg-white/5 border-white/10 text-white flex items-center gap-2">
                                Columns
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-black border-white/10 text-white w-48">
                            <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-white/10" />
                            {Object.entries(visibleColumns).map(([key, isVisible]) => (
                                <div key={key} className="flex items-center space-x-2 px-2 py-1.5 hover:bg-white/10 cursor-pointer rounded-sm" onClick={(e) => {
                                    e.preventDefault();
                                    setVisibleColumns(prev => ({ ...prev, [key]: !prev[key as keyof typeof visibleColumns] }));
                                }}>
                                    <Checkbox id={`col-${key}`} checked={isVisible} className="border-white/20 data-[state=checked]:bg-[#FFBF00] data-[state=checked]:text-black" />
                                    <label htmlFor={`col-${key}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize cursor-pointer flex-1">
                                        {key === 'dateTime' ? 'Date & Time' : key}
                                    </label>
                                </div>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
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
                            <SelectItem value="Strategy Session">Strategy Session</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-white/10 text-white">
                            <SelectItem value="All Statuses">All Statuses</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
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
                            {visibleColumns.lead && <TableHead className="text-white/70">Lead/Client</TableHead>}
                            {visibleColumns.dateTime && <TableHead className="text-white/70">Date & Time</TableHead>}
                            {visibleColumns.link && <TableHead className="text-white/70">Meeting Link</TableHead>}
                            {visibleColumns.status && <TableHead className="text-white/70">Status</TableHead>}
                            {visibleColumns.actions && <TableHead className="text-right text-white/70">Action</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={Object.values(visibleColumns).filter(Boolean).length || 1} className="h-24 text-center">
                                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-white/50" />
                                </TableCell>
                            </TableRow>
                        ) : paginatedBookings.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={Object.values(visibleColumns).filter(Boolean).length || 1} className="h-24 text-center text-white/50">
                                    No meetings found matching your filters.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedBookings.map((booking) => {
                                const profile = getProfile(booking);

                                return (
                                    <TableRow
                                        key={booking.id}
                                        className="border-white/10 hover:bg-white/5 cursor-pointer"
                                        onClick={() => openBookingDetails(booking)}
                                    >
                                        {visibleColumns.lead && (
                                            <TableCell className="font-medium text-white">
                                                <div>{profile?.full_name || 'Unknown'}</div>
                                                <div className="text-xs text-white/50">{profile?.email}</div>
                                                <div className="text-xs text-[#FFBF00] mt-1">{booking.title}</div>
                                            </TableCell>
                                        )}
                                        {visibleColumns.dateTime && (
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
                                        )}
                                        {visibleColumns.link && (
                                            <TableCell>
                                                {booking.meeting_link ? (
                                                    <a
                                                        href={booking.meeting_link.startsWith('http') ? booking.meeting_link : `https://${booking.meeting_link}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 transition-colors text-sm"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <LinkIcon className="h-3.5 w-3.5" />
                                                        Join Meet
                                                    </a>
                                                ) : (
                                                    <span className="text-white/40 italic text-sm">Not provided</span>
                                                )}
                                            </TableCell>
                                        )}
                                        {visibleColumns.status && (
                                            <TableCell>
                                                <Badge variant="outline" className={`
                        ${booking.status === 'Scheduled' ? 'border-[#FFBF00]/50 text-[#FFBF00]' :
                                                        booking.status === 'Completed' ? 'border-green-500/50 text-green-400' :
                                                            booking.status === 'Pending' ? 'border-blue-500/50 text-blue-400' :
                                                                'border-red-500/50 text-red-400'}
                      `}>
                                                    {booking.status}
                                                </Badge>
                                            </TableCell>
                                        )}
                                        {visibleColumns.actions && (
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

                                                        <DropdownMenuItem
                                                            className="hover:bg-white/10 cursor-pointer text-white hover:text-white focus:bg-white/10 focus:text-white"
                                                            onClick={() => {
                                                                openBookingDetails(booking);
                                                            }}
                                                        >
                                                            <LinkIcon className="mr-2 h-4 w-4" />
                                                            Add/Edit Link
                                                        </DropdownMenuItem>

                                                        <DropdownMenuSeparator className="bg-white/10" />

                                                        {booking.status === 'Pending' && (
                                                            <DropdownMenuItem
                                                                className="hover:bg-white/10 cursor-pointer text-[#FFBF00] hover:text-[#FFBF00] focus:bg-white/10 focus:text-[#FFBF00]"
                                                                onClick={() => {
                                                                    openBookingDetails(booking);
                                                                    toast.error("Please add a meeting link and then update status to Scheduled.");
                                                                }}
                                                            >
                                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                                Confirm (Add Link)
                                                            </DropdownMenuItem>
                                                        )}

                                                        {(booking.status === 'Pending' || booking.status === 'Scheduled') && (
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
                                                                Cancel Meeting
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>

                {filteredBookings.length > 0 && (
                    <div className="flex items-center justify-between p-4 border-t border-white/10 text-white/70 bg-white/5 rounded-b-md">
                        <div className="flex items-center gap-4 text-sm">
                            <span>
                                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredBookings.length)} of {filteredBookings.length} entries
                            </span>
                            <div className="flex items-center gap-2 border-l border-white/10 pl-4 hidden sm:flex">
                                <span>Rows per page:</span>
                                <Select value={itemsPerPage.toString()} onValueChange={(v) => setItemsPerPage(Number(v))}>
                                    <SelectTrigger className="w-[70px] h-8 bg-transparent border-white/10 text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-black border-white/10 text-white min-w-[70px]">
                                        <SelectItem value="5">5</SelectItem>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="20">20</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                className="bg-transparent border-white/10 text-white hover:bg-white/10"
                            >
                                Previous
                            </Button>
                            <span className="flex items-center px-2 text-sm">
                                Page {currentPage} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                className="bg-transparent border-white/10 text-white hover:bg-white/10"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            {/* Booking Details Modal */}
            <Dialog open={!!selectedBooking} onOpenChange={(open: boolean) => !open && setSelectedBooking(null)}>
                <DialogContent className="bg-black border border-white/10 text-white sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Meeting Details</DialogTitle>
                        <DialogDescription className="text-white/60">
                            Information regarding the scheduled meeting and the associated client.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedBooking && (() => {
                        const profile = getProfile(selectedBooking);

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
                                                        selectedBooking.status === 'Pending' ? 'border-blue-500/50 text-blue-400' :
                                                            'border-red-500/50 text-red-400'}
                                        `}>
                                                {selectedBooking.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-white/50 text-xs uppercase tracking-wider mb-2 block">Meeting Link URL</Label>
                                    <div className="flex gap-2 items-center">
                                        <div className="relative flex-1">
                                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                                            <Input
                                                value={editMeetingLink}
                                                onChange={(e) => setEditMeetingLink(e.target.value)}
                                                placeholder="e.g. https://zoom.us/j/123456789"
                                                className="pl-9 bg-white/5 border-white/10 text-white focus-visible:ring-[#FFBF00]"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Button
                                                onClick={saveMeetingLink}
                                                disabled={isSavingLink || editMeetingLink === (selectedBooking.meeting_link || '')}
                                                className="bg-[#FFBF00] text-black hover:bg-[#FFBF00]/90 font-medium"
                                            >
                                                {isSavingLink ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-1.5" />}
                                                Save Link
                                            </Button>
                                            {selectedBooking.status === 'Pending' && (
                                                <Button
                                                    onClick={() => updateBookingStatus(selectedBooking.id, 'Scheduled')}
                                                    disabled={!editMeetingLink || editMeetingLink.trim() === '' || isSavingLink}
                                                    className="bg-green-500 text-black hover:bg-green-600 font-medium whitespace-nowrap"
                                                >
                                                    Confirm
                                                </Button>
                                            )}
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

                                <div className="bg-white/5 rounded-md p-4 border border-white/10 space-y-4">
                                    <div className="flex flex-col gap-2 mb-2">
                                        <span className="text-white/70 text-sm">Title:</span>
                                        <span className="text-white font-medium">{selectedBooking.title}</span>
                                    </div>
                                    {selectedBooking.description && (
                                        <div className="flex flex-col gap-2">
                                            <span className="text-white/70 text-sm">Description:</span>
                                            <span className="text-white text-sm whitespace-pre-wrap">{selectedBooking.description}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center text-sm pt-2 border-t border-white/10">
                                        <span className="text-white/70">Duration:</span>
                                        <span className="text-white font-medium">60 Minutes</span>
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
        </div >
    );
}
