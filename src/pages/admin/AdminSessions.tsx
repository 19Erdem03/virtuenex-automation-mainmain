import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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
import { Loader2, Eye, Calendar, User, Server } from "lucide-react";

export function AdminSessions() {
    const [deployments, setDeployments] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    const [deploymentToDelete, setDeploymentToDelete] = useState<any | null>(null);
    const [isDeletingDeployment, setIsDeletingDeployment] = useState(false);

    const [deploymentToEdit, setDeploymentToEdit] = useState<any | null>(null);
    const [editDeploymentData, setEditDeploymentData] = useState({ system_type_id: '', status: '', capacity: '' });
    const [isUpdatingDeployment, setIsUpdatingDeployment] = useState(false);

    const [categoryToDelete, setCategoryToDelete] = useState<any | null>(null);
    const [isDeletingCategory, setIsDeletingCategory] = useState(false);

    const [categoryToEdit, setCategoryToEdit] = useState<any | null>(null);
    const [editCategoryData, setEditCategoryData] = useState({ name: '', description: '', capacity: '' });
    const [isUpdatingCategory, setIsUpdatingCategory] = useState(false);

    const [isCreatingCategory, setIsCreatingCategory] = useState(false);
    const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false);
    const [newCategory, setNewCategory] = useState({
        name: '',
        description: '',
        capacity: ''
    });

    const [clients, setClients] = useState<any[]>([]);
    const [isCreatingDeployment, setIsCreatingDeployment] = useState(false);
    const [isNewDeploymentOpen, setIsNewDeploymentOpen] = useState(false);
    const [newDeployment, setNewDeployment] = useState({
        client_id: '',
        system_type_id: '',
        capacity: ''
    });

    // View Modal State
    const [viewDeployment, setViewDeployment] = useState<any | null>(null);
    const [viewCategory, setViewCategory] = useState<any | null>(null);

    // Initial fetch (even if empty, sets up the pattern)
    const fetchData = async () => {
        setIsLoadingData(true);
        try {
            const [deploymentsRes, categoriesRes, clientsRes] = await Promise.all([
                supabase.from('system_deployments').select(`*, profiles(full_name), system_types(name)`),
                supabase.from('system_types').select('*'),
                supabase.from('profiles').select('*').neq('role', 'Admin').order('full_name')
            ]);

            if (deploymentsRes.error) throw deploymentsRes.error;
            if (categoriesRes.error) throw categoriesRes.error;
            if (clientsRes.error) throw clientsRes.error;

            setDeployments(deploymentsRes.data || []);
            setCategories(categoriesRes.data || []);
            setClients(clientsRes.data || []);
        } catch (error: any) {
            console.error("Error fetching sessions data:", error);
            toast.error("Failed to load sessions data");
        } finally {
            setIsLoadingData(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteDeployment = async () => {
        if (!deploymentToDelete) return;
        setIsDeletingDeployment(true);
        try {
            const { error } = await supabase
                .from('system_deployments')
                .delete()
                .eq('id', deploymentToDelete.id);

            if (error) throw error;
            toast.success("Deployment deleted successfully");
            setDeployments(prev => prev.filter(d => d.id !== deploymentToDelete.id));
        } catch (error: any) {
            console.error("Exception deleting deployment:", error);
            toast.error("Failed to delete deployment: " + error.message);
        } finally {
            setIsDeletingDeployment(false);
            setDeploymentToDelete(null);
        }
    };

    const handleDeleteCategory = async () => {
        if (!categoryToDelete) return;
        setIsDeletingCategory(true);
        try {
            const { error } = await supabase
                .from('system_types')
                .delete()
                .eq('id', categoryToDelete.id);

            if (error) throw error;
            toast.success("Category deleted successfully");
            setCategories(prev => prev.filter(c => c.id !== categoryToDelete.id));
        } catch (error: any) {
            console.error("Exception deleting category:", error);
            toast.error("Failed to delete category: " + error.message);
        } finally {
            setIsDeletingCategory(false);
            setCategoryToDelete(null);
        }
    };

    const handleCreateDeployment = async () => {
        if (!newDeployment.client_id || !newDeployment.system_type_id) {
            toast.error("Please select a client and a system type");
            return;
        }

        setIsCreatingDeployment(true);
        try {
            const { error } = await supabase
                .from('system_deployments')
                .insert([{
                    client_id: newDeployment.client_id,
                    system_type_id: newDeployment.system_type_id,
                    capacity: newDeployment.capacity ? parseInt(newDeployment.capacity) : null,
                    status: 'Planning',
                    start_date: new Date().toISOString()
                }]);

            if (error) throw error;

            toast.success("Deployment created successfully");
            setIsNewDeploymentOpen(false);
            setNewDeployment({ client_id: '', system_type_id: '', capacity: '' });
            fetchData(); // Refresh the list
        } catch (error: any) {
            console.error("Exception creating deployment:", error);
            toast.error("Failed to create deployment: " + error.message);
        } finally {
            setIsCreatingDeployment(false);
        }
    };

    const handleUpdateDeployment = async () => {
        if (!deploymentToEdit) return;

        setIsUpdatingDeployment(true);
        try {
            const { error } = await supabase
                .from('system_deployments')
                .update({
                    system_type_id: editDeploymentData.system_type_id,
                    status: editDeploymentData.status,
                    capacity: editDeploymentData.capacity ? parseInt(editDeploymentData.capacity) : null
                })
                .eq('id', deploymentToEdit.id);

            if (error) throw error;

            toast.success("Deployment updated successfully");
            setDeploymentToEdit(null);

            // If we are currently viewing this deployment, update its data in the view modal too
            if (viewDeployment && viewDeployment.id === deploymentToEdit.id) {
                const updatedDeployment = {
                    ...viewDeployment,
                    system_type_id: editDeploymentData.system_type_id,
                    status: editDeploymentData.status,
                    capacity: editDeploymentData.capacity ? parseInt(editDeploymentData.capacity) : null,
                    system_types: categories.find(c => c.id === editDeploymentData.system_type_id) || viewDeployment.system_types
                };
                setViewDeployment(updatedDeployment);
            }

            fetchData(); // Refresh the list
        } catch (error: any) {
            console.error("Exception updating deployment:", error);
            toast.error("Failed to update deployment: " + error.message);
        } finally {
            setIsUpdatingDeployment(false);
        }
    };

    const handleCreateCategory = async () => {
        if (!newCategory.name) {
            toast.error("Please enter a category name");
            return;
        }

        setIsCreatingCategory(true);
        try {
            const { error } = await supabase
                .from('system_types')
                .insert([{
                    name: newCategory.name,
                    description: newCategory.description || null
                }]);

            if (error) throw error;

            toast.success("Category created successfully");
            setIsNewCategoryOpen(false);
            setNewCategory({ name: '', description: '', capacity: '' });
            fetchData(); // Refresh list
        } catch (error: any) {
            console.error("Exception creating category:", error);
            toast.error("Failed to create category: " + error.message);
        } finally {
            setIsCreatingCategory(false);
        }
    };

    const handleUpdateCategory = async () => {
        if (!categoryToEdit || !editCategoryData.name) {
            toast.error("Please enter a category name");
            return;
        }

        setIsUpdatingCategory(true);
        try {
            const { error } = await supabase
                .from('system_types')
                .update({
                    name: editCategoryData.name,
                    description: editCategoryData.description || null,
                    capacity: editCategoryData.capacity ? parseInt(editCategoryData.capacity, 10) : null
                })
                .eq('id', categoryToEdit.id);

            if (error) throw error;

            toast.success("Category updated successfully");
            setCategoryToEdit(null);

            // If we are currently viewing this category, update its data in the view modal too
            if (viewCategory && viewCategory.id === categoryToEdit.id) {
                const updatedCategory = {
                    ...viewCategory,
                    name: editCategoryData.name,
                    description: editCategoryData.description,
                    capacity: editCategoryData.capacity ? parseInt(editCategoryData.capacity, 10) : null
                };
                setViewCategory(updatedCategory);
            }

            fetchData(); // Refresh list
        } catch (error: any) {
            console.error("Exception updating category:", error);
            toast.error("Failed to update category: " + error.message);
        } finally {
            setIsUpdatingCategory(false);
        }
    };

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
                        <Dialog open={isNewDeploymentOpen} onOpenChange={setIsNewDeploymentOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-[#FFBF00] text-black hover:bg-[#FFBF00]/90">
                                    New Deployment
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-black border border-white/10 text-white sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>New Deployment</DialogTitle>
                                    <DialogDescription className="text-white/60">
                                        Assign a system to a client and start a new session.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="client">Client</Label>
                                        <Select value={newDeployment.client_id} onValueChange={(val) => setNewDeployment({ ...newDeployment, client_id: val })}>
                                            <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                                <SelectValue placeholder="Select a client" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-black border-white/10 text-white">
                                                {clients.length === 0 ? (
                                                    <SelectItem value="none" disabled>No clients available</SelectItem>
                                                ) : (
                                                    clients.map(client => (
                                                        <SelectItem key={client.id} value={client.id}>{client.full_name || client.email}</SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="system">System Type</Label>
                                        <Select value={newDeployment.system_type_id} onValueChange={(val) => {
                                            const selectedCat = categories.find(c => c.id === val);
                                            setNewDeployment({ ...newDeployment, system_type_id: val, capacity: selectedCat?.capacity?.toString() || '' });
                                        }}>
                                            <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                                <SelectValue placeholder="Select system type" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-black border-white/10 text-white">
                                                {categories.length === 0 ? (
                                                    <SelectItem value="none" disabled>No system types available</SelectItem>
                                                ) : (
                                                    categories.map(category => (
                                                        <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {newDeployment.system_type_id && categories.find(c => c.id === newDeployment.system_type_id)?.description && (
                                        <div className="grid gap-2">
                                            <Label>Description</Label>
                                            <div className="text-sm text-white/70 p-3 bg-white/5 rounded-md border border-white/10">
                                                {categories.find(c => c.id === newDeployment.system_type_id)?.description}
                                            </div>
                                        </div>
                                    )}
                                    <div className="grid gap-2">
                                        <Label htmlFor="deployment-capacity">Capacity</Label>
                                        <Input
                                            id="deployment-capacity"
                                            type="number"
                                            value={newDeployment.capacity}
                                            onChange={(e) => setNewDeployment({ ...newDeployment, capacity: e.target.value })}
                                            className="bg-white/5 border-white/10 text-white"
                                            placeholder="e.g. 50"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button
                                        type="button"
                                        onClick={handleCreateDeployment}
                                        disabled={isCreatingDeployment}
                                        className="bg-[#FFBF00] text-black hover:bg-[#FFBF00]/90"
                                    >
                                        {isCreatingDeployment ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                        {isCreatingDeployment ? 'Deploying...' : 'Deploy System'}
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-white/10 hover:bg-transparent">
                                <TableHead className="text-white/70">Client</TableHead>
                                <TableHead className="text-white/70">System Type</TableHead>
                                <TableHead className="text-white/70">Description</TableHead>
                                <TableHead className="text-white/70">Capacity</TableHead>
                                <TableHead className="text-white/70">Status</TableHead>
                                <TableHead className="text-white/70">Start Date</TableHead>
                                <TableHead className="text-right text-white/70">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoadingData ? (
                                <TableRow className="border-white/10 hover:bg-transparent">
                                    <TableCell colSpan={7} className="text-center text-white/50 py-8">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-[#FFBF00]" />
                                        Loading deployments...
                                    </TableCell>
                                </TableRow>
                            ) : deployments.length === 0 ? (
                                <TableRow className="border-white/10 hover:bg-transparent">
                                    <TableCell colSpan={7} className="text-center text-white/50 py-8">
                                        No active sessions found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                deployments.map((deployment) => (
                                    <TableRow
                                        key={deployment.id}
                                        className="border-white/10 hover:bg-white/5 cursor-pointer"
                                        onClick={() => setViewDeployment(deployment)}
                                    >
                                        <TableCell className="font-medium text-white">{deployment.profiles?.full_name || 'Unknown'}</TableCell>
                                        <TableCell className="text-white/70">{deployment.system_types?.name || 'Unknown'}</TableCell>
                                        <TableCell className="text-white/70">{deployment.system_types?.description || 'N/A'}</TableCell>
                                        <TableCell className="text-white/70">{deployment.capacity !== null ? deployment.capacity : 'N/A'}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`
                      ${deployment.status === 'Active' ? 'border-green-500/50 text-green-400' : 'border-[#FFBF00]/50 text-[#FFBF00]'}
                    `}>
                                                {deployment.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-white/70">
                                            {deployment.start_date ? new Date(deployment.start_date).toLocaleDateString() : 'N/A'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-white/50 hover:text-white hover:bg-white/10"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setViewDeployment(deployment);
                                                }}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TabsContent>

                <TabsContent value="categories" className="mt-6 border border-white/10 rounded-md">
                    <div className="p-4 flex justify-end border-b border-white/10">
                        <Dialog open={isNewCategoryOpen} onOpenChange={setIsNewCategoryOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-[#FFBF00] text-black hover:bg-[#FFBF00]/90">
                                    Create Category
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-black border border-white/10 text-white sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Create Session Category</DialogTitle>
                                    <DialogDescription className="text-white/60">
                                        Define a new type of system offering for your clients.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="category-name">Category Name</Label>
                                        <Input
                                            id="category-name"
                                            placeholder="e.g. Lead Gen Bot"
                                            className="bg-white/5 border-white/10 text-white"
                                            value={newCategory.name}
                                            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="category-desc">Description</Label>
                                        <Input
                                            id="category-desc"
                                            placeholder="Brief description of the system"
                                            className="bg-white/5 border-white/10 text-white"
                                            value={newCategory.description}
                                            onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="category-capacity">Capacity</Label>
                                        <Input
                                            id="category-capacity"
                                            type="number"
                                            min="0"
                                            placeholder="Session capacity"
                                            className="bg-white/5 border-white/10 text-white"
                                            value={newCategory.capacity}
                                            onChange={(e) => setNewCategory({ ...newCategory, capacity: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button
                                        type="button"
                                        onClick={handleCreateCategory}
                                        disabled={isCreatingCategory}
                                        className="bg-[#FFBF00] text-black hover:bg-[#FFBF00]/90"
                                    >
                                        {isCreatingCategory ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                        {isCreatingCategory ? 'Saving...' : 'Save Category'}
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-white/10 hover:bg-transparent">
                                <TableHead className="text-white/70">Category Name</TableHead>
                                <TableHead className="text-white/70">Description</TableHead>
                                <TableHead className="text-white/70">Capacity</TableHead>
                                <TableHead className="text-white/70">Active Deployments</TableHead>
                                <TableHead className="text-right text-white/70">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoadingData ? (
                                <TableRow className="border-white/10 hover:bg-transparent">
                                    <TableCell colSpan={5} className="text-center text-white/50 py-8">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-[#FFBF00]" />
                                        Loading categories...
                                    </TableCell>
                                </TableRow>
                            ) : categories.length === 0 ? (
                                <TableRow className="border-white/10 hover:bg-transparent">
                                    <TableCell colSpan={5} className="text-center text-white/50 py-8">
                                        No session categories defined.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                categories.map((category) => (
                                    <TableRow
                                        key={category.id}
                                        className="border-white/10 hover:bg-white/5 cursor-pointer"
                                        onClick={() => setViewCategory(category)}
                                    >
                                        <TableCell className="font-medium text-white">{category.name}</TableCell>
                                        <TableCell className="text-white/70">{category.description}</TableCell>
                                        <TableCell className="text-white/70">{category.capacity || 'N/A'}</TableCell>
                                        <TableCell className="text-white/70">{
                                            deployments.filter(d => d.system_type_id === category.id).length
                                        }</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-white/50 hover:text-white hover:bg-white/10"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setViewCategory(category);
                                                }}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TabsContent>
            </Tabs>

            {/* Deployment Delete Confirmation */}
            <AlertDialog open={!!deploymentToDelete} onOpenChange={(open: boolean) => !open && setDeploymentToDelete(null)}>
                <AlertDialogContent className="bg-black border border-white/10 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Deployment</AlertDialogTitle>
                        <AlertDialogDescription className="text-white/60">
                            Are you sure you want to delete this deployment? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent border-white/10 text-white hover:bg-white/5 hover:text-white">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteDeployment}
                            className="bg-red-500 text-white hover:bg-red-600 focus:ring-red-500"
                            disabled={isDeletingDeployment}
                        >
                            {isDeletingDeployment ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {isDeletingDeployment ? 'Deleting...' : 'Delete Deployment'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Category Delete Confirmation */}
            <AlertDialog open={!!categoryToDelete} onOpenChange={(open: boolean) => !open && setCategoryToDelete(null)}>
                <AlertDialogContent className="bg-black border border-white/10 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Category</AlertDialogTitle>
                        <AlertDialogDescription className="text-white/60">
                            Are you sure you want to delete the <span className="font-semibold text-white">{categoryToDelete?.name}</span> category? This action cannot be undone and will fail if there are active deployments using this category.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent border-white/10 text-white hover:bg-white/5 hover:text-white">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteCategory}
                            className="bg-red-500 text-white hover:bg-red-600 focus:ring-red-500"
                            disabled={isDeletingCategory}
                        >
                            {isDeletingCategory ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {isDeletingCategory ? 'Deleting...' : 'Delete Category'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Edit Deployment Dialog */}
            <Dialog open={!!deploymentToEdit} onOpenChange={(open: boolean) => !open && setDeploymentToEdit(null)}>
                <DialogContent className="bg-black border border-white/10 text-white sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Manage Session</DialogTitle>
                        <DialogDescription className="text-white/60">
                            Update the details for this active session.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-system">System Type</Label>
                            <Select
                                value={editDeploymentData.system_type_id}
                                onValueChange={(val) => {
                                    const selectedCat = categories.find(c => c.id === val);
                                    setEditDeploymentData({ ...editDeploymentData, system_type_id: val, capacity: selectedCat?.capacity?.toString() || '' });
                                }}
                            >
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                    <SelectValue placeholder="Select system type" />
                                </SelectTrigger>
                                <SelectContent className="bg-black border-white/10 text-white">
                                    {categories.length === 0 ? (
                                        <SelectItem value="none" disabled>No system types available</SelectItem>
                                    ) : (
                                        categories.map(category => (
                                            <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        {editDeploymentData.system_type_id && categories.find(c => c.id === editDeploymentData.system_type_id)?.description && (
                            <div className="grid gap-2">
                                <Label>Description</Label>
                                <div className="text-sm text-white/70 p-3 bg-white/5 rounded-md border border-white/10">
                                    {categories.find(c => c.id === editDeploymentData.system_type_id)?.description}
                                </div>
                            </div>
                        )}
                        <div className="grid gap-2">
                            <Label htmlFor="edit-deployment-capacity">Capacity</Label>
                            <Input
                                id="edit-deployment-capacity"
                                type="number"
                                value={editDeploymentData.capacity}
                                onChange={(e) => setEditDeploymentData({ ...editDeploymentData, capacity: e.target.value })}
                                className="bg-white/5 border-white/10 text-white"
                                placeholder="e.g. 50"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-status">Status</Label>
                            <Select
                                value={editDeploymentData.status}
                                onValueChange={(val) => setEditDeploymentData({ ...editDeploymentData, status: val })}
                            >
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent className="bg-black border-white/10 text-white">
                                    <SelectItem value="Planning">Planning</SelectItem>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Paused">Paused</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeploymentToEdit(null)}
                            className="bg-transparent border-white/10 text-white hover:bg-white/5"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleUpdateDeployment}
                            disabled={isUpdatingDeployment}
                            className="bg-[#FFBF00] text-black hover:bg-[#FFBF00]/90"
                        >
                            {isUpdatingDeployment ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {isUpdatingDeployment ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Category Dialog */}
            <Dialog open={!!categoryToEdit} onOpenChange={(open: boolean) => !open && setCategoryToEdit(null)}>
                <DialogContent className="bg-black border border-white/10 text-white sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Session Category</DialogTitle>
                        <DialogDescription className="text-white/60">
                            Update the details for this session category.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-category-name">Category Name</Label>
                            <Input
                                id="edit-category-name"
                                placeholder="e.g. Lead Gen Bot"
                                className="bg-white/5 border-white/10 text-white"
                                value={editCategoryData.name}
                                onChange={(e) => setEditCategoryData({ ...editCategoryData, name: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-category-desc">Description</Label>
                            <Input
                                id="edit-category-desc"
                                placeholder="Brief description of the system"
                                className="bg-white/5 border-white/10 text-white"
                                value={editCategoryData.description}
                                onChange={(e) => setEditCategoryData({ ...editCategoryData, description: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-category-capacity">Capacity</Label>
                            <Input
                                id="edit-category-capacity"
                                type="number"
                                min="0"
                                placeholder="Session capacity"
                                className="bg-white/5 border-white/10 text-white"
                                value={editCategoryData.capacity}
                                onChange={(e) => setEditCategoryData({ ...editCategoryData, capacity: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setCategoryToEdit(null)}
                            className="bg-transparent border-white/10 text-white hover:bg-white/5"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleUpdateCategory}
                            disabled={isUpdatingCategory}
                            className="bg-[#FFBF00] text-black hover:bg-[#FFBF00]/90"
                        >
                            {isUpdatingCategory ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {isUpdatingCategory ? 'Saving...' : 'Save Category'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* View Deployment Dialog */}
            <Dialog open={!!viewDeployment} onOpenChange={(open: boolean) => !open && setViewDeployment(null)}>
                <DialogContent className="bg-[#111] border border-white/10 text-white sm:max-w-[500px] p-0 overflow-hidden">
                    {viewDeployment && (
                        <>
                            <div className="p-6 pb-4 border-b border-white/5 bg-black/40">
                                <div className="flex justify-between items-start mb-4">
                                    <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                                        Server Deployment
                                        <Badge variant="outline" className={`ml-2 
                                            ${viewDeployment.status === 'Active' ? 'border-green-500/50 text-green-400' : 'border-[#FFBF00]/50 text-[#FFBF00]'}
                                        `}>
                                            {viewDeployment.status}
                                        </Badge>
                                    </DialogTitle>
                                </div>
                                <div className="flex flex-col gap-1 text-sm text-white/60">
                                    <p>Deployed on {viewDeployment.start_date ? new Date(viewDeployment.start_date).toLocaleDateString() : 'N/A'}</p>
                                    <p className="text-xs text-white/40">ID: {viewDeployment.id}</p>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <Label className="text-white/50 text-xs uppercase tracking-wider mb-1 block">Client</Label>
                                            <div className="flex items-center gap-2 text-white">
                                                <User className="h-4 w-4 text-white/40" />
                                                <span className="font-medium">{viewDeployment.profiles?.full_name || 'Unknown User'}</span>
                                            </div>
                                        </div>

                                        <div>
                                            <Label className="text-white/50 text-xs uppercase tracking-wider mb-1 block">System Type</Label>
                                            <div className="flex items-center gap-2 text-white">
                                                <Server className="h-4 w-4 text-white/40" />
                                                <span>{viewDeployment.system_types?.name || 'Unknown System'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <Label className="text-white/50 text-xs uppercase tracking-wider mb-1 block">Start Date</Label>
                                            <div className="flex items-center gap-2 text-white">
                                                <Calendar className="h-4 w-4 text-white/40" />
                                                <span>{viewDeployment.start_date ? new Date(viewDeployment.start_date).toLocaleDateString() : 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 border-t border-white/10 bg-black/40 flex justify-between items-center">
                                <Button
                                    variant="ghost"
                                    className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                    onClick={() => {
                                        setDeploymentToDelete(viewDeployment);
                                        setViewDeployment(null);
                                    }}
                                >
                                    Delete
                                </Button>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setViewDeployment(null)}
                                        className="bg-transparent border-white/10 text-white hover:bg-white/5"
                                    >
                                        Close
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setDeploymentToEdit(viewDeployment);
                                            setEditDeploymentData({
                                                system_type_id: viewDeployment.system_type_id,
                                                status: viewDeployment.status,
                                                capacity: viewDeployment.capacity?.toString() || ''
                                            });
                                        }}
                                        className="bg-[#FFBF00] text-black hover:bg-[#FFBF00]/90"
                                    >
                                        Edit Deployment
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* View Category Dialog */}
            <Dialog open={!!viewCategory} onOpenChange={(open: boolean) => !open && setViewCategory(null)}>
                <DialogContent className="bg-[#111] border border-white/10 text-white sm:max-w-[500px] p-0 overflow-hidden">
                    {viewCategory && (
                        <>
                            <div className="p-6 pb-4 border-b border-white/5 bg-black/40">
                                <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                                    Session Category
                                </DialogTitle>
                                <div className="flex flex-col gap-1 text-sm text-white/60 mt-2">
                                    <p className="text-xs text-white/40">ID: {viewCategory.id}</p>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <Label className="text-white/50 text-xs uppercase tracking-wider mb-1 block">Category Name</Label>
                                        <div className="text-white font-medium text-lg">
                                            {viewCategory.name}
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-white/50 text-xs uppercase tracking-wider mb-1 block">Description</Label>
                                        <div className="text-white/80 bg-white/5 p-3 rounded-md">
                                            {viewCategory.description || 'No description provided.'}
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-white/50 text-xs uppercase tracking-wider mb-1 block">Usage</Label>
                                        <div className="flex items-center gap-2 text-white">
                                            <Server className="h-4 w-4 text-white/40" />
                                            <span>
                                                Currently used in <strong>{deployments.filter(d => d.system_type_id === viewCategory.id).length}</strong> active deployments
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 border-t border-white/10 bg-black/40 flex justify-between items-center">
                                <Button
                                    variant="ghost"
                                    className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                    onClick={() => {
                                        setCategoryToDelete(viewCategory);
                                        setViewCategory(null);
                                    }}
                                >
                                    Delete
                                </Button>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setViewCategory(null)}
                                        className="bg-transparent border-white/10 text-white hover:bg-white/5"
                                    >
                                        Close
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setCategoryToEdit(viewCategory);
                                            setEditCategoryData({
                                                name: viewCategory.name,
                                                description: viewCategory.description || '',
                                                capacity: viewCategory.capacity ? viewCategory.capacity.toString() : ''
                                            });
                                        }}
                                        className="bg-[#FFBF00] text-black hover:bg-[#FFBF00]/90"
                                    >
                                        Edit Category
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
