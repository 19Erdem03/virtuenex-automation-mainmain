import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Server, CalendarDays, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export function AdminDashboard() {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Admin Dashboard</h1>
                <p className="text-white/60">Overview of your agency's metrics and quick actions.</p>
            </div>

            {/* Metrics Row */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-black border-white/10 text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-white/70">Total Clients</CardTitle>
                        <Users className="h-4 w-4 text-[#FFBF00]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                    </CardContent>
                </Card>
                <Card className="bg-black border-white/10 text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-white/70">Active Sessions</CardTitle>
                        <Server className="h-4 w-4 text-[#FFBF00]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                    </CardContent>
                </Card>
                <Card className="bg-black border-white/10 text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-white/70">Upcoming Bookings</CardTitle>
                        <CalendarDays className="h-4 w-4 text-[#FFBF00]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                    </CardContent>
                </Card>
            </div>

            {/* Quicklinks */}
            <div>
                <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
                <div className="grid gap-4 md:grid-cols-3">
                    <Link
                        to="/admin/clients"
                        className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors group"
                    >
                        <span className="font-medium text-white group-hover:text-[#FFBF00] transition-colors">Register New Client</span>
                        <ArrowUpRight className="h-5 w-5 text-white/50 group-hover:text-[#FFBF00] transition-colors" />
                    </Link>
                    <Link
                        to="/admin/deployments"
                        className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors group"
                    >
                        <span className="font-medium text-white group-hover:text-[#FFBF00] transition-colors">Create Session Category</span>
                        <ArrowUpRight className="h-5 w-5 text-white/50 group-hover:text-[#FFBF00] transition-colors" />
                    </Link>
                    <Link
                        to="/admin/bookings"
                        className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors group"
                    >
                        <span className="font-medium text-white group-hover:text-[#FFBF00] transition-colors">Review Latest Bookings</span>
                        <ArrowUpRight className="h-5 w-5 text-white/50 group-hover:text-[#FFBF00] transition-colors" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
