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
import { MoreHorizontal, ShieldAlert, UserCog } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockClients: any[] = [];

export function AdminClients() {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Clients & CRM</h1>
                    <p className="text-white/60">Manage users, update roles, and handle account access.</p>
                </div>
                <Button className="bg-[#FFBF00] text-black hover:bg-[#FFBF00]/90">
                    Add User
                </Button>
            </div>

            <div className="rounded-md border border-white/10">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/10 hover:bg-transparent">
                            <TableHead className="text-white/70">Name</TableHead>
                            <TableHead className="text-white/70">Email</TableHead>
                            <TableHead className="text-white/70">Role</TableHead>
                            <TableHead className="text-white/70">Status</TableHead>
                            <TableHead className="text-white/70">Joined</TableHead>
                            <TableHead className="text-right text-white/70">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockClients.length === 0 && (
                            <TableRow className="border-white/10 hover:bg-transparent">
                                <TableCell colSpan={6} className="text-center text-white/50 py-8">
                                    No clients currently registered.
                                </TableCell>
                            </TableRow>
                        )}
                        {mockClients.map((client) => (
                            <TableRow key={client.id} className="border-white/10 hover:bg-white/5">
                                <TableCell className="font-medium text-white">{client.name}</TableCell>
                                <TableCell className="text-white/70">{client.email}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={`
                    ${client.role === 'Client' ? 'border-[#FFBF00] text-[#FFBF00]' : 'border-white/20 text-white/70'}
                  `}>
                                        {client.role}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={`
                    ${client.status === 'Active' ? 'border-green-500/50 text-green-400' : 'border-red-500/50 text-red-400'}
                  `}>
                                        {client.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-white/70">{client.joined}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-black border-white/10 text-white">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem className="hover:bg-white/10 cursor-pointer text-white/70 hover:text-white focus:bg-white/10 focus:text-white">
                                                <UserCog className="mr-2 h-4 w-4" />
                                                Edit Role
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-white/10" />
                                            <DropdownMenuItem className="text-red-400 hover:text-red-300 hover:bg-red-400/10 cursor-pointer focus:bg-red-400/10 focus:text-red-300">
                                                <ShieldAlert className="mr-2 h-4 w-4" />
                                                {client.status === 'Banned' ? 'Unban User' : 'Ban User'}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
