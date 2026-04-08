import React, { useState, useEffect } from "react";
import DashboardLayout from "./DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Package, Users, Truck, Plus, Shield, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { driveApi, statsApi } from "@/lib/api";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalRequests: 0,
    totalDeliveries: 0,
    pendingRequests: 0,
    completedDeliveries: 0,
  });
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Food",
    location: "",
    startDate: "",
    endDate: "",
    goalAmount: 0,
    imageUrl: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, drivesRes] = await Promise.all([
        statsApi.getOverview(),
        driveApi.getAll(),
      ]);
      setStats(statsRes.data);
      setDrives(drivesRes.data);
    } catch (error) {
      toast.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDrive = async (e) => {
    e.preventDefault();
    try {
      await driveApi.create(formData);
      toast.success("Donation drive created successfully!");
      setIsDialogOpen(false);
      fetchData();
      setFormData({
        title: "",
        description: "",
        category: "Food",
        location: "",
        startDate: "",
        endDate: "",
        goalAmount: 0,
        imageUrl: "",
      });
    } catch (error) {
      toast.error("Failed to create donation drive");
    }
  };

  const handleUpdateDriveStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "completed" : "active";
      await driveApi.update(id, { status: newStatus });
      toast.success(`Drive status updated to ${newStatus}`);
      fetchData();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteDrive = async (id) => {
    if (!window.confirm("Are you sure you want to delete this drive?")) return;
    try {
      await driveApi.delete(id);
      toast.success("Drive deleted successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete drive");
    }
  };

  const statCards = [
    { label: "Total Donations", value: stats.totalDonations, icon: Package, color: "text-primary" },
    { label: "Total Requests", value: stats.totalRequests, icon: AlertCircle, color: "text-secondary" },
    { label: "Active Deliveries", value: stats.totalDeliveries, icon: Truck, color: "text-accent" },
    { label: "Pending Requests", value: stats.pendingRequests, icon: Clock, color: "text-yellow-500" },
    { label: "Completed Deliveries", value: stats.completedDeliveries, icon: CheckCircle, color: "text-green-500" },
  ];

  return (
    <DashboardLayout title="Admin Control Center" icon={<Shield className="w-5 h-5" />}>
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {statCards.map((card, i) => (
            <Card key={i} className=" border-black hover:-translate-y-1 hover:shadow-none transition-all">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <div className="text-2xl font-bold text-black">{card.value}</div>
                <p className="text-xs text-muted-foreground">{card.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Manage Campaigns</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Drive
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create Donation Drive</DialogTitle>
                <DialogDescription>Set up a new campaign to collect essential items.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateDrive} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Drive Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      className="w-full h-10 px-3 py-2 bg-background border border-input rounded-none text-sm"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option>Food</option>
                      <option>Clothing</option>
                      <option>Medical</option>
                      <option>Education</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="goalAmount">Goal (Items)</Label>
                    <Input
                      id="goalAmount"
                      type="number"
                      value={formData.goalAmount}
                      onChange={(e) => setFormData({ ...formData, goalAmount: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">Create Campaign</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className=" border-black">
          <CardHeader>
            <CardTitle className="text-black">Active Donation Drives</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drives.map((drive) => (
                  <TableRow key={drive._id}>
                    <TableCell className="font-medium">{drive.title}</TableCell>
                    <TableCell>{drive.category}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-none overflow-hidden">
                          <div 
                            className="h-full bg-primary" 
                            style={{ width: `${Math.min(100, (drive.currentAmount / drive.goalAmount) * 100)}%` }} 
                          />
                        </div>
                        <span className="text-xs">{drive.currentAmount}/{drive.goalAmount}</span>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(drive.endDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={drive.status === "active" ? "default" : "secondary"}>
                        {drive.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleUpdateDriveStatus(drive._id, drive.status)}>
                          Toggle
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteDrive(drive._id)}>
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;