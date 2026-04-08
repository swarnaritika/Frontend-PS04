import React, { useState, useEffect } from "react";
import DashboardLayout from "./DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Truck, Package, MapPin, Clock, CheckCircle } from "lucide-react";
import { deliveryApi, requestApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const LogisticsDashboard = () => {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [delRes, reqRes] = await Promise.all([
        deliveryApi.getAll(),
        requestApi.getAll(),
      ]);
      setDeliveries(delRes.data.filter(d => d.coordinatorId === user.id || d.coordinatorId?._id === user.id));
      setPendingRequests(reqRes.data.filter(r => r.status === "pending"));
    } catch (error) {
      toast.error("Failed to fetch logistics data");
    } finally {
      setLoading(false);
    }
  };

  const updateDeliveryStatus = async (id, status) => {
    try {
      await deliveryApi.update(id, { status });
      toast.success(`Status updated to ${status.replace('_', ' ')}`);
      fetchData();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleAssignDelivery = async (request) => {
    try {
      await deliveryApi.create({
        requestId: request._id,
        coordinatorId: user.id,
        status: "scheduled",
        pickupAddress: "Central Warehouse", // Simplified
        deliveryAddress: request.deliveryAddress,
      });
      await requestApi.update(request._id, { status: "matched" });
      toast.success("Delivery assigned to you!");
      fetchData();
    } catch (error) {
      toast.error("Failed to assign delivery");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "scheduled": return <Badge variant="secondary">Scheduled</Badge>;
      case "in_transit": return <Badge className="bg-yellow-500">In Transit</Badge>;
      case "delivered": return <Badge className="bg-green-500">Delivered</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout title="Logistics Center" icon={<Truck className="w-5 h-5" />}>
      <div className="space-y-8">
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList>
            <TabsTrigger value="active">Your Deliveries</TabsTrigger>
            <TabsTrigger value="pending">Available Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6 mt-0">
            {loading ? (
              <div className="py-12 flex justify-center"><Clock className="animate-spin" /></div>
            ) : deliveries.length === 0 ? (
              <Card className="py-12 text-center  border-black">
                <p className="text-muted-foreground">You don't have any active deliveries.</p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {deliveries.map((delivery) => (
                  <Card key={delivery._id} className=" border-black hover:-translate-y-1 hover:shadow-none transition-all">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">Delivery #{delivery._id.slice(-6).toUpperCase()}</CardTitle>
                          <CardDescription>Request: {delivery.requestId?.title || "Donation Support"}</CardDescription>
                        </div>
                        {getStatusBadge(delivery.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="font-medium">Pickup</p>
                            <p className="text-muted-foreground">{delivery.pickupAddress}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-primary mt-0.5" />
                          <div>
                            <p className="font-medium">Delivery</p>
                            <p className="text-muted-foreground">{delivery.deliveryAddress}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {delivery.status === "scheduled" && (
                          <Button onClick={() => updateDeliveryStatus(delivery._id, "in_transit")}>
                            Mark In Transit
                          </Button>
                        )}
                        {delivery.status === "in_transit" && (
                          <Button className="bg-green-600 hover:bg-green-700" onClick={() => updateDeliveryStatus(delivery._id, "delivered")}>
                            Mark Delivered
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-6 mt-0">
            <div className="grid gap-4">
              {pendingRequests.map((request) => (
                <Card key={request._id} className=" border-black hover:-translate-y-1 hover:shadow-none transition-all">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{request.title}</CardTitle>
                        <CardDescription>{request.category} • Urgency: {request.urgency}</CardDescription>
                      </div>
                      <Button onClick={() => handleAssignDelivery(request)}>Assign to Me</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {request.deliveryAddress}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default LogisticsDashboard;