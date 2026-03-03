import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, XCircle, CalendarClock, Loader2, RefreshCw, Link as LinkIcon } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

const STATUS_COLORS: Record<string, string> = {
    Scheduled: "border-[#FFBF00]/50 text-[#FFBF00]",
    Rescheduled: "border-blue-500/50 text-blue-400",
    Completed: "border-green-500/50 text-green-400",
    Cancelled: "border-red-500/50 text-red-400",
};

function getStatusIcon(status: string) {
    switch (status) {
        case "Completed":
            return <CheckCircle className="h-4 w-4 text-green-400" />;
        case "Cancelled":
            return <XCircle className="h-4 w-4 text-red-400" />;
        case "Rescheduled":
            return <RefreshCw className="h-4 w-4 text-blue-400" />;
        default:
            return <Calendar className="h-4 w-4 text-[#FFBF00]" />;
    }
}

function getStatusMessage(status: string, scheduledFor: string) {
    const dateStr = format(new Date(scheduledFor), "MMM d 'at' h:mm a");
    switch (status) {
        case "Scheduled":
            return `Meeting confirmed for ${dateStr}.`;
        case "Rescheduled":
            return `Your meeting has been rescheduled to ${dateStr}.`;
        case "Completed":
            return `Your meeting on ${dateStr} has been marked as completed.`;
        case "Cancelled":
            return `Your meeting on ${dateStr} was cancelled.`;
        default:
            return `Meeting update for ${dateStr}.`;
    }
}

export function ClientNotificationsPage() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        fetchBookings();

        const sub = supabase
            .channel("client_notifications_page")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "bookings", filter: `user_id=eq.${user.id}` },
                () => fetchBookings()
            )
            .subscribe();

        return () => { sub.unsubscribe(); };
    }, [user]);

    const fetchBookings = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from("bookings")
                .select("*, tours(*)")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });
            if (error) throw error;
            setBookings(data || []);
        } catch (e) {
            console.error("Error fetching notifications:", e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 max-w-2xl">
            <p className="text-xs text-white/35">
                Activity feed for your meetings with VirtueNex. Updates appear here in real time.
            </p>

            {isLoading ? (
                <div className="flex justify-center py-16">
                    <Loader2 className="h-6 w-6 animate-spin text-[#FFBF00]" />
                </div>
            ) : bookings.length === 0 ? (
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-12 text-center">
                    <CalendarClock className="h-12 w-12 text-white/15 mx-auto mb-3" />
                    <p className="text-white/40 text-sm">No activity yet.</p>
                    <p className="text-white/25 text-xs mt-1">
                        Meeting updates will appear here once you have booked a session.
                    </p>
                </div>
            ) : (
                <div className="relative flex flex-col gap-0">
                    {/* Vertical timeline line */}
                    <div className="absolute left-[19px] top-5 bottom-5 w-px bg-white/10" />

                    {bookings.map((b, i) => {
                        const tour = Array.isArray(b.tours) ? b.tours[0] : b.tours;
                        return (
                            <div key={b.id} className="relative flex gap-4 pb-5 last:pb-0">
                                {/* Icon bubble */}
                                <div className="relative z-10 flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-black border border-white/10">
                                    {getStatusIcon(b.status)}
                                </div>

                                {/* Content */}
                                <div
                                    className={`flex-1 rounded-xl border p-4 ${
                                        i === 0
                                            ? "border-white/15 bg-white/[0.03]"
                                            : "border-white/5 bg-white/[0.01]"
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-3 flex-wrap">
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm ${i === 0 ? "text-white font-medium" : "text-white/60"}`}>
                                                {getStatusMessage(b.status, b.scheduled_for)}
                                            </p>
                                            {b.meeting_link && b.status !== "Cancelled" && (
                                                <a
                                                    href={
                                                        b.meeting_link.startsWith("http")
                                                            ? b.meeting_link
                                                            : `https://${b.meeting_link}`
                                                    }
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1 mt-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                                                >
                                                    <LinkIcon className="h-3 w-3" />
                                                    Meeting link available
                                                </a>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <Badge
                                                variant="outline"
                                                className={`text-xs ${STATUS_COLORS[b.status] || "border-white/20 text-white/40"}`}
                                            >
                                                {b.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-white/30 mt-2">
                                        Booked {formatDistanceToNow(new Date(b.created_at), { addSuffix: true })}
                                        {tour && ` · ${tour.duration_minutes} min session`}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
