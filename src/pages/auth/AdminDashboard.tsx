import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Server, Clock, ArrowUpRight, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export function AdminDashboard() {
    const [metrics, setMetrics] = useState({
        totalClients: 0,
        activeSessions: 0,
        pendingRequests: 0 // Placeholder for future feature
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            setIsLoading(true);
            try {
                const [clientsRes, sessionsRes] = await Promise.all([
                    supabase.from('profiles').select('*', { count: 'exact', head: true }).neq('role', 'Admin'),
                    supabase.from('system_deployments').select('*', { count: 'exact', head: true }).eq('status', 'Active')
                ]);

                setMetrics({
                    totalClients: clientsRes.count || 0,
                    activeSessions: sessionsRes.count || 0,
                    pendingRequests: 0
                });
            } catch (error) {
                console.error("Error fetching overview metrics:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Overview</h1>
                <p className="text-white/60">Overview of your agency's metrics and recent activity.</p>
            </div>

            {/* Metrics Row */}
            <div className="grid gap-4 md:grid-cols-3">
                {/* New Clients */}
                <Card className="bg-black border-white/10 text-white relative overflow-hidden">
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

                {/* Active Sessions */}
                <Card className="bg-black border-white/10 text-white relative overflow-hidden">
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

                {/* Pending Requests */}
                <Card className="bg-black border-white/10 text-white relative overflow-hidden">
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
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {/* Left Side: Quick Links */}
                <div className="md:col-span-2 flex flex-col gap-6">
                    <Card className="bg-black border-white/10 text-white flex-1 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">Quick Actions</h2>
                            <span className="text-sm text-[#FFBF00] cursor-pointer hover:underline">View All</span>
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
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <div className="w-1 h-5 bg-[#FFBF00] rounded-full"></div>
                        Recent Activity
                    </h2>

                    {/* Timeline items - empty state for now */}
                    <div className="flex flex-col gap-0 relative">
                        <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-white/10"></div>

                        <div className="text-sm text-white/50 text-center py-8 pl-6">
                            No recent activity yet.
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

