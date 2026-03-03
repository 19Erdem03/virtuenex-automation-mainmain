import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar as CalendarIcon, Clock, Plus, Video, CalendarClock, Loader2, X, List } from "lucide-react";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";

const formatUTC = (dateStr: string, formatType: 'short' | 'long') => {
    const d = new Date(dateStr);
    if (formatType === 'short') {
        const datePart = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric', year: 'numeric' }).format(d);
        const timePart = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', hour: 'numeric', minute: '2-digit', hour12: true }).format(d);
        return `${datePart} · ${timePart} UTC`;
    }
    const datePart = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', weekday: 'long', month: 'short', day: 'numeric' }).format(d);
    const timePart = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', hour: 'numeric', minute: '2-digit', hour12: true }).format(d);
    return `${datePart} at ${timePart} UTC`;
};

const BOOKING_STATUS_COLORS: Record<string, string> = {
    'Pending': 'border-blue-500/50 text-blue-400',
    'Scheduled': 'border-[#FFBF00]/50 text-[#FFBF00]',
    'Completed': 'border-green-500/50 text-green-400',
    'Cancelled': 'border-red-500/50 text-red-400',
    'Rescheduled': 'border-orange-500/50 text-orange-400',
};

export function ClientBookingsPage() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCancelling, setIsCancelling] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

    useEffect(() => {
        const fetchBookings = async () => {
            if (!user) return;
            setIsLoading(true);
            try {
                const { data, error } = await supabase
                    .from('bookings')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('scheduled_for', { ascending: false });

                if (error) throw error;
                setBookings(data || []);
            } catch (error) {
                console.error("Error fetching bookings:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookings();
    }, [user]);

    const handleCancelBooking = async (bookingId: string) => {
        setIsCancelling(bookingId);
        try {
            const { error } = await supabase
                .from('bookings')
                .update({ status: 'Cancelled' })
                .eq('id', bookingId);

            if (error) throw error;

            toast.success("Booking cancelled successfully.");
            setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: 'Cancelled' } : b));
        } catch (error: any) {
            console.error("Error cancelling booking:", error);
            toast.error(error.message || "Failed to cancel booking.");
        } finally {
            setIsCancelling(null);
        }
    };

    const upcomingBookings = bookings.filter(b => b.status === "Scheduled" || b.status === "Pending" || b.status === "Rescheduled");
    const pastBookings = bookings.filter(b => b.status === "Completed" || b.status === "Cancelled");
    const bookingsForSelectedDate = selectedDate ? bookings.filter(b => {
        const d = new Date(b.scheduled_for);
        return d.getUTCFullYear() === selectedDate.getFullYear() &&
            d.getUTCMonth() === selectedDate.getMonth() &&
            d.getUTCDate() === selectedDate.getDate();
    }) : [];

    // Helper to render a single booking card (used in both list and calendar views)
    const renderBookingCard = (booking: any, isPast = false) => {
        if (isPast) {
            return (
                <div key={booking.id} className="rounded-xl border border-white/5 bg-white/[0.01] p-4 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                            <Clock className="h-4 w-4 text-white/40" />
                        </div>
                        <div>
                            <h3 className="text-md font-medium text-white/80">{booking.title}</h3>
                            <div className="text-sm text-white/30 mt-0.5">
                                {formatUTC(booking.scheduled_for, 'short')}
                            </div>
                        </div>
                    </div>
                    <div>
                        <Badge variant="outline" className={BOOKING_STATUS_COLORS[booking.status] || 'border-white/20 text-white/40'}>
                            {booking.status}
                        </Badge>
                    </div>
                </div>
            )
        }

        return (
            <div key={booking.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between hover:border-[#FFBF00]/25 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-[#FFBF00]/10 border border-[#FFBF00]/20 flex items-center justify-center">
                        <CalendarIcon className="h-5 w-5 text-[#FFBF00]" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-white">{booking.title}</h3>
                        <div className="flex items-center gap-3 mt-1text-sm text-white/40">
                            <span className="flex items-center gap-1.5 text-sm text-white/40">
                                <Clock className="h-3.5 w-3.5" />
                                {formatUTC(booking.scheduled_for, 'long')}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3 sm:w-auto w-full justify-between sm:justify-end mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-white/5">
                    <Badge variant="outline" className={BOOKING_STATUS_COLORS[booking.status]}>
                        {booking.status}
                    </Badge>

                    {booking.meeting_link ? (
                        <a
                            href={booking.meeting_link.startsWith('http') ? booking.meeting_link : `https://${booking.meeting_link}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <Button size="sm" className="bg-[#FFBF00] text-black hover:bg-[#FFBF00]/90">
                                <Video className="h-4 w-4 mr-2" />
                                Join
                            </Button>
                        </a>
                    ) : booking.status === 'Scheduled' && (
                        <Button size="sm" variant="outline" className="border-white/10 text-white/50" disabled>
                            <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                            Link Pending
                        </Button>
                    )}

                    {(booking.status === 'Pending' || booking.status === 'Scheduled' || booking.status === 'Rescheduled') && (
                        <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300 ml-1"
                            onClick={() => handleCancelBooking(booking.id)}
                            disabled={isCancelling === booking.id}
                        >
                            {isCancelling === booking.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    <X className="h-4 w-4 mr-1" />
                                    Cancel
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">My Bookings</h1>
                    <p className="text-white/60">View and manage your strategy sessions.</p>
                </div>
                <Link to="/dashboard/book">
                    <Button className="bg-[#FFBF00] text-black hover:bg-[#FFBF00]/90 font-semibold gap-2">
                        <Plus className="h-4 w-4" />
                        Request Meeting
                    </Button>
                </Link>
            </div>

            <Tabs defaultValue="list" className="w-full">
                <div className="flex items-center justify-between mb-6">
                    <TabsList className="bg-white/5 border border-white/10 h-10">
                        <TabsTrigger value="list" className="data-[state=active]:bg-[#FFBF00] data-[state=active]:text-black text-white/60">
                            <List className="h-4 w-4 mr-2" />
                            List View
                        </TabsTrigger>
                        <TabsTrigger value="calendar" className="data-[state=active]:bg-[#FFBF00] data-[state=active]:text-black text-white/60">
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            Calendar View
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="list" className="mt-0 outline-none">
                    <div className="grid gap-8">
                        {/* Upcoming Bookings section */}
                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">Upcoming Meetings</h2>
                            {isLoading ? (
                                <div className="space-y-4">
                                    {[1, 2].map(i => (
                                        <div key={i} className="rounded-xl border border-white/10 bg-white/[0.02] p-5 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <Skeleton className="h-12 w-12 rounded-full bg-white/5" />
                                                <div className="space-y-2">
                                                    <Skeleton className="h-5 w-40 bg-white/5" />
                                                    <Skeleton className="h-4 w-24 bg-white/5" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : upcomingBookings.length === 0 ? (
                                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-12 text-center">
                                    <CalendarClock className="h-12 w-12 text-white/15 mx-auto mb-3" />
                                    <h3 className="text-lg font-medium text-white mb-1">No upcoming meetings</h3>
                                    <p className="text-white/40 mb-6">You don't have any scheduled sessions yet.</p>
                                    <Link to="/dashboard/book">
                                        <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
                                            Request a Meeting
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {upcomingBookings.map((booking) => renderBookingCard(booking))}
                                </div>
                            )}
                        </section>

                        {/* Past Bookings section */}
                        {!isLoading && pastBookings.length > 0 && (
                            <section>
                                <h2 className="text-lg font-medium text-white/80 mb-4">Past Meetings</h2>
                                <div className="grid gap-3 opacity-75">
                                    {pastBookings.map((booking) => renderBookingCard(booking, true))}
                                </div>
                            </section>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="calendar" className="mt-0 outline-none">
                    <div className="grid lg:grid-cols-[1fr_400px] gap-8">
                        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 h-fit">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={(date) => date && setSelectedDate(date)}
                                className="w-full bg-transparent border-none text-white p-0 flex justify-center"
                                modifiers={{
                                    hasBooking: (date) => bookings.some(b => {
                                        const d = new Date(b.scheduled_for);
                                        return d.getUTCFullYear() === date.getFullYear() &&
                                            d.getUTCMonth() === date.getMonth() &&
                                            d.getUTCDate() === date.getDate();
                                    })
                                }}
                                modifiersClassNames={{
                                    hasBooking: "after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-1.5 after:w-1.5 after:bg-[#FFBF00] after:rounded-full relative"
                                }}
                                classNames={{
                                    months: "w-full",
                                    month: "w-full space-y-4",
                                    caption: "flex justify-center pt-1 relative items-center mb-4",
                                    caption_label: "text-lg font-medium text-white",
                                    nav: "space-x-1 flex items-center bg-white/5 rounded-md p-1",
                                    nav_button: "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 flex items-center justify-center rounded-md hover:bg-white/10 text-white",
                                    table: "w-full border-collapse space-y-2",
                                    head_row: "flex w-full",
                                    head_cell: "text-white/50 rounded-md font-normal text-sm flex-1 text-center pb-2",
                                    row: "flex w-full mt-2",
                                    cell: "text-center text-sm p-0 flex-1 relative flex items-center justify-center rounded-md hover:bg-white/5 min-h-[50px]",
                                    day: "h-10 w-10 p-0 font-normal hover:bg-white/10 rounded-full flex items-center justify-center text-white/80 mx-auto",
                                    day_selected: "bg-[#FFBF00] !text-black hover:bg-[#FFBF00] hover:text-black focus:bg-[#FFBF00] focus:text-black font-semibold",
                                    day_today: "text-[#FFBF00] font-bold border border-[#FFBF00]/30",
                                    day_outside: "text-white/20 opacity-50",
                                    day_disabled: "text-white/20 opacity-50 hover:bg-transparent",
                                    day_hidden: "invisible",
                                }}
                            />
                        </div>

                        <div className="flex flex-col gap-4">
                            <h3 className="text-xl font-semibold text-white mb-2">
                                {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}
                            </h3>

                            {isLoading ? (
                                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 flex justify-center py-12">
                                    <Loader2 className="h-6 w-6 animate-spin text-white/40" />
                                </div>
                            ) : bookingsForSelectedDate.length === 0 ? (
                                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-8 text-center">
                                    <CalendarClock className="h-10 w-10 text-white/10 mx-auto mb-3" />
                                    <p className="text-white/40 mb-1">No meetings on this day.</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {bookingsForSelectedDate.map(booking =>
                                        renderBookingCard(booking, booking.status === 'Completed' || booking.status === 'Cancelled')
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
