import { useState, useEffect } from "react";
import { Shield, Users, Package, Truck, TrendingUp, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "./DashboardLayout";
import { toast } from "sonner";

interface Stats {
  totalUsers: number;
  totalDonations: number;
  totalRequests: number;
  totalDeliveries: number;
  pendingRequests: number;
  completedDeliveries: number;
}

interface DonationDrive {
  id: string;
  title: string;
  category: string;
  goal_amount: number;
  current_amount: number;
  status: string;
  start_date: string;
  end_date: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalDonations: 0,
    totalRequests: 0,
    totalDeliveries: 0,
    pendingRequests: 0,
    completedDeliveries: 0,
  });
  const [drives, setDrives] = useState<DonationDrive[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchDrives();
  }, []);

  const fetchStats = async () => {
    try {
      const [donations, requests, deliveries] = await Promise.all([
        supabase.from("donations").select("id", { count: "exact" }),
        supabase.from("donation_requests").select("id, status", { count: "exact" }),
        supabase.from("deliveries").select("id, status", { count: "exact" }),
      ]);

      const pendingRequests = requests.data?.filter(r => r.status === "pending").length || 0;
      const completedDeliveries = deliveries.data?.filter(d => d.status === "delivered").length || 0;

      setStats({
        totalUsers: 0, // Would need profiles count
        totalDonations: donations.count || 0,
        totalRequests: requests.count || 0,
        totalDeliveries: deliveries.count || 0,
        pendingRequests,
        completedDeliveries,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDrives = async () => {
    try {
      const { data, error } = await supabase
        .from("donation_drives")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDrives(data || []);
    } catch (error) {
      console.error("Error fetching drives:", error);
    }
  };

  const updateDriveStatus = async (driveId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("donation_drives")
        .update({ status })
        .eq("id", driveId);

      if (error) throw error;
      toast.success(`Drive status updated to ${status}`);
      fetchDrives();
    } catch (error) {
      toast.error("Failed to update drive status");
    }
  };

  const statCards = [
    { label: "Total Donations", value: stats.totalDonations, icon: Package, color: "text-primary" },
    { label: "Total Requests", value: stats.totalRequests, icon: Users, color: "text-secondary" },
    { label: "Active Deliveries", value: stats.totalDeliveries, icon: Truck, color: "text-accent" },
    { label: "Pending Requests", value: stats.pendingRequests, icon: Clock, color: "text-yellow-500" },
    { label: "Completed Deliveries", value: stats.completedDeliveries, icon: CheckCircle, color: "text-green-500" },
  ];

  return (
    <DashboardLayout title="Admin Panel" icon={<Shield className="w-5 h-5" />}>
      <div className="space-y-8">
        {/* Stats Overview */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {statCards.map((stat, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    </div>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="drives" className="space-y-4">
          <TabsList>
            <TabsTrigger value="drives">Donation Drives</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="drives" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Manage Donation Drives</h3>
              <Button>
                <TrendingUp className="w-4 h-4 mr-2" />
                Create New Drive
              </Button>
            </div>

            {drives.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Donation Drives Yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first donation drive to get started</p>
                  <Button>Create Drive</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {drives.map((drive) => (
                  <Card key={drive.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{drive.title}</CardTitle>
                          <CardDescription>{drive.category}</CardDescription>
                        </div>
                        <Badge variant={drive.status === "active" ? "default" : "secondary"}>
                          {drive.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Progress: {drive.current_amount} / {drive.goal_amount}
                          </p>
                          <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${Math.min((drive.current_amount / drive.goal_amount) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {drive.status === "active" ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateDriveStatus(drive.id, "paused")}
                            >
                              Pause
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateDriveStatus(drive.id, "active")}
                            >
                              Activate
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Platform Analytics</CardTitle>
                <CardDescription>Track the performance of your donation platform</CardDescription>
              </CardHeader>
              <CardContent className="py-12 text-center">
                <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Analytics dashboard coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
