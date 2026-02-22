import { useState, useEffect } from "react";
import { Truck, Package, MapPin, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "./DashboardLayout";
import { toast } from "sonner";

interface Delivery {
  id: string;
  pickup_address: string;
  delivery_address: string;
  status: string;
  scheduled_date: string;
  notes: string;
  created_at: string;
  request_id: string;
}

interface PendingRequest {
  id: string;
  title: string;
  category: string;
  urgency: string;
  status: string;
  delivery_address: string;
  created_at: string;
}

const LogisticsDashboard = () => {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeliveries();
    fetchPendingRequests();
  }, [user]);

  const fetchDeliveries = async () => {
    try {
      const { data, error } = await supabase
        .from("deliveries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDeliveries(data || []);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const { data, error } = await supabase
        .from("donation_requests")
        .select("*")
        .in("status", ["approved", "pending"])
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPendingRequests(data || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const updateDeliveryStatus = async (deliveryId: string, status: string) => {
    try {
      const updates: Record<string, unknown> = { status };
      if (status === "delivered") {
        updates.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("deliveries")
        .update(updates)
        .eq("id", deliveryId);

      if (error) throw error;
      toast.success(`Delivery marked as ${status}`);
      fetchDeliveries();
    } catch (error) {
      toast.error("Failed to update delivery");
    }
  };

  const createDelivery = async (request: PendingRequest) => {
    if (!user) return;

    try {
      const { error } = await supabase.from("deliveries").insert({
        request_id: request.id,
        coordinator_id: user.id,
        delivery_address: request.delivery_address,
        status: "scheduled",
      });

      if (error) throw error;

      // Update request status
      await supabase
        .from("donation_requests")
        .update({ status: "in_transit" })
        .eq("id", request.id);

      toast.success("Delivery scheduled successfully!");
      fetchDeliveries();
      fetchPendingRequests();
    } catch (error) {
      toast.error("Failed to create delivery");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "scheduled":
        return <Badge className="bg-blue-500">Scheduled</Badge>;
      case "picked_up":
        return <Badge className="bg-yellow-500">Picked Up</Badge>;
      case "in_transit":
        return <Badge className="bg-purple-500">In Transit</Badge>;
      case "delivered":
        return <Badge className="bg-green-500">Delivered</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "emergency":
        return <Badge variant="destructive">Emergency</Badge>;
      case "high":
        return <Badge className="bg-orange-500">High</Badge>;
      default:
        return null;
    }
  };

  const stats = {
    total: deliveries.length,
    scheduled: deliveries.filter(d => d.status === "scheduled").length,
    inTransit: deliveries.filter(d => d.status === "in_transit" || d.status === "picked_up").length,
    completed: deliveries.filter(d => d.status === "delivered").length,
    pending: pendingRequests.length,
  };

  return (
    <DashboardLayout title="Logistics Dashboard" icon={<Truck className="w-5 h-5" />}>
      <div className="space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Package className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Deliveries</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-8 h-8 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Pending Requests</p>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Scheduled</p>
                  <p className="text-2xl font-bold">{stats.scheduled}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Truck className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">In Transit</p>
                  <p className="text-2xl font-bold">{stats.inTransit}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{stats.completed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="deliveries" className="space-y-4">
          <TabsList>
            <TabsTrigger value="deliveries">Active Deliveries</TabsTrigger>
            <TabsTrigger value="pending">
              Pending Requests
              {stats.pending > 0 && (
                <Badge variant="destructive" className="ml-2">{stats.pending}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="deliveries" className="space-y-4">
            <h2 className="text-2xl font-bold">Manage Deliveries</h2>

            {deliveries.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Truck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No deliveries yet</h3>
                  <p className="text-muted-foreground">Check pending requests to schedule deliveries</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {deliveries.map((delivery) => (
                  <Card key={delivery.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">Delivery #{delivery.id.slice(0, 8)}</CardTitle>
                          <CardDescription>
                            Created: {new Date(delivery.created_at).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        {getStatusBadge(delivery.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                          <div>
                            <p className="text-sm font-medium">Pickup</p>
                            <p className="text-sm text-muted-foreground">
                              {delivery.pickup_address || "To be confirmed"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-primary mt-1" />
                          <div>
                            <p className="text-sm font-medium">Delivery</p>
                            <p className="text-sm text-muted-foreground">
                              {delivery.delivery_address || "To be confirmed"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {delivery.status !== "delivered" && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Update status:</span>
                          <Select
                            value={delivery.status}
                            onValueChange={(value) => updateDeliveryStatus(delivery.id, value)}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="scheduled">Scheduled</SelectItem>
                              <SelectItem value="picked_up">Picked Up</SelectItem>
                              <SelectItem value="in_transit">In Transit</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <h2 className="text-2xl font-bold">Pending Requests</h2>

            {pendingRequests.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
                  <p className="text-muted-foreground">No pending requests at the moment</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {pendingRequests.map((request) => (
                  <Card key={request.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{request.title}</CardTitle>
                          <CardDescription>{request.category}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          {getUrgencyBadge(request.urgency)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start gap-2 mb-4">
                        <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                        <p className="text-sm text-muted-foreground">
                          {request.delivery_address || "No address provided"}
                        </p>
                      </div>
                      <Button className="w-full" onClick={() => createDelivery(request)}>
                        <Truck className="w-4 h-4 mr-2" />
                        Schedule Delivery
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default LogisticsDashboard;
