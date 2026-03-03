import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const SYSTEM_PROPERTY_TITLE = "VirtueNex Sessions";

const DAY_OPTIONS = [
    { label: "Sun", value: 0 },
    { label: "Mon", value: 1 },
    { label: "Tue", value: 2 },
    { label: "Wed", value: 3 },
    { label: "Thu", value: 4 },
    { label: "Fri", value: 5 },
    { label: "Sat", value: 6 },
];

export function AdminSettings() {
    const [availDays, setAvailDays] = useState<number[]>([1, 2, 3, 4, 5]);
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("17:00");
    const [duration, setDuration] = useState(30);
    const [maxSlots, setMaxSlots] = useState(1);
    const [isSavingAvail, setIsSavingAvail] = useState(false);
    const [isLoadingAvail, setIsLoadingAvail] = useState(true);
    const [propertyId, setPropertyId] = useState<string | null>(null);
    const [tourId, setTourId] = useState<string | null>(null);

    useEffect(() => {
        loadAvailability();
    }, []);

    const loadAvailability = async () => {
        setIsLoadingAvail(true);
        try {
            const { data: props } = await supabase
                .from("properties")
                .select("id")
                .eq("title", SYSTEM_PROPERTY_TITLE)
                .limit(1);

            if (!props || props.length === 0) return;

            const propId = props[0].id;
            setPropertyId(propId);

            const { data: tours } = await supabase
                .from("tours")
                .select("id, duration_minutes, max_slots, tour_availability(*)")
                .eq("property_id", propId)
                .limit(1);

            if (!tours || tours.length === 0) return;

            const tour = tours[0];
            setTourId(tour.id);
            setDuration(tour.duration_minutes);
            setMaxSlots(tour.max_slots);

            const avails = Array.isArray(tour.tour_availability) ? tour.tour_availability : [];
            if (avails.length > 0) {
                const avail = avails[0] as any;
                setStartTime((avail.start_time as string).substring(0, 5));
                setEndTime((avail.end_time as string).substring(0, 5));
                const rules = avail.rules as any;
                if (rules && Array.isArray(rules.days)) {
                    setAvailDays(rules.days);
                } else if (rules && Array.isArray(rules.weekdays)) {
                    setAvailDays(rules.weekdays);
                }
            }
        } catch (e) {
            console.error("Error loading availability:", e);
        } finally {
            setIsLoadingAvail(false);
        }
    };

    const saveAvailability = async () => {
        if (availDays.length === 0) {
            toast.error("Select at least one available day.");
            return;
        }
        setIsSavingAvail(true);
        try {
            let propId = propertyId;

            if (!propId) {
                const { data, error } = await supabase
                    .from("properties")
                    .insert({ title: SYSTEM_PROPERTY_TITLE, location: "Online", price: 0, status: "Active" })
                    .select("id")
                    .single();
                if (error) throw error;
                propId = data.id;
                setPropertyId(propId);
            }

            let tid = tourId;

            if (!tid) {
                const { data, error } = await supabase
                    .from("tours")
                    .insert({ property_id: propId, duration_minutes: duration, max_slots: maxSlots })
                    .select("id")
                    .single();
                if (error) throw error;
                tid = data.id;
                setTourId(tid);
            } else {
                const { error } = await supabase
                    .from("tours")
                    .update({ duration_minutes: duration, max_slots: maxSlots })
                    .eq("id", tid);
                if (error) throw error;
            }

            await supabase.from("tour_availability").delete().eq("tour_id", tid);
            const { error: availError } = await supabase.from("tour_availability").insert({
                tour_id: tid,
                start_time: `${startTime}:00`,
                end_time: `${endTime}:00`,
                is_ongoing: true,
                rules: { days: availDays },
            });
            if (availError) throw availError;

            toast.success("Availability saved! Clients can now book sessions.");
        } catch (e: any) {
            toast.error(e.message || "Failed to save availability.");
        } finally {
            setIsSavingAvail(false);
        }
    };

    const toggleDay = (day: number) => {
        setAvailDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
        );
    };

    return (
        <div className="flex flex-col gap-8 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Agency Settings</h1>
                <p className="text-white/60">Manage your agency preferences, notifications, and API settings.</p>
            </div>

            <div className="grid gap-6">
                {/* ── Session Availability ── */}
                <Card className="bg-black border-white/10 text-white">
                    <CardHeader>
                        <CardTitle>Session Availability</CardTitle>
                        <CardDescription className="text-white/60">
                            Configure when clients can book strategy sessions. Changes take effect immediately.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        {isLoadingAvail ? (
                            <div className="flex items-center gap-2 text-white/40 text-sm">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Loading current availability…
                            </div>
                        ) : (
                            <>
                                {/* Available days */}
                                <div className="space-y-2">
                                    <Label>Available Days</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {DAY_OPTIONS.map((d) => (
                                            <button
                                                key={d.value}
                                                type="button"
                                                onClick={() => toggleDay(d.value)}
                                                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors border ${availDays.includes(d.value)
                                                        ? "bg-[#FFBF00] text-black border-[#FFBF00]"
                                                        : "bg-white/5 text-white/50 border-white/10 hover:border-white/25"
                                                    }`}
                                            >
                                                {d.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Time range */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="start-time">Start Time</Label>
                                        <Input
                                            id="start-time"
                                            type="time"
                                            value={startTime}
                                            onChange={(e) => setStartTime(e.target.value)}
                                            className="bg-white/5 border-white/10 text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="end-time">End Time</Label>
                                        <Input
                                            id="end-time"
                                            type="time"
                                            value={endTime}
                                            onChange={(e) => setEndTime(e.target.value)}
                                            className="bg-white/5 border-white/10 text-white"
                                        />
                                    </div>
                                </div>

                                {/* Duration + max slots */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Session Duration</Label>
                                        <Select value={String(duration)} onValueChange={(v) => setDuration(Number(v))}>
                                            <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-black border-white/10 text-white">
                                                <SelectItem value="30">30 minutes</SelectItem>
                                                <SelectItem value="45">45 minutes</SelectItem>
                                                <SelectItem value="60">60 minutes</SelectItem>
                                                <SelectItem value="90">90 minutes</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Max Concurrent Bookings</Label>
                                        <Select value={String(maxSlots)} onValueChange={(v) => setMaxSlots(Number(v))}>
                                            <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-black border-white/10 text-white">
                                                <SelectItem value="1">1 client at a time</SelectItem>
                                                <SelectItem value="2">2 clients at a time</SelectItem>
                                                <SelectItem value="3">3 clients at a time</SelectItem>
                                                <SelectItem value="5">5 clients at a time</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {availDays.length === 0 && (
                                    <p className="text-xs text-red-400">Select at least one day.</p>
                                )}

                                <Button
                                    onClick={saveAvailability}
                                    disabled={isSavingAvail || availDays.length === 0}
                                    className="bg-[#FFBF00] text-black hover:bg-[#FFBF00]/90 font-semibold"
                                >
                                    {isSavingAvail ? (
                                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving…</>
                                    ) : (
                                        "Save Availability"
                                    )}
                                </Button>
                            </>
                        )}
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
