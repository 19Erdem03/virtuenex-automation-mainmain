import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import {
    Calendar,
    Clock,
    ExternalLink,
    Loader2,
    Server,
    DollarSign,
    CalendarClock,
    TrendingUp,
    Info,
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

const DEPLOYMENT_STATUS_COLORS: Record<string, string> = {
    Active: 'border-green-500/50 text-green-400',
    Building: 'border-blue-500/50 text-blue-400',
    Planning: 'border-[#FFBF00]/50 text-[#FFBF00]',
    Paused: 'border-white/20 text-white/40',
};

const PAYMENT_STATUS_COLORS: Record<string, string> = {
    Verified: 'border-green-500/50 text-green-400',
    Pending: 'border-[#FFBF00]/50 text-[#FFBF00]',
    Rejected: 'border-red-500/50 text-red-400',
};

export const ClientDashboard = () => {
    const { profile, user } = useAuth();
    const [bookings, setBookings] = useState<any[]>([]);
    const [deployments, setDeployments] = useState<any[]>([]);
    const [payments, setPayments] = useState<any[]>([]);
    const [isLoadingBookings, setIsLoadingBookings] = useState(true);
    const [isLoadingDeployments, setIsLoadingDeployments] = useState(true);
    const [isLoadingPayments, setIsLoadingPayments] = useState(true);

    useEffect(() => {
        if (!user) return;

        fetchBookings();
        fetchDeployments();
        fetchPayments();

        const sub = supabase
            .channel('client_dashboard_bookings')
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

    const fetchDeployments = async () => {
        if (!user) return;
        setIsLoadingDeployments(true);
        try {
            const { data, error } = await supabase
                .from('system_deployments')
                .select('*, system_types(name)')
                .eq('client_id', user.id)
                .order('created_at', { ascending: false });
            if (error) throw error;
            setDeployments(data || []);
        } catch (e) {
            console.error('Error fetching deployments:', e);
        } finally {
            setIsLoadingDeployments(false);
        }
    };

    const fetchPayments = async () => {
        if (!user) return;
        setIsLoadingPayments(true);
        try {
            const { data, error } = await supabase
                .from('payments')
                .select('*')
                .eq('client_id', user.id)
                .order('created_at', { ascending: false });
            if (error) throw error;
            setPayments(data || []);
        } catch (e) {
            console.error('Error fetching payments:', e);
        } finally {
            setIsLoadingPayments(false);
        }
    };

    const now = new Date();
    const upcomingBookings = bookings.filter(
        b => b.status !== 'Cancelled' && b.status !== 'Completed' && new Date(b.scheduled_for) >= now
    );
    const pastBookings = bookings.filter(
        b => b.status === 'Completed' || b.status === 'Cancelled' || new Date(b.scheduled_for) < now
    );

    const activeDeployments = deployments.filter(d => d.status === 'Active').length;
    const totalPaid = payments
        .filter(p => p.payment_status === 'Verified')
        .reduce((sum, p) => sum + Number(p.amount_paid), 0);
    const pendingPaymentsCount = payments.filter(p => p.payment_status === 'Pending').length;

    return (
        <div className="flex flex-col gap-8 max-w-5xl">
            {/* Welcome */}
            <div>
                <h1 className="text-2xl font-bold text-white">
                    Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}
                    <span className="text-[#FFBF00]">.</span>
                </h1>
                <p className="text-white/40 mt-1 text-sm">
                    Here's an overview of your AI deployments and account activity.
                </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-9 w-9 rounded-lg bg-green-500/10 flex items-center justify-center">
                            <Server className="h-4 w-4 text-green-400" />
                        </div>
                        <span className="text-xs text-white/50 uppercase tracking-wide">Active Deployments</span>
                    </div>
                    {isLoadingDeployments ? (
                        <Loader2 className="h-5 w-5 animate-spin text-white/30" />
                    ) : (
                        <p className="text-3xl font-bold text-white">{activeDeployments}</p>
                    )}
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-9 w-9 rounded-lg bg-[#FFBF00]/10 flex items-center justify-center">
                            <DollarSign className="h-4 w-4 text-[#FFBF00]" />
                        </div>
                        <span className="text-xs text-white/50 uppercase tracking-wide">Total Paid</span>
                    </div>
                    {isLoadingPayments ? (
                        <Loader2 className="h-5 w-5 animate-spin text-white/30" />
                    ) : (
                        <p className="text-3xl font-bold text-white">${totalPaid.toLocaleString()}</p>
                    )}
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <TrendingUp className="h-4 w-4 text-blue-400" />
                        </div>
                        <span className="text-xs text-white/50 uppercase tracking-wide">Total AI Systems</span>
                    </div>
                    {isLoadingDeployments ? (
                        <Loader2 className="h-5 w-5 animate-spin text-white/30" />
                    ) : (
                        <p className="text-3xl font-bold text-white">{deployments.length}</p>
                    )}
                </div>
            </div>

            {/* Meetings + Deployments */}
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

                {/* AI Deployments */}
                <section>
                    <h2 className="text-base font-semibold text-white flex items-center gap-2 mb-4">
                        <Server className="h-4 w-4 text-[#FFBF00]" />
                        AI System Deployments
                    </h2>

                    {isLoadingDeployments ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-5 w-5 animate-spin text-[#FFBF00]" />
                        </div>
                    ) : deployments.length === 0 ? (
                        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 text-center">
                            <Server className="h-8 w-8 text-white/15 mx-auto mb-2" />
                            <p className="text-white/40 text-sm">No AI systems deployed yet</p>
                            <p className="text-white/25 text-xs mt-1">
                                Contact us to get started with your first AI agent.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {deployments.map(d => {
                                const systemType = Array.isArray(d.system_types) ? d.system_types[0] : d.system_types;
                                return (
                                    <div
                                        key={d.id}
                                        className="rounded-xl border border-white/10 bg-white/[0.02] p-4 hover:border-white/20 transition-colors"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-sm text-white truncate">
                                                    {d.title || systemType?.name || 'AI System'}
                                                </div>
                                                {d.description && (
                                                    <div className="text-xs text-white/40 mt-0.5 line-clamp-1">
                                                        {d.description}
                                                    </div>
                                                )}
                                                <div className="text-xs text-white/25 mt-1">
                                                    Started {format(new Date(d.start_date), 'MMM d, yyyy')}
                                                </div>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className={`text-xs shrink-0 ${DEPLOYMENT_STATUS_COLORS[d.status] || 'border-white/20 text-white/50'}`}
                                            >
                                                {d.status}
                                            </Badge>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div >

            {/* Payment History */}
            < section >
                <h2 className="text-base font-semibold text-white flex items-center gap-2 mb-1">
                    <DollarSign className="h-4 w-4 text-[#FFBF00]" />
                    Payment History
                </h2>
                <p className="text-xs text-white/30 mb-4">
                    Payments recorded by VirtueNex (crypto, in-person, etc.)
                </p>

                {
                    isLoadingPayments ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-5 w-5 animate-spin text-[#FFBF00]" />
                        </div>
                    ) : payments.length === 0 ? (
                        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 text-center">
                            <DollarSign className="h-8 w-8 text-white/15 mx-auto mb-2" />
                            <p className="text-white/40 text-sm">No payment records yet</p>
                            <p className="text-white/25 text-xs mt-1">
                                Payment records will appear here once verified by our team.
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-white/10 overflow-hidden">
                            {payments.map((p, i) => (
                                <div
                                    key={p.id}
                                    className={`flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors ${i < payments.length - 1 ? 'border-b border-white/5' : ''}`}
                                >
                                    <div className="h-8 w-8 rounded-full bg-[#FFBF00]/10 flex items-center justify-center shrink-0">
                                        <DollarSign className="h-4 w-4 text-[#FFBF00]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm text-white/60 truncate font-mono">
                                            {p.transaction_hash}
                                        </div>
                                        <div className="text-xs text-white/30 mt-0.5">
                                            {format(new Date(p.created_at), 'MMM d, yyyy')}
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className="text-sm font-semibold text-white">
                                            ${Number(p.amount_paid).toLocaleString()}
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className={`text-xs mt-1 ${PAYMENT_STATUS_COLORS[p.payment_status] || ''}`}
                                        >
                                            {p.payment_status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}

                            {pendingPaymentsCount > 0 && (
                                <div className="px-4 py-3 bg-[#FFBF00]/5 border-t border-[#FFBF00]/10 flex items-center gap-2 text-xs text-[#FFBF00]/70">
                                    <Info className="h-3.5 w-3.5 shrink-0" />
                                    {pendingPaymentsCount} payment{pendingPaymentsCount > 1 ? 's' : ''} pending verification by our team.
                                </div>
                            )}
                        </div>
                    )
                }
            </section >
        </div >
    );
};
