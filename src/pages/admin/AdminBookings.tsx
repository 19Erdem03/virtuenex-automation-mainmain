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
import { Calendar as CalendarIcon, Clock } from "lucide-react";

const mockBookings: any[] = [];

export function AdminBookings() {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Tour Bookings</h1>
                    <p className="text-white/60">Review and manage upcoming property tours.</p>
                </div>
            </div>

            <div className="rounded-md border border-white/10">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/10 hover:bg-transparent">
                            <TableHead className="text-white/70">Lead/Client</TableHead>
                            <TableHead className="text-white/70">Property</TableHead>
                            <TableHead className="text-white/70">Date & Time</TableHead>
                            <TableHead className="text-white/70">Status</TableHead>
                            <TableHead className="text-right text-white/70">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockBookings.length === 0 && (
                            <TableRow className="border-white/10 hover:bg-transparent">
                                <TableCell colSpan={5} className="text-center text-white/50 py-8">
                                    No bookings found.
                                </TableCell>
                            </TableRow>
                        )}
                        {mockBookings.map((booking) => (
                            <TableRow key={booking.id} className="border-white/10 hover:bg-white/5">
                                <TableCell className="font-medium text-white">{booking.leadName}</TableCell>
                                <TableCell className="text-white/70">{booking.property}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 text-white/70">
                                        <CalendarIcon className="h-4 w-4 text-[#FFBF00]" />
                                        <span>{booking.date}</span>
                                        <Clock className="h-4 w-4 ml-2 text-[#FFBF00]" />
                                        <span>{booking.time}</span>
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
                                <TableCell className="text-right">
                                    <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
                                        Reschedule
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
