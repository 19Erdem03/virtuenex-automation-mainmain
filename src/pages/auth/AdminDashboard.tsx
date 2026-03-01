import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Server, Clock, ArrowUpRight, TrendingUp, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type ActivityType = 'user' | 'admin';

interface ActivityItem {
    id: string;
    type: ActivityType;
    title: string;
    description: string;
    timestamp: Date;
    icon: any;
}

export function AdminDashboard() {
    const [metrics, setMetrics] = useState({
        totalClients: 0,
        activeSessions: 0,
        pendingRequests: 0, // Placeholder for future feature
        totalEarnings: 0
    });
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activityFilter, setActivityFilter] = useState<'all' | 'user' | 'admin'>('all');

    useEffect(() => {
        const fetchMetrics = async () => {
            setIsLoading(true);
            try {
                const [
                    clientsRes,
                    sessionsRes,
                    bookingsRes,
                    recentProfilesRes,
                    recentDeploymentsRes,
                    recentBookingsRes
                ] = await Promise.all([
                    supabase.from('profiles').select('*', { count: 'exact', head: true }).neq('role', 'Admin'),
                    supabase.from('system_deployments').select('*', { count: 'exact', head: true }).eq('status', 'Active'),
                    supabase.from('bookings').select(`
                        status,
                        tours (
                            properties (
                                price
                            )
                        )
                    `).neq('status', 'Cancelled'),
                    supabase.from('profiles').select('id, email, role, created_at').neq('role', 'Admin').order('created_at', { ascending: false }).limit(20),
                    supabase.from('system_deployments').select('id, created_at, system_types(name), profiles(email)').order('created_at', { ascending: false }).limit(20),
                    supabase.from('bookings').select('id, created_at, profiles(email), tours(properties(title))').order('created_at', { ascending: false }).limit(20)
                ]);

                let earnings = 0;
                if (bookingsRes.data) {
                    bookingsRes.data.forEach((booking: any) => {
                        const tour = Array.isArray(booking.tours) ? booking.tours[0] : booking.tours;
                        const property = tour ? (Array.isArray(tour.properties) ? tour.properties[0] : tour.properties) : null;
                        if (property && property.price) {
                            if (booking.status === 'Completed') {
                                earnings += Number(property.price);
                            }
                        }
                    });
                }

                setMetrics({
                    totalClients: clientsRes.count || 0,
                    activeSessions: sessionsRes.count || 0,
                    pendingRequests: 0,
                    totalEarnings: earnings
                });

                let feed: ActivityItem[] = [];

                if (recentProfilesRes.data) {
                    feed.push(...recentProfilesRes.data.map((p: any) => ({
                        id: `profile-${p.id}`,
                        type: 'user' as const,
                        title: 'New Client Registration',
                        description: `${p.email} joined as a ${p.role}`,
                        timestamp: new Date(p.created_at),
                        icon: Users
                    })));
                }

                if (recentDeploymentsRes.data) {
                    feed.push(...recentDeploymentsRes.data.map((d: any) => {
                        const sysTypeName = Array.isArray(d.system_types) ? d.system_types[0]?.name : d.system_types?.name;
                        const clientEmail = Array.isArray(d.profiles) ? d.profiles[0]?.email : d.profiles?.email;
                        return {
                            id: `deployment-${d.id}`,
                            type: 'admin' as const,
                            title: 'System Deployment',
                            description: `New ${sysTypeName || 'system'} deployment for ${clientEmail || 'Unknown Client'}`,
                            timestamp: new Date(d.created_at),
                            icon: Server
                        };
                    }));
                }

                if (recentBookingsRes.data) {
                    feed.push(...recentBookingsRes.data.map((b: any) => {
                        const tour = Array.isArray(b.tours) ? b.tours[0] : b.tours;
                        const prop = tour ? (Array.isArray(tour.properties) ? tour.properties[0] : tour.properties) : null;
                        const title = prop?.title;
                        const clientEmail = Array.isArray(b.profiles) ? b.profiles[0]?.email : b.profiles?.email;

                        return {
                            id: `booking-${b.id}`,
                            type: 'user' as const,
                            title: 'New Booking',
                            description: `${clientEmail || 'Client'} booked a tour ${title ? `for ${title}` : ''}`,
                            timestamp: new Date(b.created_at),
                            icon: Clock
                        };
                    }));
                }

                feed.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
                setActivities(feed);

            } catch (error) {
                console.error("Error fetching overview metrics:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
    };

    const filteredActivities = activities.filter(activity =>
        activityFilter === 'all' || activity.type === activityFilter
    ).slice(0, 10);

    return (
        <TooltipProvider delayDuration={300}>
            <div className="flex flex-col gap-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Overview</h1>
                    <p className="text-white/60">Overview of your agency's metrics and recent activity.</p>
                </div>

                {/* Metrics Row */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Total Earnings */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Card className="bg-black border-white/10 text-white relative overflow-hidden cursor-help hover:border-white/20 transition-colors">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <div className="flex flex-col gap-1">
                                        <div className="p-2 w-fit rounded-lg bg-[#FFBF00]/10 mb-2">
                                            <DollarSign className="h-5 w-5 text-[#FFBF00]" />
                                        </div>
                                        <CardTitle className="text-sm font-medium text-white/70">Total Earnings</CardTitle>
                                    </div>
                                    <div className="flex items-center gap-1 text-green-400 text-xs font-medium bg-green-400/10 px-2 py-1 rounded-full absolute top-4 right-4">
                                        <TrendingUp className="h-3 w-3" />
                                        <span>Revenue</span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {isLoading ? (
                                        <Loader2 className="h-8 w-8 animate-spin text-[#FFBF00] mb-1" />
                                    ) : (
                                        <div className="text-3xl font-bold mb-1">{formatCurrency(metrics.totalEarnings)}</div>
                                    )}
                                    <p className="text-xs text-white/50">From completed bookings</p>
                                </CardContent>
                            </Card>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Total recorded revenue from all completed bookings/tours.</p>
                        </TooltipContent>
                    </Tooltip>

                    {/* New Clients */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Card className="bg-black border-white/10 text-white relative overflow-hidden cursor-help hover:border-white/20 transition-colors">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <div className="flex flex-col gap-1">
                                        <div className="p-2 w-fit rounded-lg bg-[#FFBF00]/10 mb-2">
                                            <Users className="h-5 w-5 text-[#FFBF00]" />
                                        </div>
                                        <CardTitle className="text-sm font-medium text-white/70">New Clients</CardTitle>
                                    </div>
                                    <div className="flex items-center gap-1 text-green-400 text-xs font-medium bg-green-400/10 px-2 py-1 rounded-full absolute top-4 right-4">
                                        <TrendingUp className="h-3 w-3" />
                                        <span>Active</span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {isLoading ? (
                                        <Loader2 className="h-8 w-8 animate-spin text-[#FFBF00] mb-1" />
                                    ) : (
                                        <div className="text-3xl font-bold mb-1">{metrics.totalClients}</div>
                                    )}
                                    <p className="text-xs text-white/50">Total registered clients</p>
                                </CardContent>
                            </Card>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Total number of users registered as "Client" or "Lead" in the system.</p>
                        </TooltipContent>
                    </Tooltip>

                    {/* Active Sessions */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Card className="bg-black border-white/10 text-white relative overflow-hidden cursor-help hover:border-white/20 transition-colors">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <div className="flex flex-col gap-1">
                                        <div className="p-2 w-fit rounded-lg bg-[#FFBF00]/10 mb-2">
                                            <Server className="h-5 w-5 text-[#FFBF00]" />
                                        </div>
                                        <CardTitle className="text-sm font-medium text-white/70">Active Sessions</CardTitle>
                                    </div>
                                    <div className="flex items-center gap-1 text-white/50 text-xs font-medium bg-white/5 px-2 py-1 rounded-full absolute top-4 right-4">
                                        <Server className="h-3 w-3" />
                                        <span>Live</span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {isLoading ? (
                                        <Loader2 className="h-8 w-8 animate-spin text-[#FFBF00] mb-1" />
                                    ) : (
                                        <div className="text-3xl font-bold mb-1">{metrics.activeSessions}</div>
                                    )}
                                    <p className="text-xs text-white/50">Currently active sessions</p>
                                </CardContent>
                            </Card>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Number of active AI system deployments currently live for clients.</p>
                        </TooltipContent>
                    </Tooltip>

                    {/* Pending Requests */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Card className="bg-black border-white/10 text-white relative overflow-hidden cursor-help hover:border-white/20 transition-colors">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <div className="flex flex-col gap-1">
                                        <div className="p-2 w-fit rounded-lg bg-[#FFBF00]/10 mb-2">
                                            <Clock className="h-5 w-5 text-[#FFBF00]" />
                                        </div>
                                        <CardTitle className="text-sm font-medium text-white/70">Pending Requests</CardTitle>
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border-0">New</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold mb-1">0</div>
                                    <p className="text-xs text-white/50">urgent action needed</p>
                                </CardContent>
                            </Card>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Placeholder for future manual crypto payment verification requests or system updates.</p>
                        </TooltipContent>
                    </Tooltip>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    {/* Left Side: Quick Links */}
                    <div className="md:col-span-2 flex flex-col gap-6">
                        <Card className="bg-black border-white/10 text-white flex-1 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Quick Actions</h2>
                            </div>
                            <div className="grid gap-3">
                                <Link to="/admin/clients" className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors group">
                                    <span className="font-medium text-white group-hover:text-[#FFBF00] transition-colors">Register New Client</span>
                                    <ArrowUpRight className="h-5 w-5 text-white/50 group-hover:text-[#FFBF00] transition-colors" />
                                </Link>
                                <Link to="/admin/deployments" className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors group">
                                    <span className="font-medium text-white group-hover:text-[#FFBF00] transition-colors">Create Session Category</span>
                                    <ArrowUpRight className="h-5 w-5 text-white/50 group-hover:text-[#FFBF00] transition-colors" />
                                </Link>
                                <Link to="/admin/bookings" className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors group">
                                    <span className="font-medium text-white group-hover:text-[#FFBF00] transition-colors">Review Latest Bookings</span>
                                    <ArrowUpRight className="h-5 w-5 text-white/50 group-hover:text-[#FFBF00] transition-colors" />
                                </Link>
                            </div>
                        </Card>
                    </div>

                    {/* Right Side: Recent Activity Timeline */}
                    <Card className="bg-black border-white/10 text-white p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <div className="w-1 h-5 bg-[#FFBF00] rounded-full"></div>
                                Recent Activity
                            </h2>
                        </div>

                        <div className="flex items-center rounded-lg bg-black border border-white/10 overflow-hidden mb-6 p-1 relative z-10">
                            <button
                                onClick={() => setActivityFilter('all')}
                                className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-colors ${activityFilter === 'all' ? 'bg-[#FFBF00] text-black shadow-sm' : 'text-white hover:bg-white/5'}`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setActivityFilter('user')}
                                className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-colors ${activityFilter === 'user' ? 'bg-[#FFBF00] text-black shadow-sm' : 'text-white hover:bg-white/5'}`}
                            >
                                User
                            </button>
                            <button
                                onClick={() => setActivityFilter('admin')}
                                className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-colors ${activityFilter === 'admin' ? 'bg-[#FFBF00] text-black shadow-sm' : 'text-white hover:bg-white/5'}`}
                            >
                                Admin
                            </button>
                        </div>

                        {/* Timeline items */}
                        <div className="flex flex-col gap-0 relative">
                            {isLoading ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin text-[#FFBF00]" />
                                </div>
                            ) : filteredActivities.length > 0 ? (
                                <>
                                    <div className="absolute left-[15px] top-6 bottom-6 w-[2px] bg-white/10"></div>
                                    {filteredActivities.map((activity, idx) => (
                                        <div key={activity.id + idx} className="relative pl-12 py-4 group">
                                            <div className="absolute left-[6px] top-4 w-[20px] h-[20px] rounded-full bg-black border-2 border-white/10 flex items-center justify-center z-10 group-hover:border-[#FFBF00]/50 transition-colors">
                                                <activity.icon className="w-2.5 h-2.5 text-white/50 group-hover:text-[#FFBF00] transition-colors" />
                                            </div>
                                            <div className="flex flex-col gap-1 -mt-0.5">
                                                <div className="flex items-start justify-between">
                                                    <span className="font-medium text-white/90 text-sm flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                                        {activity.title}
                                                        {activity.type === 'admin' && (
                                                            <Badge className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-blue-500/20 uppercase text-[9px] px-1.5 py-0 h-4">Admin Action</Badge>
                                                        )}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-white/40 mb-1">
                                                    {activity.timestamp.toLocaleDateString()} at {activity.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                <p className="text-sm text-white/60 leading-snug">{activity.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <div className="text-sm text-white/50 text-center py-8">
                                    No recent activity found.
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </TooltipProvider>
    );
}
