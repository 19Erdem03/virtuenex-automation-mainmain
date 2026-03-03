import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Loader2,
    Clock,
} from "lucide-react";
import { toast } from "sonner";
import { format, isBefore, startOfDay } from "date-fns";

const getAvailableHoursForDate = (date: Date) => {
    // Use UTC date to determine day, since we are booking in UTC Timezone
    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const day = utcDate.getUTCDay();
    const isWeekend = day === 0 || day === 6;

    // Admin available: weekdays 15-21 UTC, weekends 06-21 UTC
    const startHour = isWeekend ? 6 : 15;
    const endHour = 21;

    const hours = [];
    for (let i = startHour; i <= endHour; i++) {
        hours.push(`${i.toString().padStart(2, '0')}:00`);
    }
    return hours;
};

export function ClientBookingPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isBooking, setIsBooking] = useState(false);

    useEffect(() => {
        if (!selectedDate) {
            setAvailableSlots([]);
            setSelectedTime("");
            return;
        }

        const fetchAvailability = async () => {
            setIsLoadingSlots(true);
            setSelectedTime("");
            try {
                const start = new Date(Date.UTC(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 0, 0, 0));
                const end = new Date(Date.UTC(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 23, 59, 59, 999));

                const { data, error } = await supabase
                    .from('bookings')
                    .select('scheduled_for')
                    .in('status', ['Scheduled', 'Pending', 'Rescheduled'])
                    .gte('scheduled_for', start.toISOString())
                    .lte('scheduled_for', end.toISOString());

                if (error) throw error;

                const bookedTimes = (data || []).map(b => {
                    const date = new Date(b.scheduled_for);
                    return `${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')}`;
                });

                const now = new Date();
                const currentUtcDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
                const selectedUtcDate = new Date(Date.UTC(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()));
                const isToday = selectedUtcDate.getTime() === currentUtcDate.getTime();

                const currentHour = now.getUTCHours();
                const currentMinute = now.getUTCMinutes();

                const dayHours = getAvailableHoursForDate(selectedDate);
                const available = dayHours.filter(time => {
                    if (bookedTimes.includes(time)) return false;
                    if (isToday) {
                        const [hour, min] = time.split(':').map(Number);
                        if (hour < currentHour || (hour === currentHour && min <= currentMinute)) {
                            return false;
                        }
                    }
                    return true;
                });

                setAvailableSlots(available);
            } catch (error) {
                console.error("Error fetching availability:", error);
                toast.error("Failed to load time slots.");
            } finally {
                setIsLoadingSlots(false);
            }
        };

        fetchAvailability();
    }, [selectedDate]);

    const submitBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !selectedDate || !selectedTime || !title.trim()) {
            toast.error("Please fill all required fields and select a date and time.");
            return;
        }

        setIsBooking(true);
        try {
            const [hours, minutes] = selectedTime.split(':').map(Number);
            const scheduledDate = new Date(Date.UTC(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), hours, minutes, 0, 0));

            const { data: booking, error } = await supabase.from("bookings").insert({
                user_id: user.id,
                title: title.trim(),
                description: description.trim() || null,
                scheduled_for: scheduledDate.toISOString(),
                status: "Pending",
            }).select().single();

            if (error) throw error;

            // Notify admins
            const userName = user.user_metadata?.full_name || user.email || "A client";
            await supabase.from("admin_notifications").insert({
                title: "New Meeting Request",
                message: `${userName} requested a meeting: ${title.trim()}`,
                type: "booking_request",
                related_entity_id: booking.id,
                is_read: false
            });

            toast.success("Booking request submitted! The admin has been notified and will review your request shortly.");
            navigate("/dashboard/bookings");
        } catch (e: any) {
            console.error("Error creating booking:", e);
            toast.error(e.message ?? "Failed to request booking. Please try again.");
        } finally {
            setIsBooking(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
            <div>
                <h2 className="text-2xl font-bold text-white">Request a Meeting</h2>
                <p className="text-sm text-white/60 mt-1">
                    Select a preferred date and provide details about what you'd like to discuss.
                    Our team will review your request and confirm a specific time with a meeting link.
                </p>
                <div className="mt-4 p-4 rounded-lg bg-[#FFBF00]/10 border border-[#FFBF00]/20 max-w-2xl">
                    <h3 className="text-[#FFBF00] font-medium mb-1 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Important: Timezone & Availability
                    </h3>
                    <p className="text-sm text-white/80 leading-relaxed mb-2">
                        Please select your preferred time according to the <strong>UTC Timezone</strong>. Admin availability (in UTC) is as follows:
                    </p>
                    <ul className="text-sm text-white/70 space-y-1 list-disc list-inside">
                        <li><strong>Weekdays:</strong> 15:00 - 21:00 UTC</li>
                        <li><strong>Weekends:</strong> 06:00 - 21:00 UTC</li>
                    </ul>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 text-white h-fit">
                    <Label className="text-white/70 mb-4 block text-base font-semibold">1. Select Preferred Date</Label>
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => isBefore(date, startOfDay(new Date()))}
                        className="w-full bg-transparent border-none text-white p-0"
                        classNames={{
                            months: "w-full",
                            month: "w-full space-y-4",
                            caption: "flex justify-center pt-1 relative items-center mb-4",
                            caption_label: "text-sm font-medium",
                            nav: "space-x-1 flex items-center bg-white/5 rounded-md p-1",
                            nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 flex items-center justify-center rounded-md hover:bg-white/10",
                            table: "w-full border-collapse space-y-1",
                            head_row: "flex w-full",
                            head_cell: "text-white/50 rounded-md w-9 font-normal text-[0.8rem] flex-1 text-center pb-2",
                            row: "flex w-full mt-2",
                            cell: "text-center text-sm p-0 flex-1 relative flex items-center justify-center rounded-md hover:bg-white/5",
                            day: "h-9 w-9 p-0 font-normal hover:bg-white/10 rounded-md flex items-center justify-center",
                            day_selected: "bg-[#FFBF00] text-black hover:bg-[#FFBF00] hover:text-black focus:bg-[#FFBF00] focus:text-black font-semibold",
                            day_today: "text-[#FFBF00] font-bold",
                            day_outside: "text-white/20 opacity-50",
                            day_disabled: "text-white/20 opacity-50 hover:bg-transparent",
                            day_hidden: "invisible",
                        }}
                    />
                    {selectedDate && (
                        <div className="mt-6 pt-6 border-t border-white/10">
                            <Label className="text-white/70 mb-4 block text-base font-semibold">Select Time</Label>
                            {isLoadingSlots ? (
                                <div className="flex items-center justify-center p-8 bg-white/5 rounded-md">
                                    <Loader2 className="h-6 w-6 animate-spin text-[#FFBF00]" />
                                </div>
                            ) : availableSlots.length === 0 ? (
                                <div className="bg-white/5 p-8 rounded-md text-center border border-white/10">
                                    <p className="text-sm text-white/50">No available slots for this date.</p>
                                    <p className="text-xs text-white/40 mt-1">Please select another date.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {availableSlots.map(time => {
                                        const [h, m] = time.split(':');
                                        const formattedTime = new Date();
                                        formattedTime.setHours(Number(h), Number(m));
                                        return (
                                            <Button
                                                key={time}
                                                type="button"
                                                variant="outline"
                                                onClick={() => setSelectedTime(time)}
                                                className={`border-white/10 ${selectedTime === time ? 'bg-[#FFBF00] text-black hover:bg-[#FFBF00]' : 'bg-transparent text-white hover:bg-white/10'}`}
                                            >
                                                {format(formattedTime, "h:mm a")} UTC
                                            </Button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 text-white h-fit">
                    <Label className="text-white/70 mb-4 block text-base font-semibold">2. Meeting Details</Label>
                    <form onSubmit={submitBooking} className="flex flex-col gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-white/80">Title <span className="text-[#FFBF00]">*</span></Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Project Consultation"
                                className="bg-white/5 border-white/10 text-white focus-visible:ring-[#FFBF00]"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-white/80">Description / Agenda <span className="text-white/40 text-xs ml-1">(Optional)</span></Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="What would you like to discuss?"
                                className="bg-white/5 border-white/10 text-white focus-visible:ring-[#FFBF00] min-h-[120px] resize-none"
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={isBooking || !selectedDate || !selectedTime || !title.trim()}
                            className="bg-[#FFBF00] text-black hover:bg-[#FFBF00]/90 font-semibold w-full mt-4 h-11"
                        >
                            {isBooking ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : null}
                            {isBooking ? "Submitting Request..." : "Request Meeting"}
                        </Button>
                        {!selectedDate ? (
                            <p className="text-xs text-center text-red-400 mt-2">Please select a preferred date first.</p>
                        ) : !selectedTime ? (
                            <p className="text-xs text-center text-red-400 mt-2">Please select a time slot.</p>
                        ) : null}
                    </form>
                </div>
            </div>
        </div>
    );
}
