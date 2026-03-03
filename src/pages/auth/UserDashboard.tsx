import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import {
    Calendar,
    Clock,
    ExternalLink,
    Loader2,
    CalendarClock,
    Plus,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const BOOKING_STATUS_COLORS: Record<string, string> = {
    Scheduled: 'border-[#FFBF00]/50 text-[#FFBF00]',
    Rescheduled: 'border-blue-500/50 text-blue-400',
    Completed: 'border-green-500/50 text-green-400',
    Cancelled: 'border-red-500/50 text-red-400',
};

export const UserDashboard = () => {
    const { profile, user } = useAuth();
    const [bookings, setBookings] = useState<any[]>([]);
    const [isLoadingBookings, setIsLoadingBookings] = useState(true);

    useEffect(() => {
        if (!user) return;

        fetchBookings();

        const sub = supabase
            .channel('user_dashboard_bookings')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'bookings', filter: `user_id=eq.${user.id}` },
                () => fetchBookings()
            )
            .subscribe();

        return () => { sub.unsubscribe(); };
    }, [user]);

    const fetchBookings = async () => {
        if (!user) return;
        setIsLoadingBookings(true);
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select('*')
                .eq('user_id', user.id)
                .order('scheduled_for', { ascending: true });
            if (error) throw error;
            setBookings(data || []);
        } catch (e) {
            console.error('Error fetching bookings:', e);
        } finally {
            setIsLoadingBookings(false);
        }
    };

    const now = new Date();
    const upcomingBookings = bookings.filter(
        b => b.status !== 'Cancelled' && b.status !== 'Completed' && new Date(b.scheduled_for) >= now
    );
    const pastBookings = bookings.filter(
        b => b.status === 'Completed' || b.status === 'Cancelled' || new Date(b.scheduled_for) < now
    );

    return (
        <div className="flex flex-col gap-8 max-w-5xl">
            {/* Welcome */}
            <div>
                <h1 className="text-2xl font-bold text-white">
                    Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}
                    <span className="text-[#FFBF00]">.</span>
                </h1>
                <p className="text-white/40 mt-1 text-sm">
                    Here's an overview of your account activity.
                </p>
            </div>

            {/* Meetings Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upcoming Meetings */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-semibold text-white flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-[#FFBF00]" />
                            Upcoming Meetings
                        </h2>
                        <Link
                            to="/dashboard/book"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFBF00]/10 text-[#FFBF00] hover:bg-[#FFBF00]/20 text-xs font-medium transition-colors"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            Book a Session
                        </Link>
                    </div>

                    {isLoadingBookings ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-5 w-5 animate-spin text-[#FFBF00]" />
                        </div>
                    ) : upcomingBookings.length === 0 ? (
                        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 text-center">
                            <CalendarClock className="h-8 w-8 text-white/15 mx-auto mb-2" />
                            <p className="text-white/40 text-sm">No upcoming meetings</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {upcomingBookings.map(b => (
                                <div
                                    key={b.id}
                                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 hover:border-[#FFBF00]/25 transition-colors"
                                >
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#FFBF00]/10 border border-[#FFBF00]/20 flex items-center justify-center">
                                        <Calendar className="h-4 w-4 text-[#FFBF00]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-white">{b.title}</div>
                                        <div className="text-xs text-white/40 mt-0.5">
                                            {format(new Date(b.scheduled_for), 'MMM d, yyyy · h:mm a')}
                                            {` · 60 min`}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        {b.meeting_link && (
                                            <a
                                                href={b.meeting_link.startsWith('http') ? b.meeting_link : `https://${b.meeting_link}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1 px-2 py-1 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 text-xs transition-colors"
                                            >
                                                <ExternalLink className="h-3 w-3" />
                                                Join
                                            </a>
                                        )}
                                        <Badge
                                            variant="outline"
                                            className={`text-xs ${BOOKING_STATUS_COLORS[b.status] || 'border-white/20 text-white/50'}`}
                                        >
                                            {b.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!isLoadingBookings && pastBookings.length > 0 && (
                        <div className="mt-4">
                            <p className="text-xs text-white/30 uppercase tracking-wider mb-2">Past</p>
                            <div className="flex flex-col gap-1.5">
                                {pastBookings.slice(0, 3).map(b => (
                                    <div
                                        key={b.id}
                                        className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.01] px-4 py-2.5"
                                    >
                                        <Clock className="h-3 w-3 text-white/20 shrink-0" />
                                        <div className="flex-1 text-xs text-white/35">
                                            {format(new Date(b.scheduled_for), 'MMM d, yyyy')}
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className={`text-xs ${BOOKING_STATUS_COLORS[b.status] || 'border-white/15 text-white/30'}`}
                                        >
                                            {b.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            </div >
        </div >
    );
};
