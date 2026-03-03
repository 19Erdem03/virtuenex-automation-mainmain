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
import { MoreHorizontal, ShieldAlert, UserCog, Loader2, ChevronLeft, ChevronRight, Upload, SlidersHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect, useRef } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
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
    const { user } = useAuth();
    const [clients, setClients] = useState<any[]>([]);
    const [roleFilter, setRoleFilter] = useState<string>("All Roles");
    const [isLoadingClients, setIsLoadingClients] = useState(true);
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userToDelete, setUserToDelete] = useState<any | null>(null);
    const [selectedClient, setSelectedClient] = useState<any | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [newUserForm, setNewUserForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Client' as 'Client' | 'Admin'
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [visibleColumns, setVisibleColumns] = useState({
        name: true,
        email: true,
        role: true,
        status: true,
        joined: true,
        actions: true,
    });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

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
                    setNewUserForm({ name: '', email: '', password: '', role: 'Client' });
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

    const [isUpdatingRole, setIsUpdatingRole] = useState(false);

    const handleUpdateRole = async (userId: string, newRole: 'Client' | 'Admin') => {
        if (!userId) return;

        // Prevent self-demotion from Admin
        if (user?.id === userId && newRole !== 'Admin') {
            toast.error("You cannot change your own Admin role.");
            return;
        }

        setIsUpdatingRole(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .update({ role: newRole })
                .eq('id', userId)
                .select();

            if (error) {
                console.error("Error updating role:", error);
                toast.error("Failed to update user role: " + error.message);
            } else if (!data || data.length === 0) {
                toast.error("Failed to update role. You may not have permission.");
            } else {
                toast.success("User role updated successfully!");
                // Update local state
                setClients(prevClients =>
                    prevClients.map(c => c.id === userId ? { ...c, role: newRole } : c)
                );
                // If the user being viewed is the one updated, update the selectedClient state too
                if (selectedClient?.id === userId) {
                    setSelectedClient({ ...selectedClient, role: newRole });
                }
            }
        } catch (error: any) {
            console.error("Exception updating role:", error);
            toast.error("An error occurred while updating the role.");
        } finally {
            setIsUpdatingRole(false);
        }
    };

    const filteredClients = clients.filter(client => {
        if (roleFilter === "All Roles") return true;
        return client.role === roleFilter;
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [roleFilter, itemsPerPage]);

    const totalPages = Math.ceil(filteredClients.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedClients = filteredClients.slice(startIndex, startIndex + itemsPerPage);

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !selectedClient) return;

        setIsUploadingAvatar(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${selectedClient.id}-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', selectedClient.id);

            if (updateError) throw updateError;

            toast.success("Profile picture updated successfully!");
            setClients(prev => prev.map(c => c.id === selectedClient.id ? { ...c, avatar_url: publicUrl } : c));
            setSelectedClient({ ...selectedClient, avatar_url: publicUrl });

        } catch (error: any) {
            console.error("Error uploading avatar:", error);
            toast.error(error.message || "Failed to upload profile picture.");
        } finally {
            setIsUploadingAvatar(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Clients & CRM</h1>
                    <p className="text-white/60">Manage users, update roles, and handle account access.</p>
                </div>
                <div className="flex items-center gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="bg-white/5 border-white/10 text-white flex items-center gap-2 h-10">
                                <SlidersHorizontal className="h-4 w-4" />
                                Columns
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-black border-white/10 text-white w-48">
                            <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-white/10" />
                            {Object.entries(visibleColumns).map(([key, isVisible]) => (
                                <div key={key} className="flex items-center space-x-2 px-2 py-1.5 hover:bg-white/10 cursor-pointer rounded-sm" onClick={(e) => {
                                    e.preventDefault();
                                    setVisibleColumns(prev => ({ ...prev, [key]: !prev[key as keyof typeof visibleColumns] }));
                                }}>
                                    <Checkbox id={`col-${key}`} checked={isVisible} className="border-white/20 data-[state=checked]:bg-[#FFBF00] data-[state=checked]:text-black" />
                                    <label htmlFor={`col-${key}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize cursor-pointer flex-1">
                                        {key}
                                    </label>
                                </div>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-[150px] bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="All Roles" />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-white/10 text-white">
                            <SelectItem value="All Roles">All Roles</SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Client">Client</SelectItem>
                        </SelectContent>
                    </Select>
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
            </div>

            <div className="rounded-md border border-white/10">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/10 hover:bg-transparent">
                            {visibleColumns.name && <TableHead className="text-white/70">Name</TableHead>}
                            {visibleColumns.email && <TableHead className="text-white/70">Email</TableHead>}
                            {visibleColumns.role && <TableHead className="text-white/70">Role</TableHead>}
                            {visibleColumns.status && <TableHead className="text-white/70">Status</TableHead>}
                            {visibleColumns.joined && <TableHead className="text-white/70">Joined</TableHead>}
                            {visibleColumns.actions && <TableHead className="text-right text-white/70">Actions</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoadingClients ? (
                            <TableRow className="border-white/10 hover:bg-transparent">
                                <TableCell colSpan={Object.values(visibleColumns).filter(Boolean).length || 1} className="text-center text-white/50 py-8">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-[#FFBF00]" />
                                    Loading clients...
                                </TableCell>
                            </TableRow>
                        ) : filteredClients.length === 0 ? (
                            <TableRow className="border-white/10 hover:bg-transparent">
                                <TableCell colSpan={Object.values(visibleColumns).filter(Boolean).length || 1} className="text-center text-white/50 py-8">
                                    No clients currently registered or matching this role.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedClients.map((client) => (
                                <TableRow
                                    key={client.id}
                                    className="border-white/10 hover:bg-white/5 cursor-pointer"
                                    onClick={() => setSelectedClient(client)}
                                >
                                    {visibleColumns.name && (
                                        <TableCell className="font-medium text-white">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                    {client.avatar_url ? (
                                                        <img src={client.avatar_url} alt={client.full_name || 'User'} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-xs font-semibold text-[#FFBF00]">
                                                            {client.full_name ? client.full_name.charAt(0).toUpperCase() : 'U'}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span>{client.full_name || 'Unknown'}</span>
                                                    {user && user.id === client.id && (
                                                        <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20 text-[10px] px-1.5 py-0 h-4 border border-white/20">You</Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                    )}
                                    {visibleColumns.email && <TableCell className="text-white/70">{client.email}</TableCell>}
                                    {visibleColumns.role && (
                                        <TableCell>
                                            <Badge variant="outline" className={`
                        ${client.role === 'Client' ? 'border-[#FFBF00] text-[#FFBF00]' :
                                                    client.role === 'Admin' ? 'border-blue-500/50 text-blue-400' :
                                                        'border-white/20 text-white/70'}
                    `}>
                                                {client.role || 'User'}
                                            </Badge>
                                        </TableCell>
                                    )}
                                    {visibleColumns.status && (
                                        <TableCell>
                                            <Badge variant="outline" className={`
                        ${client.status === 'Active' ? 'border-green-500/50 text-green-400' : 'border-red-500/50 text-red-400'}
                    `}>
                                                {client.status || 'Active'}
                                            </Badge>
                                        </TableCell>
                                    )}
                                    {visibleColumns.joined && (
                                        <TableCell className="text-white/70">
                                            {client.created_at ? new Date(client.created_at).toLocaleDateString() : 'N/A'}
                                        </TableCell>
                                    )}
                                    {visibleColumns.actions && (
                                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-black border-white/10 text-white">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem
                                                        onClick={() => setSelectedClient(client)}
                                                        className="hover:bg-white/10 cursor-pointer text-white/70 hover:text-white focus:bg-white/10 focus:text-white"
                                                    >
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
                                                        onClick={(e) => {
                                                            if (user?.id === client.id) {
                                                                e.preventDefault();
                                                                toast.error("You cannot delete your own account.");
                                                                return;
                                                            }
                                                            setUserToDelete(client);
                                                        }}
                                                        disabled={user?.id === client.id}
                                                        className="text-red-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer focus:bg-red-500/10 focus:text-red-400 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
                                                    >
                                                        Delete User
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {filteredClients.length > 0 && (
                <div className="flex items-center justify-between mt-4 text-white/70">
                    <div className="flex items-center gap-4 text-sm">
                        <span>
                            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredClients.length)} of {filteredClients.length} entries
                        </span>
                        <div className="flex items-center gap-2 border-l border-white/10 pl-4 hidden sm:flex">
                            <span>Rows per page:</span>
                            <Select value={itemsPerPage.toString()} onValueChange={(v) => setItemsPerPage(Number(v))}>
                                <SelectTrigger className="w-[70px] h-8 bg-white/5 border-white/10 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-black border-white/10 text-white min-w-[70px]">
                                    <SelectItem value="5">5</SelectItem>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="20">20</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-8 w-8"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="flex items-center px-2 text-sm">
                            Page {currentPage} of {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="icon"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-8 w-8"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}

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

            <Dialog open={!!selectedClient} onOpenChange={(open: boolean) => !open && setSelectedClient(null)}>
                <DialogContent className="bg-black border border-white/10 text-white sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Client Profile</DialogTitle>
                        <DialogDescription className="text-white/60">
                            Detailed profile information added by the client.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedClient && (
                        <div className="grid gap-4 py-4">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden relative group">
                                    {selectedClient.avatar_url ? (
                                        <img src={selectedClient.avatar_url} alt={selectedClient.full_name} className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                                    ) : (
                                        <span className="text-xl font-semibold text-[#FFBF00] group-hover:opacity-50 transition-opacity">
                                            {selectedClient.full_name ? selectedClient.full_name.charAt(0).toUpperCase() : 'U'}
                                        </span>
                                    )}
                                    <div
                                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer bg-black/40"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        {isUploadingAvatar ? <Loader2 className="h-5 w-5 text-white animate-spin" /> : <Upload className="h-5 w-5 text-white" />}
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleAvatarUpload}
                                        accept="image/png, image/jpeg, image/gif, image/webp"
                                        className="hidden"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">{selectedClient.full_name || 'Unknown'}</h3>
                                    <p className="text-white/60">{selectedClient.email}</p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <Label className="text-white/50 text-xs uppercase tracking-wider">Role:</Label>
                                        <Select
                                            value={selectedClient.role || 'User'}
                                            onValueChange={(newRole) => handleUpdateRole(selectedClient.id, newRole as 'Client' | 'Admin')}
                                            disabled={isUpdatingRole}
                                        >
                                            <SelectTrigger className={`w-[130px] h-7 text-xs ${selectedClient.role === 'Client' ? 'border-[#FFBF00] text-[#FFBF00]' :
                                                selectedClient.role === 'Admin' ? 'border-blue-500/50 text-blue-400' :
                                                    'border-white/20 text-white/70'
                                                } bg-transparent`}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-black border-white/10 text-white">
                                                <SelectItem value="Admin">Admin</SelectItem>
                                                <SelectItem value="Client">Client</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {isUpdatingRole && <Loader2 className="h-3 w-3 animate-spin text-white/50" />}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                <div>
                                    <Label className="text-white/50 text-xs uppercase tracking-wider">Instagram</Label>
                                    <div className="text-white mt-1 break-words bg-white/5 p-3 rounded-md border border-white/10">
                                        {selectedClient.instagram ? (
                                            <a href={selectedClient.instagram.startsWith('http') ? selectedClient.instagram : `https://instagram.com/${selectedClient.instagram}`} target="_blank" rel="noreferrer" className="text-[#FFBF00] hover:underline flex items-center">
                                                {selectedClient.instagram}
                                            </a>
                                        ) : (
                                            <span className="text-white/30 italic">Not provided</span>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-white/50 text-xs uppercase tracking-wider">LinkedIn</Label>
                                    <div className="text-white mt-1 break-words bg-white/5 p-3 rounded-md border border-white/10">
                                        {selectedClient.linkedin ? (
                                            <a href={selectedClient.linkedin.startsWith('http') ? selectedClient.linkedin : `https://linkedin.com/in/${selectedClient.linkedin}`} target="_blank" rel="noreferrer" className="text-[#FFBF00] hover:underline flex items-center">
                                                {selectedClient.linkedin}
                                            </a>
                                        ) : (
                                            <span className="text-white/30 italic">Not provided</span>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-white/50 text-xs uppercase tracking-wider">Company Website</Label>
                                    <div className="text-white mt-1 break-words bg-white/5 p-3 rounded-md border border-white/10">
                                        {selectedClient.company_website ? (
                                            <a href={selectedClient.company_website.startsWith('http') ? selectedClient.company_website : `https://${selectedClient.company_website}`} target="_blank" rel="noreferrer" className="text-[#FFBF00] hover:underline flex items-center">
                                                {selectedClient.company_website}
                                            </a>
                                        ) : (
                                            <span className="text-white/30 italic">Not provided</span>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-white/50 text-xs uppercase tracking-wider">Status</Label>
                                        <div className="text-white mt-1">
                                            <Badge variant="outline" className={`
                                                ${selectedClient.status === 'Active' ? 'border-green-500/50 text-green-400' : 'border-red-500/50 text-red-400'}
                                            `}>
                                                {selectedClient.status || 'Active'}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-white/50 text-xs uppercase tracking-wider">Joined Date</Label>
                                        <div className="text-white mt-1">
                                            {selectedClient.created_at ? new Date(selectedClient.created_at).toLocaleDateString() : 'N/A'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
