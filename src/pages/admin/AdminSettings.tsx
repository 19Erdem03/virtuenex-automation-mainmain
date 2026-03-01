import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminSettings() {
    return (
        <div className="flex flex-col gap-8 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Agency Settings</h1>
                <p className="text-white/60">Manage your agency preferences, notifications, and API settings.</p>
            </div>

            <div className="grid gap-6">
                <Card className="bg-black border-white/10 text-white">
                    <CardHeader>
                        <CardTitle>Branding & Theme</CardTitle>
                        <CardDescription className="text-white/60">Customize the look and feel of the user dashboards.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="agency-name">Agency Name</Label>
                            <Input id="agency-name" defaultValue="VirtueNex" className="bg-white/5 border-white/10 text-white" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="accent-color">Accent Color (Hex)</Label>
                            <Input id="accent-color" defaultValue="#FFBF00" className="bg-white/5 border-white/10 text-white" />
                        </div>
                        <Button className="bg-[#FFBF00] text-black hover:bg-[#FFBF00]/90">Save Branding</Button>
                    </CardContent>
                </Card>

                <Card className="bg-black border-white/10 text-white">
                    <CardHeader>
                        <CardTitle>Notification Preferences</CardTitle>
                        <CardDescription className="text-white/60">Control how you receive alerts for new leads and bookings.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5">
                            <div className="space-y-0.5">
                                <Label className="text-base">Email Notifications</Label>
                                <p className="text-sm text-white/50">Receive an email when a new client registers.</p>
                            </div>
                            <div className="w-10 h-6 bg-[#FFBF00] rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 bottom-1 w-4 bg-black rounded-full shadow" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5">
                            <div className="space-y-0.5">
                                <Label className="text-base">SMS Alerts</Label>
                                <p className="text-sm text-white/50">Get instant SMS texts for new high-value leads.</p>
                            </div>
                            <div className="w-10 h-6 bg-white/20 rounded-full relative cursor-pointer">
                                <div className="absolute left-1 top-1 bottom-1 w-4 bg-black rounded-full shadow" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
