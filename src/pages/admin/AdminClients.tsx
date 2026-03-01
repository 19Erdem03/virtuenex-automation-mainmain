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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MoreHorizontal, ShieldAlert, UserCog, Loader2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function AdminClients() {
    const [clients, setClients] = useState<any[]>([]);
    const [isLoadingClients, setIsLoadingClients] = useState(true);
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userToDelete, setUserToDelete] = useState<any | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [newUserForm, setNewUserForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Lead' as 'Lead' | 'Client' | 'Admin'
    });

    const fetchClients = async () => {
        setIsLoadingClients(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setClients(data || []);
        } catch (error: any) {
            console.error("Error fetching clients:", error);
            toast.error("Failed to load clients");
        } finally {
            setIsLoadingClients(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUserForm.name || !newUserForm.email || !newUserForm.password) {
            toast.error("Please fill in all fields.");
            return;
        }

        setIsLoading(true);

        try {
            // 1. Create the user in Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: newUserForm.email,
                password: newUserForm.password,
                options: {
                    data: {
                        name: newUserForm.name,
                    }
                }
            });

            if (authError) throw authError;

            // 2. The trigger should ideally create the profile, but we need to update the role specifically.
            // Wait a brief moment for the auth trigger to create the initial profile row
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (authData.user) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .update({
                        role: newUserForm.role,
                        name: newUserForm.name, // Ensure name is set if trigger missed it
                    })
                    .eq('id', authData.user.id);

                if (profileError) {
                    console.error("Profile update error:", profileError);
                    toast.error("User created, but failed to set role.");
                } else {
                    toast.success("User added successfully!");
                    setIsAddUserOpen(false);
                    setNewUserForm({ name: '', email: '', password: '', role: 'Lead' });
                    fetchClients();
                }
            }
        } catch (error: any) {
            console.error("Error adding user:", error);
            toast.error(error.message || "Failed to add user.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;

        setIsDeleting(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .delete()
                .eq('id', userToDelete.id);

            if (error) {
                console.error("Error deleting user:", error);
                toast.error("Failed to delete user: " + error.message);
            } else {
                toast.success("User deleted successfully");
                setClients(prevClients => prevClients.filter(c => c.id !== userToDelete.id));
            }
        } catch (error: any) {
            console.error("Exception deleting user:", error);
            toast.error("An error occurred while deleting the user.");
        } finally {
            setIsDeleting(false);
            setUserToDelete(null);
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Clients & CRM</h1>
                    <p className="text-white/60">Manage users, update roles, and handle account access.</p>
                </div>
                <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#FFBF00] text-black hover:bg-[#FFBF00]/90">
                            Add User
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-black border border-white/10 text-white sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add New User</DialogTitle>
                            <DialogDescription className="text-white/60">
                                Register a new user and assign their role immediately.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddUser}>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="user-name">Full Name</Label>
                                    <Input
                                        id="user-name"
                                        placeholder="John Doe"
                                        className="bg-white/5 border-white/10 text-white"
                                        value={newUserForm.name}
                                        onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="user-email">Email Address</Label>
                                    <Input
                                        id="user-email"
                                        type="email"
                                        placeholder="john@example.com"
                                        className="bg-white/5 border-white/10 text-white"
                                        value={newUserForm.email}
                                        onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="user-password">Temporary Password</Label>
                                    <Input
                                        id="user-password"
                                        type="password"
                                        placeholder="min 6 characters"
                                        className="bg-white/5 border-white/10 text-white"
                                        value={newUserForm.password}
                                        onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="user-role">Role</Label>
                                    <Select
                                        value={newUserForm.role}
                                        onValueChange={(value: any) => setNewUserForm({ ...newUserForm, role: value })}
                                    >
                                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-black border-white/10 text-white">
                                            <SelectItem value="Lead">Lead</SelectItem>
                                            <SelectItem value="Client">Client</SelectItem>
                                            <SelectItem value="Admin">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex justify-end pt-4 border-t border-white/10 mt-2">
                                <Button
                                    type="submit"
                                    className="bg-[#FFBF00] text-black hover:bg-[#FFBF00]/90"
                                    disabled={isLoading}
                                >
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    {isLoading ? 'Adding...' : 'Add User'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
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
                        {isLoadingClients ? (
                            <TableRow className="border-white/10 hover:bg-transparent">
                                <TableCell colSpan={6} className="text-center text-white/50 py-8">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-[#FFBF00]" />
                                    Loading clients...
                                </TableCell>
                            </TableRow>
                        ) : clients.length === 0 ? (
                            <TableRow className="border-white/10 hover:bg-transparent">
                                <TableCell colSpan={6} className="text-center text-white/50 py-8">
                                    No clients currently registered.
                                </TableCell>
                            </TableRow>
                        ) : (
                            clients.map((client) => (
                                <TableRow key={client.id} className="border-white/10 hover:bg-white/5">
                                    <TableCell className="font-medium text-white">{client.full_name || 'Unknown'}</TableCell>
                                    <TableCell className="text-white/70">{client.email}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`
                    ${client.role === 'Client' ? 'border-[#FFBF00] text-[#FFBF00]' :
                                                client.role === 'Admin' ? 'border-blue-500/50 text-blue-400' :
                                                    'border-white/20 text-white/70'}
                  `}>
                                            {client.role || 'User'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`
                    ${client.status === 'Active' ? 'border-green-500/50 text-green-400' : 'border-red-500/50 text-red-400'}
                  `}>
                                            {client.status || 'Active'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-white/70">
                                        {client.created_at ? new Date(client.created_at).toLocaleDateString() : 'N/A'}
                                    </TableCell>
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
                                                <DropdownMenuSeparator className="bg-white/10" />
                                                <DropdownMenuItem
                                                    onClick={() => setUserToDelete(client)}
                                                    className="text-red-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer focus:bg-red-500/10 focus:text-red-400"
                                                >
                                                    Delete User
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <AlertDialog open={!!userToDelete} onOpenChange={(open: boolean) => !open && setUserToDelete(null)}>
                <AlertDialogContent className="bg-black border border-white/10 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-white/60">
                            This action cannot be undone. This will permanently delete the user
                            account for <span className="font-semibold text-white">{userToDelete?.full_name || userToDelete?.email}</span> and remove their data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent border-white/10 text-white hover:bg-white/5 hover:text-white">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteUser}
                            className="bg-red-500 text-white hover:bg-red-600 focus:ring-red-500"
                            disabled={isDeleting}
                        >
                            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {isDeleting ? 'Deleting...' : 'Delete User'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
