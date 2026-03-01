import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const mockDeployments: any[] = [];

const mockCategories: any[] = [];

export function AdminSessions() {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Sessions & Deployments</h1>
                <p className="text-white/60">Manage active client systems and define system categories.</p>
            </div>

            <Tabs defaultValue="deployments" className="w-full">
                <TabsList className="bg-white/5 border border-white/10">
                    <TabsTrigger
                        value="deployments"
                        className="data-[state=active]:bg-[#FFBF00] data-[state=active]:text-black text-white/70"
                    >
                        Active Deployments
                    </TabsTrigger>
                    <TabsTrigger
                        value="categories"
                        className="data-[state=active]:bg-[#FFBF00] data-[state=active]:text-black text-white/70"
                    >
                        Session Categories
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="deployments" className="mt-6 border border-white/10 rounded-md">
                    <div className="p-4 flex justify-end border-b border-white/10">
                        <Button className="bg-[#FFBF00] text-black hover:bg-[#FFBF00]/90">
                            New Deployment
                        </Button>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-white/10 hover:bg-transparent">
                                <TableHead className="text-white/70">Client</TableHead>
                                <TableHead className="text-white/70">System Type</TableHead>
                                <TableHead className="text-white/70">Status</TableHead>
                                <TableHead className="text-white/70">Start Date</TableHead>
                                <TableHead className="text-right text-white/70">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockDeployments.length === 0 && (
                                <TableRow className="border-white/10 hover:bg-transparent">
                                    <TableCell colSpan={5} className="text-center text-white/50 py-8">
                                        No active sessions found.
                                    </TableCell>
                                </TableRow>
                            )}
                            {mockDeployments.map((deployment) => (
                                <TableRow key={deployment.id} className="border-white/10 hover:bg-white/5">
                                    <TableCell className="font-medium text-white">{deployment.clientName}</TableCell>
                                    <TableCell className="text-white/70">{deployment.systemType}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`
                      ${deployment.status === 'Active' ? 'border-green-500/50 text-green-400' : 'border-[#FFBF00]/50 text-[#FFBF00]'}
                    `}>
                                            {deployment.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-white/70">{deployment.startDate}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" className="text-[#FFBF00] hover:text-[#FFBF00]/80 hover:bg-[#FFBF00]/10">
                                            Manage
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TabsContent>

                <TabsContent value="categories" className="mt-6 border border-white/10 rounded-md">
                    <div className="p-4 flex justify-end border-b border-white/10">
                        <Button className="bg-[#FFBF00] text-black hover:bg-[#FFBF00]/90">
                            Create Category
                        </Button>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-white/10 hover:bg-transparent">
                                <TableHead className="text-white/70">Category Name</TableHead>
                                <TableHead className="text-white/70">Description</TableHead>
                                <TableHead className="text-white/70">Active Deployments</TableHead>
                                <TableHead className="text-right text-white/70">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockCategories.length === 0 && (
                                <TableRow className="border-white/10 hover:bg-transparent">
                                    <TableCell colSpan={4} className="text-center text-white/50 py-8">
                                        No session categories defined.
                                    </TableCell>
                                </TableRow>
                            )}
                            {mockCategories.map((category) => (
                                <TableRow key={category.id} className="border-white/10 hover:bg-white/5">
                                    <TableCell className="font-medium text-white">{category.name}</TableCell>
                                    <TableCell className="text-white/70">{category.description}</TableCell>
                                    <TableCell className="text-white/70">{category.activeDeployments}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
                                            Edit
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TabsContent>
            </Tabs>
        </div>
    );
}
