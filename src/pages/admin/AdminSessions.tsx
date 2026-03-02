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
import { Loader2, Eye, Calendar as CalendarIcon, User, Server, ChevronLeft, ChevronRight, SlidersHorizontal, List } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfMonth, endOfMonth, parseISO, addDays } from 'date-fns';
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export function AdminSessions() {
    const [deployments, setDeployments] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    const [deploymentToDelete, setDeploymentToDelete] = useState<any | null>(null);
    const [isDeletingDeployment, setIsDeletingDeployment] = useState(false);

    const [deploymentToEdit, setDeploymentToEdit] = useState<any | null>(null);
    const [editDeploymentData, setEditDeploymentData] = useState({
        system_type_id: '',
        status: '',
        capacity: '',
        title: '',
        description: '',
        start_time: '',
        duration: ''
    });
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
        capacity: '',
        title: '',
        description: '',
        date: new Date(),
        start_time: '09:00',
        duration: '60',
        is_recurring: false,
        recurring_type: 'count' as 'count' | 'end_date',
        recurring_count: '4',
        recurring_end_date: addDays(new Date(), 28)
    });

    // View Modal State
    const [viewDeployment, setViewDeployment] = useState<any | null>(null);
    const [viewCategory, setViewCategory] = useState<any | null>(null);

    const navigate = useNavigate();

    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [visibleColumns, setVisibleColumns] = useState({
        client: true,
        system: true,
        desc: true,
        capacity: true,
        status: true,
        start: true,
        actions: true,
    });

    const totalPages = Math.ceil(deployments.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedDeployments = deployments.slice(startIndex, startIndex + itemsPerPage);

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const renderCalendar = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const days = eachDayOfInterval({ start: startDate, end: endDate });

        return (
            <div className="border border-white/10 rounded-md overflow-hidden bg-black/20">
                <div className="grid grid-cols-7 border-b border-white/10 bg-white/5">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="py-2 text-center text-sm font-semibold text-white/70">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 auto-rows-fr">
                    {days.map((day, i) => {
                        const dayDeployments = deployments.filter(d => d.start_date && isSameDay(parseISO(d.start_date), day));
                        const isCurrentMonth = isSameMonth(day, monthStart);

                        return (
                            <div
                                key={day.toString()}
                                className={`min-h-[100px] p-2 border-r border-b border-white/5 ${isCurrentMonth ? 'bg-transparent' : 'bg-white/5 text-white/30'} ${i % 7 === 6 ? 'border-r-0' : ''}`}
                            >
                                <div className="text-right text-sm mb-1">{format(day, 'd')}</div>
                                <div className="space-y-1">
                                    {dayDeployments.map(dep => (
                                        <div
                                            key={dep.id}
                                            onClick={() => setViewDeployment(dep)}
                                            className="text-xs p-1 rounded bg-[#FFBF00]/10 text-[#FFBF00] border border-[#FFBF00]/20 truncate cursor-pointer hover:bg-[#FFBF00]/20 transition-colors"
                                        >
                                            {dep.profiles?.full_name || 'User'} - {dep.system_types?.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

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
            const hasConflict = (dateToCheck: Date, timeStr: string) => {
                const dateStr = format(dateToCheck, 'yyyy-MM-dd');
                return deployments.some(d =>
                    d.start_date && format(parseISO(d.start_date), 'yyyy-MM-dd') === dateStr &&
                    d.start_time && d.start_time.startsWith(timeStr)
                );
            };

            const payloads = [];
            const basePayload = {
                client_id: newDeployment.client_id,
                system_type_id: newDeployment.system_type_id,
                capacity: newDeployment.capacity ? parseInt(newDeployment.capacity) : null,
                status: 'Planning' as const,
                title: newDeployment.title || null,
                description: newDeployment.description || null,
                start_time: newDeployment.start_time ? newDeployment.start_time + ':00' : null,
                duration: newDeployment.duration ? parseInt(newDeployment.duration) : null,
            };

            if (newDeployment.is_recurring) {
                let current = new Date(newDeployment.date);
                let count = 0;
                const maxCount = newDeployment.recurring_type === 'count' ? parseInt(newDeployment.recurring_count) || 1 : 52;
                const endDate = newDeployment.recurring_type === 'end_date' ? newDeployment.recurring_end_date : null;

                while (count < maxCount) {
                    if (endDate && current > endDate) break;

                    if (hasConflict(current, newDeployment.start_time)) {
                        toast.error(`Conflict found on ${format(current, 'MMM d, yyyy')} at ${newDeployment.start_time}. Aborting partial creation.`);
                        setIsCreatingDeployment(false);
                        return;
                    }

                    // Adjust timezone offset correctly
                    const localDate = new Date(current.getTime() - current.getTimezoneOffset() * 60000).toISOString();

                    payloads.push({
                        ...basePayload,
                        start_date: localDate,
                    });

                    current = addDays(current, 7); // Weekly recurrence
                    count++;
                }
            } else {
                if (hasConflict(newDeployment.date, newDeployment.start_time)) {
                    toast.error(`Conflict found on ${format(newDeployment.date, 'MMM d, yyyy')} at ${newDeployment.start_time}.`);
                    setIsCreatingDeployment(false);
                    return;
                }
                const localDate = new Date(newDeployment.date.getTime() - newDeployment.date.getTimezoneOffset() * 60000).toISOString();
                payloads.push({
                    ...basePayload,
                    start_date: localDate,
                });
            }

            const { error } = await supabase
                .from('system_deployments')
                .insert(payloads);

            if (error) throw error;

            toast.success(`Successfully created ${payloads.length} deployment(s)`);
            setIsNewDeploymentOpen(false);
            setNewDeployment({
                client_id: '', system_type_id: '', capacity: '', title: '', description: '',
                date: new Date(), start_time: '09:00', duration: '60', is_recurring: false,
                recurring_type: 'count', recurring_count: '4', recurring_end_date: addDays(new Date(), 28)
            });
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
                    status: editDeploymentData.status as any,
                    capacity: editDeploymentData.capacity ? parseInt(editDeploymentData.capacity) : null,
                    title: editDeploymentData.title || null,
                    description: editDeploymentData.description || null,
                    start_time: editDeploymentData.start_time ? editDeploymentData.start_time + (editDeploymentData.start_time.length === 5 ? ':00' : '') : null,
                    duration: editDeploymentData.duration ? parseInt(editDeploymentData.duration) : null
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
                    title: editDeploymentData.title || null,
                    description: editDeploymentData.description || null,
                    start_time: editDeploymentData.start_time ? editDeploymentData.start_time + (editDeploymentData.start_time.length === 5 ? ':00' : '') : null,
                    duration: editDeploymentData.duration ? parseInt(editDeploymentData.duration) : null,
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
                    <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10">
                        <div className="flex items-center gap-2">
                            <Button
                                variant={viewMode === 'list' ? 'secondary' : 'outline'}
                                onClick={() => setViewMode('list')}
                                className={viewMode === 'list' ? 'bg-white/10 text-white border-transparent' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}
                                size="sm"
                            >
                                <List className="h-4 w-4 mr-2" />
                                List
                            </Button>
                            <Button
                                variant={viewMode === 'calendar' ? 'secondary' : 'outline'}
                                onClick={() => setViewMode('calendar')}
                                className={viewMode === 'calendar' ? 'bg-white/10 text-white border-transparent' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}
                                size="sm"
                            >
                                <CalendarIcon className="h-4 w-4 mr-2" />
                                Calendar
                            </Button>
                        </div>

                        {viewMode === 'calendar' && (
                            <div className="flex items-center gap-4 text-white">
                                <Button variant="outline" size="icon" onClick={prevMonth} className="h-8 w-8 bg-white/5 border-white/10 hover:bg-white/10">
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <span className="font-medium whitespace-nowrap min-w-[120px] text-center">
                                    {format(currentMonth, 'MMMM yyyy')}
                                </span>
                                <Button variant="outline" size="icon" onClick={nextMonth} className="h-8 w-8 bg-white/5 border-white/10 hover:bg-white/10">
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        )}

                        <div className="flex gap-2 w-full sm:w-auto">
                            {viewMode === 'list' && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="bg-white/5 border-white/10 text-white flex items-center gap-2">
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
                            )}

                            <Dialog open={isNewDeploymentOpen} onOpenChange={setIsNewDeploymentOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-[#FFBF00] text-black hover:bg-[#FFBF00]/90 w-full sm:w-auto">
                                        New Deployment
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-black border border-white/10 text-white sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>New Deployment</DialogTitle>
                                        <DialogDescription className="text-white/60">
                                            Assign a system to a client and start a new session.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-2 gap-4">
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
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="deployment-title">Title (Optional)</Label>
                                            <Input
                                                id="deployment-title"
                                                value={newDeployment.title}
                                                onChange={(e) => setNewDeployment({ ...newDeployment, title: e.target.value })}
                                                className="bg-white/5 border-white/10 text-white"
                                                placeholder="Custom session title"
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="deployment-desc">Description (Optional)</Label>
                                            <Input
                                                id="deployment-desc"
                                                value={newDeployment.description}
                                                onChange={(e) => setNewDeployment({ ...newDeployment, description: e.target.value })}
                                                className="bg-white/5 border-white/10 text-white"
                                                placeholder="Notes about this session"
                                            />
                                            {newDeployment.system_type_id && categories.find(c => c.id === newDeployment.system_type_id)?.description && (
                                                <p className="text-xs text-white/50">
                                                    System description: {categories.find(c => c.id === newDeployment.system_type_id)?.description}
                                                </p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="grid gap-2 flex-col">
                                                <Label>Start Date</Label>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "pl-3 text-left font-normal bg-white/5 border-white/10 text-white",
                                                                !newDeployment.date && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {newDeployment.date ? format(newDeployment.date, "PPP") : <span>Pick a date</span>}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={newDeployment.date}
                                                            onSelect={(date) => date && setNewDeployment({ ...newDeployment, date })}
                                                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="start-time">Start Time</Label>
                                                <Input
                                                    id="start-time"
                                                    type="time"
                                                    value={newDeployment.start_time}
                                                    onChange={(e) => setNewDeployment({ ...newDeployment, start_time: e.target.value })}
                                                    className="bg-white/5 border-white/10 text-white"
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="duration">Duration (min)</Label>
                                                <Input
                                                    id="duration"
                                                    type="number"
                                                    value={newDeployment.duration}
                                                    onChange={(e) => setNewDeployment({ ...newDeployment, duration: e.target.value })}
                                                    className="bg-white/5 border-white/10 text-white"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid gap-2 border-t border-white/10 pt-4 mt-2">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="is-recurring"
                                                    checked={newDeployment.is_recurring}
                                                    onCheckedChange={(checked) => setNewDeployment({ ...newDeployment, is_recurring: checked === true })}
                                                    className="border-white/20 data-[state=checked]:bg-[#FFBF00] data-[state=checked]:text-black"
                                                />
                                                <Label htmlFor="is-recurring" className="font-medium cursor-pointer">Make this a recurring session (Weekly)</Label>
                                            </div>

                                            {newDeployment.is_recurring && (
                                                <div className="grid gap-4 mt-2 p-3 bg-white/5 rounded-md border border-white/10">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="grid gap-2">
                                                            <Label>Repeat Options</Label>
                                                            <Select
                                                                value={newDeployment.recurring_type}
                                                                onValueChange={(val: 'count' | 'end_date') => setNewDeployment({ ...newDeployment, recurring_type: val })}
                                                            >
                                                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent className="bg-black border-white/10 text-white">
                                                                    <SelectItem value="count">Number of times</SelectItem>
                                                                    <SelectItem value="end_date">Until end date</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        {newDeployment.recurring_type === 'count' ? (
                                                            <div className="grid gap-2">
                                                                <Label htmlFor="recurring-count">Times to repeat</Label>
                                                                <Input
                                                                    id="recurring-count"
                                                                    type="number"
                                                                    min="1"
                                                                    max="52"
                                                                    value={newDeployment.recurring_count}
                                                                    onChange={(e) => setNewDeployment({ ...newDeployment, recurring_count: e.target.value })}
                                                                    className="bg-white/5 border-white/10 text-white"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="grid gap-2 flex-col">
                                                                <Label>Repeat Until</Label>
                                                                <Popover>
                                                                    <PopoverTrigger asChild>
                                                                        <Button
                                                                            variant={"outline"}
                                                                            className={cn(
                                                                                "pl-3 text-left font-normal bg-white/5 border-white/10 text-white",
                                                                                !newDeployment.recurring_end_date && "text-muted-foreground"
                                                                            )}
                                                                        >
                                                                            {newDeployment.recurring_end_date ? format(newDeployment.recurring_end_date, "PPP") : <span>Pick a date</span>}
                                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                        </Button>
                                                                    </PopoverTrigger>
                                                                    <PopoverContent className="w-auto p-0" align="start">
                                                                        <Calendar
                                                                            mode="single"
                                                                            selected={newDeployment.recurring_end_date}
                                                                            onSelect={(date) => date && setNewDeployment({ ...newDeployment, recurring_end_date: date })}
                                                                            disabled={(date) => date <= newDeployment.date}
                                                                            initialFocus
                                                                        />
                                                                    </PopoverContent>
                                                                </Popover>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

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
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setIsNewDeploymentOpen(false)}
                                            className="bg-transparent border-white/10 text-white hover:bg-white/5"
                                        >
                                            Cancel
                                        </Button>
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
                    </div>

                    {viewMode === 'calendar' ? (
                        <div className="p-4">
                            {renderCalendar()}
                        </div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/10 hover:bg-transparent">
                                        {visibleColumns.client && <TableHead className="text-white/70">Client</TableHead>}
                                        {visibleColumns.system && <TableHead className="text-white/70">System Type</TableHead>}
                                        {visibleColumns.desc && <TableHead className="text-white/70">Description</TableHead>}
                                        {visibleColumns.capacity && <TableHead className="text-white/70">Capacity</TableHead>}
                                        {visibleColumns.status && <TableHead className="text-white/70">Status</TableHead>}
                                        {visibleColumns.start && <TableHead className="text-white/70">Start Date</TableHead>}
                                        {visibleColumns.actions && <TableHead className="text-right text-white/70">Action</TableHead>}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoadingData ? (
                                        <TableRow className="border-white/10 hover:bg-transparent">
                                            <TableCell colSpan={Object.values(visibleColumns).filter(Boolean).length || 1} className="text-center text-white/50 py-8">
                                                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-[#FFBF00]" />
                                                Loading deployments...
                                            </TableCell>
                                        </TableRow>
                                    ) : deployments.length === 0 ? (
                                        <TableRow className="border-white/10 hover:bg-transparent">
                                            <TableCell colSpan={Object.values(visibleColumns).filter(Boolean).length || 1} className="text-center text-white/50 py-8">
                                                No active sessions found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        paginatedDeployments.map((deployment) => (
                                            <TableRow
                                                key={deployment.id}
                                                className="border-white/10 hover:bg-white/5 cursor-pointer"
                                                onClick={() => setViewDeployment(deployment)}
                                            >
                                                {visibleColumns.client && <TableCell className="font-medium text-white">{deployment.profiles?.full_name || 'Unknown'}</TableCell>}
                                                {visibleColumns.system && <TableCell className="text-white/70">{deployment.system_types?.name || 'Unknown'}</TableCell>}
                                                {visibleColumns.desc && <TableCell className="text-white/70">{deployment.system_types?.description || 'N/A'}</TableCell>}
                                                {visibleColumns.capacity && (
                                                    <TableCell className="text-[#FFBF00] hover:underline" onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/admin/bookings?clientId=${deployment.client_id}`);
                                                    }}>
                                                        {deployment.capacity !== null ? deployment.capacity : 'N/A'}
                                                    </TableCell>
                                                )}
                                                {visibleColumns.status && (
                                                    <TableCell>
                                                        <Badge variant="outline" className={`
                        ${deployment.status === 'Active' ? 'border-green-500/50 text-green-400' : 'border-[#FFBF00]/50 text-[#FFBF00]'}
                      `}>
                                                            {deployment.status}
                                                        </Badge>
                                                    </TableCell>
                                                )}
                                                {visibleColumns.start && (
                                                    <TableCell className="text-white/70">
                                                        {deployment.start_date ? new Date(deployment.start_date).toLocaleDateString() : 'N/A'}
                                                    </TableCell>
                                                )}
                                                {visibleColumns.actions && (
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
                                                )}
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>

                            {deployments.length > 0 && (
                                <div className="flex items-center justify-between p-4 border-t border-white/10 text-white/70 bg-white/5 rounded-b-md">
                                    <div className="flex items-center gap-4 text-sm">
                                        <span>
                                            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, deployments.length)} of {deployments.length} entries
                                        </span>
                                        <div className="flex items-center gap-2 border-l border-white/10 pl-4 hidden sm:flex">
                                            <span>Rows per page:</span>
                                            <Select value={itemsPerPage.toString()} onValueChange={(v) => setItemsPerPage(Number(v))}>
                                                <SelectTrigger className="w-[70px] h-8 bg-transparent border-white/10 text-white">
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
                                            className="bg-transparent border-white/10 text-white hover:bg-white/10 h-8 w-8"
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
                                            className="bg-transparent border-white/10 text-white hover:bg-white/10 h-8 w-8"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
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
                    <div className="grid gap-4 py-4 max-h-[80vh] overflow-y-auto">
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

                        <div className="grid gap-2">
                            <Label htmlFor="edit-title">Title (Optional)</Label>
                            <Input
                                id="edit-title"
                                value={editDeploymentData.title}
                                onChange={(e) => setEditDeploymentData({ ...editDeploymentData, title: e.target.value })}
                                className="bg-white/5 border-white/10 text-white"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-description">Description (Optional)</Label>
                            <Input
                                id="edit-description"
                                value={editDeploymentData.description}
                                onChange={(e) => setEditDeploymentData({ ...editDeploymentData, description: e.target.value })}
                                className="bg-white/5 border-white/10 text-white"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-start-time">Start Time</Label>
                                <Input
                                    id="edit-start-time"
                                    type="time"
                                    value={editDeploymentData.start_time}
                                    onChange={(e) => setEditDeploymentData({ ...editDeploymentData, start_time: e.target.value })}
                                    className="bg-white/5 border-white/10 text-white"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-duration">Duration (min)</Label>
                                <Input
                                    id="edit-duration"
                                    type="number"
                                    value={editDeploymentData.duration}
                                    onChange={(e) => setEditDeploymentData({ ...editDeploymentData, duration: e.target.value })}
                                    className="bg-white/5 border-white/10 text-white"
                                />
                            </div>
                        </div>

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
                                    <SelectItem value="Building">Building</SelectItem>
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
                                                <CalendarIcon className="h-4 w-4 text-white/40" />
                                                <span>{viewDeployment.start_date ? new Date(viewDeployment.start_date).toLocaleDateString() : 'N/A'}</span>
                                            </div>
                                        </div>

                                        <div>
                                            <Label className="text-white/50 text-xs uppercase tracking-wider mb-1 block">Capacity</Label>
                                            <div className="flex items-center gap-2 text-white">
                                                <Button
                                                    variant="outline"
                                                    className="bg-white/5 border-[#FFBF00]/30 text-[#FFBF00] hover:bg-[#FFBF00]/10 hover:text-[#FFBF00]"
                                                    onClick={() => navigate(`/admin/bookings?clientId=${viewDeployment.client_id}`)}
                                                >
                                                    {viewDeployment.capacity !== null ? viewDeployment.capacity : 'N/A'}
                                                    <Link className="h-3 w-3 ml-2" />
                                                </Button>
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
                                                capacity: viewDeployment.capacity?.toString() || '',
                                                title: viewDeployment.title || '',
                                                description: viewDeployment.description || '',
                                                start_time: viewDeployment.start_time ? viewDeployment.start_time.substring(0, 5) : '',
                                                duration: viewDeployment.duration?.toString() || ''
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
